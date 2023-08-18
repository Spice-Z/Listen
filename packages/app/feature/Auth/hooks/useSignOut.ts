import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useSignOut = () => {
  const router = useRouter();

  const signOut = useCallback(async () => {
    await auth().signOut();
    router.replace('/');
    return;
  }, [router]);

  return {
    signOut,
  };
};
