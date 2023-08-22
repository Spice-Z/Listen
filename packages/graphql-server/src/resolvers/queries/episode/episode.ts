import gql from 'graphql-tag';
import type { QueryResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase.js';

import { getTotalSeconds } from '../../../utils/duration';


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
  const episodeDoc = await firestore.collection(EPISODE_DOCUMENT_NAME).doc(episodeId).get();
  if (!episodeDoc.exists) {
    throw new Error('The requested episode does not exist.');
  }

  const episodeData = episodeDoc.data();

  if (episodeData === undefined) {
    throw new Error('The requested channel does not exist.');
  }
  
  const translatedTranscripts = Object.keys(episodeData.translatedTranscripts || {}).map((language) => {
    return {
      language,
      transcript: episodeData.translatedTranscripts[language],
    };
  });
  const episode = {
    id: episodeDoc.id,
    episodeId: episodeDoc.id,
    title: episodeData.title,
    description: episodeData.description,
    url: episodeData.url,
    transcriptUrl: episodeData.transcriptUrl,
    imageUrl: episodeData.imageUrl,
    content: episodeData.content,
    duration: getTotalSeconds(episodeData.duration),
    pubDate: episodeData.pubDate,
    season: episodeData.season,
    translatedTranscripts,
  };
  return episode;
}

const resolvers:Resolvers = {
  Query: {
    episode: resolver,
  },
};


export default {
  typeDefs,
  resolvers
};
