import bookResolvers from './queries/book.js';

export const resolvers = {
    Query: {
        ...bookResolvers.resolvers.Query
    },
   }