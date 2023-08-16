
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";

export default function PlayerPage() {
  return (
    <View style={styles.container}>
      <Text>Notification</Text>
      <Link href={{ pathname: "/mainTab/setting/detail" }} >Setting</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
