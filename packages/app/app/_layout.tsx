import { SplashScreen, Stack, useRouter } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../feature/context/auth/AuthProvider';
import { useSetupTrackPlayer } from '../feature/Player/hooks/useSetupTrackPlayer';
import { ApolloProviderHelper } from '../feature/graphql/ApolloProviderHepler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import remoteConfig from '@react-native-firebase/remote-config';
import { useDidMount } from '../feature/hooks/useDidMount';
import {
  REMOTE_CONFIG_APP_MINIMUM_VERSION_DEFAULT_VALUE,
  REMOTE_CONFIG_APP_MINIMUM_VERSION_KEY,
} from '../constants';
import * as Application from 'expo-application';
import { compareSemVer } from '../feature/utils/semVer';
import { useState } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});

export default function Layout() {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  useSetupTrackPlayer();

  // initialize処理
  useDidMount(() => {
    (async () => {
      const remoteConfigPromise = remoteConfig()
        .setDefaults({
          REMOTE_CONFIG_APP_MINIMUM_VERSION_KEY: REMOTE_CONFIG_APP_MINIMUM_VERSION_DEFAULT_VALUE,
        })
        .then(() => remoteConfig().fetch(300))
        .then(() => remoteConfig().fetchAndActivate())
        .then(() => {
          const minimumVersion = remoteConfig()
            .getValue(REMOTE_CONFIG_APP_MINIMUM_VERSION_KEY)
            .asString();
          const appVersion = Application.nativeApplicationVersion;
          const semVerCompare = compareSemVer(appVersion, minimumVersion);
          if (semVerCompare === -1) {
            // 強制アップデート
            router.replace('askAppUpdate');
          }
        });
      const admobPromise = mobileAds().initialize();
      await Promise.all([remoteConfigPromise, admobPromise]);
      setIsInitialized(true);
      SplashScreen.hideAsync();
      await requestTrackingPermissionsAsync();
    })();
  });
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider isInitialized={isInitialized}>
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
                  name="modalDictationPlayer"
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
