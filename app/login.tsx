import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { ThemeContext } from "@/context/ThemeContext";
import { auth } from "@/firebase";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSignin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push("/(tabs)");
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-credential":
                        setError("Invalid email or password");
                        break;

                    case "auth/user-not-found":
                        setError("No account found with this email");
                        break;

                    case "auth/wrong-password":
                        setError("Incorrect password");
                        break;

                    case "auth/invalid-email":
                        setError("Please enter a valid email");
                        break;

                    case "auth/too-many-requests":
                        setError("Too many attempts. Please try again later");
                        break;

                    default:
                        setError("Something went wrong");
                }
            })
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.top}>
                        <Text style={styles.welcomeText}>{"Welcome Back!"}</Text>
                    </View>
                    <View style={styles.formsContainer}>
                        <View style={styles.topForms}>
                            <Text style={styles.header}>{"User Login"}</Text>
                            <InputGroup 
                                first={true} 
                                label={"Email"}
                                text={email} 
                                setText={setEmail} 
                                isPassword={false} 
                                placeholder={"Enter your email"}
                                isLabeled={true}
                            />
                            <InputGroup 
                                first={false} 
                                label={"Password"}
                                text={password} 
                                setText={setPassword} 
                                isPassword={true} 
                                placeholder={"Enter your password"}
                                isLabeled={true}
                            />
                            {error && (
                                <Text style={styles.errorMessage}>{error}</Text>
                            )}
                        </View>
                        <Button text={"Login"} action={handleSignin} />
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
            color: colors.secondary
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
            color: "red"
        }
    })
    return styles;
}