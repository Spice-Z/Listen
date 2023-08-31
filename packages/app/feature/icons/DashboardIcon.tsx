import React from 'react';
import Svg, { Path } from 'react-native-svg';
type Props = {
  width: number;
  height: number;
  fill?: boolean;
  color?: string;
};

const DashboardIcon = React.memo<Props>(
  ({ width, height, fill = false, color = '#000000' }: Props) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
      <Path d="M0 0h24v24H0V0z" fill="none" />
      {fill ? (
        <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      ) : (
        <Path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z" />
      )}
    </Svg>
  ),
);

DashboardIcon.displayName = 'DashboardIcon';

export default DashboardIcon;
