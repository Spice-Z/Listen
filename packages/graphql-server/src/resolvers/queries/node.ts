import gql from 'graphql-tag';
import type { QueryResolvers } from '../../../generated/resolvers-types';
import { fromGlobalIdOrThrow } from '../../utils/globalId.js';

const typeDefs = gql`
  interface Node {
    id: ID!
  }
  extend type Query {
    node(id: ID!): Node
  }
`;

const resolver: QueryResolvers['node'] = async (parent, args, context, info) => {
  const _id = args.id;
  const { type } = fromGlobalIdOrThrow(_id);
  //TODO: 実装
  if (type === 'Episode') {
    return null;
  }
  if (type === 'Channel') {
    return null;
  }
  return null;
};

const resolvers: QueryResolvers = {
  node: resolver,
};

export default {
  typeDefs,
  resolvers,
};
