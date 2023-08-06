import { firebase } from '@react-native-firebase/functions';
import { IEpisode } from '../Types/IEpisode';
import { getTotalSeconds } from '../format/duration';

export const getEpisodesOfAvailable = async () => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getAvailableEpisodes = functions.httpsCallable('getAvailableEpisodes');
  const response = await getAvailableEpisodes();
  const episodes: IEpisode[] = response.data.episodes.map((item) => ({
    ...item,
    duration: getTotalSeconds(item.duration),
    pubDate: new Date(item.pubDate._seconds * 1000),
  }));
  const episodesChannelIds: { [key: string]: string } = response.data.episodesChannelIds;
  return {
    episodes,
    episodesChannelIds,
  };
};
