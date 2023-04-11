import axios, { type AxiosResponse } from 'axios';
import { logger } from 'firebase-functions/v2';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';

export async function transcribeAudioFiles({
  apiKey,
  audioFilePaths,
  model,
  speed,
}: {
  apiKey: string;
  audioFilePaths: string[];
  model: string;
  speed: number;
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
        `This is chunked audio. This is file ${
          index + 1
        } out of ${audioFileNum}. Transcribe it not including filler words, includes punctuation.`
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
    })
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
        const start = response.data.segments[0].start;
        const end = response.data.segments[response.data.segments.length - 1].end;
        elapsedTime += (end - start) * speed;
      }
    });
  });

  return {
    segments,
  };
}

export async function summarizeEpisode({
  apiKey,
  text,
  language,
}: {
  apiKey: string;
  text: string;
  language: string;
}) {
  const texts = text.length >= 3000 ? text.match(/.{3000}/g) : [text];
  if (texts === null) {
    return text;
  }
  const languagePrompt =
    language !== 'Emoji'
      ? `Please output in this language: ${language}`
      : 'Please use only emojis for output';
  let summary = '';
  for (const text of texts) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful text summary assistant. Make summary and introduction based on transcription. Please generate summary from the perspective of an outsider. It's best to make summary approximately 5 minutes long when read aloud.",
          },
          {
            role: 'system',
            content: `If a summary currently exists, please revise and add to it in order to create a summary. Current summary: ${summary}`,
          },
          {
            role: 'system',
            content:
              "If transcription is Podcast's, follow this guide to make summary: At First, please explain Who is speaking. At next, please explain What is the topic being discussed. At last, provide encouragement for listening to this episode.",
          },
          {
            role: 'system',
            content: languagePrompt,
          },
          {
            role: 'user',
            content: `${text}`,
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
      }
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const data = response.data;
    summary = data.choices[0].message.content;
  }

  return summary;
}

export async function translateToEmoji({ apiKey, text }: { apiKey: string; text: string }) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Just use emojis for reply. Do not use any text.',
        },
        {
          role: 'user',
          content: `Please express this content with only emojis. Do not use any text.  Content:${text}`,
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
    }
  );
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const data = response.data;
  return data.choices[0].message.content;
}

function splitArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Size must be a positive integer.');
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export async function extractTimestamps({
  apiKey,
  segments,
  language,
}: {
  apiKey: string;
  segments: {
    start: string;
    end: string;
    text: string;
  }[];
  language: string;
}) {
  const splitedSegments = splitArray(segments, 45);
  const responses = await Promise.all(
    splitedSegments.map(async (segments): Promise<any> => {
      return await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Given the following transcription, please analyze and extract the 2 most important topics discussed in it. Include the starting time for each topic in seconds with up to two decimal places. Present the output as an array of objects, where each object has keys 'start' and 'topic' without new lines. Write topic in ${language}. Output Example: [{"start": 0.0, "topic": "topic1"}, {"start": 10.0, "topic": "topic2"}]`,
            },
            {
              role: 'system',
              content: `Please provide the JSON output as specified, focusing on the 2 most important topics.`,
            },
            {
              role: 'user',
              content: `Here's the transcription:${JSON.stringify(segments)}`,
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
        }
      );
    })
  );

  const results: { start: 'string'; topic: string }[] = [];
  responses.forEach((response) => {
    if (response.status !== 200) {
      return;
    }
    try {
      // TODO: 文字列からparse可能な部分だけ抽出する関数を使い、事前にparse可能な文字列だけにしておくのもあり
      const responseJson: any = JSON.parse(response.data.choices[0].message.content);
      const arrangedData = responseJson.map((data: any) => ({
        start: data.start,
        topic: data.topic,
      }));
      results.push(...arrangedData);
    } catch (error) {
      logger.info('error while json formatting', {
        response: response.data.choices[0].message.content,
      });
    }
  });
  return results;
}
