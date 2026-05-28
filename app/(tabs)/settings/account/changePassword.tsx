import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { auth } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ChangePasswordScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleChangePassword = async() => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      setError(t("errorMessages.userNotFound"));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("errorMessages.fillInAllFields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("errorMessages.passwordsDoNotMatch"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("errorMessages.weakPassword"));
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    Alert.alert("Success", "Password changed successfully!");
    router.push("/(tabs)/settings/account");
  } catch (error: any) {
    setError(t("errorMessages.failedPasswordUpdate"));
  }}

  return (
    <KeyboardAvoidingView style={styles.flexContainer} behavior="height" keyboardVerticalOffset={80} >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.subContainer}>
          <View style={{marginTop: -40}}>
            <InputGroup
              first={true}
              label={t("changePassword.currentPassword")}
              text={currentPassword}
              setText={setCurrentPassword}
              placeholder={t("changePassword.currentPasswordPlaceholder")}
              isPassword={true}
              isLabeled={true}
            />
          </View>
      
          <InputGroup
            first={false}
            label={t("changePassword.newPassword")}
            text={newPassword}
            setText={setNewPassword}
            placeholder={t("changePassword.newPasswordPlaceholder")}
            isPassword={true}
            isLabeled={true}
          />
      
          <InputGroup
            first={false}
            label={t("changePassword.confirmPassword")}
            text={confirmPassword}
            setText={setconfirmPassword}
            placeholder={t("changePassword.confirmPasswordPlaceholder")}
            isPassword={true}
            isLabeled={true}
          />
          {error && (
              <Text style={styles.errorMessage}>{error}</Text>
          )}
        </View>
        <Button 
          text={t("buttons.changePassword")}
          action={() => {handleChangePassword()}}
        />
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