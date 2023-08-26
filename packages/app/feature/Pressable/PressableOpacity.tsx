import React, { memo } from 'react';
import { Pressable } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: Object;
  onPress?: () => void;
};

const PressableOpacity = memo<Props>(({ children, style, onPress }) => {
  return (
    <Pressable style={({ pressed }) => [style, pressed && { opacity: 0.8 }]} onPress={onPress}>
      {children}
    </Pressable>
  );
});
export default PressableOpacity;
