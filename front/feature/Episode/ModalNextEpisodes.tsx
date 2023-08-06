import {
 useState, useMemo,
} from 'react';
import {
 StyleSheet,
 View,
 Dimensions,
 ActivityIndicator,
 FlatList,
} from 'react-native';
import {
 usePlaybackState,
} from 'react-native-track-player';
import {
 PauseIcon, PlayIcon,
} from '../icons';
import { theme } from '../styles/theme';
import { useEpisodeByIds } from '../Episode/hooks/useEpisodeByIds';
import { useRouter } from 'expo-router';
import { useTrackPlayer } from '../Player/hooks/useTrackPlayer';
import EpisodeList from './components/EpisodeList';

const Separator = () => {
 return <View style={styles.separator} />
}

function ModalNextEpisodes() {
 const [playbackPosition, setPlaybackPosition] = useState(0);

 const playbackState = usePlaybackState();

 const { playingTrackDuration,
  currentQueue,
  currentTrack,
  currentPlaybackRate,
  switchPlaybackRate,
  isPlaying,
  isLoading,
 } = useTrackPlayer();
 const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
 const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;
 const { data } = useEpisodeByIds({
  channelId: currentEpisodeChannelId,
  episodeId: currentEpisodeId,
 })

 const playPauseButton = useMemo(() => {
  if (isLoading) {
   return <ActivityIndicator />
  }
  return isPlaying ? <PauseIcon fill={theme.color.textMain} width={20} height={20} /> : <PlayIcon fill={theme.color.textMain} width={20} height={20} />
 }, [isLoading, isPlaying])

 const router = useRouter()

 return <View style={styles.container}>
  <FlatList
   data={currentQueue}
   contentContainerStyle={styles.listContainer}
   renderItem={({ item }) => {
    const { id, title, artwork } = item;
    return <View style={styles.episodeContainer}>
     <EpisodeList
      id={id}
      title={title}
      imageUrl={artwork}
      onPress={() => { }}
     />
    </View>
   }}
   ItemSeparatorComponent={() => <Separator />}
   keyExtractor={(item) => item.id}
  />
 </View>;
}

const styles = StyleSheet.create({
 container: {
  backgroundColor: theme.color.bgMain,
  color: theme.color.textMain,
  width: '100%',
 },
 listContainer: {
  paddingHorizontal: 16,
  width: '100%',
 },
 episodeContainer: {
  flexDirection: 'row',
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
 playerContainer: {
  height: 100,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 16,
 },
 playerContainerItem: {
  width: '15%',
  alignItems: 'center',
 },
 playPauseButton: {
  backgroundColor: theme.color.accent,
  height: 56,
  width: 56,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
 },
 playbackRate: {
  color: theme.color.textMain,
  fontSize: 16,
  fontWeight: '800'
 },
 controlButton: {
  height: 56,
  width: 56,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
 },
 controlButtonText: {
  color: '#fff',
  fontSize: 16,
 },
 separator: {
  height: 8
 }
});

export default ModalNextEpisodes;
