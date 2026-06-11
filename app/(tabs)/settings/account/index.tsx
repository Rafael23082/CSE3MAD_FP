import EditableInfoItem from "@/components/editableInfoItem";
import { InfoItem } from "@/components/infoItem";
import { SettingsOption } from "@/components/settingsOption";
import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { updateDisplayName } from "@/utils/database";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { use, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AccountSettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const authContext = use(AuthContext);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      return () => setError("");
    }, [])
  )

  if (!authContext) return;
  const { userProfile, setUserProfile, user } = authContext;

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/home");
    } catch(err) {
      console.log(err);
    }
  }

  const handleUpdateDisplayName = async (newValue: string) => {
    try {
      if (!newValue.trim()) {
        setError(t("errorMessages.emptyDisplayName"));
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        setError(t("errorMessages.defaultError"));
        return;
      }

      const formattedDisplayName =
        newValue.charAt(0).toUpperCase() +
        newValue.slice(1).toLowerCase();

      await updateDisplayName(
        user.uid,
        formattedDisplayName
      );

    setUserProfile(prev =>
      prev ? {...prev, displayName: formattedDisplayName}: null
    );

      setError("");
    } catch (error) {
      console.error("Update display name error:", error);
      setError(t("errorMessages.defaultError"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoSection}>
        <InfoItem 
          label={"UID"}
          value={user?.uid || ""}
          marginTop={false}
        />

        <EditableInfoItem
          label={t("forms.displayName")}
          value={userProfile?.displayName || ""}
          onSave={handleUpdateDisplayName}
          placeholder={t("forms.displayNamePlaceholder")}
        />

        {error && (
            <Text style={styles.errorMessage}>{error}</Text>
        )}

        <InfoItem 
          label={t("forms.email")}
          value={user?.email || ""}
          marginTop={true}
        />
      </View>

      <SettingsOption text={t("account.changePassword")} action={()=>{router.push("/(tabs)/settings/account/changePassword")}} paddingTop={false} />
      <Pressable
        style={styles.option}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>{t("account.logout")}</Text>
      </Pressable>
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
    infoSection: {
      marginBottom: 24,
    },
    errorMessage: {
        fontFamily: "InterRegular",
        marginTop: 8,
        color: "red",
        fontSize: 14
    }
  });
};
