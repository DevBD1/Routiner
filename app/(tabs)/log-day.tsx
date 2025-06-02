import React, { useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePremium } from '@/context/PremiumContext';
import { colors } from '@/constants/colors';
import { useHabits } from '@/context/HabitsContext';

export default function LogDayScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { isPremium, processAiInput } = usePremium();
  const { habits } = useHabits();
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      // Find the first habit with a goal unit to use as context
      const habitWithUnit = habits.find(h => h.goalEnabled && h.goalUnit);
      const habit = habitWithUnit || { title: 'General Activity', goalUnit: 'min' };
      
      const value = await processAiInput(text, habit);
      setResult(`AI processed value: ${value}`);
      setText('');
    } catch (error) {
      setResult('Error processing your log.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isPremium) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <ThemedText style={{ fontSize: 18, marginBottom: 16 }}>Log Your Day</ThemedText>
        <ThemedText style={{ color: colors[colorScheme].error, marginBottom: 16 }}>
          This feature is for premium users only.
        </ThemedText>
        <Pressable onPress={() => router.push('/premium')} style={{ backgroundColor: colors[colorScheme].tint, padding: 12, borderRadius: 8 }}>
          <ThemedText style={{ color: colors[colorScheme].background, fontWeight: 'bold' }}>Upgrade to Premium</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <ThemedText style={{ fontSize: 18, marginBottom: 16 }}>Log Your Day</ThemedText>
      <TextInput
        style={{
          minHeight: 120,
          borderWidth: 1,
          borderColor: colors[colorScheme].tabIconDefault,
          borderRadius: 12,
          padding: 16,
          fontSize: 16,
          color: colors[colorScheme].text,
          backgroundColor: colors[colorScheme].frame,
          marginBottom: 16,
          textAlignVertical: 'top',
        }}
        multiline
        placeholder="Describe your day..."
        placeholderTextColor={colors[colorScheme].tabIconDefault}
        value={text}
        onChangeText={setText}
        editable={!isProcessing}
      />
      <Pressable
        onPress={handleSubmit}
        style={{
          backgroundColor: colors[colorScheme].tint,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          opacity: isProcessing || !text.trim() ? 0.6 : 1,
          marginBottom: 16,
        }}
        disabled={isProcessing || !text.trim()}
      >
        {isProcessing ? (
          <ActivityIndicator color={colors[colorScheme].background} />
        ) : (
          <ThemedText style={{ color: colors[colorScheme].background, fontWeight: 'bold' }}>Submit</ThemedText>
        )}
      </Pressable>
      {result && (
        <ThemedText style={{ marginTop: 8 }}>{result}</ThemedText>
      )}
    </ThemedView>
  );
} 