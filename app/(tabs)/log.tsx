import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import GlobalStyles, { box } from '@/constants/GlobalStyles';
import { useColorScheme } from '@/components/useColorScheme';
import Constants from 'expo-constants';
import settings from '../../settings.json';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import Colors from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;
const basePrompt = settings.aiPrompt;
const DYNAMIC_HABITS = [
  'Video Games', 'Drink Water', 'Read', 'Take a Course', 'Study', 'Watch Media'
];
const STATIC_HABITS = [
  'Make your bed', 'Clean the house', 'Clean the dishes', 'Pay the bills',
  'Meditate', 'Pray', 'Cook a meal', 'Practice Yoga', 'Go to the gym', 'Take a shower'
];
const habitsPrompt = `\n\nYou must only use the following preset habits for all operations.\nDynamic limitation habits (these can have a goal/number/unit): ${DYNAMIC_HABITS.join(', ')}.\nStatic habits (these do not have a goal/number/unit): ${STATIC_HABITS.join(', ')}.\nDo not allow custom habits. Use only these names exactly as given. Only allow goals for dynamic habits.`;
const finalPrompt = basePrompt + habitsPrompt;

// Helper to parse note string
function parseNote(note: string) {
  // Expect format: Habit Name | Number Unit
  const match = note.match(/^(.+?)\s*\|\s*(\d+(?:\.\d+)?)\s*(\w+)?$/);
  if (match) {
    return { habit: match[1], number: match[2], unit: match[3] || '' };
  } else {
    // fallback: just show the note
    return { habit: note, number: '', unit: '' };
  }
}

const HABITS_KEY = 'habits';
async function loadHabits() {
  const data = await SecureStore.getItemAsync(HABITS_KEY);
  const habits = data ? JSON.parse(data) : [];
  console.log('AI Log - Loaded habits:', habits.map((h: Habit) => h.name));
  return habits;
}
async function saveHabits(habits: Habit[]) {
  console.log('AI Log - Saving habits:', habits.map((h: Habit) => h.name));
  await SecureStore.setItemAsync(HABITS_KEY, JSON.stringify(habits));
}

type Habit = {
  id: string;
  name: string;
  icon: string;
  time: string;
  goal: number;
  unit: string;
  progress: { [date: string]: number };
  notes: string;
  repetition: string;
};

