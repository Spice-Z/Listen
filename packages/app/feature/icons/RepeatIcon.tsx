import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  color: string;
  showDot: boolean;
};

const RepeatIcon = memo<Props>(({ width = 24, height = 24, color, showDot }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 56 56" fill="none">
      <Path
        d="M23.9149 45.5353H14C8.47715 45.5353 4 41.0581 4 35.5353V16C4 10.4772 8.47715 6 14 6H42C47.5228 6 52 10.4772 52 16V35.5353C52 41.0581 47.5228 45.5353 42 45.5353H41.2766H31.0638M31.0638 45.5353L37.7021 38.0706M31.0638 45.5353L37.7021 53"
        stroke={color}
        strokeWidth="5"
      />
      {showDot && <Circle cx="28.5" cy="25.5" r="4.5" fill={color} />}
    </Svg>
  );
});

export default RepeatIcon;
