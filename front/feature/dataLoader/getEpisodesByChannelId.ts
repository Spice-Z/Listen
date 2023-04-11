import { firebase } from '@react-native-firebase/functions';

export const getEpisodesByChannelId = async (channelId: string) => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getEpisodesByChannelId = functions.httpsCallable('getEpisodesByChannelId');
  const response = await getEpisodesByChannelId({ channelId });
  const data: {
    id: string;
    title: string;
    description: string;
    url: string;
    content: string;
    duration: number;
    imageUrl: string;
    transcriptUrl: string | undefined;
    // pubDate: timestamp,
  }[] = response.data;
  return data;
};
