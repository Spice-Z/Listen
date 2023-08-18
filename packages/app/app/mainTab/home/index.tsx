import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback } from 'react';
import { useChannels } from '../../../feature/Channel/hooks/useChannels';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { useEpisodesOfAvailable } from '../../../feature/Episode/hooks/useEpisodesOfAvailable';
import { TrackPlayerTrack, useTrackPlayer } from '../../../feature/Player/hooks/useTrackPlayer';
import { useSignOut } from '../../../feature/Auth/hooks/useSignOut';


const SeparatorComponent = () => <View style={{ marginTop: 12 }} />

function App() {
  const query = useChannels();
  const availables = useEpisodesOfAvailable()
  const { playTrackIfNotCurrentlyPlaying } = useTrackPlayer();
  const router = useRouter();
  const onPress = useCallback(() => {
    const availableEpisodes = availables.data.episodes
    if (availableEpisodes.length === 0) {
      return;
    }
    const channelId = availables.data.episodesChannelIds[availableEpisodes[0].id]
    const track: TrackPlayerTrack = {
      id: availableEpisodes[0].id,
      channelId: channelId,
      title: availableEpisodes[0].title,
      artist: availableEpisodes[0].title,
      artwork: availableEpisodes[0].imageUrl || '',
      url: availableEpisodes[0].url,
      duration: availableEpisodes[0].duration,
      // TODO: add Date from pubDate
    }
    playTrackIfNotCurrentlyPlaying(track)
  }, [availables.data.episodes, availables.data.episodesChannelIds, playTrackIfNotCurrentlyPlaying])
  const onPressChannel = useCallback((channelId: string) => {
    router.push({ pathname: '/mainTab/home/channel', params: { channelId } })
  }, [router])
  const { signOut } = useSignOut()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Shows'
        }}
      />
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: theme.color.bgEmphasis,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 16,
          }}
        >
          <Text numberOfLines={3} style={styles.channelTitle}>Play!!</Text>
        </Pressable>
        <Pressable onPress={signOut}>
          <Text style={styles.channelTitle}>sign out!!</Text>
        </Pressable>
        <FlatList
          data={query.data ?? []}
          renderItem={({ item }) => {
            return <Pressable style={styles.channelCard} onPress={() => onPressChannel(item.id)}>
              {/* @ts-ignore */}
              <Image style={styles.artwork} src={item.imageUrl} />
              <Text numberOfLines={3} style={styles.channelTitle}>{item.title}</Text>
            </Pressable>
          }}
          ItemSeparatorComponent={SeparatorComponent}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    </>
  );
}

function FallBack() {
  return <View style={styles.container}>
    <View style={{ height: 16 }} />
    <SquareShimmer width='100%' height={80} />
    <View style={{ height: 16 }} />
    <SquareShimmer width='100%' height={80} />
    <View style={{ height: 16 }} />
    <SquareShimmer width='100%' height={80} />
    <View style={{ height: 16 }} />
    <SquareShimmer width='100%' height={80} />
    <View style={{ height: 16 }} />
    <SquareShimmer width='100%' height={80} />
  </View>
}

export default function withSuspense() {
  return (
    <Suspense fallback={<FallBack />}>
      <App />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  loading: {
    color: theme.color.textMain,
  },
  channelCard: {
    backgroundColor: theme.color.bgEmphasis,
    borderRadius: 8,
    color: theme.color.textMain,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 84,
    height: 84,
    borderRadius: 8,
  },
  channelTitle: {
    color: theme.color.textMain,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'bold',
    marginLeft: 12,
    flexShrink: 1,
  },
});

