import 'expo-router/entry';
import TrackPlayer from 'react-native-track-player';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '',
});

TrackPlayer.registerPlaybackService(() => require('./service'));
