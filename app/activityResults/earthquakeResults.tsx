import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { calculateStabilityScore, calculateDampingRatio, getDampingLabel } from "@/utils/physics";
import { saveExperimentLog, saveRating as sqliteSaveRating } from "@/utils/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RATING_KEY = '@stemm_rating_';

const StarRating = ({ rating, onChange }: { rating: number; onChange: (n: number) => void }) => {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Pressable key={n} onPress={() => onChange(n)}>
          <MaterialCommunityIcons name={n <= rating ? 'star' : 'star-outline'} size={36} color={n <= rating ? theme.primary : theme.textMuted} />
        </Pressable>
      ))}
    </View>
  );
};

interface DesignRow {
  index: number | string;
  designName: string;
  folds: number;
  pillars: number;
  peakAccel: number;
  avgMotion: number;
  stability: ReturnType<typeof calculateStabilityScore>;
  dampingRatio: number;
  dampingLabel: string;
  passed: boolean;
}

export default function EarthquakeResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activityContext = use(ActivityContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'earthquake-resistant-structure') || [];
  const [rating, setRating] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(RATING_KEY + 'earthquake-resistant-structure').then(val => { if (val) setRating(parseInt(val, 10)); });
  }, []);

  // Save logs to SQLite on mount
  useEffect(() => {
    if (logs.length === 0) return;
    (async () => {
      try {
        for (const log of logs) {
          await saveExperimentLog('earthquake-resistant-structure', log.data, log.timestamp);
        }
      } catch (e) {
        console.warn('SQLite save failed:', e);
      }
    })();
  }, []);

  // Compute dashboard rows
  const designRows = useMemo<DesignRow[]>(() => {
    return logs.map(log => {
      const d = log.data || {};
      const peakAccel = d.peakAccel || 0;
      const folds = parseInt(d.folds, 10) || 0;
      const pillars = parseInt(d.pillars, 10) || 0;
      const designName = d.designName || '';

      // Average motion from readings history or use observed
      let avgMotion = 0;
      if (d.initialReadings && Array.isArray(d.initialReadings) && d.finalReadings && Array.isArray(d.finalReadings)) {
        const all = [...d.initialReadings, ...d.finalReadings];
        if (all.length > 0) {
          avgMotion = all.reduce((s: number, v: number) => s + v, 0) / all.length;
        }
      } else {
        avgMotion = d.observed ? parseFloat(d.observed) : 0;
      }

      const stability = calculateStabilityScore(peakAccel);
      const initialR: number[] = d.initialReadings || [];
      const finalR: number[] = d.finalReadings || [];
      const dampingRatio = calculateDampingRatio(initialR, finalR);
      const dampingLabel = getDampingLabel(dampingRatio);

      return {
        index: log.timestamp,
        designName,
        folds,
        pillars,
        peakAccel,
        avgMotion,
        stability,
        dampingRatio,
        dampingLabel,
        passed: stability.passed,
      };
    });
  }, [logs]);

  // Ranked by Stability Score descending
  const rankedDesigns = useMemo(() => {
    return [...designRows].sort((a, b) => b.stability.score - a.stability.score);
  }, [designRows]);

  const stabilityColors: Record<string, string> = {
    Excellent: "#22c55e",
    Good: "#3b82f6",
    Fair: "#eab308",
    Poor: "#ef4444",
  };

  const stabilityBgColors: Record<string, string> = {
    Excellent: "#22c55e20",
    Good: "#3b82f620",
    Fair: "#eab30820",
    Poor: "#ef444420",
  };

  const dampingColors: Record<string, string> = {
    Excellent: "#22c55e",
    Good: "#3b82f6",
    Moderate: "#eab308",
    Poor: "#f97316",
    None: "#ef4444",
  };

  const saveRating = useCallback((n: number) => {
    setRating(n);
    AsyncStorage.setItem(RATING_KEY + 'earthquake-resistant-structure', String(n));
    sqliteSaveRating('earthquake-resistant-structure', n).catch(() => {});
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.earthquakeResistantStructure.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

      {logs.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
          <Text style={styles.emptyText}>{t("results.noData")}</Text>
        </View>
      ) : (
        <>
          {/* Engineering Dashboard Table */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Engineering Dashboard</Text>

            {/* Table header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.colDesign]}>Design</Text>
              <Text style={[styles.tableCell, styles.colSmall]}>Folds</Text>
              <Text style={[styles.tableCell, styles.colSmall]}>Pillars</Text>
              <Text style={[styles.tableCell, styles.colWide]}>Max Motion</Text>
              <Text style={[styles.tableCell, styles.colWide]}>Avg Motion</Text>
              <Text style={[styles.tableCell, styles.colWide]}>Stability</Text>
              <Text style={[styles.tableCell, styles.colWide]}>Damping</Text>
              <Text style={[styles.tableCell, styles.colSmall]}>Pass?</Text>
            </View>

            {/* Table rows */}
            {rankedDesigns.map((row) => {
              const stabColor = stabilityColors[row.stability.rating] || theme.textMuted;
              const dampColor = dampingColors[row.dampingLabel] || theme.textMuted;
              const passColor = row.passed ? "#22c55e" : "#ef4444";
              return (
                <View key={row.index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.colDesign]} numberOfLines={1}>{row.designName || '-'}</Text>
                  <Text style={[styles.tableCell, styles.colSmall]}>{row.folds}</Text>
                  <Text style={[styles.tableCell, styles.colSmall]}>{row.pillars}</Text>
                  <Text style={[styles.tableCell, styles.colWide]}>{row.peakAccel.toFixed(2)} g</Text>
                  <Text style={[styles.tableCell, styles.colWide]}>{row.avgMotion.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, styles.colWide, { color: stabColor }]}>{row.stability.score.toFixed(0)}</Text>
                  <Text style={[styles.tableCell, styles.colWide, { color: dampColor }]}>{row.dampingLabel}</Text>
                  <Text style={[styles.tableCell, styles.colSmall, { color: passColor, fontWeight: 'bold' }]}>
                    {row.passed ? '✓' : '✗'}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Stability Score per design with rating badge */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Stability Scores (Ranked)</Text>
            {rankedDesigns.map((row, i) => {
              const stabColor = stabilityColors[row.stability.rating] || theme.textMuted;
              const stabBg = stabilityBgColors[row.stability.rating] || theme.card;
              return (
                <View key={row.index} style={styles.stabilityRow}>
                  <View style={styles.stabilityRank}>
                    <Text style={styles.rankNumber}>#{i + 1}</Text>
                  </View>
                  <View style={styles.stabilityInfo}>
                    <Text style={styles.stabilityName}>{row.designName || `Design ${i + 1}`}</Text>
                    <Text style={styles.stabilityMeta}>{row.folds}f / {row.pillars}p | Peak: {row.peakAccel.toFixed(2)}g</Text>
                  </View>
                  <View style={[styles.stabilityBadge, { backgroundColor: stabBg }]}>
                    <Text style={[styles.stabilityScoreText, { color: stabColor }]}>{row.stability.score.toFixed(0)}</Text>
                    <Text style={[styles.stabilityRatingText, { color: stabColor }]}>{row.stability.rating}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Damping Analysis */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Damping Analysis</Text>
            {rankedDesigns.map((row) => {
              const dampColor = dampingColors[row.dampingLabel] || theme.textMuted;
              return (
                <View key={row.index} style={styles.dampingRow}>
                  <Text style={styles.dampingName}>{row.designName || '-'}</Text>
                  <View style={styles.dampingValueRow}>
                    <Text style={[styles.dampingRatio, { color: dampColor }]}>
                      {row.dampingRatio.toFixed(3)}
                    </Text>
                    <View style={[styles.dampingBadge, { backgroundColor: dampColor + '20' }]}>
                      <Text style={[styles.dampingLabel, { color: dampColor }]}>{row.dampingLabel}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Detailed trial listing */}
          <View style={styles.card}>
            {logs.map((log, i) => {
              const d = log.data || {};
              return (
                <View key={log.timestamp} style={styles.logItem}>
                  <Text style={styles.trialName}>{d.designName || t("results.entryNumber", {number: i + 1})}</Text>
                  <View style={styles.grid}>
                    {d.folds !== undefined && <Text style={styles.detail}>{t("activities.earthquakeResistantStructure.folds")}: {d.folds}</Text>}
                    {d.pillars !== undefined && <Text style={styles.detail}>{t("activities.earthquakeResistantStructure.pillars")}: {d.pillars}</Text>}
                    {d.observed !== undefined && <Text style={styles.detail}>{t("activities.earthquakeResistantStructure.sway")}: {d.observed} cm</Text>}
                    {d.peakAccel !== undefined && <Text style={styles.detail}>{t("activities.earthquakeResistantStructure.peak")}: {d.peakAccel.toFixed(2)} g</Text>}
                    {d.peakX !== undefined && <Text style={styles.detail}>Peak X: {d.peakX.toFixed(2)} g</Text>}
                    {d.peakY !== undefined && <Text style={styles.detail}>Peak Y: {d.peakY.toFixed(2)} g</Text>}
                    {d.peakZ !== undefined && <Text style={styles.detail}>Peak Z: {d.peakZ.toFixed(2)} g</Text>}
                    {d.predictedMovement !== undefined && <Text style={styles.detail}>{t("activities.earthquakeResistantStructure.predicted")}: {d.predictedMovement} cm</Text>}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
            <Text style={styles.theoryText}>{t("results.earthquakeTheory")}</Text>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("results.ratingPrompt")}</Text>
        <StarRating rating={rating} onChange={saveRating} />
        <Text style={styles.ratingHint}>{t("results.ratingHint")}</Text>
      </View>

      <View style={{ marginTop: 16, marginBottom: 40 }}>
        <Button text={t("results.backToActivities")} action={() => router.push("/(tabs)/activities")} />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  scrollContent: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontFamily: "PoppinsBold", color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  card: { backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: colors.borderColor },
  sectionTitle: { fontSize: 14, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 10 },
  emptyState: { alignItems: "center", padding: 30, gap: 8 },
  emptyText: { color: colors.textMuted, fontSize: 16 },
  logItem: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 8, marginBottom: 8 },
  trialName: { fontSize: 13, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  // Dashboard table
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  tableHeader: { borderBottomWidth: 2, borderBottomColor: colors.secondary, marginBottom: 4 },
  tableCell: { fontSize: 10, color: colors.textMuted, fontFamily: "InterRegular" },
  colDesign: { flex: 1.2, minWidth: 0 },
  colSmall: { width: 32, textAlign: "center" },
  colWide: { width: 58, textAlign: "center" },
  // Stability scores
  stabilityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  stabilityRank: { width: 28 },
  rankNumber: { fontSize: 13, fontWeight: "bold", color: colors.textMuted },
  stabilityInfo: { flex: 1 },
  stabilityName: { fontSize: 13, color: colors.secondary, fontFamily: "PoppinsRegular" },
  stabilityMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  stabilityBadge: { alignItems: "center", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, minWidth: 56 },
  stabilityScoreText: { fontSize: 16, fontWeight: "bold", fontFamily: "InterBold" },
  stabilityRatingText: { fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5 },
  // Damping
  dampingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  dampingName: { fontSize: 13, color: colors.secondary, flex: 1, fontFamily: "PoppinsRegular" },
  dampingValueRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dampingRatio: { fontSize: 13, fontWeight: "bold", fontFamily: "InterBold" },
  dampingBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  dampingLabel: { fontSize: 11, fontWeight: "bold" },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
