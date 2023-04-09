import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
 width?: number;
 height?: number;
 color?: string;
};

const BackDownIcon: React.FC<Props> = ({
 width = 24,
 height = 24,
 color = 'white',
}) => {
 return (<Svg width={width} height={height} viewBox="0 0 13 13" fill="none"><Path d="m1 3 5.5 6L12 3" stroke={color} stroke-width="2" /></Svg>);
};

export default BackDownIcon;
