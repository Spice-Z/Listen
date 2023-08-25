import { Image, StyleSheet, View } from 'react-native';
import { useTrackPlayer } from '../hooks/useTrackPlayer';

type Props = {
  width: number;
  height: number;
  borderRadius: number;
};
export default function ArtworkImage({ width, height, borderRadius }: Props) {
  const { currentTrack } = useTrackPlayer();

  return currentTrack !== null && typeof currentTrack.artwork === 'string' ? (
    // @ts-ignore
    <Image style={[styles.artwork, { width, height, borderRadius }]} src={currentTrack.artwork} />
  ) : (
    <View style={[styles.artwork, { width, height, borderRadius }]} />
  );
}

const styles = StyleSheet.create({
  artwork: {
    backgroundColor: 'gray',
  },
});
