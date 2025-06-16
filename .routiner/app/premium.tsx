import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePremium } from '@/context/PremiumContext';

export default function PremiumScreen() {
  const router = useRouter();
  const { isPremium, activatePremium } = usePremium();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Go Premium</ThemedText>
      <ThemedText style={{ fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
        Unlock AI-powered logging and more features coming soon!
      </ThemedText>
      <Pressable onPress={activatePremium} style={{ backgroundColor: '#FFD700', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <ThemedText style={{ color: '#222', fontWeight: 'bold' }}>Activate Premium</ThemedText>
      </Pressable>
      <Pressable onPress={() => router.back()} style={{ padding: 12 }}>
        <ThemedText style={{ color: '#888' }}>Back</ThemedText>
      </Pressable>
      {isPremium && (
        <ThemedText style={{ color: 'green', marginTop: 16 }}>You are now a premium user!</ThemedText>
      )}
    </ThemedView>
  );
} 