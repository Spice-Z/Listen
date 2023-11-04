import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color: string;
};

const LeftIcon = memo<Props>(({ width, height, color }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
    <Path d="M40.0006 44.9999L10.0006 24.9999L40.0006 4.99993" stroke={color} strokeWidth="6" />
  </Svg>
));

LeftIcon.displayName = 'LeftIcon';

export default LeftIcon;
