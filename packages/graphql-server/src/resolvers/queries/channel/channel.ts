import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { GraphQLError } from 'graphql';
import { chanelDataLoader } from '../../../dataloader/channel';

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
    hasChangeableAd: Boolean!
  }
  extend type Query {
    channel(channelId: String!): Channel!
  }
`;

const resolver: QueryResolvers['channel'] = async (parent, args, context, info) => {
  const channelId = args.channelId;
  const channel = await chanelDataLoader.load(channelId);
  if (channel instanceof Error) {
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  return {
    ...channel,
  };
};

const resolvers: QueryResolvers = {
  channel: resolver,
};

export default {
  typeDefs,
  resolvers,
};
