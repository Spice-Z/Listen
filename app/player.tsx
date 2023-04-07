import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Player from '../feature/Player/Player';
import { Link } from 'expo-router';
import { useSearchParams } from "expo-router";

export default function PlayerPage() {
  

  return (
    <View style={styles.container}>
      <Player />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
