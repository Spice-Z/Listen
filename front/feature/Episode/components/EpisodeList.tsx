import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";


type Props = {
 id: string,
 title: string,
 imageUrl: string,
 onPress: (id: string) => void,
}

const EpisodeList = memo(({
 id,
 title,
 imageUrl,
 onPress,
}: Props) => {

 const onPressItem = () => onPress(id)



 return <Pressable style={styles.container} onPress={onPressItem}>
  <View style={styles.cardHead}>
   {/* @ts-ignore */}
   <Image style={styles.artwork} src={imageUrl} />
   <View style={styles.texts}>
    <Text numberOfLines={2} style={styles.title}>{title}</Text>
   </View>
  </View>
 </Pressable>;
});

EpisodeList.displayName = "EpisodeList";

export default EpisodeList;

const styles = StyleSheet.create({
 container: {
  padding: 8,
 },
 cardHead: {
  flexDirection: 'row',
 },
 artwork: {
  width: 40,
  height: 40,
  borderRadius: 4,
  backgroundColor: theme.color.bgDark,
 },
 texts: {
  flexShrink: 1,
  marginLeft: 8,
 },
 title: {
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '600',
  color: theme.color.textMain
 },
 info: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
 },
 duration: {
  color: theme.color.textWeak,
 },
 pubDate: {
  color: theme.color.textWeak,
  marginLeft: 8,
 },
 description: {
  fontSize: 12,
  lineHeight: 18,
  color: theme.color.textWeak,
  marginTop: 8,
  width: '100%'
 }
});
