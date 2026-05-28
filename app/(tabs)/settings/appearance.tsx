import { SettingsOption } from "@/components/settingsOption";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function AppearanceSettingsScreen() {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingsOption text={t("appearance.lightMode")} action={()=>{changeTheme("light")}} paddingTop={false} />
      <SettingsOption text={t("appearance.darkMode")} action={()=>{changeTheme("dark")}} paddingTop={true} />
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