import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import i18n from "@/i18n";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RankEntry = {
  rank: number;
  teamId: string;
  teamName: string;
  score: number;
  membersCount: number;
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

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [mode, setMode] = useState<'global' | 'activity'>('global');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const subsSnap = await getDocs(collection(db, 'submissions'));
      const subs = subsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

      // Group by team
      const teamMap: Record<string, { count: number; teamName?: string }> = {};

      for (const sub of subs as any[]) {
        if (mode === 'activity' && selectedActivity && sub.activityKey !== selectedActivity) continue;
        const teamId = sub.teamId;
        if (!teamId) continue;
        if (!teamMap[teamId]) {
          teamMap[teamId] = { count: 0 };
          // Fetch team name
          try {
            const teamSnap = await getDoc(doc(db, 'teams', teamId));
            if (teamSnap.exists()) {
              teamMap[teamId].teamName = teamSnap.data().teamName;
            }
          } catch (e) {
            teamMap[teamId].teamName = teamId;
          }
        }
        teamMap[teamId].count++;
      }

      const ranked: RankEntry[] = Object.entries(teamMap)
        .map(([teamId, data]) => ({
          rank: 0,
          teamId,
          teamName: data.teamName || teamId.substring(0, 8),
          score: data.count,
          membersCount: 0,
        }))
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

  const userTeamId = auth?.team?.teamId;

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
            <Text style={[styles.col, { flex: 1 }]}>{t("leaderboard.team")}</Text>
            <Text style={[styles.col, { width: 60, textAlign: 'right' }]}>{t("leaderboard.score")}</Text>
          </View>

          {rankings.map((entry) => {
            const isUserTeam = entry.teamId === userTeamId;
            return (
              <View key={entry.teamId} style={[styles.rankRow, isUserTeam && styles.userRow]}>
                <View style={{ width: 40, alignItems: 'center' }}>
                  {entry.rank <= 3 ? (
                    <Text style={styles.medal}>{MEDAL[entry.rank - 1]}</Text>
                  ) : (
                    <Text style={styles.rankNum}>#{entry.rank}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.teamName, isUserTeam && styles.userTeamName]}>
                    {entry.teamName}
                  </Text>
                </View>
                <Text style={[styles.score, { width: 60, textAlign: 'right' }]}>{entry.score}</Text>
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
  rankNum: { fontFamily: "PoppinsBold", fontSize: 14, color: colors.textMuted },
  teamName: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
  userTeamName: { color: colors.primary, fontWeight: "bold" },
  score: { fontFamily: "PoppinsRegular", fontSize: 14, color: colors.secondary },
});
