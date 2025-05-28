import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  goalEnabled: boolean;
  goalValue: number | null;
  goalUnit: string | null;
  goalType: 'min' | 'max' | 'precise' | null;
  repeatEnabled: boolean;
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatEvery: number | null;
  repeatDaysOfWeek: number[] | null;
  repeatDaysOfMonth: number[] | null;
  repeatDate: string | null;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (title: string, goal?: {
    goalEnabled: boolean;
    goalValue: number | null;
    goalUnit: string | null;
    goalType: 'min' | 'max' | 'precise' | null;
  }, repeat?: {
    repeatEnabled: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatEvery: number | null;
    repeatDaysOfWeek: number[] | null;
    repeatDaysOfMonth: number[] | null;
    repeatDate: string | null;
  }) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  editHabit: (id: string, newTitle: string, goal?: {
    goalEnabled: boolean;
    goalValue: number | null;
    goalUnit: string | null;
    goalType: 'min' | 'max' | 'precise' | null;
  }, repeat?: {
    repeatEnabled: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatEvery: number | null;
    repeatDaysOfWeek: number[] | null;
    repeatDaysOfMonth: number[] | null;
    repeatDate: string | null;
  }) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from storage on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = async (title: string, goal?: {
    goalEnabled: boolean;
    goalValue: number | null;
    goalUnit: string | null;
    goalType: 'min' | 'max' | 'precise' | null;
  }, repeat?: {
    repeatEnabled: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatEvery: number | null;
    repeatDaysOfWeek: number[] | null;
    repeatDaysOfMonth: number[] | null;
    repeatDate: string | null;
  }) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      done: false,
      createdAt: Date.now(),
      goalEnabled: goal?.goalEnabled ?? false,
      goalValue: goal?.goalValue ?? null,
      goalUnit: goal?.goalUnit ?? null,
      goalType: goal?.goalType ?? null,
      repeatEnabled: repeat?.repeatEnabled ?? false,
      repeatType: repeat?.repeatType ?? 'none',
      repeatEvery: repeat?.repeatEvery ?? null,
      repeatDaysOfWeek: repeat?.repeatDaysOfWeek ?? null,
      repeatDaysOfMonth: repeat?.repeatDaysOfMonth ?? null,
      repeatDate: repeat?.repeatDate ?? null,
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const toggleHabit = async (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, done: !habit.done } : habit
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const editHabit = async (id: string, newTitle: string, goal?: {
    goalEnabled: boolean;
    goalValue: number | null;
    goalUnit: string | null;
    goalType: 'min' | 'max' | 'precise' | null;
  }, repeat?: {
    repeatEnabled: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatEvery: number | null;
    repeatDaysOfWeek: number[] | null;
    repeatDaysOfMonth: number[] | null;
    repeatDate: string | null;
  }) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id
        ? {
            ...habit,
            title: newTitle,
            goalEnabled: goal?.goalEnabled ?? habit.goalEnabled,
            goalValue: goal?.goalValue ?? habit.goalValue,
            goalUnit: goal?.goalUnit ?? habit.goalUnit,
            goalType: goal?.goalType ?? habit.goalType,
            repeatEnabled: repeat?.repeatEnabled ?? habit.repeatEnabled,
            repeatType: repeat?.repeatType ?? habit.repeatType,
            repeatEvery: repeat?.repeatEvery ?? habit.repeatEvery,
            repeatDaysOfWeek: repeat?.repeatDaysOfWeek ?? habit.repeatDaysOfWeek,
            repeatDaysOfMonth: repeat?.repeatDaysOfMonth ?? habit.repeatDaysOfMonth,
            repeatDate: repeat?.repeatDate ?? habit.repeatDate,
          }
        : habit
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, editHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
} 