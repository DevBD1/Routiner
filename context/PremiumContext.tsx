import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PremiumContextType {
  isPremium: boolean;
  activatePremium: () => Promise<void>;
  deactivatePremium: () => Promise<void>;
  processAiInput: (input: string, habit: any) => Promise<number>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('premium');
      setIsPremium(status === 'true');
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const activatePremium = async () => {
    try {
      await AsyncStorage.setItem('premium', 'true');
      setIsPremium(true);
    } catch (error) {
      console.error('Error activating premium:', error);
    }
  };

  const deactivatePremium = async () => {
    try {
      await AsyncStorage.setItem('premium', 'false');
      setIsPremium(false);
    } catch (error) {
      console.error('Error deactivating premium:', error);
    }
  };

  const processAiInput = async (input: string, habit: any): Promise<number> => {
    if (!isPremium) {
      throw new Error('Premium feature not available');
    }

    // TODO: Implement actual AI processing
    // For now, return a mock value
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock implementation
        const numberMatch = input.match(/\d+/);
        if (numberMatch) {
          resolve(parseInt(numberMatch[0]));
        } else {
          resolve(0);
        }
      }, 1000);
    });
  };

  return (
    <PremiumContext.Provider value={{ isPremium, activatePremium, deactivatePremium, processAiInput }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
} 