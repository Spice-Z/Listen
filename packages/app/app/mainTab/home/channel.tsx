import { Stack, useRouter, useGlobalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { theme } from "../../../feature/styles/theme";
import { Suspense, useCallback, useMemo } from "react";
import ChannelInfo from "../../../feature/Channel/components/ChannelInfo";
import EpisodeCard from "../../../feature/Episode/components/EpisodeCard";
import { useEpisodesByChannelId } from "../../../feature/Episode/hooks/useEpisodesByChannelId";
import { useChannelById } from "../../../feature/Channel/hooks/useChannelById";
import SquareShimmer from "../../../feature/Shimmer/SquareShimmer";

function Channel() {
 const { channelId } = useGlobalSearchParams();
 const { isLoading, error, data } = useChannelById(channelId as string)
 const { isLoading: isEpisodeLoading, error: episodeError, data: episodeData } = useEpisodesByChannelId(channelId as string);
 const router = useRouter();
 const channelInfo = useMemo(() => {
  if (data) {
   return {
    title: data.title,
    imageUrl: data.imageUrl,
    description: data.description,
    author: data.author
   }
  }
  return {
   title: '',
   imageUrl: '',
   description: '',
   author: ''
  }
 }, [data])

 const ChanelInfoComponent = useMemo(() => {
  return isLoading ? <Text>loading...</Text> : <>
   <ChannelInfo channelInfo={channelInfo} />
   <Text style={styles.episodeHead}>All Episodes</Text>
  </>
 }, [channelInfo, isLoading])

 const onPressEpisode = useCallback((episodeId: string) => {
  router.push({ pathname: '/mainTab/home/episode', params: { channelId, episodeId } })
 }, [channelId, router])

 return <>
  <Stack.Screen
   options={{
    title: channelInfo.title
   }}
  />
  <View style={styles.container}>
   <FlatList
    ListHeaderComponent={ChanelInfoComponent}
    data={episodeData}
    renderItem={({ item }) => {
     return <EpisodeCard
      key={item.id}
      id={item.id}
      title={item.title}
      description={item.description}
      duration={item.duration}
      imageUrl={item.imageUrl || channelInfo.imageUrl}
      date={item.pubDate}
      onPress={onPressEpisode}
     />
    }}
    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
   />

  </View>
 </>
}

function FallBack() {
 return <View style={styles.container}>
  <View style={{ flexDirection: 'row' }} >
   <SquareShimmer width={122} height={122} />
   <View style={{ width: 16 }} />
   <SquareShimmer width='100%' height={60} />
  </View>
  <View style={{ marginTop: 16 }} >
   <SquareShimmer width='100%' height={122} />
  </View>
  <View style={{ marginTop: 16 }} >
   <SquareShimmer width='100%' height={18} />
  </View>
  <View style={{ marginTop: 16 }} >
   <SquareShimmer width='100%' height={80} />
   <View style={{ height: 16 }} />
   <SquareShimmer width='100%' height={80} />
   <View style={{ height: 16 }} />
   <SquareShimmer width='100%' height={80} />
   <View style={{ height: 16 }} />
   <SquareShimmer width='100%' height={80} />
  </View>
 </View >
}

export default function withSuspense() {
 return <Suspense fallback={<FallBack />}>
  <Channel />
 </Suspense>
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
  paddingHorizontal: 16,
 },
 episodeHead: {
  marginVertical: 16,
  fontSize: 18,
  fontWeight: 'bold',
  paddingHorizontal: 16,
  color: theme.color.textMain
 }
});