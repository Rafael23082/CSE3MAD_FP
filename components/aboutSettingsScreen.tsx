import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SettingsOption } from "./settingsOption";

export default function AboutScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t("tabs.about")}</Text>

      <View style={styles.infoSection}>
        <View>
          <Text style={styles.label}>{t("about.appName")}</Text>
          <Text style={styles.value}>STEMMLAB</Text>
        </View>
        <View>
          <Text style={styles.label}>{t("about.version")}</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View>
          <Text style={styles.label}>{t("about.description")}</Text>
          <Text style={styles.value}>{t("about.descriptionValue")}</Text>
        </View>
      </View>

      <SettingsOption text={t("about.privacyPolicy")} action={()=>{}} />
      <SettingsOption text={t("about.termsOfService")} action={()=>{}} />
      <SettingsOption text={t("about.contactSupport")} action={()=>{}} />

    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      backgroundColor: colors.backgroundColor,
    },
    header: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 24,
    },
    infoSection: {
      marginBottom: 24,
      display: "flex",
      flexDirection: "column",
      rowGap: 16
    },
    label: {
      fontFamily: "InterRegular",
      fontSize: 14,
      opacity: 0.7,
      color: colors.secondary,
      marginBottom: 8,
    },
    value: {
      fontFamily: "InterRegular",
      fontSize: 16,
      color: colors.secondary,
    },
  });
};