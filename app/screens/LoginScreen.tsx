import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { getAuth, signInWithCredential, GoogleAuthProvider, signInAnonymously, OAuthProvider } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig';
import Constants from 'expo-constants';
import i18n from '@/i18n';

const { width } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

function randomNonce(length = 32) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LoginScreen() {
  const auth = getAuth(firebaseApp);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) =>
        Alert.alert(i18n.t('google_signin_error'), err.message)
      );
    }
  }, [response]);

  const handleAppleSignIn = async () => {
    try {
      const rawNonce = randomNonce();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!appleCredential.identityToken) {
        Alert.alert(i18n.t('apple_signin_error'), i18n.t('no_identity_token'));
        return;
      }
      // Use OAuthProvider for Apple
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce: rawNonce,
      });
      await signInWithCredential(auth, credential);
    } catch (err: any) {
      if (err && typeof err === 'object' && 'code' in err && (err as any).code !== 'ERR_CANCELED') {
        Alert.alert(i18n.t('apple_signin_error'), (err as any).message);
      } else if (err instanceof Error) {
        Alert.alert(i18n.t('apple_signin_error'), err.message);
      }
    }
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const handleAnonSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        Alert.alert('Anonymous Sign-In Error', (err as any).message);
      } else if (err instanceof Error) {
        Alert.alert('Anonymous Sign-In Error', err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e6e7c7', 'rgba(30,34,27,0.0)']}
        style={styles.vignette}
        pointerEvents="none"
      />
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/images/routiner_icon.png')} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{i18n.t('app_title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('app_subtitle')}</Text>
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn}>
            <Text style={styles.appleButtonText}>{i18n.t('continue_with_apple')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>{i18n.t('continue_with_google')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.anonButton} onPress={handleAnonSignIn}>
          <Text style={styles.anonButtonText}>{i18n.t('continue_anonymously')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        {i18n.t('user_agreement_privacy_policy')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181D17',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: width * 0.7,
    zIndex: 1,
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 8,
    zIndex: 2,
  },
  icon: {
    width: 80,
    height: 80,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#e6e7c7',
    marginBottom: 32,
    textAlign: 'center',
  },
  appleButton: {
    backgroundColor: '#5BE13A',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 16,
  },
  appleButtonText: {
    color: '#181D17',
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#2E3829',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#e6e7c7',
    fontSize: 18,
    fontWeight: '600',
  },
  anonButton: {
    backgroundColor: '#232823',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 0,
  },
  anonButtonText: {
    color: '#e6e7c7',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    color: '#e6e7c7',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
    width: '90%',
    zIndex: 2,
  },
}); 