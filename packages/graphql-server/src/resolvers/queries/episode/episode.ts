import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { EPISODE_DOCUMENT_NAME } from '../../../constants.js';
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
    episode(episodeId: String!): Episode!
  }
`;

const resolver :QueryResolvers['episode'] = async (parent, args, context, info) => {
  const episodeId = args.episodeId;
  const episodeDoc = await firestore.collection(EPISODE_DOCUMENT_NAME).withConverter(episodeConverter).doc(episodeId).get();
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
