import { InfoItem } from "@/components/infoItem";
import { SettingsOption } from "@/components/settingsOption";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TeamSettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const {user, userProfile} = authContext;

  const queryClient = useQueryClient();

  async function handleLeaveTeam() {
    try {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        teamId: null,
      });
      queryClient.invalidateQueries({ queryKey: ["team", user?.uid] });
      
    } catch(err) {
      console.log(err);
    }
  }

  const getTeam = async () => {
    if (!user) return null;

    const teamId = userProfile?.teamId;

    if (!teamId) return null;

    const teamRef = doc(db, "teams", teamId);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) return null;

    return teamSnap.data();
  };

  const {data: team, isLoading} = useQuery({
    queryKey: ["team", user?.uid, userProfile?.teamId],
    queryFn: getTeam,
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isLoading && team ? (
        <View>
          <View style={styles.infoSection}>
            <InfoItem 
              label={"Team ID"}
              value={team.teamId}
              marginTop={false}
            />

            <InfoItem 
              label={"Team Name"}
              value={team.teamName}
              marginTop={true}
            />
          
            <InfoItem 
              label={"Grade Level"}
              value={team.gradeLevel}
              marginTop={true}
            />

            <InfoItem 
              label={"Invite Code"}
              value={team.inviteCode}
              marginTop={true}
            />
          </View>
          <SettingsOption text={t("team.members")} action={() => {router.push("/(tabs)/settings/team/members")}} paddingTop={!isLoading && team ? false: true} />

          <Pressable
            style={styles.option}
            onPress={handleLeaveTeam}
          >
            <Text style={styles.leaveText}>
              {t("team.leaveTeam")}
            </Text>
          </Pressable>
        </View>
      ): (
        <View>
          <SettingsOption text={"Create Team"} action={() => {router.push({
            pathname: "/teamInitialization",
            params: {
              mode: "create"
            }
          })}} paddingTop={false} />        
          <SettingsOption text={"Join Team"} action={() => {router.push({
            pathname: "/teamInitialization",
            params: {
              mode: "join"
            }
          })}} paddingTop={true} />     
        </View>   
      )}
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
    infoSection: {
      marginBottom: 24,
    },  
  });
};