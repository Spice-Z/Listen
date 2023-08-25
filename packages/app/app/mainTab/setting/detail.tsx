import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function PlayerPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'detaila', animation: 'slide_from_right' }} />
      <Text>detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
