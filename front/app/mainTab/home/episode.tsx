import { StyleSheet, View } from 'react-native';

import { useSearchParams, useRouter, Stack } from "expo-router";
import Episode from '../../../feature/Episode/Episode';
import { useQuery } from '@tanstack/react-query';
import { getEpisodeById } from '../../../feature/dataLoader/getEpisodeById';
import { getChannelById } from '../../../feature/dataLoader/getChannelById';
import { theme } from '../../../feature/styles/theme';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';

export default function EpisodePage() {
 const router = useRouter();
 const { channelId, episodeId } = useSearchParams();
 const { isLoading: isChannelLoading, data: channelData } = useQuery({
  queryKey: ['getChannelById', channelId as string],
  queryFn: () => getChannelById(channelId as string),
 })
 const { isLoading, error, data } = useQuery({
  queryKey: ['getEpisodeById', channelId, episodeId],
  queryFn: () => getEpisodeById(channelId as string, episodeId as string),
 })

 const { playTrackIfNotCurrentlyPlaying, currentTrack, isPlaying } = useTrackPlayer();
 const isThisEpisodePlaying = useMemo(() => {
  if (!data) {
   return false
  }
  if (!isPlaying) {
   return false;
  }
  return currentTrack?.url === data?.url;
 }, [currentTrack?.url, data, isPlaying])
 const onPressPlay = useCallback(() => {
  if (!data || !channelData) {
   return;
  }
  if (isThisEpisodePlaying) {
   TrackPlayer.pause()
  } else {
   const track: TrackPlayerTrack = {
    id: data.id,
    channelId: channelData.id,
    title: data.title,
    artist: channelData.title,
    date: 'Tue, 04 Apr 2023 21:00:15 GMT',
    artwork: data.imageUrl || channelData.imageUrl,
    url: data.url,
    duration: data.duration,
   }
   playTrackIfNotCurrentlyPlaying(track);
  }
 }, [channelData, data, isThisEpisodePlaying, playTrackIfNotCurrentlyPlaying])

 return <>
  <Stack.Screen
   options={{
    title: ''
   }}
  />
  <View style={styles.container}>
   {(!channelData || !data) ? null :
    <>
     <Stack.Screen
      options={{
       title: data.title || '',
      }}
     />
     <Episode
      channelTitle={channelData.title}
      date={data.pubDate}
      episodeTitle={data.title}
      episodeDescription={data.content}
      episodeImageUrl={data.imageUrl || channelData.imageUrl}
      duration={data.duration}
      isPlaying={isThisEpisodePlaying}
      onPressPlay={onPressPlay}
     />
    </>
   }
  </View>
 </>;
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
 },
});
