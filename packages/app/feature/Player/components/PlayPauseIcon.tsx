import { ActivityIndicator } from 'react-native';
import { PauseIcon, PlayIcon } from '../../icons';
import { theme } from '../../styles/theme';
import { memo } from 'react';

type Props = {
  isLoading: boolean;
  isPlaying: boolean;
  size?: number;
  color?: string;
};

const PlayPauseIcon = memo(
  ({ isLoading, isPlaying, size = 28, color = theme.color.bgMain }: Props) => {
    if (isLoading) {
      return <ActivityIndicator />;
    }
    return isPlaying ? (
      <PauseIcon fill={color} width={size} height={size} />
    ) : (
      <PlayIcon fill={color} width={size} height={size} />
    );
  },
);

export default PlayPauseIcon;
