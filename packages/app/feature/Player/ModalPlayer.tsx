import {
  useState, useEffect, useMemo, useCallback, memo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import {
  PauseIcon, PlayIcon, SkipForwardIcon, SkipBackwardIcon, RightIcon, LeftIcon,
} from '../icons';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import ArtworkImage from './components/ArtworkImage';
import { getTranscriptFromUrl } from '../dataLoader/getTranscriptFromUrl';
import { useRouter } from 'expo-router';
import TranscriptScrollBox from './components/TranscriptScrollBox';
import { gql } from '../graphql/__generated__';
import { useQuery as useApolloQuery } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';

const GET_EPISODE_IN_MODAL_PLAYER = gql(/* GraphQL */`
  query GetEpisodeInModalPlayer($channelId: String!, $episodeId: String!) {
    episode(channelId: $channelId, episodeId: $episodeId) {
      transcriptUrl
    }
  }
`);

const ModalPlayer = memo(() => {
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const playbackState = usePlaybackState();

  const { playingTrackDuration,
    currentQueue,
    currentTrack,
    currentPlaybackRate,
    switchPlaybackRate,
    isPlaying,
    isLoading,
    skipToNext,
    skipToPrevious } = useTrackPlayer();
  const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;
  const { data } = useApolloQuery(GET_EPISODE_IN_MODAL_PLAYER,
    {
      variables: {
        channelId: currentEpisodeChannelId,
        episodeId: currentEpisodeId,
      }
    }
  )
  const { isLoading: _isTranscriptLoading, data: transcriptData } = useQuery({
    queryKey: ['getTranscriptFromUrl', data?.episode.transcriptUrl],
    queryFn: () => getTranscriptFromUrl(data?.episode.transcriptUrl),
    enabled: !!data?.episode.transcriptUrl,
  })

  const playPauseButton = useMemo(() => {
    if (isLoading) {
      return <ActivityIndicator />
    }
    return isPlaying ? <PauseIcon fill={theme.color.bgMain} width={28} height={28} /> : <PlayIcon fill={theme.color.bgMain} width={28} height={28} />
  }, [isLoading, isPlaying])


  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    setPlaybackPosition(0);
  });

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track === null) {
      setPlaybackPosition(0);
    }
  });

  const progress = useProgress(250);

  useEffect(() => {
    const { position } = progress;
    setPlaybackPosition(position);
  }, [progress]);

  const handlePlayPause = async () => {
    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const router = useRouter()

  const handleSkip = async (seconds) => {
    const newPosition = playbackPosition + seconds;
    await TrackPlayer.seekTo(newPosition);
  };
  const handleSeek = async (value) => {
    const newPosition = value * playingTrackDuration;
    await TrackPlayer.seekTo(newPosition);
  };
  const handlePlaybackRate = async () => {
    await switchPlaybackRate()
  };
  const handleOpenTranscriptModal = () => {
    router.push('/modalTranscriptPlayer')
  }
  const handleOpenNextEpisodes = useCallback(() => {
    router.push('/modalNextEpisodes')
  }, [router])

  return currentQueue.length === 0 || currentTrack === null ? <View style={styles.container}>
    <Text style={{ color: theme.color.textMain }}>No Playing </Text>
  </View> : (
    <View style={styles.container}>
      <TranscriptScrollBox
        transcriptUrl={data?.episode.transcriptUrl}
        height={'70%'}
        width={'100%'}
        currentTimePosition={progress.position} />
      <View style={styles.episodeContainer}>
        <ArtworkImage width={50} height={50} borderRadius={8} />
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.channelName} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.seekBar}
          value={
            playingTrackDuration > 0
              ? playbackPosition / playingTrackDuration
              : 0
          }
          onSlidingComplete={handleSeek}
          minimumTrackTintColor={theme.color.accent}
          maximumTrackTintColor={theme.color.bgEmphasis}
          thumbImage={require('../../assets/player/thumb.png')}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
        />
      </View>
      <View style={styles.playerContainer}>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={handlePlaybackRate}
        >
          <View style={styles.controlButton}>
            <Text style={styles.playbackRate}>{currentPlaybackRate}x</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={skipToPrevious}
        >
          <View style={styles.controlButton}>
            <LeftIcon width={24} height={24} fill={theme.color.textMain} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={() => handleSkip(-15)}
        >
          <View style={styles.controlButton}>
            <SkipBackwardIcon width={24} height={24} color={theme.color.textMain} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={handlePlayPause}
        >
          <View style={styles.playPauseButton}>
            {playPauseButton}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={() => handleSkip(15)}
        >
          <View style={styles.controlButton}>
            <SkipForwardIcon width={24} height={24} color={theme.color.textMain} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={skipToNext}
        >
          <View style={styles.controlButton}>
            <RightIcon width={24} height={24} fill={theme.color.textMain} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playerContainerItem}
          onPress={handleOpenTranscriptModal}
        >
          <View style={styles.controlButton}>
            <Text>✨</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.subMenuContainer}>
        <TouchableOpacity onPress={handleOpenNextEpisodes}>
          <Text>aaaaa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgMain,
    color: theme.color.textMain,
    width: '100%',
    height: '100%',
  },
  episodeContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  episodeInfo: {
    marginLeft: 8,
    flexShrink: 1,
  },
  episodeTitle: {
    color: theme.color.textMain,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800'
  },
  channelName: {
    fontSize: 14,
    lineHeight: 18,
    color: theme.color.textWeak,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 4,
  },
  seekBar: {
    width: Dimensions.get('window').width - 32,
    height: 20,
    marginHorizontal: 16,
  },
  playerContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainerItem: {
    width: '15%',
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: theme.color.accent,
    height: 56,
    width: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackRate: {
    color: theme.color.textMain,
    fontSize: 16,
    fontWeight: '800'
  },
  controlButton: {
    height: 56,
    width: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  subMenuContainer: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});

export default ModalPlayer

