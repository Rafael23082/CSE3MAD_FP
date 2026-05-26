import { ActivityProvider } from '@/context/ActivityContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import "../i18n";

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
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <ThemeProvider>
          <ActivityProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="activityDetails" options={{ headerShown: false }} />
              <Stack.Screen name="teamInitialization" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="activityAttempt" options={{ headerShown: false }} />
              <Stack.Screen name="activityResults" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ActivityProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
