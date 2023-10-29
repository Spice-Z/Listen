import { ActivityIndicator } from 'react-native';
import { PauseIcon, PlayIcon } from '../../icons';
import { theme } from '../../styles/theme';
import { memo } from 'react';

type Props = {
  isLoading: boolean;
  isPlaying: boolean;
};

const PlayPauseIcon = memo(({ isLoading, isPlaying }: Props) => {
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return isPlaying ? (
    <PauseIcon fill={theme.color.bgMain} width={28} height={28} />
  ) : (
    <PlayIcon fill={theme.color.bgMain} width={28} height={28} />
  );
});

export default PlayPauseIcon;
