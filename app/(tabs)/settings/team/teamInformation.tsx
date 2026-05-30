import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TeamInformationScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();
  const auth = useContext(AuthContext);
  const team = auth?.team;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {team ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>{t("teamSettings.teamName")}</Text>
            <Text style={styles.value}>{team.teamName}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{t("teamSettings.teamId")}</Text>
            <Text style={styles.value}>{team.teamId}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{t("teamSettings.inviteCode")}</Text>
            <Text style={styles.value}>{team.inviteCode}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{t("teamSettings.gradeLevel")}</Text>
            <Text style={styles.value}>Grade {team.gradeLevel}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{t("teamSettings.members")}</Text>
            <Text style={styles.value}>{team.members?.length || 0}/4</Text>
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.value}>{t("teamSettings.noTeam")}</Text>
        </View>
      )}
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
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    label: {
      fontFamily: "InterRegular",
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    value: {
      fontFamily: "PoppinsRegular",
      fontSize: 16,
      color: colors.secondary,
    },
  });
  return styles;
};