import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { ThemeColors, darkTheme, lightTheme } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen(){
    const theme = useColorScheme();
    const isDark = theme === "dark";
    const colors = isDark ? darkTheme : lightTheme;
    const styles = createStyles(colors);
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.top}>
                        <Text style={styles.welcomeText}>{"Hello!"}</Text>
                    </View>
                    <View style={styles.formsContainer}>
                        <View style={styles.topForms}>
                            <Text style={styles.header}>{"User Register"}</Text>
                            
                            <InputGroup 
                                first={true} 
                                label={"First Name"} 
                                text={firstName} 
                                setText={setFirstName} 
                                isPassword={false} 
                                placeholder={"Enter your first name"}
                                isLabeled={true}
                            />
                            <InputGroup 
                                first={false} 
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
                        </View>
                        <Button text={"Register"} action={()=>{router.push("/teamInitialization")}} />
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
        }
    })
    return styles;
}