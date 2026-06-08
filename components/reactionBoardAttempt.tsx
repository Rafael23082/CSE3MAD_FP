import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from "react-native-svg";
import Button from "./button";
import Card from "./card";
import PresetSelector from "./presetSelector";

type ActivityResults = {
    label: string,
    value: string
}

const DESIGN_PRESETS = [
  { key: "activities.reactionBoardChallenge.dominantHand" },
  { key: "activities.reactionBoardChallenge.nonDominantHand" },
  { key: "activities.reactionBoardChallenge.tracingChallenge" },
];

export default function ReactionBoardAttemptScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

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

    interface reactionEntry {
        id: number;
        key: string;
        reactionTime?: number,
        tracingAccuracy?: number
    }
    const [designs, setDesigns] = useState<reactionEntry[]>([]);

    const trackingSamples = useRef<{
        fingerX: number;
        fingerY: number;
        circleX: number;
        circleY: number;
        touching: boolean;
    }[]>([]);

    const activityResults = useRef<ActivityResults[]>([]);
    const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
    const [presetKey, setPresetKey] = useState("activities.reactionBoardChallenge.dominantHand");

    useEffect(() => {
        if (presetKey != "activities.reactionBoardChallenge.tracingChallenge") return;
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
    }, [presetKey, containerSize, challengeState]);

    useEffect(() => {
        if (presetKey != "activities.reactionBoardChallenge.tracingChallenge") return;
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
    }, [challengeState, presetKey]);

    useEffect(() => {
        if (presetKey !== "activities.reactionBoardChallenge.tracingChallenge" || time !== 0 || challengeState !== "ready") return;

        const score = calculateAccuracy();
        setAccuracy(score);
        setChallengeState("finished");
    }, [presetKey, time, challengeState, activityContext]);

    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

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

    const logDesign = () => {
        setDesigns(prev => {
            const index = prev.findIndex(d => d.key === presetKey);

            const newDesign = {
                id: Date.now() + Math.random(),
                key: presetKey,
                tracingAccuracy: accuracy ?? undefined,
                reactionTime: reactionTime ?? undefined,
            };

            if (index === -1) {
                return [...prev, newDesign];
            }

            return prev.map((design, i) =>
                i === index ? newDesign : design
            );
        });

        setStartTime(0);
        setTime(10);
        setAccuracy(0);
        setChallengeState("idle");
        setReactionTime(0);
        trackingSamples.current = [];
    }

    const handleFinish = () => {
        if (designs.length < DESIGN_PRESETS.length){
            Alert.alert(t("errorMessages.unfinishedChallenge"), t("errorMessages.unfinishedChallengeDescription"));
            return;
        }

        const results = designs.map(d => ({
            label: `${d.key}`,
            value: d.key == "activities.reactionBoardChallenge.tracingChallenge" ? `Tracing Accuracy: ${d.tracingAccuracy} %`: `Reaction Time: ${d.reactionTime} ms`
        }));

        const dominantHand = designs.find(
            d => d.key === "activities.reactionBoardChallenge.dominantHand"
        );

        const nonDominantHand = designs.find(
            d => d.key === "activities.reactionBoardChallenge.nonDominantHand"
        );

        const tracingChallenge = designs.find(
            d => d.key === "activities.reactionBoardChallenge.tracingChallenge"
        );

        if (activityContext) {
            activityContext.addExperimentLog({
                activityKey: "reaction-board-challenge",
                data: {
                    reactionTime1: dominantHand?.reactionTime,
                    reactionTime2: nonDominantHand?.reactionTime,
                    tracingAccuracy: tracingChallenge?.tracingAccuracy,
                }
            });
        }

        router.push({
            pathname: "/activityResults",
            params: { results: JSON.stringify(results), activityKey: "reaction-board-challenge" }
        });
    };

    return(
        <KeyboardAvoidingView style={styles.outerContainer} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Text style={styles.head}>{activity.name}</Text>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
                        {presetKey == "activities.reactionBoardChallenge.tracingChallenge" && (
                            <View style={styles.timerContainer}>
                                <Text style={[styles.sectionHeader, {
                                    lineHeight: 20
                                }]}>{formatNumber(time)}</Text>
                            </View>
                        )}
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

                    <Text style={[styles.actionName, {marginTop: 24}]}>{presetKey == "activities.reactionBoardChallenge.tracingChallenge" ? t("activities.reactionBoardChallenge.measureTracingAccuracy"): t("activities.reactionBoardChallenge.recordReactionTime")}</Text>
                    <View style={styles.cardContainer}>
                        {presetKey !== "activities.reactionBoardChallenge.tracingChallenge" ? (
                            <Card metric="ms" value={reactionTime == null ? "0": String(reactionTime)} maximumWidth={true} />
                        ): (
                            <Card metric={t("activities.reactionBoardChallenge.accuracyScore")} value={`${accuracy}%`} maximumWidth={true} />
                        )}
                    </View>

                    <View>
                        {challengeState == "idle" && (
                            <Button text={t("buttons.startChallenge")} action={() => {
                                if (presetKey !== "activities.reactionBoardChallenge.tracingChallenge"){
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
                            <Button 
                                text={t("buttons.logTrial")}
                                action={logDesign}
                            />
                        )}
                    </View>

                    <Text style={styles.actionName}>{presetKey == "activities.reactionBoardChallenge.tracingChallenge" ? t("activities.reactionBoardChallenge.tracingZone"): t("activities.reactionBoardChallenge.reactionZone")}</Text>
                    {presetKey == "activities.reactionBoardChallenge.tracingChallenge" ? (
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
                                    onPress={handleReactionPress}>
                                    <Text style={styles.buttonText}>{t("activities.reactionBoardChallenge.tap")}</Text>
                                </Pressable>
                            ): (
                                <Text style={styles.placeholderText}>{t("activities.reactionBoardChallenge.reactionZonePlaceholder")}</Text>
                            )}
                        </View>
                    )}
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
                                <Text style={styles.designConfig}>{loggedDesign.key == "activities.reactionBoardChallenge.tracingChallenge" ? `${t("activities.reactionBoardChallenge.tracingAccuracy")}: ${loggedDesign.tracingAccuracy}%`: `${t("activities.reactionBoardChallenge.reactionTime")}: ${loggedDesign.reactionTime} ms`}</Text> 
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
            marginTop: 24
        },
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