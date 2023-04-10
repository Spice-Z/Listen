import { Stack, useRouter, useSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { theme } from "../../../feature/styles/theme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import ChannelInfo from "../../../feature/Channel/components/ChannelInfo";
import EpisodeCard from "../../../feature/Episode/components/EpisodeCard";
import { getChannelById } from "../../../feature/dataLoader/getChannelById";
import { getEpisodesByChannelId } from "../../../feature/dataLoader/getEpisodesByChannelId";

export default function Channel() {
 const { channelId } = useSearchParams();
 const { isLoading, error, data } = useQuery({
  queryKey: ['getChannelById', channelId as string],
  queryFn: () => getChannelById(channelId as string),
 })
 const { isLoading: isEpisodeLoading, error: episodeError, data: episodeData } = useQuery({
  queryKey: ['getEpisodesByChannelId', channelId as string],
  queryFn: () => getEpisodesByChannelId(channelId as string),
 })
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
      imageUrl={item.imageUrl}
      onPress={onPressEpisode}
     />
    }}
    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
   />

  </View>
 </>
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