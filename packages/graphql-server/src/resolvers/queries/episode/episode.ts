import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';

import { episodeConverter } from '../../../firebase/converters/episodeConverter.js';


const typeDefs = gql`
  type Episode {
    id: ID!
    episodeId: String!
    title: String!
    description: String!
    url: String!
    transcriptUrl: String!
    imageUrl: String!
    content: String!
    duration: Int!
    pubDate: String!
    # season: String!
    translatedTranscripts: [TranslatedTranscript!]!
  }
  type TranslatedTranscript {
    language: String!
    transcript: String!
  }

  extend type Query {
    episode(channelId: String!, episodeId: String!): Episode!
  }
`;

const resolver :QueryResolvers['episode'] = async (parent, args, context, info) => {
  console.log('resolver')
  const {channelId, episodeId} = args;
  const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
  // TODO: channel存在チェック
  console.log({episodeId})
  const aaa = await channelRef.collection(EPISODE_DOCUMENT_NAME).doc(episodeId).get();
  console.log({aaa})
  const episodeDoc = await channelRef.collection(EPISODE_DOCUMENT_NAME).withConverter(episodeConverter).doc(episodeId).get();
  console.log({episodeDoc})
  if (!episodeDoc.exists) {
    throw new Error('The requested episode does not exist.');
  }
  const episodeData = episodeDoc.data();

  if (episodeData === undefined) {
    throw new Error('The requested channel does not exist.');
  }

  console.log({episodeData})
  
  const episode = {
    ...episodeData
  };
  return episode;
}

const resolvers:QueryResolvers = {
    episode: resolver,
};


export default {
  typeDefs,
  resolvers
};
