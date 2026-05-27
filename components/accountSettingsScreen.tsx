import { auth } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SettingsOption } from "./settingsOption";

export default function AccountSettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/home");
    } catch {
      Alert.alert("Error", "Failed to logout");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeMessage}>
        {t("tabs.account")}
      </Text>

      <View style={styles.section}>
        <SettingsOption text={t("account.profileInformation")} action={()=>{}} /> 
        <SettingsOption text={t("account.changePassword")} action={()=>{}} /> 
        <SettingsOption text={t("account.teamInformation")} action={()=>{}} /> 

        <Pressable
          style={styles.option}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>{t("account.logout")}</Text>
        </Pressable>
      </View>
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
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 16,
    },
    section: {
      borderRadius: 12,
      overflow: "hidden",
    },
    option: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    text: {
      fontFamily: "PoppinsRegular",
      color: colors.secondary,
      fontSize: 16,
    },
    logoutText: {
      fontFamily: "PoppinsRegular",
      color: "#D9534F",
      fontSize: 16,
    },
  });
};