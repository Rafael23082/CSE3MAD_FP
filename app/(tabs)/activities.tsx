import { getActivities } from "@/assets/activities";
import ActivityGroup from "@/components/activityGroup";
import Button from "@/components/button";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { kebabToSnake } from "@/utils/idUtils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
      accessibilityLabel="activities_scrollview"
      testID="activities_scrollview"
      accessible={true}
    >
      <Text style={styles.welcomeMessage}>
        {t("activities.selectActivity")}
      </Text>
      <View style={styles.debugCard}>
        <Text style={styles.debugTitle}>{t("activities.sensorValidation")}</Text>
        <Text style={styles.debugBody}>
          {t("activities.sensorValidationDescription")}
        </Text>
        <Button 
          text={t("buttons.openSensorDebugScreen")}
          action={() => router.push("/sensor-debug" as never)}
        />
      </View>
      {Object.entries(activities).map(([key, activity]) => (
        <ActivityGroup
          key={key}
          activityKey={key}
          activityName={activity.name}
          description={activity.description}
          imagePath={activity.image}
          onlyImage={false}
          testID={`activity_${kebabToSnake(key)}`}
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
      gap: 16,
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
