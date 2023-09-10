import React, { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

const TextIcon: React.FC<Props> = ({ width = 35, height = 35, color = 'white' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 35 35" fill="none">
      <Rect x="1" y="1" width="33" height="33" rx="3" stroke={color} stroke-width="2" />
      <Path
        d="M11.192 19.164H21.38V21.54H11.012L11.192 19.164ZM15.548 6.528L16.52 7.86L10.04 27.264C10.04 27.384 10.16 27.504 10.4 27.624C10.64 27.72 10.94 27.792 11.3 27.84C11.66 27.888 12.044 27.912 12.452 27.912H12.992V30H5.324V27.912H5.504C6.056 27.912 6.488 27.816 6.8 27.624C7.136 27.408 7.412 26.988 7.628 26.364L15.008 4.44H20.588L28.184 26.904C28.352 27.336 28.604 27.612 28.94 27.732C29.276 27.852 29.696 27.912 30.2 27.912H30.38V30H19.472V27.912H20.048C20.432 27.912 20.816 27.9 21.2 27.876C21.584 27.852 21.896 27.816 22.136 27.768C22.4 27.696 22.532 27.624 22.532 27.552L15.548 6.528Z"
        fill={color}
      />
    </Svg>
  );
};

export default memo(TextIcon);
