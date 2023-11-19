import gql from 'graphql-tag';
import type { EpisodeResolvers } from '../../../../generated/resolvers-types';
import { ALL_EPISODES_DOCUMENT_NAME } from '../../../constants.js';
import { allEpisodesEpisodeConverter } from '../../../firebase/converters/allEpisodesEpisodeConverter';
import { firestore } from '../../../firebase/index.js';
import { channelConverter } from '../../../firebase/converters/channelConverter';
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
  const channelRef = firestore.collection(ALL_EPISODES_DOCUMENT_NAME).doc(channelId);
  const channelData = (await channelRef.withConverter(channelConverter).get()).data();
  if (channelData === undefined) {
    throw new GraphQLError('The requested channel does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
  return channelData;
};

const resolvers: EpisodeResolvers = {
  channel: resolver,
};

export default {
  typeDefs,
  resolvers,
};
