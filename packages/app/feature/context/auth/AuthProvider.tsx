import { ReactNode, memo, useEffect, useState } from "react";
import { useProtectedRoute } from "./context";
import { AuthContext } from "./context";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type Props = {
  children: ReactNode
}

export const AuthProvider = memo<Props>((props) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    setUser(user);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
})

AuthProvider.displayName = "AuthProvider";