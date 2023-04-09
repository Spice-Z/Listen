import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";

const loader = async () => {
  const data: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    author: string;
  }[] = [{
    id: '1',
    title: 'BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST',
    imageUrl: 'https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/21707347/21707347-1644160555988-248024357475.jpg',
    description: 'The latest global news, analysis and information from the BBC World Service.',
    author: 'BBC World Service',
  }];
  return data
};

const SeparatorComponent = () => <View style={{ marginTop: 12 }} />

export default function App() {
  const query = useQuery(["home_screen_loader"], loader);
  const router = useRouter();
  const onPress = useCallback(() => {
    router.push({ pathname: '/mainTab/home/player', params: { episodeId: 2 } })
  }, [router])
  const onPress2 = useCallback(() => {
    router.push({ pathname: '/mainTab/home/channel', params: { episodeId: 2 } })
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
        <Pressable style={styles.channelCard} onPress={onPress}>
          {/* @ts-ignore */}
          <Image style={styles.artwork} src='https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/21707347/21707347-1644160555988-248024357475.jpg' />
          <Text numberOfLines={3} style={styles.channelTitle}>BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST</Text>
        </Pressable>

        <View style={{ marginTop: 12 }} />
        <Pressable style={styles.channelCard} onPress={onPress2}>
          {/* @ts-ignore */}
          <Image style={styles.artwork} src='https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/21707347/21707347-1644160555988-248024357475.jpg' />
          <Text numberOfLines={3} style={styles.channelTitle}>BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST</Text>
        </Pressable>
        <FlatList
          data={query.data ?? []} renderItem={({ item }) => {
            return <Pressable style={styles.channelCard} onPress={onPress}>
              {/* @ts-ignore */}
              <Image style={styles.artwork} src={item.imageUrl} />
              <Text numberOfLines={3} style={styles.channelTitle}>{item.title}</Text>
            </Pressable>
          }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    paddingHorizontal: 16,
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
