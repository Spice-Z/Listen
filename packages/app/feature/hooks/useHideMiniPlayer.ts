import { usePathname } from 'expo-router';
import { useMemo } from 'react';

export const useHideMiniPlayer = () => {
  const pathname = usePathname();
  const hideMiniPlayer = useMemo(() => {
    return (
      pathname === '/modalPlayer' || pathname === '/modalTranscriptPlayer' || pathname === '/signIn'
    );
  }, [pathname]);
  return hideMiniPlayer;
};
