// app/(tabs)/index.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
// Shared styles import
import { styles } from "@/constants/styles";

const { width } = Dimensions.get("window");

// Sample habit data (replace with real data source)
const habits = [
  { id: "1", title: "Drink Water", done: true },
  { id: "2", title: "Meditate", done: false },
  { id: "3", title: "Exercise", done: false },
  { id: "4", title: "Read Book", done: true },
];

const HomeScreen: React.FC = () => {
  const completedCount = habits.filter((h) => h.done).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Routiner</Text>
          <Text style={styles.subtitle}>
            Build your habits, build your future
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{progressPercent}%</Text>
          </View>
        </View>

        {/* Habits List */}
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View
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
                <Text
                  style={[
                    styles.cardText,
                    item.done && styles.correctText,
                    { fontWeight: "300", marginRight: 12 },
                  ]}
                >
                  {item.done ? "✓" : "○"}
                </Text>
                <Text
                  style={[
                    styles.cardText,
                    item.done && styles.correctText,
                    { fontWeight: "300" },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          )}
        />

        {/* Floating Add Button */}
        <View style={styles.footer}>
          <Link href="/habits/add" asChild>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
