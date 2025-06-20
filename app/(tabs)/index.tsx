import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, View as RNView, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import GlobalStyles, { box } from '@/constants/GlobalStyles';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import i18n from '@/i18n';

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

const HABITS_KEY = 'habits';

async function saveHabits(habits: Habit[]) {
  await SecureStore.setItemAsync(HABITS_KEY, JSON.stringify(habits));
}

async function loadHabits(): Promise<Habit[]> {
  const data = await SecureStore.getItemAsync(HABITS_KEY);
  const habits = data ? JSON.parse(data) : [];
  return habits;
}

function getDatesAroundToday() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 3);
    return d;
  });
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function shouldShowHabitOnDate(habit: Habit, date: Date): boolean {
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
        const daysSinceReference = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceReference % interval === 0;
      }
    }
  }
  
  // Default to showing daily if pattern is not recognized
  return true;
}

export default function HabitTrackerScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const navigation = useNavigation();
  const [selectedDateIdx, setSelectedDateIdx] = useState(3); // today
  const [expanded, setExpanded] = useState<string | null>(null);
  const dates = getDatesAroundToday();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = dates[selectedDateIdx];
  const selectedDateStr = formatDate(selectedDate);

  // Filter habits to only show those scheduled for the selected date
  const habitsForSelectedDate = habits.filter(habit => shouldShowHabitOnDate(habit, selectedDate));

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setLoading(true);
      loadHabits().then(h => {
        if (isActive) {
          setHabits(h);
          setLoading(false);
        }
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!loading) saveHabits(habits);
  }, [habits, loading]);

  function addHabit(habit: Habit) {
    setHabits(prev => [...prev, habit]);
  }

  function updateHabit(habit: Habit) {
    setHabits(prev => prev.map(h => h.id === habit.id ? habit : h));
  }

  function removeHabit(id: string) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  const completed = habitsForSelectedDate.filter(h => (h.progress[selectedDateStr] || 0) > 0).length;
  const total = habitsForSelectedDate.length;
  const progress = total ? completed / total : 0;

  if (loading) return <Text>{i18n.t('loading')}</Text>;

  return (
    <View style={[GlobalStyles.container, { backgroundColor: theme.background }]}>
      {/* Date Selector */}
      <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={d => d.toDateString()}
        style={styles.dateList}
        contentContainerStyle={styles.dateListContent}
        renderItem={({ item, index }) => {
          const isToday = index === 3;
          const isSelected = index === selectedDateIdx;
          return (
            <TouchableOpacity
              style={[styles.dateSlot, isSelected && { backgroundColor: theme.button1 }]}
              onPress={() => setSelectedDateIdx(index)}
            >
              <Text style={[
                styles.dateText,
                { color: theme.tabIconDefault },
                isToday && { color: theme.button2 },
                isSelected && { color: theme.text },
              ]}>
                {item.toLocaleDateString(undefined, { weekday: 'short' })}
              </Text>
              <Text style={[
                styles.dayNum,
                { color: theme.tabIconDefault },
                isSelected && { color: theme.text },
              ]}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* Progress Bar */}
      <View style={styles.progressBox}>
        <Text style={[styles.progressLabel, { color: theme.tabIconDefault }]}>{i18n.t('daily_progress')}</Text>
        <View style={[styles.progressBarBg, { backgroundColor: theme.button1 }]}>
          <View style={[styles.progressBar, { backgroundColor: theme.button2, width: `${progress * 100}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: theme.tabIconDefault }]}>{completed}/{total} {i18n.t('habits_completed')}</Text>
      </View>
      {/* Habits List */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginTop: 16, marginBottom: 8 }}>
        <Text style={[styles.sectionTitle, { color: theme.text, flex: 1 }]}>
          {selectedDateIdx === 3 ? i18n.t('todays_habits') : `${selectedDate.toLocaleDateString()} ${i18n.t('habits')}`}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('create_nav' as never)} style={{ marginRight: 16 }}>
          <FontAwesome5 name="plus" size={22} color={theme.button2} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={habitsForSelectedDate}
        keyExtractor={h => h.id}
        renderItem={({ item }) => {
          const isOpen = expanded === item.id;
          const renderRightActions = () => (
            <TouchableOpacity
              style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80, height: '100%' }}
              onPress={() => {
                Alert.alert(i18n.t('delete_habit'), `${i18n.t('delete_habit_confirm')} "${item.name}"?`, [
                  { text: i18n.t('cancel'), style: 'cancel' },
                  { text: i18n.t('delete'), style: 'destructive', onPress: async () => {
                    removeHabit(item.id);
                    await saveHabits(habits.filter(h => h.id !== item.id));
                  }}
                ]);
              }}
            >
              <FontAwesome5 name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          );
          return (
            <Swipeable renderRightActions={renderRightActions}>
              <View style={box(colorScheme)}>
                <TouchableOpacity style={styles.habitRow} onPress={() => setExpanded(isOpen ? null : item.id)}>
                  <View style={[styles.iconBox, { backgroundColor: theme.button1 }]}>
                    <FontAwesome5 name={item.icon} size={24} color={theme.tabIconDefault} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.habitName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.habitTime, { color: theme.tabIconDefault }]}>{item.time}</Text>
                  </View>
                  <View style={[styles.progressMiniBarBg, { backgroundColor: theme.button1 }]}>
                    <View style={[styles.progressMiniBar, { backgroundColor: theme.button2, width: `${Math.min(100, ((item.progress[selectedDateStr] || 0) / item.goal) * 100)}%` }]} />
                  </View>
                  <Text style={[styles.habitGoal, { color: theme.text }]}>{item.progress[selectedDateStr] || 0}</Text>
                  <TouchableOpacity
                    style={[styles.checkbox, { borderColor: theme.tabIconDefault, backgroundColor: (item.progress[selectedDateStr] || 0) >= item.goal ? theme.button2 : 'transparent' }]}
                    onPress={async () => {
                      const currentProgress = item.progress[selectedDateStr] || 0;
                      const updatedHabits = habits.map(h =>
                        h.id === item.id
                          ? { 
                              ...h, 
                              progress: { 
                                ...h.progress, 
                                [selectedDateStr]: currentProgress >= h.goal ? 0 : h.goal 
                              }
                            }
                          : h
                      );
                      setHabits(updatedHabits);
                      await saveHabits(updatedHabits);
                    }}
                  >
                    {(item.progress[selectedDateStr] || 0) >= item.goal && (
                      <FontAwesome5 name="check" size={16} color={theme.background} />
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.habitDetails}>
                    <Text style={[styles.detailText, { color: theme.text }]}><Text style={styles.detailLabel}>{i18n.t('notes')}:</Text> {item.notes}</Text>
                    <Text style={[styles.detailText, { color: theme.text }]}><Text style={styles.detailLabel}>{i18n.t('goal')}:</Text> {item.goal} {item.unit}</Text>
                    <Text style={[styles.detailText, { color: theme.text }]}><Text style={styles.detailLabel}>{i18n.t('progress')}:</Text> {item.progress[selectedDateStr] || 0} {item.unit}</Text>
                    <Text style={[styles.detailText, { color: theme.text }]}><Text style={styles.detailLabel}>{i18n.t('repetition')}:</Text> {item.repetition}</Text>
                    <TouchableOpacity style={styles.editIcon}>
                      <FontAwesome5 name="edit" size={18} color={theme.tabIconDefault} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Swipeable>
          );
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateList: {
    marginTop: 16,
    marginBottom: 8,
    maxHeight: 70,
  },
  dateListContent: {
    paddingHorizontal: 8,
  },
  dateSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    padding: 8,
    borderRadius: 12,
    minWidth: 48,
    backgroundColor: 'rgba(166,181,161,0.08)',
  },
  dateSlotSelected: {
    backgroundColor: '#23281e',
  },
  dateText: {
    color: '#A6B5A1',
    fontWeight: 'bold',
    fontSize: 13,
  },
  todayText: {
    color: '#5BE13A',
  },
  selectedText: {
    color: '#fff',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A6B5A1',
  },
  progressBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  progressLabel: {
    color: '#A6B5A1',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#23281e',
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#5BE13A',
  },
  progressText: {
    color: '#A6B5A1',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    color: '#fff',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#23281e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  habitTime: {
    color: '#A6B5A1',
    fontSize: 13,
  },
  progressMiniBarBg: {
    width: 48,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#23281e',
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  progressMiniBar: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#5BE13A',
  },
  habitGoal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    minWidth: 24,
    textAlign: 'right',
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
  habitDetails: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  detailText: {
    color: '#A6B5A1',
    fontSize: 14,
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
