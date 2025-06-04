import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateResponse, extractNumericValue, OllamaError } from '../services/ollama';

// Debug logging utility
const debugLog = (section: string, data: any) => {
  console.log(`[Premium Debug] ${section}:`, JSON.stringify(data, null, 2));
};
 
interface PremiumContextType {
  isPremium: boolean;
  activatePremium: () => Promise<void>;
  deactivatePremium: () => Promise<void>;
  processAiInput: (input: string, habit: any) => Promise<number>;
  lastError: string | null;
  clearError: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('premium');
      debugLog('Premium Status Loaded', { status });
      setIsPremium(status === 'true');
    } catch (error) {
      debugLog('Premium Status Error', { error });
      setLastError('Failed to load premium status');
    }
  };

  const activatePremium = async () => {
    try {
      await AsyncStorage.setItem('premium', 'true');
      debugLog('Premium Activated', { timestamp: new Date().toISOString() });
      setIsPremium(true);
      setLastError(null);
    } catch (error) {
      debugLog('Premium Activation Error', { error });
      setLastError('Failed to activate premium');
    }
  };

  const deactivatePremium = async () => {
    try {
      await AsyncStorage.setItem('premium', 'false');
      debugLog('Premium Deactivated', { timestamp: new Date().toISOString() });
      setIsPremium(false);
      setLastError(null);
    } catch (error) {
      debugLog('Premium Deactivation Error', { error });
      setLastError('Failed to deactivate premium');
    }
  };

  const clearError = () => {
    debugLog('Error Cleared', { previousError: lastError });
    setLastError(null);
  };

  const processAiInput = async (input: string, habit: any): Promise<number> => {
    debugLog('Processing Input', {
      input,
      habit,
      isPremium,
      timestamp: new Date().toISOString()
    });

    if (!isPremium) {
      const error = 'Premium feature not available';
      debugLog('Premium Check Failed', { error });
      setLastError(error);
      throw new Error(error);
    }

    try {
      // Create a prompt that includes the habit context, examples, and conversion instructions
      const prompt = `Given the following habit tracking input: "${input}" for habit "${habit.name}" with unit "${habit.goalUnit}", extract the numeric value that should be logged. If a conversion is needed, make it. If no clear numeric value is present, return 0. Only respond with the number.

      Examples:
      Input: "I ran 5 kilometers today" -> Response: "5" (when unit is km)
      Input: "Ran 3.1 miles" -> Response: "5" (converted from miles to km when unit is km)
      Input: "Did 3 sets of 10 pushups" -> Response: "30"
      Input: "Went for a run" -> Response: "0"
      Input: "Completed 2 hours of meditation" -> Response: "120" (converted to minutes when unit is min)
      Input: "Did 5 sets of 12 reps" -> Response: "60"
      Input: "Drank 2 liters of water" -> Response: "2000" (converted to milliliters when unit is ml)
      Input: "Lifted 50 pounds" -> Response: "22.68" (converted to kilograms when unit is kg)`;
      
      debugLog('AI Prompt', { prompt });
      
      const response = await generateResponse(prompt);
      debugLog('AI Raw Response', { response });
      
      const value = extractNumericValue(response);
      debugLog('Processing Result', {
        input,
        response,
        extractedValue: value,
        timestamp: new Date().toISOString()
      });
      
      setLastError(null);
      return value;
    } catch (error) {
      debugLog('Processing Error', {
        error,
        input,
        habit,
        timestamp: new Date().toISOString()
      });
      
      let errorMessage = 'Failed to process input';
      
      if (error instanceof OllamaError) {
        switch (error.details?.type) {
          case 'CONNECTION_ERROR':
            errorMessage = 'Cannot connect to AI service. Please check if the server is running.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'API_ERROR':
            if (error.details?.status === 404) {
              errorMessage = 'AI service not found. Please check server configuration.';
            } else if (error.details?.status === 500) {
              errorMessage = 'AI service error. Please try again later.';
            } else {
              errorMessage = `AI service error: ${error.message}`;
            }
            break;
          default:
            errorMessage = `AI processing error: ${error.message}`;
        }
      }
      
      setLastError(errorMessage);
      throw error;
    }
  };

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      activatePremium, 
      deactivatePremium, 
      processAiInput,
      lastError,
      clearError
    }}>
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