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
  { name: "4 folds + 4 pillars", folds: 4, pillars: 4 },
  { name: "10 folds + 4 pillars", folds: 10, pillars: 4 },
  { name: "3 folds + 6 pillars", folds: 3, pillars: 6 },
];

export default function EarthquakeAttemptScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const activityContext = useContext(ActivityContext);
  if (!activityContext || !activityContext.activity) return null;

  // PDF: Accelerometer-based tracking
  const [isShaking, setIsShaking] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [peakAccel, setPeakAccel] = useState(0);
  const [liveAccel, setLiveAccel] = useState(0);
  const magnitudeHistory = useRef<number[]>([]);
  const shakeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // PDF: Fold/Pillar configuration
  const [foldCount, setFoldCount] = useState("4");
  const [pillarCount, setPillarCount] = useState("4");
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
    if (isShaking) {
      // Stop vibration simulation - tracking continues until user stops
      setIsShaking(false);
      _unsubscribe();
      if (shakeInterval.current) clearInterval(shakeInterval.current);
      shakeInterval.current = null;
    } else {
      setIsShaking(true);
      setPeakAccel(0);
      magnitudeHistory.current = [];
      _subscribe();
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
    const name = designName.trim() || `Design ${designs.length + 1}`;
    const sway = obs || estimateSway();
    const wasRight = pred > 0 ? (Math.abs(pred - sway) <= 2 ? "Yes" : "No") : "";

    setDesigns(prev => [...prev, {
      name,
      folds: foldCount,
      pillars: pillarCount,
      predicted: predictedMovement,
      observed: String(sway),
      peakAccel,
      wasRight,
    }]);

    if (activityContext) {
      activityContext.addExperimentLog({
        activityKey: "earthquake-resistant-structure",
        data: { name, folds: foldCount, pillars: pillarCount, predicted: pred, observed: sway, peakAccel }
      });
    }
    setDesignName("");
    setPredictedMovement("");
    setObservedCm("");
    setFoldCount("4");
    setPillarCount("4");
    setPeakAccel(0);
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

          {/* PDF: Accelerometer Live Display */}
          <Text style={styles.sectionHeader}>{t("activities.earthquakeResistantStructure.accelerometerData")}</Text>
          <View style={styles.cardRow}>
            <Card metric="Live" value={liveAccel.toFixed(2)} maximumWidth={false} />
            <Card metric="Peak" value={peakAccel.toFixed(2)} maximumWidth={false} />
          </View>

          {/* PDF: Vibration control */}
          <Button
            text={isShaking ? t("activities.earthquakeResistantStructure.stopVibration") : t("activities.earthquakeResistantStructure.startVibration")}
            action={triggerShake}
          />
          {isShaking && (
            <Text style={styles.shakingHint}>Place phone on structure and shake the table</Text>
          )}

          {/* PDF: Design Configuration */}
          <Text style={styles.sectionHeader}>New Trial</Text>

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
                  onPress={() => { setFoldCount(String(preset.folds)); setPillarCount(String(preset.pillars)); setDesignName(preset.name); setShowPresets(false); }}
                >
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetMeta}>{preset.folds} folds, {preset.pillars} pillars</Text>
                </Pressable>
              ))}
            </View>
          )}

          <TextInput
            style={styles.input}
            value={designName}
            onChangeText={setDesignName}
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
            style={styles.input}
            value={observedCm}
            onChangeText={setObservedCm}
            keyboardType="numeric"
            placeholder={t("activities.earthquakeResistantStructure.observedSwayPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          <View style={styles.buttonContainer}>
            <Button text={t("buttons.logDesign")} action={logDesign} />
          </View>

          {/* PDF: Design History */}
          {designs.length > 0 && (
            <View style={styles.designsList}>
              <Text style={styles.sectionHeader}>Structural Iterations</Text>
              {designs.map((d, i) => (
                <View key={i} style={styles.designCard}>
                  <View style={styles.designHeader}>
                    <Text style={styles.designName}>{d.name}</Text>
                    <Text style={[styles.designAccel, { color: d.peakAccel > 3 ? theme.danger : theme.tertiary }]}>
                      Peak: {d.peakAccel.toFixed(2)}g
                    </Text>
                  </View>
                  <Text style={styles.designConfig}>{d.folds} folds, {d.pillars} pillars</Text>
                  <Text style={styles.designResult}>
                    Pred: {d.predicted || "-"}cm | Obs: {d.observed}cm |
                    {d.wasRight ? (d.wasRight === "Yes" ? " ✓ Right" : " ✗ Wrong") : ""}
                  </Text>
                </View>
              ))}
              <View style={{ marginTop: 16 }}>
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
    head: { fontFamily: "PoppinsBold", fontSize: 22, color: colors.danger, marginBottom: 24 },
    sectionHeader: { fontFamily: "PoppinsRegular", fontSize: 18, color: colors.secondary, marginVertical: 12 },
    cardRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
    shakingHint: { fontFamily: "InterRegular", fontSize: 12, color: colors.primary, textAlign: "center", marginTop: 8, fontStyle: "italic" },
    presetsToggle: { padding: 10, backgroundColor: colors.card, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
    presetsToggleText: { color: colors.primary, fontWeight: "bold", fontSize: 14 },
    presetsList: { backgroundColor: colors.card, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor },
    presetItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
    presetName: { color: colors.secondary, fontWeight: "bold", fontSize: 14 },
    presetMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
    input: { backgroundColor: colors.surfaceContainer, color: colors.textPrimary, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor, fontSize: 14 },
    configRow: { flexDirection: "row", gap: 12 },
    buttonContainer: { marginTop: 12 },
    designsList: { marginTop: 24 },
    designCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
    designHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    designName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
    designAccel: { fontWeight: "bold", fontSize: 13 },
    designConfig: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
    designResult: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
  });
  return styles;
};
