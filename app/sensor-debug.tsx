import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Audio } from "expo-av";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SensorStatus {
  granted: boolean;
  label: string;
  error?: string;
}

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

interface AccelerometerState {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

export default function SensorDebugScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = Audio.usePermissions();
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();

  const [accelerometerStatus, setAccelerometerStatus] = useState<SensorStatus>({
    granted: false,
    label: "Not requested",
  });
  const [isStartingMic, setIsStartingMic] = useState(false);
  const [isStartingGps, setIsStartingGps] = useState(false);
  const [accelerometerRefreshToken, setAccelerometerRefreshToken] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [accelerometerError, setAccelerometerError] = useState<string | null>(
    null,
  );
  const [micDb, setMicDb] = useState(0);
  const [locationState, setLocationState] = useState<LocationState | null>(
    null,
  );
  const [accelerometerState, setAccelerometerState] =
    useState<AccelerometerState | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let locationSubscription: { remove: () => void } | null = null;

    const startGpsWatch = async () => {
      if (!locationPermission?.granted) return;

      try {
        setIsStartingGps(true);
        setLocationError(null);
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocationState({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          accuracy: currentPosition.coords.accuracy,
        });

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,
            distanceInterval: 0,
          },
          (update) => {
            setLocationState({
              latitude: update.coords.latitude,
              longitude: update.coords.longitude,
              accuracy: update.coords.accuracy,
            });
          },
        );
      } catch (error) {
        setLocationError(
          error instanceof Error ? error.message : "Unable to read GPS.",
        );
      } finally {
        setIsStartingGps(false);
      }
    };

    if (locationPermission?.granted) {
      void startGpsWatch();
    }

    return () => {
      locationSubscription?.remove();
    };
  }, [locationPermission?.granted]);

  useEffect(() => {
    let accelerometerSubscription: { remove: () => void } | null = null;

    const startAccelerometer = async () => {
      try {
        setAccelerometerError(null);
        const response = await Accelerometer.requestPermissionsAsync();
        const granted = response.status === "granted";
        setAccelerometerStatus({
          granted,
          label: granted ? "Granted" : "Denied",
          error: granted ? undefined : "Accelerometer permission denied.",
        });

        if (!granted) return;

        Accelerometer.setUpdateInterval(120);
        accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          setAccelerometerState({ x, y, z, magnitude });
        });
      } catch (error) {
        setAccelerometerError(
          error instanceof Error
            ? error.message
            : "Unable to read accelerometer.",
        );
        setAccelerometerStatus({
          granted: false,
          label: "Error",
          error: "Unable to initialize accelerometer.",
        });
      }
    };

    void startAccelerometer();

    return () => {
      accelerometerSubscription?.remove();
    };
  }, [accelerometerRefreshToken]);

  const requestCamera = async () => {
    setCameraError(null);
    const result = await requestCameraPermission();
    if (result.status !== "granted") {
      setCameraError("Camera permission denied.");
    }
  };

  const requestGps = async () => {
    setLocationError(null);
    const result = await requestLocationPermission();
    if (result.status !== "granted") {
      setLocationError("Location permission denied.");
    }
  };

  const startMicMeter = async () => {
    try {
      setIsStartingMic(true);
      setAudioError(null);

      if (audioPermission?.status !== "granted") {
        const result = await requestAudioPermission();
        if (result.status !== "granted") {
          setAudioError("Microphone permission denied.");
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recording.setProgressUpdateInterval(250);
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && typeof status.metering === "number") {
          const db = Math.max(0, status.metering + 100);
          setMicDb(Math.round(db));
        }
      });
      setIsRecording(true);

      const stop = async () => {
        try {
          await recording.stopAndUnloadAsync();
        } catch (error) {
          setAudioError(
            error instanceof Error
              ? error.message
              : "Unable to stop microphone meter.",
          );
        } finally {
          await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
          setIsRecording(false);
          setMicDb(0);
        }
      };

      setTimeout(() => {
        void stop();
      }, 5000);
    } catch (error) {
      setAudioError(
        error instanceof Error
          ? error.message
          : "Unable to start microphone meter.",
      );
    } finally {
      setIsStartingMic(false);
    }
  };

  const sensorCards = [
    {
      title: "Camera",
      status: cameraPermission?.granted
        ? "Granted"
        : cameraPermission?.canAskAgain === false
          ? "Denied"
          : "Not requested",
      live: cameraPermission?.granted
        ? "Camera preview active"
        : "Permission required",
      error: cameraError,
      onPress: requestCamera,
      buttonLabel: cameraPermission?.granted ? "Re-request" : "Allow camera",
    },
    {
      title: "Microphone",
      status:
        audioPermission?.status === "granted"
          ? "Granted"
          : audioPermission?.canAskAgain === false
            ? "Denied"
            : "Not requested",
      live: isRecording ? `${micDb} dB` : "Tap to sample live audio",
      error: audioError,
      onPress: startMicMeter,
      buttonLabel: isStartingMic ? "Starting..." : "Measure mic",
    },
    {
      title: "GPS",
      status: locationPermission?.granted
        ? "Granted"
        : locationPermission?.canAskAgain === false
          ? "Denied"
          : "Not requested",
      live: locationState
        ? `${formatCoordinate(locationState.latitude)}, ${formatCoordinate(locationState.longitude)}`
        : "Waiting for fix",
      error: locationError,
      onPress: requestGps,
      buttonLabel: isStartingGps ? "Finding fix..." : "Allow GPS",
    },
    {
      title: "Accelerometer",
      status: accelerometerStatus.label,
      live: accelerometerState
        ? `x:${accelerometerState.x.toFixed(3)} y:${accelerometerState.y.toFixed(3)} z:${accelerometerState.z.toFixed(3)}`
        : "Waiting for motion",
      error: accelerometerError || accelerometerStatus.error || undefined,
      onPress: async () => {
        setAccelerometerRefreshToken((value) => value + 1);
      },
      buttonLabel: accelerometerStatus.granted
        ? "Re-check"
        : "Allow accelerometer",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Sensor Debug</Text>
            <Text style={styles.subtitle}>
              Use a physical Android device to verify live sensor data.
            </Text>
          </View>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Camera preview</Text>
          {cameraPermission?.granted ? (
            <View style={styles.cameraFrame}>
              <CameraView style={StyleSheet.absoluteFill} facing="back" />
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Camera permission required.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {sensorCards.map((card) => (
            <View key={card.title} style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>{card.title}</Text>
              <Text style={styles.sensorStatus}>{card.status}</Text>
              <Text style={styles.sensorLive}>{card.live}</Text>
              {card.error ? (
                <Text style={styles.sensorError}>{card.error}</Text>
              ) : null}
              <Pressable
                style={styles.sensorButton}
                onPress={() => void card.onPress()}
              >
                <Text style={styles.sensorButtonText}>{card.buttonLabel}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Live snapshot</Text>
          {!accelerometerState && !locationState && micDb === 0 ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <View style={styles.snapshotList}>
              <Text style={styles.snapshotItem}>Mic: {micDb} dB</Text>
              <Text style={styles.snapshotItem}>
                GPS:{" "}
                {locationState
                  ? `${formatCoordinate(locationState.latitude)}, ${formatCoordinate(locationState.longitude)}`
                  : "Waiting"}
              </Text>
              <Text style={styles.snapshotItem}>
                Accelerometer:{" "}
                {accelerometerState
                  ? accelerometerState.magnitude.toFixed(3)
                  : "Waiting"}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.sensorButton,
            { marginTop: 4, backgroundColor: theme.danger },
          ]}
          onPress={() => {
            Alert.alert(
              "Validation tip",
              "Walk around the room, speak into the microphone, and rotate the device to confirm live readings on the physical phone.",
            );
          }}
        >
          <Text style={styles.sensorButtonText}>Show validation tip</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    content: {
      padding: 20,
      gap: 14,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    title: {
      fontFamily: "PoppinsBold",
      fontSize: 24,
      color: colors.primary,
    },
    subtitle: {
      marginTop: 4,
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    backButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.card,
    },
    backButtonText: {
      color: colors.textPrimary,
      fontWeight: "600",
    },
    panel: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.borderColor,
      padding: 16,
      gap: 12,
    },
    sectionTitle: {
      fontFamily: "PoppinsBold",
      fontSize: 16,
      color: colors.secondary,
    },
    cameraFrame: {
      height: 220,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: "#111827",
    },
    placeholder: {
      height: 220,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surfaceContainer,
    },
    placeholderText: {
      color: colors.textMuted,
    },
    grid: {
      gap: 12,
    },
    sensorCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.borderColor,
      padding: 16,
      gap: 8,
    },
    sensorTitle: {
      fontFamily: "PoppinsBold",
      color: colors.secondary,
      fontSize: 15,
    },
    sensorStatus: {
      color: colors.textMuted,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    sensorLive: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 20,
    },
    sensorError: {
      color: colors.danger,
      fontSize: 12,
      lineHeight: 18,
    },
    sensorButton: {
      marginTop: 2,
      backgroundColor: colors.primary,
      borderRadius: 999,
      paddingVertical: 12,
      alignItems: "center",
    },
    sensorButtonText: {
      color: colors.buttonText,
      fontWeight: "700",
    },
    snapshotList: {
      gap: 8,
    },
    snapshotItem: {
      color: colors.textPrimary,
      fontSize: 14,
    },
  });
