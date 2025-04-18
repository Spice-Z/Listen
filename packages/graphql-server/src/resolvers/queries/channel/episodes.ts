import gql from 'graphql-tag';
import type { ChannelResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { firestore } from '../../../firebase/index.js';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { GraphQLError } from 'graphql';
import { episodeConverter } from '../../../firebase/converters/episodeConverter.js';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

const typeDefs = gql`
  extend type Channel {
    episodes(first: Int = 30, after: String, before: String, last: Int): EpisodeConnection!
  }
`;

const resolver: ChannelResolvers['episodes'] = async (parent, args, context, info) => {
  const channelId = parent.channelId;
  if (!channelId) {
    throw new GraphQLError('channelId is required');
  }
  const { first } = args;
  // TODO: dataloader,redis
  const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
  const channelData = (await channelRef.withConverter(channelConverter).get()).data();
  if (channelData === undefined) {
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  // TODO: ページング
  const snapshot = await channelRef
    .collection(EPISODE_DOCUMENT_NAME)
    .withConverter(episodeConverter)
    .orderBy('pubDate', 'desc')
    .limit(first)
    .get();

  const edges = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      cursor: doc.id,
      node: {
        ...data,
        hasChangeableAd: channelData.hasChangeableAd,
      },
    };
  });

  return {
    edges,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: edges[0].cursor,
      endCursor: edges[edges.length - 1].cursor,
    },
  };
};

const resolvers: Resolvers = {
  Channel: {
    episodes: resolver,
  },
};

export default {
  typeDefs,
  resolvers,
};
