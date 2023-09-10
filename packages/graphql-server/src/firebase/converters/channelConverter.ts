import type { FirestoreDataConverter } from 'firebase-admin/firestore';
import { removeLeadingAndTrailingNewlines } from '../../utils/string.js';
import { toGlobalId } from '../../utils/globalId.js';

class Channel {
  constructor(
    readonly id: string,
    readonly channelId: string,
    readonly title: string,
    readonly imageUrl: string,
    readonly description: string,
    readonly author: string,
    readonly categories: string[],
    readonly categoriesWithSubs: {
      name: string;
      subs?: {
        name: string;
      }[];
    }[],
    readonly language: string,
    readonly copyright: string,
    readonly hasChangeableAd: boolean,
  ) {}
}

interface ChannelDbModel {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  categories: string[];
  categoriesWithSubs: {
    name: string;
    subs?: {
      name: string;
    }[];
  }[];
  language: string;
  copyright: string;
  hasChangeableAd: boolean;
}

export const channelConverter: FirestoreDataConverter<Channel> = {
  toFirestore(channel: Channel): Omit<ChannelDbModel, 'id'> {
    return {
      title: channel.title,
      imageUrl: channel.imageUrl,
      description: channel.description,
      author: channel.author,
      categories: channel.categories,
      categoriesWithSubs: channel.categoriesWithSubs,
      language: channel.language,
      copyright: channel.copyright,
      hasChangeableAd: channel.hasChangeableAd,
    };
  },
  fromFirestore(snapshot): Channel {
    const data = snapshot.data() as ChannelDbModel;
    return new Channel(
      toGlobalId('Channel', snapshot.id),
      snapshot.id,
      removeLeadingAndTrailingNewlines(data.title),
      data.imageUrl,
      removeLeadingAndTrailingNewlines(data.description),
      data.author,
      data.categories,
      data.categoriesWithSubs,
      data.language,
      data.copyright,
      data.hasChangeableAd,
    );
  },
};
