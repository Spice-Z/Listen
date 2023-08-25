import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers/index.js';
import { readFileSync } from 'node:fs';

import { dirname, join } from 'path';
import { getFirebaseUIdFromTokenOrThrow } from './firebase/index.js';

const port = process.env.PORT || 8080;

const filePath = join(dirname(new URL(import.meta.url).pathname), '../generated/schema.graphql');
const typeDefs = readFileSync(filePath, 'utf8');

type Context = {
  user: {
    firebaseUId: string;
  };
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(port) },
  context: async ({ req }) => {
    console.log({ authorization: req.headers.authorization });
    // Bearer tokenからtokenだけを取得する
    const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
    // サーバー自体をログイン状態以外で動作させないので、tokenがない場合はエラーにする
    const firebaseUId = await getFirebaseUIdFromTokenOrThrow(token);
    return {
      user: {
        firebaseUId,
      },
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
