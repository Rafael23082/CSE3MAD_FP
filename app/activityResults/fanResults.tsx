import { BarChart } from "@/components/barChart";
import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useSubmitActivity } from "@/hooks/useSubmissions";
import { degreesToRadians, calculateFanForce, getFlexibilityLabel } from "@/utils/physics";
import { saveExperimentLog, saveRating as sqliteSaveRating } from "@/utils/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, use, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function FanResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activityContext = use(ActivityContext);
  const auth = use(AuthContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'hand-fan-challenge') || [];
  const [rating, setRating] = useState(0);
  const [submitDone, setSubmitDone] = useState(false);
  const submitMutation = useSubmitActivity();

  useEffect(() => {
    AsyncStorage.getItem(RATING_KEY + 'hand-fan-challenge').then(val => { if (val) setRating(parseInt(val, 10)); });
  }, []);

  // Save logs to SQLite on mount
  useEffect(() => {
    if (logs.length === 0) return;
    (async () => {
      try {
        for (const log of logs) {
          await saveExperimentLog('hand-fan-challenge', log.data, log.timestamp);
        }
      } catch (e) {
        console.warn('SQLite save failed:', e);
      }
    })();
  }, []);

  const chartData = useMemo(() => {
    return logs.map((log, i) => {
      const d = log.data || {};
      const angle = d.angle || 0;
      const radians = degreesToRadians(angle);
      return {
        design: d.design || `Trial ${i + 1}`,
        degrees: parseFloat(angle.toFixed(1)),
        radians: parseFloat(radians.toFixed(3)),
      };
    });
  }, [logs]);

  const designForces = useMemo(() => {
    return logs.map((log, i) => {
      const d = log.data || {};
      const angle = d.angle || 0;
      const radians = degreesToRadians(angle);
      const k = d.k || 0;
      const force = calculateFanForce(k, angle);
      const flex = getFlexibilityLabel(k);
      return {
        name: d.design || `Trial ${i + 1}`,
        material: d.material || '-',
        angle,
        force,
        k,
        flex,
        index: log.timestamp,
      };
    });
  }, [logs]);

  const winner = useMemo(() => {
    if (designForces.length === 0) return null;
    return [...designForces].sort((a, b) => a.force - b.force)[0];
  }, [designForces]);

  const uniqueMaterials = useMemo(() => {
    const map = new Map<string, number>();
    designForces.forEach(d => {
      if (d.material && !map.has(d.material)) {
        map.set(d.material, d.k);
      }
    });
    return Array.from(map.entries());
  }, [designForces]);

  const flexColors: Record<string, string> = {
    High: "#22c55e",
    Medium: "#eab308",
    Low: "#ef4444",
  };

  const handleSubmitToLeaderboard = () => {
    if (submitDone) return;
    if (!auth?.user || !auth?.team) {
      Alert.alert(t('results.notSignedIn'), t('results.notSignedInMessage'));
      return;
    }
    submitMutation.mutate(
      {
        userId: auth.user.uid,
        teamId: auth.team.teamId,
        activityKey: 'hand-fan-challenge',
        logs,
        reflection: '',
        submittedAt: new Date(),
        rating: rating || undefined,
      },
      {
        onSuccess: () => {
          setSubmitDone(true);
          Alert.alert(t('results.submittedTitle'), t('results.submittedMessage'));
        },
        onError: (err) => {
          Alert.alert(t('results.submitFailed'), String(err));
        },
      },
    );
  };

  const saveRating = useCallback((n: number) => {
    setRating(n);
    AsyncStorage.setItem(RATING_KEY + 'hand-fan-challenge', String(n));
    sqliteSaveRating('hand-fan-challenge', n).catch(() => {});
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.handFanChallenge.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
            <Text style={styles.emptyText}>{t("results.noData")}</Text>
          </View>
        ) : (
          <>
            {/* Bar Chart: Design vs Bend Angle */}
            {chartData.length > 1 && (
              <BarChart
                title="Bend Angle by Design"
                data={chartData}
                xKey="design"
                yKeys={["degrees"]}
                color="#22d3ee"
                yLabel="Degrees (°)"
              />
            )}

            {/* Most Airflow Generated Winner */}
            {winner && (
              <View style={[styles.winnerCard, { borderLeftWidth: 4, borderLeftColor: "#22c55e" }]}>
                <MaterialCommunityIcons name="trophy" size={24} color="#eab308" />
                <Text style={styles.winnerTitle}>Most Airflow Generated</Text>
                <Text style={styles.winnerName}>{winner.name}</Text>
                <Text style={styles.winnerDetail}>Force: {winner.force.toFixed(3)} N at {winner.angle}°</Text>
                <Text style={styles.winnerDetail}>Smallest force = most airflow</Text>
              </View>
            )}

            {/* Log listing with Flexibility labels */}
            <View style={styles.card}>
              {designForces.map((d) => {
                const flexColor = flexColors[d.flex] || theme.textMuted;
                return (
                  <View key={d.index} style={styles.logItem}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={styles.trialName}>{d.name}</Text>
                      <View style={[styles.flexBadge, { backgroundColor: flexColor + "20" }]}>
                        <Text style={[styles.flexText, { color: flexColor }]}>{d.flex}</Text>
                      </View>
                    </View>
                    <Text style={styles.detail}>Material: {d.material}</Text>
                    <Text style={styles.detail}>Angle: {d.angle}° | Force: {d.force.toFixed(3)} N | k: {d.k}</Text>
                  </View>
                );
              })}
            </View>

            {/* Material Stiffness Comparison Table */}
            {uniqueMaterials.length > 1 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Material Stiffness Comparison</Text>
                {uniqueMaterials.map(([name, k]) => {
                  const flex = getFlexibilityLabel(k);
                  const flexColor = flexColors[flex] || theme.textMuted;
                  return (
                    <View key={name} style={styles.materialRow}>
                      <Text style={styles.materialName}>{name}</Text>
                      <Text style={styles.materialK}>k = {k}</Text>
                      <Text style={[styles.materialFlex, { color: flexColor }]}>{flex}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
          <Text style={styles.theoryText}>{t("results.fanTheory")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.ratingPrompt")}</Text>
          <StarRating rating={rating} onChange={saveRating} />
          <Text style={styles.ratingHint}>{t("results.ratingHint")}</Text>
        </View>

        {/* Submit to Leaderboard */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.leaderboard")}</Text>
          <Button
            text={submitDone ? t("results.submitted") : t("results.submitToLeaderboard")}
            action={handleSubmitToLeaderboard}
            loading={submitMutation.isPending}
          />
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
  trialName: { fontSize: 13, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 4 },
  detail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  winnerCard: { backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: colors.borderColor, alignItems: "center", gap: 4 },
  winnerTitle: { fontSize: 12, color: colors.textMuted, fontFamily: "PoppinsRegular", textTransform: "uppercase", letterSpacing: 1 },
  winnerName: { fontSize: 18, fontFamily: "PoppinsBold", color: colors.secondary },
  winnerDetail: { fontSize: 12, color: colors.textMuted },
  flexBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  flexText: { fontSize: 11, fontWeight: "bold" },
  materialRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  materialName: { flex: 1, fontSize: 13, color: colors.secondary },
  materialK: { fontSize: 12, color: colors.textMuted, marginRight: 12, fontFamily: "InterRegular" },
  materialFlex: { fontSize: 12, fontWeight: "bold" },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
