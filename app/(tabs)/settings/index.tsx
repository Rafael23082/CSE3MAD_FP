import { SettingsSection } from "@/components/settingsSection";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import * as Battery from "expo-battery";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showLowBatteryWarning } from "@/utils/notifications";

const LOW_BATTERY_THRESHOLD = 35;

export default function SettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [hasShownLowBattery, setHasShownLowBattery] = useState(false);

  useEffect(() => {
    async function loadBatteryLevel() {
      const level = await Battery.getBatteryLevelAsync();
      const percent = Math.round(level * 100);
      setBatteryLevel(percent);

      if (percent < LOW_BATTERY_THRESHOLD && !hasShownLowBattery) {
        setHasShownLowBattery(true);
        await showLowBatteryWarning(percent);
      }
    }

    loadBatteryLevel();

    const interval = setInterval(loadBatteryLevel, 60000);
    return () => clearInterval(interval);
  }, [hasShownLowBattery]);

  return (
    <ScrollView
      style={styles.outerContainer}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 24 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.welcomeMessage}>{t("tabs.settings")}</Text>
      <SettingsSection label={t("tabs.account")} icon="person-outline" action={() => router.push("/settings/account")} />
      <SettingsSection label={t("tabs.appearance")} icon="color-palette-outline" action={() => {router.push("/settings/appearance")}} />
      <SettingsSection label={t("tabs.language")} icon="language-outline" action={() => {router.push("/settings/language")}} />
      <SettingsSection label={t("tabs.about")} icon="information-circle-outline" action={() => {router.push("/settings/about")}} />

      <View style={styles.batteryCard}>
        <Text style={styles.batteryLabel}>
          {t("settings.batteryLevel")}
        </Text>

        <Text style={styles.batteryValue}>
          {batteryLevel !== null ? `${batteryLevel}%` : "--"}
        </Text>
      </View>

    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
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
    batteryCard: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    batteryLabel: {
      fontFamily: "PoppinsMedium",
      fontSize: 14,
      color: colors.secondary,
    },
    batteryValue: {
      marginTop: 4,
      fontFamily: "PoppinsBold",
      fontSize: 28,
      color: colors.secondary,
    },
  });
  return styles;
}