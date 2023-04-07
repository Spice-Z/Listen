import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import TrackPlayer, { Capability } from "react-native-track-player";

export default function Root() {
  const router = useRouter();
  const setup = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious
      ],
    });
    router.push("/mainTab/home");
  }


  useEffect(() => {
    setup()
  }, []);
  return <>
  <SplashScreen />
  <StatusBar style="auto" />
  </>
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

