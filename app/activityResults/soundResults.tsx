import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useSubmitActivity } from "@/hooks/useSubmissions";
import { ThemeColors } from "@/theme/colors";
import { calcAverageDb, calculateNPI, getNPILevel } from "@/utils/physics";
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

export default function SoundResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activityContext = use(ActivityContext);
  const auth = use(AuthContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'sound-pollution-hunter') || [];
  const [rating, setRating] = useState(0);
  const [submitDone, setSubmitDone] = useState(false);
  const submitMutation = useSubmitActivity();

  useState(() => {
    AsyncStorage.getItem(RATING_KEY + 'sound-pollution-hunter').then(val => {
      if (val) setRating(parseInt(val, 10));
    });
  });

  // Save logs to SQLite on mount
  useEffect(() => {
    if (logs.length === 0) return;
    (async () => {
      try {
        for (const log of logs) {
          await saveExperimentLog('sound-pollution-hunter', log.data, log.timestamp);
        }
      } catch (e) {
        console.warn('SQLite save failed:', e);
      }
    })();
  }, []);

  const allDbs = useMemo(() => {
    return logs.map(l => l.data?.db ?? 0).filter((v: number) => v > 0);
  }, [logs]);

  const avgDb = useMemo(() => {
    if (allDbs.length === 0) return 0;
    return calcAverageDb(allDbs);
  }, [allDbs]);

  const peakDb = useMemo(() => {
    if (allDbs.length === 0) return 0;
    return Math.max(...allDbs);
  }, [allDbs]);

  const npi = useMemo(() => calculateNPI(avgDb), [avgDb]);
  const npiLevel = useMemo(() => getNPILevel(npi), [npi]);

  const npiColor = npiLevel === "Safe" ? theme.tertiary : npiLevel === "Warning" ? "#eab308" : theme.danger;

  const handleSubmitToLeaderboard = () => {
    if (submitDone) return;
    if (!auth?.user) {
      Alert.alert(t('results.notSignedIn'), t('results.notSignedInMessage'));
      return;
    }
    submitMutation.mutate(
      {
        userId: auth.user.uid,
        activityKey: 'sound-pollution-hunter',
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
    AsyncStorage.setItem(RATING_KEY + 'sound-pollution-hunter', String(n));
    sqliteSaveRating('sound-pollution-hunter', n).catch(() => {});
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.soundPollutionHunter.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
            <Text style={styles.emptyText}>{t("results.noData")}</Text>
          </View>
        ) : (
          <>
            {/* NPI Card */}
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: npiColor }]}>
              <Text style={styles.sectionTitle}>Noise Pollution Index (NPI)</Text>
              <Text style={[styles.npiValue, { color: npiColor }]}>{npi.toFixed(2)}</Text>
              <View style={[styles.npiBadge, { backgroundColor: npiColor + "20" }]}>
                <Text style={[styles.npiBadgeText, { color: npiColor }]}>{npiLevel}</Text>
              </View>
              <Text style={styles.npiFormula}>NPI = Avg dB / 85</Text>
              <Text style={styles.npiHint}>Avg: {avgDb.toFixed(1)} dB | Peak: {peakDb.toFixed(0)} dB | {allDbs.length} reading{allDbs.length !== 1 ? 's' : ''}</Text>
            </View>

            {/* Log listing */}
            <View style={styles.card}>
              {logs.map((log, i) => {
                const d = log.data || {};
                return (
                  <View key={log.timestamp} style={styles.logItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.trialName}>{t("results.entryNumber", {number: i + 1})}</Text>
                      {d.db !== undefined && (
                        <Text style={[styles.dbValue, { color: d.db > 85 ? theme.danger : theme.tertiary }]}>{d.db} dB</Text>
                      )}
                    </View>
                    {d.action && <Text style={styles.detail}>Action: {d.action}</Text>}
                    {d.location && <Text style={styles.detail}>Location: {d.location}</Text>}
                    {d.risk && <Text style={styles.detail}>Risk: {d.risk}</Text>}
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
          <Text style={styles.theoryText}>{t("results.soundTheory")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.ranking")}</Text>
          <Text style={styles.bodyText}>{t("results.compareNoise")}</Text>
        </View>

        <View style={styles.card}>
          <Button
            text={t("results.viewSoundMap")}
            action={() => router.push("/soundMap")}
          />
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
  trialName: { fontSize: 13, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 4 },
  dbValue: { fontSize: 18, fontFamily: "InterBold", fontWeight: "bold" },
  detail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  npiValue: { fontSize: 48, fontFamily: "PoppinsBold", textAlign: "center" },
  npiBadge: { alignSelf: "center", paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  npiBadgeText: { fontSize: 14, fontWeight: "bold" },
  npiFormula: { fontSize: 11, color: colors.textMuted, textAlign: "center", fontStyle: "italic", marginBottom: 4 },
  npiHint: { fontSize: 12, color: colors.textMuted, textAlign: "center" },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  bodyText: { fontSize: 13, color: colors.textMuted },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
