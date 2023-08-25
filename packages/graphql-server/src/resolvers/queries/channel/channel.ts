import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

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

const resolver :QueryResolvers['channel'] = async (parent, args, context, info) => {
  const channelId = args.channelId;
  const channelDoc = await firestore.collection(CHANNEL_DOCUMENT_NAME).withConverter(channelConverter).doc(channelId).get();
  console.log({channelDoc})
  if (!channelDoc.exists) {
    throw new Error('The requested channel does not exist.');
  }

  const channelData = channelDoc.data();
  console.log({channelData})
  if (channelData === undefined) {
    throw new Error('The requested channel does not exist.');
  }

  return {
    ...channelData
  }
}

const resolvers:QueryResolvers = {
  channel: resolver,
};


export default {
  typeDefs,
  resolvers
};
