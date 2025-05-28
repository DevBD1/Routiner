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
            <ThemedView
              style={[
                styles.habitCard,
                {
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.2)",
                  paddingVertical: 8,
                  paddingHorizontal: 0,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Pressable onPress={() => toggleHabit(item.id)} style={{ flex: 1 }}>
                <View style={{ flexDirection: "column" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ThemedText
                      style={[
                        item.done && styles.correctText,
                        { fontWeight: "300", marginRight: 12 },
                      ]}
                    >
                      {item.done ? "✓" : "○"}
                    </ThemedText>
                    <ThemedText
                      style={[
                        item.done && styles.correctText,
                        { fontWeight: "300" },
                      ]}
                    >
                      {item.title}
                    </ThemedText>
                    {item.goalEnabled && item.goalValue && item.goalUnit && item.goalType && (
                      <ThemedText style={{ marginLeft: 8, fontSize: 13, color: colors[colorScheme].tabIconDefault }}>
                        {item.goalType.toUpperCase()} {item.goalValue} {item.goalUnit}
                      </ThemedText>
                    )}
                  </View>
                  {getRepeatSummary(item) && (
                    <ThemedText style={{ fontSize: 12, color: colors[colorScheme].tabIconDefault, marginTop: 2 }}>
                      {getRepeatSummary(item)}
                    </ThemedText>
                  )}
                </View>
              </Pressable>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => router.push(`/habits/edit/${item.id}`)}
                  style={{ padding: 8, marginLeft: 4 }}
                  accessibilityLabel="Edit habit"
                >
                  <ThemedText style={{ color: colors[colorScheme].tint, fontSize: 18 }}>
                    ✏️
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => deleteHabit(item.id)}
                  style={{ padding: 8, marginLeft: 4 }}
                  accessibilityLabel="Delete habit"
                >
                  <ThemedText style={{ color: colors[colorScheme].error, fontSize: 18 }}>
                    🗑️
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
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
