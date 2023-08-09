import { firebase } from '@react-native-firebase/functions';

export const getChannelById = async (channelId: string) => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getChannelById = functions.httpsCallable('getChannelById');
  const response = await getChannelById({ id: channelId });
  const data: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    author: string;
  } = response.data;
  return data;
};
