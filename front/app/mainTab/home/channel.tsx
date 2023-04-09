import { Stack } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { theme } from "../../../feature/styles/theme";


function ListHeader() {
 return <View style={styles.header}>

 </View>
}

export default function Channel() {
 const channelName = 'BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST BBC GLOBAL NEWS PODCAST'
 return <>
  <Stack.Screen
   options={{
    title: channelName
   }}
  />
  <View style={styles.container}>
   <FlatList
    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
    renderItem={({ item }) => {
     return <View style={{ height: 100, backgroundColor: 'red' }} />
    }}
   />

  </View>
 </>
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
 },
 header: {

 }
});