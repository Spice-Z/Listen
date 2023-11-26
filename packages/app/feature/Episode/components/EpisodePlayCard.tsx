import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { formatDMMMYY } from '../../format/date';
import { formatDuration } from '../../format/duration';
import PressableScale from '../../Pressable/PressableScale';
import { Image as ExpoImage } from 'expo-image';
import { IMAGE_DEFAULT_BLUR_HASH } from '../../../constants';
import { TranslateIcon } from '../../icons';
import TextIcon from '../../icons/TextIcon';
import PressableOpacity from '../../Pressable/PressableOpacity';
import PlayPauseIcon from '../../Player/components/PlayPauseIcon';

type Props = {
  title: string;
  channelTitle: string;
  duration: number;
  imageUrl: string;
  isCurrentSelected: boolean;
  isCurrentDictationPlaying: boolean;
  isCurrentDefaultPlaying: boolean;
  dateUnixTime: number;
  onPressDetail: () => void;
  onPressPlay: () => void;
  onPressDictationPlay: () => void;
  hasTranslatedTranscript: boolean;
  hasTranscript: boolean;
  canAutoScroll: boolean;
  canDictation: boolean;
};

const EpisodePlayCard = memo(
  ({
    title,
    channelTitle,
    duration,
    imageUrl,
    isCurrentSelected,
    isCurrentDictationPlaying,
    isCurrentDefaultPlaying,
    dateUnixTime,
    onPressDetail,
    onPressPlay,
    onPressDictationPlay,
    hasTranslatedTranscript,
    hasTranscript,
    canAutoScroll,
    canDictation,
  }: Props) => {
    const formattedDate = useMemo(() => {
      return formatDMMMYY(dateUnixTime);
    }, [dateUnixTime]);

    const formattedDuration = useMemo(() => {
      return formatDuration(duration);
    }, [duration]);
    return (
      <PressableScale style={styles.container} onPress={onPressDetail}>
        <ExpoImage style={styles.artwork} source={imageUrl} placeholder={IMAGE_DEFAULT_BLUR_HASH} />
        <View style={styles.info}>
          <View style={styles.texts}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
              {title}
            </Text>
            <Text numberOfLines={1} style={styles.channelTitle}>
              {channelTitle}
            </Text>
            <View style={styles.time}>
              <Text style={styles.duration}>{formattedDuration}</Text>
              <Text style={styles.pubDate}>{formattedDate}</Text>
            </View>
          </View>
          <View style={styles.icons}>
            {hasTranslatedTranscript ? (
              <View>
                <TranslateIcon width={18} height={18} color={theme.color.accents.normal} />
              </View>
            ) : hasTranscript ? (
              <View>
                <TextIcon width={18} height={18} color={theme.color.accents.normal} />
              </View>
            ) : null}
            {canAutoScroll && <Text style={styles.emoji}>🏃‍♀️</Text>}
            {canDictation && <Text style={styles.emoji}>📝</Text>}
          </View>
        </View>
        <PressableOpacity
          hitSlop={10}
          style={[styles.play, isCurrentSelected && styles.current]}
          onPress={onPressPlay}
        >
          <PlayPauseIcon
            isPlaying={isCurrentDefaultPlaying}
            isLoading={false}
            size={20}
            color={theme.color.accents.normal}
          />
        </PressableOpacity>
        {canDictation && (
          <PressableOpacity
            hitSlop={10}
            style={[styles.playDictation]}
            onPress={onPressDictationPlay}
          >
            <Text style={styles.playDictationText}>📝</Text>
            <PlayPauseIcon
              isPlaying={isCurrentDictationPlaying}
              isLoading={false}
              size={16}
              color={theme.color.accents.normal}
            />
          </PressableOpacity>
        )}
      </PressableScale>
    );
  },
);

EpisodePlayCard.displayName = 'EpisodePlayCard';

export default EpisodePlayCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: theme.color.bgNone,
    padding: 8,
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    position: 'relative',
  },
  artwork: {
    width: 110,
    height: 110,
    borderRadius: 6,
  },
  info: {
    flexShrink: 0,
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  texts: {
    flexShrink: 0,
    gap: 4,
  },
  icons: {
    flexDirection: 'row',
    gap: 4,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 18,
    paddingBottom: 8,
  },
  channelTitle: {
    color: theme.color.textWeak,
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.color.textMain,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 12,
    color: theme.color.textWeak,
  },
  pubDate: {
    fontSize: 12,
    color: theme.color.textWeak,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textMain,
    fontWeight: '300',
    marginTop: 8,
    width: '100%',
  },
  play: {
    width: 25,
    height: 25,
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    right: 8,
    bottom: 8,
    borderColor: theme.color.accents.normal,
    borderWidth: 1,
    borderRadius: 50,
  },
  playDictation: {
    height: 25,
    paddingHorizontal: 4,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    right: 44,
    bottom: 8,
    borderColor: theme.color.accents.normal,
    borderWidth: 1,
    borderRadius: 20,
  },
  playDictationText: {
    fontSize: 12,
    lineHeight: 14,
    color: theme.color.textMain,
  },
  current: {
    borderWidth: 1,
    borderRadius: 50,
  },
});
