import BreathingAttemptScreen from "@/components/breathingAttempt";
import EarthquakeAttemptScreen from "@/components/earthquakeAttempt";
import FanAttemptScreen from "@/components/fanAttempt";
import HumanPerformanceLabAttemptScreen from "@/components/humanPerformanceLabAttempt";
import ParachuteAttemptScreen from "@/components/parachuteAttempt";
import ReactionBoardAttemptScreen from "@/components/reactionBoardAttempt";
import SoundAttemptScreen from "@/components/soundAttempt";
import { ActivityContext } from "@/context/ActivityContext";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { createAttempt } from "@/utils/activityAttempts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Battery from "expo-battery";
import { useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ActivityAttemptMainScreen(){
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const activityContext = use(ActivityContext);
  const auth = use(AuthContext);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (!activityContext) return null;

  const {activity, experimentLogs} = activityContext;

  useEffect(() => {
      async function checkPowerMode() {
          const lowPowerMode =
              await Battery.isLowPowerModeEnabledAsync();

          if (lowPowerMode) {
              Alert.alert(
                  t("errorMessages.batterySaverOn"),
                  t("errorMessages.batterySaverOnDescription")
              );
          }
      }

      checkPowerMode();
  }, []);

  const handleSaveAttempt = async () => {
      if (!activity || !auth?.user?.uid) return;

      // Get current logs for this activity
      const currentLogs = experimentLogs.filter(log => log.activityKey === activity.key);

      if (currentLogs.length === 0) {
          Alert.alert(t("journal.noData"), t("journal.noDataSubtext"));
          return;
      }

      setSaving(true);
      try {
          await createAttempt(
              auth.user.uid,
              activity.key,
              currentLogs.map(log => ({
                  activityKey: log.activityKey,
                  timestamp: log.timestamp,
                  data: { ...(log.data ?? {}) },
              }))
          );

          Alert.alert(
              t("journal.attemptSaved"),
              "",
              [
                  {
                      text: t("journal.viewJournal"),
                      onPress: () => router.push("/activityAttempt/journal")
                  },
                  {
                      text: t("common.ok"),
                      style: "cancel"
                  }
              ]
          );
      } catch (e) {
          console.error("Failed to save attempt:", e);
          Alert.alert(t("journal.submitError"));
      } finally {
          setSaving(false);
      }
  };

  const renderScreen = () => {
      switch (activity?.key){
          case "breathing-pace-trainer":
              return <BreathingAttemptScreen />;
          case "reaction-board-challenge":
              return <ReactionBoardAttemptScreen />;
          case "stretch-speed-and-gracefulness":
              return <HumanPerformanceLabAttemptScreen />;
          case "parachute-drop-challenge":
              return <ParachuteAttemptScreen />;
          case "sound-pollution-hunter":
              return <SoundAttemptScreen />;
          case "hand-fan-challenge":
              return <FanAttemptScreen />;
          case "earthquake-resistant-structure":
              return <EarthquakeAttemptScreen />;
          default:
              return <Text>{t("common.notImplemented")}</Text>;
      }
  };

  return (
      <View style={styles.container}>
          <View style={styles.screenContainer}>
              {renderScreen()}
          </View>

          {/* Save Attempt Button */}
          <View style={styles.saveContainer}>
              <Pressable
                  style={({ pressed }) => [
                      styles.saveBtn,
                      { backgroundColor: saving ? theme.textMuted : theme.secondary },
                      pressed && !saving && { opacity: 0.85 },
                  ]}
                  onPress={handleSaveAttempt}
                  disabled={saving}
              >
                  {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                  ) : (
                      <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                  )}
                  <Text style={styles.saveBtnText}>
                      {saving ? t("journal.saving") : t("journal.saveAttempt")}
                  </Text>
              </Pressable>
          </View>
      </View>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
    },
    saveContainer: {
        padding: 16,
        paddingBottom: 24,
        backgroundColor: theme.backgroundColor,
        borderTopWidth: 1,
        borderTopColor: theme.borderColor,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        borderRadius: 10,
    },
    saveBtnText: {
        color: "#fff",
        fontFamily: "InterBold",
        fontSize: 14,
    },
});
