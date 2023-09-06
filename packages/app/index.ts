import 'expo-router/entry';
import TrackPlayer from 'react-native-track-player';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SplashScreen from 'expo-splash-screen';
import { enableFreeze } from 'react-native-screens';

// 本当はログイン状態などをみてSplashScreenを制御したいが
// 一旦固定の時間で指定しても違和感なさそうなので
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 700);

GoogleSignin.configure({
  webClientId: '',
});

TrackPlayer.registerPlaybackService(() => require('./service'));

enableFreeze();
