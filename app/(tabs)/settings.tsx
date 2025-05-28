import React from "react";
import { SafeAreaView, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "@/constants/styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";

const SettingsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const darkGradient: [ColorValue, ColorValue, ColorValue] = ["#151718", "#1a1d1e", "#24243e"];
  const lightGradient: [ColorValue, ColorValue, ColorValue] = ["#ffffff", "#f5f5f5", "#e8e8e8"];
  const gradientColors = colorScheme === "dark" ? darkGradient : lightGradient;

  return (
    <LinearGradient colors={gradientColors} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Add settings content here */}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen; 