import bookResolvers from './queries/book.js';
import channelResolvers from './queries/channel/channel.js';

export const resolvers = {
    Query: {
        ...bookResolvers.resolvers.Query,
        ...channelResolvers.resolvers.Query,
    },
   }