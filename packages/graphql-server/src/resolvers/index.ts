import channelResolvers from './queries/channel/channel.js';
import channelsResolvers from './queries/channel/channels.js';
import episodeResolvers from './queries/episode/episode.js';
import nodeResolvers from './queries/node.js';

export const resolvers = {
    Query: {
        ...channelResolvers.resolvers,
        ...channelsResolvers.resolvers,
        ...episodeResolvers.resolvers,
        ...nodeResolvers.resolvers,
    },
}