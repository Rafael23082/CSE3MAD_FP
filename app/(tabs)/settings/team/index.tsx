import { SettingsOption } from "@/components/settingsOption";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TeamSettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const router = useRouter();

  async function handleLeaveTeam() {
    try {

    } catch {
      Alert.alert("Error", "Failed to leave team");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <SettingsOption text={t("team.teamInformation")} action={() => {router.push("/(tabs)/settings/team/teamInformation")}} paddingTop={false} />
        <SettingsOption text={t("team.manageMembers")} action={() => {router.push("/(tabs)/settings/team/manageMembers")}} paddingTop={true} />
        <SettingsOption text={t("team.teamRoles")} action={() => {router.push("/(tabs)/settings/team/teamRoles")}} paddingTop={true} />

        <Pressable
          style={styles.option}
          onPress={handleLeaveTeam}
        >
          <Text style={styles.leaveText}>
            {t("team.leaveTeam")}
          </Text>
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
      marginBottom: 8,
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
    leaveText: {
      fontFamily: "PoppinsRegular",
      color: "#D9534F",
      fontSize: 16,
    },
  });
};