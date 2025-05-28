// app/(tabs)/index.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

import { styles } from "@/constants/styles";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");

// Sample habit data (replace with real data source)
const habits = [
  { id: "1", title: "Drink Water", done: true },
  { id: "2", title: "Meditate", done: false },
  { id: "3", title: "Exercise", done: false },
  { id: "4", title: "Read Book", done: true },
];

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const completedCount = habits.filter((h) => h.done).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <LinearGradient
      colors={
        colorScheme === "light"
          ? ["#ffffff", "#f5f5f5", "#e8e8e8"]
          : ["#151718", "#1a1d1e", "#24243e"]
      }
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.headerText}>
          <ThemedText type="title">Routiner</ThemedText>
          <ThemedText type="subtitle">
            Build your habits, build your future
          </ThemedText>
        </ThemedView>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
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
                },
              ]}
            >
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
