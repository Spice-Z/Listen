import { useCallback, useMemo, useState } from 'react';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useDidMount } from '../../hooks/useDidMount';

type Needed = {
  id: string;
  channelId: string;
  artwork: string;
  duration: number;
};
export type TrackPlayerTrack = Track & Needed;

export const useTrackPlayer = () => {
  const [playingTrackDuration, setPlayingTrackDuration] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackPlayerTrack | null>(null);
  const [currentPlaybackRate, setCurrentPlaybackRate] = useState<number>(1);
  const [currentQueue, setCurrentQueue] = useState<TrackPlayerTrack[]>([]);
  const playbackState = usePlaybackState();
  const isPlaying = useMemo(() => playbackState === State.Playing, [playbackState]);
  const isLoading = useMemo(
    () => playbackState === State.Buffering || playbackState === State.Connecting,
    [playbackState]
  );

  const getCurrentTrack = useCallback(async (): Promise<TrackPlayerTrack | null> => {
    const currentIndex = await TrackPlayer.getCurrentTrack();
    const currentTrack = currentIndex !== null ? await TrackPlayer.getTrack(currentIndex) : null;
    return currentTrack as TrackPlayerTrack;
  }, []);

  const _updateCurrentInfo = useCallback(async () => {
    const currentTrack = await getCurrentTrack();
    setCurrentTrack(currentTrack);
    const duration = await TrackPlayer.getDuration();
    setPlayingTrackDuration(duration);
    const Queue = await TrackPlayer.getQueue();
    setCurrentQueue(Queue as TrackPlayerTrack[]);
  }, [getCurrentTrack]);

  const _updateCurrentPlaybackRate = useCallback(async () => {
    const rate = await TrackPlayer.getRate();
    setCurrentPlaybackRate(rate);
  }, []);

  const skipToNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
    _updateCurrentInfo();
  }, [_updateCurrentInfo]);

  const skipToPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
    _updateCurrentInfo();
  }, [_updateCurrentInfo]);

  useDidMount(() => {
    _updateCurrentInfo();
    _updateCurrentPlaybackRate();
  });

  const playTrackIfNotCurrentlyPlaying = useCallback(async (track: TrackPlayerTrack) => {
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

  const switchPlaybackRate = useCallback(async () => {
    const rate = await TrackPlayer.getRate();
    setCurrentPlaybackRate(rate);
    if (rate === 0.5) {
      await TrackPlayer.setRate(0.75);
      setCurrentPlaybackRate(0.75);
    } else if (rate === 0.75) {
      await TrackPlayer.setRate(1);
      setCurrentPlaybackRate(1);
    } else if (rate === 1) {
      await TrackPlayer.setRate(1.5);
      setCurrentPlaybackRate(1.5);
    } else if (rate === 1.5) {
      await TrackPlayer.setRate(2);
      setCurrentPlaybackRate(2);
    } else {
      await TrackPlayer.setRate(0.5);
      setCurrentPlaybackRate(0.5);
    }
  }, []);

  // update current queue/track when it changes
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    await _updateCurrentInfo();
  });
  return {
    isPlaying,
    isLoading,
    currentQueue,
    currentTrack,
    currentPlaybackRate,
    playTrackIfNotCurrentlyPlaying,
    playingTrackDuration,
    switchPlaybackRate,
    skipToNext,
    skipToPrevious,
  };
};
