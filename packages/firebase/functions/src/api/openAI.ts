import axios from 'axios';
import { logger } from 'firebase-functions/v2';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import pLimit from 'p-limit';

export async function transcribeAudioFiles({
  apiKey,
  audioFilePaths,
  model,
  speed,
  splitSeconds,
  channelName,
  episodeName,
  episodeDescription,
  includeInfoInPrompt,
}: {
  apiKey: string;
  audioFilePaths: string[];
  model: string;
  speed: number;
  splitSeconds: number;
  channelName: string;
  episodeName: string;
  episodeDescription: string;
  includeInfoInPrompt: boolean;
}): Promise<{
  segments: {
    start: number;
    end: number;
    text: string;
  }[];
}> {
  const defaultPrompt = `${channelName}: ${episodeName}. ${episodeDescription}`;

  const segments: {
    start: number;
    end: number;
    text: string;
  }[] = [];
  let elapsedTime = 0;

  for (let index = 0; index < audioFilePaths.length; index++) {
    const isFirstAudio = index === 0;
    const audioFilePath = audioFilePaths[index];
    const previousText = segments.map((segment) => segment.text).join(' ');
    const prompt = isFirstAudio ? defaultPrompt : previousText.slice(-1000);
    const formData = new FormData();
    formData.append('file', createReadStream(audioFilePath));
    formData.append('model', model);
    formData.append('response_format', 'verbose_json');
    if (includeInfoInPrompt || !isFirstAudio) {
      formData.append('prompt', prompt);
    }

    const response = await axios
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
  }

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

type Segment = {
  start: string;
  end: string;
  text: string;
};

export async function translateSegmentsByEach({
  apiKey,
  segments,
  originalLanguage,
  targetLanguage,
}: {
  apiKey: string;
  segments: Segment[];
  originalLanguage: string;
  targetLanguage: string;
}) {
  // 3つ分のセグメントをまとめたもの
  const targetSegmentsList: {
    start: string;
    end: string;
    text: string;
  }[][] = [];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    if (targetSegmentsList.length === 0) {
      targetSegmentsList.push([segment]);
      continue;
    }
    const lastTargetSegment = targetSegmentsList[targetSegmentsList.length - 1];
    if (lastTargetSegment.length === 3) {
      targetSegmentsList.push([segment]);
      continue;
    }
    targetSegmentsList[targetSegmentsList.length - 1].push(segment);
  }

  const limit = pLimit(10);
  const promises = targetSegmentsList.map((targetSegments) =>
    limit(() =>
      _askTranslateSegments({
        apiKey,
        targetSegments,
        originalLanguage,
        targetLanguage,
      }),
    ),
  );
  const results = await Promise.all(promises);

  return results;
}

const _askTranslateSegments = async ({
  apiKey,
  targetSegments,
  originalLanguage,
  targetLanguage,
}: {
  apiKey: string;
  targetSegments: Segment[];
  originalLanguage: string;
  targetLanguage: string;
}): Promise<Segment> => {
  const text = targetSegments.map((segment) => segment.text).join(' ');
  console.log('ask:', text);
  const messages = [
    {
      role: 'system',
      content: `You will be provided with a part of podcast transcription in ${originalLanguage}, and your task is to translate it into ${targetLanguage}.`,
    },
    {
      role: 'user',
      content: text,
    },
  ];
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
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
    if (response.status !== 200) {
      throw new Error("response status isn't 200");
    }
    const returnContent: string = response.data.choices[0].message.content;
    return {
      start: targetSegments[0].start,
      text: returnContent,
      end: targetSegments[targetSegments.length - 1].end,
    };
  } catch (error) {
    console.log('error in request translate');
    console.log({ error });
    // APIに失敗した場合は原文をそのまま返す
    return {
      start: targetSegments[0].start,
      text,
      end: targetSegments[targetSegments.length - 1].end,
    };
  }
};

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
    originalLanguage === 'English' ? splitSegments(segments, 8000) : splitSegments(segments, 5000);
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
