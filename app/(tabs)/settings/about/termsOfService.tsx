import { InfoItem } from "@/components/infoItem";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function TermsOfServiceScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InfoItem
          label={t("termsOfService.useOfApp")}
          value={t("termsOfService.useOfAppContents")}
          marginTop={false}
      />

      <InfoItem
          label={t("termsOfService.userResponsibilities")}
          value={t("termsOfService.userResponsibilitiesContents")}
          marginTop
      />

      <InfoItem
          label={t("termsOfService.intellectualProperty")}
          value={t("termsOfService.intellectualPropertyContents")}
          marginTop
      />

      <InfoItem
          label={t("termsOfService.noWarranty")}
          value={t("termsOfService.noWarrantyContents")}
          marginTop
      />

      <InfoItem
          label={t("termsOfService.limitationOfLiability")}
          value={t("termsOfService.limitationOfLiabilityContents")}
          marginTop
      />

      <InfoItem
          label={t("termsOfService.changesToTerms")}
          value={t("termsOfService.changesToTermsContents")}
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