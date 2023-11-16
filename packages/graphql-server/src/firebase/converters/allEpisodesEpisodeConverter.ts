import type { FirestoreDataConverter } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { getTotalSeconds } from '../../utils/duration.js';
import { removeLeadingAndTrailingNewlines } from '../../utils/string.js';
import { toGlobalId } from '../../utils/globalId.js';

export class AEEpisode {
  constructor(
    readonly id: string,
    readonly episodeId: string,
    readonly channelId: string,
    readonly title: string,
    readonly description: string,
    readonly url: string,
    readonly transcriptUrl: string | undefined,
    readonly imageUrl: string,
    readonly content: string,
    readonly duration: number,
    readonly pubDate: number,
    readonly season: string,
    readonly translatedTranscripts: {
      language: string;
      transcriptUrl: string;
    }[],
    readonly canDictation: boolean,
  ) {}
}

interface AEEpisodeDbModel {
  id: string;
  episodeId: string;
  channelId: string;
  title: string;
  description: string;
  url: string;
  transcriptUrl: string | undefined;
  imageUrl: string;
  content: string;
  duration: number;
  pubDate: Timestamp;
  season: string;
  translatedTranscripts:
    | {
        [key: string]: string;
      }
    | undefined;
  canDictation: boolean;
}

export const allEpisodesEpisodeConverter: FirestoreDataConverter<AEEpisode> = {
  toFirestore(episode: AEEpisode): Omit<AEEpisodeDbModel, 'id'> {
    const translatedTranscripts = episode.translatedTranscripts.reduce(
      (acc, cur) => {
        acc[cur.language] = cur.transcriptUrl;
        return acc;
      },
      {} as { [key: string]: string },
    );
    return {
      title: episode.title,
      episodeId: episode.episodeId,
      channelId: episode.channelId,
      description: episode.description,
      url: episode.url,
      transcriptUrl: episode.transcriptUrl,
      imageUrl: episode.imageUrl,
      content: episode.content,
      duration: episode.duration,
      pubDate: Timestamp.fromMillis(episode.pubDate * 1000),
      season: episode.season,
      translatedTranscripts,
      canDictation: episode.canDictation,
    };
  },
  fromFirestore(snapshot): AEEpisode {
    const data = snapshot.data() as AEEpisodeDbModel;
    const translatedTranscripts =
      data.translatedTranscripts === undefined
        ? []
        : Object.keys(data.translatedTranscripts || {}).map((language) => {
            const translatedTranscripts = data.translatedTranscripts || {};
            return {
              language,
              transcriptUrl: translatedTranscripts[language],
            };
          });
    const duration = getTotalSeconds(data.duration);
    return new AEEpisode(
      toGlobalId('Episode', snapshot.id),
      snapshot.id,
      data.channelId,
      removeLeadingAndTrailingNewlines(data.title),
      removeLeadingAndTrailingNewlines(data.description),
      data.url,
      data.transcriptUrl,
      data.imageUrl,
      data.content,
      duration,
      data.pubDate.seconds,
      data.season,
      translatedTranscripts,
      data.canDictation,
    );
  },
};
