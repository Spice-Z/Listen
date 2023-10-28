import { memo } from 'react';
import Svg, { Line, Path, Rect } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  color?: string;
};

const UnVisibleTextIcon = memo<Props>(({ width, height, color = 'white' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect x="5" y="5" width="30" height="30" rx="3" stroke={color} strokeWidth="2" />
      <Path
        d="M13.192 22.164H23.38V24.54H13.012L13.192 22.164ZM17.548 9.528L18.52 10.86L12.04 30.264C12.04 30.384 12.16 30.504 12.4 30.624C12.64 30.72 12.94 30.792 13.3 30.84C13.66 30.888 14.044 30.912 14.452 30.912H14.992V33H7.324V30.912H7.504C8.056 30.912 8.488 30.816 8.8 30.624C9.136 30.408 9.412 29.988 9.628 29.364L17.008 7.44H22.588L30.184 29.904C30.352 30.336 30.604 30.612 30.94 30.732C31.276 30.852 31.696 30.912 32.2 30.912H32.38V33H21.472V30.912H22.048C22.432 30.912 22.816 30.9 23.2 30.876C23.584 30.852 23.896 30.816 24.136 30.768C24.4 30.696 24.532 30.624 24.532 30.552L17.548 9.528Z"
        fill={color}
      />
      <Line x1="1.9571" y1="31.2934" x2="37.9571" y2="9.29344" stroke={color} strokeWidth="4" />
    </Svg>
  );
});

export default UnVisibleTextIcon;
