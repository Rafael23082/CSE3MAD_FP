import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/theme/colors';
import { ActivityAttempt } from '@/constants/types';
import { ACTIVITIES } from '@/constants/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AttemptDetailScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { attempt: attemptJson, activityKey } = useLocalSearchParams<{ attempt: string; activityKey: string }>();

  const attempt: ActivityAttempt | null = attemptJson ? JSON.parse(attemptJson) : null;
  const activity = activityKey ? ACTIVITIES[activityKey as keyof typeof ACTIVITIES] : null;

  if (!attempt || !activity) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "InterRegular", fontSize: 16, color: theme.secondary }}>{t("common.error")}</Text>
      </View>
    );
  }

  const date = attempt.createdAt?.toDate?.() || new Date();
  const predictions = attempt.predictions;
  const discussion = attempt.discussionAnswers;
  const hasPredictions = predictions && Object.values(predictions).some(v => v?.trim());
  const hasDiscussion = discussion && Object.values(discussion).some(v => v?.trim());

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={styles.title}>{activity.title}</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar" size={14} color={theme.textMuted} />
          <Text style={styles.metaText}>{date.toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
        {attempt.timerDurationMs != null && (
          <View style={styles.row}>
            <MaterialCommunityIcons name="timer-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>Challenge time: {Math.round(attempt.timerDurationMs / 60000)} min</Text>
          </View>
        )}
        {attempt.location ? (
          <View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker" size={14} color={theme.secondary} />
              <Text style={styles.coordsText}>{attempt.location.latitude.toFixed(6)}, {attempt.location.longitude.toFixed(6)}</Text>
            </View>
            <Pressable
              style={[styles.mapBtn, { borderColor: theme.secondary }]}
              onPress={() => {
                const url = `https://maps.google.com/?q=${attempt.location!.latitude},${attempt.location!.longitude}`;
                Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open maps"));
              }}
            >
              <MaterialCommunityIcons name="map" size={16} color={theme.secondary} />
              <Text style={[styles.mapBtnText, { color: theme.secondary }]}>Open in Maps</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker-off" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>Location Not Available</Text>
          </View>
        )}
      </View>

      {/* Predictions */}
      {hasPredictions && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={18} color={theme.secondary} />
            <Text style={styles.sectionTitle}>Predictions</Text>
          </View>
          {Object.entries(predictions).map(([key, val]) => (
            <View key={key} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
              <Text style={{ fontFamily: "InterSemiBold", fontSize: 13, color: theme.secondary, minWidth: 100 }}>{key}:</Text>
              <Text style={{ fontFamily: "InterRegular", fontSize: 13, color: theme.textMuted, flex: 1 }}>{val}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Logs / Actions */}
      {attempt.logs.length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clipboard-list" size={18} color={theme.secondary} />
            <Text style={styles.sectionTitle}>Actions ({attempt.logs.length})</Text>
          </View>
          {attempt.logs.map((log, idx) => (
            <View key={log.timestamp?.toString() || idx} style={{ marginBottom: 12, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: theme.secondary + "40" }}>
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 13, color: theme.secondary, marginBottom: 4 }}>Action {idx + 1}</Text>
              {log.data?.observation ? (
                <Text style={{ fontFamily: "InterRegular", fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>{String(log.data.observation)}</Text>
              ) : null}
              {log.data?.videoUri ? (
                <View style={styles.row}>
                  <MaterialCommunityIcons name="video" size={14} color={theme.textMuted} />
                  <Text style={{ fontFamily: "InterRegular", fontSize: 12, color: theme.textMuted }}>Video recorded</Text>
                </View>
              ) : null}
              {log.data?.measuredMovement != null ? (
                <Text style={{ fontFamily: "InterRegular", fontSize: 12, color: theme.textMuted }}>Measured: {String(log.data.measuredMovement)} mm</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* Discussion */}
      {hasDiscussion && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="comment-text" size={18} color={theme.secondary} />
            <Text style={styles.sectionTitle}>Discussion</Text>
          </View>
          {Object.entries(discussion).map(([key, val]) => (
            <View key={key} style={{ marginBottom: 8 }}>
              <Text style={{ fontFamily: "InterSemiBold", fontSize: 12, color: theme.textMuted }}>{key}</Text>
              <Text style={{ fontFamily: "InterRegular", fontSize: 14, color: theme.secondary }}>{val}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Reflection */}
      {attempt.reflection ? (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="text-box-outline" size={18} color={theme.secondary} />
            <Text style={styles.sectionTitle}>Reflection</Text>
          </View>
          <Text style={{ fontFamily: "InterRegular", fontSize: 14, color: theme.secondary }}>{attempt.reflection}</Text>
        </View>
      ) : null}

      {/* Rating */}
      {attempt.rating != null && attempt.rating > 0 && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="star-outline" size={18} color={theme.secondary} />
            <Text style={styles.sectionTitle}>Rating</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons key={star} name={star <= (attempt.rating ?? 0) ? "star" : "star-outline"} size={22} color="#FFD700" />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontFamily: "PoppinsBold", fontSize: 20, color: theme.secondary, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  metaText: { fontFamily: "InterRegular", fontSize: 13, color: theme.textMuted },
  coordsText: { fontFamily: "InterSemiBold", fontSize: 13, color: theme.secondary },
  mapBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, marginTop: 6, alignSelf: "flex-start" },
  mapBtnText: { fontFamily: "InterSemiBold", fontSize: 13 },
  section: { borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: "PoppinsBold", fontSize: 16, color: theme.secondary },
});
