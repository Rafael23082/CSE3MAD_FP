import { useTheme } from "@/hooks/useTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CountdownTimerProps = {
    duration: number;
    running: boolean;
    onFinish: () => void;
};

export default function CountdownTimer({ duration, running, onFinish }: CountdownTimerProps) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!running) return;

        setTimeLeft(duration);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);

                    setTimeout(() => {
                        onFinish();
                    }, 0);

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running, duration]);

    const isWarning = timeLeft <= 5 && timeLeft > 0;

    return (
        <View
            style={[
                styles.container,
            ]}
        >
            <MaterialCommunityIcons
                name="timer-outline"
                size={22}
                color={isWarning ? theme.danger : theme.secondary}
            />

            <Text
                style={[
                    styles.timerText,
                    isWarning && styles.warningText,
                ]}
            >
                {timeLeft}s
            </Text>
        </View>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 16,
            borderWidth: 1,
        },
        timerText: {
            fontSize: 24,
            fontFamily: "PoppinsBold",
            color: theme.secondary,
        },

        warningText: {
            color: theme.danger,
        },
    });