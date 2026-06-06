import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";

const DESIGN_PRESETS = [
  { key: "activities.earthquakeResistantStructure.designPreset1", folds: 4, pillars: 4 },
  { key: "activities.earthquakeResistantStructure.designPreset2", folds: 10, pillars: 4 },
  { key: "activities.earthquakeResistantStructure.designPreset3", folds: 3, pillars: 6 },
];

export default function EarthquakeAttemptScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const activityContext = useContext(ActivityContext);
  if (!activityContext || !activityContext.activity) {
    console.log("Activity Context Null!");
    return null;
  }

  // PDF: Accelerometer-based tracking
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [peakAccel, setPeakAccel] = useState(0);
  const [liveAccel, setLiveAccel] = useState(0);
  const magnitudeHistory = useRef<number[]>([]);
  const shakeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // PDF: Fold/Pillar configuration
  const [foldCount, setFoldCount] = useState("4");
  const [pillarCount, setPillarCount] = useState("4");
  const [designKey, setDesignKey] = useState("");
  const [designName, setDesignName] = useState("");
  const [predictedMovement, setPredictedMovement] = useState("");
  const [observedCm, setObservedCm] = useState("");

  // PDF: Write-up tracking
  interface EqEntry {
    name: string;
    folds: string;
    pillars: string;
    predicted: string;
    observed: string;
    peakAccel: number;
    wasRight: string;
  }
  const [designs, setDesigns] = useState<EqEntry[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [hasEditedName, setHasEditedName] = useState(false);

  // PDF: Accelerometer subscription
  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    setSubscription(Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      setLiveAccel(magnitude);
      magnitudeHistory.current.push(magnitude);
      if (magnitude > peakAccel) setPeakAccel(magnitude);
    }));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      _unsubscribe();
      if (shakeInterval.current) clearInterval(shakeInterval.current);
    };
  }, []);

  // PDF: Start/stop vibration + accelerometer tracking
  const triggerShake = () => {
    if (recordingState === "recording") {
      _unsubscribe();

      if (shakeInterval.current) {
        clearInterval(shakeInterval.current);
        shakeInterval.current = null;
      }

      setRecordingState("completed");
    } else {
      setPeakAccel(0);
      setLiveAccel(0);
      magnitudeHistory.current = [];

      _subscribe();
      setRecordingState("recording");
    }
  };

  // PDF: Calculate average movement from accelerometer history
  const estimateSway = () => {
    if (magnitudeHistory.current.length === 0) return 0;
    const avg = magnitudeHistory.current.reduce((a, b) => a + b, 0) / magnitudeHistory.current.length;
    // Convert accelerometer units to approximate cm displacement
    return parseFloat(((avg - 1) * 10).toFixed(1));
  };

  const logDesign = () => {
    const obs = parseFloat(observedCm) || 0;
    const pred = parseFloat(predictedMovement) || 0;
    const sway = obs || estimateSway();
    const wasRight = pred > 0 ? (Math.abs(pred - sway) <= 2 ? "Yes" : "No") : "";

    let displayName = designName.trim();

    if (!displayName) {
      if (designKey && !hasEditedName) {
        displayName = t(designKey);
      }
    }
    const newEntry: EqEntry = {
      name: displayName,
      folds: foldCount,
      pillars: pillarCount,
      predicted: predictedMovement,
      observed: String(sway),
      peakAccel,
      wasRight,
    };

    setDesigns(prev => [...prev, newEntry]);

    if (activityContext) {
      activityContext.addExperimentLog({
        activityKey: "earthquake-resistant-structure",
        data: { designName: displayName, folds: foldCount, pillars: pillarCount, predicted: pred, observed: sway, peakAccel }
      });
    }
    setDesignName("");
    setPredictedMovement("");
    setObservedCm("");
    setFoldCount("4");
    setPillarCount("4");
    setPeakAccel(0);
    setRecordingState("idle");
  };

  const handleFinish = () => {
    const results = designs.map(d => ({
      label: `${d.name} (${d.folds}f, ${d.pillars}p)`,
      value: `Sway: ${d.observed}cm | Peak: ${d.peakAccel.toFixed(2)}g ${d.wasRight ? (d.wasRight === "Yes" ? "✓" : "✗") : ""}`
    }));
    router.push({
      pathname: "/activityResults",
      params: { results: JSON.stringify(results), activityKey: "earthquake-resistant-structure" }
    });
  };

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.head}>{t("activities.earthquakeResistantStructure.name")}</Text>
          <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
          {/* PDF: Accelerometer Live Display */}
          <Text style={[styles.actionName, { marginTop: 24 }]}>{t("activities.earthquakeResistantStructure.accelerometerData")}</Text>
          <View style={styles.cardRow}>
            <Card metric="Live" value={liveAccel.toFixed(1)} maximumWidth={false} />
            <Card metric="Peak" value={peakAccel.toFixed(1)} maximumWidth={false} />
          </View>

          {recordingState === "recording" && (
            <Text style={styles.shakingHint}>
              {t("activities.earthquakeResistantStructure.recordingHint")}
            </Text>
          )}

          {/* PDF: Design Configuration */}
          <Text style={[styles.sectionHeader, {
            marginTop: 24,
            paddingBottom: 16
          }]}>New Trial</Text>

          {/* Design Presets */}
          <Pressable style={styles.presetsToggle} onPress={() => setShowPresets(!showPresets)}>
            <Text style={styles.presetsToggleText}>
              {showPresets ? "▼ " : "▶ "}Design Presets
            </Text>
          </Pressable>
          {showPresets && (
            <View style={styles.presetsList}>
              {DESIGN_PRESETS.map((preset, i) => (
                <Pressable
                  key={i}
                  style={styles.presetItem}
                  onPress={() => { setFoldCount(String(preset.folds)); setPillarCount(String(preset.pillars)); setDesignKey(preset.key); setShowPresets(false); setDesignName(t(preset.key)); setHasEditedName(false); }}
                >
                  <Text style={styles.presetName}>{t(preset.key)}</Text>
                  <Text style={styles.presetMeta}>{preset.folds} folds, {preset.pillars} pillars</Text>
                </Pressable>
              ))}
            </View>
          )}

          <TextInput
            style={styles.input}
            value={designName}
            onChangeText={(text) => {
              setDesignName(text);
              setHasEditedName(true);
            }}
            placeholder={t("activities.earthquakeResistantStructure.designNamePlaceholder")}
            placeholderTextColor={theme.textMuted}
          />
          <View style={styles.configRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={foldCount}
              onChangeText={setFoldCount}
              keyboardType="numeric"
              placeholder={t("activities.earthquakeResistantStructure.foldCountPlaceholder")}
              placeholderTextColor={theme.textMuted}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={pillarCount}
              onChangeText={setPillarCount}
              keyboardType="numeric"
              placeholder={t("activities.earthquakeResistantStructure.pillarCountPlaceholder")}
              placeholderTextColor={theme.textMuted}
            />
          </View>

          {/* PDF: Predictions */}
          <TextInput
            style={styles.input}
            value={predictedMovement}
            onChangeText={setPredictedMovement}
            keyboardType="numeric"
            placeholder={t("activities.earthquakeResistantStructure.predictedMovementPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />
          <TextInput
            style={[styles.input, {marginBottom: 0}]}
            value={observedCm}
            onChangeText={setObservedCm}
            keyboardType="numeric"
            placeholder={t("activities.earthquakeResistantStructure.observedSwayPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          <Text style={[styles.sectionHeader, {marginTop: 24, marginBottom: 16}]}>{t("attempt.structuralIterations")}</Text>

          {/* PDF: Design History */}
          {designs.length === 0 ? (
              <Text style={styles.emptyState}>
                  {t("attempt.logTrialPlaceholder")}
              </Text>
          ): (
            <View>
              {designs.map((d, i) => (
                <View key={i} style={styles.designCard}>
                  <View style={styles.designHeader}>
                    <Text style={styles.designName}>{d.name}</Text>
                    <Text style={[styles.designAccel, { color: d.peakAccel > 3 ? theme.danger : theme.tertiary }]}>
                      Peak: {d.peakAccel.toFixed(2)}g
                    </Text>
                  </View>
                  <Text style={styles.designConfig}>{d.folds} {t("activities.earthquakeResistantStructure.folds")}, {d.pillars} {t("activities.earthquakeResistantStructure.pillars")}</Text>
                  <Text style={styles.designResult}>
                    Pred: {d.predicted || "-"}cm | Obs: {d.observed}cm |
                    {d.wasRight ? (d.wasRight === "Yes" ? " ✓ Right" : " ✗ Wrong") : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.buttonContainer}>
            {recordingState != "completed" && (
              <Button
                text={recordingState == "recording" ? t("activities.earthquakeResistantStructure.stopVibration") : t("activities.earthquakeResistantStructure.startVibration")}
                action={triggerShake}
              />
           )}
            {recordingState == "completed" && (
              <Button text="Log Design" action={logDesign} />
            )}
        </View>
        <Pressable
            onPress={handleFinish}
            style={({ pressed }) => pressed && { opacity: 0.7 }}>
            <Text style={styles.skipText}>{t("buttons.finishActivity")}</Text>
        </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

function createStyles(colors: ThemeColors){
  const styles = StyleSheet.create({
    outerContainer: { flex: 1, backgroundColor: colors.backgroundColor },
    container: { padding: 24, flexGrow: 1 },
    head: { fontFamily: "PoppinsBold", fontSize: 22, color: colors.danger, marginBottom: 24 },
    sectionHeader: {
        fontFamily: "PoppinsRegular",
        fontSize: 20,
        color: colors.secondary,
    },
    cardRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
    shakingHint: { fontFamily: "InterRegular", fontSize: 12, color: colors.primary, textAlign: "center", marginTop: 8, fontStyle: "italic" },
    presetsToggle: { padding: 10, backgroundColor: colors.card, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: colors.borderColor },
    presetsToggleText: { color: colors.primary, fontWeight: "bold", fontSize: 14 },
    presetsList: { backgroundColor: colors.card, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: colors.borderColor },
    presetItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
    presetName: { color: colors.secondary, fontWeight: "bold", fontSize: 14 },
    presetMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
    input: { backgroundColor: colors.surfaceContainer, color: colors.secondary, padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: colors.borderColor, fontSize: 14 },
    configRow: { flexDirection: "row", gap: 12 },
    buttonContainer: { marginTop: 32 },
    designCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
    designHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    designName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
    designAccel: { fontWeight: "bold", fontSize: 13 },
    designConfig: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
    designResult: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
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
    actionName: {
        fontFamily: "PoppinsRegular",
        fontSize: 18,
        color: colors.secondary,
        marginVertical: 16
    },
    skipText: {
        textAlign: "center",
        marginTop: 16,
        color: colors.secondary,
        fontFamily: "PoppinsRegular",
        textDecorationLine: "underline",
        fontSize: 16
    },
  });
  return styles;
};