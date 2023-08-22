import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';

import { episodeConverter } from '../../../firebase/converters/episodeConverter.js';
import { GraphQLError } from 'graphql';


const typeDefs = gql`
  type Episode {
    id: ID!
    episodeId: String!
    title: String!
    description: String!
    url: String!
    transcriptUrl: String
    imageUrl: String!
    content: String!
    duration: Int!
    pubDate: String!
    # season: String!
    translatedTranscripts: [TranslatedTranscript!]!
  }
  type TranslatedTranscript {
    language: String!
    transcriptUrl: String!
  }

  extend type Query {
    episode(channelId: String!, episodeId: String!): Episode!
  }
`;

const resolver :QueryResolvers['episode'] = async (parent, args, context, info) => {
  const {channelId, episodeId} = args;
  // TODO: channel存在チェック
  const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
  console.log({episodeId})
  const episodeDoc = await channelRef.collection(EPISODE_DOCUMENT_NAME).withConverter(episodeConverter).doc(episodeId).get();
  console.log(episodeDoc)
  if (!episodeDoc.exists) {
    throw new GraphQLError("The requested episode does not exist.", {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  const episodeData = episodeDoc.data();

  if (episodeData === undefined) {
    throw new GraphQLError("The requested episode does not exist.", {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

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
