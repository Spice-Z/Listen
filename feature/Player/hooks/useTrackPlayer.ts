import { useCallback, useState } from 'react';
import TrackPlayer, { Event, State, Track, useTrackPlayerEvents } from 'react-native-track-player';

export const useTrackPlayer = () => {
  const [playingTrackDuration, setPlayingTrackDuration] = useState<number | null>(null);

  const playTrackIfNotCurrentlyPlaying = useCallback(async (track: Track) => {
    const currentIndex = await TrackPlayer.getCurrentTrack();
    const currentTrack = await TrackPlayer.getTrack(currentIndex);
    if (currentTrack.url !== track.url) {
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      await TrackPlayer.play();
      return;
    }
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Paused) {
      await TrackPlayer.play();
    }
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    const duration = await TrackPlayer.getDuration();
    setPlayingTrackDuration(duration);
  });

  return {
    playTrackIfNotCurrentlyPlaying,
    playingTrackDuration,
  };
};
