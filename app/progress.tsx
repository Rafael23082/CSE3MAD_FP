import { ProgressChart } from '@/components/ProgressChart';
import { ACTIVITIES } from '@/constants/data';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useUserSubmissions } from '@/hooks/useSubmissions';
import { ThemeColors } from '@/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { use, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Submission = {
  id: string;
  activityKey: string;
  rating?: number;
  submittedAt: { toDate?: () => Date } | Date;
};

const ACTIVITY_KEYS = ['parachute', 'sound', 'fan', 'earthquake', 'humanPerformance', 'reactionBoard', 'breathing'] as const;

const ACTIVITY_COLORS = [
  '#22d3ee', // cyan
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f97316', // orange
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
];

function getActivityColor(index: number): string {
  return ACTIVITY_COLORS[index % ACTIVITY_COLORS.length];
}

function getActivityTitle(key: string): string {
  return ACTIVITIES[key]?.title ?? key;
}

export default function ProgressScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const auth = use(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const user = auth?.user;
  const userId = user?.uid;

  const { data: submissions, isLoading, isError, refetch, isRefetching } = useUserSubmissions(userId);

  // Derive per-activity data
  const { completionMap, latestScores, historyByActivity, completedCount, bestActivity } = useMemo(() => {
    const completionMap: Record<string, boolean> = {};
    const latestScores: Record<string, number> = {};
    const historyByActivity: Record<string, Submission[]> = {};
    let bestActivityKey: string | null = null;
    let bestScore = -1;

    for (const key of ACTIVITY_KEYS) {
      historyByActivity[key] = [];
    }

    const subs = (submissions as Submission[]) || [];
    for (const sub of subs) {
      const key = sub.activityKey;
      if (key) {
        completionMap[key] = true;
        historyByActivity[key] = historyByActivity[key] || [];
        historyByActivity[key].push(sub);

        // Track latest score per activity (most recent submission's rating wins)
        if (typeof sub.rating === 'number') {
          const existing = latestScores[key];
          if (existing === undefined || sub.rating > existing) {
            latestScores[key] = sub.rating;
          }
        }
      }
    }

    // Find best activity
    for (const key of ACTIVITY_KEYS) {
      const score = latestScores[key] ?? 0;
      if (score > bestScore) {
        bestScore = score;
        bestActivityKey = key;
      }
    }

    // If no ratings, try completion-based fallback
    if (bestActivityKey === null || bestScore <= 0) {
      for (const key of ACTIVITY_KEYS) {
        if (completionMap[key]) {
          bestActivityKey = key;
          bestScore = historyByActivity[key]?.length ?? 0;
          break;
        }
      }
    }

    const completedCount = ACTIVITY_KEYS.filter(k => completionMap[k]).length;

    return { completionMap, latestScores, historyByActivity, completedCount, bestActivity: bestActivityKey };
  }, [submissions]);

  // Build chart data
  const completionChartData = useMemo(() => {
    return ACTIVITY_KEYS.map((key, i) => ({
      label: getShortLabel(key),
      value: completionMap[key] ? 1 : 0,
      color: completionMap[key] ? getActivityColor(i) : theme.borderColor,
    }));
  }, [completionMap, theme.borderColor]);

  const scoresChartData = useMemo(() => {
    const hasAnyScore = ACTIVITY_KEYS.some(k => typeof latestScores[k] === 'number');
    if (!hasAnyScore && completedCount === 0) return [];

    return ACTIVITY_KEYS.map((key, i) => ({
      label: getShortLabel(key),
      value: latestScores[key] ?? 0,
      color: latestScores[key] ? getActivityColor(i) : theme.borderColor,
    }));
  }, [latestScores, completedCount, theme.borderColor]);

  const bestActivityTitle = bestActivity ? getActivityTitle(bestActivity) : null;
  const bestActivityScore = bestActivity ? (latestScores[bestActivity] ?? 0) : 0;

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color={theme.danger} />
        <Text style={[styles.errorText, { color: theme.textMuted }]}>Failed to load progress data</Text>
        <Pressable onPress={() => refetch()} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: theme.primary }]}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.primary} />
      }
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.secondary }]}>{t('home.progress')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {!user ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
          <MaterialCommunityIcons name="account-outline" size={40} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>{t("home.signinToTrackProgress")}</Text>
        </View>
      ) : completedCount === 0 && (!submissions || submissions.length === 0) ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
          <MaterialCommunityIcons name="chart-bar" size={40} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>{t("home.noRecentActivity")}</Text>
          <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>{t("home.seeActivityRequirement")}</Text>
        </View>
      ) : (
        <>
          {/* Activity Completion */}
          <ProgressChart
            data={completionChartData}
            height={100}
            title={t('home.activityCompletion')}
          />

          {/* Summary badge */}
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
            <MaterialCommunityIcons name="check-circle" size={20} color={theme.tertiary} />
            <Text style={[styles.summaryText, { color: theme.secondary }]}>
              {t("home.progressSummary", { count: completedCount })}
            </Text>
          </View>

          {/* Best Activity */}
          {bestActivityTitle && bestActivityScore > 0 && (
            <View style={[styles.bestCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <View style={styles.bestHeader}>
                <MaterialCommunityIcons name="trophy" size={20} color="#f59e0b" />
                <Text style={[styles.bestLabel, { color: theme.textMuted }]}>{t("home.bestActivity")}</Text>
              </View>
              <Text style={[styles.bestTitle, { color: theme.secondary }]}>{bestActivityTitle}</Text>
              {bestActivityScore > 0 && (
                <Text style={[styles.bestScore, { color: theme.primary }]}>
                  {t("home.latestScore")}: {bestActivityScore}/5
                </Text>
              )}
            </View>
          )}

          {/* Scores Overview */}
          {scoresChartData.length > 0 && (
            <ProgressChart
              data={scoresChartData}
              height={160}
              title={t('home.scoresOverview')}
            />
          )}

          {/* Submission History */}
          <Text style={[styles.sectionHeader, { color: theme.secondary }]}>
            {t('home.submissionHistory')}
          </Text>
          {ACTIVITY_KEYS.filter(k => completionMap[k]).length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>{t('home.noSubmissionsYet')}</Text>
            </View>
          ) : (
            ACTIVITY_KEYS.filter(k => completionMap[k]).map((key) => {
              const subs = historyByActivity[key] || [];
              const color = getActivityColor(ACTIVITY_KEYS.indexOf(key));
              return (
                <View key={key} style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
                  <View style={styles.historyHeader}>
                    <View style={[styles.activityDot, { backgroundColor: color }]} />
                    <Text style={[styles.historyActivityName, { color: theme.secondary }]}>
                      {getActivityTitle(key)}
                    </Text>
                    <Text style={[styles.historyCount, { color: theme.textMuted }]}>
                      {subs.length} {subs.length === 1 ? 'submission' : 'submissions'}
                    </Text>
                  </View>
                  {subs.slice(0, 3).map((sub) => {
                    let dateStr = '';
                    if (sub.submittedAt) {
                      const d = (sub.submittedAt as any).toDate ? (sub.submittedAt as any).toDate() : new Date(sub.submittedAt as any);
                      dateStr = d.toLocaleDateString();
                    }
                    return (
                      <View key={sub.id} style={styles.historyRow}>
                        <Text style={[styles.historyDate, { color: theme.textMuted }]}>
                          {dateStr || 'Just now'}
                        </Text>
                        {typeof sub.rating === 'number' && (
                          <Text style={[styles.historyScore, { color: theme.primary }]}>
                            Score: {sub.rating}/5
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}

function getShortLabel(key: string): string {
  const short: Record<string, string> = {
    parachute: 'Para',
    sound: 'Sound',
    fan: 'Fan',
    earthquake: 'Quake',
    humanPerformance: 'Human',
    reactionBoard: 'React',
    breathing: 'Breathe',
  };
  return short[key] ?? key.slice(0, 4);
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    errorText: {
      fontFamily: 'InterRegular',
      fontSize: 14,
    },
    retryBtn: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    retryText: {
      fontFamily: 'PoppinsRegular',
      fontSize: 14,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    backBtn: {
      padding: 4,
    },
    headerTitle: {
      fontFamily: 'PoppinsBold',
      fontSize: 22,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
    },
    summaryText: {
      fontFamily: 'PoppinsRegular',
      fontSize: 14,
      flex: 1,
    },
    bestCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1.5,
    },
    bestHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    bestLabel: {
      fontFamily: 'InterRegular',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    bestTitle: {
      fontFamily: 'PoppinsBold',
      fontSize: 16,
      marginBottom: 4,
    },
    bestScore: {
      fontFamily: 'PoppinsRegular',
      fontSize: 13,
    },
    sectionHeader: {
      fontFamily: 'PoppinsRegular',
      fontSize: 18,
      paddingTop: 16,
      paddingBottom: 12,
    },
    emptyCard: {
      alignItems: 'center',
      paddingVertical: 40,
      borderRadius: 12,
      gap: 10,
      borderWidth: 1,
      marginBottom: 16,
    },
    emptyText: {
      fontFamily: 'PoppinsRegular',
      fontSize: 14,
    },
    emptySubtext: {
      fontFamily: 'InterRegular',
      fontSize: 11,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    historyCard: {
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
    },
    historyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    activityDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    historyActivityName: {
      fontFamily: 'PoppinsRegular',
      fontSize: 14,
      flex: 1,
    },
    historyCount: {
      fontFamily: 'InterRegular',
      fontSize: 11,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingLeft: 18,
    },
    historyDate: {
      fontFamily: 'InterRegular',
      fontSize: 12,
    },
    historyScore: {
      fontFamily: 'PoppinsRegular',
      fontSize: 12,
    },
  });
