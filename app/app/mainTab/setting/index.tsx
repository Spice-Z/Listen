
import { StyleSheet, Text, View } from 'react-native';
import { useSearchParams, Link } from "expo-router";

export default function PlayerPage() {
  const params = useSearchParams();

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
