import { StyleSheet, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import ModalPlayer from '../feature/Player/ModalPlayer';
import { BackDownIcon } from '../feature/icons';
import { memo } from 'react';
import PressableOpacity from '../feature/Pressable/PressableOpacity';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function BackButton() {
  const navigation = useNavigation();
  return (
    <PressableOpacity hitSlop={4} onPress={navigation.goBack}>
      <BackDownIcon width={24} height={24} color={theme.color.accent} />
    </PressableOpacity>
  );
}

const modalPlayer = memo(() => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Now Listening',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <BackButton />,
        }}
      />
      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
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
  },
});
