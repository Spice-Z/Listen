import type { FirestoreDataConverter } from 'firebase-admin/firestore';
import { getTotalSeconds } from '../../utils/duration.js';

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
  readonly pubDate: string,
  readonly season: string,
  readonly translatedTranscripts: {
    language: string,
    transcriptUrl: string
  }[]
  ) {}
}

interface EpisodeDbModel {
  id: string,
  title: string,
  description: string,
  url: string,
  transcriptUrl: string | undefined,
  imageUrl: string,
  content: string,
  duration: number,
  pubDate: string,
  season: string,
  translatedTranscripts: {
   [key: string]: string;
  } | undefined
}

export const episodeConverter:FirestoreDataConverter<Episode> = {
 toFirestore(episode: Episode): Omit<EpisodeDbModel,'id'> {
  const translatedTranscripts = episode.translatedTranscripts.reduce((acc, cur) => {
   acc[cur.language] = cur.transcriptUrl;
   return acc;
  }, {} as { [key: string]: string })
   return {
    title: episode.title,
    description: episode.description,
    url: episode.url,
    transcriptUrl: episode.transcriptUrl,
    imageUrl: episode.imageUrl,
    content: episode.content,
    duration: episode.duration,
    pubDate: episode.pubDate,
    season: episode.season,
    translatedTranscripts
   };
 },
 fromFirestore(
   snapshot,
 ): Episode {
   const data = snapshot.data() as EpisodeDbModel;
   console.log({data})
   const translatedTranscripts = data.translatedTranscripts === undefined ? [] : Object.keys(data.translatedTranscripts || {}).map((language) => {
    const translatedTranscripts = data.translatedTranscripts || {};
     return {
       language,
       transcriptUrl: translatedTranscripts[language],
     };
   });
   console.log({translatedTranscripts})
   const duration = getTotalSeconds(data.duration);
   return new Episode(
    snapshot.id,
    snapshot.id,
    data.title,
    data.description,
    data.url,
    data.transcriptUrl,
    data.imageUrl,
    data.content,
    duration,
    data.pubDate,
    data.season,
    translatedTranscripts
   );
 }
};
