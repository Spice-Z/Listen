import { firebase } from '@react-native-firebase/functions';
import { IEpisode } from '../Types/IEpisode';

export const getEpisodesByChannelId = async (channelId: string) => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getEpisodesByChannelId = functions.httpsCallable('getEpisodesByChannelId');
  const response = await getEpisodesByChannelId({ channelId });
  const data: IEpisode[] = response.data.map((item) => ({
    ...item,
    pubDate: new Date(item.pubDate._seconds * 1000),
  }));
  return data;
};
