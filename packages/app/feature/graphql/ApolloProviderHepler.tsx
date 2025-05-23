import { ReactNode, memo, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react/context';
import { useAuthContext } from '../context/auth/context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: API_URL,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            channels: relayStylePagination(),
            // allEpisodes: relayStylePagination(),
          },
        },
        Channel: {
          fields: {
            episodes: relayStylePagination(),
          },
        },
      },
    }),
  });
};

type Props = {
  children: ReactNode;
};

export const ApolloProviderHelper = memo<Props>((props) => {
  const authContext = useAuthContext();
  const token = authContext.firebaseToken ?? '';
  const client = useMemo(() => createApolloClient(token), [token]);
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
});
