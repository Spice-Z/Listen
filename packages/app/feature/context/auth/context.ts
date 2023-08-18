import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router, usePathname } from 'expo-router';
import React from 'react';

export const AuthContext = React.createContext<{
  user: FirebaseAuthTypes.User | null;
}>({
  user: null,
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function useProtectedRoute(user) {
  const currentPath = usePathname();

  React.useEffect(() => {
    if (!user && currentPath !== '/signIn') {
      router.replace('/signIn');
    } else if (user && currentPath === '/signIn') {
      router.replace('/mainTab/home');
    }
  }, [user, currentPath]);
}
