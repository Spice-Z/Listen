import channelResolvers from './queries/channel/channel.js';
import episodeResolvers from './queries/episode/episode.js';
import nodeResolvers from './queries/node.js';

export const resolvers = {
    Query: {
        ...channelResolvers.resolvers,
        ...episodeResolvers.resolvers,
        ...nodeResolvers.resolvers,
    },
   }