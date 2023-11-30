import 'expo-router/entry';
import TrackPlayer from 'react-native-track-player';
import { enableFreeze } from 'react-native-screens';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure();

TrackPlayer.registerPlaybackService(() => require('./service'));

enableFreeze();
