import { memo, useCallback } from 'react';

import { theme } from '../feature/styles/theme';
import { Linking, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import PressableScale from '../feature/Pressable/PressableScale';

const isIOS = Platform.OS === 'ios';

const AskUpdate = memo(() => {
  const openAppStore = useCallback(() => {
    Linking.openURL('https://www.apple.com/jp/app-store/').catch((err) =>
      console.error('An error occurred', err),
    );
  }, []);
  const openGooglePlay = useCallback(() => {
    Linking.openURL('https://play.google.com/store/apps').catch((err) =>
      console.error('An error occurred', err),
    );
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.sorry}>🙇‍♀️🙏🙇‍♂️</Text>
          <Text style={styles.text}>{`新しいバージョンのアプリ\nが公開されています。`}</Text>
          <Text style={styles.text}>{`ストアからアプリ\nアップデートしてください。`}</Text>
          {isIOS ? (
            <PressableScale onPress={openAppStore}>
              <Text style={styles.text}>App Storeを開く</Text>
            </PressableScale>
          ) : (
            <PressableScale onPress={openGooglePlay}>
              <Text style={styles.text}>Google Playを開く</Text>
            </PressableScale>
          )}
        </View>
      </SafeAreaView>
    </>
  );
});

export default AskUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgEmphasis,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  image: {
    width: '90%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  sorry: {
    fontSize: 64,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.color.textMain,
    textAlign: 'center',
    marginTop: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
