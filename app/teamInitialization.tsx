import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { db } from "@/firebase";
import { ThemeColors } from "@/theme/colors";
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamInitializationPage() {
    const theme = useContext(ThemeContext);
    if (!theme) return null;

    const styles = createStyles(theme);
    const router = useRouter();

    const auth = useContext(AuthContext);
    if (!auth) return null;
    const { user } = auth;

    const [mode, setMode] = useState<"create" | "join">("create");

    const [teamName, setTeamName] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");

    const [teamID, setTeamID] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [error, setError] = useState("");

    function generateInviteCode(length = 6) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }

        return result;
    }

    const handleCreateTeam = async() => {
        setError("");
        if (!teamName || !gradeLevel){
            setError("Please fill in the fields");
            return;
        }else{
            setError("");
        }

        const teamRef = doc(collection(db, "teams"));
        const inviteCode = generateInviteCode();
        await setDoc(teamRef, {
            teamID: teamRef.id,
            teamName,
            gradeLevel,
            members: [
                {
                    uid: user?.uid,
                    role: "leader"
                }
            ],
            inviteCode
        })
        router.push("/(tabs)");
    }
    
    const handleJoinTeam = async() => {
        try{
            setError("");

            if (!teamID || !inviteCode){
                setError("Please fill in the fields");
                return;
            }

            const teamRef = doc(db, "teams", teamID);

            const teamDocument = await getDoc(teamRef);

            if (!teamDocument.exists()) {
                setError("Team does not exist");
                return;
            }
            const teamData = teamDocument.data();

            if (teamData.inviteCode != inviteCode){
                setError("Invalid invite code");
                return;
            }

            await updateDoc(teamRef, {
                members: arrayUnion({
                    uid: user?.uid,
                    role: "member"
                })
            })
            router.push("/(tabs)");
        }catch(err){
            setError("Something went wrong");
        }
    }

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

                                    <View style={styles.pickerContainer}>
                                        <Text style={styles.pickerLabel}>Grade Level</Text>
                                        <Picker
                                            selectedValue={gradeLevel}
                                            onValueChange={(itemValue) => setGradeLevel(itemValue)}
                                            dropdownIconColor={theme.secondary}
                                            style={styles.picker}
                                        >
                                            <Picker.Item
                                                label="Select Grade Level"
                                                value={""}
                                                enabled={false}
                                            />
                                            {[...Array(12)].map((_, index) => {
                                                const grade = index + 1;
                                                return (
                                                    <Picker.Item 
                                                        key={grade}
                                                        label={`Grade ${grade}`}
                                                        value={grade}
                                                    />
                                                )
                                            })}
                                        </Picker>
                                        {error && (
                                            <Text style={styles.errorMessage}>{error}</Text>
                                        )}
                                    </View>
                                </View>
                                <Button
                                    text={"Create Team"}
                                    action={handleCreateTeam}
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
                                    {error && (
                                        <Text style={styles.errorMessage}>{error}</Text>
                                    )}
                                </View>
                                <Button
                                    text={"Join Team"}
                                    action={handleJoinTeam}
                                />
                            </>
                        )}
                        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
                            <Text style={styles.skipText}>Skip for now</Text>
                        </TouchableOpacity>
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
        growingContainer: {
            flexGrow: 1
        },
        subContainer: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 40
        },
        skipText: {
            textAlign: "center",
            marginTop: 16,
            color: colors.secondary,
            fontFamily: "PoppinsRegular",
            textDecorationLine: "underline"
        },
        pickerContainer: {
            marginTop: 40
        },
        pickerLabel: {
            fontFamily: "InterRegular",
            color: colors.secondary
        },
        picker: {
            color: "#000000",
            backgroundColor: "#FFFFFF",
            borderRadius: 5,
            borderColor: "#000000",
            padding: 12,
            fontSize: 16,
            marginTop: 16
        },
        errorMessage: {
            fontFamily: "InterRegular",
            marginTop: 16,
            color: "red"
        }
    });
};