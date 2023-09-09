import { ReactNode, memo, useEffect, useState } from 'react';
import { useProtectedRoute } from './context';
import { AuthContext } from './context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type Props = {
  children: ReactNode;
  isInitialized: boolean;
};

export const AuthProvider = memo<Props>((props) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    // user情報がない時は匿名ログインをさせておく
    if (!user) {
      auth().signInAnonymously();
      return;
    }
    setUser(user);
    if (user) {
      user.getIdToken().then((token) => {
        setFirebaseToken(token);
      });
    } else {
      setFirebaseToken(null);
    }
  };
  const onIdTokenChanged = (user: FirebaseAuthTypes.User) => {
    if (user) {
      user.getIdToken().then((token) => {
        setFirebaseToken(token);
      });
      return;
    }
  };

  // ログイン状態の変更を監視
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // tokenの変更を監視
  useEffect(() => {
    const subscriber = auth().onIdTokenChanged(onIdTokenChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useProtectedRoute(user, props.isInitialized);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';
