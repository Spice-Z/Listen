import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';


export default function App() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Channels'
        }}
      />
      <View style={styles.container}>
        <Link style={styles.link} href={{ pathname: "/mainTab/home/player", params: { episodeId: 1 } }} >Episode 1</Link>
        <Link style={styles.link} href={{ pathname: "/mainTab/home/player", params: { episodeId: 2 } }} >Episode 2</Link>
        <Link style={styles.link} href={{ pathname: "/mainTab/setting" }} >Setting</Link>
        <Link style={styles.link} href="/modal">Present modal</Link>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: theme.color.textMain
  }
});
