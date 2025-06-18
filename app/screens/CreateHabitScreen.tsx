import React, { useState } from 'react';
import { ScrollView, TextInput, StyleSheet, TouchableOpacity, Switch, Alert, Platform, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import GlobalStyles, { box } from '@/constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import i18n from '@/i18n';
import { Picker } from '@react-native-picker/picker';

const UNITS = ['liter', 'meter', 'minute', 'hour', 'page', 'glass', 'session', 'entry'];
const REPEAT_PATTERNS = [
  'Everyday',
  'Every 2 days',
  'Every 3 days',
  'Every Monday',
  'Every Tuesday and Wednesday',
  'Once a week',
];

const HABITS_KEY = 'habits';

const DYNAMIC_HABITS = [
  { name: 'Video Games', type: 'dynamic' },
  { name: 'Drink Water', type: 'dynamic' },
  { name: 'Read', type: 'dynamic' },
  { name: 'Take a Course', type: 'dynamic' },
  { name: 'Study', type: 'dynamic' },
  { name: 'Watch Media', type: 'dynamic' },
];
const STATIC_HABITS = [
  { name: 'Make your bed', type: 'static' },
  { name: 'Clean the house', type: 'static' },
  { name: 'Clean the dishes', type: 'static' },
  { name: 'Pay the bills', type: 'static' },
  { name: 'Meditate', type: 'static' },
  { name: 'Pray', type: 'static' },
  { name: 'Cook a meal', type: 'static' },
  { name: 'Practice Yoga', type: 'static' },
  { name: 'Go to the gym', type: 'static' },
  { name: 'Take a shower', type: 'static' },
];
const PRESET_HABITS = [...DYNAMIC_HABITS, ...STATIC_HABITS];

async function loadHabits() {
  const data = await SecureStore.getItemAsync(HABITS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveHabits(habits: any[]) {
  await SecureStore.setItemAsync(HABITS_KEY, JSON.stringify(habits));
}

export default function CreateHabitScreen() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [selectedHabit, setSelectedHabit] = useState(PRESET_HABITS[0].name);
  const selectedHabitType = DYNAMIC_HABITS.some(h => h.name === selectedHabit) ? 'dynamic' : 'static';
  const [notes, setNotes] = useState('');
  const [goalOn, setGoalOn] = useState(true);
  const [goalValue, setGoalValue] = useState('');
  const [goalUnit, setGoalUnit] = useState(UNITS[0]);
  const [goalType, setGoalType] = useState<'minimum' | 'maximum' | 'precise'>('precise');
  const [repeatPattern, setRepeatPattern] = useState(REPEAT_PATTERNS[0]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedHabit.trim()) {
      Alert.alert(i18n.t('validation'), i18n.t('please_select_habit'));
      return;
    }
    if (!repeatPattern || repeatPattern === 'None') {
      Alert.alert(i18n.t('validation'), i18n.t('please_select_repetition'));
      return;
    }
    let goal = goalOn ? parseInt(goalValue) : 1;
    if (goalOn && (!goalValue || isNaN(goal))) {
      Alert.alert(i18n.t('validation'), i18n.t('please_enter_goal'));
      return;
    }
    setSaving(true);
    try {
      const newHabit = {
        id: uuid.v4(),
        name: selectedHabit,
        icon: 'circle', // default, can be edited later
        time: '',
        goal: selectedHabitType === 'dynamic' ? (goalOn ? parseInt(goalValue) : 1) : 1,
        unit: selectedHabitType === 'dynamic' && goalOn ? goalUnit : '',
        progress: {}, // Initialize as empty object for date-based progress
        notes,
        repetition: repeatPattern,
      };
      const habits = await loadHabits();
      await saveHabits([...habits, newHabit]);
      setSaving(false);
      console.log('Showing success alert and navigating back');
      Alert.alert(i18n.t('habit_created'), i18n.t('habit_added'), [
        { text: i18n.t('ok'), onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setSaving(false);
      console.error('Error saving habit:', error);
      Alert.alert(i18n.t('error'), error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={{ marginLeft: 16, marginTop: 50 }} onPress={() => navigation.goBack()}>
        <Text style={{ color: theme.text, fontSize: 28 }}>{'←'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.text }]}>{i18n.t('create_new_habit')}</Text>
      <View style={box(colorScheme)}>
        <Picker
          selectedValue={selectedHabit}
          style={[styles.input, { color: theme.text }]}
          onValueChange={value => {
            setSelectedHabit(value);
            if (STATIC_HABITS.some(h => h.name === value)) {
              setGoalOn(false);
            } else {
              setGoalOn(true);
            }
          }}
        >
          <Picker.Item label="-- Dynamic Limitation Habits --" value="" enabled={false} />
          {DYNAMIC_HABITS.map(h => (
            <Picker.Item key={h.name} label={h.name} value={h.name} />
          ))}
          <Picker.Item label="-- Static Habits --" value="" enabled={false} />
          {STATIC_HABITS.map(h => (
            <Picker.Item key={h.name} label={h.name} value={h.name} />
          ))}
        </Picker>
        <TextInput
          style={[styles.textarea, { color: theme.text }]}
          placeholder={i18n.t('notes')}
          placeholderTextColor={theme.tabIconDefault}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      {selectedHabitType === 'dynamic' && (
        <View>
          <Text style={[styles.label, { color: theme.text }]}>{i18n.t('goal')}</Text>
          <View style={[box(colorScheme), { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
            <Text style={{ color: theme.text }}>{i18n.t('goal_toggle')}</Text>
            <Switch value={goalOn} onValueChange={setGoalOn} thumbColor={goalOn ? theme.button2 : theme.button1} trackColor={{ true: theme.button1, false: theme.button1 }} />
          </View>
          {goalOn && (
            <View style={box(colorScheme)}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={i18n.t('value')}
                placeholderTextColor={theme.tabIconDefault}
                value={goalValue}
                onChangeText={setGoalValue}
                keyboardType="numeric"
              />
              <View style={styles.pickerRow}>
                <Picker
                  selectedValue={goalUnit}
                  style={[styles.picker, { color: theme.text }]}
                  onValueChange={setGoalUnit}
                >
                  {UNITS.map(u => <Picker.Item key={u} label={u} value={u} />)}
                </Picker>
              </View>
              <View style={styles.goalTypeRow}>
                {(['minimum', 'maximum', 'precise'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.goalTypeButton, goalType === type && { backgroundColor: theme.button1 }]}
                    onPress={() => setGoalType(type)}
                  >
                    <Text style={{ color: theme.text, fontWeight: goalType === type ? 'bold' : 'normal' }}>{i18n.t(type)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
      <Text style={[styles.label, { color: theme.text }]}>{i18n.t('repeat')} *</Text>
      <View style={box(colorScheme)}>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={repeatPattern}
            style={[styles.picker, { color: theme.text }]}
            onValueChange={setRepeatPattern}
          >
            {REPEAT_PATTERNS.map(r => <Picker.Item key={r} label={r} value={r} />)}
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.button2, opacity: saving ? 0.6 : 1 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={theme.background} />
        ) : (
          <Text style={[styles.saveButtonText, { color: theme.background }]}>{i18n.t('save_habit')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 16,
  },
  input: {
    backgroundColor: 'rgba(166,181,161,0.08)',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    marginBottom: 12,
  },
  textarea: {
    backgroundColor: 'rgba(166,181,161,0.08)',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    minHeight: 80,
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  pickerRow: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(166,181,161,0.08)',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 48,
    width: '100%',
  },
  goalTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  goalTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: 'rgba(166,181,161,0.08)',
  },
  saveButton: {
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 