import type { FirestoreDataConverter } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { getTotalSeconds } from '../../utils/duration.js';
import { removeLeadingAndTrailingNewlines } from '../../utils/string.js';
import { toGlobalId } from '../../utils/globalId.js';

class Episode {
  constructor(
    readonly id: string,
    readonly episodeId: string,
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
    readonly canDirection: boolean,
  ) {}
}

interface EpisodeDbModel {
  id: string;
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
  canDirection: boolean;
}

export const episodeConverter: FirestoreDataConverter<Episode> = {
  toFirestore(episode: Episode): Omit<EpisodeDbModel, 'id'> {
    const translatedTranscripts = episode.translatedTranscripts.reduce(
      (acc, cur) => {
        acc[cur.language] = cur.transcriptUrl;
        return acc;
      },
      {} as { [key: string]: string },
    );
    return {
      title: episode.title,
      description: episode.description,
      url: episode.url,
      transcriptUrl: episode.transcriptUrl,
      imageUrl: episode.imageUrl,
      content: episode.content,
      duration: episode.duration,
      pubDate: Timestamp.fromMillis(episode.pubDate * 1000),
      season: episode.season,
      translatedTranscripts,
      canDirection: episode.canDirection,
    };
  },
  fromFirestore(snapshot): Episode {
    const data = snapshot.data() as EpisodeDbModel;
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
    return new Episode(
      toGlobalId('Episode', snapshot.id),
      snapshot.id,
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
      data.canDirection,
    );
  },
};
