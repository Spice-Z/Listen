import { memo, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { PauseIcon, PlayIcon, TranslateIcon } from '../icons';
import { formatDMMMYY } from '../format/date';
import { formatDuration } from '../format/duration';
import PressableOpacity from '../Pressable/PressableOpacity';
import { Image as ExpoImage } from 'expo-image';
import { IMAGE_DEFAULT_BLUR_HASH } from '../../constants';
import TextIcon from '../icons/TextIcon';

type Props = {
  channelTitle: string;
  episodeTitle: string;
  episodeDescription: string;
  episodeImageUrl: string;
  duration: number;
  dateUnixTime: number;
  isPlaying: boolean;
  isLoading: boolean;
  onPressPlay: () => void;
  hasTranslatedTranscript: boolean;
  hasTranscript: boolean;
  canAutoScroll: boolean;
};

const Episode = memo(
  ({
    channelTitle,
    episodeTitle,
    episodeDescription,
    episodeImageUrl,
    duration,
    dateUnixTime,
    isPlaying,
    isLoading,
    onPressPlay,
    hasTranslatedTranscript,
    hasTranscript,
    canAutoScroll,
  }: Props) => {
    const formattedDate = useMemo(() => {
      return formatDMMMYY(dateUnixTime);
    }, [dateUnixTime]);

    const formattedDuration = useMemo(() => {
      return formatDuration(duration);
    }, [duration]);

    const playPauseButton = useMemo(() => {
      if (isLoading) {
        return <ActivityIndicator />;
      }
      return isPlaying ? (
        <PauseIcon fill={theme.color.bgMain} width={28} height={28} />
      ) : (
        <PlayIcon fill={theme.color.bgMain} width={28} height={28} />
      );
    }, [isLoading, isPlaying]);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.head}>
          <ExpoImage
            style={styles.image}
            source={episodeImageUrl}
            placeholder={IMAGE_DEFAULT_BLUR_HASH}
          />
          <View style={styles.texts}>
            <Text numberOfLines={2} style={styles.channelTitle}>
              {channelTitle}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        <Text selectable style={styles.episodeTitle}>
          {episodeTitle}
        </Text>
        <View style={styles.subContainer}>
          <View style={styles.infoContainer}>
            {hasTranslatedTranscript ? (
              <TranslateIcon width={24} height={24} color={theme.color.accent} />
            ) : hasTranscript ? (
              <TextIcon width={18} height={18} color={theme.color.accent} />
            ) : null}
            {canAutoScroll && <Text style={styles.runEmoji}>🏃‍♀️</Text>}
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.duration}>{formattedDuration}</Text>
            <PressableOpacity style={styles.playButton} onPress={onPressPlay}>
              {playPauseButton}
            </PressableOpacity>
          </View>
        </View>
        <Text selectable style={styles.description}>
          {episodeDescription}
        </Text>
      </ScrollView>
    );
  },
);

Episode.displayName = 'Episode';

export default Episode;

const styles = StyleSheet.create({
  container: {},
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
  },
  channelTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.color.textMain,
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.color.textWeak,
    marginTop: 2,
  },
  episodeTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: theme.color.textMain,
    marginTop: 12,
  },
  description: {
    color: theme.color.textMain,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  duration: {
    color: theme.color.textWeak,
  },
  subContainer: {
    marginTop: 8,
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
  },
  playButton: {
    marginLeft: 16,
    backgroundColor: theme.color.accent,
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
