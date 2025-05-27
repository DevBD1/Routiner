import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

import { createTabIcon } from "@/components/ui/IconSymbol";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const tabBarColors = {
  active: "#7289da",
  inactive: "#8C8C8C",
  background: "#1e2124",
};

const commonHeaderStyle = {
  backgroundColor: tabBarColors.background,
  height: 100,
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 0,
  borderWidth: 0,
};

const commonTabBarStyle = {
  backgroundColor: tabBarColors.background,
  height: 65,
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 0,
  borderWidth: 0,
  paddingTop: 0,
  paddingBottom: 0,
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerTitleAlign: "center",
        headerTintColor: tabBarColors.inactive,
        headerTransparent: false,
        headerStyle: commonHeaderStyle,
        headerLeft: () => null,
        headerRight: () => null,

        tabBarActiveTintColor: colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: tabBarColors.inactive,
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
    </Tabs>
  );
}
