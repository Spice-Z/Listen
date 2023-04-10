import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "react-native-track-player";
import { useDidMount } from "../feature/hooks/useDidMount";

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
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
      },
    });
    router.replace("/mainTab/home");
  }

  useDidMount(() => {
    setup()
  });
  return <>
    <StatusBar style="auto" />
  </>
}