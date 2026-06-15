import Button from "@/components/button";
import { TOTAL_ACTIVITIES } from "@/constants/data";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { calculateProgressPercentage, getProgressColor } from "@/utils/progressCalculation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { use, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = use(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { userProfile, user } = auth || {};
  const [progress, setProgress] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const displayName = userProfile?.displayName ?? "";

  // Fetch activity progress for this team
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "activityProgress"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProgress(data);
    });
    return unsub;
  }, [user?.uid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Data will refresh via onSnapshot
    setRefreshing(false);
  }, []);

  const completedCount = progress.filter(p => p.isCompleted).length;
  const progressPercent = calculateProgressPercentage(completedCount);
  const progressColor = getProgressColor(progressPercent);

  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        testID="dashboard_screen"
      >
          {/* User Card */}
          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.welcomeMessage}>{t("home.welcome")}, {displayName}!</Text>
              </View>
            </View>
            <View style={styles.teamStats}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="check-circle" size={20} color={progressColor} />
                <Text style={[styles.statValue, { color: progressColor }]}>{completedCount}/{TOTAL_ACTIVITIES}</Text>
                <Text style={styles.statLabel}>{t("home.activitiesCompleted")}</Text>
              </View>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.teamCard}>
            <View style={styles.progressHeader}>
              <MaterialCommunityIcons name="chart-bar" size={18} color={theme.primary} />
              <Text style={[styles.progressTitle, { color: theme.secondary }]}>{t("home.progress")}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: progressColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {t("home.progressSummary", { count: completedCount })}
            </Text>
            <View style={styles.viewProgressBtn}>
              <Pressable
                style={[styles.viewProgressPressable, { backgroundColor: theme.primary + "20" }]}
                onPress={() => router.push("/(tabs)/leaderboard")}
              >
                <Text style={[styles.viewProgressText, { color: theme.primary }]}>
                  {t("home.viewProgressionBoard")}
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={14} color={theme.primary} />
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionHeader}>{t("home.recentActivity")}</Text>
          {progress.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="flask-outline" size={32} color={theme.textMuted} />
              <Text style={styles.emptyText}>{t("home.noRecentActivity")}</Text>
              <Text style={styles.emptySubtext}>{t("home.seeActivityRequirement")}</Text>
            </View>
          ) : (
            [...progress]
              .sort((a, b) => (b.completedAt?.toMillis?.() ?? 0) - (a.completedAt?.toMillis?.() ?? 0))
              .slice(0, 3)
              .map((p) => (
                <View key={p.id} style={styles.recentItem}>
                  <MaterialCommunityIcons name="clipboard-check" size={16} color={theme.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.recentLabel}>{p.activityKey}</Text>
                    <Text style={styles.recentDate}>
                      {p.completedAt?.toDate ? p.completedAt.toDate().toLocaleDateString() : 'Just now'}
                    </Text>
                  </View>
                </View>
              ))
          )}

          {/* Start Activity Button */}
          <View style={styles.startBtnContainer}>
            <Button text={t("home.startActivity")} action={() => router.push("/(tabs)/activities")} testID="start_activity_btn" />
          </View>
        </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    scrollContent: {
      padding: 24,
      flexGrow: 1,
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 4,
    },
    teamCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    teamHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    teamName: {
      fontFamily: "PoppinsRegular",
      fontSize: 16,
      color: colors.secondary,
      marginTop: 2,
    },
    rankBadge: {
      backgroundColor: colors.surfaceContainer,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: "center",
    },
    rankLabel: {
      fontFamily: "InterRegular",
      fontSize: 10,
      color: colors.textMuted,
    },
    rankValue: {
      fontFamily: "PoppinsBold",
      fontSize: 18,
      color: colors.primary,
    },
    pointsBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      flexDirection: 'row',
      gap: 4,
    },
    pointsValue: {
      fontFamily: "PoppinsBold",
      fontSize: 20,
    },
    pointsMax: {
      fontFamily: "InterRegular",
      fontSize: 12,
      color: colors.textMuted,
    },
    teamStats: {
      flexDirection: "row",
      gap: 20,
    },
    stat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    statValue: {
      fontFamily: "PoppinsRegular",
      fontSize: 16,
      color: colors.secondary,
    },
    statLabel: {
      fontFamily: "InterRegular",
      fontSize: 12,
      color: colors.textMuted,
    },
    sectionHeader: {
      color: colors.secondary,
      fontFamily: "PoppinsRegular",
      fontSize: 18,
      paddingTop: 24,
      paddingBottom: 12,
    },
    emptyCard: {
      alignItems: "center",
      paddingVertical: 30,
      backgroundColor: colors.card,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    emptyText: {
      fontFamily: "PoppinsRegular",
      fontSize: 14,
      color: colors.textMuted,
    },
    emptySubtext: {
      fontFamily: "InterRegular",
      fontSize: 11,
      color: colors.textMuted,
    },
    recentItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    recentLabel: {
      fontFamily: "PoppinsRegular",
      fontSize: 13,
      color: colors.secondary,
    },
    recentDate: {
      fontFamily: "InterRegular",
      fontSize: 11,
      color: colors.textMuted,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
    },
    progressTitle: {
      fontFamily: 'PoppinsRegular',
      fontSize: 16,
    },
    progressBarBg: {
      height: 10,
      backgroundColor: colors.borderColor,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 5,
    },
    progressText: {
      fontFamily: 'InterRegular',
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 10,
    },
    viewProgressBtn: {},
    viewProgressPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 8,
    },
    viewProgressText: {
      fontFamily: 'InterRegular',
      fontSize: 13,
    },
    startBtnContainer: {
      marginTop: 24,
      marginBottom: 40,
    },
  });
};
