import { ScrollView, StyleSheet, View } from 'react-native';

import { useGlobalSearchParams, Stack, useRouter } from 'expo-router';
import Episode from '../../../feature/Episode/Episode';
import { theme } from '../../../feature/styles/theme';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { memo, useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import WithSuspenseAndBoundary from '../../../feature/Suspense/WithSuspenseAndBoundary';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import BannerAdMob from '../../../feature/Ad/BannerAdMob';
import { usePlayerContext } from '../../../feature/context/player/context';

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
      hasChangeableAd
      transcriptUrl
      translatedTranscripts {
        language
        transcriptUrl
      }
      canDictation
      channel {
        id
        channelId
        title
        imageUrl
        author
      }
    }
  }
`);

function EpisodePage() {
  const router = useRouter();
  const { playType, setPlayType } = usePlayerContext();
  const { channelId, episodeId } = useGlobalSearchParams();
  const { data } = useSuspenseQuery(GET_EPISODE, {
    variables: {
      channelId: channelId as string,
      episodeId: episodeId as string,
    },
  });
  const episode = data.episode;
  const hasTranscript = useMemo(() => {
    return episode.transcriptUrl !== null;
  }, [episode]);
  const hasTranslatedTranscript = useMemo(() => {
    return episode.translatedTranscripts.length > 0;
  }, [episode]);
  const canAutoScroll = useMemo(() => {
    return !episode.hasChangeableAd && hasTranscript;
  }, [episode.hasChangeableAd, hasTranscript]);

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
      if (playType === 'dictation') {
        setPlayType('default');
        router.push('/modalPlayer');
      } else {
        TrackPlayer.pause();
      }
    } else {
      const track: TrackPlayerTrack = {
        id: episode.episodeId,
        channelId: episode.channel.channelId,
        title: episode.title,
        artist: episode.channel.title,
        artwork: episode.imageUrl || episode.channel.imageUrl,
        url: episode.url,
        duration: episode.duration,
        // TODO: add Date from pubDate
      };
      await playTrackIfNotCurrentlyPlaying(track);
      setPlayType('default');
      router.push('/modalPlayer');
    }
  }, [
    episode.channel.channelId,
    episode.channel.imageUrl,
    episode.channel.title,
    episode.duration,
    episode.episodeId,
    episode.imageUrl,
    episode.title,
    episode.url,
    isThisEpisodePlaying,
    playTrackIfNotCurrentlyPlaying,
    playType,
    router,
    setPlayType,
  ]);

  const onPressDictationPlay = useCallback(async () => {
    if (isThisEpisodePlaying) {
      if (playType === 'default') {
        setPlayType('dictation');
        router.push('/modalDictationPlayer');
      } else {
        TrackPlayer.pause();
      }
    } else {
      const track: TrackPlayerTrack = {
        id: episode.episodeId,
        channelId: episode.channel.channelId,
        title: episode.title,
        artist: episode.channel.title,
        artwork: episode.imageUrl || episode.channel.imageUrl,
        url: episode.url,
        duration: episode.duration,
        // TODO: add Date from pubDate
      };
      await playTrackIfNotCurrentlyPlaying(track);
      setPlayType('dictation');
      router.push('/modalDictationPlayer');
    }
  }, [
    episode.channel.channelId,
    episode.channel.imageUrl,
    episode.channel.title,
    episode.duration,
    episode.episodeId,
    episode.imageUrl,
    episode.title,
    episode.url,
    isThisEpisodePlaying,
    playTrackIfNotCurrentlyPlaying,
    playType,
    router,
    setPlayType,
  ]);

  const onPressChannel = useCallback(() => {
    router.push({
      pathname: 'mainTab/search/channel',
      params: { channelId: episode.channel.channelId },
    });
  }, [episode.channel.channelId, router]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: episode.title,
          }}
        />
        <Episode
          channelTitle={episode.channel.title}
          channelAuthor={episode.channel.author}
          dateUnixTime={episode.pubDate}
          episodeTitle={episode.title}
          episodeDescription={episode.content}
          episodeImageUrl={episode.imageUrl || episode.channel.imageUrl}
          duration={episode.duration}
          isPlaying={isThisEpisodePlaying}
          isLoading={isThisEpisodeLoading}
          onPressChannel={onPressChannel}
          onPressPlay={onPressPlay}
          currentPlayType={playType}
          onPressDictationPlay={onPressDictationPlay}
          hasTranslatedTranscript={hasTranslatedTranscript}
          hasTranscript={hasTranscript}
          canAutoScroll={canAutoScroll}
          canDictation={episode.canDictation && hasTranscript}
        />
        <View style={styles.adContainer}>
          <BannerAdMob size={BannerAdSize.MEDIUM_RECTANGLE} />
        </View>
        <MiniPlayerSpacer />
      </ScrollView>
    </>
  );
}

const FallBack = memo(() => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <SquareShimmer width={60} height={60} />
        <View style={{ width: 8 }} />
        <SquareShimmer width={200} height={40} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SquareShimmer width="100%" height={122} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SquareShimmer width="100%" height={200} />
      </View>
    </View>
  );
});

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
    paddingHorizontal: 16,
  },
  adContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
});
