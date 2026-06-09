import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import i18n from "@/i18n";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useCallback, use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { calculateOverallScore, getScoreExplanation, type ActivityScore } from "@/utils/scoring";

type RankEntry = {
  rank: number;
  userId: string;
  displayName: string;
  score: number;
  perActivity: ActivityScore[];
};

const activities = [
  { key: '', label: i18n.t("activities.allActivities") },
  { key: 'parachute-drop-challenge', label: i18n.t("activities.parachuteDropChallenge.name") },
  { key: 'sound-pollution-hunter', label: i18n.t("activities.soundPollutionHunter.name") },
  { key: 'hand-fan-challenge', label: i18n.t("activities.handFanChallenge.name") },
  { key: 'earthquake-resistant-structure', label: i18n.t("activities.earthquakeResistantStructure.name") },
  { key: 'breathing-pace-trainer', label: i18n.t("activities.breathingPaceTrainer.name") },
  { key: 'reaction-board-challenge', label: i18n.t("activities.reactionBoardChallenge.name") },
  { key: 'stretch-speed-and-gracefulness', label: i18n.t("activities.stretchSpeedAndGracefulness.name") },
];

const MEDAL = ['🥇', '🥈', '🥉'];

const activityLabels: Record<string, string> = {};
for (const a of activities) {
  if (a.key) activityLabels[a.key] = a.label;
}

