import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { use } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getDbColor = (db: number) => {
  if (db <= 60) return "#22c55e";
  if (db <= 85) return "#eab308";
  if (db <= 100) return "#f97316";
  return "#ef4444";
};

const getRiskLabel = (db: number) => {
  if (db <= 60) return "Safe";
  if (db <= 85) return "Moderate";
  if (db <= 100) return "Dangerous";
  return "Critical";
};

export default function SoundMapScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activityContext = use(ActivityContext);

  const logs = activityContext?.experimentLogs?.filter(l => l.activityKey === 'sound-pollution-hunter') || [];

  const readingsWithGps = logs.filter(l => l.data?.latitude && l.data?.longitude);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
    >
      <Text style={styles.title}>{t("soundMap.title")}</Text>
      <Text style={styles.subtitle}>{t("soundMap.readingsWithGps", {count: readingsWithGps.length})}</Text>

      {readingsWithGps.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="map-marker-off" size={40} color={theme.textMuted} />
          <Text style={styles.emptyText}>{t("soundMap.noGpsReadings")}</Text>
          <Text style={styles.emptyHint}>{t("soundMap.recordPlaceholder")}</Text>
        </View>
      ) : (
        <>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <MaterialCommunityIcons name="map-outline" size={40} color={theme.textMuted} />
              <Text style={styles.mapPlaceholderText}>{t("soundMap.mapPlaceholder")}</Text>
              <Text style={styles.mapPlaceholderHint}>
                {readingsWithGps.length} GPS reading{readingsWithGps.length === 1 ? "" : "s"} available
              </Text>
            </View>
          </View>

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>{t("soundMap.legend")}</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
              <Text style={styles.legendText}>Safe (0-60 dB)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#eab308" }]} />
              <Text style={styles.legendText}>Moderate (60-85 dB)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#f97316" }]} />
              <Text style={styles.legendText}>Dangerous (85-100 dB)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.legendText}>Critical (100+ dB)</Text>
            </View>
          </View>

          <View style={styles.readingsList}>
            <Text style={styles.sectionTitle}>{t("soundMap.allReadings")}</Text>
            {readingsWithGps.map((log: any, i: number) => {
              const d = log.data;
              const db = d.db || 0;
              return (
                <View key={i} style={[styles.readingItem, { borderLeftColor: getDbColor(db) }]}>
                  <View style={styles.readingHeader}>
                    <Text style={styles.readingAction}>{d.action}</Text>
                    <Text style={[styles.readingDb, { color: getDbColor(db) }]}>{db} dB</Text>
                  </View>
                  <Text style={styles.readingLocation}>{d.location}</Text>
                  <Text style={styles.readingRisk}>Risk: {getRiskLabel(db)}</Text>
                </View>
              );
            })}
          </View>
        </>
      )}

      <View style={{ marginTop: 16, marginBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>{t("soundMap.back")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  scrollContent: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontFamily: "PoppinsBold", color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  emptyState: { alignItems: "center", padding: 30, gap: 8 },
  emptyText: { color: colors.textMuted, fontSize: 16 },
  emptyHint: { color: colors.textMuted, fontSize: 12, textAlign: "center" },
  mapContainer: { height: 300, borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  map: { flex: 1 },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderColor,
    borderRadius: 10,
    gap: 6,
  },
  mapPlaceholderText: { fontSize: 14, fontFamily: "PoppinsRegular", color: colors.secondary },
  mapPlaceholderHint: { fontSize: 12, color: colors.textMuted },
  legend: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: colors.borderColor },
  legendTitle: { fontSize: 14, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.textMuted },
  readingsList: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontFamily: "PoppinsRegular", color: colors.secondary, marginBottom: 10 },
  readingItem: { backgroundColor: colors.surfaceContainer, padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 3 },
  readingHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  readingAction: { fontSize: 14, fontFamily: "PoppinsRegular", color: colors.secondary },
  readingDb: { fontWeight: "bold", fontSize: 16 },
  readingLocation: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  readingRisk: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  backText: { textAlign: "center", color: colors.secondary, fontFamily: "PoppinsRegular", textDecorationLine: "underline", fontSize: 16 },
});
