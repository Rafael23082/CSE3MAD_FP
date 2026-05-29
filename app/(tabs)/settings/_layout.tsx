import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SettingsLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="appearance"
        options={{
          title: t("tabs.appearance"),
        }}
      />

      <Stack.Screen
        name="language"
        options={{
          title: t("tabs.language"),
        }}
      />

      <Stack.Screen
        name="account/index"
        options={{
          title: t("tabs.account"),
        }}
      />

      <Stack.Screen
        name="team/index"
        options={{
          title: t("tabs.team"),
        }}
      />

      <Stack.Screen
        name="about/index"
        options={{
          title: t("tabs.about"),
        }}
      />

      <Stack.Screen
        name="account/changePassword"
        options={{
          title: t("tabs.changePassword"),
        }}
      />

      <Stack.Screen
        name="about/contactSupport"
        options={{
          title: t("tabs.contactSupport"),
        }}
      />

      <Stack.Screen
        name="about/termsOfService"
        options={{
          title: t("tabs.termsOfService"),
        }}
      />

      <Stack.Screen
        name="about/privacyPolicy"
        options={{
          title: t("tabs.privacyPolicy"),
        }}
      />

      <Stack.Screen
        name="team/members"
        options={{
          title: t("tabs.members"),
        }}
      />

      <Stack.Screen
        name="team/teamInformation"
        options={{
          title: t("tabs.teamInformation"),
        }}
      />

      <Stack.Screen
        name="team/teamRoles"
        options={{
          title: t("tabs.teamRoles"),
        }}
      />
    </Stack>
  );
}