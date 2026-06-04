import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from "expo-router";
import React, { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";

// G-Force risk assessment from PDF
const GFORCE_RISK = [
  { range: "1-5 g", examples: "Standing up quickly, elevators", risk: "No injury", colorClass: "tertiary" },
  { range: "5-10 g", examples: "Hard falls while running", risk: "Possible bruising", colorClass: "tertiary" },
  { range: "10-30 g", examples: "Sports collisions, car braking", risk: "Serious injuries possible", colorClass: "danger" },
  { range: "30-50 g", examples: "Severe car crashes", risk: "High risk of severe injury", colorClass: "danger" },
  { range: "50+ g", examples: "Very sudden stops", risk: "Life-threatening", colorClass: "danger" },
];

export default function ParachuteAttemptScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const activityContext = use(ActivityContext);
  if (!activityContext || !activityContext.activity) return null;

  const [permission, requestPermission] = useCameraPermissions();
  const [dropHeight, setDropHeight] = useState("1.5");
  const [toyMass, setToyMass] = useState("0.15");
  const [timeValue, setTimeValue] = useState(0.0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  // PDF: New inputs for g-force and write-up
  const [contactTime, setContactTime] = useState("");
  const [didBounce, setDidBounce] = useState(false);
  const [surfaceArea, setSurfaceArea] = useState("");
  const [predictedTime, setPredictedTime] = useState("");
  const [easiestDesign, setEasiestDesign] = useState("");

  // PDF: Write-up tracking
  interface ParachuteWriteUpEntry {
    trialNumber: string;
    surfaceArea: string;
    predictedTime: string;
    recordedTime: string;
    wasRight: string;
    contactTime: string;
    didBounce: boolean;
    gForce: number;
  }
  const [writeUpEntries, setWriteUpEntries] = useState<ParachuteWriteUpEntry[]>([]);

  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      startRef.current = Date.now() - (timeValue * 1000);
      intervalRef.current = setInterval(() => {
        setTimeValue((Date.now() - startRef.current) / 1000);
      }, 30);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(prev => !prev);
  const resetTimer = () => { setIsTimerRunning(false); setTimeValue(0); };

  const height = parseFloat(dropHeight) || 1.5;
  const mass = parseFloat(toyMass) || 0.15;

  // Physics calculations from PDF
  const vFinal = timeValue > 0 ? height / timeValue : 0;           // Step 3: Final velocity
  const accel = timeValue > 0 ? vFinal / timeValue : 0;            // Step 4: Acceleration
  const weight = mass * 9.8;                                        // Step 6: Weight (downward force)
  const netForce = mass * accel;                                    // Net force (F = ma)
  const dragForce = Math.max(0, weight - netForce);                 // Step 6: Drag force

  // PDF G-Force Calculation
  const ct = parseFloat(contactTime) || 0;
  let gForce = 0;
  if (vFinal > 0 && ct > 0) {
    // PDF Formula: Case 1 - No bounce: Δv = v, g-force = (Δv / t) / 9.8
    if (!didBounce) {
      const deltaV = vFinal;
      gForce = (deltaV / ct) / 9.8;
    } else {
      // PDF Formula: Case 2 - Bounce: Δv = v + v_rebound
      // Use time to max height after bounce to find rebound velocity
      // For simplicity, estimate rebound as 0.7 * impact speed
      const reboundVelocity = vFinal * 0.7;
      const deltaV = vFinal + reboundVelocity;
      gForce = (deltaV / ct) / 9.8;
    }
  }

  // G-Force risk level
  const getGForceRisk = () => {
    if (gForce <= 5) return GFORCE_RISK[0];
    if (gForce <= 10) return GFORCE_RISK[1];
    if (gForce <= 30) return GFORCE_RISK[2];
    if (gForce <= 50) return GFORCE_RISK[3];
    return GFORCE_RISK[4];
  };
  const gForceRisk = getGForceRisk();

  // Trial name based on count (from PDF write-up table)
  const getTrialName = (count: number) => {
    if (count === 0) return t("activities.parachuteDropChallenge.baselineLabel");
    return `${t("activities.parachuteDropChallenge.prototype")} ${count}`;
  };

  const logExperiment = () => {
    const newCount = trialCount + 1;
    setTrialCount(newCount);
    const entry: ParachuteWriteUpEntry = {
      trialNumber: getTrialName(trialCount),
      surfaceArea: surfaceArea || "0",
      predictedTime: predictedTime || "0",
      recordedTime: timeValue.toFixed(2),
      wasRight: predictedTime ? (Math.abs(parseFloat(predictedTime) - timeValue) < 0.2 ? "Yes" : "No") : "",
      contactTime: contactTime || "0",
      didBounce,
      gForce,
    };
    setWriteUpEntries(prev => [...prev, entry]);

    if (activityContext) {
      activityContext.addExperimentLog({
        activityKey: "parachute-drop-challenge",
        data: { vFinal, accel, weight, netForce, dragForce, gForce, time: timeValue, dropHeight: height, toyMass: mass, surfaceArea, contactTime, didBounce, trialName: getTrialName(trialCount) }
      });
    }
    resetTimer();
    setPredictedTime("");
    setContactTime("");
    setDidBounce(false);
    setSurfaceArea("");
  };

  const handleFinish = () => {
    // Include write-up entries in results
    const allResults = [
      ...writeUpEntries.map(e => ({ label: `${e.trialNumber} — Time`, value: `${e.recordedTime}s` })),
      ...writeUpEntries.filter(e => e.gForce > 0).map(e => ({ label: `${e.trialNumber} — G-Force`, value: `${e.gForce.toFixed(1)} g` })),
    ];
    if (easiestDesign) {
      allResults.push({ label: "Easiest Design", value: easiestDesign });
    }
    router.push({
      pathname: "/activityResults",
      params: { results: JSON.stringify(allResults), activityKey: "parachute-drop-challenge" }
    });
  };

  if (!permission) return null;

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.head}>{t("activities.parachuteDropChallenge.name")}</Text>

          {/* Camera Toggle */}
          <Pressable style={styles.cameraToggle} onPress={() => setIsCameraActive(!isCameraActive)}>
            <Text style={styles.cameraToggleText}>
              {isCameraActive ? t("buttons.closeCamera") : t("buttons.openCamera")}
            </Text>
          </Pressable>
          {isCameraActive && (
            <View style={styles.cameraBox}>
              <CameraView style={{ flex: 1 }} facing="back" />
            </View>
          )}

          {/* Timer Section */}
          <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>
          <View style={styles.cardRow}>
            <Card metric="Time" value={`${timeValue.toFixed(2)}s`} maximumWidth={false} />
            <Card metric="Trials" value={String(writeUpEntries.length)} maximumWidth={false} />
          </View>

          <View style={styles.timerRow}>
            <Pressable style={[styles.timerBtn, { backgroundColor: theme.surfaceContainer }]} onPress={resetTimer}>
              <Text style={[styles.timerBtnText, { color: theme.textMuted }]}>RESET</Text>
            </Pressable>
            <Pressable style={[styles.timerBtn, { flex: 2, backgroundColor: isTimerRunning ? theme.danger : theme.primary }]} onPress={toggleTimer}>
              <Text style={styles.timerBtnText}>{isTimerRunning ? t("buttons.stop") : t("buttons.start")}</Text>
            </Pressable>
          </View>

          {/* PDF: Parameters */}
          <Text style={styles.sectionHeader}>{t("activities.parachuteDropChallenge.parameters")}</Text>
          <TextInput style={styles.input} value={dropHeight} onChangeText={setDropHeight} keyboardType="numeric" placeholder={t("activities.parachuteDropChallenge.dropHeightPlaceholder")} placeholderTextColor={theme.textMuted} />
          <TextInput style={styles.input} value={toyMass} onChangeText={setToyMass} keyboardType="numeric" placeholder={t("activities.parachuteDropChallenge.toyMassPlaceholder")} placeholderTextColor={theme.textMuted} />
          <TextInput style={styles.input} value={surfaceArea} onChangeText={setSurfaceArea} keyboardType="numeric" placeholder={t("activities.parachuteDropChallenge.surfaceAreaPlaceholder")} placeholderTextColor={theme.textMuted} />

          {/* PDF: Physics Analytics */}
          <Text style={styles.sectionHeader}>{t("activities.parachuteDropChallenge.analytics")}</Text>
          <View style={styles.analyticsGrid}>
            <Card metric="Velocity" value={`${vFinal.toFixed(2)} m/s`} maximumWidth={false} />
            <Card metric="Accel" value={`${accel.toFixed(2)} m/s²`} maximumWidth={false} />
            <Card metric="Weight" value={`${weight.toFixed(2)} N`} maximumWidth={false} />
            <Card metric="Drag" value={`${dragForce.toFixed(2)} N`} maximumWidth={false} />
          </View>

          {/* PDF: G-Force Analysis Section */}
          <Text style={styles.sectionHeader}>{t("activities.parachuteDropChallenge.gForce")}</Text>
          <Text style={styles.gForceTip}>{t("activities.parachuteDropChallenge.gForceTip")}</Text>

          <TextInput
            style={styles.input}
            value={contactTime}
            onChangeText={setContactTime}
            keyboardType="numeric"
            placeholder={t("activities.parachuteDropChallenge.contactTimePlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          <Pressable
            style={[styles.bounceToggle, { backgroundColor: didBounce ? theme.primary : theme.surfaceContainer }]}
            onPress={() => setDidBounce(!didBounce)}
          >
            <Text style={[styles.toggleText, { color: didBounce ? theme.buttonText : theme.secondary }]}>
              {didBounce ? "✓ " : ""}{t("activities.parachuteDropChallenge.didBounce")}
            </Text>
          </Pressable>

          {ct > 0 && vFinal > 0 && (
            <View style={styles.gForceDisplay}>
              <Card metric={t("activities.parachuteDropChallenge.gForceResult")} value={`${gForce.toFixed(1)} g`} maximumWidth={true} />
              <Card metric={t("activities.parachuteDropChallenge.gForceRisk")} value={gForceRisk.risk} maximumWidth={true} />
            </View>
          )}

          {/* PDF: G-Force Risk Scale */}
          <Text style={styles.subSectionHeader}>{t("activities.parachuteDropChallenge.gForceRiskScale")}</Text>
          <View style={styles.riskScale}>
            {GFORCE_RISK.map((item, i) => (
              <View key={i} style={[styles.riskRow, { borderLeftColor: item.colorClass === "tertiary" ? theme.tertiary : theme.danger }]}>
                <Text style={[styles.riskRange, { color: theme.textMuted }]}>{item.range}</Text>
                <Text style={[styles.riskDesc, { color: theme.secondary }]}>{item.risk}</Text>
              </View>
            ))}
          </View>

          {/* PDF: Write-up Prediction Section */}
          <Text style={styles.sectionHeader}>{t("activities.parachuteDropChallenge.writeUpPrediction")}</Text>
          <TextInput
            style={styles.input}
            value={predictedTime}
            onChangeText={setPredictedTime}
            keyboardType="numeric"
            placeholder={t("activities.parachuteDropChallenge.predictTimePlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          {/* Logged entries display - PDF write-up table */}
          {writeUpEntries.length > 0 && (
            <View style={styles.writeUpTable}>
              <Text style={styles.tableTitle}>{t("journal.recordedTrials")}</Text>
              {writeUpEntries.map((entry, i) => (
                <View key={i} style={styles.writeUpRow}>
                  <Text style={styles.trialName}>{entry.trialNumber}</Text>
                  <View style={styles.trialData}>
                    {entry.surfaceArea !== "0" && <Text style={styles.trialDetail}>SA: {entry.surfaceArea}cm²</Text>}
                    <Text style={styles.trialDetail}>Time: {entry.recordedTime}s</Text>
                    {entry.predictedTime !== "0" && <Text style={styles.trialDetail}>Pred: {entry.predictedTime}s</Text>}
                    <Text style={[styles.trialDetail, { color: entry.wasRight === "Yes" ? theme.tertiary : theme.danger }]}>
                      {entry.wasRight ? (entry.wasRight === "Yes" ? "✓ Right" : "✗ Wrong") : ""}
                    </Text>
                    {entry.gForce > 0 && <Text style={styles.trialDetail}>G: {entry.gForce.toFixed(1)}g</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* PDF: Write-up reflection */}
          <Text style={styles.subSectionHeader}>{t("activities.parachuteDropChallenge.writeUpPrediction")}</Text>
          <TextInput
            style={styles.input}
            value={easiestDesign}
            onChangeText={setEasiestDesign}
            placeholder={t("activities.parachuteDropChallenge.easiestDesignPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          <View style={styles.buttonContainer}>
            <Button text={t("buttons.logTrial")} action={logExperiment} />
            {writeUpEntries.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Button text={t("buttons.finishActivity")} action={handleFinish} />
              </View>
            )}
          </View>
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
    cameraToggle: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: "center" },
    cameraToggleText: { color: colors.primary, fontWeight: "bold", fontSize: 14 },
    cameraBox: { height: 200, borderRadius: 10, overflow: "hidden", marginBottom: 12 },
    cardRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
    timerRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    timerBtn: { flex: 1, padding: 16, borderRadius: 8, alignItems: "center" },
    timerBtnText: { color: colors.buttonText, fontWeight: "bold", fontSize: 15 },
    input: { backgroundColor: colors.surfaceContainer, color: colors.secondary, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor, fontSize: 14 },
    analyticsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    gForceTip: { fontFamily: "InterRegular", fontSize: 12, color: colors.primary, marginBottom: 8, fontStyle: "italic" },
    bounceToggle: { padding: 14, borderRadius: 8, marginBottom: 10, alignItems: "center" },
    toggleText: { fontWeight: "bold", fontSize: 14 },
    gForceDisplay: { gap: 8, marginBottom: 12 },
    riskScale: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 10, marginBottom: 16 },
    riskRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 8, borderLeftWidth: 3, marginBottom: 4 },
    riskRange: { fontFamily: "InterRegular", fontSize: 12, width: 70 },
    riskDesc: { fontFamily: "InterRegular", fontSize: 12, flex: 1 },
    writeUpTable: { backgroundColor: colors.card, padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: colors.borderColor },
    tableTitle: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.primary, marginBottom: 8 },
    writeUpRow: { backgroundColor: colors.surfaceContainer, padding: 10, borderRadius: 8, marginBottom: 6 },
    trialName: { fontFamily: "PoppinsRegular", fontSize: 13, color: colors.secondary, marginBottom: 4 },
    trialData: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    trialDetail: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted },
    buttonContainer: { marginTop: 32 },
  });
  return styles;
};