function getScoreColor(score: number): string {
  if (score >= 200) return '#22c55e';
  if (score >= 100) return '#eab308';
  return '#ef4444';
}

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = use(AuthContext);
  const router = useRouter();

  const [mode, setMode] = useState<'global' | 'activity'>('global');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const subsSnap = await getDocs(collection(db, 'submissions'));
      const subs = subsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

      // Group by userId
      const userMap: Record<string, { submissions: any[]; displayName?: string }> = {};

      for (const sub of subs as any[]) {
        if (mode === 'activity' && selectedActivity && sub.activityKey !== selectedActivity) continue;
        const uid = sub.userId;
        if (!uid) continue;
        if (!userMap[uid]) {
          userMap[uid] = { submissions: [] };
          // Fetch user displayName
          try {
            const userSnap = await getDoc(doc(db, 'users', uid));
            if (userSnap.exists()) {
              userMap[uid].displayName = userSnap.data().displayName;
            }
          } catch (e) {
            userMap[uid].displayName = uid.substring(0, 8);
          }
        }
        userMap[uid].submissions.push(sub);
      }

      const ranked: RankEntry[] = Object.entries(userMap)
        .map(([userId, data]) => {
          const result = calculateOverallScore(data.submissions);
          return {
            rank: 0,
            userId,
            displayName: data.displayName || userId.substring(0, 8),
            score: result.total,
            perActivity: result.perActivity,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));

      setRankings(ranked);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [mode, selectedActivity]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const currentUserId = auth?.user?.uid;

  const showExplanation = (activityKey: string) => {
    Alert.alert(
      t("leaderboard.scoreExplanation"),
      getScoreExplanation(activityKey),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>{t("leaderboard.title")}</Text>

      {/* Mode Toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, mode === 'global' && styles.toggleActive]}
          onPress={() => setMode('global')}
        >
          <Text style={[styles.toggleText, mode === 'global' && styles.toggleActiveText]}>
            {t("leaderboard.global")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, mode === 'activity' && styles.toggleActive]}
          onPress={() => setMode('activity')}
        >
          <Text style={[styles.toggleText, mode === 'activity' && styles.toggleActiveText]}>
            {t("leaderboard.byActivity")}
          </Text>
        </Pressable>
      </View>

      {/* Activity Picker (for activity mode) */}
      {mode === 'activity' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityPicker}>
          {activities.map((act) => (
            <Pressable
              key={act.key}
              style={[styles.actChip, selectedActivity === act.key && styles.actChipActive]}
              onPress={() => setSelectedActivity(act.key)}
            >
              <Text style={[styles.actChipText, selectedActivity === act.key && styles.actChipTextActive]}>
                {act.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Ranking List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : rankings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="trophy-outline" size={48} color={theme.textMuted} />
          <Text style={styles.emptyText}>{t("leaderboard.noData")}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        >
          <View style={styles.columnHeader}>
            <Text style={[styles.col, { width: 40 }]}>{t("leaderboard.rank")}</Text>
            <Text style={[styles.col, { flex: 1 }]}>{t("leaderboard.user")}</Text>
            <Pressable
              style={{ width: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}
              onPress={() => showExplanation(mode === 'activity' && selectedActivity ? selectedActivity : '')}
            >
              <Text style={[styles.col, { textAlign: 'right' }]}>{t("leaderboard.score")}</Text>
              <MaterialCommunityIcons name="information-outline" size={14} color={theme.textMuted} />
            </Pressable>
          </View>

          {rankings.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            const isExpanded = expandedTeamId === entry.userId;
            const scoreColor = getScoreColor(entry.score);
            return (
              <View key={entry.userId}>
                <Pressable
                  style={[styles.rankRow, isCurrentUser && styles.userRow]}
                  onPress={() => setExpandedTeamId(isExpanded ? null : entry.userId)}
                >
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
                  </View>
                  <Text style={[styles.score, { width: 60, textAlign: 'right', color: scoreColor }]}>
                    {entry.score} {t("leaderboard.points")}
                  </Text>
                </Pressable>
                {isExpanded && entry.perActivity.length > 0 && (
                  <View style={styles.breakdownContainer}>
                    <Text style={styles.breakdownTitle}>{t("leaderboard.perActivity")}</Text>
                    {entry.perActivity.map((pa) => {
                      const actLabel = activityLabels[pa.activityKey] || pa.activityKey;
                      const paColor = getScoreColor(pa.score);
                      return (
                        <View key={pa.activityKey} style={styles.breakdownRow}>
                          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.breakdownLabel}>{actLabel}</Text>
                            <Pressable onPress={() => showExplanation(pa.activityKey)}>
                              <MaterialCommunityIcons name="information-outline" size={13} color={theme.textMuted} />
                            </Pressable>
                          </View>
                          <Text style={[styles.breakdownScore, { color: paColor }]}>
                            {pa.score} {t("leaderboard.points")}
                          </Text>
                        </View>
                      );
                    })}
                    <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
                      <Text style={styles.breakdownTotalLabel}>{t("leaderboard.score")}</Text>
                      <Text style={[styles.breakdownScore, { color: scoreColor, fontFamily: 'PoppinsBold' }]}>
                        {entry.score} {t("leaderboard.points")}
                      </Text>
                    </View>
                  </View>
                )}
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
  header: { fontFamily: "PoppinsBold", fontSize: 22, color: colors.primary, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  toggleRow: { flexDirection: "row", marginHorizontal: 24, marginBottom: 12, backgroundColor: colors.card, borderRadius: 10, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  toggleActive: { backgroundColor: colors.primary },
  toggleText: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.textMuted },
  toggleActiveText: { color: "#fff" },
  activityPicker: { paddingHorizontal: 24, marginBottom: 12, maxHeight: 40 },
  actChip: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: colors.card, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: colors.borderColor, justifyContent: "center", alignItems: "center" },
  actChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  actChipText: { fontSize: 12, color: colors.textMuted },
  actChipTextActive: { color: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { fontFamily: "PoppinsRegular", fontSize: 16, color: colors.textMuted },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  columnHeader: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderColor, marginBottom: 4 },
  col: { fontFamily: "InterRegular", fontSize: 11, color: colors.textMuted },
  rankRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4 },
  userRow: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary },
  medal: { fontSize: 20 },
  rankNum: { fontFamily: "PoppinsBold", fontSize: 14, color: colors.secondary },
  teamName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
  userTeamName: { color: colors.primary, fontWeight: "bold" as const },
  score: { fontFamily: "PoppinsRegular", fontSize: 14 },
  breakdownContainer: { backgroundColor: colors.card, borderRadius: 8, marginBottom: 4, marginLeft: 12, paddingVertical: 8, paddingHorizontal: 12 },
  breakdownTitle: { fontFamily: "PoppinsBold", fontSize: 11, color: colors.textMuted, textTransform: "uppercase" as const, marginBottom: 6, letterSpacing: 0.5 },
  breakdownRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  breakdownTotalRow: { borderTopWidth: 1, borderTopColor: colors.borderColor, marginTop: 4, paddingTop: 6 },
  breakdownLabel: { fontFamily: "InterRegular", fontSize: 13, color: colors.secondary, flex: 1 },
  breakdownScore: { fontFamily: "PoppinsRegular", fontSize: 13, textAlign: "right" },
  breakdownTotalLabel: { fontFamily: "PoppinsBold", fontSize: 13, color: colors.secondary },
});
