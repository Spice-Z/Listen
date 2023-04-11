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
    transcriptUrl: string | undefined;
    // pubDate: timestamp,
  } = response.data;
  console.log(
    response.data.pubDate ? new Date(response.data.pubDate._seconds * 1000) : 'no pubDate'
  );
  return data;
};
