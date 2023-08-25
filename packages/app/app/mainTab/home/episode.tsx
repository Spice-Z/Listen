import { StyleSheet, Text, View } from 'react-native';

import { useGlobalSearchParams, Stack } from "expo-router";
import Episode from '../../../feature/Episode/Episode';
import { theme } from '../../../feature/styles/theme';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';
import { useEpisodesByChannelId } from '../../../feature/Episode/hooks/useEpisodesByChannelId';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import WithSuspense from '../../../feature/Suspense/WithSuspense';


const GET_EPISODE = gql(/* GraphQL */`
  query GetEpisode($channelId: String!, $episodeId: String!) {
    episode(channelId: $channelId, episodeId: $episodeId) {
      id
      episodeId
      title
      content
      url
      imageUrl
      duration
      pubDate
    }
  }
`);

const GET_CHANNEL = gql(/* GraphQL */`
  query GetChannelInEpisode($channelId: String!) {
    channel(channelId: $channelId) {
      id
      title
      imageUrl
      author
    }
  }
`);

function EpisodePage() {
  const { channelId, episodeId } = useGlobalSearchParams();
  const { data } = useSuspenseQuery(GET_EPISODE, {
    variables: {
      channelId: channelId as string,
      episodeId: episodeId as string,
    }
  });
  const episode = data.episode

  const { data: channelData } = useSuspenseQuery(GET_CHANNEL, {
    variables: {
      channelId: channelId as string,
    }
  })
  const channel = channelData.channel

  const { data: episodesData } = useEpisodesByChannelId(channelId as string);

  const { playTrackIfNotCurrentlyPlaying, currentTrack, isPlaying, isLoading } = useTrackPlayer();
  const isThisEpisodeLoading = useMemo(() => {
    if (isLoading) {
      return currentTrack?.url === episode.url;
    }
    return false
  }, [currentTrack?.url, episode, isLoading])
  const isThisEpisodePlaying = useMemo(() => {
    if (!episode) {
      return false
    }
    if (!isPlaying) {
      return false;
    }
    return currentTrack?.url === episode.url;
  }, [currentTrack?.url, episode, isPlaying])
  const onPressPlay = useCallback(async () => {
    if (isThisEpisodePlaying) {
      TrackPlayer.pause()
    } else {
      const track: TrackPlayerTrack = {
        id: episode.episodeId,
        channelId: channel.id,
        title: episode.title,
        artist: channel.title,
        artwork: episode.imageUrl || channel.imageUrl,
        url: episode.url,
        duration: episode.duration,
        // TODO: add Date from pubDate
      }
      console.log({ track })
      await playTrackIfNotCurrentlyPlaying(track);
      // add queue
      if (episodesData) {
        const tracks: TrackPlayerTrack[] = episodesData.filter(episode => episode.id !== episode.id).map((episode) => {
          return {
            id: episode.id,
            episodeId: episode.id,
            channelId: channel.id,
            title: episode.title,
            artist: channel.title,
            artwork: episode.imageUrl || channel.imageUrl,
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
  }, [channel.id, channel.imageUrl, channel.title, episode.duration, episode.episodeId, episode.id, episode.imageUrl, episode.title, episode.url, episodesData, isThisEpisodePlaying, playTrackIfNotCurrentlyPlaying])

  return <>
    <Stack.Screen
      options={{
        title: ''
      }}
    />
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: episode.title || '',
        }}
      />
      <Episode
        channelTitle={channel.title}
        date={new Date()}
        episodeTitle={episode.title}
        episodeDescription={episode.content}
        episodeImageUrl={episode.imageUrl || channel.imageUrl}
        duration={episode.duration}
        isPlaying={isThisEpisodePlaying}
        isLoading={isThisEpisodeLoading}
        onPressPlay={onPressPlay}
      />
    </View>
  </>;
}

function FallBack() {
  return <View style={styles.container}>
    <Text style={{ color: 'white' }}>loading...</Text>
  </View>
}

export default function withSuspense() {
  return <WithSuspense fallback={<FallBack />}>
    <EpisodePage />
  </WithSuspense>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
});
