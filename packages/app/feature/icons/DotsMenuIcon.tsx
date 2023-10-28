import React from 'react';
import Svg, { Circle } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color?: string;
};

const DotsMenuIcon = React.memo<Props>(({ width, height, color = '#000000' }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
    <Circle cx="25" cy="25" r="5" fill={color} />
    <Circle cx="25" cy="40" r="5" fill={color} />
    <Circle cx="25" cy="10" r="5" fill={color} />
  </Svg>
));

DotsMenuIcon.displayName = 'DotsMenuIcon';

export default DotsMenuIcon;
