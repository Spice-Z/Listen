import { StatusBar } from "expo-status-bar";
import { theme } from "../feature/styles/theme";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

export default function Root() {
  return <>
    <Stack.Screen options={{ headerShown: false }} />
    <StatusBar style="auto" />
    <View style={styles.container} />
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
});