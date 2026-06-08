import Button from "@/components/button";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { ACTIVITIES } from "@/constants/data";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getBestActivity(subs: any[], activities: any): string {
  const countMap: Record<string, number> = {};
  for (const s of subs) {
    if (s.activityKey) {
      countMap[s.activityKey] = (countMap[s.activityKey] || 0) + 1;
    }
  }
  let bestKey = '';
  let bestCount = 0;
  for (const [key, count] of Object.entries(countMap)) {
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }
  if (!bestKey) return 'N/A';
  return activities[bestKey]?.title || bestKey;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = use(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { userProfile, team } = auth || {};
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = userProfile?.firstName ?? "";
  const formattedName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase();

  // Fetch submissions for this team
  useEffect(() => {
    if (!team?.teamId) return;
    const q = query(collection(db, "submissions"), where("teamId", "==", team.teamId));
    const unsub = onSnapshot(q, (snap) => {
      const subs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSubmissions(subs);
    });
    return unsub;
  }, [team?.teamId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (team?.teamId) {
      const q = query(collection(db, "submissions"), where("teamId", "==", team.teamId));
      const snap = await Promise.resolve(onSnapshot(q, (s) => {
        setSubmissions(s.docs.map(d => ({ id: d.id, ...d.data() })));
      }));
    }
    setRefreshing(false);
  }, [team?.teamId]);

  const completedCount = submissions.length;

  // Rank calculation (placeholder - would need all teams' submissions for real ranking)
  const rank = team ? Math.max(1, 5 - completedCount) : 0;

  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
          {/* Team Card - only shown when user has a team */}
          {team ? (
            <View style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeMessage}>{t("home.welcome")}, {formattedName}!</Text>
                  <Text style={styles.teamName}>{team.teamName}</Text>
                </View>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankLabel}>{t("home.rank")}</Text>
                  <Text style={styles.rankValue}>#{rank}</Text>
                </View>
              </View>
              <View style={styles.teamStats}>
                <View style={styles.stat}>
                  <MaterialCommunityIcons name="trophy" size={16} color={theme.primary} />
                  <Text style={styles.statValue}>{completedCount}/7</Text>
                  <Text style={styles.statLabel}>{t("home.completed")}</Text>
                </View>
                <View style={styles.stat}>
                  <MaterialCommunityIcons name="account-group" size={16} color={theme.secondary} />
                  <Text style={styles.statValue}>{team.members?.length || 0}</Text>
                  <Text style={styles.statLabel}>{t("team.members")}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.teamCard}>
              <Text style={styles.welcomeMessage}>{t("home.welcome")}, {formattedName}!</Text>
            </View>
          )}

          {/* Progress Section */}
          {team && (
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
                      width: `${Math.round((completedCount / 7) * 100)}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {t("home.progressSummary", { count: completedCount })}
              </Text>
              <View style={styles.bestActivityRow}>
                <MaterialCommunityIcons name="trophy" size={14} color="#f59e0b" />
                <Text style={styles.bestActivityLabel}>{t("home.bestActivity")}:</Text>
                <Text style={styles.bestActivityValue}>
                  {submissions.length > 0
                    ? getBestActivity(submissions, ACTIVITIES)
                    : t("home.noRecentActivity")}
                </Text>
              </View>
              <View style={styles.viewProgressBtn}>
                <Pressable
                  style={[styles.viewProgressPressable, { backgroundColor: theme.primary + "20" }]}
                  onPress={() => router.push("/progress")}
                >
                  <Text style={[styles.viewProgressText, { color: theme.primary }]}>
                    {t("home.viewFullProgress")}
                  </Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color={theme.primary} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Recent Activity */}
          <Text style={styles.sectionHeader}>{t("home.recentActivity")}</Text>
          {submissions.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="flask-outline" size={32} color={theme.textMuted} />
              <Text style={styles.emptyText}>{t("home.noRecentActivity")}</Text>
              <Text style={styles.emptySubtext}>{t("home.seeActivityRequirement")}</Text>
            </View>
          ) : (
            [...submissions].reverse().slice(0, 3).map((s) => (
              <View key={s.id} style={styles.recentItem}>
                <MaterialCommunityIcons name="clipboard-check" size={16} color={theme.primary} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.recentLabel}>{s.activityKey}</Text>
                  <Text style={styles.recentDate}>
                    {s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleDateString() : 'Just now'}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Start Activity Button */}
          <View style={styles.startBtnContainer}>
            <Button text={t("home.startActivity")} action={() => router.push("/(tabs)/activities")} />
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
    bestActivityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
    },
    bestActivityLabel: {
      fontFamily: 'InterRegular',
      fontSize: 12,
      color: colors.textMuted,
    },
    bestActivityValue: {
      fontFamily: 'PoppinsRegular',
      fontSize: 12,
      color: colors.secondary,
      flex: 1,
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