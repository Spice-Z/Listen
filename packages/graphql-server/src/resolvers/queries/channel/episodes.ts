import gql from 'graphql-tag';
import type { ChannelResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { firestore } from '../../../firebase/index.js';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { GraphQLError } from 'graphql';
import { episodeConverter } from '../../../firebase/converters/episodeConverter.js';

const typeDefs = gql`
  type EpisodeEdge {
    cursor: String!
    node: Episode!
  }
  type EpisodeConnection {
    edges: [EpisodeEdge!]!
    pageInfo: PageInfo!
  }
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
  // TODO: channel存在チェック
  const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
  // TODO: ページング
  const snapshot = await channelRef
    .collection(EPISODE_DOCUMENT_NAME)
    .withConverter(episodeConverter)
    .limit(first)
    .get();

  const edges = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      cursor: doc.id,
      node: {
        ...data,
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
