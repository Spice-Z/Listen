import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  fill?: string;
};

const LeftIcon = React.memo<Props>((props: Props) => (
  <Svg width={props.width} height={props.height} viewBox="0 0 40 40" fill="none">
    <Path d="M5 19.5L29.75 5.21058L29.75 33.7894L5 19.5Z" fill={props.fill ?? 'white'} />
  </Svg>
));

LeftIcon.displayName = 'LeftIcon';

export default LeftIcon;
