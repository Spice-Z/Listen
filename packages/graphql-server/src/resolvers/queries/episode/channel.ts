import gql from 'graphql-tag';
import type { EpisodeResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { ALL_EPISODES_DOCUMENT_NAME } from '../../../constants.js';
import { allEpisodesEpisodeConverter } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { firestore } from '../../../firebase/index.js';
import { GraphQLError } from 'graphql';

const typeDefs = gql`
  extend type Episode {
    channel: Channel!
  }
`;

const resolver: EpisodeResolvers['channel'] = async (parent) => {
  const { episodeId } = parent;
  if (episodeId === undefined) {
    throw new GraphQLError('The episodeId is undefined.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  const allEpisodeData = await firestore
    .collection(ALL_EPISODES_DOCUMENT_NAME)
    .withConverter(allEpisodesEpisodeConverter)
    .where('episodeId', '==', episodeId)
    .limit(1)
    .get();
  if (allEpisodeData.empty) {
    throw new Error('The requested episode does not exist.');
  }
  const channelId = allEpisodeData.docs[0].data().channelId;
  const channelDoc = await firestore.collection(ALL_EPISODES_DOCUMENT_NAME).doc(channelId).get();
  if (!channelDoc.exists) {
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

const resolvers: Resolvers = {
  Episode: {
    channel: resolver,
  },
};

export default {
  typeDefs,
  resolvers,
};
