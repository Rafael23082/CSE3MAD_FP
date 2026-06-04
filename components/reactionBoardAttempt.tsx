import { ActivityContext } from "@/context/ActivityContext";

type ActivityResults = {
    label: string,
    value: string
}
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import Button from "./button";
import Card from "./card";

export default function ReactionBoardAttemptScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [challengeState, setChallengeState] = useState<"idle" | "waiting" | "ready" | "finished">("idle");
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [time, setTime] = useState(10);
    const [accuracy, setAccuracy] = useState(0);

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const buttonSize = useRef(80);
    const [buttonLocation, setButtonLocation] = useState({ x: 0, y: 0 });

    const fingerPosition = useRef({ x: 0, y: 0 });
    const isTouching = useRef(false);

    const trackingSamples = useRef<{
        fingerX: number;
        fingerY: number;
        circleX: number;
        circleY: number;
        touching: boolean;
    }[]>([]);

    const activityResults = useRef<ActivityResults[]>([]);

    const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        if (currentPhaseIndex !== 2) return;
        if (containerSize.width === 0 || containerSize.height === 0) return;
        if (challengeState !== "ready") return;

        const radius = 30;
        let x = containerSize.width / 2;
        let y = containerSize.height / 2;
        let directionX = 1;
        let directionY = 1;
        const speedX = 4;
        const speedY = 3;

        const movementInterval = setInterval(() => {
            x += speedX * directionX;
            y += speedY * directionY;

            const minX = radius;
            const maxX = containerSize.width - radius;
            const minY = radius;
            const maxY = containerSize.height - radius;

            if (x >= maxX || x <= minX) directionX *= -1;
            if (y >= maxY || y <= minY) directionY *= -1;

            setCirclePosition({ x, y });

            trackingSamples.current.push({
                fingerX: fingerPosition.current.x,
                fingerY: fingerPosition.current.y,
                circleX: x,
                circleY: y,
                touching: isTouching.current
            });
        }, 16);

        return () => clearInterval(movementInterval);
    }, [currentPhaseIndex, containerSize, challengeState]);

    useEffect(() => {
        if (currentPhaseIndex !== 2) return;
        if (challengeState !== "ready") return;

        const interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [challengeState, currentPhaseIndex]);

    useEffect(() => {
        if (currentPhaseIndex !== 2 || time !== 0 || challengeState !== "ready") return;
        if (!activityContext?.activity?.phases) return;

        const score = calculateAccuracy();
        setAccuracy(score);
        setChallengeState("finished");

        activityResults.current.push({
            label: activityContext.activity.phases[currentPhaseIndex],
            value: `${score}%`
        });
    }, [currentPhaseIndex, time, challengeState, activityContext]);

    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    let currentPhase;
    if (activity.phases){
        currentPhase = activity.phases[currentPhaseIndex]
    }

    const startChallenge = () => {
        setChallengeState("waiting");
        setReactionTime(null);

        const randomDelay = 1000 + Math.random() * 3000;
        setButtonLocation({
            x: Math.random() * ((containerSize.width - buttonSize.current) - 0) + 0,
            y: Math.random() * ((containerSize.height - buttonSize.current) - 0) + 0
        });

        setTimeout(() => {  
            setChallengeState("ready");
            setStartTime(performance.now());
        }, randomDelay);
    };

    const handleReactionPress = () => {
        if (challengeState !== "ready") return;

        const endTime = performance.now();
        const result = endTime - startTime;
        const rounded = Math.ceil(result * 10) / 10;
        
        setReactionTime(rounded);
        setChallengeState("finished");

        if (activity.phases) {
            activityResults.current.push({
                label: activity.phases[currentPhaseIndex],
                value: `${rounded} ms`
            });
        }
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

    const formatNumber = (s: number) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return(
        <SafeAreaView style={styles.outerContainer} edges={["top"]}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.head}>{activity.name}</Text>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
                            {currentPhaseIndex == 2 && (
                                <View style={styles.timerContainer}>
                                    <Text style={[styles.sectionHeader, {
                                        lineHeight: 20
                                    }]}>{formatNumber(time)}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.phaseText}>{t("activities.phase")} {currentPhaseIndex + 1} — {currentPhase}</Text>
                        <Text style={[styles.actionName, {marginTop: 24}]}>{currentPhaseIndex == 2 ? t("activities.reactionBoardChallenge.measureTracingAccuracy"): t("activities.reactionBoardChallenge.recordReactionTime")}</Text>
                        <View style={styles.cardContainer}>
                            {currentPhaseIndex != 2 ? (
                                <Card metric="ms" value={reactionTime == null ? "0": String(reactionTime)} maximumWidth={true} />
                            ): (
                                <Card metric={t("activities.reactionBoardChallenge.accuracyScore")} value={`${accuracy}%`} maximumWidth={true} />
                            )}
                        </View>
                        <Text style={styles.actionName}>{currentPhaseIndex == 2 ? t("activities.reactionBoardChallenge.tracingZone"): t("activities.reactionBoardChallenge.reactionZone")}</Text>
                        {currentPhaseIndex == 2 ? (
                            <GestureDetector gesture={panGesture}>
                                <View 
                                    style={styles.reactionBoxContainer}
                                    onLayout={(e) => {
                                        const {width, height} = e.nativeEvent.layout;
                                        setContainerSize({width, height});
                                    }}
                                >
                                    {challengeState === "ready" ? (
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
                                {challengeState === "ready" ? (
                                    <Pressable 
                                        style={[styles.button, {
                                            top: buttonLocation.y,
                                            left: buttonLocation.x
                                        }]}
                                        onPress={()=> {handleReactionPress()}
                                    }>
                                        <Text style={styles.buttonText}>{t("activities.reactionBoardChallenge.tap")}</Text>
                                    </Pressable>
                                ): (
                                    <Text style={styles.placeholderText}>{t("activities.reactionBoardChallenge.reactionZonePlaceholder")}</Text>
                                )}
                            </View>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {challengeState == "idle" && (
                            <Button text={t("buttons.startChallenge")} action={() => {
                                if (currentPhaseIndex != 2){
                                    startChallenge()
                                }else{
                                    trackingSamples.current = [];
                                    setTime(10);
                                    setAccuracy(0);
                                    setChallengeState("ready");
                                }
                            }} />
                        )}
                        {(challengeState == "waiting" || challengeState == "ready") && (
                            <Button text={challengeState == "waiting" ? t("buttons.waitForSignal"): t("buttons.tapNow")} action={() => {}} />
                        )}
                        {challengeState == "finished" && (
                            <Button text={currentPhaseIndex == 2 ? t("buttons.finishActivity"): t("buttons.continue")} action={() => {
                                if (activity.phases && currentPhaseIndex < activity.phases.length - 1) {
                                    setCurrentPhaseIndex(prev => prev + 1);
                                    setChallengeState("idle");
                                    setReactionTime(null);
                                    setAccuracy(0);
                                }else{
                                    router.push({
                                        pathname: "/activityResults",
                                        params: {
                                            results: JSON.stringify(activityResults.current),
                                            activityKey: "reaction-board-challenge"
                                        }
                                    });
                                }
                            }} />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        cardContainer: {
            marginBottom: 16
        },
        reactionBoxContainer: {
            borderRadius: 20,
            backgroundColor: colors.card,
            height: 320,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            position: "relative"
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
        button: {
            backgroundColor: colors.primary,
            width: 80,
            height: 80,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            position: "absolute",
        },
        buttonText: {
            color: "#FFFFFF",
            fontFamily: "InterSemiBold",
            width: "100%",
            textAlign: "center",
            lineHeight: 18,
            fontSize: 16
        },
        timerContainer: {
            padding: 8,
            borderWidth: 1,
            borderColor: colors.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }
    });
    return styles;
}