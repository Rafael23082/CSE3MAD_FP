import { MemberAvatar } from "@/components/memberAvatar";
import { TeamMember } from '@/constants/types';
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { fetchTeam } from '@/utils/database';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MembersScreen({ userId }: { userId: string }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();
    const {user} = useAuth();

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const data = await fetchTeam(userId);
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
    <KeyboardAvoidingView style={styles.flexContainer} behavior="height" keyboardVerticalOffset={80} >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.subContainer}>
            {team.map((member, index) => (
                <MemberAvatar 
                    key={index} 
                    firstName={member.firstName} 
                    lastName={member.lastName} 
                />
            ))}
        </View> 
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      backgroundColor: colors.backgroundColor,
    },
    subContainer: {
      paddingBottom: 24,
      flexGrow: 1
    },
    errorMessage: {
        fontFamily: "InterRegular",
        marginTop: 16,
        color: "red",
        fontSize: 14
    },
    flexContainer: {
      flex: 1
    }
  });
  return styles;
}