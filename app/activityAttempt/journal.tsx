import { ActivityContext } from '@/context/ActivityContext';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/theme/colors';
import { ActivityAttempt, ActivityLogEntry } from '@/constants/types';
import {
    getAttemptsForActivity,
    deleteAttempt,
    submitToLeaderboard,
    replaceSubmission,
} from '@/utils/activityAttempts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { use, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function JournalScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const activityContext = use(ActivityContext);
    const auth = use(AuthContext);
    const router = useRouter();

    const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    const activity = activityContext?.activity;
    const userId = auth?.user?.uid;

    const fetchAttempts = useCallback(async () => {
        if (!userId || !activity) return;
        setLoading(true);
        try {
            const data = await getAttemptsForActivity(userId, activity.key);
            setAttempts(data);
        } catch (e) {
            console.error("Failed to fetch attempts:", e);
        } finally {
            setLoading(false);
        }
    }, [userId, activity]);

    useEffect(() => {
        fetchAttempts();
    }, [fetchAttempts]);

    if (!activity) return null;

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMetricLabel = () => {
        switch (activity.key) {
            case 'parachute-drop-challenge': return t('journal.velocityMetric');
            case 'sound-pollution-hunter': return t('journal.decibelMetric');
            case 'hand-fan-challenge': return t('journal.forceMetric');
            case 'earthquake-resistant-structure': return t('journal.swayMetric');
            default: return t('journal.defaultMetric');
        }
    };

    const toNumber = (value: unknown) => typeof value === 'number' ? value : 0;

    const getMetricValue = (logs: ActivityLogEntry[]) => {
        if (!logs || logs.length === 0) return 0;
        const lastLog = logs[logs.length - 1];
        switch (activity.key) {
            case 'parachute-drop-challenge': return toNumber(lastLog.data?.vFinal);
            case 'sound-pollution-hunter': return toNumber(lastLog.data?.db);
            case 'hand-fan-challenge': return toNumber(lastLog.data?.force);
            case 'earthquake-resistant-structure': return toNumber(lastLog.data?.observed);
            default: return 0;
        }
    };

    const handleDelete = (attempt: ActivityAttempt) => {
        if (attempt.isLeaderboardSubmission) {
            Alert.alert(
                t("journal.deleteSubmittedTitle"),
                t("journal.deleteSubmittedWarning")
            );
            return;
        }

        Alert.alert(t("journal.deleteAttempt"), t("journal.deleteMsg"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"), style: "destructive", onPress: async () => {
                    try {
                        await deleteAttempt(attempt.id);
                        setAttempts(prev => prev.filter(a => a.id !== attempt.id));
                    } catch (e: any) {
                        Alert.alert(t("journal.deleteFailed"), e.message);
                    }
                }
            }
        ]);
    };

    const handleSubmitToLeaderboard = async (attempt: ActivityAttempt) => {
        setSubmittingId(attempt.id);
        try {
            // Check if activity already has official submission
            const existingOfficial = attempts.find(a => a.isLeaderboardSubmission);

            if (existingOfficial) {
                // Replace submission
                Alert.alert(
                    t("journal.confirmReplace"),
                    t("journal.confirmReplaceMsg"),
                    [
                        { text: t("common.cancel"), style: "cancel" },
                        {
                            text: t("journal.replaceSubmission"),
                            onPress: async () => {
                                try {
                                    await replaceSubmission(attempt.id);
                                    Alert.alert(t("journal.submissionReplaced"));
                                    fetchAttempts();
                                } catch (e: any) {
                                    Alert.alert(t("journal.submitError"), e.message);
                                }
                            }
                        }
                    ]
                );
            } else {
                // First submission
                await submitToLeaderboard(attempt.id);
                Alert.alert(t("journal.submitSuccess"));
                fetchAttempts();
            }
        } catch (e: any) {
            Alert.alert(t("journal.submitError"), e.message);
        } finally {
            setSubmittingId(null);
        }
    };

    const handleCreateNewAttempt = () => {
        router.push("/activityAttempt");
    };

    const officialAttempt = attempts.find(a => a.isLeaderboardSubmission);
    const draftAttempts = attempts.filter(a => !a.isLeaderboardSubmission);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{t("journal.title")}</Text>
            <Text style={styles.subtitle}>{activity.name}</Text>

            {/* Create New Attempt Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.createBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.85 },
                ]}
                onPress={handleCreateNewAttempt}
            >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                <Text style={styles.createBtnText}>{t("journal.createNewAttempt")}</Text>
            </Pressable>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : attempts.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="flask-outline" size={48} color={theme.textMuted} />
                    <Text style={styles.emptyText}>{t("journal.noAttempts")}</Text>
                    <Text style={styles.emptySubtext}>{t("journal.noAttemptsSubtext")}</Text>
                </View>
            ) : (
                <>
                    {/* Official Submission */}
                    {officialAttempt && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t("journal.submitted")}</Text>
                            <View style={[styles.attemptCard, styles.officialCard]}>
                                <View style={styles.attemptHeader}>
                                    <View style={styles.attemptInfo}>
                                        <Text style={styles.attemptNumber}>
                                            {t("journal.attemptNumber", { number: attempts.length - attempts.indexOf(officialAttempt) })}
                                        </Text>
                                        <Text style={styles.attemptTime}>{formatTime(officialAttempt.createdAt)}</Text>
                                    </View>
                                    <View style={styles.officialBadge}>
                                        <MaterialCommunityIcons name="check-circle" size={16} color={theme.tertiary} />
                                        <Text style={styles.officialBadgeText}>{t("journal.submitted")}</Text>
                                    </View>
                                </View>

                                {/* Attempt Summary */}
                                <View style={styles.attemptSummary}>
                                    <Text style={styles.metricLabel}>
                                        {getMetricLabel()}: <Text style={styles.metricValue}>{getMetricValue(officialAttempt.logs).toFixed(2)}</Text>
                                    </Text>
                                    {officialAttempt.reflection ? (
                                        <Text style={styles.reflectionPreview} numberOfLines={2}>
                                            {officialAttempt.reflection}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Actions */}
                                <View style={styles.attemptActions}>
                                    <Pressable
                                        style={[styles.actionBtn, styles.viewBtn]}
                                        onPress={() => Alert.alert("View", "Attempt details coming soon")}
                                    >
                                        <MaterialCommunityIcons name="eye" size={16} color={theme.primary} />
                                        <Text style={[styles.actionText, { color: theme.primary }]}>{t("journal.viewAttempt")}</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.actionBtn, styles.replaceBtn]}
                                        onPress={() => {
                                            Alert.alert(
                                                t("journal.replaceSubmission"),
                                                t("journal.confirmReplaceMsg"),
                                                [
                                                    { text: t("common.cancel"), style: "cancel" },
                                                    { text: t("journal.replaceSubmission"), onPress: () => {} }
                                                ]
                                            );
                                        }}
                                    >
                                        <MaterialCommunityIcons name="swap-horizontal" size={16} color={theme.secondary} />
                                        <Text style={[styles.actionText, { color: theme.secondary }]}>{t("journal.replaceSubmission")}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Draft Attempts */}
                    {draftAttempts.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t("journal.drafts")}</Text>
                            {draftAttempts.map((attempt, index) => (
                                <View key={attempt.id} style={styles.attemptCard}>
                                    <View style={styles.attemptHeader}>
                                        <View style={styles.attemptInfo}>
                                            <Text style={styles.attemptNumber}>
                                                {t("journal.attemptNumber", { number: attempts.length - attempts.indexOf(attempt) })}
                                            </Text>
                                            <Text style={styles.attemptTime}>{formatTime(attempt.createdAt)}</Text>
                                        </View>
                                    </View>

                                    {/* Attempt Summary */}
                                    <View style={styles.attemptSummary}>
                                        <Text style={styles.metricLabel}>
                                            {getMetricLabel()}: <Text style={styles.metricValue}>{getMetricValue(attempt.logs).toFixed(2)}</Text>
                                        </Text>
                                        {attempt.reflection ? (
                                            <Text style={styles.reflectionPreview} numberOfLines={2}>
                                                {attempt.reflection}
                                            </Text>
                                        ) : null}
                                    </View>

                                    {/* Actions */}
                                    <View style={styles.attemptActions}>
                                        <Pressable
                                            style={[styles.actionBtn, styles.viewBtn]}
                                            onPress={() => Alert.alert("View", "Attempt details coming soon")}
                                        >
                                            <MaterialCommunityIcons name="eye" size={16} color={theme.primary} />
                                            <Text style={[styles.actionText, { color: theme.primary }]}>{t("journal.viewAttempt")}</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.actionBtn, styles.deleteBtn]}
                                            onPress={() => handleDelete(attempt)}
                                        >
                                            <MaterialCommunityIcons name="delete" size={16} color={theme.danger} />
                                            <Text style={[styles.actionText, { color: theme.danger }]}>{t("journal.deleteAttempt")}</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.actionBtn, styles.submitBtn]}
                                            onPress={() => handleSubmitToLeaderboard(attempt)}
                                            disabled={submittingId === attempt.id}
                                        >
                                            {submittingId === attempt.id ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <MaterialCommunityIcons name="trophy" size={16} color="#fff" />
                                            )}
                                            <Text style={[styles.actionText, { color: "#fff" }]}>{t("journal.submitToLeaderboard")}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundColor },
    content: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 24, fontFamily: "PoppinsBold", color: theme.secondary, marginBottom: 4 },
    subtitle: { fontSize: 14, fontFamily: "InterRegular", color: theme.textMuted, marginBottom: 20 },
    createBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        borderRadius: 10,
        marginBottom: 24,
    },
    createBtnText: { color: "#fff", fontFamily: "InterBold", fontSize: 14 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
    emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
    emptyText: { color: theme.textMuted, fontSize: 16, fontFamily: "PoppinsBold" },
    emptySubtext: { color: theme.textMuted, fontSize: 12, fontFamily: "InterRegular", textAlign: "center" },
    section: { marginBottom: 24 },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "InterBold",
        color: theme.textMuted,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
    },
    attemptCard: {
        backgroundColor: theme.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    officialCard: {
        borderColor: theme.tertiary,
        borderWidth: 2,
    },
    attemptHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    attemptInfo: { flex: 1 },
    attemptNumber: { fontSize: 16, fontFamily: "PoppinsBold", color: theme.secondary },
    attemptTime: { fontSize: 12, fontFamily: "InterRegular", color: theme.textMuted, marginTop: 2 },
    officialBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: theme.tertiary + "20",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    officialBadgeText: { fontSize: 11, fontFamily: "InterBold", color: theme.tertiary },
    attemptSummary: {
        backgroundColor: theme.surfaceContainer,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    metricLabel: { fontSize: 13, fontFamily: "InterRegular", color: theme.textMuted },
    metricValue: { fontFamily: "PoppinsBold", color: theme.primary },
    reflectionPreview: {
        fontSize: 12,
        fontFamily: "InterRegular",
        color: theme.textMuted,
        marginTop: 8,
        fontStyle: "italic",
    },
    attemptActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    viewBtn: { backgroundColor: theme.primary + "15" },
    deleteBtn: { backgroundColor: theme.danger + "15" },
    submitBtn: { backgroundColor: theme.secondary },
    replaceBtn: { backgroundColor: theme.secondary + "15" },
    actionText: { fontSize: 12, fontFamily: "InterBold" },
});
