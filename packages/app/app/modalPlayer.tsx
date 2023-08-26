import { StyleSheet, Text, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import ModalPlayer from '../feature/Player/ModalPlayer';
import { BackDownIcon } from '../feature/icons';
import { memo } from 'react';
import PressableOpacity from '../feature/Pressable/PressableOpacity';

function BackButton() {
  const navigation = useNavigation();
  return (
    <PressableOpacity onPress={navigation.goBack}>
      <Text>
        <BackDownIcon width={24} height={24} color={theme.color.textMain} />
      </Text>
    </PressableOpacity>
  );
}

const modalPlayer = memo(() => {
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
});

modalPlayer.displayName = 'ModalPlayer';

export default modalPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
