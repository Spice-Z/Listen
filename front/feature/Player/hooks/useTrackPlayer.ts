import { useCallback, useMemo, useState } from 'react';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useDidMount } from '../../hooks/useDidMount';

export const useTrackPlayer = () => {
  const [playingTrackDuration, setPlayingTrackDuration] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const playbackState = usePlaybackState();
  const isPlaying = useMemo(() => playbackState === State.Playing, [playbackState]);

  const getCurrentTrack = useCallback(async (): Promise<Track | null> => {
    const currentIndex = await TrackPlayer.getCurrentTrack();
    const currentTrack = currentIndex !== null ? await TrackPlayer.getTrack(currentIndex) : null;
    return currentTrack;
  }, []);

  const _updateCurrentInfo = useCallback(async () => {
    const currentTrack = await getCurrentTrack();
    setCurrentTrack(currentTrack);
    const duration = await TrackPlayer.getDuration();
    setPlayingTrackDuration(duration);
    const Queue = await TrackPlayer.getQueue();
    setCurrentQueue(Queue);
  }, [getCurrentTrack]);

  useDidMount(() => {
    _updateCurrentInfo();
  });

  const playTrackIfNotCurrentlyPlaying = useCallback(async (track: Track) => {
    const currentIndex = await TrackPlayer.getCurrentTrack();
    const currentTrack = currentIndex !== null ? await TrackPlayer.getTrack(currentIndex) : null;
    if (currentTrack === null || currentTrack.url !== track.url) {
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

  // update current queue/track when it changes
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    await _updateCurrentInfo();
  });
  return {
    isPlaying,
    currentQueue,
    currentTrack,
    playTrackIfNotCurrentlyPlaying,
    playingTrackDuration,
  };
};
