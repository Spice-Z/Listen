import React from 'react';
import { Pressable, Animated } from 'react-native';

type PressableScaleProps = {
  hitSlop?: number;
  children: React.ReactNode;
  style?: Object;
  onPress?: () => void;
};

const PressableScale = ({ hitSlop, children, style, onPress }: PressableScaleProps) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.975,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
export default PressableScale;
