
import {
 StyleSheet,
 View,
 Text,
} from 'react-native';
import {
 useProgress,
} from 'react-native-track-player';

import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import { useEpisodeByIds } from '../Episode/hooks/useEpisodeByIds';
import TranscriptScrollBox from './components/TranscriptScrollBox';

function TranscriptPlayer() {
 const { currentQueue, currentTrack, isPlaying, isLoading } = useTrackPlayer();
 const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
 const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;
 const { data } = useEpisodeByIds({
  channelId: currentEpisodeChannelId,
  episodeId: currentEpisodeId,
 })

 const progress = useProgress(500);

 return currentQueue.length === 0 || currentTrack === null ? <View style={styles.container}>
  <Text style={{ color: theme.color.textMain }}>No Playing </Text>
 </View> : (
  <View style={styles.container}>
   <TranscriptScrollBox
    transcriptUrl={data?.transcriptUrl}
    currentTimePosition={progress.position}
    height={'49%'}
   />
   <View style={styles.separator}>
    <Text>a</Text>
   </View>
   <TranscriptScrollBox
    transcriptUrl={data?.transcriptUrl}
    currentTimePosition={progress.position}
    height={'49%'}
   />
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  width: '100%',
  backgroundColor: theme.color.bgMain,
  color: theme.color.textMain,
 },
 separator: {
  width: '100%',
  height: 4,
 },
 noTranscriptText: {
  width: '100%',
  fontSize: 20,
  lineHeight: 26,
  fontWeight: '800',
  textAlign: 'center',
  color: theme.color.textMain,
 }
});

export default TranscriptPlayer;