// Conversion utility
function convertToHabitUnit(value: number, fromUnit: string, toUnit: string): number {
  const normalize = (u: string) => u.trim().toLowerCase();
  fromUnit = normalize(fromUnit);
  toUnit = normalize(toUnit);
  if (fromUnit === toUnit) return value;
  // Time conversions
  if ((fromUnit === 'minutes' || fromUnit === 'minute') && (toUnit === 'hours' || toUnit === 'hour')) {
    return value / 60;
  }
  if ((fromUnit === 'hours' || fromUnit === 'hour') && (toUnit === 'minutes' || toUnit === 'minute')) {
    return value * 60;
  }
  // Volume conversions
  if ((fromUnit === 'ml' || fromUnit === 'milliliter' || fromUnit === 'milliliters') && (toUnit === 'liter' || toUnit === 'liters')) {
    return value / 1000;
  }
  if ((fromUnit === 'liter' || fromUnit === 'liters') && (toUnit === 'ml' || toUnit === 'milliliter' || toUnit === 'milliliters')) {
    return value * 1000;
  }
  // Pages, sessions, entries, etc. (no conversion needed)
  return value;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function AILogScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loggedHabits, setLoggedHabits] = useState<Set<string>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      loadHabits().then(h => {
        if (isActive) {
          setHabits(h);
        }
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      // Try Gemini API first
      let response, data;
      if (GEMINI_API_KEY) {
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${finalPrompt}\nUser input: ${input}` }] }],
          }),
        });
        data = await response.json();
        // Try to parse JSON from Gemini response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const arr = JSON.parse(text.match(/\[.*\]/s)?.[0] || '[]');
        setNotes(arr);
      } else if (OPENAI_API_KEY) {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [
              { role: 'system', content: finalPrompt },
              { role: 'user', content: input },
            ],
            max_tokens: 256,
          }),
        });
        data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        const arr = JSON.parse(text.match(/\[.*\]/s)?.[0] || '[]');
        setNotes(arr);
      } else {
        Alert.alert('No API Key', 'No AI API key found.');
      }
    } catch (e: any) {
      Alert.alert('AI Error', e.message || 'Failed to generate notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setNotes([]);
    setLoggedHabits(new Set());
  };

  // Helper to check if a habit should be shown today based on repetition
  function shouldShowHabitToday(habit: Habit): boolean {
    const repetition = habit.repetition.toLowerCase();
    
    if (repetition === 'daily' || repetition === 'everyday') {
      return true;
    }
    
    if (repetition.includes('every')) {
      // Parse "every X days" pattern
      const match = repetition.match(/every\s+(\d+)\s+days?/i);
      if (match) {
        const interval = parseInt(match[1]);
        
        if (interval > 0) {
          // Calculate days since a reference date (Jan 1, 2024)
          const referenceDate = new Date('2024-01-01');
          const today = new Date();
          const daysSinceReference = Math.floor((today.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceReference % interval === 0;
        }
      }
    }
    
    // Default to showing daily if pattern is not recognized
    return true;
  }

  // Get habits that should be shown today
  function getHabitsForToday(): Habit[] {
    return habits.filter(habit => shouldShowHabitToday(habit));
  }

  // Add a new habit to storage
  async function addHabit(habitName: string) {
    const isDynamic = DYNAMIC_HABITS.includes(habitName);
    const newHabit: Habit = {
      id: uuid.v4() as string,
      name: habitName,
      icon: 'circle',
      time: '',
      goal: isDynamic ? 1 : 1,
      unit: isDynamic ? '' : '',
      progress: {}, // Initialize as empty object
      notes: '',
      repetition: 'Everyday', // Default to everyday instead of None
    };
    const updated = [...habits, newHabit];
    await saveHabits(updated);
    setHabits(updated);
    Alert.alert('Habit Added', `Added: ${habitName} with "Everyday" repetition`);
  }

  // Log progress for a habit
  async function logHabit(habitName: string, number: string, unit: string) {
    const isDynamic = DYNAMIC_HABITS.includes(habitName);
    const today = formatDate(new Date());
    const updated = habits.map((h: Habit) => {
      if (h.name === habitName) {
        if (isDynamic) {
          let progress = Number(number);
          if (h.unit && unit && h.unit.toLowerCase() !== unit.toLowerCase()) {
            progress = convertToHabitUnit(progress, unit, h.unit);
          }
          return { 
            ...h, 
            progress: { 
              ...h.progress, 
              [today]: progress 
            }
          };
        } else {
          return { 
            ...h, 
            progress: { 
              ...h.progress, 
              [today]: 1 
            }
          };
        }
      }
      return h;
    });
    await saveHabits(updated);
    setHabits(updated);
    
    // Mark this habit as logged in the current session
    setLoggedHabits(prev => new Set([...prev, habitName]));
    
    Alert.alert('Habit Logged', `Logged: ${habitName}${isDynamic ? ` - ${number} ${unit}` : ''}`);
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.title}>AI Log</Text>
      <View style={box(colorScheme)}>
        <TextInput
          style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#181D17' }]}
          placeholder="Enter your daily log or prompt..."
          placeholderTextColor={colorScheme === 'dark' ? '#A6B5A1' : '#888' }
          value={input}
          onChangeText={setInput}
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.generate, loading && { opacity: 0.5 }]}
          onPress={handleGenerate}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Generate Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.clear]} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear Notes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Generated Notes</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Today's available habits: {getHabitsForToday().length} of {habits.length} total
        </Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.headerCell, { textAlign: 'left' }, { flex: 2 }]}>Habit Name</Text>
          <Text style={[styles.tableCell, styles.headerCell, { textAlign: 'left' }]}>Number</Text>
          <Text style={[styles.tableCell, styles.headerCell, { textAlign: 'right' }]}>Unit</Text>
          <Text style={[styles.tableCell, styles.headerCell, { textAlign: 'right' }, { minWidth: 32 }]}>Log</Text>
        </View>
        <FlatList
          data={notes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const { habit, number, unit } = parseNote(item);
            const existingHabit = habits.find(h => h.name === habit);
            const isRegistered = existingHabit !== undefined;
            const shouldShowToday = existingHabit ? shouldShowHabitToday(existingHabit) : true;
            const isLogged = loggedHabits.has(habit);
            
            return (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { textAlign: 'left' }, { flex: 2 }]}>{habit}</Text>
                <Text style={[styles.tableCell, { textAlign: 'left' }]}>{number}</Text>
                <Text style={[styles.tableCell, { textAlign: 'left' }]}>{unit}</Text>
                {isRegistered ? (
                  shouldShowToday ? (
                    isLogged ? (
                      <Text style={styles.loggedText}>Logged</Text>
                    ) : (
                      <TouchableOpacity onPress={() => logHabit(habit, number, unit)}>
                        <Text style={styles.logButton}>Log</Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <Text style={styles.skippedText}>Skipped</Text>
                  )
                ) : (
                  <TouchableOpacity onPress={() => addHabit(habit)}>
                    <Text style={styles.addButton}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>No notes generated yet.</Text>}
          style={{ marginHorizontal: 0 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    minHeight: 80,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(166,181,161,0.08)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    minWidth: 120,
    alignItems: 'center',
  },
  generate: {
    backgroundColor: '#5BE13A',
  },
  clear: {
    backgroundColor: '#23281e',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  tableContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(166,181,161,0.04)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(166,181,161,0.10)',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(166,181,161,0.15)',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(166,181,161,0.10)',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: 'bold',
    //color: '#A6B5A1',
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#A6B5A1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  checkmark: {
    //color: '#5BE13A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    //color: '#A6B5A1',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  logButton: {
    //color: '#5BE13A',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  addButton: {
    //color: '#A6B5A1',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  loggedText: {
    //color: '#A6B5A1',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 15,
    paddingHorizontal: 4,
    textDecorationLine: 'line-through',
  },
  skippedText: {
    //color: '#A6B5A1',
    textAlign: 'right',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  summaryContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(166,181,161,0.04)',
  },
  summaryText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
