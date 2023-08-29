import { StyleSheet, View } from 'react-native';
import { MINI_PLAYER_HEIGHT } from '../../constants';
import { memo } from 'react';
import { useHideMiniPlayer } from '../hooks/useHideMiniPlayer';

const MiniPlayerSpacer = memo(() => {
  const hideMiniPlayer = useHideMiniPlayer();

  return <View style={hideMiniPlayer ? styles.noPlayerContainer : styles.container} />;
});

export default MiniPlayerSpacer;

const styles = StyleSheet.create({
  container: {
    height: MINI_PLAYER_HEIGHT + 20,
  },
  noPlayerContainer: {
    height: 20,
  },
});
