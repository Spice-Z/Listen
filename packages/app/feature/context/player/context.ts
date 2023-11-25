import { createContext, useContext } from 'react';

export type PlayType = 'default' | 'dictation';

export const PlayerContext = createContext<{
  playType: PlayType;
  setPlayType: (playType: PlayType) => void;
}>({
  playType: 'default',
  setPlayType: () => {},
});

export function usePlayerContext() {
  return useContext(PlayerContext);
}
