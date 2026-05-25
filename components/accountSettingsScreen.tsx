import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountSettingsScreen() {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  const styles = createStyles(theme);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeMessage}>Account</Text>
      </ScrollView>
    </SafeAreaView>
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
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 18,
      color: colors.primary,
      marginBottom: 16,
    },
  });
  return styles;
}