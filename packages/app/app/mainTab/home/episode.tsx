import { StyleSheet, Text, View } from 'react-native';

import { useGlobalSearchParams, Stack } from "expo-router";
import Episode from '../../../feature/Episode/Episode';
import { theme } from '../../../feature/styles/theme';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { Suspense, useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';
import { useEpisodeByIds } from '../../../feature/Episode/hooks/useEpisodeByIds';
import { useChannelById } from '../../../feature/Channel/hooks/useChannelById';
import { useEpisodesByChannelId } from '../../../feature/Episode/hooks/useEpisodesByChannelId';

function EpisodePage() {
 const { channelId, episodeId } = useGlobalSearchParams();
 const { data: channelData } = useChannelById(channelId as string)
 const { data: episodesData } = useEpisodesByChannelId(channelId as string);
 const { data } = useEpisodeByIds({
  channelId: channelId as string,
  episodeId: episodeId as string,
 });

 const { playTrackIfNotCurrentlyPlaying, currentTrack, isPlaying, isLoading } = useTrackPlayer();
 const isThisEpisodeLoading = useMemo(() => {
  if (isLoading && !!data) {
   return currentTrack?.url === data?.url;
  }
  return false
 }, [currentTrack?.url, data, isLoading])
 const isThisEpisodePlaying = useMemo(() => {
  if (!data) {
   return false
  }
  if (!isPlaying) {
   return false;
  }
  return currentTrack?.url === data?.url;
 }, [currentTrack?.url, data, isPlaying])
 const onPressPlay = useCallback(async () => {
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
    artwork: data.imageUrl || channelData.imageUrl,
    url: data.url,
    duration: data.duration,
    // TODO: add Date from pubDate
   }
   console.log({ track })
   await playTrackIfNotCurrentlyPlaying(track);
   // add queue
   if (episodesData) {
    const tracks: TrackPlayerTrack[] = episodesData.filter(episode => episode.id !== data.id).map((episode) => {
     return {
      id: episode.id,
      channelId: channelData.id,
      title: episode.title,
      artist: channelData.title,
      artwork: episode.imageUrl || channelData.imageUrl,
      url: episode.url,
      duration: episode.duration,
     }
    })
    if (tracks.length > 1) {
     console.log(tracks.length)
     TrackPlayer.add(tracks)
    }
   }
  }
 }, [channelData, data, episodesData, isThisEpisodePlaying, playTrackIfNotCurrentlyPlaying])

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
      isLoading={isThisEpisodeLoading}
      onPressPlay={onPressPlay}
     />
    </>
   }
  </View>
 </>;
}

function FallBack() {
 return <View style={styles.container}>
  <Text style={{ color: 'white' }}>loading...</Text>
 </View>
}

export default function withSuspense() {
 return <Suspense fallback={<FallBack />}>
  <EpisodePage />
 </Suspense>
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
 },
});
