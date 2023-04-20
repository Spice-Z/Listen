import { Timestamp } from 'firebase-admin/firestore';

export type IEpisode = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  content: string;
  duration: number;
  pubDate: Timestamp;
  season: any;
  episode: any;
  transcriptUrl: string;
  translatedTranscripts: {
    [key: string]: string;
  };
};
