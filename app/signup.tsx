import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase";

export default function SignupScreen(){
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {t} = useTranslation();

    const handleSignup = async() => {
        try{
            if (!firstName || !email || !password){
                setError(t("errorMessages.fillInAllFields"));
                return;
            };

            const userCredential = createUserWithEmailAndPassword(auth, email, password);
            const user = (await userCredential).user;

            await setDoc(doc(db, "users", user.uid), {  
                uid: user.uid,
                firstName: firstName,
                email: email,
                createdAt: new Date()
            })

            console.log("User created successfully!");
            router.push("/teamInitialization");
        }
        catch(error: any){
            switch (error.code) {
                case "auth/weak-password":
                    setError("Password should be at least 6 characters");
                    break;

                case "auth/email-already-in-use":
                    setError("This email is already registered");
                    break;

                case "auth/invalid-email":
                    setError(t("errorMessages.invalidEmail"));
                    break;

                default:
                    setError(t("errorMessages.defaultError"));
            }
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.top}>
                        <Text style={styles.welcomeText}>{t("forms.hello")}</Text>
                    </View>
                    <View style={styles.formsContainer}>
                        <View style={styles.topForms}>
                            <Text style={styles.header}>{t("forms.userRegister")}</Text>
                            
                            <InputGroup 
                                first={true} 
                                label={t("forms.firstName")} 
                                text={firstName} 
                                setText={setFirstName} 
                                isPassword={false} 
                                placeholder={t("forms.firstNamePlaceholder")}
                                isLabeled={true}
                            />
                            <InputGroup 
                                first={false} 
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
                        <Button text={t("buttons.register")} action={handleSignup} />
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
            paddingVertical: 40
        },
        header: {
            fontSize: 20,
            fontFamily: "PoppinsBold",
            textAlign: "center",
            color: colors.secondary
        }, 
        topForms: {
            flexGrow: 1,
            paddingBottom: 24
        },
        errorMessage: {
            fontFamily: "InterRegular",
            marginTop: 16,
            color: "red",
            fontSize: 16
        }
    })
    return styles;
}