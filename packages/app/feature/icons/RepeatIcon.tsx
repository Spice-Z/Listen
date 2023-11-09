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
    <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      <Path
        d="M21.3526 40.6565H13.5714C8.04857 40.6565 3.57141 36.1794 3.57141 30.6565V15.3572C3.57141 9.8343 8.04856 5.35715 13.5714 5.35715H36.4286C41.9514 5.35715 46.4286 9.8343 46.4286 15.3571V31.2815C46.4286 36.4592 42.2312 40.6565 37.0536 40.6565V40.6565H29.9107M29.9107 40.6565L35.5 33.5M29.9107 40.6565L36 48"
        stroke={color}
        strokeWidth="5"
      />
      {showDot && <Circle cx="25.4464" cy="22.7679" r="4.01786" fill={color} />}
    </Svg>
  );
});

export default RepeatIcon;
