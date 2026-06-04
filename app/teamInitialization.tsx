import Button from "@/components/button";
import InputGroup from "@/components/inputGroup";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "@firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamInitializationPage() {
    const {theme, isDark} = useTheme();

    const styles = createStyles(theme);
    const router = useRouter();

    const auth = use(AuthContext);
    if (!auth) return null;
    const { user } = auth;

    const [mode, setMode] = useState<"create" | "join">("create");
    const queryClient = useQueryClient();

    const { mode: initialMode } = useLocalSearchParams();
    useEffect(() => {
    if (initialMode === "join" || initialMode === "create") {
        setMode(initialMode);
    }
    }, [initialMode]);

    const [teamName, setTeamName] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");

    const [teamID, setTeamID] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [error, setError] = useState("");

    const [isScanning, setIsScanning] = useState(false);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    const {t} = useTranslation();

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
        if (!user) return;

        const teamRef = doc(collection(db, "teams"));
        const inviteCodeGenerated = generateInviteCode();
        await setDoc(teamRef, {
            teamId: teamRef.id,
            teamName,
            gradeLevel,
            members: [
                {
                    uid: user.uid,
                    role: "leader"
                }
            ],
            memberUids: [user.uid],
            inviteCode: inviteCodeGenerated
        });

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            teamId: teamRef.id,
        }, {
            merge: true
        })
        queryClient.invalidateQueries({ queryKey: ["team", user.uid] });
        router.push("/(tabs)");
    }

    const doJoinTeam = async(teamId: string, code: string) => {
        try {
            setError("");

            const teamRef = doc(db, "teams", teamId);
            const teamDocument = await getDoc(teamRef);

            if (!teamDocument.exists()) {
                setError("Team does not exist");
                return;
            }
            const teamData = teamDocument.data();

            // Enforce 2-4 member limit
            if (teamData.members?.length >= 4) {
                setError("Team is full (max 4)");
                return;
            }

            if (teamData.inviteCode != code){
                setError("Invalid invite code");
                return;
            }

            if (!user) return;
            await updateDoc(teamRef, {
                members: arrayUnion({
                    uid: user.uid,
                    role: "member"
                }),
                memberUids: arrayUnion(user.uid)
            })
            await updateDoc(doc(db, "users", user.uid), {
                teamId: teamRef.id
            })

            queryClient.invalidateQueries({ queryKey: ["team", user.uid] });
            router.push("/(tabs)");
        } catch(err) {
            setError("Something went wrong");
        }
    }
    
    const handleJoinTeam = async() => {
        try {
            setError("");

            if (!teamID || !inviteCode){
                setError("Please fill in the fields");
                return;
            }

            await doJoinTeam(teamID, inviteCode);
        } catch(err) {
            setError("Something went wrong");
        }
    }

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (!isScanning) return;
        // QR code format: "teamId:inviteCode"
        const parts = data.split(':');
        if (parts.length === 2) {
            setTeamID(parts[0]);
            setInviteCode(parts[1]);
            setIsScanning(false);
            // Auto-trigger join
            doJoinTeam(parts[0], parts[1]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.subContainer}>
                        <Text style={styles.title}> {mode === "create" ? t("teamInitialization.createTitle"): t("teamInitialization.joinTitle")}
                        </Text>
                        <View style={styles.toggleContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.toggleButton,
                                    mode === "create" && styles.activeToggle,
                                    pressed && { opacity: 0.85 },
                                ]}
                                onPress={() => setMode("create")}
                            >
                                <Text style={[styles.toggleText, mode === "create" && styles.activeToggleText]}>{t("buttons.createTeam")}</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.toggleButton,
                                    mode === "join" && styles.activeToggle,
                                    pressed && { opacity: 0.85 },
                                ]}
                                onPress={() => setMode("join")}
                            >
                                <Text style={[ styles.toggleText, mode === "join" && styles.activeToggleText ]}>{t("buttons.joinTeam")}</Text>
                            </Pressable>
                        </View>

                        {mode === "create" ? (
                            <>
                                <View style={styles.growingContainer}>
                                    <InputGroup
                                        first={true}
                                        label={t("teamInitialization.teamName")}
                                        text={teamName}
                                        setText={setTeamName}
                                        isPassword={false}
                                        placeholder={t("teamInitialization.teamNamePlaceholder")}
                                        isLabeled={true}
                                    />

                                    <View style={styles.pickerContainer}>
                                        <Text style={styles.pickerLabel}>{t("teamInitialization.gradeLevel")}</Text>
                                        <View style={{
                                            borderWidth: isDark ? 0: 1,
                                            borderRadius: 5,
                                            overflow: "hidden"
                                        }}>
                                            <Picker
                                                selectedValue={gradeLevel}
                                                onValueChange={(itemValue) => setGradeLevel(itemValue)}
                                                dropdownIconColor={theme.secondary}
                                                style={styles.picker}
                                            >
                                                <Picker.Item
                                                    label={t("teamInitialization.gradeLevelPlaceholder")}
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
                                        </View>
                                        {error && (
                                            <Text style={styles.errorMessage}>{error}</Text>
                                        )}
                                    </View>
                                </View>
                                <Button
                                    text={t("buttons.createTeam")}
                                    action={handleCreateTeam}
                                />
                            </>
                        ) : (
                            <>
                                <View style={styles.growingContainer}>
                                    <InputGroup
                                        first={true}
                                        label={t("teamInitialization.teamID")}
                                        text={teamID}
                                        setText={setTeamID}
                                        isPassword={false}
                                        placeholder={t("teamInitialization.teamIDPlaceholder")}
                                        isLabeled={true}
                                    />

                                    <InputGroup
                                        first={false}
                                        label={t("teamInitialization.inviteCode")}
                                        text={inviteCode}
                                        setText={setInviteCode}
                                        isPassword={false}
                                        placeholder={t("teamInitialization.inviteCodePlaceholder")}
                                        isLabeled={true}
                                    />
                                    {error && (
                                        <Text style={styles.errorMessage}>{error}</Text>
                                    )}

                                    {/* QR Scanner Section */}
                                    {isScanning ? (
                                        <View style={styles.scannerContainer}>
                                            {cameraPermission?.granted ? (
                                                <CameraView
                                                    style={styles.camera}
                                                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                                                    onBarcodeScanned={handleBarcodeScanned}
                                                />
                                            ) : (
                                                <Pressable style={styles.permissionBtn} onPress={requestCameraPermission}>
                                                    <Text style={styles.permissionBtnText}>{t("teamInitialization.grantCamera")}</Text>
                                                </Pressable>
                                            )}
                                            <Pressable style={styles.cancelBtn} onPress={() => setIsScanning(false)}>
                                                <Text style={styles.cancelBtnText}>{t("teamInitialization.cancelScan")}</Text>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <Pressable style={styles.scanBtn} onPress={() => {
                                            if (!cameraPermission?.granted) {
                                                requestCameraPermission();
                                            }
                                            setIsScanning(true);
                                        }}>
                                            <Text style={styles.scanBtnText}>{t("teamInitialization.scanQR")}</Text>
                                        </Pressable>
                                    )}
                                </View>
                                <Button
                                    text={t("buttons.joinTeam")}
                                    action={handleJoinTeam}
                                />
                            </>
                        )}
                        <Pressable
                            onPress={() => router.push("/(tabs)")}
                            style={({ pressed }) => pressed && { opacity: 0.7 }}>
                            <Text style={styles.skipText}>{t("teamInitialization.skip")}</Text>
                        </Pressable>
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
            flexGrow: 1,
            paddingBottom: 24
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
            textDecorationLine: "underline",
            fontSize: 16
        },
        pickerContainer: {
            marginTop: 30,
        },
        pickerLabel: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            paddingBottom: 16
        },
        picker: {
            color: colors.secondary,
            backgroundColor: colors.backgroundColor,
            fontSize: 16,
        },
        errorMessage: {
            fontFamily: "InterRegular",
            marginTop: 16,
            color: "red",
            fontSize: 14
        },
        scannerContainer: {
            marginTop: 16,
            borderRadius: 10,
            overflow: "hidden",
        },
        camera: {
            height: 200,
            borderRadius: 10,
        },
        permissionBtn: {
            height: 200,
            backgroundColor: colors.surfaceContainer,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
        },
        permissionBtnText: {
            fontFamily: "PoppinsRegular",
            color: colors.primary,
            fontSize: 14,
        },
        cancelBtn: {
            padding: 12,
            alignItems: "center",
            backgroundColor: colors.card,
            marginTop: 8,
            borderRadius: 8,
        },
        cancelBtnText: {
            fontFamily: "PoppinsRegular",
            color: colors.danger,
            fontSize: 14,
        },
        scanBtn: {
            padding: 14,
            backgroundColor: colors.surfaceContainer,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 12,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        scanBtnText: {
            fontFamily: "PoppinsRegular",
            color: colors.primary,
            fontSize: 14,
            fontWeight: "bold",
        },
    });
};