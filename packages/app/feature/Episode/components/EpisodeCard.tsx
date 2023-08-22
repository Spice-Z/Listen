import { memo, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";
import { formatDMMMYY } from "../../format/date";
import { formatDuration } from "../../format/duration";


type Props = {
 id: string,
 title: string,
 description: string,
 duration: number,
 imageUrl: string,
 date: Date,
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
 date,
 onPress,
}: Props) => {
 const arrangedDescription = useMemo(() => {
  return convertNewlinesToSpaces(removeTagsFromString(description));
 }, [description]);
 const onPressItem = () => onPress(id)

 const formattedDate = useMemo(() => {
  return formatDMMMYY(date)
 }, [date])

 const formattedDuration = useMemo(() => {
  return formatDuration(duration)
 }, [duration])


 return <Pressable style={styles.container} onPress={onPressItem}>
  <View style={styles.cardHead}>
   {/* @ts-ignore */}
   <Image style={styles.artwork} src={imageUrl} />
   <View style={styles.texts}>
    <Text numberOfLines={2} style={styles.title}>{title}</Text>
    <View style={styles.info}>
     <Text style={styles.duration}>{formattedDuration}</Text>
     <Text style={styles.pubDate}>{formattedDate}</Text>
    </View>
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
  color: theme.color.textMain,
  fontWeight: '300',
  marginTop: 8,
  width: '100%'
 }
});
