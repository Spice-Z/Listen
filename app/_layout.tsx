import { Stack } from "expo-router";
import { useEffect } from "react";

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

  return <Stack >
    <Stack.Screen name="mainTab" options={{
      // Hide the header for all other routes.
      headerShown: false,
    }}
    />
    <Stack.Screen name="modal" options={{
      // Hide the header for all other routes.
      presentation: "transparentModal",
    }} />
  </Stack>;
}