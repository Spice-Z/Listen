import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {resolvers} from './resolvers/index.js';
import { readFileSync } from 'node:fs'

import { dirname, join } from 'path'

const port = process.env.PORT || 8080

const filePath = join(dirname(new URL(import.meta.url).pathname), '../generated/schema.graphql')
const typeDefs = readFileSync(filePath, 'utf8')


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(port) },
});

console.log(`🚀  Server ready at: ${url}`);
