import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

import { createTabIcon } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  const commonHeaderStyle = {
    backgroundColor: colors[colorScheme].frame,
    height: 60,
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    borderWidth: 0,
  };

  const commonTabBarStyle = {
    backgroundColor: colors[colorScheme].frame,
    height: 60,
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerTitleAlign: "center",
        headerTintColor: colors[colorScheme].text,
        headerTransparent: false,
        headerStyle: commonHeaderStyle,
        headerLeft: () => (
          <ThemedView style={{ paddingLeft: 16, backgroundColor: colors[colorScheme].frame }}>
            <ThemedText type="title">Routiner</ThemedText>
          </ThemedView>
        ),
        headerRight: () => (
          <ThemedView style={{ paddingRight: 16, backgroundColor: colors[colorScheme].frame }}>
            <ThemedText type="subtitle">Build your habits.</ThemedText>
          </ThemedView>
        ),

        tabBarActiveTintColor: colors[colorScheme].tint,
        tabBarInactiveTintColor: colors[colorScheme].tabIconDefault,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...commonTabBarStyle,
          ...Platform.select({
            ios: {
              // on iOS we want it absolute so the blur shows through
              position: "absolute",
            },
            default: {}, // on Android/web etc. just stick to commonTabBarStyle
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: createTabIcon("home") }}
      />
      <Tabs.Screen
        name="log-day"
        options={{ tabBarIcon: createTabIcon("edit"), tabBarLabel: 'Log Day' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ tabBarIcon: createTabIcon("settings") }}
      />
    </Tabs>
  );
}
