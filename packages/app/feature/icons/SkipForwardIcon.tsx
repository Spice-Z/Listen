import React from 'react';
import Svg, { Path, Text } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

const SkipForwardIcon = React.memo<Props>(({
  width = 24,
  height = 24,
  color = 'white',
}: Props) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        d="M12 3v18l8-8-8-8zm-6 6v6h-1v-6h1zm-2 0v6H3v-6h1zm-2 0v6H0v-6h1z"
        fill={color}
      />
      <Text
        x="8"
        y="17"
        fontSize="8"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
      >
        15
      </Text>
    </Svg>
  );
});

SkipForwardIcon.displayName = 'SkipForwardIcon';
export default SkipForwardIcon;
