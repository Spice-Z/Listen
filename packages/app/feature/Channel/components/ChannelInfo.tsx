import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";
import { memo } from "react";

const ChannelInfo = memo(({ channelInfo }: { channelInfo: { title: string, imageUrl: string, description: string, author: string } }) => {
 return <View>
  <View style={styles.header}>
   {/* @ts-ignore */}
   <Image style={styles.channelThumbnail} src={channelInfo.imageUrl} />
   <View style={styles.headSpacer} />
   <View style={styles.titles}>
    <Text style={styles.channelTitle} selectable>{channelInfo.title}</Text>
    <Text style={styles.author} selectable>{channelInfo.author}</Text>
   </View>
  </View>
  <Text style={styles.channelDescription} selectable>{channelInfo.description}</Text>
 </View >
})

ChannelInfo.displayName = 'ChannelInfo'

export default ChannelInfo

const styles = StyleSheet.create({
 header: {
  flexDirection: 'row',
  flex: 1,
 },
 channelThumbnail: {
  width: 122,
  height: 122,
  borderRadius: 12,
 },
 headSpacer: {
  width: 12,
 },
 titles: {
  flexShrink: 1,
 },
 channelTitle: {
  fontSize: 24,
  lineHeight: 32,
  fontWeight: '900',
  color: theme.color.textMain,

 },
 channelDescription: {
  fontSize: 14,
  lineHeight: 20,
  color: theme.color.textMain,
  fontWeight: '400',
  marginTop: 16,
 },
 author: {
  fontSize: 14,
  lineHeight: 20,
  color: theme.color.textWeak,
  marginTop: 4,
 }
});