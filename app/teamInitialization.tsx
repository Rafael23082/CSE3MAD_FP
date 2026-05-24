import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function teamInitializationPage(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);
    const router = useRouter();
    const [teamName, setTeamName] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [members, setMembers] = useState<string[]>([""]);

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
                    <View style={{flexGrow: 1, paddingBottom: 24}}>
                        <Text style={styles.title}>{"Create Your Team"}</Text>

                        <InputGroup 
                            first={true} 
                            label={"Team Name"} 
                            text={teamName} 
                            setText={setTeamName} 
                            isPassword={false} 
                            placeholder={"Enter team name"}
                            isLabeled={true}
                        />
                        <InputGroup 
                            first={false} 
                            label={"Grade Level"}
                            text={gradeLevel} 
                            setText={setGradeLevel} 
                            isPassword={false} 
                            placeholder={"Enter grade level"}
                            isLabeled={true}
                        />
                        {members.map((member, index) => (
                            <InputGroup
                                first={index == 0}
                                label={"Member Name"}
                                key={index}
                                text={member}
                                setText={(text) => {
                                    setMembers(prev => {
                                        const updated = [...prev];
                                        updated[index] = text;
                                        return updated;
                                    });
                                }}
                                placeholder={"Enter member name"}
                                isPassword={false}
                                isLabeled={index == 0}
                            />
                        ))}             
                        <Text 
                            style={styles.addMemberText}
                            onPress={() => {    
                                setMembers(prev => [...prev, ""]);
                            }}
                        >{"Add Member"}</Text>
                    </View>
                    <Button text={"Create Team"} action={()=>router.push("/(tabs)")} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
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
        title: {
            fontSize: 25,
            fontFamily: "PoppinsBold",
            textAlign: "center",
            marginTop: 120,
            color: colors.secondary
        },
        addMemberText: {
            color: colors.primary,
            marginTop: 15
        }
    })
    return styles;
}