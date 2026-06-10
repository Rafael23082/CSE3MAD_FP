import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { auth } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen(){
    const { theme } = useTheme();

    const styles = createStyles(theme);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {t} = useTranslation();
    
    const handleSignin = () => {
        setLoading(true);
        if (!email || !password){
            setError(t("errorMessages.fillInAllFields"));
            return;
        };

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                router.push("/(tabs)");
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-credential":
                        setError(t("errorMessages.invalidCredential"));
                        break;

                    case "auth/user-not-found":
                        setError(t("errorMessages.userNotFound"));
                        break;

                    case "auth/wrong-password":
                        setError(t("errorMessages.wrongPassword"));
                        break;

                    case "auth/invalid-email":
                        setError(t("errorMessages.invalidEmail"));
                        break;

                    case "auth/too-many-requests":
                        setError(t("errorMessages.tooManyRequests"));
                        break;

                    default:
                        setError(t("errorMessages.defaultError"));
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.top}>
                        <Text style={styles.welcomeText}>{t("forms.welcome")}</Text>
                    </View>
                    <View style={styles.formsContainer}>
                        <View style={styles.topForms}>
                            <Text style={styles.header}>{t("forms.userLogin")}</Text>
                            <InputGroup 
                                first={true} 
                                label={t("forms.email")}
                                text={email} 
                                setText={setEmail} 
                                isPassword={false} 
                                placeholder={t("forms.emailPlaceholder")}
                                isLabeled={true}
                            />
                            <InputGroup 
                                first={false} 
                                label={t("forms.password")}
                                text={password} 
                                setText={setPassword} 
                                isPassword={true} 
                                placeholder={t("forms.passwordPlaceholder")}
                                isLabeled={true}
                            />
                            {error && (
                                <Text style={styles.errorMessage}>{error}</Text>
                            )}
                        </View>
                        <Button text={t("buttons.login")} action={handleSignin} loading={loading} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flex: 1,
            backgroundColor: colors.backgroundColor
        },
        keyboardView: {
            flex: 1
        },
        scrollView: {
            flexGrow: 1
        },
        welcomeText: {
            fontSize: 25,
            fontFamily: "PoppinsBold",
            textAlign: "center",
            color: colors.buttonText
        },
        top: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            paddingVertical: 40
        },
        formsContainer: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40
        },
        header: {
            fontSize: 20,
            fontFamily: "PoppinsBold",
            textAlign: "center",
            paddingTop: 50,
            color: colors.secondary
        }, 
        topForms: {
            flex: 1,
            paddingBottom: 24
        },
        errorMessage: {
            fontFamily: "InterRegular",
            marginTop: 16,
            color: "red",
            fontSize: 14
        }
    })
    return styles;
}