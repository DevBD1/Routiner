import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createTabIcon } from "@/components/ui/IconSymbol";

export interface HabitCardProps {
  habit: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function getRepeatSummary(habit: any) {
  if (!habit.repeatEnabled) return null;
  if (habit.repeatType === 'none') {
    return `One-time: ${habit.repeatDate ? new Date(habit.repeatDate).toLocaleDateString() : ''}`;
  }
  if (habit.repeatType === 'daily') {
    return `Every ${habit.repeatEvery} day(s)`;
  }
  if (habit.repeatType === 'weekly') {
    const days = (habit.repeatDaysOfWeek || []).map((idx: number) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]).join(', ');
    return `Every ${habit.repeatEvery} week(s) on ${days}`;
  }
  if (habit.repeatType === 'monthly') {
    const days = (habit.repeatDaysOfMonth || []).join(', ');
    return `Every ${habit.repeatEvery} month(s) on ${days}`;
  }
  return null;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete }) => {
  const colorScheme = useColorScheme() ?? "light";
  const iconColor = habit.done ? colors[colorScheme].correct : colors[colorScheme].tabIconDefault;
  const goalColor = habit.goalEnabled ? colors[colorScheme].tint : colors[colorScheme].tabIconDefault;
  const repeatColor = habit.repeatEnabled ? colors[colorScheme].tint : colors[colorScheme].tabIconDefault;

  return (
    <ThemedView style={[styles.card, { backgroundColor: colors[colorScheme].frame, shadowColor: colors[colorScheme].text }]}> 
      <Pressable onPress={onToggle} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Completion Icon */}
          <View style={{ marginRight: 12 }}>{createTabIcon(habit.done ? "checkmark-circle" : "ellipse-outline")({ color: iconColor, size: 24 })}</View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[{ fontWeight: "bold", fontSize: 16 }, habit.done && { color: colors[colorScheme].correct }]}>
              {habit.title}
            </ThemedText>
            {/* Goal Info */}
            {habit.goalEnabled && habit.goalValue && habit.goalUnit && habit.goalType && (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                {createTabIcon(
                  habit.goalType === "min"
                    ? "arrow-up-circle"
                    : habit.goalType === "max"
                    ? "arrow-down-circle"
                    : "ellipse-outline"
                )({ color: goalColor, size: 16, style: { marginRight: 4 } })}
                <ThemedText style={{ fontSize: 13, color: goalColor }}>
                  {habit.goalType.toUpperCase()} {habit.goalValue} {habit.goalUnit}
                </ThemedText>
              </View>
            )}
            {/* Repeat Info */}
            {getRepeatSummary(habit) && (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                {createTabIcon("repeat")({ color: repeatColor, size: 16, style: { marginRight: 4 } })}
                <ThemedText style={{ fontSize: 12, color: repeatColor }}>{getRepeatSummary(habit)}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </Pressable>
      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
        <Pressable onPress={onEdit} style={{ padding: 8 }} accessibilityLabel="Edit habit">
          {createTabIcon("create")({ color: colors[colorScheme].tint, size: 20 })}
        </Pressable>
        <Pressable onPress={onDelete} style={{ padding: 8 }} accessibilityLabel="Delete habit">
          {createTabIcon("trash")({ color: colors[colorScheme].error, size: 20 })}
        </Pressable>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
}); 