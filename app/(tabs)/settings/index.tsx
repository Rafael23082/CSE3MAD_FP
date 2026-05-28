import { SettingsSection } from "@/components/settingsSection";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeMessage}>{t("tabs.settings")}</Text>
        <SettingsSection label={t("tabs.account")} icon="person-outline" action={() => router.push("/settings/account")} />
        <SettingsSection label={t("tabs.team")} icon="people-outline" action={() => {router.push("/settings/team")}} />
        <SettingsSection label={t("tabs.appearance")} icon="color-palette-outline" action={() => {router.push("/settings/appearance")}} />
        <SettingsSection label={t("tabs.language")} icon="language-outline" action={() => {router.push("/settings/language")}} />
        <SettingsSection label={t("tabs.about")} icon="information-circle-outline" action={() => {router.push("/settings/about")}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    container: {
      padding: 24,
      flexGrow: 1,
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 16,
    },
  });
  return styles;
}