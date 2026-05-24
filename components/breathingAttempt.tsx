import { ActivityContext } from "@/context/ActivityContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { useContext, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";
import { LineChart } from "./lineChart";

export type bpmValue = {
    label: string,
    value: string
}

export default function BreathingAttemptScreen(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);

    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

    let currentPhase;
    if (activity.phases){
        currentPhase = activity.phases[currentPhaseIndex]
    }

    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const zValues = useRef<number[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);

    const [breaths, setBreaths] = useState(0);
    const [bpm, setBpm] = useState(0);

    const bpmValues = useRef<bpmValue[]>([]);
    const [time, setTime] = useState(30)
    const [centered, setCentered] = useState<number[]>([]);

    const router = useRouter();

    const _subscribe = () => {
        /** Phone facing downwards: 
         *  Moving upwards = positive value
         *  Moving downwards = negative value
        */
        Accelerometer.setUpdateInterval(100);
        setSubscription(Accelerometer.addListener(({x, y, z}) => {
            setData({x, y, z});
            zValues.current.push(z);
        }));
    }

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    }

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
    }, [countdown]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (recordingState == "recording") {
            _subscribe();
            interval = setInterval(() => {
                setTime((prev) => {
                    if (isNaN(time) || prev <= 1) {
                        const smoothed = whittakerEilersSmooth(zValues.current, 8, 6); /** Parameters obained from experimentation */
                        const centeredSignal = centerSignal(smoothed);
                        setCentered(centeredSignal);
                        const breathCount = detectBreaths(centeredSignal);
                        setBreaths(breathCount);
                        const calculatedBpm = (breathCount / 30) * 60;
                        setBpm(Math.round(calculatedBpm));
                        bpmValues.current.push({
                            label: `Activity ${currentPhaseIndex + 1} BPM`,
                            value: String(Math.round(calculatedBpm))
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
    }, [recordingState]);

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
        const threshold = amplitude * 0.15; /** Threshold obained from experimentation */

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

    return(
        <SafeAreaView style={styles.outerContainer} edges={["top"]}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.head}>{activity.name}</Text>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Text style={styles.sectionHeader}>Attempt</Text>
                            <View style={styles.timerContainer}>
                                <Text style={[styles.sectionHeader, {
                                    lineHeight: 20
                                }]}>{formatNumber(time)}</Text>
                            </View>
                        </View>
                        <Text style={styles.phaseText}>Phase {currentPhaseIndex + 1} — {currentPhase}</Text>
                        <Text style={[styles.actionName, {marginTop: 24}]}>Record Breathing</Text>
                        <View style={styles.cardContainer}>
                            <Card metric="Breaths Recorded" value={String(breaths)} maximumWidth={true} />
                        </View>
                        <Card metric="BPM" value={String(bpm)} maximumWidth={true} />
                        <Text style={styles.actionName}>Breathing Monitor</Text>
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
                                    Start recording to visualize chest movement
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        {recordingState === "idle" && (
                            <Button text="Start Recording" action={() => {
                                setCountdown(3);
                            }} />
                        )}
                        {recordingState === "recording" && (
                            <Button text="Recording..." action={() => {}} />
                        )}
                        {recordingState === "completed" && (
                            <Button text={currentPhaseIndex == 2 ? "Finish Activity": "Continue"} action={() => {
                                if (activity.phases && currentPhaseIndex < activity.phases.length - 1) {
                                    setCurrentPhaseIndex(currentPhaseIndex+1);
                                    setRecordingState("idle");
                                    setTime(30);
                                    setBreaths(0);
                                    setBpm(0);
                                    setCentered([]);
                                    zValues.current = [];
                                } else {
                                    router.push({
                                        pathname: "/activityResults",
                                        params: {
                                            results: JSON.stringify(bpmValues.current)
                                        }
                                    });
                                }
                            }} />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {countdown !== null && (
                <View style={styles.overlay}>
                    <Text style={styles.readyText}>Get Ready</Text>
                    <Text style={styles.countdownText}>{countdown}</Text>
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