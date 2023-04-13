import { firebase } from '@react-native-firebase/functions';
import { IEpisode } from '../Types/IEpisode';

export const getEpisodeByIds = async (channelId: string, episodeId: string) => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getEpisodeById = functions.httpsCallable('getEpisodeById');
  const response = await getEpisodeById({ channelId, episodeId });
  const data: IEpisode = {
    ...response.data,
    pubDate: new Date(response.data.pubDate._seconds * 1000),
  };
  return data;
};
