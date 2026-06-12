import AngleMeasureOverlay from "@/components/AngleMeasureOverlay";
import { ACTION_CONFIGS } from "@/constants/data";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { calculateFanForce, degreesToRadians } from "@/utils/physics";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AudioRecorder } from 'expo-audio';
import { AudioModule, getRecordingPermissionsAsync, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { useVideoPlayer, VideoView } from 'expo-video';
import { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, Line, Rect } from "react-native-svg";

type Sample = { x: number; y: number; z: number; magnitude: number; ts: number };

type AnalysisResult = {
  maxTiltDeg: number;
  avgTiltDeg: number;
  peakAccelG: number;
  avgAccelG: number;
  durationSec: number;
  sampleCount: number;
};

function analyzeSamples(samples: Sample[]): AnalysisResult {
  if (samples.length < 2) return { maxTiltDeg: 0, avgTiltDeg: 0, peakAccelG: 0, avgAccelG: 0, durationSec: 0, sampleCount: 0 };
  const horizontals = samples.map(s => Math.sqrt(s.x * s.x + s.y * s.y));
  const maxH = Math.max(...horizontals);
  const avgH = horizontals.reduce((a, b) => a + b, 0) / horizontals.length;
  const tilts = horizontals.map(h => Math.atan(h) * (180 / Math.PI));
  return {
    maxTiltDeg: Math.atan(maxH) * (180 / Math.PI),
    avgTiltDeg: tilts.reduce((a, b) => a + b, 0) / tilts.length,
    peakAccelG: maxH,
    avgAccelG: avgH,
    durationSec: (samples[samples.length - 1].ts - samples[0].ts) / 1000,
    sampleCount: samples.length,
  };
}

export default function StructuredActivity({ activityKey }: { activityKey: string }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const ctx = use(ActivityContext);
  const { submitAction, isActionComplete, actionSubmissions } = ctx || {};

  const configs = ACTION_CONFIGS[activityKey] || [];
  if (configs.length === 0) return <Text style={styles.errorText}>{t("attempt.noActionsConfigured")}</Text>;

  const hasSoundSensor = activityKey === "sound-pollution-hunter";
  const hasVibrationSensor = activityKey === "earthquake-resistant-structure";
  const hasMovementSensor = activityKey === "stretch-speed-and-gracefulness";
  const isReactionChallenge = activityKey === "reaction-board-challenge";
  const isBreathingChallenge = activityKey === "breathing-pace-trainer";
  const hasVideo = activityKey === "parachute-drop-challenge";
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
  const samplesRef = useRef<Sample[]>([]);
  const [liveSamples, setLiveSamples] = useState<Sample[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
  const vibrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const GRAPH_WINDOW = 120;

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
  const [breaths, setBreaths] = useState(0);
  const [bpm, setBpm] = useState(0);
  const zValues = useRef<number[]>([]);
  const [breathingRecordingState, setBreathingRecordingState] = useState<"idle" | "recording">("idle");
  const breathingSubscription = useRef<Subscription | null>(null);

  const meterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fan angle measurement overlay
  const [angleOverlayVisible, setAngleOverlayVisible] = useState(false);

  // Parachute video evidence
  const [actionVideoUris, setActionVideoUris] = useState<Record<string, string>>({});
  const [videoMode, setVideoMode] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [currentRecordingUri, setCurrentRecordingUri] = useState<string | null>(null);
  const requestCameraPermission = useCameraPermissions()[1];
  const cameraRef = useRef<CameraView>(null);
  const previewPlayer = useVideoPlayer(currentRecordingUri ? { uri: currentRecordingUri } : null, player => {
    player.loop = true;
  });

  // Video recording timing for auto-fill Time to Ground
  const recordingStartRef = useRef(0);
  const lastRecordingDurationRef = useRef(0);

  // 20-minute activity timer (Parachute only)
  const timerStartedRef = useRef(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60 * 1000);

  const formatTimer = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
      if (vibrationTimerRef.current) clearTimeout(vibrationTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (subscription) subscription.remove();
      const r = recorderRef.current;
      if (r) { r.stop().catch(() => {}); r.release(); }
    };
  }, []);

  // Video recording: start after CameraView mounts
  const videoCancelledRef = useRef(false);
  useEffect(() => {
    if (videoMode !== 'recording' || !cameraRef.current) return;
    videoCancelledRef.current = false;
    recordingStartRef.current = Date.now();
    cameraRef.current.recordAsync({ maxDuration: 60 })
      .then(result => {
        if (videoCancelledRef.current || !result?.uri) return;
        lastRecordingDurationRef.current = (Date.now() - recordingStartRef.current) / 1000;
        setCurrentRecordingUri(result.uri);
        setVideoMode('preview');
      })
      .catch(err => {
        if (videoCancelledRef.current) return;
        console.error('Failed to record video:', err);
        setVideoMode('idle');
      });
    return () => { videoCancelledRef.current = true; };
  }, [videoMode]);

  // 20-minute timer countdown
  useEffect(() => {
    if (!timerStart) return;
    const interval = setInterval(() => {
      setTimeRemaining(Math.max(0, 20 * 60 * 1000 - (Date.now() - timerStart)));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStart]);



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
    setCountdown(10);
    samplesRef.current = [];
    setLiveSamples([]);
    startTimeRef.current = Date.now();
    Accelerometer.setUpdateInterval(50);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const sample: Sample = {
        x, y, z,
        magnitude: Math.sqrt(x * x + y * y + z * z),
        ts: Date.now(),
      };
      samplesRef.current.push(sample);
      if (samplesRef.current.length % 2 === 0) {
        setLiveSamples([...samplesRef.current]);
      }
      setLiveAccel(sample.magnitude);
      setPeakAccel(prev => Math.max(prev, sample.magnitude));
    });
    setSubscription(sub);

    // Auto-stop after 10 seconds with countdown
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 10 - elapsed);
      setCountdown(Math.ceil(remaining));
      if (remaining <= 0) stopVibrationTest();
    }, 250);

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
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (subscription) subscription.remove();
    setSubscription(null);
    setCountdown(10);

    const samples = samplesRef.current;
    setLiveSamples([...samples]);

    const avg = samples.length > 0
      ? samples.reduce((a, b) => a + b.magnitude, 0) / samples.length
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

  const handleStartRecording = async () => {
    const { granted } = await requestCameraPermission();
    if (!granted) {
      Alert.alert("Permission Required", "Camera permission is needed to record video.");
      return;
    }
    setVideoMode('recording');
  };

  const handleStopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  const saveVideo = () => {
    if (!currentRecordingUri) return;
    const duration = lastRecordingDurationRef.current;
    setActionVideoUris(prev => ({ ...prev, [config.id]: currentRecordingUri }));
    if (duration > 0) {
      setFormValues(prev => ({ ...prev, timeToGround: duration.toFixed(2) }));
    }
    setCurrentRecordingUri(null);
    setVideoMode('idle');
  };

  const retryRecording = () => {
    setCurrentRecordingUri(null);
    setVideoMode('idle');
  };

  const startChallenge = async () => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    const now = Date.now();
    await AsyncStorage.setItem('parachute_timer_start', now.toString());
    setTimerStart(now);
  };

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
    if (hasVideo && !actionVideoUris[config.id]) {
      Alert.alert("Video Required", "Please record video evidence before submitting this action.");
      return;
    }
    const missing = config.inputs.filter(input => {
      const val = formValues[input.id];
      return !val || val.trim() === "";
    });

    if (missing.length > 0) {
      Alert.alert("Incomplete", `Please fill in: ${missing.map(i => t(i.labelKey)).join(", ")}`);
      return;
    }

    const numericValues: Record<string, string | number> = {};
    config.inputs.forEach(input => {
      const val = formValues[input.id] || "";
      numericValues[input.id] = input.type === "number" ? parseFloat(val) || 0 : val;
    });

    if (actionVideoUris[config.id]) {
      numericValues.videoUri = actionVideoUris[config.id];
    }

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
      setCurrentRecordingUri(null);
      setVideoMode('idle');
    }
  };

  const isAllComplete = configs.every(c => isActionComplete?.(c.id));
  const hasSensorReading = configs[currentStep]?.inputs.some(i => i.id === "measuredDb" || i.id === "measuredMovement");

  return (
    <View style={styles.container}>
      {/* 20-Minute Timer (Parachute only) */}
      {hasVideo && (
        timerStart ? (
          <View style={[styles.timerBanner, timeRemaining <= 0 && styles.timerBannerExpired]}>
            <MaterialCommunityIcons name="timer-outline" size={20} color={timeRemaining <= 60000 ? theme.danger : theme.secondary} />
            <Text style={[styles.timerText, timeRemaining <= 60000 && { color: theme.danger }]}>
              {formatTimer(timeRemaining)}
            </Text>
            {timeRemaining <= 0 && (
              <Text style={styles.timerExpiredText}>{t("attempt.leaderboardIneligible")}</Text>
            )}
          </View>
        ) : (
          <View style={styles.challengePrompt}>
            <MaterialCommunityIcons name="timer-outline" size={24} color={theme.secondary} />
            <Text style={styles.challengeTitle}>{t("attempt.minuteChallenge")}</Text>
            <Text style={styles.challengeSubtitle}>{t("attempt.startTimer")}</Text>
            <Pressable
              style={[styles.sensorButton, { backgroundColor: theme.secondary, marginTop: 4 }]}
              onPress={startChallenge}
            >
              <MaterialCommunityIcons name="play" size={20} color="#fff" />
              <Text style={styles.sensorButtonText}>{t("buttons.startChallenge")}</Text>
            </Pressable>
          </View>
        )
      )}
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
                {t(c.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isAllComplete ? (
        <View style={styles.allComplete}>
          <MaterialCommunityIcons name="check-circle" size={48} color={theme.tertiary} />
          <Text style={styles.allCompleteText}>{t("attempt.actionsCompleted")}</Text>
          {/* Comparison table for earthquake */}
          {hasVibrationSensor && configs.some(c => analysisResults[c.id]) && (
            <View style={styles.tableCard}>
              <Text style={styles.sectionTitle}>{t("attempt.resultsComparison")}</Text>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader, { flex: 2 }]}>{t("attempt.design")}</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>{t("attempt.maxTilt")}</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>{t("attempt.avgTilt")}</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>{t("attempt.peak")} (g)</Text>
              </View>
              {configs.map((c, i) => {
                const result = analysisResults[c.id];
                if (!result) return null;
                const ranked = configs
                  .filter(cc => analysisResults[cc.id])
                  .sort((a, b) => analysisResults[a.id].avgTiltDeg - analysisResults[b.id].avgTiltDeg);
                const isBest = ranked.length > 0 && ranked[0].id === c.id;
                return (
                  <View key={c.id} style={[styles.tableRow, isBest && styles.bestRow]}>
                    <Text style={[styles.tableCell, styles.tableCellText, { flex: 2 }]}>
                      {isBest ? "★ " : ""}{t(c.labelKey)}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>{result.maxTiltDeg.toFixed(1)}°</Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>{result.avgTiltDeg.toFixed(1)}°</Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>{result.peakAccelG.toFixed(3)}</Text>
                  </View>
                );
              })}
              {configs.filter(c => analysisResults[c.id]).length > 0 && (
                <Text style={styles.bestDesignText}>
                  {t("attempt.best")}: {(configs.filter(c => analysisResults[c.id]).sort((a, b) => analysisResults[a.id].avgTiltDeg - analysisResults[b.id].avgTiltDeg)[0]?.labelKey)} — {t("attempt.lowestAvgTilt")}
                </Text>
              )}
            </View>
          )}
        </View>
      ) : (
        <>
          {/* Action Header */}
          <View style={styles.actionHeader}>
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>{t("attempt.action")} {currentStep + 1}/3</Text>
            </View>
            <Text style={styles.actionLabel}>{t(config.labelKey)}</Text>
            {config.subtitleKey && (
              <Text style={styles.actionSubtitle}>{t(config.subtitleKey)}</Text>
            )}
          </View>

          {/* Sensor Sections */}
          {hasSoundSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>{t("attempt.soundMeter")}</Text>
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
                  {recorder ? t("attempt.stop") : t("attempt.startSoundMeter")}
                </Text>
              </Pressable>
            </View>
          )}

          {hasVibrationSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>{t("attempt.vibrationTest")}</Text>

              {/* Live SVG graph */}
              <View style={styles.graphContainer}>
                {liveSamples.length < 2 ? (
                  <View style={styles.graphPlaceholder}>
                    <Text style={styles.graphPlaceholderText}>
                      {liveSamples.length === 0
                        ? t("attempt.tapRecord")
                        : t("attempt.collectingSamples")}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.graphHeader}>
                      <Text style={styles.graphLabel}>{t("attempt.liveVibration")}</Text>
                      <Text style={styles.graphValue}>
                        {(Math.atan(Math.sqrt(
                          liveSamples[liveSamples.length - 1].x ** 2 +
                          liveSamples[liveSamples.length - 1].y ** 2
                        )) * (180 / Math.PI)).toFixed(1)}°
                      </Text>
                    </View>
                    <Svg width={280} height={140}>
                      <Rect x={0} y={0} width={280} height={140} fill={theme.card} rx={6} />
                      <Line x1={0} y1={70} x2={280} y2={70} stroke={theme.borderColor} strokeWidth={1} strokeDasharray="4,4" />
                      {liveSamples.slice(-GRAPH_WINDOW).map((s, i, arr) => {
                        if (i === 0) return null;
                        const horizontal = Math.sqrt(s.x ** 2 + s.y ** 2);
                        const signed = s.x >= 0 ? horizontal : -horizontal;
                        const prevH = Math.sqrt(arr[i - 1].x ** 2 + arr[i - 1].y ** 2);
                        const prevSigned = arr[i - 1].x >= 0 ? prevH : -prevH;
                        const maxScale = 0.5;
                        const x1 = ((i - 1) / (arr.length - 1)) * 280;
                        const y1 = 70 - (prevSigned / maxScale) * 70;
                        const x2 = (i / (arr.length - 1)) * 280;
                        const y2 = 70 - (signed / maxScale) * 70;
                        return (
                          <Line
                            key={`${s.ts}-${i}`}
                            x1={Math.max(0, Math.min(280, x1))}
                            y1={Math.max(2, Math.min(138, y1))}
                            x2={Math.max(0, Math.min(280, x2))}
                            y2={Math.max(2, Math.min(138, y2))}
                            stroke={theme.danger}
                            strokeWidth={2}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </Svg>
                  </>
                )}
              </View>

              <View style={styles.sensorReading}>
                <Text style={[styles.sensorValue, { color: liveAccel > 3 ? theme.danger : theme.tertiary }]}>
                  {liveAccel.toFixed(1)}
                </Text>
                <Text style={styles.sensorUnit}>g</Text>
              </View>
              {peakAccel > 0 && (
                <Text style={styles.sensorMeta}>{t("attempt.peak")}: {peakAccel.toFixed(2)}g</Text>
              )}
              <Pressable
                style={[styles.sensorButton, { backgroundColor: isVibrating ? theme.danger : theme.primary }]}
                onPress={isVibrating ? stopVibrationTest : startVibrationTest}
              >
                <MaterialCommunityIcons name={isVibrating ? "stop" : "vibrate"} size={20} color="#fff" />
                <Text style={styles.sensorButtonText}>
                  {isVibrating ? `${t("attempt.stop")} (${countdown}s)` : t("attempt.runVibrationTest")}
                </Text>
              </Pressable>

              {/* Analysis result card */}
              {analysisResults[config.id] && !isVibrating && (
                <View style={styles.resultGrid}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultValue}>{analysisResults[config.id].maxTiltDeg.toFixed(1)}°</Text>
                    <Text style={styles.resultLabel}>{t("attempt.maxTilt")}</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultValue}>{analysisResults[config.id].avgTiltDeg.toFixed(1)}°</Text>
                    <Text style={styles.resultLabel}>{t("attempt.avgTilt")}</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultValue}>{analysisResults[config.id].peakAccelG.toFixed(3)}g</Text>
                    <Text style={styles.resultLabel}>{t("attempt.peakAccel")}</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultValue}>{analysisResults[config.id].durationSec.toFixed(1)}s</Text>
                    <Text style={styles.resultLabel}>{t("attempt.duration")}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {hasMovementSensor && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>{t("attempt.movementTest")}</Text>
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
                  {isRecordingMovement ? t("attempt.stop") : t("attempt.runMovementTest")}
                </Text>
              </Pressable>
            </View>
          )}

          {isReactionChallenge && (
            <>
              <View style={styles.sensorSection}>
                <Text style={styles.sensorTitle}>
                  {currentStep === 2 ? t("attempt.tracingSensor") : t("attempt.reactionTimer")}
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
                    {currentStep === 2 ? (reactionChallengeState == "ready" ? t("attempt.stopTracing"): t("attempt.startTracing")) : (reactionChallengeState == "waiting" ? t("attempt.waitForSignal"): (reactionChallengeState == "ready" ? t("attempt.tap"): t("attempt.startReactionTest")))}
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
              <Text style={styles.sensorTitle}>{t("attempt.breathingTest")}</Text>
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
                  {breathingRecordingState == "recording" ? t("attempt.stop") : t("attempt.runBreathingTest")}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Video Evidence Section (Parachute only) */}
          {hasVideo && (
            <View style={styles.sensorSection}>
              <Text style={styles.sensorTitle}>{t("attempt.videoEvidence")}</Text>
              {isActionComplete?.(config.id) ? (
                actionSubmissions?.[config.id]?.videoUri ? (
                  <View style={styles.videoAttachedRow}>
                    <MaterialCommunityIcons name="check-circle" size={20} color={theme.tertiary} />
                    <Text style={[styles.videoAttachedText, { color: theme.tertiary }]}>{t("attempt.videoAttached")}</Text>
                  </View>
                ) : (
                  <Text style={[styles.autoFillHint, { textAlign: "center" }]}>{t("attempt.noVideoRecorded")}</Text>
                )
              ) : (<>
                {videoMode === 'idle' && !actionVideoUris[config.id] && (
                <Pressable
                  style={[styles.sensorButton, { backgroundColor: theme.primary }]}
                  onPress={handleStartRecording}
                >
                  <MaterialCommunityIcons name="video" size={20} color="#fff" />
                  <Text style={styles.sensorButtonText}>{t("buttons.recordVideoEvidence")}</Text>
                </Pressable>
              )}
              {videoMode === 'idle' && actionVideoUris[config.id] && (
                <View style={styles.videoAttachedRow}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={theme.tertiary} />
                  <Text style={[styles.videoAttachedText, { color: theme.tertiary }]}>{t("attempt.videoAttached")}</Text>
                  <Pressable
                    style={[styles.sensorButton, { backgroundColor: theme.surfaceContainer }]}
                    onPress={() => {
                      setActionVideoUris(prev => {
                        const next = { ...prev };
                        delete next[config.id];
                        return next;
                      });
                    }}
                  >
                    <Text style={[styles.sensorButtonText, { color: theme.textMuted }]}>{t("buttons.removeVideo")}</Text>
                  </Pressable>
                </View>
              )}
              {videoMode === 'recording' && (
                <View style={styles.videoRecorderContainer}>
                  <CameraView
                    ref={cameraRef}
                    style={styles.cameraPreview}
                    facing="back"
                    mode="video"
                  />
                  <Pressable
                    style={[styles.sensorButton, { backgroundColor: theme.danger, marginTop: 12 }]}
                    onPress={handleStopRecording}
                  >
                    <MaterialCommunityIcons name="stop" size={20} color="#fff" />
                    <Text style={styles.sensorButtonText}>{t("buttons.stopRecording")}</Text>
                  </Pressable>
                </View>
              )}
              {videoMode === 'preview' && currentRecordingUri && (
                <View style={styles.videoPreviewContainer}>
                  <VideoView
                    player={previewPlayer}
                    style={styles.videoPreview}
                    nativeControls
                    contentFit="contain"
                  />
                  <View style={styles.videoPreviewButtons}>
                    <Pressable
                      style={[styles.videoPreviewBtn, { backgroundColor: theme.tertiary }]}
                      onPress={saveVideo}
                    >
                      <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
                      <Text style={styles.videoPreviewBtnText}>{t("buttons.saveVideo")}</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.videoPreviewBtn, { backgroundColor: theme.danger }]}
                      onPress={retryRecording}
                    >
                      <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
                      <Text style={styles.videoPreviewBtnText}>{t("buttons.retry")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              </>)}
            </View>
          )}

          {/* Fan live calculation */}
          {activityKey === "hand-fan-challenge" && (
            <View style={styles.calcSection}>
              <Text style={styles.calcSectionTitle}>F ≈ k · θ</Text>
              <Text style={styles.calcHint}>k = {t("attempt.stiffness")} ({t("attempt.paper")} 1, {t("attempt.cardboard")} 3), θ = {t("attempt.bendAngle")}</Text>
              {formValues.observedAngle ? (
                <View style={styles.calcRow}>
                  <View style={styles.calcCard}>
                    <Text style={styles.calcLabel}>{t("attempt.angle")} (rad)</Text>
                    <Text style={styles.calcValue}>
                      {degreesToRadians(parseFloat(formValues.observedAngle) || 0).toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.calcCard}>
                    <Text style={styles.calcLabel}>{t("attempt.force")} (k·θ)</Text>
                    <Text style={styles.calcValue}>
                      {calculateFanForce(0.2, parseFloat(formValues.observedAngle) || 0).toFixed(3)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.autoFillHint}>{t("attempt.enterObservedAngle")}</Text>
              )}
            </View>
          )}

          {/* Form Inputs */}
          <View style={styles.formSection}>
            {config.inputs.map((input) => {
              const isAutoFill = (input.id === "measuredDb" && hasSoundSensor) ||
                (input.id === "measuredMovement" && hasVibrationSensor) ||
                (input.id === "timeToGround" && hasVideo);
              return (
                <View key={input.id} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {t(input.labelKey)}
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
                        placeholder={t(input.placeholderKey ?? "")}
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
                  {activityKey === "hand-fan-challenge" && input.id === "observedAngle" && !isActionComplete?.(config.id) && (
                    <Pressable
                      style={[styles.measureBtn, { borderColor: theme.secondary }]}
                      onPress={() => setAngleOverlayVisible(true)}
                    >
                      <MaterialCommunityIcons name="camera" size={16} color={theme.secondary} />
                      <Text style={[styles.measureBtnText, { color: theme.secondary }]}>Measure Bend Angle</Text>
                    </Pressable>
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
              <Text style={styles.submitBtnText}>{t("attempt.submitTrial")}</Text>
            </Pressable>
          )}

          {isActionComplete?.(config.id) && currentStep < configs.length - 1 && (
            <Pressable
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => { setCurrentStep(currentStep + 1); setFormValues({}); setCurrentRecordingUri(null); setVideoMode('idle'); }}
            >
              <Text style={styles.nextBtnText}>Next Action</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={theme.secondary} />
            </Pressable>
          )}
        </>
      )}

      <AngleMeasureOverlay
        visible={angleOverlayVisible}
        onSave={(angle) => {
          handleInputChange("observedAngle", String(angle));
          setAngleOverlayVisible(false);
        }}
        onCancel={() => setAngleOverlayVisible(false)}
      />
    </View>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: { paddingVertical: 8 },
  errorText: { fontFamily: "InterRegular", fontSize: 14, color: theme.danger, textAlign: "center" },
  timerBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
  },
  timerBannerExpired: {
    backgroundColor: theme.danger + "20",
    borderWidth: 1,
    borderColor: theme.danger,
  },
  timerText: { fontFamily: "PoppinsBold", fontSize: 20, color: theme.secondary },
  measureBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  measureBtnText: { fontFamily: "InterSemiBold", fontSize: 13 },
  timerExpiredText: { fontFamily: "InterRegular", fontSize: 12, color: theme.danger, marginLeft: 4 },
  challengePrompt: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
    borderWidth: 1,
    borderColor: theme.borderColor,
    gap: 8,
  },
  challengeTitle: { fontFamily: "PoppinsBold", fontSize: 16, color: theme.secondary },
  challengeSubtitle: { fontFamily: "InterRegular", fontSize: 12, color: theme.textMuted },
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
  graphContainer: { width: "100%", marginBottom: 12 },
  graphPlaceholder: { height: 140, alignItems: "center", justifyContent: "center", backgroundColor: theme.card, borderRadius: 6, paddingHorizontal: 20 },
  graphPlaceholderText: { fontFamily: "InterRegular", fontSize: 12, color: theme.textMuted, textAlign: "center" },
  graphHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  graphLabel: { fontFamily: "InterBold", fontSize: 11, color: theme.textMuted },
  graphValue: { fontFamily: "InterBold", fontSize: 18, color: theme.danger },
  resultGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, width: "100%" },
  resultItem: { flex: 1, minWidth: "40%", backgroundColor: theme.card, borderRadius: 8, padding: 10, alignItems: "center" },
  resultValue: { fontFamily: "InterBold", fontSize: 18, color: theme.secondary },
  resultLabel: { fontFamily: "InterRegular", fontSize: 10, color: theme.textMuted, textTransform: "uppercase", marginTop: 2 },
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
  calcSection: { backgroundColor: theme.surfaceContainer, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.borderColor },
  calcSectionTitle: { fontFamily: "PoppinsBold", fontSize: 16, color: theme.primary, textAlign: "center" },
  calcHint: { fontFamily: "InterRegular", fontSize: 11, color: theme.textMuted, textAlign: "center", marginBottom: 12 },
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
  cardContainer: { marginBottom: 16 },
  reactionBoxContainer: {
    borderRadius: 20, backgroundColor: theme.card, height: 320,
    display: "flex", alignItems: "center", flexDirection: "row",
    position: "relative", marginBottom: 16,
  },
  placeholderText: { fontFamily: "PoppinsRegular", fontSize: 14, color: theme.secondary, textAlign: "center", width: "100%", paddingHorizontal: 24 },
  button: { backgroundColor: theme.primary, width: 80, height: 80, borderRadius: 10, justifyContent: "center", alignItems: "center", display: "flex", position: "absolute" },
  buttonText: { color: "#FFFFFF", fontFamily: "InterSemiBold", width: "100%", textAlign: "center", lineHeight: 18, fontSize: 16 },
  sectionTitle: { fontFamily: "PoppinsBold", fontSize: 14, color: theme.secondary, marginBottom: 8, textAlign: "center" },
  tableCard: { backgroundColor: theme.surfaceContainer, borderRadius: 12, padding: 16, marginTop: 16, borderWidth: 1, borderColor: theme.borderColor, width: "100%" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: theme.borderColor, paddingVertical: 8 },
  bestRow: { backgroundColor: theme.tertiary + "15", borderRadius: 6, paddingHorizontal: 4 },
  tableCell: { flex: 1, paddingHorizontal: 4 },
  tableHeader: { fontFamily: "InterBold", fontSize: 10, color: theme.textMuted, textTransform: "uppercase" },
  tableCellText: { fontFamily: "InterMedium", fontSize: 12, color: theme.secondary },
  bestDesignText: { fontFamily: "InterBold", fontSize: 12, color: theme.tertiary, marginTop: 8, textAlign: "center" },
  videoAttachedRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  videoAttachedText: { fontFamily: "InterBold", fontSize: 14 },
  videoRecorderContainer: { width: "100%", alignItems: "center" },
  cameraPreview: { width: "100%", height: 250, borderRadius: 8, overflow: "hidden" },
  videoPreviewContainer: { width: "100%", alignItems: "center" },
  videoPreview: { width: "100%", height: 250, borderRadius: 8, overflow: "hidden" },
  videoPreviewButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
  videoPreviewBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
  },
  videoPreviewBtnText: { color: "#fff", fontFamily: "InterBold", fontSize: 13 },
});
