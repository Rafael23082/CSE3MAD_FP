import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CountdownTimer from "./countdownTimer";

type HumanPerformanceLabAttemptScreenProps = {
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function HumanPerformanceLabAttemptScreen({setFormValues}: HumanPerformanceLabAttemptScreenProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const vibrationCountRef = useRef(0);
    const [vibrations, setVibrations] = useState(0);
    const previousMagnitude = useRef(0);
    const movementValues = useRef<number[]>([]);
    const movementSubscription = useRef<Subscription | null>(null);
    const [movementRunning, setMovementRunning] = useState(false);

    useEffect(() => {
        return () => {
            if (movementSubscription.current) {
                movementSubscription.current.remove();
                movementSubscription.current = null;
            }
        };
    }, []);

    const startMovementTest = () => {
        setMovementRunning(true);
        setMovementRunning(true);
        setVibrations(0);
        vibrationCountRef.current = 0;

        movementValues.current = [];
        previousMagnitude.current = 0;

        Accelerometer.setUpdateInterval(100);

        movementSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
            const magnitude = Math.sqrt(x * x + y * y + z * z);

            const delta = Math.abs(
                magnitude - previousMagnitude.current
            );

            previousMagnitude.current = magnitude;
            movementValues.current.push(delta);

            if (delta > 0.25) {
                vibrationCountRef.current += 1;
                setVibrations(vibrationCountRef.current);
            }
        });
    };

    const stopMovementTest = () => {
        setMovementRunning(false);
        setFormValues(prev => ({
            ...prev,
            measuredVibrations: String(vibrationCountRef.current)
        }));

        if (movementSubscription) {
            movementSubscription.current?.remove();
            movementSubscription.current = null;
        }

        setMovementRunning(false);
    };

    return(
        <>
            <CountdownTimer
                duration={10}
                running={movementRunning}
                onFinish={stopMovementTest}
            />
            <View style={styles.sensorSection}>
            <Text style={styles.sensorTitle}>{t("attempt.movementTest")}</Text>
            <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: theme.tertiary }]}>
                    {vibrations}
                </Text>
            </View>
            <Pressable
                style={[styles.sensorButton, {
                    backgroundColor: movementRunning ? theme.textMuted: theme.primary,
                }]}
                disabled={movementRunning}
                onPress={startMovementTest}
            >
                <MaterialCommunityIcons
                    name={movementRunning ? "timer-outline" : "vibrate"}
                    size={20}
                    color="#fff"
                />

                <Text style={styles.sensorButtonText}>
                    {movementRunning ? t("buttons.recording") : t("attempt.runMovementTest")}
                </Text>
            </Pressable>
            </View>
        </>
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