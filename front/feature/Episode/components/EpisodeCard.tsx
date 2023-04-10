import { memo, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";


type Props = {
 id: string,
 title: string,
 description: string,
 duration: number,
 imageUrl: string,
 onPress: (id: string) => void,
}

function removeTagsFromString(htmlString) {
 return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
}
function convertNewlinesToSpaces(text) {
 return text.replace(/\r\n|\r|\n/g, '  ');
}

const EpisodeCard = memo(({
 id,
 title,
 description,
 duration,
 imageUrl,
 onPress,
}: Props) => {
 const arrangedDescription = useMemo(() => {
  return convertNewlinesToSpaces(removeTagsFromString(description));
 }, [description]);
 const onPressItem = () => onPress(id)

 return <Pressable style={styles.container} onPress={onPressItem}>
  <View style={styles.cardHead}>
   {/* @ts-ignore */}
   <Image style={styles.artwork} src={imageUrl} />
   <View style={styles.texts}>
    <Text numberOfLines={2} style={styles.title}>{title}</Text>
    <Text style={styles.duration}>{duration}</Text>
   </View>
  </View>
  <Text numberOfLines={3} style={styles.description}>{arrangedDescription}</Text>
 </Pressable>;
});

EpisodeCard.displayName = "EpisodeCard";

export default EpisodeCard;

const styles = StyleSheet.create({
 container: {
  borderRadius: 12,
  backgroundColor: theme.color.bgEmphasis,
  padding: 8,
 },
 cardHead: {
  flexDirection: 'row',
 },
 artwork: {
  width: 60,
  height: 60,
  borderRadius: 6,
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
 duration: {
  color: theme.color.textWeak,
  marginTop: 4,
 },
 description: {
  fontSize: 12,
  lineHeight: 18,
  color: theme.color.textWeak,
  marginTop: 8,
  width: '100%'
 }
});
