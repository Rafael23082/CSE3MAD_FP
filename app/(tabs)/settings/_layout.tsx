import { ThemeContext } from "@/context/ThemeContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";

export default function SettingsLayout() {
  const theme = useContext(ThemeContext)
  if (!theme) return null;

  const { category } = useLocalSearchParams();

  const getTitle = () => {
    switch (category) {
      case "account":
        return "Account";
      case "team":
        return "Team";
      case "appearance":
        return "Appearance";
      case "about":
        return "About";
      default:
        return "Settings";
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme?.backgroundColor,
        },
        headerTintColor: theme?.secondary,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="[category]"
        options={{
          title: getTitle(),
        }}
      />
    </Stack>
  );
}