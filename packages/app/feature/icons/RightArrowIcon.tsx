import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  color: string;
};

const RightArrowIcon = React.memo<Props>(({ width, height, color }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9393L13.5147 1.3934C12.9289 0.807612 11.9792 0.807612 11.3934 1.3934C10.8076 1.97918 10.8076 2.92893 11.3934 3.51472L19.8787 12L11.3934 20.4853C10.8076 21.0711 10.8076 22.0208 11.3934 22.6066C11.9792 23.1924 12.9289 23.1924 13.5147 22.6066L23.0607 13.0607ZM0 13.5L22 13.5V10.5L0 10.5L0 13.5Z"
      fill={color}
    />
  </Svg>
));

RightArrowIcon.displayName = 'RightArrowIcon';

export default RightArrowIcon;
