import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";
import { useTrackPlayer } from "./hooks/useTrackPlayer";
import { useRouter } from "expo-router";
import { PauseIcon, PlayIcon } from "../icons";
import TrackPlayer from "react-native-track-player";
import ArtworkImage from "./components/ArtworkImage";
import { useMemo } from "react";

type Props = {
  hide: boolean;
}
export default function MiniPlayer({ hide }: Props) {
  const { isPlaying, isLoading, currentTrack } = useTrackPlayer();
  const hasPlayingTrack = currentTrack !== null;
  const router = useRouter();

  const handlePlayPause = async () => {
    if (isLoading) {
      return
    }
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play()
    }
  };
  const playPauseButton = useMemo(() => {
    if (isLoading) {
      return <ActivityIndicator />
    }
    return isPlaying ? <PauseIcon fill={theme.color.textMain} width={20} height={20} /> : <PlayIcon fill={theme.color.textMain} width={20} height={20} />
  }, [isLoading, isPlaying])
  return hasPlayingTrack && !hide ?
    <Pressable style={styles.container} onPress={() => { router.push('/modalPlayer') }}>
      <ArtworkImage width={34} height={34} borderRadius={6} />
      <View style={styles.texts}>
        <Text numberOfLines={1} style={styles.title}>{currentTrack.title}</Text>
        <Text numberOfLines={1} style={styles.channel}>{currentTrack.artist}</Text>
      </View>
      <Pressable style={styles.button} onPress={handlePlayPause}>
        {playPauseButton}
      </Pressable>
    </Pressable> : null
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 12,
    borderRadius: 4,
    marginHorizontal: 6,
    padding: 4,
    shadowColor: theme.color.bgEmphasis,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
  },
  artwork: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: 'gray'
  },
  texts: {
    marginLeft: 4,
    width: Dimensions.get("window").width - 12 - 28 - 4 - 34 - 4 - 4 - 4 - 4,
  },
  title: {
    color: theme.color.textMain,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  channel: {
    color: theme.color.textWeak,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  button: {
    width: 28,
    height: 28,
    backgroundColor: theme.color.accent,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  }
});