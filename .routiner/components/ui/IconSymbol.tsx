import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/styles";

type TabIconProps = {
  color: string;
};

export function createTabIcon(
  iconName: keyof typeof MaterialIcons.glyphMap
): React.FC<TabIconProps> {
  const IconComponent: React.FC<TabIconProps> = ({ color }) => (
    <View style={styles.tabBarContainer}>
      <MaterialIcons name={iconName} size={32} color={color} style={{ marginTop: 16 }} />
    </View>
  );

  IconComponent.displayName = `TabIcon(${iconName})`;
  return IconComponent;
}
