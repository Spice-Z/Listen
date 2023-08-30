import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGlobalSearchParams, Stack } from 'expo-router';
import Episode from '../../../feature/Episode/Episode';
import { theme } from '../../../feature/styles/theme';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import WithSuspenseAndBoundary from '../../../feature/Suspense/WithSuspenseAndBoundary';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';

const GET_EPISODE = gql(/* GraphQL */ `
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

const GET_CHANNEL = gql(/* GraphQL */ `
  query GetChannelInEpisode($channelId: String!) {
    channel(channelId: $channelId) {
      id
      channelId
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
    },
  });
  const episode = data.episode;

  const { data: channelData } = useSuspenseQuery(GET_CHANNEL, {
    variables: {
      channelId: channelId as string,
    },
  });
  const channel = channelData.channel;

  const { playTrackIfNotCurrentlyPlaying, currentTrack, isPlaying, isLoading } = useTrackPlayer();
  const isThisEpisodeLoading = useMemo(() => {
    if (isLoading) {
      return currentTrack?.url === episode.url;
    }
    return false;
  }, [currentTrack?.url, episode, isLoading]);
  const isThisEpisodePlaying = useMemo(() => {
    if (!episode) {
      return false;
    }
    if (!isPlaying) {
      return false;
    }
    return currentTrack?.url === episode.url;
  }, [currentTrack?.url, episode, isPlaying]);
  const onPressPlay = useCallback(async () => {
    if (isThisEpisodePlaying) {
      TrackPlayer.pause();
    } else {
      const track: TrackPlayerTrack = {
        id: episode.episodeId,
        channelId: channel.channelId,
        title: episode.title,
        artist: channel.title,
        artwork: episode.imageUrl || channel.imageUrl,
        url: episode.url,
        duration: episode.duration,
        // TODO: add Date from pubDate
      };
      console.log({ track });
      await playTrackIfNotCurrentlyPlaying(track);
      // TODO: 連続再生のために、次のエピソードをqueueに入れる
    }
  }, [
    channel.channelId,
    channel.imageUrl,
    channel.title,
    episode.duration,
    episode.episodeId,
    episode.imageUrl,
    episode.title,
    episode.url,
    isThisEpisodePlaying,
    playTrackIfNotCurrentlyPlaying,
  ]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: episode.title,
          }}
        />
        <Episode
          channelTitle={channel.title}
          dateUnixTime={episode.pubDate}
          episodeTitle={episode.title}
          episodeDescription={episode.content}
          episodeImageUrl={episode.imageUrl || channel.imageUrl}
          duration={episode.duration}
          isPlaying={isThisEpisodePlaying}
          isLoading={isThisEpisodeLoading}
          onPressPlay={onPressPlay}
        />
        <MiniPlayerSpacer />
      </ScrollView>
    </>
  );
}

function FallBack() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'white' }}>loading...</Text>
    </View>
  );
}

export default function withSuspense() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '',
        }}
      />
      <WithSuspenseAndBoundary fallback={<FallBack />}>
        <EpisodePage />
      </WithSuspenseAndBoundary>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
});
