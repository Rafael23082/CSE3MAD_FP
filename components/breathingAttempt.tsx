import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CountdownTimer from "./countdownTimer";

type breathingAttemptScreenProps = {
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function BreathingAttemptScreen({setFormValues}: breathingAttemptScreenProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const [breaths, setBreaths] = useState(0);
    const [bpm, setBpm] = useState(0);
    const zValues = useRef<number[]>([]);
    const [breathingRecordingState, setBreathingRecordingState] = useState<"idle" | "recording">("idle");
    const breathingSubscription = useRef<Subscription | null>(null);
    const [breathingRunning, setBreathingRunning] = useState(false);

    useEffect(() => {
        return () => {
            if (breathingSubscription.current) {
                breathingSubscription.current.remove();
                breathingSubscription.current = null;
            }
        };
    }, []);

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

    const startBreathingTest = () => {
        zValues.current = [];

        setBreaths(0);
        setBpm(0);

        Accelerometer.setUpdateInterval(100);

        breathingSubscription.current =
            Accelerometer.addListener(({ z }) => {
                zValues.current.push(z);
            });

        setBreathingRecordingState("recording");
        setBreathingRunning(true);
    };

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

    const stopBreathingTest = () => {
        breathingSubscription.current?.remove();
        breathingSubscription.current = null;

        const smoothed = whittakerEilersSmooth(zValues.current, 8, 6);

        const centeredSignal = centerSignal(smoothed);

        const breathCount = detectBreaths(centeredSignal);

        const durationSeconds = zValues.current.length * 0.1;

        const calculatedBpm = Math.round(
            (breathCount / durationSeconds) * 60
        );

        setBreaths(breathCount);
        setBpm(calculatedBpm);

        setFormValues(prev => ({
            ...prev,
            measuredBPM: String(calculatedBpm)
        }));

        setBreathingRecordingState("idle");
        setBreathingRunning(false);
    };

    return(
        <View>
            <CountdownTimer
                duration={30}
                running={breathingRunning}
                onFinish={stopBreathingTest}
            />
            <View style={styles.sensorSection}>
                <Text style={styles.sensorTitle}>{t("attempt.breathingTest")}</Text>
                <View style={styles.sensorReading}>
                    <Text style={[styles.sensorValue, { color: theme.tertiary }]}>{bpm}</Text>
                </View>
                <Pressable
                    style={[styles.sensorButton, {
                        backgroundColor: breathingRunning ? theme.textMuted: theme.primary,
                    }]}
                    disabled={breathingRunning}
                    onPress={startBreathingTest}
                >
                    <MaterialCommunityIcons
                        name={breathingRunning ? "timer-outline" : "lungs"}
                        size={20}
                        color="#fff"
                    />

                    <Text style={styles.sensorButtonText}>
                        {breathingRecordingState == "recording" ? t("buttons.recording") : t("attempt.runBreathingTest")}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
} 

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        sensorSection: {
            backgroundColor: colors.surfaceContainer,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            alignItems: "center",
        },
        sensorTitle: { fontFamily: "PoppinsMedium", fontSize: 14, color: colors.textMuted, marginBottom: 12 },
        sensorReading: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 4 },
        sensorValue: { fontSize: 48, fontFamily: "InterBold" },
        sensorUnit: { fontSize: 18, color: colors.textMuted, fontFamily: "InterRegular" },
        sensorMeta: { fontFamily: "InterRegular", fontSize: 12, color: colors.textMuted, marginBottom: 8 },
        sensorButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 4,
        },
        sensorButtonText: { color: "#fff", fontFamily: "InterBold", fontSize: 13 },
    });
    return styles;
}