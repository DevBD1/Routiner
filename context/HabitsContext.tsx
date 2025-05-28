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
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly' | null;
  repeatEvery: number | null;
  repeatDate: string | null;
  repeatDaysOfWeek: number[] | null;
  repeatDaysOfMonth: number[] | null;
  currentValue: number;
  lastUpdated: string | null;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'done' | 'currentValue' | 'lastUpdated'>) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, habit: Habit) => void;
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

  const addHabit = (habit: Omit<Habit, 'id' | 'done' | 'currentValue' | 'lastUpdated'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      done: false,
      createdAt: Date.now(),
      currentValue: 0,
      lastUpdated: null,
    };
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const toggleHabit = (id: string) => {
    const newHabits = habits.map(habit =>
      habit.id === id ? { ...habit, done: !habit.done } : habit
    );
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const deleteHabit = (id: string) => {
    const newHabits = habits.filter(habit => habit.id !== id);
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const updateHabit = (id: string, updatedHabit: Habit) => {
    const newHabits = habits.map(habit =>
      habit.id === id ? updatedHabit : habit
    );
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, updateHabit }}>
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