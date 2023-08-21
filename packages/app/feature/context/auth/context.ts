import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router, usePathname } from 'expo-router';
import { createContext, useContext, useEffect } from 'react';

export const AuthContext = createContext<{
  user: FirebaseAuthTypes.User | null;
  firebaseToken: string | null;
}>({
  user: null,
  firebaseToken: null,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useProtectedRoute(user) {
  const currentPath = usePathname();

  useEffect(() => {
    if (!user && currentPath !== '/signIn') {
      router.replace('/signIn');
    } else if (user && (currentPath === '/signIn' || currentPath === '/')) {
      router.replace('/mainTab/home');
    }
  }, [user, currentPath]);
}
