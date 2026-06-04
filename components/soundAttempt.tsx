import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import React, { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";

// PDF: Hearing damage risk table
const HEARING_RISK_TABLE = [
  { range: "0-60 dB", examples: "Whisper, quiet library, classroom", risk: "Safe", color: "tertiary" },
  { range: "60-85 dB", examples: "Busy traffic, vacuum cleaner", risk: "Safe (brief)", color: "tertiary" },
  { range: "85-90 dB", examples: "Lawn mower, loud classroom", risk: "Warning (>8 hrs)", color: "danger" },
  { range: "90-100 dB", examples: "Motorbike, power tools", risk: "High risk (>15 min)", color: "danger" },
  { range: "100-120 dB", examples: "Nightclub, rock concert", risk: "Dangerous (minutes)", color: "danger" },
  { range: "120+ dB", examples: "Siren, jet takeoff", risk: "Immediate damage", color: "danger" },
];

// PDF: Action options for write-up table
const ACTION_PRESETS = ["Dropping a book", "Talking (conversation)", "Walking", "Stamping feet", "Closing a door"];

export default function SoundAttemptScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const activityContext = use(ActivityContext);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [liveDb, setLiveDb] = useState(0);
  const [readings, setReadings] = useState<{ action: string; location: string; db: number; prediction: string; wasRight: string }[]>([]);
  const [location, setLocation] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [prediction, setPrediction] = useState<"Louder" | "Softer" | "">("");
  const [showActions, setShowActions] = useState(false);
  const [showRiskScale, setShowRiskScale] = useState(false);

  useEffect(() => {
    return () => { if (recording) recording.stopAndUnloadAsync().catch(() => {}); };
  }, [recording]);

  if (!activityContext || !activityContext.activity) return null;

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') await requestPermission();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined && status.metering !== null) {
          const spl = Math.max(0, status.metering + 100);
          setLiveDb(Math.round(spl));
        }
      });
      recording.setProgressUpdateInterval(250);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      } catch (err) {
        console.error('Stop recording error:', err);
      }
    }
  };

  // PDF: Determine risk level
  const getRiskLevel = (db: number) => {
    if (db <= 60) return "Safe";
    if (db <= 85) return "Moderate";
    if (db <= 100) return "Dangerous";
    return "Critical";
  };

  const logReading = () => {
    if (!location.trim() || !selectedAction) return;
    const entry = {
      action: selectedAction,
      location: location.trim(),
      db: liveDb,
      prediction: prediction || "",
      wasRight: prediction ? (prediction === "Louder" && liveDb > 70) || (prediction === "Softer" && liveDb <= 70) ? "✓" : "✗" : "",
    };
    setReadings(prev => [entry, ...prev]);
    if (activityContext) {
      activityContext.addExperimentLog({
        activityKey: "sound-pollution-hunter",
        data: { action: selectedAction, location: location.trim(), db: liveDb, risk: getRiskLevel(liveDb) }
      });
    }
    setLocation("");
    setPrediction("");
    setSelectedAction("");
  };

  const handleFinish = () => {
    const results = readings.map(r => ({
      label: `${r.action} @ ${r.location}`,
      value: `${r.db} dB ${r.wasRight ? r.wasRight : ""}`
    }));
    router.push({
      pathname: "/activityResults",
      params: { results: JSON.stringify(results), activityKey: "sound-pollution-hunter" }
    });
  };

  const riskColor = (color: string) => color === "tertiary" ? theme.tertiary : theme.danger;

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.head}>{t("activities.soundPollutionHunter.name")}</Text>

          {/* Decibel Meter */}
          <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
          <View style={styles.dbMeter}>
            <Text style={[styles.dbValue, { color: liveDb > 85 ? theme.danger : theme.primary }]}>{liveDb}</Text>
            <Text style={styles.dbUnit}>dB</Text>
          </View>
          {liveDb > 0 && (
            <Text style={[styles.riskBadge, {
              backgroundColor: liveDb > 85 ? theme.danger + "30" : theme.tertiary + "30",
              color: liveDb > 85 ? theme.danger : theme.tertiary
            }]}>
              Risk: {getRiskLevel(liveDb)}
            </Text>
          )}

          <Button
            text={recording ? "Stop Measuring" : "Start Measuring"}
            action={recording ? stopRecording : startRecording}
          />

          {/* PDF: Action selection */}
          <Text style={styles.sectionHeader}>{t("activities.soundPollutionHunter.actionLabel")}</Text>
          <Pressable style={styles.dropdown} onPress={() => setShowActions(!showActions)}>
            <Text style={[styles.dropdownText, { color: selectedAction ? theme.secondary : theme.textMuted }]}>
              {selectedAction || t("activities.soundPollutionHunter.actionPlaceholder")}
            </Text>
          </Pressable>
          {showActions && (
            <View style={styles.dropdownList}>
              {ACTION_PRESETS.map((action, i) => (
                <Pressable key={i} style={styles.dropdownItem} onPress={() => { setSelectedAction(action); setShowActions(false); }}>
                  <Text style={{ color: theme.secondary, padding: 8 }}>{action}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* PDF: Prediction toggle */}
          <Text style={styles.subSectionHeader}>{t("activities.soundPollutionHunter.predictionLabel")}</Text>
          <View style={styles.predictionRow}>
            <Pressable
              style={[styles.predBtn, { backgroundColor: prediction === "Louder" ? theme.primary : theme.surfaceContainer }]}
              onPress={() => setPrediction(prediction === "Louder" ? "" : "Louder")}
            >
              <Text style={[styles.predText, { color: prediction === "Louder" ? theme.buttonText : theme.textMuted }]}>
                {t("activities.soundPollutionHunter.predictLouder")}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.predBtn, { backgroundColor: prediction === "Softer" ? theme.primary : theme.surfaceContainer }]}
              onPress={() => setPrediction(prediction === "Softer" ? "" : "Softer")}
            >
              <Text style={[styles.predText, { color: prediction === "Softer" ? theme.buttonText : theme.textMuted }]}>
                {t("activities.soundPollutionHunter.predictSofter")}
              </Text>
            </Pressable>
          </View>

          {/* Location */}
          <Text style={styles.subSectionHeader}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder={t("activities.soundPollutionHunter.locationPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          <View style={styles.buttonContainer}>
            <Button text={t("buttons.logReading")} action={logReading} />
          </View>

          {/* PDF: Hearing Risk Scale - toggle */}
          <Pressable style={styles.riskToggle} onPress={() => setShowRiskScale(!showRiskScale)}>
            <Text style={styles.riskToggleText}>
              {showRiskScale ? "▼ " : "▶ "}{t("activities.soundPollutionHunter.hearingRiskTable")}
            </Text>
          </Pressable>
          {showRiskScale && (
            <View style={styles.riskTable}>
              {HEARING_RISK_TABLE.map((row, i) => (
                <View key={i} style={[styles.riskRow, { borderLeftColor: riskColor(row.color) }]}>
                  <Text style={[styles.riskRange, { color: theme.textMuted }]}>{row.range}</Text>
                  <Text style={[styles.riskDesc, { color: theme.secondary }]}>{row.risk}</Text>
                  <Text style={[styles.riskExamples, { color: theme.textMuted }]}>{row.examples}</Text>
                </View>
              ))}
            </View>
          )}

          {/* PDF: Write-up logged readings */}
          {readings.length > 0 && (
            <View style={styles.readingsList}>
              <Text style={styles.subSectionHeader}>{t("activities.soundPollutionHunter.predictionCompare")}</Text>
              {readings.map((r, i) => (
                <View key={i} style={styles.readingCard}>
                  <View style={styles.readingHeader}>
                    <Text style={styles.readingAction}>{r.action}</Text>
                    <Text style={[styles.readingDb, { color: r.db > 85 ? theme.danger : theme.tertiary }]}>{r.db} dB</Text>
                  </View>
                  <Text style={styles.readingLocation}>@{r.location}</Text>
                  {r.prediction && (
                    <Text style={styles.readingPred}>
                      Predicted: {r.prediction} — {r.wasRight ? "✓ Right" : "?"}
                    </Text>
                  )}
                </View>
              ))}
              <View style={{ marginTop: 12 }}>
                <Button text={t("buttons.finishActivity")} action={handleFinish} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    outerContainer: { flex: 1, backgroundColor: colors.backgroundColor },
    container: { padding: 24, flexGrow: 1 },
    head: { fontFamily: "PoppinsBold", fontSize: 22, color: colors.primary, marginBottom: 24 },
    sectionHeader: { fontFamily: "PoppinsRegular", fontSize: 18, color: colors.secondary, marginVertical: 12 },
    subSectionHeader: { fontFamily: "PoppinsRegular", fontSize: 16, color: colors.textMuted, marginTop: 16, marginBottom: 8 },
    dbMeter: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 8 },
    dbValue: { fontSize: 64, fontWeight: "bold", fontFamily: "monospace" },
    dbUnit: { fontSize: 22, color: colors.textMuted, fontWeight: "bold" },
    riskBadge: { textAlign: "center", padding: 6, borderRadius: 20, marginBottom: 16, fontSize: 12, fontWeight: "bold", overflow: "hidden" },
    dropdown: { backgroundColor: colors.surfaceContainer, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor },
    dropdownText: { fontSize: 14 },
    dropdownList: { backgroundColor: colors.surfaceContainer, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor },
    dropdownItem: { paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
    predictionRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
    predBtn: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
    predText: { fontWeight: "bold", fontSize: 14 },
    input: { backgroundColor: colors.surfaceContainer, color: colors.secondary, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor, fontSize: 14 },
    buttonContainer: { marginTop: 12 },
    riskToggle: { marginTop: 20, padding: 10, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.borderColor },
    riskToggleText: { color: colors.primary, fontWeight: "bold", fontSize: 14 },
    riskTable: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 10, marginTop: 8 },
    riskRow: { flexDirection: "row", flexWrap: "wrap", paddingVertical: 6, paddingHorizontal: 8, borderLeftWidth: 3, marginBottom: 4 },
    riskRange: { fontFamily: "InterRegular", fontSize: 12, width: 70 },
    riskDesc: { fontFamily: "InterRegular", fontSize: 12, flex: 1 },
    riskExamples: { fontFamily: "InterRegular", fontSize: 10, width: "100%", marginTop: 2 },
    readingsList: { marginTop: 24 },
    readingCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
    readingHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    readingAction: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
    readingDb: { fontWeight: "bold", fontSize: 16 },
    readingLocation: { fontFamily: "InterRegular", fontSize: 12, color: colors.textMuted, marginTop: 2 },
    readingPred: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 4, fontStyle: "italic" },
  });
  return styles;
};
