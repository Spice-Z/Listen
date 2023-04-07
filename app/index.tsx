import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';


export default function App() {
  return (
    <View style={styles.container}>
      <Link href={{pathname:"/player",params: { episodeId: 1 }}} >Episode 1</Link>
      <Link href={{pathname:"/player",params: { episodeId: 2 }}} >Episode 2</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
