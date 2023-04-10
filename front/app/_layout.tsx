import { Stack } from "expo-router";
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

  return <>
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="mainTab" options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
        />
        <Stack.Screen name="modal" options={{
          // Hide the header for all other routes.
          presentation: "transparentModal",
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
        <MiniPlayer />
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
