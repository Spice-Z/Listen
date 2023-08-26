import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { memo } from 'react';

const GoogleSignInButton = memo(() => {
  const { signInWithGoogle } = useGoogleAuth();
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={signInWithGoogle}
    />
  );
});

GoogleSignInButton.displayName = 'GoogleSignInButton';

export default GoogleSignInButton;
