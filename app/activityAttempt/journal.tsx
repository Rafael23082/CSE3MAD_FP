import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ActivityContext } from '@/context/ActivityContext';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function JournalScreen() {
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
            case 'parachute-drop-challenge': return 'Velocity (m/s)';
            case 'sound-pollution-hunter': return 'Decibel (dB)';
            case 'hand-fan-challenge': return 'Force (N)';
            case 'earthquake-resistant-structure': return 'Sway (cm)';
            default: return 'Measurement';
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
        Alert.alert("Delete Trial", "Remove this trial?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => {
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
        Alert.alert("Clear All", "Delete all trials for this activity?", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear", style: "destructive", onPress: () => clearExperimentLogs(activity.key) }
        ]);
    };

    const handleSubmit = async () => {
        if (!reflection.trim()) {
            Alert.alert("Missing Reflection", "Please write your reflection before submitting.");
            return;
        }

        // Check if activity requires team confirmation
        const needsConfirm = ['parachute-drop-challenge', 'earthquake-resistant-structure'].includes(activity.key);
        if (needsConfirm && !teamConfirmed) {
            Alert.alert("Team Confirmation Required", "All team members must confirm before submission. Please check the confirmation box.");
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
            Alert.alert("Success", "Mission Submitted!");
            setReflection("");
            setTeamConfirmed(false);
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert("Error", "Failed to submit. Check your connection.");
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
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.subtitle}>{activity.name}</Text>

            {/* Experiment Logs Feed with Review */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="chart-line" size={18} color={theme.primary} />
                    <Text style={styles.cardTitle}>EXPERIMENT RECORDS</Text>
                    {currentLogs.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll} style={{ marginLeft: 'auto' }}>
                            <Text style={{ color: theme.danger, fontSize: 11 }}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {currentLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="flask-outline" size={40} color={theme.textMuted} />
                        <Text style={styles.emptyText}>No experiment data yet</Text>
                        <Text style={styles.emptySubtext}>Go to the Experiment tab and log your first trial!</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.logCount}>{currentLogs.length} trial{currentLogs.length !== 1 ? 's' : ''} recorded</Text>
                        {[...currentLogs].reverse().map((log, i) => (
                            <View key={log.timestamp} style={styles.logItem}>
                                <View style={styles.logHeader}>
                                    <Text style={styles.logNumber}>Trial #{currentLogs.length - i}</Text>
                                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                        <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteTrial(log.timestamp)}>
                                            <MaterialCommunityIcons name="close-circle" size={18} color={theme.danger} />
                                        </TouchableOpacity>
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
                        <Text style={styles.cardTitle}>TEAM CONFIRMATION</Text>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 10 }}>
                        All team members must confirm before submission
                    </Text>
                    <TouchableOpacity
                        style={[styles.confirmBtn, { backgroundColor: teamConfirmed ? theme.tertiary + '20' : theme.surfaceContainer }]}
                        onPress={() => setTeamConfirmed(!teamConfirmed)}
                    >
                        <MaterialCommunityIcons
                            name={teamConfirmed ? 'check-circle' : 'circle-outline'}
                            size={22}
                            color={teamConfirmed ? theme.tertiary : theme.textMuted}
                        />
                        <Text style={[styles.confirmText, { color: teamConfirmed ? theme.tertiary : theme.textMuted }]}>
                            {teamConfirmed ? 'Confirmed' : 'I confirm our team\'s submission'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 8, fontStyle: 'italic' }}>
                        Each team member should confirm independently. This is self-reported.
                    </Text>
                </View>
            )}

            {/* Reflection */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="note-edit-outline" size={18} color={theme.secondary} />
                    <Text style={styles.cardTitle}>TEAM REFLECTION</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder="What did you observe? What was surprising?"
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={4}
                    value={reflection}
                    onChangeText={setReflection}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: isSubmitting ? theme.textMuted : theme.secondary }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <MaterialCommunityIcons name="send" size={18} color={theme.textPrimary} style={{marginRight: 8}} />
                <Text style={styles.buttonText}>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT MISSION'}</Text>
            </TouchableOpacity>
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
    logNumber: { fontSize: 13, fontWeight: 'bold', color: theme.textPrimary },
    logTime: { fontSize: 10, color: theme.textMuted },
    logMetric: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
    logValue: { color: theme.primary, fontWeight: 'bold' },
    logDetail: { fontSize: 11, color: theme.textMuted, marginLeft: 8, marginTop: 1 },
    textInput: {
        backgroundColor: theme.surfaceContainer,
        color: theme.textPrimary,
        padding: 15,
        borderRadius: 8,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' },
    buttonText: { color: theme.textPrimary, fontWeight: 'bold' },
    confirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 8 },
    confirmText: { fontSize: 14, fontWeight: 'bold' },
});
