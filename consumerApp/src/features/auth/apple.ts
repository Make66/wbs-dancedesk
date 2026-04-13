import auth from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';

export async function signInWithApple() {
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  const { identityToken, nonce } = response;
  if (!identityToken) throw new Error('Apple Sign-In failed - no identity token returned');
  const credential = auth.AppleAuthProvider.credential(identityToken, nonce);
  return auth().signInWithCredential(credential);
}
