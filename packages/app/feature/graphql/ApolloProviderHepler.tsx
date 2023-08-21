import { ReactNode, memo, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react/context';
import { useAuthContext } from '../context/auth/context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.listen-world.com',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }),
    cache: new InMemoryCache(),
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
