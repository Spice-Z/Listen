import { useState, useEffect, memo, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import { DotsMenuIcon, TranslateIcon } from '../icons';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import ArtworkImage from './components/ArtworkImage';
import { Stack, useRouter } from 'expo-router';
import TranscriptScrollBox from './components/TranscriptScrollBox';
import PressableOpacity from '../Pressable/PressableOpacity';
import SquareShimmer from '../Shimmer/SquareShimmer';
import BannerAdMob from '../../feature/Ad/BannerAdMob';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useCurrentEpisodeData } from './hooks/useCurrentEpisodeData';
import PlayPauseIcon from './components/PlayPauseIcon';
import PlaySettingBottomSheet from '../BottomSheet/PlaySettingBottomSheet';

const LoadingView = memo(() => {
  return <SquareShimmer width="100%" height={500} />;
});

const ModalPlayer = memo(() => {
  const router = useRouter();

  const [playbackPosition, setPlaybackPosition] = useState(0);

  const playbackState = usePlaybackState();

  const {
    playingTrackDuration,
    currentQueue,
    currentTrack,
    currentPlaybackRate,
    switchPlaybackRate,
    isPlaying,
    isLoading,
  } = useTrackPlayer();
  const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;
  const { episode, hasTranslatedTranscript } = useCurrentEpisodeData({
    currentEpisodeChannelId,
    currentEpisodeId,
  });

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

  const handleSkip = async (seconds) => {
    const newPosition = playbackPosition + seconds;
    await TrackPlayer.seekTo(newPosition);
  };
  const handleSeek = async (value) => {
    const newPosition = value * playingTrackDuration;
    await TrackPlayer.seekTo(newPosition);
  };
  const handlePlaybackRate = async () => {
    await switchPlaybackRate();
  };
  const handleOpenTranscriptModal = () => {
    router.push('/modalTranscriptPlayer');
  };

  const playSettingBottomSheetRef = useRef(null);
  const toggleBottomSheet = useCallback(() => {
    if (playSettingBottomSheetRef.current) {
      playSettingBottomSheetRef.current.toggleBottomSheet();
    }
  }, []);
  const renderHeaderRight = useCallback(() => {
    return (
      <PressableOpacity hitSlop={4} onPress={toggleBottomSheet}>
        <DotsMenuIcon width={24} height={24} color={theme.color.textMain} />
      </PressableOpacity>
    );
  }, [toggleBottomSheet]);

  const backAndWaitAnimation = useCallback(async () => {
    router.back();
    // モーダルが閉じるのを待ってから遷移する
    await new Promise((resolve) => setTimeout(resolve, 50));
  }, [router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: renderHeaderRight,
        }}
      />
      {currentQueue.length === 0 || currentTrack === null ? (
        <View style={styles.container}>
          <LoadingView />
        </View>
      ) : (
        <View style={styles.container}>
          <TranscriptScrollBox
            transcriptUrl={episode?.transcriptUrl}
            currentTimePosition={progress.position}
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height * 0.7 - 60}
            disableAutoScroll={episode?.hasChangeableAd}
          />
          <View style={styles.adContainer}>
            <BannerAdMob size={BannerAdSize.BANNER} />
          </View>
          <View style={styles.episodeContainer}>
            <ArtworkImage width={50} height={50} borderRadius={8} />
            <View style={styles.episodeInfo}>
              <Text style={styles.episodeTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.channelName} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.seekBar}
              value={playingTrackDuration > 0 ? playbackPosition / playingTrackDuration : 0}
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
            <PressableOpacity style={styles.playerContainerItem} onPress={handlePlaybackRate}>
              <View style={styles.controlButton}>
                <Text style={styles.playbackRate}>{currentPlaybackRate}x</Text>
              </View>
            </PressableOpacity>
            {/* <PressableOpacity style={styles.playerContainerItem} onPress={skipToPrevious}>
          <View style={styles.controlButton}>
            <LeftIcon width={28} height={28} fill={theme.color.textMain} />
          </View>
        </PressableOpacity> */}
            <PressableOpacity style={styles.playerContainerItem} onPress={() => handleSkip(-15)}>
              <View style={styles.controlButton}>
                <Image
                  style={styles.controlImage}
                  width={28}
                  height={28}
                  source={require('../../assets/player/back15Black.png')}
                />
              </View>
            </PressableOpacity>
            <PressableOpacity style={styles.playerContainerItem} onPress={handlePlayPause}>
              <View style={styles.playPauseButton}>
                <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} />
              </View>
            </PressableOpacity>
            <PressableOpacity style={styles.playerContainerItem} onPress={() => handleSkip(15)}>
              <View style={styles.controlButton}>
                <Image
                  style={styles.controlImage}
                  width={28}
                  height={28}
                  source={require('../../assets/player/forward15Black.png')}
                />
              </View>
            </PressableOpacity>
            {/* <PressableOpacity style={styles.playerContainerItem} onPress={skipToNext}>
          <View style={styles.controlButton}>
            <RightIcon width={28} height={28} color={theme.color.textMain} />
          </View>
        </PressableOpacity> */}
            {hasTranslatedTranscript ? (
              <PressableOpacity
                style={styles.playerContainerItem}
                onPress={handleOpenTranscriptModal}
              >
                <View style={styles.controlButton}>
                  <TranslateIcon width={28} height={28} color={theme.color.textMain} />
                </View>
              </PressableOpacity>
            ) : (
              <View style={styles.playerContainerItem} />
            )}
          </View>
        </View>
      )}
      {/* BottomSheet */}
      <PlaySettingBottomSheet ref={playSettingBottomSheetRef} onAfterClose={backAndWaitAnimation} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgMain,
    color: theme.color.textMain,
    width: '100%',
    height: '100%',
  },
  episodeContainer: {
    marginTop: 4,
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
    fontWeight: '800',
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
    fontWeight: '800',
  },
  controlButton: {
    height: 56,
    width: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImage: {
    width: 28,
    height: 28,
    aspectRatio: 1,
    resizeMode: 'contain',
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
    backgroundColor: '#fff',
  },
  adContainer: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSheetText: {
    color: theme.color.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ModalPlayer;
