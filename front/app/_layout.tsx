import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { theme } from "../feature/styles/theme";
import { StyleSheet, View } from "react-native";
import MiniPlayer from "../feature/Player/MiniPlayer";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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
  const pathname = usePathname();

  return <>
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
      </Stack>
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer hide={pathname === '/modalPlayer'} />
      </View>
    </QueryClientProvider>
  </>;
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: "absolute",
    bottom: 60,
  }
})
