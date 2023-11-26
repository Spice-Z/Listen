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

type Props = {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl: string;
  dateUnixTime: number;
  onPress: (id: string) => void;
  hasTranslatedTranscript: boolean;
  hasTranscript: boolean;
  canAutoScroll: boolean;
  canDictation: boolean;
};

function removeTagsFromString(htmlString) {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
}
function convertNewlinesToSpaces(text) {
  return text.replace(/\r\n|\r|\n/g, '  ');
}

const EpisodeCard = memo(
  ({
    id,
    title,
    description,
    duration,
    imageUrl,
    dateUnixTime,
    onPress,
    hasTranslatedTranscript,
    hasTranscript,
    canAutoScroll,
    canDictation,
  }: Props) => {
    const arrangedDescription = useMemo(() => {
      return convertNewlinesToSpaces(removeTagsFromString(description));
    }, [description]);
    const onPressItem = () => onPress(id);

    const formattedDate = useMemo(() => {
      return formatDMMMYY(dateUnixTime);
    }, [dateUnixTime]);

    const formattedDuration = useMemo(() => {
      return formatDuration(duration);
    }, [duration]);

    return (
      <PressableScale style={styles.container} onPress={onPressItem}>
        <View style={styles.cardHead}>
          <ExpoImage
            style={styles.artwork}
            source={imageUrl}
            placeholder={IMAGE_DEFAULT_BLUR_HASH}
          />
          <View style={styles.texts}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <View style={styles.info}>
              <Text style={styles.duration}>{formattedDuration}</Text>
              <Text style={styles.pubDate}>{formattedDate}</Text>
              {hasTranslatedTranscript ? (
                <View style={styles.goodTranscript}>
                  <TranslateIcon width={18} height={18} color={theme.color.accent} />
                </View>
              ) : hasTranscript ? (
                <View style={styles.goodTranscript}>
                  <TextIcon width={14} height={14} color={theme.color.accent} />
                </View>
              ) : null}
              {canAutoScroll && <Text>🏃‍♀️</Text>}
              {canDictation && <Text>📝</Text>}
            </View>
          </View>
        </View>
        <Text numberOfLines={3} style={styles.description}>
          {arrangedDescription}
        </Text>
      </PressableScale>
    );
  },
);

EpisodeCard.displayName = 'EpisodeCard';

export default EpisodeCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: theme.color.bgEmphasis,
    padding: 8,
  },
  cardHead: {
    flexDirection: 'row',
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  texts: {
    flexShrink: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.color.textMain,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  duration: {
    color: theme.color.textWeak,
  },
  pubDate: {
    color: theme.color.textWeak,
    marginLeft: 8,
  },
  goodTranscript: {
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textMain,
    fontWeight: '300',
    marginTop: 8,
    width: '100%',
  },
});
