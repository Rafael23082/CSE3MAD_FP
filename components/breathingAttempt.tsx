import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "./button";
import Card from "./card";
import { LineChart } from "./lineChart";
import PresetSelector from "./presetSelector";

export type bpmValue = {
    label: string,
    value: string
}

const DESIGN_PRESETS = [
  { key: "activities.breathingPaceTrainer.rest" },
  { key: "activities.breathingPaceTrainer.jogging" },
  { key: "activities.breathingPaceTrainer.starJumps" },
];

export default function BreathingAttemptScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

    const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const zValues = useRef<number[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [breaths, setBreaths] = useState(0);
    const [bpm, setBpm] = useState(0);
    const bpmValues = useRef<bpmValue[]>([]);
    const [time, setTime] = useState(30)
    const [centered, setCentered] = useState<number[]>([]);
    const [presetKey, setPresetKey] = useState("activities.breathingPaceTrainer.rest");

    interface breathingEntry {
        id: number;
        key: string;
        breathsRecorded: number;
        bpm: number;
    }

    const [designs, setDesigns] = useState<breathingEntry[]>([]);

    const _subscribe = useCallback(() => {
        Accelerometer.setUpdateInterval(100);
        setSubscription(Accelerometer.addListener(({x, y, z}) => {
            setData({x, y, z});
            zValues.current.push(z);
        }));
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
            zValues.current = [];
            setBreaths(0);
            setTime(30);
            setBpm(0);

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
                    if (isNaN(time) || prev <= 1) {
                        const smoothed = whittakerEilersSmooth(zValues.current, 8, 6); {/* Parameters obained from experimentation */}
                        const centeredSignal = centerSignal(smoothed);
                        setCentered(centeredSignal);
                        const breathCount = detectBreaths(centeredSignal);
                        setBreaths(breathCount);
                        const calculatedBpm = (breathCount / 30) * 60;
                        setBpm(Math.round(calculatedBpm));
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

    function whittakerEilersSmooth(values: number[], lambda = 20, iterations = 10) {
        if (values.length < 3) return values;

        let smoothed = [...values];

        for (let k = 0; k < iterations; k++) {
            const next = [...smoothed];

            for (let i = 1; i < values.length - 1; i++) {
                next[i] = (values[i] + lambda * (smoothed[i - 1] + smoothed[i + 1])) / (1 + 2 * lambda);
            }
            smoothed = next;
        }
        return smoothed;
    }

    function centerSignal(values: number[]) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return values.map(v => v - mean);
    }

    function detectBreaths(values: number[]) {
        if (values.length < 3) return 0;

        const max = Math.max(...values);
        const min = Math.min(...values);

        const amplitude = max - min;
        const threshold = amplitude * 0.15; {/* Threshold obained from experimentation */}

        const MIN_DISTANCE = 7;

        let breaths = 0;
        let lastPeak = -MIN_DISTANCE;

        for (let i = 1; i < values.length - 1; i++) {
            const prev = values[i - 1];
            const current = values[i];
            const next = values[i + 1];

            const isPeak = current > prev && current > next && current > threshold;
            const farEnough = i - lastPeak > MIN_DISTANCE;

            if (isPeak && farEnough) {
                breaths++;
                lastPeak = i;
            }
        }
        return breaths;
    }

    const logDesign = () => {
        setDesigns(prev => {
            const index = prev.findIndex(d => d.key === presetKey);

            const newDesign = {
                id: Date.now() + Math.random(),
                key: presetKey,
                breathsRecorded: breaths ?? undefined,
                bpm: bpm ?? undefined,
            };

            if (index === -1) {
                return [...prev, newDesign];
            }

            return prev.map((design, i) =>
                i === index ? newDesign : design
            );
        });

        setCountdown(null);
        setRecordingState("idle");
        zValues.current = [];
        setBreaths(0);
        setTime(30);
        setBpm(0);
        bpmValues.current = [];
        setCentered([]);
    };

    const handleFinish = () => {
        if (designs.length < DESIGN_PRESETS.length){
            Alert.alert(t("errorMessages.unfinishedChallenge"), t("errorMessages.unfinishedChallengeDescription"));
            return;
        }

        const results = designs.map(d => ({
            label: `${d.key}`,
            value: `Breaths Recorded: ${d.breathsRecorded} | BPM: ${d.bpm}}`
        }));

        const rest = designs.find(
            d => d.key === "activities.breathingPaceTrainer.rest"
        );

        const jogging = designs.find(
            d => d.key === "activities.breathingPaceTrainer.jogging"
        );

        const starJumps = designs.find(
            d => d.key === "activities.breathingPaceTrainer.starJumps"
        );

        if (activityContext) {
            activityContext.addExperimentLog({
                activityKey: "breathing-pace-trainer",
                data: { 
                    restBreaths: rest?.breathsRecorded,
                    restBpm: rest?.bpm,
                    joggingBreaths: jogging?.breathsRecorded,
                    joggingBpm: jogging?.bpm,
                    starJumpsBreaths: starJumps?.breathsRecorded,
                    starJumpsBpm: starJumps?.bpm
                 }
            });
        }

        router.push({
            pathname: "/activityResults",
            params: { results: JSON.stringify(results), activityKey: "breathing-pace-trainer" }
        });
    };

    return(
        <KeyboardAvoidingView style={styles.outerContainer} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.head}>{activity.name}</Text>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
                        <View style={styles.timerContainer}>
                            <Text style={[styles.sectionHeader, {
                                lineHeight: 20
                            }]}>{formatNumber(time)}</Text>
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

                    <Text style={[styles.actionName, {marginTop: 24}]}>{t("activities.breathingPaceTrainer.recordBreathing")}</Text>
                    <View style={styles.cardContainer}>
                        <Card metric={t("activities.breathingPaceTrainer.breathsRecorded")} value={String(breaths)} maximumWidth={true} />
                    </View>
                    <Card metric={t("activities.breathingPaceTrainer.bpm")} value={String(bpm)} maximumWidth={true} />

                    <View style={{marginTop: 16}}>
                        {recordingState === "idle" && (
                            <Button text={t("buttons.startRecording")} action={() => {
                                setCountdown(3);
                            }} />
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

                    <Text style={styles.actionName}>{t("activities.breathingPaceTrainer.breathingMonitor")}</Text>
                    <View style={styles.chartContainer}>
                        {centered.length != 0 ? (
                            <LineChart
                                lineChartData={centered.map((value, index) => ({
                                    time: index,
                                    z: value
                                }))}
                            /> 
                        ): (
                            <Text style={styles.placeholderText}>
                                {t("activities.breathingPaceTrainer.breathingMonitorPlaceholder")}
                            </Text>
                        )}
                    </View>
                </View>

                <Text style={styles.actionNameLarge}>{t("attempt.structuralIterations")}</Text>
                
                {DESIGN_PRESETS.map((design, index) => {
                    const loggedDesign = designs.find((loggedDesign) => loggedDesign.key == design.key);
                    return(
                        <View key={index} style={styles.designCard}>
                            <View style={styles.designHeader}>
                                <Text style={styles.designName}>{t(design.key)}</Text>
                            </View>
                            {loggedDesign ? (
                                <View>
                                    <Text style={styles.designConfig}>BPM: {loggedDesign.bpm}</Text>
                                    <Text style={styles.designConfig}>{t("activities.breathingPaceTrainer.breathsRecorded")}: {loggedDesign.breathsRecorded}</Text> 
                                </View>
                            ): (
                                <Text style={styles.designConfig}>No Recorded Attempt Yet.</Text>
                            )}  
                        </View>
                    );
                })}

                <View style={styles.buttonContainer}>
                    <Button 
                        text={t("buttons.finishActivity")}
                        action={handleFinish}
                    />
                </View>
            </ScrollView>
            {countdown !== null && (
                <View style={styles.overlay}>
                    <Text style={styles.readyText}>{t("countdown.getReady")}</Text>
                    <Text style={styles.countdownText}>{countdown}</Text>
                </View>
            )}
        </KeyboardAvoidingView>
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
            marginVertical: 16,
            marginTop: 24
        },
        actionNameLarge: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: colors.secondary,
            marginBottom: 16,
            marginTop: 24
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