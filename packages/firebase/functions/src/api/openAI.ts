import axios, { type AxiosResponse } from 'axios';
import { logger } from 'firebase-functions/v2';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';

export async function transcribeAudioFiles({
  apiKey,
  audioFilePaths,
  model,
  speed,
  splitSeconds,
}: {
  apiKey: string;
  audioFilePaths: string[];
  model: string;
  speed: number;
  splitSeconds: number;
}): Promise<{
  segments: {
    start: number;
    end: number;
    text: string;
  }[];
}> {
  const audioFileNum = audioFilePaths.length;

  const responses = await Promise.all(
    audioFilePaths.map((audioFilePath, index): Promise<AxiosResponse<any, any>> => {
      const formData = new FormData();
      formData.append('file', createReadStream(audioFilePath));
      formData.append('model', model);
      formData.append('response_format', 'verbose_json');
      formData.append(
        'prompt',
        `This is chunked podcast audio. This is file ${
          index + 1
        } out of ${audioFileNum}. Transcribe it not including filler words, includes punctuation.`,
      );

      return axios
        .post('https://api.openai.com/v1/audio/transcriptions', formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000,
        })
        .catch((e) => {
          // eslint-disable-next-line no-console -- fixme: functions.loggerにする
          console.log('transcribe', e);
          throw e;
        });
    }),
  );
  const segments: {
    start: number;
    end: number;
    text: string;
  }[] = [];

  let elapsedTime = 0;
  responses.forEach((response) => {
    response.data.segments.forEach((segment: any, index: number) => {
      segments.push({
        start: elapsedTime + segment.start * speed,
        end: elapsedTime + segment.end * speed,
        text: segment.text,
      });
      if (response.data.segments.length - 1 === index) {
        elapsedTime += splitSeconds * speed;
      }
    });
  });

  return {
    segments,
  };
}

function splitSegments(
  segments: { start: string; end: string; text: string }[],
  limitLength: number,
) {
  const originalSegments = segments;
  const splittedSegments: { start: string; end: string; text: string }[][] = [];
  originalSegments.forEach((segment) => {
    if (splittedSegments.length === 0) {
      splittedSegments.push([segment]);
      return;
    }
    const lastSplittedSegment = splittedSegments[splittedSegments.length - 1];
    const lastSplittedSegmentTotalTextLength = lastSplittedSegment.reduce((a, v) => {
      return a + v.text.length;
    }, 0);
    if (lastSplittedSegmentTotalTextLength + segment.text.length > limitLength) {
      splittedSegments.push([segment]);
    } else {
      lastSplittedSegment.push(segment);
      splittedSegments[splittedSegments.length - 1] = lastSplittedSegment;
    }
  });

  return splittedSegments;
}

export async function translateSegments({
  apiKey,
  segments,
  originalLanguage,
  targetLanguage,
}: {
  apiKey: string;
  segments: {
    start: string;
    end: string;
    text: string;
  }[];
  originalLanguage: string;
  targetLanguage: string;
}) {
  const splittedSegments =
    originalLanguage === 'English' ? splitSegments(segments, 3000) : splitSegments(segments, 3000);

  console.log('segments length: ', splittedSegments.length);

  const responses = await Promise.all(
    splittedSegments.map(async (segments): Promise<any> => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `Given the following transcription, please translate it into ${targetLanguage}.`,
              },
              {
                role: 'system',
                content: `Please provide the JSON output only.`,
              },
              {
                role: 'user',
                content: `${JSON.stringify(segments)}`,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000,
          },
        );
        return response;
      } catch (error) {
        console.log('error in request translate');
        console.log({ error });
        throw error;
      }
    }),
  );

  const results: { start: string; end: string; text: string }[] = [];
  responses.forEach((response) => {
    if (response.status !== 200) {
      throw new Error("response status isn't 200 in translate segments");
    }
    try {
      const responseJson: any = JSON.parse(response.data.choices[0].message.content);
      const arrangedData = responseJson.map((data: any) => ({
        start: data.start,
        end: data.end,
        text: data.text,
      }));
      results.push(...arrangedData);
    } catch (error) {
      logger.info('error while json formatting', {
        response: response.data.choices[0].message.content,
      });
      throw error;
    }
  });
  return results;
}
