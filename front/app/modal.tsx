import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import ModalPlayer from '../feature/Player/ModalPlayer';
import { BackDownIcon } from '../feature/icons';

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

export default function Modal() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Now Listening',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <ModalPlayer />
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
