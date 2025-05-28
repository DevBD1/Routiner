import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSettings } from '@/context/SettingsContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  goalType?: 'min' | 'max' | 'precise';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 4,
  goalType = 'min'
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const { settings } = useSettings();
  
  // For MAX type habits, invert the progress if maxHabitStartFull is true
  const effectiveProgress = goalType === 'max' && settings.maxHabitStartFull
    ? 1 - progress
    : progress;
    
  const clampedProgress = Math.max(0, Math.min(1, effectiveProgress));

  return (
    <View style={[styles.container, { height, backgroundColor: colors[colorScheme].tabIconDefault }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${clampedProgress * 100}%`,
            backgroundColor: colors[colorScheme].tint,
            height
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 2,
  },
}); 