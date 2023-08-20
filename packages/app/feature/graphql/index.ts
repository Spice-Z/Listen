import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.listen-world.com',
  cache: new InMemoryCache(),
});
