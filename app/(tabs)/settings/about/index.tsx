import { SettingsOption } from "@/components/settingsOption";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <SettingsOption text={t("about.privacyPolicy")} action={()=>{router.push("/(tabs)/settings/about/privacyPolicy")}} paddingTop={false} />
      <SettingsOption text={t("about.termsOfService")} action={()=>{router.push("/(tabs)/settings/about/termsOfService")}} paddingTop={true} />
      <SettingsOption text={t("about.contactSupport")} action={()=>{router.push("/(tabs)/settings/about/contactSupport")}} paddingTop={true} />

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