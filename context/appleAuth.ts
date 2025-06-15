import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, Auth, AuthCredential } from 'firebase/auth';
import { sha256 } from 'js-sha256';

export async function signInWithApple(auth: Auth): Promise<AuthCredential> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple authentication is only available on iOS');
  }

  try {
    // Check if Apple authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple authentication is not available on this device');
    }

    const nonce = Math.random().toString(36).substring(2);
    const hashedNonce = sha256(nonce);

    console.log('Starting Apple Sign In process...');
    
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    console.log('Apple Sign In response received:', {
      hasIdentityToken: !!credential.identityToken,
      hasEmail: !!credential.email,
      hasFullName: !!credential.fullName,
    });

    if (!credential.identityToken) {
      throw new Error('No identity token received from Apple');
    }

    const provider = new OAuthProvider('apple.com');
    const oAuthCredential = provider.credential({
      idToken: credential.identityToken,
      rawNonce: nonce,
    });

    return oAuthCredential;
  } catch (error) {
    console.error('Apple Sign In Error Details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
} 