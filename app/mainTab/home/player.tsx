import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Stack, useSearchParams, useRouter } from "expo-router";
import Player from '../../../feature/Player/Player';

export default function PlayerPage() {
  const router = useRouter();
  const params = useSearchParams();
  const title = typeof params.name === "string" ? params.name : 'Player';

  return (
    <View style={styles.container}>
      <Player />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
