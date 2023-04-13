import { firebase } from '@react-native-firebase/functions';

export const getChannels = async () => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getChannels = functions.httpsCallable('getChannels');
  const response = await getChannels({});
  const data: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    author: string;
  }[] = response.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    description: item.description,
    author: item.author,
  }));
  return data;
};
