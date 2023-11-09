import { useNavigation } from 'expo-router';
import PressableOpacity from '../Pressable/PressableOpacity';
import { BackDownIcon } from '../icons';
import { theme } from '../styles/theme';
import { memo } from 'react';

const BackDownButton = memo(() => {
  const navigation = useNavigation();
  return (
    <PressableOpacity hitSlop={4} onPress={navigation.goBack}>
      <BackDownIcon width={24} height={24} color={theme.color.accent} />
    </PressableOpacity>
  );
});

export default BackDownButton;
