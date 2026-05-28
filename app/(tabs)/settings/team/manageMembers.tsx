import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function ManageMembersScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text>Manage Members</Text>
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
    body: {
        fontFamily: "InterRegular",
        color: colors.secondary,
        fontSize: 16
    }
  });
  return styles;
}