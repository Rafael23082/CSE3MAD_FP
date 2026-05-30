import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function FanResultsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const activityContext = useContext(ActivityContext);
  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'hand-fan-challenge') || [];
  const [rating, setRating] = useState(0);

  useState(() => {
    AsyncStorage.getItem(RATING_KEY + 'hand-fan-challenge').then(val => { if (val) setRating(parseInt(val, 10)); });
  });

  const saveRating = useCallback((n: number) => {
    setRating(n);
    AsyncStorage.setItem(RATING_KEY + 'hand-fan-challenge', String(n));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t("activities.handFanChallenge.name")}</Text>
        <Text style={styles.subtitle}>{t("results.attempts")}</Text>

        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
            <Text style={styles.emptyText}>No trials recorded</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {logs.map((log, i) => {
              const d = log.data || {};
              return (
                <View key={log.timestamp} style={styles.logItem}>
                  <Text style={styles.trialName}>Trial #{i + 1}</Text>
                  <Text style={styles.detail}>Material: {d.fanMaterial || '-'}</Text>
                  {d.angle !== undefined && <Text style={styles.detail}>Angle: {d.angle}°</Text>}
                  {d.force !== undefined && <Text style={styles.detail}>Force: {d.force.toFixed(3)} N</Text>}
                  {d.distance !== undefined && <Text style={styles.detail}>Distance: {d.distance} cm</Text>}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.theoryExplanation")}</Text>
          <Text style={styles.theoryText}>{t("results.fanTheory")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("results.ratingPrompt")}</Text>
          <StarRating rating={rating} onChange={saveRating} />
          <Text style={styles.ratingHint}>Tap a star to rate this activity</Text>
        </View>

        <View style={{ marginTop: 16, marginBottom: 40 }}>
          <Button text={t("results.backToActivities")} action={() => router.push("/(tabs)/activities")} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  theoryText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  ratingHint: { textAlign: "center", fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
