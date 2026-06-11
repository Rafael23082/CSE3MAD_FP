import { SettingsSection } from "@/components/settingsSection";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import * as Battery from 'expo-battery';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    Battery.getBatteryLevelAsync().then(level => setBatteryLevel(level));
    const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => setBatteryLevel(batteryLevel));
    return () => sub.remove();
  }, []);

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
      {batteryLevel != null && (
        <View style={styles.batteryCard}>
          <MaterialCommunityIcons name={batteryLevel > 0.2 ? "battery" : "battery-alert"} size={20} color={batteryLevel > 0.2 ? theme.secondary : theme.danger} />
          <View style={styles.batteryTextWrap}>
            <Text style={styles.batteryLabel}>Battery Level</Text>
            <Text style={[styles.batteryValue, { color: batteryLevel > 0.2 ? theme.secondary : theme.danger }]}>
              {Math.round(batteryLevel * 100)}%
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  batteryTextWrap: { flex: 1 },
  batteryLabel: { fontFamily: "InterRegular", fontSize: 13, color: colors.textMuted },
  batteryValue: { fontFamily: "PoppinsBold", fontSize: 18 },
});