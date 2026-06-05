import { InfoItem } from "@/components/infoItem";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InfoItem
          label={t("privacyPolicy.dataCollection")}
          value={t("privacyPolicy.dataCollectionContents")}
          marginTop={false}
      />

      <InfoItem
          label={t("privacyPolicy.useOfData")}
          value={t("privacyPolicy.useOfDataContents")}
          marginTop
      />

      <InfoItem
          label={t("privacyPolicy.dataStorage")}
          value={t("privacyPolicy.dataStorageContents")}
          marginTop
      />

      <InfoItem
          label={t("privacyPolicy.thirdPartyServices")}
          value={t("privacyPolicy.thirdPartyServicesContents")}
          marginTop
      />

      <InfoItem
          label={t("privacyPolicy.security")}
          value={t("privacyPolicy.securityContents")}
          marginTop
      />

      <InfoItem
          label={t("privacyPolicy.policyChanges")}
          value={t("privacyPolicy.policyChangesContents")}
          marginTop
      />
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

  });
};