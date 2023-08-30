import { StyleSheet, View } from 'react-native';
import { useTrackPlayer } from '../hooks/useTrackPlayer';
import { Image as ExpoImage } from 'expo-image';
import { IMAGE_DEFAULT_BLUR_HASH } from '../../../constants';

type Props = {
  width: number;
  height: number;
  borderRadius: number;
};
export default function ArtworkImage({ width, height, borderRadius }: Props) {
  const { currentTrack } = useTrackPlayer();

  return currentTrack !== null && typeof currentTrack.artwork === 'string' ? (
    <ExpoImage
      style={[styles.artwork, { width, height, borderRadius }]}
      source={currentTrack.artwork}
      placeholder={IMAGE_DEFAULT_BLUR_HASH}
    />
  ) : (
    <View style={[styles.artwork, { width, height, borderRadius }]} />
  );
}

const styles = StyleSheet.create({
  artwork: {
    backgroundColor: 'gray',
  },
});
