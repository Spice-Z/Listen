import { Stack, usePathname } from "expo-router";
import { useEffect, useMemo } from "react";
import { theme } from "../feature/styles/theme";
import { StyleSheet, View } from "react-native";
import MiniPlayer from "../feature/Player/MiniPlayer";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from "../feature/context/auth/AuthProvider";
import { useSetupTrackPlayer } from "../feature/Player/hooks/useSetupTrackPlayer";
import { ApolloProviderHelper } from "../feature/graphql/ApolloProviderHepler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});
export const unstable_settings = {
  initialRouteName: "home",
};

export default function Layout() {
  useEffect(() => {
    console.log("Layout");
    return () => {
      console.log("Layout unmount");
    }
  }, []);
  useSetupTrackPlayer()
  const pathname = usePathname();
  const hideMiniPlayer = useMemo(() => {
    return pathname === '/modalPlayer' || pathname === '/modalTranscriptPlayer' || pathname === '/signIn'
  }, [pathname])


  return <>
    <AuthProvider>
      <ApolloProviderHelper>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="mainTab" options={{
              headerShown: false,
            }}
            />
            <Stack.Screen name="modalPlayer" options={{
              presentation: "transparentModal",
              animation: 'slide_from_bottom',
              headerStyle: {
                backgroundColor: theme.color.bgMain,
              },
              headerTitleStyle: {
                color: theme.color.textMain,
                fontWeight: theme.fontWeight.bold,
                fontSize: 18,
              }
            }} />
            <Stack.Screen name="modalTranscriptPlayer" options={{
              presentation: "transparentModal",
              animation: 'slide_from_bottom',
              headerStyle: {
                backgroundColor: theme.color.bgMain,
              },
              headerTitleStyle: {
                color: theme.color.textMain,
                fontWeight: theme.fontWeight.bold,
                fontSize: 18,
              }
            }} />
            <Stack.Screen name="modalNextEpisodes" options={{
              presentation: "transparentModal",
              animation: 'slide_from_bottom',
              headerStyle: {
                backgroundColor: theme.color.bgMain,
              },
              headerTitleStyle: {
                color: theme.color.textMain,
                fontWeight: theme.fontWeight.bold,
                fontSize: 18,
              }
            }} />
          </Stack>

          <View style={styles.miniPlayerContainer}>
            <MiniPlayer hide={hideMiniPlayer} />
          </View>
        </QueryClientProvider>
      </ApolloProviderHelper>
    </AuthProvider>
  </>;
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: "absolute",
    bottom: 60,
  }
})
