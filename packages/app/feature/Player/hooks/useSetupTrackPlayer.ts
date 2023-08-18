import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
import { useDidMount } from '../../hooks/useDidMount';
export const useSetupTrackPlayer = () => {
  const setup = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
  };

  useDidMount(() => {
    setup();
  });
};
