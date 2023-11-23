// import DataLoader from 'dataloader';

import DataLoader from 'dataloader';
import { CHANNEL_DOCUMENT_NAME } from '../constants.js';
import type { Channel } from '../firebase/converters/channelConverter.js';
import { channelConverter } from '../firebase/converters/channelConverter.js';
import { firestore } from '../firebase/index.js';

async function batchChannelsByChannelIds(channelIds: readonly string[]) {
  const channels = await Promise.all(
    channelIds.map(async (channelId) => {
      const channelDoc = await firestore
        .collection(CHANNEL_DOCUMENT_NAME)
        .withConverter(channelConverter)
        .doc(channelId)
        .get();
      if (!channelDoc.exists) {
        return undefined;
      }
      return channelDoc.data();
    }),
  );

  return channelIds.map((channelId) => {
    const chanel = channels.find((channel) => channel?.channelId === channelId);
    if (chanel === undefined) {
      return new Error('The requested channel does not exist.');
    }
    return chanel;
  });
}

export const chanelDataLoader = new DataLoader<string, Channel | Error>(batchChannelsByChannelIds);
