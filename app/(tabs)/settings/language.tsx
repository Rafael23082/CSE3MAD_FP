import { SettingsOption } from "@/components/settingsOption";
import { useTheme } from "@/hooks/useTheme";
import { changeLanguage } from "@/i18n";
import { ThemeColors } from '@/theme/colors';
import { ScrollView, StyleSheet } from 'react-native';

export default function LanguageSettingsScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingsOption text="English" action={()=>{changeLanguage("en")}} paddingTop={false} />
      <SettingsOption text="日本語" action={()=>{changeLanguage("ja")}} paddingTop={true} />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      backgroundColor: colors.backgroundColor,
    },
  });
  return styles;
}