import { useTheme } from "@/hooks/useTheme";
import i18n from "@/i18n";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SettingsOption } from "./settingsOption";

export default function LanguageSettingsScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeMessage}>{t("tabs.language")}</Text>
      <SettingsOption text="English" action={()=>{i18n.changeLanguage("en")}} />
      <SettingsOption text="日本語" action={()=>{i18n.changeLanguage("ja")}} />
    </ScrollView>
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
      backgroundColor: colors.backgroundColor,
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