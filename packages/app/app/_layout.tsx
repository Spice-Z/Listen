import { Stack } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../feature/context/auth/AuthProvider';
import { useSetupTrackPlayer } from '../feature/Player/hooks/useSetupTrackPlayer';
import { ApolloProviderHelper } from '../feature/graphql/ApolloProviderHepler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});
export const unstable_settings = {
  initialRouteName: 'search',
};

export default function Layout() {
  useSetupTrackPlayer();

  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <ApolloProviderHelper>
            <QueryClientProvider client={queryClient}>
              <StatusBar style="inverted" />
              <Stack>
                <Stack.Screen
                  name="mainTab"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalPlayer"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'slide_from_bottom',
                    headerStyle: {
                      backgroundColor: theme.color.bgMain,
                    },
                    headerTitleStyle: {
                      color: theme.color.textMain,
                      fontWeight: theme.fontWeight.bold,
                      fontSize: 18,
                    },
                  }}
                />
                <Stack.Screen
                  name="modalTranscriptPlayer"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'slide_from_bottom',
                    headerStyle: {
                      backgroundColor: theme.color.bgMain,
                    },
                    headerTitleStyle: {
                      color: theme.color.textMain,
                      fontWeight: theme.fontWeight.bold,
                      fontSize: 18,
                    },
                  }}
                />
              </Stack>
            </QueryClientProvider>
          </ApolloProviderHelper>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
