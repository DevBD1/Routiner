import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHabits } from '@/context/HabitsContext';
import { useSettings } from '@/context/SettingsContext';
import { ProgressBar } from '@/components/ProgressBar';
import { createTabIcon } from '@/components/ui/IconSymbol';
import { usePremium } from '@/context/PremiumContext';

export default function LogHabitScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { habits, updateHabit } = useHabits();
  const { settings } = useSettings();
  const { isPremium, processAiInput } = usePremium();
  
  const habit = habits.find(h => h.id === id);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  if (!habit) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Habit not found</ThemedText>
      </ThemedView>
    );
  }

  const handleLogProgress = () => {
    if (!value) return;
    
    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;

    const currentValue = habit.currentValue || 0;
    const updatedValue = currentValue + newValue;
    
    updateHabit(habit.id, {
      ...habit,
      currentValue: updatedValue,
      lastUpdated: new Date().toISOString()
    });

    setValue('');
    router.back();
  };

  const handleAiLog = async () => {
    if (!aiInput) return;
    setIsAiProcessing(true);

    try {
      const value = await processAiInput(aiInput, habit);
      const currentValue = habit.currentValue || 0;
      const updatedValue = currentValue + value;
      
      updateHabit(habit.id, {
        ...habit,
        currentValue: updatedValue,
        lastUpdated: new Date().toISOString()
      });

      setAiInput('');
      router.back();
    } catch (error) {
      console.error('Error processing AI input:', error);
      // TODO: Show error message to user
    } finally {
      setIsAiProcessing(false);
    }
  };

  const progress = habit.goalEnabled && habit.goalValue ? 
    Math.min(1, (habit.currentValue || 0) / habit.goalValue) : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Habit Info */}
        <View style={styles.habitInfo}>
          <ThemedText style={styles.habitTitle}>{habit.title}</ThemedText>
          {habit.goalEnabled && (
            <View style={styles.goalInfo}>
              <ProgressBar 
                progress={progress} 
                goalType={habit.goalType}
                height={8}
              />
              <ThemedText style={styles.goalText}>
                {habit.currentValue || 0} / {habit.goalValue} {habit.goalUnit}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Manual Input */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.sectionTitle}>Log Progress</ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { 
                  color: colors[colorScheme].text,
                  backgroundColor: colors[colorScheme].frame
                }
              ]}
              value={value}
              onChangeText={setValue}
              placeholder="Enter amount..."
              placeholderTextColor={colors[colorScheme].tabIconDefault}
              keyboardType="numeric"
            />
            <Pressable 
              style={[styles.logButton, { backgroundColor: colors[colorScheme].tint }]}
              onPress={handleLogProgress}
            >
              <ThemedText style={styles.buttonText}>Log</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* AI Input (Premium Feature) */}
        <View style={styles.inputSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>AI Assistant</ThemedText>
            <View style={styles.premiumBadge}>
              <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                styles.aiInput,
                { 
                  color: colors[colorScheme].text,
                  backgroundColor: colors[colorScheme].frame
                }
              ]}
              value={aiInput}
              onChangeText={setAiInput}
              placeholder="Describe what you did..."
              placeholderTextColor={colors[colorScheme].tabIconDefault}
              multiline
            />
            <Pressable 
              style={[
                styles.logButton, 
                { backgroundColor: colors[colorScheme].tint },
                isAiProcessing && styles.disabledButton
              ]}
              onPress={handleAiLog}
              disabled={isAiProcessing}
            >
              {isAiProcessing ? (
                <ActivityIndicator color={colors[colorScheme].background} />
              ) : (
                <ThemedText style={styles.buttonText}>Process</ThemedText>
              )}
            </Pressable>
          </View>
          <ThemedText style={styles.aiDescription}>
            Let AI understand your progress from natural language. Example: "I drank 2 glasses of water" or "I walked 5km today"
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  habitInfo: {
    marginBottom: 24,
  },
  habitTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalInfo: {
    marginTop: 8,
  },
  goalText: {
    marginTop: 8,
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: colors.light.tint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    color: colors.light.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
  },
  aiInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  logButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
}); 