import gql from 'graphql-tag';
import type { QueryResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase.js';

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
  console.log('channelId', channelId)
  const channelDoc = await firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId).get();
console.log('channelDoc')
  if (!channelDoc.exists) {
    throw new Error('The requested channel does not exist.');
  }

  const channelData = channelDoc.data();

  if (channelData === undefined) {
    throw new Error('The requested channel does not exist.');
  }

  return {
    id: channelData.id,
    channelId: channelData.channelId,
    title: channelData.title,
    imageUrl: channelData.imageUrl,
    description: channelData.description,
    author: channelData.author,
    categories: channelData.categories,
    categoriesWithSubs: channelData.categoriesWithSubs,
    language: channelData.language,
    copyright: channelData.copyright,
  }
}

const resolvers:Resolvers = {
  Query: {
    channel: resolver,
  },
};


export default {
  typeDefs,
  resolvers
};
