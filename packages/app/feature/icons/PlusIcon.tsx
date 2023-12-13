import React from 'react';
import Svg, { Rect } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color?: string;
};

const PlusIcon = React.memo<Props>(({ width, height, color = '#000000' }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
    <Rect x="23" y="3" width="4" height="44" rx="1" fill={color} />
    <Rect x="3" y="23" width="44" height="4" rx="1" fill={color} />
  </Svg>
));

PlusIcon.displayName = 'PlusIcon';

export default PlusIcon;
