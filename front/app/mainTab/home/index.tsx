import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback } from 'react';
import { useChannels } from '../../../feature/Channel/hooks/useChannels';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';


const SeparatorComponent = () => <View style={{ marginTop: 12 }} />

function App() {
  const query = useChannels();
  const router = useRouter();
  const onPress = useCallback(() => {
    router.push({ pathname: '/mainTab/home/player', params: { episodeId: 2 } })
  }, [router])
  const onPressChannel = useCallback((channelId: string) => {
    router.push({ pathname: '/mainTab/home/channel', params: { channelId } })
  }, [router])
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Channels'
        }}
      />
      <StatusBar style="auto" />
      <View style={styles.container}>
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

