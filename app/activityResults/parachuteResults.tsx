import { BarChart } from "@/components/barChart";
import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useSubmitActivity } from "@/hooks/useSubmissions";
import { ThemeColors } from "@/theme/colors";
import { calculateSafetyScore, getParachuteRating } from "@/utils/physics";
import { saveExperimentLog, saveRating as sqliteSaveRating, getDb } from "@/utils/database";
import { uploadFileFromUri } from "@/utils/activitySubmissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
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
          <MaterialCommunityIcons
            name={n <= rating ? 'star' : 'star-outline'}
            size={36}
            color={n <= rating ? theme.primary : theme.textMuted}
          />
        </Pressable>
      ))}
    </View>
  );
};

const SAFETY_COLORS: Record<string, string> = {
  Excellent: "#22c55e",
  Good: "#eab308",
  Fair: "#f97316",
  Poor: "#ef4444",
};

export default function ParachuteResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ videoUri?: string }>();

  const activityContext = use(ActivityContext);
  const auth = use(AuthContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'parachute-drop-challenge') || [];

  const [rating, setRating] = useState(0);
  const [submitDone, setSubmitDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const submitMutation = useSubmitActivity();

  useEffect(() => {
    AsyncStorage.getItem(RATING_KEY + 'parachute-drop-challenge').then(val => {
      if (val) setRating(parseInt(val, 10));
    });
  }, []);

  useEffect(() => {
    if (logs.length === 0) return;
    (async () => {
      try {
        const db = await getDb();
        for (const log of logs) {
          await saveExperimentLog('parachute-drop-challenge', log.data, log.timestamp);
        }
      } catch (e) {
        console.warn('SQLite save failed:', e);
      }
    })();
  }, []);

  const safetyResults = useMemo(() => {
    return logs.map(log => {
      const d = log.data || {};
      const velocity = d.vFinal || 0;
      const gForce = d.gForce || 0;
      const accuracyError = d.accuracyError || (d.predictedTime && d.time ? Math.abs(parseFloat(d.predictedTime) - d.time) : 0);
      const score = calculateSafetyScore(velocity, gForce, accuracyError);
      return { ...score, trialName: d.trialName || "", index: log.timestamp };
    });
  }, [logs]);

  const avgSafetyScore = useMemo(() => {
    if (safetyResults.length === 0) return { percent: 0, rating: "Excellent" as const };
    const avg = safetyResults.reduce((s, r) => s + r.percent, 0) / safetyResults.length;
    return { percent: avg, rating: getParachuteRating(avg) };
  }, [safetyResults]);

  const rankedDesigns = useMemo(() => {
    return [...safetyResults].sort((a, b) => a.percent - b.percent);
  }, [safetyResults]);

  const chartData = useMemo(() => {
    return logs.map((log, i) => {
      const d = log.data || {};
      return {
        prototype: d.trialName || `Trial ${i + 1}`,
        velocity: parseFloat((d.vFinal || 0).toFixed(2)),
        dragForce: parseFloat((d.dragForce || 0).toFixed(2)),
        gForce: parseFloat((d.gForce || 0).toFixed(1)),
      };
    });
  }, [logs]);

  const handleSubmitToLeaderboard = async () => {
    if (submitDone) return;
    if (!auth?.user) {
      Alert.alert(t('results.notSignedIn'), t('results.notSignedInMessage'));
      return;
    }

    let mediaPayload: { type: "video"; url: string; path: string } | undefined;

    if (params.videoUri) {
      setUploading(true);
      try {
        const dest = `submissions/${auth.user.uid}/parachute-drop-challenge/${Date.now()}.mp4`;
        const { downloadUrl, path } = await uploadFileFromUri(params.videoUri, dest, 'video/mp4');
        mediaPayload = { type: "video", url: downloadUrl, path };
      } catch (err) {
        Alert.alert('Upload failed', 'Could not upload video. Submitting without video.');
      } finally {
        setUploading(false);
      }
    }

    submitMutation.mutate(
      {
        userId: auth.user.uid,
        activityKey: 'parachute-drop-challenge',
        logs,
        reflection: '',
        submittedAt: new Date(),
        rating: rating || undefined,
        media: mediaPayload,
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
    AsyncStorage.setItem(RATING_KEY + 'parachute-drop-challenge', String(n));
    sqliteSaveRating('parachute-drop-challenge', n).catch(() => {});
  }, []);

  const safetyColor = SAFETY_COLORS[avgSafetyScore.rating] || theme.primary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.parachuteDropChallenge.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

      {logs.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
          <Text style={styles.emptyText}>{t("results.noData")}</Text>
        </View>
      ) : (
        <>
          <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: safetyColor }]}>
            <Text style={styles.sectionTitle}>Safety Score</Text>
            <Text style={[styles.safetyScore, { color: safetyColor }]}>{avgSafetyScore.percent.toFixed(0)}%</Text>
            <View style={[styles.ratingBadge, { backgroundColor: safetyColor + "20" }]}>
              <Text style={[styles.ratingText, { color: safetyColor }]}>{avgSafetyScore.rating}</Text>
            </View>
            <Text style={styles.safetyHint}>Lower score = safer parachute (40% speed + 40% G-force + 20% accuracy)</Text>
          </View>

          {chartData.length > 1 && (
            <>
              <BarChart title="Velocity vs Prototype" data={chartData} xKey="prototype" yKeys={["velocity"]} color="#22d3ee" yLabel="m/s" />
              <BarChart title="Drag Force vs Prototype" data={chartData} xKey="prototype" yKeys={["dragForce"]} color="#f97316" yLabel="N" />
              <BarChart title="G-Force vs Prototype" data={chartData} xKey="prototype" yKeys={["gForce"]} color="#ef4444" yLabel="g" />
            </>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Best Design Ranking</Text>
            {rankedDesigns.map((d, i) => (
              <View key={d.index} style={styles.rankingRow}>
                <View style={styles.rankBadge}>
                  <Text style={[styles.rankNumber, { color: i === 0 ? "#22d55e" : theme.textMuted }]}>#{i + 1}</Text>
                </View>
                <Text style={styles.rankName}>{d.trialName || `Trial ${i + 1}`}</Text>
                <Text style={[styles.rankScore, { color: SAFETY_COLORS[d.rating] }]}>{d.percent.toFixed(0)}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            {logs.map((log, i) => {
              const d = log.data || {};
              return (
                <View key={log.timestamp} style={styles.logItem}>
                  <Text style={styles.trialName}>{d.trialName || t("results.entryNumber", {number: i + 1})}</Text>
                  <View style={styles.metricsGrid}>
                    {d.vFinal !== undefined && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>{t("results.velocity")}</Text>
                        <Text style={styles.metricValue}>{d.vFinal.toFixed(2)} m/s</Text>
                      </View>
                    )}
                    {d.dragForce !== undefined && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Drag</Text>
                        <Text style={styles.metricValue}>{d.dragForce.toFixed(2)} N</Text>
                      </View>
                    )}
                    {d.gForce !== undefined && d.gForce > 0 && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>{t("results.gForce")}</Text>
                        <Text style={[styles.metricValue, { color: d.gForce > 10 ? theme.danger : theme.tertiary }]}>
                          {d.gForce.toFixed(1)} g
                        </Text>
                      </View>
                    )}
                    {d.time !== undefined && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>{t("results.time")}</Text>
                        <Text style={styles.metricValue}>{d.time.toFixed(2)}s</Text>
                      </View>
                    )}
                    {d.surfaceArea && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>{t("results.surfaceArea")}</Text>
                        <Text style={styles.metricValue}>{d.surfaceArea} cm²</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {logs.some((l: any) => l.data?.predictedTime) && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t("results.accuracy")}</Text>
              {logs.filter((l: any) => l.data?.predictedTime).map((log: any, i) => {
                const pred = parseFloat(log.data.predictedTime);
                const actual = log.data.time;
                const diff = actual ? Math.abs(pred - actual) : 0;
                return (
                  <View key={log.timestamp} style={styles.accuracyRow}>
                    <Text style={styles.accuracyLabel}>{t("results.entryNumber", {number: i + 1})}</Text>
                    <Text style={styles.accuracyValue}>
                      Pred: {pred}s | Actual: {actual?.toFixed(2) || '?'}s | Diff: {diff.toFixed(2)}s
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
            <Text style={styles.theoryText}>{t("results.parachuteTheory")}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t("results.ranking")}</Text>
            <Text style={styles.bodyText}>{t("results.compare")}</Text>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("results.ratingPrompt")}</Text>
        <StarRating rating={rating} onChange={saveRating} />
        <Text style={styles.ratingHint}>{t("results.ratingHint")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("results.leaderboard")}</Text>
        {params.videoUri && !submitDone && (
          <Text style={styles.uploadNote}>Video will be uploaded with your submission</Text>
        )}
        <Button
          text={submitDone ? t("results.submitted") : t("results.submitToLeaderboard")}
          action={handleSubmitToLeaderboard}
          loading={submitMutation.isPending || uploading}
        />
      </View>

      <View style={{ marginTop: 16, marginBottom: 40 }}>
        <Button text={t("results.backToActivities")} action={() => router.push("/(tabs)/activities")} />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metric: { minWidth: 80 },
  metricLabel: { fontSize: 10, color: colors.textMuted },
  metricValue: { fontSize: 14, fontFamily: "InterRegular", color: colors.secondary, fontWeight: "bold" },
  safetyScore: { fontSize: 48, fontFamily: "PoppinsBold", textAlign: "center" },
  ratingBadge: { alignSelf: "center", paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  ratingText: { fontSize: 14, fontWeight: "bold" },
  safetyHint: { fontSize: 11, color: colors.textMuted, textAlign: "center", fontStyle: "italic" },
  rankingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  rankBadge: { width: 32, alignItems: "center" },
  rankNumber: { fontSize: 14, fontWeight: "bold" },
  rankName: { flex: 1, fontSize: 13, color: colors.secondary, marginLeft: 8 },
  rankScore: { fontSize: 13, fontWeight: "bold" },
  accuracyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  accuracyLabel: { fontSize: 12, color: colors.secondary },
  accuracyValue: { fontSize: 11, color: colors.textMuted },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  bodyText: { fontSize: 13, color: colors.textMuted },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
  uploadNote: { fontSize: 12, color: colors.tertiary, marginBottom: 8, fontStyle: "italic" },
});
