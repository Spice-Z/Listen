import { memo } from 'react';
import { View } from 'react-native';

type Props = {
  width?: number;
  height?: number;
};

const Spacer = memo(({ width = 0, height = 0 }: Props) => {
  return <View style={{ width, height }} />;
});

Spacer.displayName = 'Spacer';

export default Spacer;
