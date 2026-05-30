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
import QRCode from "react-native-qrcode-svg";

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
              label={t("teamInitialization.teamID")}
              value={team.teamId}
              marginTop={false}
            />

            <InfoItem 
              label={t("teamInitialization.teamName")}
              value={team.teamName}
              marginTop={true}
            />
          
            <InfoItem 
              label={t("teamInitialization.gradeLevel")}
              value={team.gradeLevel}
              marginTop={true}
            />

            <InfoItem 
              label={t("teamInitialization.inviteCode")}
              value={team.inviteCode}
              marginTop={true}
            />
          </View>
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>{t("teamSettings.shareQR")}</Text>
            <View style={styles.qrContainer}>
              <QRCode
                value={`${team.teamId}:${team.inviteCode}`}
                size={180}
                backgroundColor="white"
                color="black"
              />
            </View>
            <Text style={styles.qrInstruction}>{t("teamSettings.qrInstructions")}</Text>
          </View>
          <SettingsOption text={t("team.members")} action={() => {router.push("/(tabs)/settings/team/members")}} paddingTop={false} />

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
          <SettingsOption text={t("buttons.createTeam")} action={() => {router.push({
            pathname: "/teamInitialization",
            params: {
              mode: "create"
            }
          })}} paddingTop={false} />        
          <SettingsOption text={t("buttons.joinTeam")} action={() => {router.push({
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
    qrSection: {
      alignItems: "center",
      marginBottom: 24,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    qrTitle: {
      fontFamily: "PoppinsBold",
      fontSize: 16,
      color: colors.primary,
      marginBottom: 16,
    },
    qrContainer: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
    },
    qrInstruction: {
      fontFamily: "InterRegular",
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 12,
      textAlign: "center",
    },
    option: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
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