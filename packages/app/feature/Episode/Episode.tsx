import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { TranslateIcon } from '../icons';
import { formatDMMMYY } from '../format/date';
import { formatDuration } from '../format/duration';
import PressableOpacity from '../Pressable/PressableOpacity';
import { Image as ExpoImage } from 'expo-image';
import { IMAGE_DEFAULT_BLUR_HASH } from '../../constants';
import TextIcon from '../icons/TextIcon';
import PressableScale from '../Pressable/PressableScale';
import PlayPauseIcon from '../Player/components/PlayPauseIcon';
import { PlayType } from '../context/player/context';
import Spacer from '../Spacer/Spacer';

type Props = {
  channelTitle: string;
  channelAuthor: string;
  episodeTitle: string;
  episodeDescription: string;
  episodeImageUrl: string;
  duration: number;
  dateUnixTime: number;
  isPlaying: boolean;
  isLoading: boolean;
  onPressPlay: () => void;
  onPressDictationPlay: () => void;
  onPressChannel: () => void;
  hasTranslatedTranscript: boolean;
  hasTranscript: boolean;
  canAutoScroll: boolean;
  canDictation: boolean;
  currentPlayType: PlayType;
};

const Episode = memo(
  ({
    channelTitle,
    channelAuthor,
    episodeTitle,
    episodeDescription,
    episodeImageUrl,
    duration,
    dateUnixTime,
    isPlaying,
    isLoading,
    onPressPlay,
    onPressDictationPlay,
    onPressChannel,
    hasTranslatedTranscript,
    hasTranscript,
    canAutoScroll,
    canDictation,
    currentPlayType,
  }: Props) => {
    const formattedDate = useMemo(() => {
      return formatDMMMYY(dateUnixTime);
    }, [dateUnixTime]);

    const formattedDuration = useMemo(() => {
      return formatDuration(duration);
    }, [duration]);

    const isPlayingDefault = useMemo(() => {
      return currentPlayType === 'default' && isPlaying;
    }, [currentPlayType, isPlaying]);

    const isPlayingDictation = useMemo(() => {
      return currentPlayType === 'dictation' && isPlaying;
    }, [currentPlayType, isPlaying]);

    return (
      <View style={styles.container}>
        <PressableScale onPress={onPressChannel} style={styles.head}>
          <ExpoImage
            style={styles.image}
            source={episodeImageUrl}
            placeholder={IMAGE_DEFAULT_BLUR_HASH}
          />
          <View style={styles.texts}>
            <Text numberOfLines={2} style={styles.channelTitle}>
              {channelTitle}
            </Text>
            <Text style={styles.author}>{channelAuthor}</Text>
          </View>
        </PressableScale>
        <Spacer height={8} />
        <Text selectable style={styles.episodeTitle}>
          {episodeTitle}
        </Text>
        <Spacer height={4} />
        <Text style={styles.date}>{formattedDate}</Text>
        <Spacer height={8} />
        <View style={styles.subContainer}>
          <View style={styles.infoContainer}>
            {hasTranslatedTranscript ? (
              <TranslateIcon width={24} height={24} color={theme.color.accent} />
            ) : hasTranscript ? (
              <TextIcon width={18} height={18} color={theme.color.accent} />
            ) : null}
            {canAutoScroll && <Text style={styles.runEmoji}>🏃‍♀️</Text>}
            {canDictation && <Text style={styles.runEmoji}>📝</Text>}
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.duration}>{formattedDuration}</Text>
            {canDictation && (
              <PressableOpacity style={styles.playDictationButton} onPress={onPressDictationPlay}>
                <Text style={styles.runEmoji}>📝</Text>
                <PlayPauseIcon isPlaying={isPlayingDictation} isLoading={isLoading} size={24} />
              </PressableOpacity>
            )}
            <PressableOpacity style={styles.playButton} onPress={onPressPlay}>
              <PlayPauseIcon isPlaying={isPlayingDefault} isLoading={isLoading} size={24} />
            </PressableOpacity>
          </View>
        </View>
        <Spacer height={12} />
        <Text selectable style={styles.description}>
          {episodeDescription}
        </Text>
      </View>
    );
  },
);

Episode.displayName = 'Episode';

export default Episode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  texts: {
    flexShrink: 1,
    marginLeft: 8,
    height: 60,
    justifyContent: 'center',
    gap: 2,
  },
  channelTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.color.textMain,
  },
  author: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.color.textWeak,
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.color.textWeak,
  },
  episodeTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: theme.color.textMain,
  },
  description: {
    color: theme.color.textMain,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  duration: {
    color: theme.color.textWeak,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  runEmoji: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    backgroundColor: theme.color.accent,
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playDictationButton: {
    flexDirection: 'row',
    backgroundColor: theme.color.accent,
    height: 40,
    borderRadius: 50,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
