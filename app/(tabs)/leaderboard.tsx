import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { TOTAL_ACTIVITIES, MAX_POINTS } from "@/constants/data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getProgressionBoardData,
  calculateProgressPercentage,
  getProgressColor,
} from "@/utils/progressCalculation";

type RankEntry = {
  rank: number;
  userId: string;
  displayName: string;
  totalPoints: number;
  completedCount: number;
};

const MEDAL = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = use(AuthContext);

  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const boardData = await getProgressionBoardData();

      // Fetch display names for each team
      const ranked: RankEntry[] = [];
      for (const entry of boardData) {
        let displayName = entry.userId.substring(0, 8);
        try {
          const userSnap = await getDoc(doc(db, 'users', entry.userId));
          if (userSnap.exists()) {
            displayName = userSnap.data().displayName || displayName;
          }
        } catch {
          // Use fallback name
        }

        ranked.push({
          rank: entry.rank,
          userId: entry.userId,
          displayName,
          totalPoints: entry.totalPoints,
          completedCount: entry.completedCount,
        });
      }

      setRankings(ranked);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const currentUserId = auth?.user?.uid;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>{t("leaderboard.title")}</Text>

      {/* Ranking List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : rankings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="trophy-outline" size={48} color={theme.textMuted} />
          <Text style={styles.emptyText}>{t("leaderboard.noTeams")}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        >
          <View style={styles.columnHeader}>
            <Text style={[styles.col, { width: 40 }]}>{t("leaderboard.rank")}</Text>
            <Text style={[styles.col, { flex: 1 }]}>{t("leaderboard.team")}</Text>
            <Text style={[styles.col, { width: 80, textAlign: 'right' }]}>{t("leaderboard.points")}</Text>
          </View>

          {rankings.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            const progressPercent = calculateProgressPercentage(entry.completedCount);
            const progressColor = getProgressColor(progressPercent);

            return (
              <View key={entry.userId} style={[styles.rankRow, isCurrentUser && styles.userRow]}>
                <View style={{ width: 40, alignItems: 'center' }}>
                  {entry.rank <= 3 ? (
                    <Text style={styles.medal}>{MEDAL[entry.rank - 1]}</Text>
                  ) : (
                    <Text style={styles.rankNum}>#{entry.rank}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.teamName, isCurrentUser && styles.userTeamName]}>
                    {entry.displayName}
                  </Text>
                  <Text style={styles.activityCount}>
                    {t("leaderboard.activitiesCompleted", {
                      count: entry.completedCount,
                      total: TOTAL_ACTIVITIES
                    })}
                  </Text>
                  {/* Progress Bar */}
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
                </View>
                <View style={{ width: 80, alignItems: 'flex-end' }}>
                  <Text style={[styles.points, { color: progressColor }]}>
                    {entry.totalPoints}
                  </Text>
                  <Text style={styles.maxPoints}>/ {MAX_POINTS}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  header: {
    fontFamily: "PoppinsBold",
    fontSize: 22,
    color: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { fontFamily: "PoppinsRegular", fontSize: 16, color: colors.textMuted },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  columnHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    marginBottom: 4
  },
  col: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  userRow: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  medal: { fontSize: 24 },
  rankNum: { fontFamily: "PoppinsBold", fontSize: 16, color: colors.secondary },
  teamName: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 4,
  },
  userTeamName: { color: colors.primary },
  activityCount: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.borderColor,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  points: {
    fontFamily: "PoppinsBold",
    fontSize: 20,
  },
  maxPoints: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: colors.textMuted,
  },
});
