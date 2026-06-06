import { useTheme } from "@/hooks/useTheme";
import { CartesianChart, Bar } from "victory-native";
import { Text, View, StyleSheet } from "react-native";

type BarChartData = Record<string, number | string>;

type Props = {
  data: BarChartData[];
  xKey: string;
  yKeys: string[];
  color: string;
  title: string;
  yLabel?: string;
};

export function BarChart({ data, xKey, yKeys, color, title, yLabel }: Props) {
  const { theme } = useTheme();
  if (data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
      <Text style={[styles.title, { color: theme.secondary }]}>{title}</Text>
      {yLabel && <Text style={[styles.yLabel, { color: theme.textMuted }]}>{yLabel}</Text>}
      <View style={styles.chart}>
        <CartesianChart
          data={data}
          xKey={xKey}
          yKeys={yKeys as any}
        >
          {({ points, chartBounds }: any) => (
            <Bar
              points={points[yKeys[0]]}
              chartBounds={chartBounds}
              color={color}
              barWidth={30}
              animate={{ type: "timing", duration: 300 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    marginBottom: 8,
  },
  yLabel: {
    fontSize: 10,
    fontFamily: "InterRegular",
    marginBottom: 4,
  },
  chart: {
    height: 180,
  },
});
