import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  fill?: string;
};

const PauseIcon = React.memo<Props>((props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path d="M6 19h4V5H6zm8-14v14h4V5z" />
  </Svg>
));

PauseIcon.displayName = 'PauseIcon';

export default PauseIcon;
