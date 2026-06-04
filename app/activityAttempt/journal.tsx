import { ActivityContext } from '@/context/ActivityContext';
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase';
import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function JournalScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const activityContext = useContext(ActivityContext);
    const auth = useContext(AuthContext);

    const [reflection, setReflection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamConfirmed, setTeamConfirmed] = useState(false);

    if (!activityContext || !activityContext.activity) return null;

    const { activity, experimentLogs, clearExperimentLogs } = activityContext;
    const { team } = auth || {};
    const currentLogs = useMemo(
        () => experimentLogs.filter(log => log.activityKey === activity.key),
        [experimentLogs, activity.key]
    );

    const getMetricLabel = () => {
        switch(activity.key) {
            case 'parachute-drop-challenge': return t('journal.velocityMetric');
            case 'sound-pollution-hunter': return t('journal.decibelMetric');
            case 'hand-fan-challenge': return t('journal.forceMetric');
            case 'earthquake-resistant-structure': return t('journal.swayMetric');
            default: return t('journal.defaultMetric');
        }
    };

    const getMetricValue = (log: any) => {
        switch(activity.key) {
            case 'parachute-drop-challenge': return log.data?.vFinal || 0;
            case 'sound-pollution-hunter': return log.data?.db || 0;
            case 'hand-fan-challenge': return log.data?.force || 0;
            case 'earthquake-resistant-structure': return log.data?.observed || 0;
            default: return 0;
        }
    };

    const handleDeleteTrial = (timestamp: number) => {
        Alert.alert(t("journal.deleteTitle"), t("journal.deleteMsg"), [
            { text: t("common.cancel"), style: "cancel" },
            { text: t("common.delete"), style: "destructive", onPress: () => {
                // Clear all and re-add except this one
                const remaining = experimentLogs.filter(l => l.timestamp !== timestamp);
                clearExperimentLogs(activity.key);
                remaining.filter(l => l.activityKey === activity.key).forEach(l => {
                    activityContext.addExperimentLog({ activityKey: l.activityKey, data: l.data });
                });
            }}
        ]);
    };

    const handleClearAll = () => {
        Alert.alert(t("journal.clearAllTitle"), t("journal.clearAllMsg"), [
            { text: t("common.cancel"), style: "cancel" },
            { text: t("common.clear"), style: "destructive", onPress: () => clearExperimentLogs(activity.key) }
        ]);
    };

    const handleSubmit = async () => {
        if (!reflection.trim()) {
            Alert.alert(t("journal.missingReflection"), t("journal.missingReflectionMsg"));
            return;
        }

        // Check if activity requires team confirmation
        const needsConfirm = ['parachute-drop-challenge', 'earthquake-resistant-structure'].includes(activity.key);
        if (needsConfirm && !teamConfirmed) {
            Alert.alert(t("journal.confirmRequired"), t("journal.confirmRequiredMsg"));
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "submissions"), {
                userId: auth?.user?.uid || "anonymous",
                teamId: team?.teamId || "",
                activityKey: activity.key,
                reflection,
                logs: currentLogs,
                submittedAt: new Date()
            });
            Alert.alert(t("journal.submitSuccess"));
            setReflection("");
            setTeamConfirmed(false);
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert(t("journal.submitError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const labResultRoute = () => {
        // Navigate to per-activity results
        const routeMap: Record<string, string> = {
            'parachute-drop-challenge': '/activityResults/parachuteResults',
            'sound-pollution-hunter': '/activityResults/soundResults',
            'hand-fan-challenge': '/activityResults/fanResults',
            'earthquake-resistant-structure': '/activityResults/earthquakeResults',
            'breathing-pace-trainer': '/activityResults/breathingResults',
            'reaction-board-challenge': '/activityResults/reactionResults',
            'stretch-speed-and-gracefulness': '/activityResults/humanPerformanceResults',
        };
        const route = routeMap[activity.key] || '/activityResults';
        return route;
    };

    const handleViewResults = () => {
        // Navigate to per-activity results screen
        const route = labResultRoute();
        const results = currentLogs.map(log => ({
            label: `Trial`,
            value: String(getMetricValue(log)),
            ...log.data
        }));
        // We'll use expo-router to navigate - but since the results screens
        // pull from ActivityContext directly, we just navigate
        // Import router at top
    };

    // Format timestamp for display
    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const metricLabel = getMetricLabel();
    const needsTeamConfirm = ['parachute-drop-challenge', 'earthquake-resistant-structure'].includes(activity.key);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
            <Text style={styles.title}>{t("journal.title")}</Text>
            <Text style={styles.subtitle}>{activity.name}</Text>

            {/* Experiment Logs Feed with Review */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="chart-line" size={18} color={theme.primary} />
                    <Text style={styles.cardTitle}>{t("journal.experimentRecords")}</Text>
                    {currentLogs.length > 0 && (
                        <Pressable
                            onPress={handleClearAll}
                            style={({ pressed }) => [{ marginLeft: 'auto' }, pressed && { opacity: 0.7 }]}>
                            <Text style={{ color: theme.danger, fontSize: 11 }}>{t("journal.clearAll")}</Text>
                        </Pressable>
                    )}
                </View>

                {currentLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
                        <Text style={styles.emptyText}>{t("journal.noData")}</Text>
                        <Text style={styles.emptySubtext}>{t("journal.noDataSubtext")}</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.logCount}>{t(currentLogs.length === 1 ? 'journal.trialCount' : 'journal.trialCount_plural', {count: currentLogs.length})} recorded</Text>
                        {[...currentLogs].reverse().map((log, i) => (
                            <View key={log.timestamp} style={styles.logItem}>
                                <View style={styles.logHeader}>
                                    <Text style={styles.logNumber}>{t("journal.trialNumber", {number: currentLogs.length - i})}</Text>
                                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                        <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
                                        <Pressable
                                            onPress={() => handleDeleteTrial(log.timestamp)}
                                            style={({ pressed }) => pressed && { opacity: 0.7 }}>
                                            <MaterialCommunityIcons name="close-circle" size={18} color={theme.danger} />
                                        </Pressable>
                                    </View>
                                </View>
                                <Text style={styles.logMetric}>
                                    {metricLabel}: <Text style={styles.logValue}>{typeof getMetricValue(log) === 'number' ? getMetricValue(log).toFixed(2) : getMetricValue(log)}</Text>
                                </Text>
                                {log.data && Object.keys(log.data).filter(k => k !== 'timestamp').map(key => (
                                    key !== 'vFinal' && key !== 'db' && key !== 'force' && key !== 'observed' ? (
                                        <Text key={key} style={styles.logDetail}>
                                            {key}: {typeof log.data[key] === 'number' ? log.data[key].toFixed(2) : String(log.data[key])}
                                        </Text>
                                    ) : null
                                ))}
                            </View>
                        ))}
                    </>
                )}
            </View>

            {/* Team Confirmation (for certain activities) */}
            {needsTeamConfirm && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="account-group" size={18} color={theme.secondary} />
                        <Text style={styles.cardTitle}>{t("journal.teamConfirmation")}</Text>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 10 }}>
                        {t("journal.confirmSubtext")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.confirmBtn,
                            { backgroundColor: teamConfirmed ? theme.tertiary + '20' : theme.surfaceContainer },
                            pressed && { opacity: 0.85 },
                        ]}
                        onPress={() => setTeamConfirmed(!teamConfirmed)}
                    >
                        <MaterialCommunityIcons
                            name={teamConfirmed ? 'check-circle' : 'circle-outline'}
                            size={22}
                            color={teamConfirmed ? theme.tertiary : theme.textMuted}
                        />
                        <Text style={[styles.confirmText, { color: teamConfirmed ? theme.tertiary : theme.textMuted }]}>
                            {teamConfirmed ? t("journal.confirmed") : t("journal.confirmText")}
                        </Text>
                    </Pressable>
                    <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 8, fontStyle: 'italic' }}>
                        {t("journal.confirmNote")}
                    </Text>
                </View>
            )}

            {/* Reflection */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="note-edit-outline" size={18} color={theme.secondary} />
                    <Text style={styles.cardTitle}>{t("journal.teamReflection")}</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder={t("journal.reflectionPlaceholder")}
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={4}
                    value={reflection}
                    onChangeText={setReflection}
                />
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: isSubmitting ? theme.textMuted : theme.secondary },
                    pressed && !isSubmitting && { opacity: 0.85 },
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <MaterialCommunityIcons name="send" size={18} color={theme.secondary} style={{marginRight: 8}} />
                <Text style={styles.buttonText}>{isSubmitting ? t("journal.submitting") : t("journal.submitMission")}</Text>
            </Pressable>
        </ScrollView>
    );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundColor },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.secondary, marginBottom: 4 },
    subtitle: { fontSize: 14, color: theme.textMuted, marginBottom: 20 },
    card: { backgroundColor: theme.card, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: theme.borderColor },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    cardTitle: { fontSize: 12, fontWeight: 'bold', color: theme.textMuted },
    emptyState: { alignItems: 'center', paddingVertical: 30, gap: 8 },
    emptyText: { color: theme.textMuted, fontSize: 16, fontWeight: 'bold' },
    emptySubtext: { color: theme.textMuted, fontSize: 12, textAlign: 'center' },
    logCount: { fontSize: 11, color: theme.primary, fontWeight: 'bold', marginBottom: 10 },
    logItem: {
        backgroundColor: theme.surfaceContainer,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    logNumber: { fontSize: 13, fontWeight: 'bold', color: theme.secondary },
    logTime: { fontSize: 10, color: theme.textMuted },
    logMetric: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
    logValue: { color: theme.primary, fontWeight: 'bold' },
    logDetail: { fontSize: 11, color: theme.textMuted, marginLeft: 8, marginTop: 1 },
    textInput: {
        backgroundColor: theme.surfaceContainer,
        color: theme.secondary,
        padding: 15,
        borderRadius: 8,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' },
    buttonText: { color: theme.buttonText, fontWeight: 'bold' },
    confirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 8 },
    confirmText: { fontSize: 14, fontWeight: 'bold' },
});
