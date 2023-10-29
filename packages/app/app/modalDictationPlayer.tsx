import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackDownButton from '../feature/Header/BackDownButton';

const modalDictationPlayer = memo(() => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Dictation',
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
        {/* <DictationPlayer /> */}
      </View>
    </>
  );
});

modalDictationPlayer.displayName = 'modalDictationPlayer';

export default modalDictationPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
});
