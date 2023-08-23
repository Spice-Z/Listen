import { memo } from "react"
import { StyleSheet, Text } from "react-native"
import { theme } from "../../styles/theme"
import PressableScale from "../../Pressable/PressableScale"

export type Props = {
 text: string,
 subText?: string,
 onPress: () => void | Promise<void>,
}

const SettingListItemComponent = memo<Props>((props) => {
 return (
  <PressableScale onPress={props.onPress} style={styles.container}>
   <Text style={styles.text}>{props.text}</Text>
   {props.subText && <Text style={styles.subText}>{props.subText}</Text>}
  </PressableScale>
 )
})

SettingListItemComponent.displayName = 'SettingListItemComponent'

export default SettingListItemComponent


const styles = StyleSheet.create({
 container: {
  paddingVertical: 8,
  justifyContent: 'center',
 },
 text: {
  fontSize: 20,
  color: theme.color.textMain,
  fontWeight: theme.fontWeight.medium,
 },
 subText: {
  fontSize: 14,
  color: theme.color.textWeak,
  fontWeight: theme.fontWeight.medium,
  marginTop: 2,
 }
})