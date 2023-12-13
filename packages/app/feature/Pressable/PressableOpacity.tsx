import React, { memo } from 'react';
import { Pressable } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: Object;
  onPress?: () => void | Promise<void>;
  hitSlop?: number;
};

const PressableOpacity = memo<Props>(({ children, style, onPress, hitSlop }) => {
  return (
    <Pressable
      style={({ pressed }) => [style, pressed && { opacity: 0.8 }]}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      {children}
    </Pressable>
  );
});
export default PressableOpacity;
