import { getActivities } from "@/assets/activities";
import ActivityGroup from "@/components/activityGroup";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActivitiesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const activities = getActivities(t);

  return (
    <ScrollView
      style={styles.outerContainer}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 24 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.welcomeMessage}>
        {t("activities.selectActivity")}
      </Text>
      <View style={styles.debugCard}>
        <Text style={styles.debugTitle}>Sensor validation</Text>
        <Text style={styles.debugBody}>
          Check camera, microphone, GPS, and accelerometer live on a physical
          Android device.
        </Text>
        <Pressable
          style={styles.debugButton}
          onPress={() => router.push("/sensor-debug" as never)}
        >
          <Text style={styles.debugButtonText}>Open sensor debug screen</Text>
        </Pressable>
      </View>
      {Object.entries(activities).map(([key, activity], index) => (
        <ActivityGroup
          key={index}
          activityKey={key}
          activityName={activity.name}
          description={activity.description}
          imagePath={activity.image}
          onlyImage={false}
        />
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    container: {
      padding: 24,
      flexGrow: 1,
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 16,
    },
    debugCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginBottom: 18,
      gap: 10,
    },
    debugTitle: {
      fontFamily: "PoppinsBold",
      fontSize: 16,
      color: colors.secondary,
    },
    debugBody: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
    debugButton: {
      backgroundColor: colors.primary,
      borderRadius: 999,
      paddingVertical: 12,
      alignItems: "center",
    },
    debugButtonText: {
      color: colors.buttonText,
      fontFamily: "PoppinsBold",
      fontSize: 13,
    },
  });
};
