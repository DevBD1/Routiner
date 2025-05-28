import React from "react";
import { View, Switch, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSettings } from "@/context/SettingsContext";
import { usePremium } from '@/context/PremiumContext';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { settings, updateSettings } = useSettings();
  const { isPremium, activatePremium, deactivatePremium } = usePremium();

  return (
    <ThemedView style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
          {isPremium ? '🌟 Premium User' : 'Free User'}
        </ThemedText>
        <Pressable onPress={activatePremium} style={[styles.button, { backgroundColor: '#FFD700', marginBottom: 8 }]}> 
          <ThemedText style={{ color: '#222', fontWeight: 'bold' }}>Activate Premium</ThemedText>
        </Pressable>
        <Pressable onPress={deactivatePremium} style={[styles.button, { backgroundColor: '#ccc' }]}> 
          <ThemedText style={{ color: '#222', fontWeight: 'bold' }}>Deactivate Premium</ThemedText>
        </Pressable>
      </View>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Habit Settings</ThemedText>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingTitle}>MAX Habits Start Full</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Progress bar for MAX-type habits starts full and decreases as you progress
            </ThemedText>
          </View>
          <Switch
            value={settings.maxHabitStartFull}
            onValueChange={(value) => updateSettings({ maxHabitStartFull: value })}
            trackColor={{ 
              false: colors[colorScheme].tabIconDefault,
              true: colors[colorScheme].tint 
            }}
            thumbColor={colors[colorScheme].background}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  button: {
    padding: 12,
    borderRadius: 8,
  },
}); 