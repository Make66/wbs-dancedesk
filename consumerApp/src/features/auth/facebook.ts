import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export async function signInWithFacebook() {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) throw new Error('Facebook login cancelled');
  const data = await AccessToken.getCurrentAccessToken();
  if (!data?.accessToken) throw new Error('Missing Facebook access token');
  const credential = auth.FacebookAuthProvider.credential(data.accessToken);
  return auth().signInWithCredential(credential);
}
