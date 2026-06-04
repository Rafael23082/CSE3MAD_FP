import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

export default function BreathingResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activityContext = useContext(ActivityContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'breathing-pace-trainer') || [];
  const [rating, setRating] = useState(0);

  useState(() => {
    AsyncStorage.getItem(RATING_KEY + 'breathing-pace-trainer').then(val => { if (val) setRating(parseInt(val, 10)); });
  });

  const saveRating = useCallback((n: number) => {
    setRating(n);
    AsyncStorage.setItem(RATING_KEY + 'breathing-pace-trainer', String(n));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{t("activities.breathingPaceTrainer.name")}</Text>
      <Text style={styles.subtitle}>{t("results.attempts")}</Text>

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
                  {d.bpm !== undefined && <Text style={styles.bpmValue}>{d.bpm} BPM</Text>}
                  {d.breaths !== undefined && <Text style={styles.detail}>Breaths: {d.breaths}</Text>}
                  {d.phase && <Text style={styles.detail}>Phase: {d.phase}</Text>}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
          <Text style={styles.theoryText}>{t("results.breathingTheory")}</Text>
        </View>

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
  trialName: { fontSize: 13, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 4 },
  bpmValue: { fontSize: 18, fontFamily: "InterBold", fontWeight: "bold", color: colors.primary, marginBottom: 4 },
  detail: { fontSize: 12, color: colors.textMuted },
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
