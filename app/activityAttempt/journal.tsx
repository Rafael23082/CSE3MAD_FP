import { ActivityAttempt, ActivityLogEntry } from '@/constants/types';
import { ActivityContext } from '@/context/ActivityContext';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/theme/colors';
import {
    deleteAttempt,
    getAttemptsForActivity,
    replaceSubmission,
    submitToLeaderboard,
} from '@/utils/activityAttempts';
import { showActivityCompleted } from '@/utils/notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { use, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function JournalScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const activityContext = use(ActivityContext);
    const auth = use(AuthContext);

    const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    // Reflection modal state
    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [modalAttemptId, setModalAttemptId] = useState<string | null>(null);
    const [modalReflection, setModalReflection] = useState('');
    const [modalRating, setModalRating] = useState<number | null>(null);

    const router = useRouter();
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

    useFocusEffect(
        useCallback(() => {
            fetchAttempts();
        }, [fetchAttempts])
    );

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
            case 'stretch-speed-and-gracefulness': return t('activities.stretchSpeedAndGracefulness.vibrationsDetected');
            case 'reaction-board-challenge': return t('activities.reactionBoardChallenge.tracingAccuracy');
            case 'breathing-pace-trainer': return "BPM";
            default: return t('journal.defaultMetric');
        }
    };

    const toNumber = (value: unknown) => typeof value === 'number' ? value : 0;

    const getMetricValue = (logs: ActivityLogEntry[]) => {
        if (!logs || logs.length === 0) return 0;
        const lastLog = logs[logs.length - 1];
        switch (activity.key) {
            case 'parachute-drop-challenge': return toNumber(lastLog.data?.timeToGround);
            case 'sound-pollution-hunter': return toNumber(lastLog.data?.measuredDb);
            case 'hand-fan-challenge': return toNumber(lastLog.data?.observedAngle);
            case 'earthquake-resistant-structure': return toNumber(lastLog.data?.measuredMovement);
            case 'stretch-speed-and-gracefulness': return toNumber(lastLog.data?.measuredVibrations);
            case 'reaction-board-challenge': return toNumber(lastLog.data?.measureTracingAccuracy ?? lastLog.data?.measuredReactionTime);
            case 'breathing-pace-trainer': return toNumber(lastLog.data?.measuredBPM);
            default: return 0;
        }
    };

    const openReflectionModal = (attempt: ActivityAttempt) => {
        setModalAttemptId(attempt.id);
        setModalReflection(attempt.reflection || '');
        setModalRating(attempt.rating);
        setShowReflectionModal(true);
    };

    const handleReflectionSubmit = async () => {
        if (!modalAttemptId) return;
        if (!modalReflection.trim()) {
            Alert.alert("Reflection Required", "Please write a reflection before submitting.");
            return;
        }

        setShowReflectionModal(false);
        setSubmittingId(modalAttemptId);

        try {
            const attempt = attempts.find(a => a.id === modalAttemptId);
            if (!attempt) throw new Error("Attempt not found");

            const existingOfficial = attempts.find(a => a.isLeaderboardSubmission);

            if (existingOfficial) {
                Alert.alert(
                    t("journal.confirmReplace"),
                    t("journal.confirmReplaceMsg"),
                    [
                        { text: t("common.cancel"), style: "cancel", onPress: () => setSubmittingId(null) },
                        {
                            text: t("journal.replaceSubmission"),
                            onPress: async () => {
                                try {
                                    await replaceSubmission(modalAttemptId);
                                    await showActivityCompleted(activity.name);
                                    Alert.alert(t("journal.submissionReplaced"));
                                    fetchAttempts();
                                } catch (e: any) {
                                    Alert.alert(t("journal.submitError"), e.message);
                                } finally {
                                    setSubmittingId(null);
                                }
                            }
                        }
                    ]
                );
            } else {
                await submitToLeaderboard(modalAttemptId);
                await showActivityCompleted(activity.name);
                Alert.alert(t("journal.submitSuccess"));
                fetchAttempts();
                setSubmittingId(null);
            }
        } catch (e: any) {
            Alert.alert(t("journal.submitError"), e.message);
            setSubmittingId(null);
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

    const officialAttempt = attempts.find(a => a.isLeaderboardSubmission);
    const draftAttempts = attempts.filter(a => !a.isLeaderboardSubmission);

    const isAttemptComplete = (attempt: ActivityAttempt): boolean => {
        const hasLogs = attempt.logs.length > 0;
        const hasPredictions = attempt.predictions && Object.values(attempt.predictions).some(v => v?.trim() !== "");
        const hasDiscussion = attempt.discussionAnswers && Object.values(attempt.discussionAnswers).some(v => v?.trim() !== "");
        return !!(hasLogs && hasPredictions && hasDiscussion);
    };

    const getActivityKey = (): string => {
        return activity?.key || "";
    };

    const renderPredictionComparison = (attempt: ActivityAttempt) => {
        const actKey = getActivityKey();
        if (actKey !== "sound-pollution-hunter") return null;
        if (!attempt.predictions?.loudestAction || !attempt.logs?.length) return null;

        const predicted = attempt.predictions.loudestAction;
        const actionLabels = ["Dropping Books", "Stomping Feet", "Clapping Hands"];
        const actionLogs = attempt.logs.filter(l => actionLabels.includes(String(l.data?.actionId === "action-1" ? "Dropping Books" : l.data?.actionId === "action-2" ? "Stomping Feet" : l.data?.actionId === "action-3" ? "Clapping Hands" : "")));
        const dBReadings: { action: string; dB: number }[] = [];
        for (const log of attempt.logs) {
            const actionId = log.data?.actionId;
            const dB = log.data?.measuredDb;
            if (actionId && typeof dB === "number") {
                const label = actionId === "action-1" ? "Dropping Books" : actionId === "action-2" ? "Stomping Feet" : actionId === "action-3" ? "Clapping Hands" : String(actionId);
                dBReadings.push({ action: label, dB });
            }
        }

        if (dBReadings.length === 0) return null;

        const loudest = [...dBReadings].sort((a, b) => b.dB - a.dB)[0];
        const wasCorrect = predicted.toLowerCase().trim() === loudest.action.toLowerCase().trim();

        return (
            <View style={styles.predictionComparison}>
                <View style={styles.summaryRow}>
                    <MaterialCommunityIcons name="brain" size={14} color={theme.tertiary} />
                    <Text style={styles.summaryText}>
                        Predicted loudest: <Text style={{ fontFamily: "InterBold", color: theme.secondary }}>{predicted}</Text>
                    </Text>
                </View>
                {dBReadings.map((r, i) => (
                    <View key={i} style={styles.summaryRow}>
                        <MaterialCommunityIcons
                            name={r.action === loudest.action ? "volume-high" : "volume-medium"}
                            size={14}
                            color={r.action === loudest.action ? theme.danger : theme.textMuted}
                        />
                        <Text style={styles.summaryText}>
                            {r.action}: <Text style={{ fontFamily: "InterBold" }}>{r.dB} dB</Text>
                        </Text>
                    </View>
                ))}
                <View style={[styles.summaryRow, { marginTop: 4 }]}>
                    <MaterialCommunityIcons
                        name={wasCorrect ? "check-circle" : "close-circle"}
                        size={14}
                        color={wasCorrect ? theme.tertiary : theme.danger}
                    />
                    <Text style={styles.summaryText}>
                        {wasCorrect ? "Prediction was correct!" : `Actual loudest: ${loudest.action} (${loudest.dB} dB)`}
                    </Text>
                </View>
            </View>
        );
    };

    const renderAttemptSummary = (attempt: ActivityAttempt) => {
        return (
            <View style={styles.worksheetSummary}>
                {renderPredictionComparison(attempt)}
                {attempt.predictions && Object.keys(attempt.predictions).length > 0 && getActivityKey() !== "sound-pollution-hunter" && (
                    <View style={styles.summaryRow}>
                        <MaterialCommunityIcons name="brain" size={14} color={theme.tertiary} />
                        <Text style={styles.summaryText}>
                            Predictions: {Object.values(attempt.predictions).filter(v => v?.trim()).length} answered
                        </Text>
                    </View>
                )}
                {attempt.discussionAnswers && Object.keys(attempt.discussionAnswers).length > 0 && (
                    <View style={styles.summaryRow}>
                        <MaterialCommunityIcons name="comment-text" size={14} color={theme.tertiary} />
                        <Text style={styles.summaryText}>
                            Discussion: {Object.values(attempt.discussionAnswers).filter(v => v?.trim()).length} answered
                        </Text>
                    </View>
                )}
                {attempt.logs.some(log => !!log.data?.videoUri) && (
                    <View style={styles.summaryRow}>
                        <MaterialCommunityIcons name="video" size={14} color={theme.tertiary} />
                        <Text style={styles.summaryText}>{t("journal.videoAttached")}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{t("journal.title")}</Text>
            <Text style={styles.subtitle}>{activity.name}</Text>

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
                        <View style={styles.section} testID='journal_screen'>
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

                                <View style={styles.attemptSummary}>
                                    <Text style={styles.metricLabel}>
                                        {getMetricLabel()}: <Text style={styles.metricValue}>{getMetricValue(officialAttempt.logs).toFixed(2)}</Text>
                                    </Text>
                                    {officialAttempt.location ? (
                                        <Pressable style={styles.locationRow} onPress={() => {
                                            const url = `https://maps.google.com/?q=${officialAttempt.location!.latitude},${officialAttempt.location!.longitude}`;
                                            Linking.openURL(url).catch(() => {});
                                        }}>
                                            <MaterialCommunityIcons name="map-marker" size={14} color={theme.primary} />
                                            <Text style={styles.locationText}>{officialAttempt.location.latitude.toFixed(6)}, {officialAttempt.location.longitude.toFixed(6)}</Text>
                                        </Pressable>
                                    ) : (
                                        <View style={styles.locationRow}>
                                            <MaterialCommunityIcons name="map-marker-off" size={14} color={theme.textMuted} />
                                            <Text style={[styles.locationText, { color: theme.textMuted }]}>Location Not Available</Text>
                                        </View>
                                    )}
                                    {renderAttemptSummary(officialAttempt)}
                                    {officialAttempt.reflection ? (
                                        <Text style={styles.reflectionPreview} numberOfLines={2}>
                                            {officialAttempt.reflection}
                                        </Text>
                                    ) : null}
                                    {officialAttempt.rating ? (
                                        <View style={styles.ratingRow}>
                                            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                                            <Text style={styles.summaryText}>Rating: {officialAttempt.rating}/5</Text>
                                        </View>
                                    ) : null}
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

                                    <View style={styles.attemptSummary}>
                                        <Text style={styles.metricLabel}>
                                            {getMetricLabel()}: <Text style={styles.metricValue}>{getMetricValue(attempt.logs).toFixed(2)}</Text>
                                        </Text>
                                        {attempt.location ? (
                                            <Pressable style={styles.locationRow} onPress={() => {
                                                const url = `https://maps.google.com/?q=${attempt.location!.latitude},${attempt.location!.longitude}`;
                                                Linking.openURL(url).catch(() => {});
                                            }}>
                                                <MaterialCommunityIcons name="map-marker" size={14} color={theme.primary} />
                                                <Text style={styles.locationText}>{attempt.location.latitude.toFixed(6)}, {attempt.location.longitude.toFixed(6)}</Text>
                                            </Pressable>
                                        ) : (
                                            <View style={styles.locationRow}>
                                                <MaterialCommunityIcons name="map-marker-off" size={14} color={theme.textMuted} />
                                                <Text style={[styles.locationText, { color: theme.textMuted }]}>Location Not Available</Text>
                                            </View>
                                        )}
                                        {renderAttemptSummary(attempt)}
                                        {attempt.reflection ? (
                                            <Text style={styles.reflectionPreview} numberOfLines={2}>
                                                {attempt.reflection}
                                            </Text>
                                        ) : null}
                                    </View>

                                    {/* Actions */}
                                    <View style={styles.attemptActions}>
                                        <Pressable
                                            style={[styles.actionBtn, styles.deleteBtn]}
                                            onPress={() => handleDelete(attempt)}
                                        >
                                            <MaterialCommunityIcons name="delete" size={16} color={theme.danger} />
                                            <Text style={[styles.actionText, { color: theme.danger }]}>{t("journal.deleteAttempt")}</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.actionBtn, styles.submitBtn]}
                                            onPress={() => {
                                                if (!isAttemptComplete(attempt)) {
                                                    Alert.alert("Incomplete", "Complete all experiment actions, predictions, and discussion before submitting.");
                                                    return;
                                                }
                                                if (attempt.timerDurationMs && attempt.timerDurationMs > 20 * 60 * 1000) {
                                                    Alert.alert("Time Exceeded", "This attempt took longer than 20 minutes and is not eligible for leaderboard submission. It remains saved in your journal.");
                                                    return;
                                                }
                                                openReflectionModal(attempt);
                                            }}
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

            {/* Reflection Modal */}
            <Modal
                visible={showReflectionModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowReflectionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Submit to Leaderboard</Text>
                        <Text style={styles.modalSubtitle}>Add your reflection and rating before submitting.</Text>

                        <Text style={styles.fieldLabel}>Reflection</Text>
                        <TextInput
                            style={styles.modalTextInput}
                            value={modalReflection}
                            onChangeText={setModalReflection}
                            placeholder="What did you learn from this activity?"
                            placeholderTextColor={theme.textMuted}
                            multiline
                        />

                        <Text style={styles.fieldLabel}>Rating</Text>
                        <View style={styles.modalStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable key={star} onPress={() => setModalRating(star)}>
                                    <MaterialCommunityIcons
                                        name={modalRating && star <= modalRating ? "star" : "star-outline"}
                                        size={36}
                                        color={modalRating && star <= modalRating ? "#FFD700" : theme.textMuted}
                                    />
                                </Pressable>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.modalBtn, { backgroundColor: theme.surfaceContainer }]}
                                onPress={() => setShowReflectionModal(false)}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.secondary }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalBtn, { backgroundColor: theme.secondary }]}
                                onPress={handleReflectionSubmit}
                            >
                                <MaterialCommunityIcons name="trophy" size={18} color="#fff" />
                                <Text style={[styles.modalBtnText, { color: "#fff" }]}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundColor },
    content: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 24, fontFamily: "PoppinsBold", color: theme.secondary, marginBottom: 4 },
    subtitle: { fontSize: 14, fontFamily: "InterRegular", color: theme.textMuted, marginBottom: 20 },
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
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    locationText: {
        fontSize: 12,
        fontFamily: "InterRegular",
        color: theme.primary,
    },
    worksheetSummary: {
        marginTop: 8,
        padding: 8,
        backgroundColor: theme.tertiary + "10",
        borderRadius: 6,
        gap: 4,
    },
    predictionComparison: {
        marginBottom: 8,
        gap: 4,
    },
    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    summaryText: {
        fontSize: 11,
        fontFamily: "InterRegular",
        color: theme.textMuted,
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
    actionText: { fontSize: 12, fontFamily: "InterBold" },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: theme.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: { fontSize: 20, fontFamily: "PoppinsBold", color: theme.secondary, marginBottom: 4 },
    modalSubtitle: { fontSize: 13, fontFamily: "InterRegular", color: theme.textMuted, marginBottom: 24 },
    fieldLabel: { fontSize: 14, fontFamily: "InterMedium", color: theme.secondary, marginBottom: 8, marginTop: 8 },
    modalTextInput: {
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        fontFamily: "Inter",
        fontSize: 14,
        color: theme.secondary,
        backgroundColor: theme.surfaceContainer,
        minHeight: 100,
        textAlignVertical: "top",
        marginBottom: 16,
    },
    modalStars: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        borderRadius: 10,
    },
    modalBtnText: { fontFamily: "InterBold", fontSize: 14 },
});
