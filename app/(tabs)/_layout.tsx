import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Platform } from 'react-native';

import colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { View, Text } from '@/components/Themed';
import i18n from '@/i18n';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  const commonHeaderStyle = {
    backgroundColor: colors[colorScheme].tabBar,
    height: 80,
    borderTopWidth: 0,
    borderWidth: 0,
    ...(Platform.OS === 'web' ? { boxShadow: 'none' } : {}),
  };

  const commonTabBarStyle = {
    backgroundColor: colors[colorScheme].tabBar,
    height: Platform.OS === 'ios' ? 85 : 60,
    borderTopWidth: 0,
    borderWidth: 0,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    ...(Platform.OS === 'web' ? { boxShadow: 'none' } : {}),
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: commonHeaderStyle,
        headerShown: true, //useClientOnlyValue(false, true)
        headerTitle: "",
        headerTitleAlign: "center",
        headerTintColor: colors[colorScheme].tint,
        headerTransparent: false,
        headerLeft: () => (
          <View style={{ paddingLeft: 16, backgroundColor: colors[colorScheme].tabBar }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Routiner</Text>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingRight: 16, backgroundColor: colors[colorScheme].tabBar }}>
            <Text>{i18n.t('motto')}</Text>
          </View>
        ),
        
        tabBarStyle: commonTabBarStyle,
        tabBarActiveTintColor: colors[colorScheme].tabIconSelected,
        tabBarInactiveTintColor: colors[colorScheme].tabIconDefault,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habit Tracker',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'AI-Log',
          tabBarIcon: ({ color }) => <TabBarIcon name="edit" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
