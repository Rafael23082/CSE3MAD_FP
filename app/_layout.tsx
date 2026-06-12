import { ActivityProvider } from '@/context/ActivityContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from 'expo-constants';
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { initI18n } from "../i18n";

const isExpoGo = Constants.executionEnvironment === 'storeClient';

export default function RootLayout() {
  useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    InterRegular: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    InterLight: require("../assets/fonts/Inter_18pt-Light.ttf"),
    InterSemiBold: require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    async function init() {
      initI18n();

      if (!isExpoGo) {
        const { registerForPushNotifications } = await import('../utils/notifications');
        await registerForPushNotifications();

        const { defineBackgroundTask, registerBackgroundSync } = await import('../utils/backgroundSync');
        await defineBackgroundTask(async () => {
          // your sync logic here
        });
        await registerBackgroundSync();
      } else {
        console.log('[app] Running in Expo Go — skipping notifications & background sync.');
      }
    }

    init();
  }, []);

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <ThemeProvider>
          <ActivityProvider>
            <QueryClientProvider client={queryClient}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="activityAttempt" options={{ headerShown: false }} />
                <Stack.Screen name="activityResults" options={{ headerShown: false }} />
                <Stack.Screen name="attemptDetail" options={{ presentation: 'modal', title: 'Attempt Details' }} />
                <Stack.Screen name="sensor-debug" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </QueryClientProvider>
          </ActivityProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
