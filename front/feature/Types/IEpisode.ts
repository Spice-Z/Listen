export type IEpisode = {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  duration: number;
  imageUrl: string;
  transcriptUrl: string | undefined;
  pubDate: Date;
};
