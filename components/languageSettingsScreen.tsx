import { ThemeContext } from "@/context/ThemeContext";
import i18n from "@/i18n";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

export default function LanguageSettingsScreen() {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeMessage}>{t("tabs.language")}</Text>
      <Pressable
        style={styles.option}
        onPress={() => i18n.changeLanguage("en")}
      >
        <Text style={styles.text}>English</Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => i18n.changeLanguage("ja")}
      >
        <Text style={styles.text}>日本語</Text>
      </Pressable>
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
    option: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card
    },
    text: {
      fontFamily: "PoppinsRegular",
      color: colors.secondary,
      fontSize: 16
    },
  });
  return styles;
}