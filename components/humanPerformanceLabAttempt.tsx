import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";
import { LineChart } from "./lineChart";

export type movementValue = {
    label: string,
    value: string
}

export default function HumanPerformanceLabAttemptScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

    const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
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

                        vibrationHistory.current.push({
                            label: t("activities.stretchSpeedAndGracefulness.movementVibrations", {index: currentPhaseIndex + 1}),
                            value: String(vibrations)
                        });

                        vibrationHistory.current.push({
                            label: t("activities.stretchSpeedAndGracefulness.movementSmoothness", {index: currentPhaseIndex + 1}),
                            value: `${Math.round(smoothness)}%`
                        });

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

    let currentPhase;
    if (activity.phases){
        currentPhase = activity.phases[currentPhaseIndex]
    }

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

                        <Text style={styles.phaseText}>{t("activities.phase")} {currentPhaseIndex + 1} — {currentPhase}</Text>

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
                            <Button text={currentPhaseIndex == 2 ? t("buttons.finishActivity"): t("buttons.continue")} action={() => {
                                if (activity.phases && currentPhaseIndex < activity.phases.length - 1) {
                                    setCurrentPhaseIndex(currentPhaseIndex + 1);
                                    setRecordingState("idle");
                                    setTime(20);
                                    setVibrations(0);
                                    setSmoothness(100);
                                    setLargestMovement(0);
                                    setGraphValues([]);
                                    movementValues.current = [];
                                } else {

                                    router.push({
                                        pathname: "/activityResults",
                                        params: {
                                            results: JSON.stringify(vibrationHistory.current),
                                            activityKey: "stretch-speed-and-gracefulness"
                                        }
                                    });

                                }
                                }}
                            />
                        )}
                    </View>
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

        phaseText: {
            fontFamily: "PoppinsRegular",
            fontSize: 16,
            color: colors.secondary,
            marginTop: 12,
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
        }
    });

    return styles;
}