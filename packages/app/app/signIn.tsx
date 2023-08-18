import { memo } from "react";

import AppleSignInButton from "../feature/Auth/AppleSignInButton";
import { theme } from "../feature/styles/theme";
import { SafeAreaView, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const SignIn = memo(() => {
 return <>
  <Stack.Screen options={{
   headerShown: false,
  }} />
  <SafeAreaView style={styles.container}>
   <AppleSignInButton />
  </SafeAreaView >
 </>
})

export default SignIn;


const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
 },
});