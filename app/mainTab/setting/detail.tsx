
import { StyleSheet, Text, View } from 'react-native';
import { Stack, useSearchParams, useRouter } from "expo-router";

export default function PlayerPage() {
  const params = useSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "detaila", animation: 'slide_from_right' }} />
      <Text>detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
