import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { BackDownIcon } from '../feature/icons';
import TranscriptPlayer from '../feature/Player/TranscriptPlayer';

function BackButton() {
 const navigation = useNavigation();
 return (
  <TouchableOpacity onPress={navigation.goBack}>
   <Text>
    <BackDownIcon width={24} height={24} color={theme.color.textMain} />,
   </Text>
  </TouchableOpacity>
 );
}

export default function modalTranscriptPlayer() {
 return (
  <>
   <Stack.Screen
    options={{
     headerTitle: 'Transcript',
     // eslint-disable-next-line react/no-unstable-nested-components
     headerLeft: () => <BackButton />,
    }}
   />
   <View style={styles.container}>
    <TranscriptPlayer />
   </View>
  </>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
  alignItems: 'center',
  justifyContent: 'center',
 },
});
