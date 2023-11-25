import { ReactNode, useState } from 'react';
import { PlayType, PlayerContext } from './context';

type Props = {
  children: ReactNode;
};
export const PlayerProvider = ({ children }: Props) => {
  const [playType, setPlayType] = useState<PlayType>('default');
  return (
    <PlayerContext.Provider
      value={{
        playType,
        setPlayType,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
