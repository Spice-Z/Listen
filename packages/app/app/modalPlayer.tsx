import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { theme } from '../feature/styles/theme';
import ModalPlayer from '../feature/Player/ModalPlayer';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackDownButton from '../feature/Header/BackDownButton';

const modalPlayer = memo(() => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Transcription',
          headerLeft: () => <BackDownButton />,
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
