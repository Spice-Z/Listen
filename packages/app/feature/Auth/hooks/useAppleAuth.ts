import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { useCallback } from 'react';

export const useAppleAuth = () => {
  const signInWithApple = useCallback(async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    console.log('success login');

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }, []);
  const revokeSignInWithApple = useCallback(async () => {
    console.log('revoke start');
    // Get an authorizationCode from Apple
    const { authorizationCode } = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.REFRESH,
    });

    // Ensure Apple returned an authorizationCode
    if (!authorizationCode) {
      throw new Error('Apple Revocation failed - no authorizationCode returned');
    }
    console.log('success revoke');

    return auth().revokeToken(authorizationCode);
  }, []);

  return {
    signInWithApple,
    revokeSignInWithApple,
  };
};
