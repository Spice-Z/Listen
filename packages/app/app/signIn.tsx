import { memo } from 'react';

import AppleSignInButton from '../feature/Auth/AppleSignInButton';
import { theme } from '../feature/styles/theme';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import GoogleSignInButton from '../feature/Auth/GoogleSignInButton';

const SignIn = memo(() => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <View>
          <Image
            width={2292}
            height={2292}
            style={styles.image}
            source={require('../assets/image/login-artwork.png')}
          />
          <Text style={styles.text}>{`Listen English Podcast\nwith your language transcript`}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <AppleSignInButton />
          <View style={{ height: 20 }} />
          <GoogleSignInButton />
        </View>
      </SafeAreaView>
    </>
  );
});

export default SignIn;

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
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.color.textMain,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
