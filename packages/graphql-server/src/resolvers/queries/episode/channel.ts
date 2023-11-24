import gql from 'graphql-tag';
import type { EpisodeResolvers, Resolvers } from '../../../../generated/resolvers-types';
import { ALL_EPISODES_DOCUMENT_NAME, CHANNEL_DOCUMENT_NAME } from '../../../constants.js';
import { allEpisodesEpisodeConverter } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { firestore } from '../../../firebase/index.js';
import { GraphQLError } from 'graphql';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

const typeDefs = gql`
  extend type Episode {
    channel: Channel!
  }
`;

const resolver: EpisodeResolvers['channel'] = async (parent) => {
  console.log('episode/channel.ts');
  const { episodeId } = parent;
  if (episodeId === undefined) {
    console.log('episodeId is undefined');
    throw new GraphQLError('The episodeId is undefined.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  const allEpisodeDocs = await firestore
    .collection(ALL_EPISODES_DOCUMENT_NAME)
    .withConverter(allEpisodesEpisodeConverter)
    .where('episodeId', '==', episodeId)
    .limit(1)
    .get();
  if (!allEpisodeDocs.empty) {
    console.log(`allEpisodeDocs is empty. episodeId: ${episodeId}`);
    throw new GraphQLError('The episode does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  const allEpisodeData = allEpisodeDocs.docs[0].data();
  if (allEpisodeData === undefined) {
    console.log('allEpisodeData is undefined');
    throw new GraphQLError('The episode does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  const channelId = allEpisodeData.channelId;
  const channelDoc = await firestore
    .collection(CHANNEL_DOCUMENT_NAME)
    .withConverter(channelConverter)
    .doc(channelId)
    .get();
  if (!channelDoc.exists) {
    console.log('channelDoc.exists', channelDoc.exists);
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  const channelData = channelDoc.data();
  if (channelData === undefined) {
    console.log('channelData is undefined');
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
