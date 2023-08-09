export type IEpisode = {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  duration: number;
  imageUrl: string;
  transcriptUrl: string | undefined;
  translatedTranscripts: {
    [key: string]: string;
  };
  pubDate: Date;
};
