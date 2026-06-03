import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./button";
import Card from "./card";

// PDF: Material stiffness coefficients from the document
const MATERIALS = [
  { name: "Thin printer paper", thickness: "0.1mm", k: 0.05 },
  { name: "Standard card stock", thickness: "0.25mm", k: 0.20 },
  { name: "Thin cardboard", thickness: "0.5mm", k: 0.50 },
  { name: "Corrugated cardboard", thickness: "3mm", k: 2.5 },
];

// PDF: Distance options
const DISTANCES = [15, 30, 45];

export default function FanAttemptScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const activityContext = useContext(ActivityContext);
  if (!activityContext || !activityContext.activity) return null;

  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);

  // PDF: New state for full feature set
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [selectedDistance, setSelectedDistance] = useState(30);
  const [targetType, setTargetType] = useState<"paper" | "cardboard">("paper");
  const [fanDesignName, setFanDesignName] = useState("");
  const [predictedAngle, setPredictedAngle] = useState("");
  const [angle, setAngle] = useState("");
  const [trials, setTrials] = useState<{
    name: string;
    material: string;
    targetType: string;
    distance: number;
    predictedAngle: string;
    observedAngle: number;
    force: number;
    wasRight: string;
  }[]>([]);

  const [showMaterials, setShowMaterials] = useState(false);
  const [showDistances, setShowDistances] = useState(false);

  // PDF: Force calculation F ≈ k × θ
  const kValue = selectedMaterial.k;
  const theta = (parseFloat(angle) || 0) * (Math.PI / 180);
  const force = kValue * theta;

  const logTrial = () => {
    const ang = parseFloat(angle) || 0;
    if (ang === 0 || !fanDesignName.trim()) return;
    const predAng = parseFloat(predictedAngle) || 0;
    const wasRight = predAng > 0 ? (Math.abs(predAng - ang) <= 10 ? "Yes" : "No") : "";
    setTrials(prev => [...prev, {
      name: fanDesignName.trim(),
      material: selectedMaterial.name,
      targetType: targetType,
      distance: selectedDistance,
      predictedAngle: predictedAngle,
      observedAngle: ang,
      force,
      wasRight,
    }]);
    if (activityContext) {
      activityContext.addExperimentLog({
        activityKey: "hand-fan-challenge",
        data: { design: fanDesignName, material: selectedMaterial.name, targetType, distance: selectedDistance, angle: ang, force, k: kValue }
      });
    }
    setFanDesignName("");
    setAngle("");
    setPredictedAngle("");
  };

  const handleFinish = () => {
    const results = trials.map(t => ({
      label: `${t.name} (${t.distance}cm)`,
      value: `${t.observedAngle}° | ${t.force.toFixed(3)}N ${t.wasRight ? (t.wasRight === "Yes" ? "✓" : "✗") : ""}`
    }));
    router.push({
      pathname: "/activityResults",
      params: { results: JSON.stringify(results), activityKey: "hand-fan-challenge" }
    });
  };

  if (!permission) return null;

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.head}>{t("activities.handFanChallenge.name")}</Text>

          {/* Camera */}
          <Pressable style={styles.cameraToggle} onPress={() => setIsCameraActive(!isCameraActive)}>
            <Text style={styles.cameraToggleText}>{isCameraActive ? t("buttons.closeCamera") : t("buttons.openCamera")}</Text>
          </Pressable>
          {isCameraActive && (
            <View style={styles.cameraBox}>
              <CameraView style={{ flex: 1 }} facing="back" />
            </View>
          )}

          <Text style={styles.sectionHeader}>{t("activities.attempt")}</Text>

          {/* PDF: Fan Design Name */}
          <TextInput
            style={styles.input}
            value={fanDesignName}
            onChangeText={setFanDesignName}
            placeholder={t("activities.handFanChallenge.fanDesignPlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          {/* PDF: Target Material selector */}
          <Text style={styles.subSectionHeader}>{t("activities.handFanChallenge.selectMaterial")} (k={kValue})</Text>
          <Pressable style={styles.dropdown} onPress={() => setShowMaterials(!showMaterials)}>
            <Text style={[styles.dropdownText, { color: theme.secondary }]}>{selectedMaterial.name}</Text>
          </Pressable>
          {showMaterials && (
            <View style={styles.dropdownList}>
              {MATERIALS.map((mat, i) => (
                <Pressable key={i} style={styles.dropdownItem} onPress={() => { setSelectedMaterial(mat); setShowMaterials(false); }}>
                  <Text style={{ color: theme.secondary, padding: 8 }}>{mat.name} (k={mat.k})</Text>
                  <Text style={{ color: theme.textMuted, paddingHorizontal: 8, paddingBottom: 8, fontSize: 12 }}>Thickness: {mat.thickness}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* PDF: Target type toggle */}
          <Text style={styles.subSectionHeader}>{t("activities.handFanChallenge.targetToggle")}</Text>
          <View style={styles.targetRow}>
            <Pressable
              style={[styles.targetBtn, { backgroundColor: targetType === "paper" ? theme.primary : theme.surfaceContainer }]}
              onPress={() => setTargetType("paper")}
            >
              <Text style={[styles.targetText, { color: targetType === "paper" ? theme.buttonText : theme.textMuted }]}>
                {t("activities.handFanChallenge.paper")}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.targetBtn, { backgroundColor: targetType === "cardboard" ? theme.primary : theme.surfaceContainer }]}
              onPress={() => setTargetType("cardboard")}
            >
              <Text style={[styles.targetText, { color: targetType === "cardboard" ? theme.buttonText : theme.textMuted }]}>
                {t("activities.handFanChallenge.cardboard")}
              </Text>
            </Pressable>
          </View>

          {/* PDF: Distance presets */}
          <Text style={styles.subSectionHeader}>{t("activities.handFanChallenge.selectDistance")}</Text>
          <View style={styles.distanceRow}>
            {DISTANCES.map((d) => (
              <Pressable
                key={d}
                style={[styles.distanceBtn, { backgroundColor: selectedDistance === d ? theme.primary : theme.surfaceContainer }]}
                onPress={() => setSelectedDistance(d)}
              >
                <Text style={[styles.distanceText, { color: selectedDistance === d ? theme.buttonText : theme.textMuted }]}>
                  {d} cm
                </Text>
              </Pressable>
            ))}
          </View>

          {/* PDF: Prediction input */}
          <Text style={styles.subSectionHeader}>{t("activities.handFanChallenge.predictionAngle")}</Text>
          <TextInput
            style={styles.input}
            value={predictedAngle}
            onChangeText={setPredictedAngle}
            keyboardType="numeric"
            placeholder={t("activities.handFanChallenge.predictionAnglePlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          {/* PDF: Observed angle */}
          <TextInput
            style={styles.input}
            value={angle}
            onChangeText={setAngle}
            keyboardType="numeric"
            placeholder={t("activities.handFanChallenge.anglePlaceholder")}
            placeholderTextColor={theme.textMuted}
          />

          {/* Live calculation */}
          <View style={styles.cardRow}>
            <Card metric="Angle (rad)" value={theta.toFixed(3)} maximumWidth={false} />
            <Card metric={t("activities.handFanChallenge.forceResult")} value={`${force.toFixed(3)} N`} maximumWidth={false} />
          </View>
          <Text style={styles.stiffnessNote}>{t("activities.handFanChallenge.stiffnessNote")}</Text>

          <View style={styles.buttonContainer}>
            <Button text={t("buttons.logTrial")} action={logTrial} />
          </View>

          {/* PDF: Write-up logged trials */}
          {trials.length > 0 && (
            <View style={styles.trialsList}>
              <Text style={styles.sectionHeader}>{t("activities.parachuteDropChallenge.writeUpPrediction")}</Text>
              {trials.map((t, i) => (
                <View key={i} style={styles.trialCard}>
                  <View style={styles.trialHeader}>
                    <Text style={styles.trialName}>{t.name}</Text>
                    <Text style={styles.trialForce}>{t.force.toFixed(3)}N</Text>
                  </View>
                  <Text style={styles.trialMeta}>{t.targetType} @ {t.distance}cm | {t.material}</Text>
                  <Text style={styles.trialMeta}>
                    Observed: {t.observedAngle}° |
                    Pred: {t.predictedAngle || "-"}° |
                    {t.wasRight ? (t.wasRight === "Yes" ? " ✓ Right" : " ✗ Wrong") : ""}
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
    head: { fontFamily: "PoppinsBold", fontSize: 22, color: colors.primary, marginBottom: 24 },
    sectionHeader: { fontFamily: "PoppinsRegular", fontSize: 18, color: colors.secondary, marginVertical: 12 },
    subSectionHeader: { fontFamily: "PoppinsRegular", fontSize: 16, color: colors.textMuted, marginTop: 16, marginBottom: 8 },
    cameraToggle: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: "center" },
    cameraToggleText: { color: colors.primary, fontWeight: "bold", fontSize: 14 },
    cameraBox: { height: 200, borderRadius: 10, overflow: "hidden", marginBottom: 12 },
    input: { backgroundColor: colors.surfaceContainer, color: colors.secondary, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor, fontSize: 14 },
    dropdown: { backgroundColor: colors.card, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor },
    dropdownText: { fontSize: 14, fontWeight: "bold" },
    dropdownList: { backgroundColor: colors.card, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.borderColor },
    dropdownItem: { borderBottomWidth: 1, borderBottomColor: colors.borderColor },
    targetRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
    targetBtn: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
    targetText: { fontWeight: "bold", fontSize: 14 },
    distanceRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
    distanceBtn: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
    distanceText: { fontWeight: "bold", fontSize: 14 },
    cardRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
    stiffnessNote: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, fontStyle: "italic", marginBottom: 8 },
    buttonContainer: { marginTop: 12 },
    trialsList: { marginTop: 24 },
    trialCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.borderColor },
    trialHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    trialName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
    trialForce: { fontWeight: "bold", fontSize: 14, color: colors.primary },
    trialMeta: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted, marginTop: 2 },
  });
  return styles;
};
