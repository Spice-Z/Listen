import { usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "react-native-track-player";
import { useDidMount } from "../feature/hooks/useDidMount";
import { useEffect, useLayoutEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function Root() {
  const router = useRouter();
  const pathname = usePathname()
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | undefined>();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    console.log('onAuthStateChanged')
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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