import { AppleButton } from '@invertase/react-native-apple-authentication';
import { memo } from 'react';
import { useAppleAuth } from './hooks/useAppleAuth';

const AppleSignInButton = memo(() => {
 const { signInWithApple } = useAppleAuth();
 return (
  <AppleButton
   buttonStyle={AppleButton.Style.WHITE}
   buttonType={AppleButton.Type.SIGN_IN}
   style={{
    width: 160,
    height: 45,
   }}
   onPress={signInWithApple}
  />
 );
})

AppleSignInButton.displayName = 'AppleSignInButton';

export default AppleSignInButton;