import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (title: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
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

  const addHabit = async (title: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(), // Simple ID generation
      title,
      done: false,
      createdAt: Date.now(),
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

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit }}>
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