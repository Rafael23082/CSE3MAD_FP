import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SettingsLayout() {
  const { theme } = useTheme();

  const { category } = useLocalSearchParams();
  const {t} = useTranslation();

  const getTitle = () => {
    switch (category) {
      case "account":
        return t("tabs.account");
      case "appearance":
        return t("tabs.appearance");
      case "about":
        return t("tabs.about");
      case "language":
        return t("tabs.language");
      default:
        return t("tabs.settings");
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