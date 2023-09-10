import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../../generated/resolvers-types';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../../../constants.js';
import { firestore } from '../../../firebase/index.js';

import { episodeConverter } from '../../../firebase/converters/episodeConverter.js';
import { GraphQLError } from 'graphql';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

const typeDefs = gql`
  type Episode implements Node {
    id: ID!
    episodeId: String!
    title: String!
    description: String!
    url: String!
    transcriptUrl: String
    imageUrl: String!
    content: String!
    duration: Int!
    # UnixTimeで返す
    pubDate: Float!
    # season: String!
    translatedTranscripts: [TranslatedTranscript!]!
    hasChangeableAd: Boolean!
  }
  type TranslatedTranscript {
    language: String!
    transcriptUrl: String!
  }

  extend type Query {
    episode(channelId: String!, episodeId: String!): Episode!
  }
`;

const resolver: QueryResolvers['episode'] = async (parent, args, context, info) => {
  const { channelId, episodeId } = args;
  const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
  const channelData = (await channelRef.withConverter(channelConverter).get()).data();
  if (channelData === undefined) {
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  console.log({ episodeId });
  const episodeDoc = await channelRef
    .collection(EPISODE_DOCUMENT_NAME)
    .withConverter(episodeConverter)
    .doc(episodeId)
    .get();
  if (!episodeDoc.exists) {
    throw new GraphQLError('The requested episode does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  const episodeData = episodeDoc.data();

  if (episodeData === undefined) {
    throw new GraphQLError('The requested episode does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  const episode = {
    ...episodeData,
    hasChangeableAd: channelData.hasChangeableAd,
  };
  return episode;
};

const resolvers: QueryResolvers = {
  episode: resolver,
};

export default {
  typeDefs,
  resolvers,
};
