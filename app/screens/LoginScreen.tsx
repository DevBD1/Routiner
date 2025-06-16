import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e6e7c7', 'rgba(30,34,27,0.0)']}
        style={styles.vignette}
        pointerEvents="none"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Routiner</Text>
        <Text style={styles.subtitle}>Build healthy habits and achieve your goals</Text>
        <TouchableOpacity style={styles.appleButton}>
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        By continuing, you agree to our User Agreement and{"\n"}Privacy Policy.
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
  content: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 32,
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
    marginBottom: 0,
  },
  googleButtonText: {
    color: '#e6e7c7',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    color: '#e6e7c7',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 240,
    width: '90%',
    zIndex: 2,
  },
}); 