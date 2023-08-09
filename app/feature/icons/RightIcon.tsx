import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number,
  height: number,
  fill?: string
}

const RightIcon = React.memo<Props>((props: Props) => (
  <Svg width={props.width} height={props.height} viewBox="0 0 40 40" fill="none">
    <Path d="M35 19.5L10.25 33.7894L10.25 5.21058L35 19.5Z" fill={props.fill ?? 'white'} />
  </Svg>

));

RightIcon.displayName = 'RightIcon';

export default RightIcon;
