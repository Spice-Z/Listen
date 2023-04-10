import { StyleSheet, View } from 'react-native';

import { useSearchParams, useRouter } from "expo-router";
import Episode from '../../../feature/Episode/Episode';

export default function PlayerPage() {
 const router = useRouter();
 const params = useSearchParams();

 return (
  <View style={styles.container}>
   <Episode />
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
});
