import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function ResultsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.backgroundColor },
        headerTintColor: theme.secondary,
      }}
    >
      <Stack.Screen name="parachuteResults" options={{ title: 'Parachute Results' }} />
      <Stack.Screen name="soundResults" options={{ title: 'Sound Results' }} />
      <Stack.Screen name="fanResults" options={{ title: 'Fan Results' }} />
      <Stack.Screen name="earthquakeResults" options={{ title: 'Earthquake Results' }} />
      <Stack.Screen name="breathingResults" options={{ title: 'Breathing Results' }} />
      <Stack.Screen name="reactionResults" options={{ title: 'Reaction Results' }} />
      <Stack.Screen name="humanPerformanceResults" options={{ title: 'Movement Results' }} />
    </Stack>
  );
}
