import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color?: string;
};

const SearchLensIcon = React.memo<Props>(({ width, height, color = '#000000' }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 36 36" fill="none">
    <Circle cx="17" cy="16" r="13" stroke={color} strokeWidth="4" />
    <Line x1="33.2322" y1="33.7678" x2="25.2322" y2="25.7678" stroke={color} strokeWidth="5" />
  </Svg>
));

SearchLensIcon.displayName = 'SearchLensIcon';

export default SearchLensIcon;
