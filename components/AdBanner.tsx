import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";

const isExpoGo = __DEV__ && Platform.OS !== "web" && !((global as any).Expo || (global as any).expo);

function PlaceholderAd({ theme, label }: { theme: ThemeColors; label: string }) {
  return (
    <View
      style={[
        styles.placeholder,
        { borderColor: theme.borderColor, backgroundColor: theme.card },
      ]}
    >
      <Text style={[styles.placeholderText, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function NativeAdBanner() {
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [AdModule, setAdModule] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    import("react-native-google-mobile-ads")
      .then((m) => mounted && setAdModule(m))
      .catch(() => mounted && setAdModule(null));
    return () => {
      mounted = false;
    };
  }, []);

  if (!AdModule) {
    return <PlaceholderAd theme={theme} label="Ad" />;
  }

  const { BannerAd, BannerAdSize, TestIds } = AdModule;
  const AD_UNIT_ID = __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error: any) => console.warn("Ad failed:", error)}
      />
    </View>
  );
}

export default function AdBanner() {
  const { theme } = useTheme();

  if (isExpoGo) {
    return <PlaceholderAd theme={theme} label="Ad Placeholder (Expo Go)" />;
  }
  return <NativeAdBanner />;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 8 },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
  },
  placeholderText: { fontSize: 12, fontFamily: "InterRegular" },
});
