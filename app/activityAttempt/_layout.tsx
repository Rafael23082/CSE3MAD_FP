import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor: Colors[colorScheme ?? 'light'].background,
        },
      }}
    >
      <Tabs.Screen
        name="activityDetails"
        options={{
          title: "Details",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="information-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Attempt",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="play-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activityInstructions"
        options={{
          title: "Instructions",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="book-open-variant" color={color} />,
        }}
      />
    </Tabs>
  );
}