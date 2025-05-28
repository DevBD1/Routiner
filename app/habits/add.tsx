import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "@/constants/styles";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHabits } from "@/context/HabitsContext";

const UNITS = [
  "min", "hour", "glass", "ml", "kg", "g", "lb", "oz", "km", "liter", "mile", "piece"
];
const GOAL_TYPES = [
  { label: "Minimum", value: "min" },
  { label: "Maximum", value: "max" },
  { label: "Precise", value: "precise" },
];
const REPEAT_TYPES = ["none", "daily", "weekly", "monthly"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const AddHabitScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [habitName, setHabitName] = useState("");
  const [goalEnabled, setGoalEnabled] = useState(false);
  const [goalValue, setGoalValue] = useState<string>("");
  const [goalUnit, setGoalUnit] = useState<string>(UNITS[0]);
  const [goalType, setGoalType] = useState<'min' | 'max' | 'precise'>("min");
  const [error, setError] = useState<string>("");
  const { addHabit, habits } = useHabits();

  // Repeat state
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatType, setRepeatType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [repeatEvery, setRepeatEvery] = useState<number>(1);
  const [repeatDaysOfWeek, setRepeatDaysOfWeek] = useState<number[]>([new Date().getDay()]);
  const [repeatDaysOfMonth, setRepeatDaysOfMonth] = useState<number[]>([new Date().getDate()]);
  const [repeatDate, setRepeatDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleToggleWeekday = (dayIdx: number) => {
    setRepeatDaysOfWeek((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx]
    );
  };
  const handleToggleMonthDay = (day: number) => {
    setRepeatDaysOfMonth((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddHabit = async () => {
    setError("");
    if (!habitName.trim()) {
      setError("Please enter a habit name.");
      return;
    }
    // Duplicate name check
    const exists = habits.some(h => h.title.trim().toLowerCase() === habitName.trim().toLowerCase());
    if (exists) {
      setError("A habit with this name already exists.");
      return;
    }
    if (goalEnabled) {
      const value = parseInt(goalValue, 10);
      if (!goalValue || isNaN(value) || value <= 0) {
        setError("Please enter a valid positive number for the goal value.");
        return;
      }
    }
    if (repeatEnabled) {
      if (repeatType !== 'none' && (!repeatEvery || repeatEvery < 1)) {
        setError("Please select a valid repeat interval.");
        return;
      }
      if (repeatType === 'weekly' && (!repeatDaysOfWeek.length)) {
        setError("Please select at least one weekday.");
        return;
      }
      if (repeatType === 'monthly' && (!repeatDaysOfMonth.length)) {
        setError("Please select at least one day of the month.");
        return;
      }
    }
    try {
      await addHabit(
        habitName.trim(),
        goalEnabled
          ? {
              goalEnabled,
              goalValue: goalValue ? parseInt(goalValue, 10) : null,
              goalUnit,
              goalType,
            }
          : {
              goalEnabled: false,
              goalValue: null,
              goalUnit: null,
              goalType: null,
            },
        repeatEnabled
          ? {
              repeatEnabled: true,
              repeatType,
              repeatEvery: repeatType === 'none' ? null : repeatEvery,
              repeatDaysOfWeek: repeatType === 'weekly' ? repeatDaysOfWeek : null,
              repeatDaysOfMonth: repeatType === 'monthly' ? repeatDaysOfMonth : null,
              repeatDate: repeatType === 'none' ? repeatDate.toISOString().slice(0, 10) : null,
            }
          : {
              repeatEnabled: false,
              repeatType: 'none',
              repeatEvery: null,
              repeatDaysOfWeek: null,
              repeatDaysOfMonth: null,
              repeatDate: repeatDate.toISOString().slice(0, 10),
            }
      );
      router.back();
    } catch (error) {
      setError('Error adding habit.');
      console.error('Error adding habit:', error);
    }
  };

  return (
    <LinearGradient
      colors={colorScheme === "dark" ? darkGradient : lightGradient}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={{ marginBottom: 24 }}>
              Add New Habit
            </ThemedText>

            <ThemedView
              style={{
                backgroundColor: colors[colorScheme].frame,
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <TextInput
                placeholder="Enter habit name"
                placeholderTextColor={colors[colorScheme].tabIconDefault}
                value={habitName}
                onChangeText={setHabitName}
                style={{
                  fontSize: 16,
                  color: colors[colorScheme].text,
                  padding: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors[colorScheme].tabIconDefault,
                }}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAddHabit}
              />
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                <ThemedText style={{ marginRight: 8 }}>Set goal</ThemedText>
                <Switch
                  value={goalEnabled}
                  onValueChange={setGoalEnabled}
                  thumbColor={goalEnabled ? colors[colorScheme].tint : colors[colorScheme].tabIconDefault}
                  trackColor={{ true: colors[colorScheme].tint, false: colors[colorScheme].tabIconDefault }}
                />
              </View>
              {goalEnabled && (
                <View style={{ marginTop: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="Value"
                      placeholderTextColor={colors[colorScheme].tabIconDefault}
                      value={goalValue}
                      onChangeText={setGoalValue}
                      keyboardType="numeric"
                      style={{
                        fontSize: 16,
                        color: colors[colorScheme].text,
                        borderBottomWidth: 1,
                        borderBottomColor: colors[colorScheme].tabIconDefault,
                        width: 60,
                        marginRight: 8,
                      }}
                    />
                    {/* Unit Picker */}
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Picker
                        selectedValue={goalUnit}
                        onValueChange={setGoalUnit}
                        style={{ color: colors[colorScheme].text, backgroundColor: 'transparent' }}
                        dropdownIconColor={colors[colorScheme].text}
                      >
                        {UNITS.map((unit) => (
                          <Picker.Item key={unit} label={unit} value={unit} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  {/* Goal Type Picker */}
                  <View style={{ flexDirection: "row", marginTop: 12 }}>
                    {GOAL_TYPES.map((type) => (
                      <Pressable
                        key={type.value}
                        onPress={() => setGoalType(type.value as 'min' | 'max' | 'precise')}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: goalType === type.value ? colors[colorScheme].tint : 'transparent',
                          marginRight: 8,
                          borderWidth: 1,
                          borderColor: colors[colorScheme].tabIconDefault,
                        }}
                      >
                        <ThemedText style={{ color: goalType === type.value ? colors[colorScheme].background : colors[colorScheme].text }}>
                          {type.label}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              {/* Repeat Section */}
              <View style={{ marginTop: 24 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ThemedText style={{ marginRight: 8 }}>Repeat</ThemedText>
                  <Switch
                    value={repeatEnabled}
                    onValueChange={val => {
                      setRepeatEnabled(val);
                      setRepeatType(val ? 'daily' : 'none');
                    }}
                    thumbColor={repeatEnabled ? colors[colorScheme].tint : colors[colorScheme].tabIconDefault}
                    trackColor={{ true: colors[colorScheme].tint, false: colors[colorScheme].tabIconDefault }}
                  />
                </View>
                {repeatEnabled ? (
                  <View style={{ marginTop: 16 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                      {REPEAT_TYPES.filter(t => t !== 'none').map(type => (
                        <Pressable
                          key={type}
                          onPress={() => setRepeatType(type as 'daily' | 'weekly' | 'monthly')}
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            backgroundColor: repeatType === type ? colors[colorScheme].tint : 'transparent',
                            marginRight: 8,
                            borderWidth: 1,
                            borderColor: colors[colorScheme].tabIconDefault,
                          }}
                        >
                          <ThemedText style={{ color: repeatType === type ? colors[colorScheme].background : colors[colorScheme].text }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ThemedText style={{ marginRight: 8 }}>Every</ThemedText>
                      <Picker
                        selectedValue={repeatEvery}
                        onValueChange={v => setRepeatEvery(Number(v))}
                        style={{ width: 80, color: colors[colorScheme].text }}
                        dropdownIconColor={colors[colorScheme].text}
                      >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                          <Picker.Item key={num} label={String(num)} value={num} />
                        ))}
                      </Picker>
                      <ThemedText style={{ marginLeft: 8 }}>
                        {repeatType === 'daily' ? 'day(s)' : repeatType === 'weekly' ? 'week(s)' : 'month(s)'}
                      </ThemedText>
                    </View>
                    {repeatType === 'weekly' && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
                        {WEEKDAYS.map((day, idx) => (
                          <Pressable
                            key={day}
                            onPress={() => handleToggleWeekday(idx)}
                            style={{
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              borderRadius: 8,
                              backgroundColor: repeatDaysOfWeek.includes(idx) ? colors[colorScheme].tint : 'transparent',
                              marginRight: 6,
                              marginBottom: 6,
                              borderWidth: 1,
                              borderColor: colors[colorScheme].tabIconDefault,
                            }}
                          >
                            <ThemedText style={{ color: repeatDaysOfWeek.includes(idx) ? colors[colorScheme].background : colors[colorScheme].text }}>
                              {day}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </View>
                    )}
                    {repeatType === 'monthly' && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
                        {MONTH_DAYS.map(day => (
                          <Pressable
                            key={day}
                            onPress={() => handleToggleMonthDay(day)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: repeatDaysOfMonth.includes(day) ? colors[colorScheme].tint : 'transparent',
                              margin: 2,
                              borderWidth: 1,
                              borderColor: colors[colorScheme].tabIconDefault,
                            }}
                          >
                            <ThemedText style={{ color: repeatDaysOfMonth.includes(day) ? colors[colorScheme].background : colors[colorScheme].text }}>
                              {day}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{ marginTop: 16 }}>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: colors[colorScheme].frame,
                        borderWidth: 1,
                        borderColor: colors[colorScheme].tabIconDefault,
                        alignItems: 'center',
                      }}
                    >
                      <ThemedText>
                        {`Date: ${repeatDate.toLocaleDateString()}`}
                      </ThemedText>
                    </Pressable>
                    {showDatePicker && (
                      <DateTimePicker
                        value={repeatDate}
                        mode="date"
                        display="default"
                        onChange={(_, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) setRepeatDate(selectedDate);
                        }}
                      />
                    )}
                  </View>
                )}
              </View>
              {!!error && (
                <ThemedText style={{ color: colors[colorScheme].error, marginTop: 12 }}>{error}</ThemedText>
              )}
            </ThemedView>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Pressable
                onPress={() => router.back()}
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginRight: 8,
                    backgroundColor: colors[colorScheme].frame,
                  },
                ]}
              >
                <ThemedText style={{ textAlign: "center" }}>Cancel</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleAddHabit}
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginLeft: 8,
                    backgroundColor: colors[colorScheme].tint,
                    opacity: habitName.trim() ? 1 : 0.5,
                  },
                ]}
              >
                <ThemedText
                  style={{ textAlign: "center", color: colors[colorScheme].background }}
                >
                  Add Habit
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddHabitScreen; 