import { usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "react-native-track-player";
import { useDidMount } from "../feature/hooks/useDidMount";
import { useLayoutEffect } from "react";

export default function Root() {
  const router = useRouter();
  const pathname = usePathname()
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

  useLayoutEffect(() => {
    if (pathname === '/') {
      router.replace("/mainTab/home");
    }
  }, [pathname, router])

  return <>
    <StatusBar style="auto" />
  </>
}