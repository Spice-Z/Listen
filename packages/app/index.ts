import 'expo-router/entry';
import TrackPlayer from 'react-native-track-player';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { enableFreeze } from 'react-native-screens';

GoogleSignin.configure({
  webClientId: '',
});

TrackPlayer.registerPlaybackService(() => require('./service'));

enableFreeze();
