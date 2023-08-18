import { StatusBar } from "expo-status-bar";
import { theme } from "../feature/styles/theme";
import { StyleSheet } from "react-native";

export default function Root() {
  return <>
    <StatusBar style="auto" />
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
});