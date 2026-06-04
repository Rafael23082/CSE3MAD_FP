import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, use, useState } from "react";
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

export default function ParachuteResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const activityContext = use(ActivityContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'parachute-drop-challenge') || [];

  const [rating, setRating] = useState(0);

  // Load saved rating
  useState(() => {
    AsyncStorage.getItem(RATING_KEY + 'parachute-drop-challenge').then(val => {
      if (val) setRating(parseInt(val, 10));
    });
  });

  const saveRating = useCallback((n: number) => {
    setRating(n);
    AsyncStorage.setItem(RATING_KEY + 'parachute-drop-challenge', String(n));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.parachuteDropChallenge.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

        {/* Trials Table */}
        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
            <Text style={styles.emptyText}>{t("results.noData")}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {logs.map((log, i) => {
              const d = log.data || {};
              return (
                <View key={log.timestamp} style={styles.logItem}>
                  <Text style={styles.trialName}>{t("results.entryNumber", {number: i + 1})}</Text>
                  <View style={styles.metricsGrid}>
                    {d.vFinal !== undefined && (
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>{t("results.velocity")}</Text>
                        <Text style={styles.metricValue}>{d.vFinal.toFixed(2)} m/s</Text>
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
        )}

        {/* Accuracy */}
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

        {/* Theory Explanation */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
          <Text style={styles.theoryText}>{t("results.parachuteTheory")}</Text>
        </View>

        {/* Ranking Placeholder */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.ranking")}</Text>
          <Text style={styles.bodyText}>{t("results.compare")}</Text>
        </View>

        {/* Star Rating */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.ratingPrompt")}</Text>
          <StarRating rating={rating} onChange={saveRating} />
          <Text style={styles.ratingHint}>{t("results.ratingHint")}</Text>
        </View>

        {/* Back Button */}
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
  accuracyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  accuracyLabel: { fontSize: 12, color: colors.secondary },
  accuracyValue: { fontSize: 11, color: colors.textMuted },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  bodyText: { fontSize: 13, color: colors.textMuted },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
