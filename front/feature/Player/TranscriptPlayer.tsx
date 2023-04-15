import {
 useState, useEffect,
} from 'react';
import {
 StyleSheet,
 View,
 Text,
 ScrollView,
 Dimensions,
} from 'react-native';
import TrackPlayer, {
 usePlaybackState,
 useTrackPlayerEvents,
 Event,
 useProgress,
} from 'react-native-track-player';

import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import { useQuery } from '@tanstack/react-query';
import { getTranscriptFromUrl } from '../dataLoader/getTranscriptFromUrl';
import { useEpisodeByIds } from '../Episode/hooks/useEpisodeByIds';

function TranscriptPlayer() {
 const [activeCaptionIndex, setActiveCaptionIndex] = useState(null);
 const [playbackPosition, setPlaybackPosition] = useState(0);

 const playbackState = usePlaybackState();

 const { playingTrackDuration, currentQueue, currentTrack, currentPlaybackRate, switchPlaybackRate, isPlaying, isLoading } = useTrackPlayer();
 const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
 const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;
 const { data } = useEpisodeByIds({
  channelId: currentEpisodeChannelId,
  episodeId: currentEpisodeId,
 })
 const { isLoading: _isTranscriptLoading, data: transcriptData } = useQuery({
  queryKey: ['getTranscriptFromUrl', data?.transcriptUrl],
  queryFn: () => getTranscriptFromUrl(data?.transcriptUrl),
  enabled: !!data?.transcriptUrl,
 })

 useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
  setActiveCaptionIndex(null);
  setPlaybackPosition(0);
 });

 useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
  const track = await TrackPlayer.getCurrentTrack();
  if (track === null) {
   setActiveCaptionIndex(null);
   setPlaybackPosition(0);
  }
 });

 const progress = useProgress(500);

 useEffect(() => {
  const { position } = progress;
  setPlaybackPosition(position);
  if (transcriptData) {
   const transcription = transcriptData;
   const activeCaption = transcription.findIndex(
    (caption) => caption.start <= position && caption.end >= position,
   );
   setActiveCaptionIndex(activeCaption);
  }
 }, [progress, transcriptData]);

 return currentQueue.length === 0 || currentTrack === null ? <View style={styles.container}>
  <Text style={{ color: theme.color.textMain }}>No Playing </Text>
 </View> : (
  <View style={styles.container}>
   <ScrollView
    style={styles.captionsScrollView}
    contentContainerStyle={styles.captionsContainer}
   >
    {_isTranscriptLoading && <Text>Transcript is Loading...</Text>}
    {!!transcriptData ? transcriptData.map((caption, index) => (
     <Text
      key={index}
      style={[
       styles.captionText,
       activeCaptionIndex >= index ? styles.highlightedCaption : null,
      ]}
      selectable
     >
      {caption.text}
      {index < transcriptData.length - 1 ? ' ' : ''}
     </Text>
    )) : <Text style={styles.noTranscriptText}>No Transcript, sorry...</Text>}
   </ScrollView>
   <View style={styles.separator} />
   <ScrollView
    style={styles.captionsScrollView}
    contentContainerStyle={styles.captionsContainer}
   >
    {_isTranscriptLoading && <Text>Transcript is Loading...</Text>}
    {!!transcriptData ? transcriptData.map((caption, index) => (
     <Text
      key={index}
      style={[
       styles.captionText,
       activeCaptionIndex >= index ? styles.highlightedCaption : null,
      ]}
      selectable
     >
      {caption.text}
      {index < transcriptData.length - 1 ? ' ' : ''}
     </Text>
    )) : <Text style={styles.noTranscriptText}>No Transcript, sorry...</Text>}
   </ScrollView>

  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  backgroundColor: theme.color.bgMain,
  color: theme.color.textMain,
 },
 episodeContainer: {
  marginTop: 20,
  paddingHorizontal: 16,
  flexDirection: 'row',
  width: '100%',
  maxWidth: '100%',
 },
 thumbnail: {
  width: 50,
  height: 50,
  borderRadius: 8,
  backgroundColor: 'gray',
 },
 episodeInfo: {
  marginLeft: 8,
  flexShrink: 1,
 },
 episodeTitle: {
  color: theme.color.textMain,
  fontSize: 20,
  lineHeight: 26,
  fontWeight: '800'
 },
 channelName: {
  fontSize: 14,
  lineHeight: 18,
  color: theme.color.textWeak,
 },
 sliderContainer: {
  width: '100%',
  marginTop: 4,
 },
 seekBar: {
  width: Dimensions.get('window').width - 32,
  height: 20,
  marginHorizontal: 16,
 },
 captionsScrollView: {
  height: '49%',
 },
 captionsContainer: {
  paddingVertical: 20,
  paddingHorizontal: 16,
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: theme.color.bgEmphasis
 },
 captionText: {
  fontSize: 16,
  lineHeight: 22,
  color: theme.color.textWeak,
  fontWeight: '600',
 },
 highlightedCaption: {
  backgroundColor: theme.color.accent,
  fontWeight: '600',
 },
 separator: {
  width: '100%',
  marginTop: '1%',
  marginBottom: '1%',
  height: 1,
  backgroundColor: theme.color.bgEmphasis
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
