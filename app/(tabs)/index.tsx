// app/(tabs)/index.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  Dimensions,
  FlatList,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";

import { styles } from "@/constants/styles";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHabits } from "@/context/HabitsContext";
import { HabitCard } from "@/components/HabitCard";

const { width } = Dimensions.get("window");

function getRepeatSummary(habit) {
  if (!habit.repeatEnabled) return null;
  if (habit.repeatType === 'none') {
    return `One-time: ${habit.repeatDate ? new Date(habit.repeatDate).toLocaleDateString() : ''}`;
  }
  if (habit.repeatType === 'daily') {
    return `Every ${habit.repeatEvery} day(s)`;
  }
  if (habit.repeatType === 'weekly') {
    const days = (habit.repeatDaysOfWeek || []).map(idx => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]).join(', ');
    return `Every ${habit.repeatEvery} week(s) on ${days}`;
  }
  if (habit.repeatType === 'monthly') {
    const days = (habit.repeatDaysOfMonth || []).join(', ');
    return `Every ${habit.repeatEvery} month(s) on ${days}`;
  }
  return null;
}

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const { habits, toggleHabit, deleteHabit } = useHabits();
  const router = useRouter();
  const completedCount = habits.filter((h) => h.done).length;
  const progressPercent = habits.length > 0 
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

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

  return (
    <LinearGradient
      colors={colorScheme === "dark" ? darkGradient : lightGradient}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressCircle,
              {
                backgroundColor: colors[colorScheme].frame,
                borderColor: colors[colorScheme].text,
              },
            ]}
          >
            <ThemedText>{progressPercent}%</ThemedText>
          </View>
        </View>

        {/* Habits List */}
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={() => toggleHabit(item.id)}
              onEdit={() => router.push(`/habits/edit/${item.id}`)}
              onDelete={() => deleteHabit(item.id)}
            />
          )}
        />

        {/* Floating Add Button */}
        <View style={styles.footer}>
          <Link href="/habits/add" asChild>
            <Pressable style={styles.addButton}>
              <ThemedText>+</ThemedText>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
