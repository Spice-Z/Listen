import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  fill?: string;
};

const PlayIcon = React.memo<Props>((props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
));

PlayIcon.displayName = 'PlayIcon';

export default PlayIcon;
