import { firebase } from '@react-native-firebase/functions';

export const getEpisodeById = async (channelId: string, episodeId: string) => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getEpisodeById = functions.httpsCallable('getEpisodeById');
  const response = await getEpisodeById({ channelId, episodeId });
  const data: {
    id: string;
    title: string;
    description: string;
    url: string;
    content: string;
    duration: number;
    imageUrl: string;
    // pubDate: timestamp,
  } = response.data;
  return data;
};
