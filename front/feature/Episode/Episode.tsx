import { memo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { PauseIcon, PlayIcon } from '../icons';

type Props = {
  channelTitle: string;
  episodeTitle: string;
  episodeDescription: string;
  episodeImageUrl: string;
  duration: number;
  isPlaying: boolean;
  onPressPlay: () => void;
};

const Episode = memo(({
  channelTitle,
  episodeTitle,
  episodeDescription,
  episodeImageUrl,
  duration,
  isPlaying,
  onPressPlay
}: Props) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.head}>
        <Image style={styles.image} source={{ uri: episodeImageUrl }} />
        <Text numberOfLines={3} style={styles.channelTitle}>{channelTitle}</Text>
      </View>
      <Text selectable style={styles.episodeTitle}>{episodeTitle}</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.duration} >{duration}</Text>
        <Pressable style={styles.playButton} onPress={onPressPlay}>
          {isPlaying ? <PauseIcon width={30} height={30} fill={theme.color.textMain} /> : <PlayIcon width={30} height={30} fill={theme.color.textMain} />}
        </Pressable>
      </View>
      <Text selectable style={styles.description}>{episodeDescription}</Text>
    </ScrollView>
  );
})

Episode.displayName = 'Episode';

export default Episode;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  head: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  channelTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.color.textWeak,
    flexShrink: 1,
    marginLeft: 8,
  },
  episodeTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: theme.color.textMain,
    marginTop: 12,
  },
  description: {
    color: theme.color.textWeak,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  duration: {
    color: theme.color.textWeak
  },
  buttonContainer: {
    marginTop: 8,
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
  }
});