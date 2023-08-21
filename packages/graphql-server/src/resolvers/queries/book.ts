import gql from 'graphql-tag';
import type { Resolvers } from '../../../generated/resolvers-types';

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  extend type Query {
    books: [Book]
  }
`;


const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers:Resolvers = {
  Query: {
    books: () => books,
  },
};


export default {
  typeDefs,
  resolvers
};
