import { TeamMember } from '@/constants/types';
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { fetchTeam } from '@/utils/database';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MembersScreen() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();
  const {user} = useAuth();

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        if (!user?.uid) return;
        const data = await fetchTeam(user.uid);
        if (data) {
          setTeam(data);
        }
      } catch (error) {
        console.error("Failed to load team:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [user?.uid]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.list}>
        {team.map((member, index) => (
          <Text key={index} style={styles.memberText}>
            {member.firstName}, {member.lastName}
          </Text>
        ))}
      </View>
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
    list: {
      gap: 12,
    },
    memberText: {
      fontFamily: "InterRegular",
      fontSize: 16,
      color: colors.secondary,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
  });
  return styles;
}