import { ACTION_CONFIGS } from "@/constants/data";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { calculateFanForce, degreesToRadians } from "@/utils/physics";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AudioRecorder } from 'expo-audio';
import { AudioModule, getRecordingPermissionsAsync, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from "react-native-svg";

export default function StructuredActivity({ activityKey }: { activityKey: string }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const ctx = use(ActivityContext);
  const { submitAction, isActionComplete, actionSubmissions } = ctx || {};

  const configs = ACTION_CONFIGS[activityKey] || [];
  if (configs.length === 0) return <Text style={styles.errorText}>No actions configured</Text>;

  const hasSoundSensor = activityKey === "sound-pollution-hunter";
  const hasVibrationSensor = activityKey === "earthquake-resistant-structure";
  const hasMovementSensor = activityKey === "stretch-speed-and-gracefulness";
  const hasTimer = activityKey === "parachute-drop-challenge";
  const isReactionChallenge = activityKey === "reaction-board-challenge";
  const isBreathingChallenge = activityKey === "breathing-pace-trainer";
  
  const findFirstIncomplete = () => {
    for (let i = 0; i < configs.length; i++) {
      if (!isActionComplete?.(configs[i].id)) return i;
    }
    return configs.length;
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentStep >= configs.length) return;
    const config = configs[currentStep];
    if (isActionComplete?.(config.id)) {
      setCurrentStep(findFirstIncomplete());
    }
  }, []);

  useEffect(() => {
    const first = findFirstIncomplete();
    if (first < configs.length && !isActionComplete?.(configs[first].id)) {
      setCurrentStep(first);
    }
  }, [actionSubmissions]);

  // Sound sensor state
  const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const [liveDb, setLiveDb] = useState(0);

  // Earthquake sensor state
  const [isVibrating, setIsVibrating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [peakAccel, setPeakAccel] = useState(0);
  const [liveAccel, setLiveAccel] = useState(0);
  const magnitudeHistory = useRef<number[]>([]);
  const vibrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parachute timer state
  const [timeValue, setTimeValue] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Humarn Performance Lab Vibrations State
  const [isRecordingMovement, setIsRecordingMovement] = useState(false);
  const [vibrations, setVibrations] = useState(0);
  const previousMagnitude = useRef(0);
  const movementValues = useRef<number[]>([]);
  const [movementSubscription, setMovementSubscription] = useState<Subscription | null>(null);

  // Reaction Board Challenge Reaction Time and Accuracy State
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

  // Reaction Board Challenge Reaction Time and Accuracy State
  const [centered, setCentered] = useState<number[]>([]);
  const [breaths, setBreaths] = useState(0);
  const [bpm, setBpm] = useState(0);
  const zValues = useRef<number[]>([]);
  const [breathingRecordingState, setBreathingRecordingState] = useState<"idle" | "recording">("idle");
  const breathingSubscription = useRef<Subscription | null>(null);

  const meterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
      if (vibrationTimerRef.current) clearTimeout(vibrationTimerRef.current);
      if (subscription) subscription.remove();
      const r = recorderRef.current;
      if (r) { r.stop().catch(() => {}); r.release(); }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeValue((Date.now() - startRef.current) / 1000);
      }, 30);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning]);

  const startSoundMeter = async () => {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        const { granted: existing } = await getRecordingPermissionsAsync();
        if (!existing) return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      const rec = new AudioModule.AudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
      await rec.prepareToRecordAsync();
      rec.record();
      recorderRef.current = rec;
      setRecorder(rec);

      meterIntervalRef.current = setInterval(() => {
        const status = rec.getStatus();
        if (status.isRecording && status.metering !== undefined && status.metering !== null) {
          const spl = Math.max(0, status.metering + 100);
          setLiveDb(Math.round(spl));
          setFormValues(prev => ({ ...prev, measuredDb: String(Math.round(spl)) }));
        }
      }, 250);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopSoundMeter = async () => {
    if (meterIntervalRef.current) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }
    const rec = recorderRef.current;
    if (rec) {
      try {
        await rec.stop();
        await setAudioModeAsync({ allowsRecording: false });
        rec.release();
      } catch (err) {
        console.error('Stop recording error:', err);
      }
      recorderRef.current = null;
      setRecorder(null);
    }
  };

  const toggleSoundMeter = () => {
    if (recorder) stopSoundMeter();
    else startSoundMeter();
  };

  const startVibrationTest = async () => {
    setIsVibrating(true);
    setPeakAccel(0);
    setLiveAccel(0);
    magnitudeHistory.current = [];
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      setLiveAccel(magnitude);
      magnitudeHistory.current.push(magnitude);
      if (magnitude > peakAccel) setPeakAccel(magnitude);
    });
    setSubscription(sub);

    const runCycle = async () => {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        vibrationTimerRef.current = setTimeout(runCycle, 400);
      } catch (e) {
        console.warn("Vibration failed:", e);
      }
    };
    runCycle();
  };

  const stopVibrationTest = () => {
    setIsVibrating(false);
    if (vibrationTimerRef.current) clearTimeout(vibrationTimerRef.current);
    if (subscription) subscription.remove();
    setSubscription(null);

    const avg = magnitudeHistory.current.length > 0
      ? magnitudeHistory.current.reduce((a, b) => a + b, 0) / magnitudeHistory.current.length
      : 0;
    const swayCm = parseFloat(((avg - 1) * 10).toFixed(1));
    setFormValues(prev => ({ ...prev, measuredMovement: String(swayCm) }));
  };

  const startMovementTest = () => {
    setIsRecordingMovement(true);
    setVibrations(0);
    movementValues.current = [];
    previousMagnitude.current = 0;

    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      const delta = Math.abs(magnitude - previousMagnitude.current);
      previousMagnitude.current = magnitude;
      
      movementValues.current.push(delta);
      
      if (delta > 0.25) {
        setVibrations((prev) => prev + 1);
      }
    });
    setSubscription(sub);
  };

  const stopMovementTest = () => {
    setIsRecordingMovement(false);
    
    setFormValues(prev => ({
      ...prev,
      measuredVibrations: String(vibrations)
    }));

    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
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

          if (x >= containerSize.width - radius || x <= radius) directionX *= -1;
          if (y >= containerSize.height - radius || y <= radius) directionY *= -1;

          setCirclePosition({ x, y });

          trackingSamples.current.push({
              fingerX: fingerPosition.current.x,
              fingerY: fingerPosition.current.y,
              circleX: x,
              circleY: y,
              touching: isTouching.current
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
        measureTracingAccuracy: String(score)
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
    setCentered([]);

    Accelerometer.setUpdateInterval(100);

    breathingSubscription.current = Accelerometer.addListener(({ z }) => {
        zValues.current.push(z);
    });

      setBreathingRecordingState("recording");
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

      setCentered(centeredSignal);

      const breathCount = detectBreaths(centeredSignal);
      const durationSeconds = zValues.current.length * 0.1;
      const calculatedBpm = Math.round((breathCount / durationSeconds) * 60);

      setBreaths(breathCount);
      setBpm(calculatedBpm);

      setFormValues(prev => ({
        ...prev,
        measuredBPM: String(calculatedBpm)
      }));

      setBreathingRecordingState("idle");
  };

  const toggleTimer = () => {
    if (!isTimerRunning) {
      startRef.current = Date.now() - (timeValue * 1000);
    }
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeValue(0);
    setFormValues(prev => ({ ...prev, timeToGround: "0" }));
  };

  // Capture timer value into form
  useEffect(() => {
    if (!isTimerRunning && timeValue > 0) {
      setFormValues(prev => ({ ...prev, timeToGround: timeValue.toFixed(2) }));
    }
  }, [isTimerRunning, timeValue]);

  const config = configs[currentStep];
  if (!config) return null;

  const currentValues = isActionComplete?.(config.id)
    ? actionSubmissions?.[config.id] ?? {}
    : formValues;

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const isStepComplete = (): boolean => {
    const submission = actionSubmissions?.[config.id];
    if (!submission) return false;
    return config.inputs.every(input => {
      const val = submission[input.id];
      return val !== undefined && val !== "" && val !== null;
    });
  };

  const handleSubmit = () => {
    const missing = config.inputs.filter(input => {
      const val = formValues[input.id];
      return !val || val.trim() === "";
    });

    if (missing.length > 0) {
      Alert.alert("Incomplete", `Please fill in: ${missing.map(i => i.label).join(", ")}`);
      return;
    }

    const numericValues: Record<string, string | number> = {};
    config.inputs.forEach(input => {
      const val = formValues[input.id] || "";
      numericValues[input.id] = input.type === "number" ? parseFloat(val) || 0 : val;
    });

    setSubmitting(true);
    submitAction?.(config.id, numericValues);
    setFormValues({});
    setSubmitting(false);

    const nextStep = currentStep + 1;
    if (nextStep < configs.length) {
      setCurrentStep(nextStep);
    }
  };

  const navigateToStep = (step: number) => {
    if (step <= currentStep + 1 || isActionComplete?.(configs[step]?.id)) {
      setCurrentStep(step);
      setFormValues({});
    }
  };

  const isAllComplete = configs.every(c => isActionComplete?.(c.id));
  const hasSensorReading = configs[currentStep]?.inputs.some(i => i.id === "measuredDb" || i.id === "measuredMovement");

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {configs.map((c, i) => {
          const complete = isActionComplete?.(c.id);
          const isCurrent = i === currentStep;
          return (
            <Pressable
              key={c.id}
              style={styles.stepItem}
              onPress={() => navigateToStep(i)}
            >
              <View style={[
                styles.stepCircle,
                complete && styles.stepCircleComplete,
                isCurrent && !complete && styles.stepCircleActive,
              ]}>
                {complete ? (
                  <MaterialCommunityIcons name="check" size={14} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumber, isCurrent && styles.stepNumberActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                complete && styles.stepLabelComplete,
                isCurrent && !complete && styles.stepLabelActive,
              ]} numberOfLines={1}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isAllComplete ? (
        <View style={styles.allComplete}>
          <MaterialCommunityIcons name="check-circle" size={48} color={theme.tertiary} />
          <Text style={styles.allCompleteText}>All actions completed!</Text>
        </View>
      ) : (
        <>
          {/* Action Header */}
          <View style={styles.actionHeader}>
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>Action {currentStep + 1}/3</Text>
            </View>
            <Text style={styles.actionLabel}>{config.label}</Text>
            {config.subtitle && (
              <Text style={styles.actionSubtitle}>{config.subtitle}</Text>
            )}
          </View>

          {/* Sensor Sections */}
          {hasSoundSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>Sound Meter</Text>
              <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: liveDb > 85 ? theme.danger : theme.primary }]}>
                  {liveDb}
                </Text>
                <Text style={styles.sensorUnit}>dB</Text>
              </View>
              <Pressable
                style={[styles.sensorButton, { backgroundColor: recorder ? theme.danger : theme.primary }]}
                onPress={toggleSoundMeter}
              >
                <MaterialCommunityIcons name={recorder ? "stop" : "microphone"} size={20} color="#fff" />
                <Text style={styles.sensorButtonText}>
                  {recorder ? "Stop" : "Start Sound Meter"}
                </Text>
              </Pressable>
            </View>
          )}

          {hasVibrationSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>Vibration Test</Text>
              <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: liveAccel > 3 ? theme.danger : theme.tertiary }]}>
                  {liveAccel.toFixed(1)}
                </Text>
                <Text style={styles.sensorUnit}>g</Text>
              </View>
              {peakAccel > 0 && (
                <Text style={styles.sensorMeta}>Peak: {peakAccel.toFixed(2)}g</Text>
              )}
              <Pressable
                style={[styles.sensorButton, { backgroundColor: isVibrating ? theme.danger : theme.primary }]}
                onPress={isVibrating ? stopVibrationTest : startVibrationTest}
              >
                <MaterialCommunityIcons name={isVibrating ? "stop" : "vibrate"} size={20} color="#fff" />
                <Text style={styles.sensorButtonText}>
                  {isVibrating ? "Stop" : "Run Vibration Test"}
                </Text>
              </Pressable>
            </View>
          )}

          {hasMovementSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>Movement Test</Text>
              <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: theme.tertiary }]}>
                  {vibrations}
                </Text>
              </View>
              <Pressable
                style={[styles.sensorButton, { backgroundColor: isRecordingMovement ? theme.danger : theme.primary }]}
                onPress={isRecordingMovement ? stopMovementTest : startMovementTest}
              >
                <MaterialCommunityIcons name={isRecordingMovement ? "stop" : "vibrate"} size={20} color="#fff" />
                <Text style={styles.sensorButtonText}>
                  {isRecordingMovement ? "Stop" : "Run Movement Test"}
                </Text>
              </Pressable>
            </View>
          )}

          {isReactionChallenge && (
            <>
              <View style={styles.sensorSection}>
                <Text style={styles.sensorTitle}>
                  {currentStep === 2 ? "Tracing Sensor" : "Reaction Timer"}
                </Text>
                
                <View style={styles.sensorReading}>
                  <Text style={[styles.sensorValue, { color: theme.tertiary }]}>
                    {currentStep === 2 
                      ? `${(tracingAccuracy || 0)}%` 
                      : `${(reactionTime || 0)} ms`}
                  </Text>
                </View>

                <Pressable
                  style={[styles.sensorButton, { backgroundColor: reactionChallengeState === "ready" ? theme.danger: theme.primary }]}
                  onPress={() => {
                    if (currentStep == 2){
                    reactionChallengeState === "ready" 
                      ? stopTracingChallenge() 
                      : startTracingChallenge();
                    }else{
                      startReactionChallenge();
                    }
                  }}
                >
                  <MaterialCommunityIcons name="timer-outline" size={20} color="#fff" />
                  <Text style={styles.sensorButtonText}>
                    {currentStep === 2 ? (reactionChallengeState == "ready" ? "Stop Tracing": "Start Tracing") : (reactionChallengeState == "waiting" ? "Wait For the Signal": (reactionChallengeState == "ready" ? "TAP!": "Start Reaction Test"))}
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
            </>
          )}

          {isBreathingChallenge && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>Breathing Test</Text>
              <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: theme.tertiary }]}>
                  {bpm}
                </Text>
              </View>
              <Pressable
                style={[styles.sensorButton, { backgroundColor: breathingRecordingState == "recording" ? theme.danger : theme.primary }]}
                onPress={breathingRecordingState == "recording" ? stopBreathingTest : startBreathingTest}
              >
                <MaterialCommunityIcons name={breathingRecordingState == "recording" ? "stop" : "lungs"} size={20} color="#fff" />
                <Text style={styles.sensorButtonText}>
                  {breathingRecordingState == "recording" ? "Stop" : "Run Breathing Test"}
                </Text>
              </Pressable>
            </View>
          )}

          {hasTimer && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>Timer</Text>
              <Text style={[styles.sensorValue, { color: theme.primary }]}>
                {timeValue.toFixed(2)}
              </Text>
              <Text style={styles.sensorUnit}>seconds</Text>
              <View style={styles.timerRow}>
                <Pressable style={[styles.timerBtn, { backgroundColor: theme.surfaceContainer }]} onPress={resetTimer}>
                  <Text style={[styles.timerBtnText, { color: theme.textMuted }]}>Reset</Text>
                </Pressable>
                <Pressable
                  style={[styles.timerBtn, { flex: 2, backgroundColor: isTimerRunning ? theme.danger : theme.primary }]}
                  onPress={toggleTimer}
                >
                  <Text style={styles.timerBtnText}>{isTimerRunning ? "Stop" : "Start"}</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Fan live calculation */}
          {activityKey === "hand-fan-challenge" && formValues.observedAngle && (
            <View style={styles.calcRow}>
              <View style={styles.calcCard}>
                <Text style={styles.calcLabel}>Angle (rad)</Text>
                <Text style={styles.calcValue}>
                  {degreesToRadians(parseFloat(formValues.observedAngle) || 0).toFixed(3)}
                </Text>
              </View>
              <View style={styles.calcCard}>
                <Text style={styles.calcLabel}>Force (N)</Text>
                <Text style={styles.calcValue}>
                  {calculateFanForce(0.2, parseFloat(formValues.observedAngle) || 0).toFixed(3)}
                </Text>
              </View>
            </View>
          )}

          {/* Form Inputs */}
          <View style={styles.formSection}>
            {config.inputs.map((input) => {
              const isAutoFill = (input.id === "measuredDb" && hasSoundSensor) ||
                (input.id === "measuredMovement" && hasVibrationSensor) ||
                (input.id === "timeToGround" && hasTimer);
              return (
                <View key={input.id} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {input.label}
                    {isAutoFill && (
                      <Text style={styles.autoFillHint}> (auto-filled)</Text>
                    )}
                  </Text>
                  {isActionComplete?.(config.id) ? (
                    <Text style={styles.submittedValue}>
                      {String(currentValues[input.id] ?? "")}
                    </Text>
                  ) : (
                    <View style={styles.inputRow}>
                      <TextInput
                        style={[
                          styles.textInput,
                          isAutoFill && styles.autoFillInput,
                        ]}
                        value={formValues[input.id] ?? ""}
                        onChangeText={(val) => handleInputChange(input.id, val)}
                        placeholder={input.placeholder}
                        placeholderTextColor={theme.textMuted}
                        keyboardType={input.type === "number" ? "numeric" : "default"}
                        editable={!isActionComplete?.(config.id)}
                      />
                      {isAutoFill && formValues[input.id] && (
                        <Pressable
                          style={styles.clearBtn}
                          onPress={() => handleInputChange(input.id, "")}
                        >
                          <MaterialCommunityIcons name="close-circle" size={20} color={theme.textMuted} />
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Submit Button */}
          {!isActionComplete?.(config.id) && (
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: theme.secondary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleSubmit}
            >
              <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Trial</Text>
            </Pressable>
          )}

          {isActionComplete?.(config.id) && currentStep < configs.length - 1 && (
            <Pressable
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => { setCurrentStep(currentStep + 1); setFormValues({}); }}
            >
              <Text style={styles.nextBtnText}>Next Action</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={theme.secondary} />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: { paddingVertical: 8 },
  errorText: { fontFamily: "InterRegular", fontSize: 14, color: theme.danger, textAlign: "center" },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepItem: { alignItems: "center", flex: 1, gap: 4 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.borderColor,
  },
  stepCircleComplete: { backgroundColor: theme.tertiary, borderColor: theme.tertiary },
  stepCircleActive: { borderColor: theme.secondary, backgroundColor: theme.secondary + "20" },
  stepNumber: { fontFamily: "InterBold", fontSize: 12, color: theme.textMuted },
  stepNumberActive: { color: theme.secondary },
  stepLabel: { fontFamily: "InterRegular", fontSize: 10, color: theme.textMuted, textAlign: "center" },
  stepLabelComplete: { color: theme.tertiary },
  stepLabelActive: { color: theme.secondary },
  actionHeader: { marginBottom: 20, alignItems: "center" },
  actionBadge: {
    backgroundColor: theme.secondary + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionBadgeText: { fontFamily: "InterBold", fontSize: 11, color: theme.secondary, textTransform: "uppercase" },
  actionLabel: { fontFamily: "PoppinsBold", fontSize: 20, color: theme.secondary, textAlign: "center" },
  actionSubtitle: { fontFamily: "InterRegular", fontSize: 13, color: theme.textMuted, marginTop: 4, textAlign: "center" },
  sensorSection: {
    backgroundColor: theme.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
    alignItems: "center",
  },
  sensorTitle: { fontFamily: "PoppinsMedium", fontSize: 14, color: theme.textMuted, marginBottom: 12 },
  sensorReading: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 4 },
  sensorValue: { fontSize: 48, fontFamily: "InterBold" },
  sensorUnit: { fontSize: 18, color: theme.textMuted, fontFamily: "InterRegular" },
  sensorMeta: { fontFamily: "InterRegular", fontSize: 12, color: theme.textMuted, marginBottom: 8 },
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
  timerRow: { flexDirection: "row", gap: 12, marginTop: 8, width: "100%" },
  timerBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  timerBtnText: { color: "#fff", fontFamily: "InterBold", fontSize: 14 },
  calcRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  calcCard: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  calcLabel: { fontFamily: "InterRegular", fontSize: 11, color: theme.textMuted, marginBottom: 4 },
  calcValue: { fontFamily: "PoppinsBold", fontSize: 16, color: theme.primary },
  formSection: { gap: 16, marginBottom: 20 },
  fieldContainer: { gap: 6 },
  fieldLabel: { fontFamily: "InterMedium", fontSize: 13, color: theme.secondary },
  autoFillHint: { fontFamily: "InterRegular", fontSize: 11, color: theme.textMuted, fontStyle: "italic" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter",
    fontSize: 14,
    color: theme.secondary,
    backgroundColor: theme.surfaceContainer,
    minHeight: 44,
  },
  autoFillInput: { borderColor: theme.tertiary, backgroundColor: theme.tertiary + "10" },
  clearBtn: { padding: 4 },
  submittedValue: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: theme.tertiary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.tertiary + "10",
    borderRadius: 8,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
  },
  submitBtnText: { color: "#fff", fontFamily: "InterBold", fontSize: 14 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  nextBtnText: { fontFamily: "InterBold", fontSize: 14, color: theme.secondary },
  allComplete: { alignItems: "center", paddingVertical: 24, gap: 12 },
  allCompleteText: { fontFamily: "PoppinsBold", fontSize: 16, color: theme.tertiary },
  cardContainer: {
    marginBottom: 16
  },
  reactionBoxContainer: {
      borderRadius: 20,
      backgroundColor: theme.card,
      height: 320,
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      position: "relative",
      marginBottom: 16
  },
  placeholderText: {
      fontFamily: "PoppinsRegular",
      fontSize: 14,
      color: theme.secondary,
      textAlign: "center",
      width: "100%",
      paddingHorizontal: 24
  },
  button: {
      backgroundColor: theme.primary,
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
});
