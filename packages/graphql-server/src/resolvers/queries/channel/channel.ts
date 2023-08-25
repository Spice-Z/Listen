import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';
import { GraphQLError } from 'graphql';

const typeDefs = gql`
  type Channel {
    id: ID!
    channelId: String!
    title: String!
    imageUrl: String!
    description: String!
    author: String!
    categories: [String!]!
    language: String!
    copyRight: String!
  }
  extend type Query {
    channel(channelId: String!): Channel!
  }
`;

const resolver: QueryResolvers['channel'] = async (parent, args, context, info) => {
  const channelId = args.channelId;
  const channelDoc = await firestore
    .collection(CHANNEL_DOCUMENT_NAME)
    .withConverter(channelConverter)
    .doc(channelId)
    .get();
  if (!channelDoc.exists) {
    console.log({ channelDoc });
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  const channelData = channelDoc.data();
  if (channelData === undefined) {
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  return {
    ...channelData,
  };
};

const resolvers: QueryResolvers = {
  channel: resolver,
};

export default {
  typeDefs,
  resolvers,
};
