import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color: string;
};

const RightIcon = React.memo<Props>(({ width, height, color }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
    <Path d="M10 5L40 25L10 45" stroke={color} strokeWidth="6" />
  </Svg>
));

RightIcon.displayName = 'RightIcon';

export default RightIcon;
