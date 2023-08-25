import channelResolvers from './queries/channel/channel.js';
import channelsResolvers from './queries/channel/channels.js';
import episodeResolvers from './queries/episode/episode.js';
import nodeResolvers from './queries/node.js';
import channelEpisodesResolvers from './queries/channel/episodes.js';
import type { Resolvers } from '../../generated/resolvers-types.js';

export const resolvers: Resolvers = {
  Query: {
    ...channelResolvers.resolvers,
    ...channelsResolvers.resolvers,
    ...episodeResolvers.resolvers,
    ...nodeResolvers.resolvers,
  },
  ...channelEpisodesResolvers.resolvers,
};
