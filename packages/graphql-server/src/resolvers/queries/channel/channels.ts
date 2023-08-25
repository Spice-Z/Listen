import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { firestore } from '../../../firebase/index.js';
import { CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

const typeDefs = gql`
  type ChannelEdge {
    cursor: String!
    node: Channel!
  }
  type ChannelConnection {
    edges: [ChannelEdge!]!
    pageInfo: PageInfo!
  }
  extend type Query {
    channels(first: Int = 30, after: String, before: String, last: Int): ChannelConnection!
  }
`;

const resolver: QueryResolvers['channels'] = async (parent, args, context, info) => {
  const { first } = args;
  const snapshot = await firestore
    .collection(CHANNEL_DOCUMENT_NAME)
    .withConverter(channelConverter)
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

const resolvers: QueryResolvers = {
  channels: resolver,
};

export default {
  typeDefs,
  resolvers,
};
