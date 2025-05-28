import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "@/constants/styles";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHabits } from "@/context/HabitsContext";

const UNITS = [
  "min", "hour", "glass", "ml", "kg", "g", "lb", "oz", "km", "liter", "mile", "piece"
];
const GOAL_TYPES = [
  { label: "Minimum", value: "min" },
  { label: "Maximum", value: "max" },
  { label: "Precise", value: "precise" },
];

const EditHabitScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, editHabit } = useHabits();
  const habit = habits.find((h) => h.id === id);
  const [habitName, setHabitName] = useState(habit ? habit.title : "");
  const [goalEnabled, setGoalEnabled] = useState(habit?.goalEnabled ?? false);
  const [goalValue, setGoalValue] = useState<string>(habit?.goalValue ? String(habit.goalValue) : "");
  const [goalUnit, setGoalUnit] = useState<string>(habit?.goalUnit ?? UNITS[0]);
  const [goalType, setGoalType] = useState<'min' | 'max' | 'precise'>(habit?.goalType ?? "min");

  useEffect(() => {
    if (habit) {
      setHabitName(habit.title);
      setGoalEnabled(habit.goalEnabled ?? false);
      setGoalValue(habit.goalValue !== null && habit.goalValue !== undefined ? String(habit.goalValue) : "");
      setGoalUnit(habit.goalUnit ?? UNITS[0]);
      setGoalType(habit.goalType ?? "min");
    }
  }, [habit]);

  const darkGradient: [ColorValue, ColorValue, ColorValue] = [
    "#151718",
    "#1a1d1e",
    "#24243e",
  ];
  const lightGradient: [ColorValue, ColorValue, ColorValue] = [
    "#ffffff",
    "#f5f5f5",
    "#e8e8e8",
  ];

  const handleEditHabit = async () => {
    if (!habit || !habitName.trim()) return;
    try {
      await editHabit(habit.id, habitName.trim(), goalEnabled ? {
        goalEnabled,
        goalValue: goalValue ? parseInt(goalValue, 10) : null,
        goalUnit,
        goalType,
      } : {
        goalEnabled: false,
        goalValue: null,
        goalUnit: null,
        goalType: null,
      });
      router.back();
    } catch (error) {
      console.error('Error editing habit:', error);
    }
  };

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText type="title">Habit not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={colorScheme === "dark" ? darkGradient : lightGradient}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ThemedText type="title" style={{ marginBottom: 24 }}>
            Edit Habit
          </ThemedText>

          <ThemedView
            style={{
              backgroundColor: colors[colorScheme].frame,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <TextInput
              placeholder="Enter habit name"
              placeholderTextColor={colors[colorScheme].tabIconDefault}
              value={habitName}
              onChangeText={setHabitName}
              style={{
                fontSize: 16,
                color: colors[colorScheme].text,
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors[colorScheme].tabIconDefault,
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleEditHabit}
            />
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
              <ThemedText style={{ marginRight: 8 }}>Set goal</ThemedText>
              <Switch
                value={goalEnabled}
                onValueChange={setGoalEnabled}
                thumbColor={goalEnabled ? colors[colorScheme].tint : colors[colorScheme].tabIconDefault}
                trackColor={{ true: colors[colorScheme].tint, false: colors[colorScheme].tabIconDefault }}
              />
            </View>
            {goalEnabled && (
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    placeholder="Value"
                    placeholderTextColor={colors[colorScheme].tabIconDefault}
                    value={goalValue}
                    onChangeText={setGoalValue}
                    keyboardType="numeric"
                    style={{
                      fontSize: 16,
                      color: colors[colorScheme].text,
                      borderBottomWidth: 1,
                      borderBottomColor: colors[colorScheme].tabIconDefault,
                      width: 60,
                      marginRight: 8,
                    }}
                  />
                  {/* Unit Picker */}
                  <View style={{ borderBottomWidth: 1, borderBottomColor: colors[colorScheme].tabIconDefault }}>
                    <TextInput
                      value={goalUnit}
                      onChangeText={setGoalUnit}
                      style={{ fontSize: 16, color: colors[colorScheme].text, width: 70 }}
                      placeholder="Unit"
                      placeholderTextColor={colors[colorScheme].tabIconDefault}
                    />
                  </View>
                </View>
                {/* Goal Type Picker */}
                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  {GOAL_TYPES.map((type) => (
                    <Pressable
                      key={type.value}
                      onPress={() => setGoalType(type.value as 'min' | 'max' | 'precise')}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: goalType === type.value ? colors[colorScheme].tint : 'transparent',
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: colors[colorScheme].tabIconDefault,
                      }}
                    >
                      <ThemedText style={{ color: goalType === type.value ? colors[colorScheme].background : colors[colorScheme].text }}>
                        {type.label}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </ThemedView>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable
              onPress={() => router.back()}
              style={[
                styles.button,
                {
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: colors[colorScheme].frame,
                },
              ]}
            >
              <ThemedText style={{ textAlign: "center" }}>Cancel</ThemedText>
            </Pressable>

            <Pressable
              onPress={handleEditHabit}
              style={[
                styles.button,
                {
                  flex: 1,
                  marginLeft: 8,
                  backgroundColor: colors[colorScheme].tint,
                  opacity: habitName.trim() ? 1 : 0.5,
                },
              ]}
            >
              <ThemedText
                style={{ textAlign: "center", color: colors[colorScheme].background }}
              >
                Save
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default EditHabitScreen; 