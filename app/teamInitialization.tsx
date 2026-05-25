import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamInitializationPage() {
    const theme = useContext(ThemeContext);
    if (!theme) return null;

    const styles = createStyles(theme);
    const router = useRouter();

    const [mode, setMode] = useState<"create" | "join">("create");

    const [teamName, setTeamName] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [members, setMembers] = useState<string[]>([""]);

    const [teamID, setTeamID] = useState("");
    const [inviteCode, setInviteCode] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.subContainer}>
                        <Text style={styles.title}> {mode === "create" ? "Create Your Team": "Join a Team"}
                        </Text>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[ styles.toggleButton, mode === "create" && styles.activeToggle ]}
                                onPress={() => setMode("create")}
                            >
                                <Text style={[styles.toggleText, mode === "create" && styles.activeToggleText]}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.toggleButton, mode === "join" && styles.activeToggle]} onPress={() => setMode("join")}>
                                <Text style={[ styles.toggleText, mode === "join" && styles.activeToggleText ]}>Join</Text>
                            </TouchableOpacity>
                        </View>

                        {mode === "create" ? (
                            <>
                                <View style={styles.growingContainer}>
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
                                            first={index === 0}
                                            label={"Member Name"}
                                            key={index}
                                            text={member}
                                            setText={(text) => {
                                                setMembers((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = text;
                                                    return updated;
                                                });
                                            }}
                                            placeholder={"Enter member name"}
                                            isPassword={false}
                                            isLabeled={index === 0}
                                        />
                                    ))}

                                    <Text style={styles.addMemberText} onPress={() => {
                                        setMembers((prev) => [
                                            ...prev,
                                            ""
                                        ]);
                                    }}>Add Member</Text>
                                </View>
                                <Button
                                    text={"Create Team"}
                                    action={() => router.push("/(tabs)")}
                                />
                            </>
                        ) : (
                            <>
                                <View style={styles.growingContainer}>
                                    <InputGroup
                                        first={true}
                                        label={"Team ID"}
                                        text={teamID}
                                        setText={setTeamID}
                                        isPassword={false}
                                        placeholder={"Enter team ID"}
                                        isLabeled={true}
                                    />

                                    <InputGroup
                                        first={false}
                                        label={"Invite Code"}
                                        text={inviteCode}
                                        setText={setInviteCode}
                                        isPassword={false}
                                        placeholder={"Enter invite code"}
                                        isLabeled={true}
                                    />
                                </View>
                                <Button
                                    text={"Join Team"}
                                    action={() => router.push("/(tabs)")}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
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
            color: colors.secondary,
            paddingBottom: 40
        },
        toggleContainer: {
            flexDirection: "row",
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 4,
        },
        toggleButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center"
        },
        activeToggle: {
            backgroundColor: colors.primary
        },
        toggleText: {
            color: colors.secondary,
            fontFamily: "PoppinsRegular"
        },
        activeToggleText: {
            color: "#fff"
        },
        addMemberText: {
            color: colors.primary,
            marginTop: 15,
            marginBottom: 24,
            fontFamily: "InterRegular"
        },
        growingContainer: {
            flexGrow: 1
        },
        subContainer: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 40
        }
    });
};