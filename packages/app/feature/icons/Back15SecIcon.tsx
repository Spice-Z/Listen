import React from 'react';
import Svg, { Path, Text } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

const Back15SecIcon: React.FC<Props> = ({ width = 24, height = 24, color = 'white' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        d="M12 3l-8 8 8 8V3zm-2 6H9v6h1V9zm-2 0H7v6h1V9zm-2 0H5v6h1V9zm-2 0H3v6h1V9zm-2 0H1v6h1V9zm-1 0h1v6H0V9z"
        fill={color}
      />
      <Text x="16" y="17" fontSize="8" fontWeight="bold" fill={color} textAnchor="middle">
        15
      </Text>
    </Svg>
  );
};

export default Back15SecIcon;
