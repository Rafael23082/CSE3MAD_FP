import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from "react-native-svg";
import CountdownTimer from "./countdownTimer";

type reactionBoardAttemptScreenProps = {
    currentStep: number,
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function ReactionBoardAttemptScreen({currentStep, setFormValues}: reactionBoardAttemptScreenProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const [reactionChallengeState, setReactionChallengeState] = useState<"idle" | "waiting" | "ready">("idle");  
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState<number | null>(0);
    const [tracingAccuracy, setTracingAccuracy] = useState(0);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
    const fingerPosition = useRef({ x: 0, y: 0 });
    const isTouching = useRef(false);
    const buttonSize = useRef(80);
    const [buttonLocation, setButtonLocation] = useState({ x: 0, y: 0 });
    const trackingSamples = useRef<{
        fingerX: number;
        fingerY: number;
        circleX: number;
        circleY: number;
        touching: boolean;
    }[]>([]);
    const tracingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [tracingRunning, setTracingRunning] = useState(false);

    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .minDistance(0)
        .onBegin((e) => {
            isTouching.current = true;
            fingerPosition.current = { x: e.x, y: e.y };
        })
        .onUpdate((e) => {
            fingerPosition.current = { x: e.x, y: e.y };
            })
        .onEnd(() => {
            isTouching.current = false;
        });

  const handleReactionPress = () => {
      if (reactionChallengeState !== "ready") return;

      const endTime = performance.now();
      const result = endTime - startTime;
      const rounded = Math.ceil(result * 10) / 10;
      
    setFormValues(prev => ({
      ...prev,
      measuredReactionTime: String(result)
    }));

      setReactionTime(rounded);
      setReactionChallengeState("idle");
  };

  const startReactionChallenge = () => {
      setReactionChallengeState("waiting");
      setReactionTime(null);
      setReactionTime(0);
      trackingSamples.current = [];

      const randomDelay = 1000 + Math.random() * 3000;
      setButtonLocation({
          x: Math.random() * ((containerSize.width - buttonSize.current) - 0) + 0,
          y: Math.random() * ((containerSize.height - buttonSize.current) - 0) + 0
      });

      setTimeout(() => {  
          setReactionChallengeState("ready");
          setStartTime(performance.now());
      }, randomDelay);
  };

  const startTracingChallenge = () => {
      trackingSamples.current = [];
      setTracingAccuracy(0);
      setReactionChallengeState("ready");

      setTracingRunning(true);

      const radius = 30;
      let x = containerSize.width / 2;
      let y = containerSize.height / 2;

      let directionX = 1;
      let directionY = 1;

      const speedX = 4;
      const speedY = 3;

      tracingIntervalRef.current = setInterval(() => {
          x += speedX * directionX;
          y += speedY * directionY;

          if (x >= containerSize.width - radius || x <= radius)
              directionX *= -1;

          if (y >= containerSize.height - radius || y <= radius)
              directionY *= -1;

          setCirclePosition({ x, y });

          trackingSamples.current.push({
              fingerX: fingerPosition.current.x,
              fingerY: fingerPosition.current.y,
              circleX: x,
              circleY: y,
              touching: isTouching.current,
          });
      }, 16);
  };

  const stopTracingChallenge = () => {
      if (tracingIntervalRef.current) {
          clearInterval(tracingIntervalRef.current);
          tracingIntervalRef.current = null;
      }
      
      const score = calculateAccuracy();
      setTracingAccuracy(score);

      setFormValues(prev => ({
        ...prev,
        measuredTracingAccuracy: String(score)
      }));

      setReactionChallengeState("idle");
  };
  
  const calculateAccuracy = () => {
      if (trackingSamples.current.length === 0) return 0;

      let totalAccuracy = 0;
      const targetRadius = 15; 
      const maxPenaltyDistance = 45; 

      trackingSamples.current.forEach((s) => {
          if (!s.touching) {
              totalAccuracy += 0; 
              return;
          }

          const dx = s.fingerX - s.circleX;
          const dy = s.fingerY - s.circleY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= targetRadius) {
              totalAccuracy += 100;
          } else {
              const distanceOutside = distance - targetRadius;
              const penaltyRatio = Math.min(1, distanceOutside / maxPenaltyDistance);
              const accuracyDrop = Math.pow(penaltyRatio, 2) * 100; 
              
              const frameAccuracy = Math.max(0, 100 - accuracyDrop);
              totalAccuracy += frameAccuracy;
          }
      });

      const finalScore = totalAccuracy / trackingSamples.current.length;
      return Math.round(finalScore);
  };

    return(
        <View>
            {currentStep == 2 && (
                <CountdownTimer
                    duration={10}
                    running={tracingRunning}
                    onFinish={stopTracingChallenge}
                />
            )}
            <View style={styles.sensorSection}>
            <Text style={styles.sensorTitle}>
                {currentStep === 2 ? t("attempt.tracingSensor") : t("attempt.reactionTimer")}
            </Text>
            
            <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: theme.tertiary }]}>
                {currentStep === 2 ? `${(tracingAccuracy || 0)}%`: `${(reactionTime || 0)} ms`}
                </Text>
            </View>

            <Pressable
                style={[styles.sensorButton, {
                    backgroundColor: reactionChallengeState == "ready" ? theme.textMuted: theme.primary,
                }]}
                disabled={tracingRunning}
                onPress={() => {
                    if (currentStep == 2){
                    startTracingChallenge();
                    }else{
                    startReactionChallenge();
                    }
                }}
            >
                <MaterialCommunityIcons
                    name={tracingRunning ? "timer-outline" : "vibrate"}
                    size={20}
                    color="#fff"
                />

                <Text style={styles.sensorButtonText}>
                    {currentStep === 2 ? (reactionChallengeState == "ready" ? t("buttons.recording"): t("attempt.startTracing")) : (reactionChallengeState == "waiting" ? t("attempt.waitForSignal"): (reactionChallengeState == "ready" ? t("attempt.tap"): t("attempt.startReactionTest")))}
                </Text>
            </Pressable>
            </View>
            {currentStep === 2 ? (
            <GestureDetector gesture={panGesture}>
                <View 
                    style={styles.reactionBoxContainer}
                    onLayout={(e) => {
                        const {width, height} = e.nativeEvent.layout;
                        setContainerSize({width, height});
                    }}
                >
                    {reactionChallengeState === "ready" ? (
                        <Svg height={"100%"} width={"100%"}>
                            <Circle
                                cx={circlePosition.x}
                                cy={circlePosition.y}
                                r={30}
                                fill={theme.primary}
                            />
                        </Svg>
                    ): (
                        <Text style={styles.placeholderText}>{t("activities.reactionBoardChallenge.tracingZonePlaceholder")}</Text>
                    )}
                </View>
            </GestureDetector>
        ): (
            <View 
                style={styles.reactionBoxContainer}
                onLayout={(e) => {
                    const {width, height} = e.nativeEvent.layout;
                    setContainerSize({width, height});
                }}
            >
                {reactionChallengeState === "ready" ? (
                    <Pressable 
                        style={[styles.button, {
                            top: buttonLocation.y,
                            left: buttonLocation.x
                        }]}
                        onPress={handleReactionPress}>
                        <Text style={styles.buttonText}>{t("activities.reactionBoardChallenge.tap")}</Text>
                    </Pressable>
                ): (
                    <Text style={styles.placeholderText}>{t("activities.reactionBoardChallenge.reactionZonePlaceholder")}</Text>
                )}
            </View>
            )}
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
        reactionBoxContainer: {
            borderRadius: 20, backgroundColor: colors.card, height: 200,
            display: "flex", alignItems: "center", flexDirection: "row",
            position: "relative", marginBottom: 16,
        },
        button: { backgroundColor: colors.primary, width: 80, height: 80, borderRadius: 10, justifyContent: "center", alignItems: "center", display: "flex", position: "absolute" },
        buttonText: { color: "#FFFFFF", fontFamily: "InterSemiBold", width: "100%", textAlign: "center", lineHeight: 18, fontSize: 16 },
        placeholderText: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary, textAlign: "center", width: "100%", paddingHorizontal: 24 },
    });
    return styles;
}