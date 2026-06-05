import { InfoItem } from "@/components/infoItem";
import { SettingsOption } from "@/components/settingsOption";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AboutScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoSection}>
        <InfoItem 
          label={t("about.appName")}
          value="STEMMLAB"
          marginTop={false}
        />

        <InfoItem 
          label={t("about.version")}
          value="1.0.0"
          marginTop={true}
        />

        <InfoItem 
          label={t("about.description")}
          value={t("about.descriptionValue")}
          marginTop={true}
        />
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
    infoSection: {
      marginBottom: 24,
    },
  });
};