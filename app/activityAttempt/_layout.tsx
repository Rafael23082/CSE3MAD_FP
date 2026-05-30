import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function TabLayout() {
  const { isDark, theme } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.backgroundColor },
        headerTintColor: theme.secondary,
        headerTitle: '',
        headerLeft: () => (
          <Pressable 
            onPress={() => router.back()}
            style={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 4 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.secondary} />
          </Pressable>
        ),
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].tint,
        tabBarInactiveTintColor: Colors[isDark ? 'dark' : 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[isDark ? 'dark' : 'light'].background,
          borderTopColor: Colors[isDark ? 'dark' : 'light'].background,
          height: 64,
          paddingBottom: 6,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="activityDetails"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="information-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activityInstructions"
        options={{
          title: "Instructions",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="book-open-variant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Experiments",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="flask" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="notebook-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
