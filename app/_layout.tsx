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

  return <Stack screenOptions={{
    headerShown: false,
  }}/>;
}