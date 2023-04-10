import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { firebase } from '@react-native-firebase/functions';

const loader = async () => {
  const app = firebase.app();
  const functions = app.functions('asia-northeast1');
  const getChannels = functions.httpsCallable('getChannels')
  const response = await getChannels({})
  const data: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    author: string;
  }[] = response.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    description: item.description,
  }))
  return data
};

const SeparatorComponent = () => <View style={{ marginTop: 12 }} />

export default function App() {

  const query = useQuery(["home_screen_loader"], loader);
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
