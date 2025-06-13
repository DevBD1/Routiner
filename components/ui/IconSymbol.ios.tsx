import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";
import React from "react";

export function IconSymbol({
  name,
  size = 32,
  color,
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

// Export a createTabIcon function for iOS
export function createTabIcon(iconName: SymbolViewProps["name"]): React.FC<{ color: string }> {
  const IconComponent: React.FC<{ color: string }> = ({ color }) => (
    <IconSymbol name={iconName} color={color} />
  );
  IconComponent.displayName = `TabIcon(${iconName})`;
  return IconComponent;
}
