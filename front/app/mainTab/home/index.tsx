import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';


export default function App() {
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
