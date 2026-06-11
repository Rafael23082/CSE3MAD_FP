import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { TeamMember } from "@/constants/types";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { saveUserProfile, updateTeamMembers } from "@/utils/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase";

const MIN_MEMBERS = 2;
const MAX_MEMBERS = 4;

export default function SignupScreen(){
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [teamName, setTeamName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        { firstName: "", lastName: "" }
    ]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {t} = useTranslation();

    const handleSignup = async() => {
        try{
            setLoading(true);
            setError("");
            
            if (!teamName || !email || !password){
                setError(t("errorMessages.fillInAllFields"));
                setLoading(false);
                return;
            };

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const formattedTeamName = teamName.charAt(0).toUpperCase() + teamName.slice(1).toLowerCase();

            await saveUserProfile(user.uid, {
                displayName: formattedTeamName,
                email: email
            });

            setUserId(user.uid);
            setStep(2);
        }
        catch(error: any){
            console.log("Signup error:", error);
            console.log("Signup error code:", error?.code);

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
        }finally{
            setLoading(false);
        }
    }

    const handleCompleteRegistration = async() => {
        try{
            setLoading(true);
            setError("");
            
            const filledMembers = teamMembers.filter(
                m => m.firstName.trim() !== "" && m.lastName.trim() !== ""
            );

            if (filledMembers.length < MIN_MEMBERS){
                setError(t("signup.minMembers"));
                setLoading(false);
                return;
            }

            if (filledMembers.length > MAX_MEMBERS){
                setError(t("signup.maxMembers"));
                setLoading(false);
                return;
            }

            const formattedMembers = filledMembers.map(m => ({
                firstName: m.firstName.charAt(0).toUpperCase() + m.firstName.slice(1).toLowerCase(),
                lastName: m.lastName.charAt(0).toUpperCase() + m.lastName.slice(1).toLowerCase()
            }));

            await updateTeamMembers(userId, formattedMembers);

            console.log("Team members saved locally to SQLite successfully!");
            router.push("/(tabs)");
        }
        catch (err) {
            console.error("Local SQLite update error:", err);
            setError(t("errorMessages.defaultError"));
        }
        finally{
            setLoading(false);
        }
    }

    const addMember = () => {
        if (teamMembers.length < MAX_MEMBERS){
            setTeamMembers([...teamMembers, { firstName: "", lastName: "" }]);
        }
    }

    const removeMember = (index: number) => {
        if (teamMembers.length > MIN_MEMBERS){
            setTeamMembers(teamMembers.filter((_, i) => i !== index));
        }
    }

    const updateMember = (index: number, field: "firstName" | "lastName", value: string) => {
        const updated = [...teamMembers];
        updated[index] = { ...updated[index], [field]: value };
        setTeamMembers(updated);
    }

    if (step === 2){
        return(
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                    <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                        <View style={styles.top}>
                            <Text style={styles.welcomeText}>{t("forms.hello")}</Text>
                        </View>
                        <View style={styles.formsContainer}>
                            <View style={styles.topForms}>
                                <Text style={styles.header}>{t("signup.teamMembersTitle")}</Text>
                                <Text style={styles.subtitle}>{t("signup.teamMembersSubtitle")}</Text>

                                {teamMembers.map((member, index) => (
                                    <View key={index} style={styles.memberRow}>
                                        <View style={styles.memberInputs}>
                                            <InputGroup 
                                                first={index === 0}
                                                label={t("signup.firstName")}
                                                text={member.firstName}
                                                setText={(value) => updateMember(index, "firstName", value)}
                                                isPassword={false}
                                                placeholder={t("signup.firstNamePlaceholder")}
                                                isLabeled={true}
                                            />
                                            <InputGroup 
                                                first={false}
                                                label={t("signup.lastName")}
                                                text={member.lastName}
                                                setText={(value) => updateMember(index, "lastName", value)}
                                                isPassword={false}
                                                placeholder={t("signup.lastNamePlaceholder")}
                                                isLabeled={true}
                                            />
                                        </View>
                                        {teamMembers.length > MIN_MEMBERS && (
                                            <Pressable 
                                                style={styles.removeBtn}
                                                onPress={() => removeMember(index)}
                                            >
                                                <MaterialCommunityIcons name="close" size={20} color={theme.danger} />
                                            </Pressable>
                                        )}
                                    </View>
                                ))}

                                {teamMembers.length < MAX_MEMBERS && (
                                    <Pressable style={[styles.addMemberBtn, { borderColor: theme.primary }]} onPress={addMember}>
                                        <MaterialCommunityIcons name="plus" size={20} color={theme.primary} />
                                        <Text style={[styles.addMemberText, { color: theme.primary }]}>{t("signup.addMember")}</Text>
                                    </Pressable>
                                )}

                                {error && (
                                    <Text style={styles.errorMessage}>{error}</Text>
                                )}
                            </View>
                            <Button text={t("signup.completeRegistration")} action={handleCompleteRegistration} loading={loading} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
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
                                label={t("signup.teamName")} 
                                text={teamName} 
                                setText={setTeamName} 
                                isPassword={false} 
                                placeholder={t("signup.teamNamePlaceholder")}
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
                        <Button text={t("buttons.register")} action={handleSignup} loading={loading} />
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
        subtitle: {
            fontSize: 13,
            fontFamily: "InterRegular",
            textAlign: "center",
            color: colors.textMuted,
            marginTop: 8,
            marginBottom: 16
        },
        topForms: {
            flexGrow: 1,
            paddingBottom: 24
        },
        memberRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8
        },
        memberInputs: {
            flex: 1
        },
        removeBtn: {
            marginTop: 44,
            padding: 8
        },
        addMemberBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 12,
            borderWidth: 1,
            borderStyle: "dashed",
            borderRadius: 8,
            marginTop: 24
        },
        addMemberText: {
            fontFamily: "InterRegular",
            fontSize: 14
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