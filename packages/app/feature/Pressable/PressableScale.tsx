import React from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';

type PressableScaleProps = {
  children: React.ReactNode;
  style?: Object;
  onPress?: () => void;
};

const PressableScale: React.FC<PressableScaleProps> = ({ children, style, onPress }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.995,
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
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // ... あなたのスタイルをここに追加
});

export default PressableScale;
