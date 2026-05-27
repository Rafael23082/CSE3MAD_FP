import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { isDark } = useTheme();
  const {t} = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].tint,
        tabBarInactiveTintColor: Colors[isDark ? 'dark' : 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[isDark ? 'dark' : 'light'].background,
          borderTopColor: Colors[isDark ? 'dark' : 'light'].background,
        },
      }}
    >
      <Tabs.Screen
        name="activityDetails"
        options={{
          title: t("tabs.details"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="information-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.attempt"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="play-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activityInstructions"
        options={{
          title: t("tabs.instructions"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="book-open-variant" color={color} />,
        }}
      />
    </Tabs>
  );
}