import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function AppearanceSettingsScreen() {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeMessage}>{t("tabs.appearance")}</Text>
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
    }
  });
  return styles;
}