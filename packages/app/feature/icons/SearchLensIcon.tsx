import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color?: string;
};

const SearchLensIcon = React.memo<Props>(({ width, height, color = '#000000' }: Props) => (
  <Svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    stroke={color}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
  >
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" x2="16.65" y1="21" y2="16.65" />
  </Svg>
));

SearchLensIcon.displayName = 'SearchLensIcon';

export default SearchLensIcon;
