import { useState, useEffect, memo, useRef, useCallback, useMemo, useReducer } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TextInputContentSizeChangeEventData,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import { DotsMenuIcon, UnVisibleTextIcon } from '../icons';
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
import { useQuery } from '@tanstack/react-query';
import { getTranscriptFromUrl } from '../dataLoader/getTranscriptFromUrl';
import TextIcon from '../icons/TextIcon';
import { NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabList from './components/TabList';
import RepeatIcon from '../icons/RepeatIcon';
import { useSplittedTranscript } from './hooks/useSplittedTranscript';

const LoadingView = memo(() => {
  return <SquareShimmer width="100%" height={500} />;
});

const DictationPlayer = memo(() => {
  const router = useRouter();

  const [playbackPosition, setPlaybackPosition] = useState(0);

  const playbackState = usePlaybackState();

  const {
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
  const { data: transcriptData } = useQuery({
    queryKey: ['getTranscriptFromUrl', episode?.transcriptUrl],
    queryFn: () => getTranscriptFromUrl(episode?.transcriptUrl || null),
    enabled: !!episode?.transcriptUrl,
  });

  const { splitedTranscriptData, tabs } = useSplittedTranscript({ transcriptData });
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const currentTab = useMemo(() => {
    if (tabs.length === 0) {
      return undefined;
    }
    return tabs[currentTabIndex];
  }, [currentTabIndex, tabs]);
  const currentTabsDuration = useMemo(() => {
    if (currentTab) {
      return currentTab.endTimeSec - currentTab.startTimeSec;
    }
    return 0;
  }, [currentTab]);
  const currentTabsProgressRate = useMemo(() => {
    if (currentTab) {
      return (playbackPosition - currentTab.startTimeSec) / currentTabsDuration;
    }
    return 0;
  }, [currentTab, currentTabsDuration, playbackPosition]);
  const currentSplitedTranscriptData = useMemo(() => {
    if (splitedTranscriptData.length === 0) {
      return undefined;
    }
    return splitedTranscriptData[currentTabIndex];
  }, [currentTabIndex, splitedTranscriptData]);

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    setPlaybackPosition(0);
  });

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track === null) {
      setPlaybackPosition(0);
    }
  });

  const handlePlayPause = async () => {
    // 再生前に、再生位置がcurrentTabの範囲外になっていたらcurrentTabの開始位置に合わせる
    if (
      currentTab &&
      (playbackPosition <= currentTab.startTimeSec || playbackPosition >= currentTab.endTimeSec)
    ) {
      await TrackPlayer.seekTo(currentTab.startTimeSec);
    }
    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
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

  const [isShowTranscript, setIsShowTranscript] = useState(false);
  const [isRepeat, toggleIsRepeat] = useReducer((state) => {
    return !state;
  }, false);

  const onPressTranscriptSwitch = useCallback(() => {
    setIsShowTranscript((prev) => !prev);
  }, [setIsShowTranscript]);

  const progress = useProgress(250);
  useEffect(() => {
    const { position } = progress;
    setPlaybackPosition(position);
    if (!currentSplitedTranscriptData) {
      return;
    }
    const isOver =
      position > currentSplitedTranscriptData[currentSplitedTranscriptData.length - 1].end;
    if (!isOver) {
      return;
    }

    // positionがcurrentSplitedTranscriptDataの範囲外になったら再生を止めて、isRepeatがtrueならば再生開始位置に戻して再生する。isRepeatがfalseならば最後の位置に戻して再生する
    TrackPlayer.pause();
    if (isRepeat) {
      TrackPlayer.seekTo(currentSplitedTranscriptData[0].start);
      TrackPlayer.play();
    } else {
      TrackPlayer.seekTo(currentSplitedTranscriptData[currentSplitedTranscriptData.length - 1].end);
    }
  }, [currentSplitedTranscriptData, isRepeat, progress]);

  const onPressTab = useCallback(
    (index: number) => {
      setCurrentTabIndex(index);
      // 再生位置をタブの開始位置に合わせる
      TrackPlayer.pause();
      TrackPlayer.seekTo(tabs[index].startTimeSec);
      // テキストを非表示にする
      setIsShowTranscript(false);
      // テキスト入力をクリアする
      setInputValue('');
    },
    [tabs],
  );

  const [inputValue, setInputValue] = useState('');
  const [textInputHeight, setTextInputHeight] = useState(60);
  const onContentSizeChange = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const contentSize = event.nativeEvent.contentSize;
      if (contentSize.height < 60 || contentSize.height > 120) {
        return;
      }
      setTextInputHeight(contentSize.height + 20);
    },
    [],
  );

  const insets = useSafeAreaInsets();

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
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: 'height' })}
          style={{ flex: 1 }}
          keyboardVerticalOffset={insets.top + 40}
        >
          <ScrollView style={styles.container}>
            <View style={styles.episodeContainer}>
              <ArtworkImage width={60} height={60} borderRadius={8} />
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle} numberOfLines={2}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.channelName} numberOfLines={1}>
                  {currentTrack.artist}
                </Text>
              </View>
            </View>
            <TabList currentTabIndex={currentTabIndex} onPressTab={onPressTab} tabs={tabs} />
            {currentTab && (
              <View style={styles.dictationContainer}>
                {/* currentTabのTimeを表示 */}
                <Text style={styles.dictationTitle}>
                  {`${formatSecToMin(currentTab.startTimeSec)} ~ ${formatSecToMin(
                    currentTab.endTimeSec,
                  )}`}
                </Text>
                {/* currentTabのテキストを繋げて表示 */}
                <View style={styles.dictationTextContainer}>
                  <Text style={styles.dictationText} selectable>
                    {splitedTranscriptData[currentTabIndex]
                      ? splitedTranscriptData[currentTabIndex].map((data) => data.text).join('')
                      : ''}
                  </Text>
                  {!isShowTranscript && <View style={styles.transcriptHideBox} />}
                </View>
              </View>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                style={[styles.input, { height: textInputHeight }]}
                value={inputValue}
                onChangeText={setInputValue}
                onContentSizeChange={onContentSizeChange}
              />
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.seekBar}
                value={currentTabsDuration * currentTabsProgressRate}
                // onSlidingComplete={handleSeek}
                minimumTrackTintColor={theme.color.accent}
                maximumTrackTintColor={theme.color.bgEmphasis}
                thumbImage={require('../../assets/player/thumb.png')}
                minimumValue={0}
                maximumValue={currentTabsDuration}
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
              <PressableOpacity
                style={styles.playerContainerItem}
                onPress={onPressTranscriptSwitch}
              >
                <View style={styles.controlButton}>
                  {isShowTranscript ? (
                    <TextIcon width={24} height={24} color={theme.color.textMain} />
                  ) : (
                    <UnVisibleTextIcon color={theme.color.textMain} width={30} height={30} />
                  )}
                </View>
              </PressableOpacity>
              <PressableOpacity style={styles.playerContainerItem} onPress={toggleIsRepeat}>
                <View style={styles.controlButton}>
                  <RepeatIcon
                    width={30}
                    height={30}
                    color={theme.color.textMain}
                    showDot={isRepeat}
                  />
                </View>
              </PressableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      <PlaySettingBottomSheet ref={playSettingBottomSheetRef} onAfterClose={backAndWaitAnimation} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgMain,
    color: theme.color.textMain,
  },
  episodeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.color.bgMain,
    flexDirection: 'row',
    gap: 8,
  },
  episodeInfo: {
    justifyContent: 'center',
    gap: 2,
    flexShrink: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  dictationContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  dictationTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  dictationTextContainer: {
    marginTop: 8,
  },
  dictationText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
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
  transcriptHideBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  inputContainer: {},
  input: {
    margin: 12,
    borderWidth: 1,
    borderColor: theme.color.textWeak,
    padding: 10,
  },
});

export default DictationPlayer;
