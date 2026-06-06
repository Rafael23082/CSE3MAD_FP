import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";
import { LineChart } from "./lineChart";
import PresetSelector from "./presetSelector";

export type movementValue = {
    label: string,
    value: string
}

const DESIGN_PRESETS = [
  { key: "activities.stretchSpeedAndGracefulness.clockwiseMovement" },
  { key: "activities.stretchSpeedAndGracefulness.verticalMovement" },
  { key: "activities.stretchSpeedAndGracefulness.horizontalMovement" },
];

export default function HumanPerformanceLabAttemptScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

    const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const movementValues = useRef<number[]>([]);
    const vibrationHistory = useRef<movementValue[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [vibrations, setVibrations] = useState(0);
    const [smoothness, setSmoothness] = useState(100);
    const [largestMovement, setLargestMovement] = useState(0);
    const [graphValues, setGraphValues] = useState<number[]>([]);
    const previousMagnitude = useRef(0);
    const [time, setTime] = useState(20);
    const [presetKey, setPresetKey] = useState("activities.stretchSpeedAndGracefulness.clockwiseMovement");

    interface humanPerformanceLabEntry {
        id: number;
        key: string;
        smoothnessScore: number,
        vibrations: number
    }

    const [designs, setDesigns] = useState<humanPerformanceLabEntry[]>([]);

    const _subscribe = useCallback(() => {
        Accelerometer.setUpdateInterval(100);
        setSubscription(
            Accelerometer.addListener(({x, y, z}) => {
                setData({x, y, z});
                const magnitude = Math.sqrt(x*x + y*y + z*z);
                const delta = Math.abs(magnitude - previousMagnitude.current);
                previousMagnitude.current = magnitude;
                movementValues.current.push(delta);
                if (delta > 0.25){
                    setVibrations((prev) => prev + 1);
                }
                setLargestMovement((prev) => Math.max(prev, delta));
                setSmoothness((prev) => {
                    const updated = prev - delta * 1.5;
                    return Math.max(0, Math.min(100, updated));
                });
            })
        );
    }, []);

    const _unsubscribe = useCallback(() => {
        setSubscription(prev => {
            prev?.remove();
            return null;
        });
    }, []);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown <= 0) {
            setCountdown(null);

            movementValues.current = [];

            setVibrations(0);
            setSmoothness(100);
            setLargestMovement(0);
            setGraphValues([]);

            previousMagnitude.current = 0;

            setTime(20);

            setRecordingState("recording");

            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => (prev ?? 1) - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, _unsubscribe]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (recordingState == "recording") {

            _subscribe();

            interval = setInterval(() => {
                setTime((prev) => {

                    if (isNaN(prev) || prev <= 1) {

                        const smoothed = smoothSignal(movementValues.current);
                        setGraphValues(smoothed);
                        setRecordingState("completed");
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000)

        } else {
            _unsubscribe();
        }

        return () => {
            _unsubscribe();
            clearInterval(interval);
        };

    }, [recordingState, _subscribe, _unsubscribe]);

    if (!activityContext) return null;

    const { activity } = activityContext;
    if (!activity) return null;

    const formatNumber = (s: number) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;

        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    function smoothSignal(values: number[]) {
        if (values.length < 3) return values;

        const smoothed: number[] = [];

        for (let i = 0; i < values.length; i++) {

            const prev = values[i - 1] ?? values[i];
            const current = values[i];
            const next = values[i + 1] ?? values[i];

            smoothed.push((prev + current + next) / 3);
        }

        return smoothed;
    }

    const logDesign = () => {
        if (recordingState != "completed"){
            Alert.alert("Challenge Unfinished",
                "Complete a challenge before logging this trial."
            )
            return;
        }

        setDesigns(prev => [...prev, {
            id: Date.now() + Math.random(),
            key: presetKey,
            smoothnessScore: smoothness, 
            vibrations: vibrations
        }]);

        if (activityContext) {
            activityContext.addExperimentLog({
                activityKey: "stretch-speed-and-gracefulness",
                data: { presetKey, smoothness, vibrations }
            });
        }

        setRecordingState("idle");
        setTime(20);
        setVibrations(0);
        setSmoothness(100);
        setLargestMovement(0);
        setGraphValues([]);
        movementValues.current = [];
}

    const handleFinish = () => {
        const results = designs.map(d => ({
            label: `${d.key}`,
            value: `Smoothness Score: ${d.smoothnessScore} | Vibrations Detected: ${d.vibrations}}`
        }));
        router.push({
            pathname: "/activityResults",
            params: { results: JSON.stringify(results), activityKey: "stretch-speed-and-gracefulness" }
        });
    }

    return(
        <SafeAreaView style={styles.outerContainer} edges={["top"]}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.head}>{activity.name}</Text>
                        <View style={styles.headerContainer}>
                            <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
                            <View style={styles.timerContainer}>
                                <Text style={[styles.sectionHeader, {
                                    lineHeight: 20
                                }]}>{formatNumber(time)}</Text>
                            </View>
                        </View>

                        <Text style={[styles.actionName, {marginTop: 24}]}>{t("activities.stretchSpeedAndGracefulness.recordMovement")}</Text>

                        <View style={styles.cardContainer}>
                            <Card metric={t("activities.stretchSpeedAndGracefulness.vibrationsDetected")} value={String(vibrations)} maximumWidth={true} />
                        </View>

                        <View style={styles.cardContainer}>
                            <Card metric={t("activities.stretchSpeedAndGracefulness.smoothnessScore")} value={`${Math.round(smoothness)}%`} maximumWidth={true} />
                        </View>

                        <Text style={styles.actionName}>
                            {t("activities.stretchSpeedAndGracefulness.movementMonitor")}
                        </Text>

                        <View style={styles.chartContainer}>

                            {graphValues.length != 0 ? (
                                <LineChart
                                    lineChartData={graphValues.map((value, index) => ({
                                        time: index,
                                        z: value
                                    }))}
                                />
                            ): (
                                <Text style={styles.placeholderText}>
                                    {t("activities.stretchSpeedAndGracefulness.movementMonitorPlaceholder")}
                                </Text>
                            )}

                        </View>

                    </View>

                    <PresetSelector 
                        designPresets={DESIGN_PRESETS}
                        onSelect={(preset) => {
                            setPresetKey(preset.key);
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        value={t(presetKey)}
                        onChangeText={setPresetKey}
                        placeholder={"Enter Preset Name"}
                        placeholderTextColor={theme.textMuted}
                        editable={false}
                    />

                    <Text style={styles.actionNameLarge}>{t("attempt.structuralIterations")}</Text>
                    {designs.length === 0 ? (
                        <Text style={styles.emptyState}>
                            {t("attempt.logTrialPlaceholder")}
                        </Text>
                    ): (
                        <View>
                            {designs.map((d) => (
                                <View key={d.id} style={styles.designCard}>
                                <View style={styles.designHeader}>
                                    <Text style={styles.designName}>{t(d.key)}</Text>
                                </View>
                                <Text style={styles.designConfig}>{t("activities.stretchSpeedAndGracefulness.smoothnessScore")}: {Math.floor(d.smoothnessScore * 100) / 100}</Text>
                                <Text style={styles.designResult}>
                                    {t("activities.stretchSpeedAndGracefulness.vibrationsDetected")}: {d.vibrations}
                                </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        {recordingState === "idle" && (
                            <Button text={t("buttons.startRecording")} action={() => {
                                    setCountdown(3);
                                }}
                            />
                        )}

                        {recordingState === "recording" && (
                            <Button text={t("buttons.recording")} action={() => {}} />
                        )}

                        {recordingState === "completed" && (
                            <Button 
                                text={t("buttons.logTrial")}
                                action={logDesign}
                            />
                        )}
                    </View>
                    <Pressable
                        onPress={handleFinish}
                        style={({ pressed }) => pressed && { opacity: 0.7 }}>
                        <Text style={styles.skipText}>{t("buttons.finishActivity")}</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>

            {countdown !== null && (
                <View style={styles.overlay}>
                    <Text style={styles.readyText}>{t("countdown.getReady")}</Text>

                    <Text style={styles.countdownText}>
                        {countdown}
                    </Text>
                </View>
            )}

        </SafeAreaView>
    )
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        outerContainer: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        container: {
            padding: 24,
            flexGrow: 1
        },

        head: {
            fontFamily: "PoppinsBold",
            fontSize: 22,
            color: colors.primary,
            marginBottom: 24
        },

        sectionHeader: {
            fontFamily: "PoppinsRegular",
            fontSize: 20,
            color: colors.secondary,
        },

        actionName: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: colors.secondary,
            marginVertical: 16
        },

        subContainer: {
            flexGrow: 1
        },

        timerContainer: {
            padding: 8,
            borderWidth: 1,
            borderColor: colors.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        headerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },

        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
        },

        readyText: {
            fontSize: 28,
            fontFamily: "PoppinsRegular",
            color: colors.secondary,
            marginBottom: 16,
        },

        countdownText: {
            fontSize: 96,
            fontFamily: "PoppinsBold",
            color: colors.secondary,
        },

        cardContainer: {
            marginBottom: 16
        },

        chartContainer: {
            borderRadius: 20,
            backgroundColor: colors.card,
            height: 220,
            display: "flex",
            alignItems: "center",
            flexDirection: "row"
        },

        placeholderText: {
            fontFamily: "PoppinsRegular",
            fontSize: 14,
            color: colors.secondary,
            textAlign: "center",
            width: "100%",
            paddingHorizontal: 24
        },

        buttonContainer: {
            marginTop: 32
        },

        input: {
            backgroundColor: colors.surfaceContainer,
            color: colors.secondary, 
            padding: 12, 
            borderRadius: 8, 
            borderWidth: 1, 
            borderColor: colors.borderColor, 
            fontSize: 16
        },
        actionNameLarge: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: colors.secondary,
            marginBottom: 16,
            marginTop: 32
        },
        sectionHeaderSmall: { fontFamily: "PoppinsRegular", fontSize: 18, color: colors.secondary, marginBottom: 12 },
        designCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
        designHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        designName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
        designAccel: { fontWeight: "bold", fontSize: 13 },
        designConfig: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
        designResult: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
        skipText: {
            textAlign: "center",
            marginTop: 16,
            color: colors.secondary,
            fontFamily: "PoppinsRegular",
            textDecorationLine: "underline",
            fontSize: 16
        },
        emptyState: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 10,
            padding: 16,
            fontFamily: "InterRegular",
            fontSize: 14,
            color: colors.textMuted,
            textAlign: "center",
        },
    });

    return styles;
}