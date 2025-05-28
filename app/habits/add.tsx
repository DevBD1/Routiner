import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  ColorValue,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "@/constants/styles";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHabits } from "@/context/HabitsContext";

const AddHabitScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [habitName, setHabitName] = useState("");
  const { addHabit } = useHabits();

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

  const handleAddHabit = async () => {
    if (!habitName.trim()) return;
    
    try {
      await addHabit(habitName.trim());
      router.back();
    } catch (error) {
      console.error('Error adding habit:', error);
      // TODO: Show error message to user
    }
  };

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
            Add New Habit
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
              onSubmitEditing={handleAddHabit}
            />
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
              onPress={handleAddHabit}
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
                Add Habit
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddHabitScreen; 