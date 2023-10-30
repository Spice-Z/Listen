import { useState, useEffect, memo, useRef, useCallback, useMemo, Fragment } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import { DotsMenuIcon } from '../icons';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import { Stack, useRouter } from 'expo-router';
import PressableOpacity from '../Pressable/PressableOpacity';
import SquareShimmer from '../Shimmer/SquareShimmer';
import { useCurrentEpisodeData } from './hooks/useCurrentEpisodeData';
import PlayPauseIcon from './components/PlayPauseIcon';
import PlaySettingBottomSheet from '../BottomSheet/PlaySettingBottomSheet';
import ArtworkImage from './components/ArtworkImage';
import { formatSecToMin } from '../format/duration';

const LoadingView = memo(() => {
  return <SquareShimmer width="100%" height={500} />;
});

const DictationPlayer = memo(() => {
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
  const { episode } = useCurrentEpisodeData({
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

  const handleSeek = async (value) => {
    const newPosition = value * playingTrackDuration;
    await TrackPlayer.seekTo(newPosition);
  };
  const handlePlaybackRate = async () => {
    await switchPlaybackRate();
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

  const tabs = useMemo(() => {
    return [
      {
        id: 1,
        startTimeSec: 0,
        endTimeSec: 10,
      },
      {
        id: 2,
        startTimeSec: 10,
        endTimeSec: 20,
      },
      {
        id: 3,
        startTimeSec: 20,
        endTimeSec: 30,
      },
      {
        id: 4,
        startTimeSec: 30,
        endTimeSec: 40,
      },
      {
        id: 5,
        startTimeSec: 40,
        endTimeSec: 50,
      },
      {
        id: 6,
        startTimeSec: 50,
        endTimeSec: 60,
      },
      {
        id: 7,
        startTimeSec: 60,
        endTimeSec: 70,
      },
      {
        id: 8,
        startTimeSec: 70,
        endTimeSec: 80,
      },
      {
        id: 9,
        startTimeSec: 80,
        endTimeSec: 90,
      },
      {
        id: 10,
        startTimeSec: 90,
        endTimeSec: 100,
      },
      {
        id: 11,
        startTimeSec: 100,
        endTimeSec: 110,
      },
    ];
  }, []);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

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
          <View style={styles.tabListContainer}>
            <View style={styles.tabUnder} />
            <ScrollView
              style={styles.tabsContainer}
              contentContainerStyle={styles.tabsContentContainerStyle}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View key={'tabSpacer-1'} style={styles.tabSpacer} />
              {tabs.map((tab, index) => {
                const isCurrent = currentTabIndex === index;
                const onPress = () => setCurrentTabIndex(index);
                return (
                  <Fragment key={tab.id}>
                    <View style={styles.tabSpacer} />
                    <PressableOpacity
                      onPress={onPress}
                      style={[styles.tab, isCurrent && styles.currentTab]}
                    >
                      <Text>{`${formatSecToMin(tab.startTimeSec)} ~ ${formatSecToMin(
                        tab.endTimeSec,
                      )}`}</Text>
                    </PressableOpacity>
                  </Fragment>
                );
              })}
              <View key={'tabSpacer-2'} style={styles.tabSpacer} />
            </ScrollView>
          </View>
          <View style={styles.dictationContainer}>
            <Text>
              {/* currentTabのTimeを表示 */}
              {tabs[currentTabIndex].startTimeSec} ~ {tabs[currentTabIndex].endTimeSec}
            </Text>
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
            <PressableOpacity style={styles.playerContainerItem} onPress={handlePlayPause}>
              <View style={styles.playPauseButton}>
                <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} />
              </View>
            </PressableOpacity>
            <View style={styles.playerContainerItem} />
          </View>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.color.bgMain,
    flexDirection: 'row',
  },
  tabListContainer: {
    flexDirection: 'column-reverse',
  },
  episodeInfo: {},
  episodeTitle: {},
  tabUnder: {
    backgroundColor: theme.color.bgMain,
    height: 4,
    width: '100%',
  },
  tabsContainer: {
    marginTop: 4,
    flexDirection: 'row',
  },
  tabsContentContainerStyle: {
    alignItems: 'flex-end',
  },
  tab: {
    backgroundColor: theme.color.bgMain,
    padding: 4,
    width: 100,
    height: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 3,
    borderColor: theme.color.accent,
  },
  tabSpacer: {
    width: 16,
    height: 3,
    backgroundColor: theme.color.accent,
  },
  currentTab: {
    marginBottom: -2,
    borderBottomWidth: 0,
    height: 43,
  },
  dictationContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
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

export default DictationPlayer;
