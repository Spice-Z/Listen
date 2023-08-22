import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';
import { removeLeadingAndTrailingNewlines } from '../../../utils/string';

const typeDefs = gql`
  type Channel {
    id: ID!
    channelId: String!
    title: String!
    imageUrl: String!
    description: String!
    author: String!
    categories: [String!]!
    categoriesWithSubs: [String!]!
    language: String!
    copyRight: String!
  }
  extend type Query {
    channel(channelId: String!): Channel!
  }
`;

const resolver :QueryResolvers['channel'] = async (parent, args, context, info) => {
  const channelId = args.channelId;
  const channelDoc = await firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId).get();
  if (!channelDoc.exists) {
    throw new Error('The requested channel does not exist.');
  }

  const channelData = channelDoc.data();

  if (channelData === undefined) {
    throw new Error('The requested channel does not exist.');
  }

  return {
    id: channelDoc.id,
    channelId: channelDoc.id,
    title: removeLeadingAndTrailingNewlines(channelData.title),
    imageUrl: channelData.imageUrl,
    description: removeLeadingAndTrailingNewlines(channelData.description),
    author: channelData.author,
    categories: channelData.categories,
    categoriesWithSubs: channelData.categoriesWithSubs,
    language: channelData.language,
    copyright: channelData.copyright,
  }
}

const resolvers:QueryResolvers = {
  channel: resolver,
};


export default {
  typeDefs,
  resolvers
};
