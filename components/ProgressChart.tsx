import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BarItem = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: BarItem[];
  height?: number;
  title?: string;
};

export function ProgressChart({ data, height = 160, title }: Props) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
        {title && <Text style={[styles.title, { color: theme.secondary }]}>{title}</Text>}
        <View style={[styles.emptyContainer, { height }]}>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>No data available</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
      {title && <Text style={[styles.title, { color: theme.secondary }]}>{title}</Text>}
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <View key={i} style={styles.barColumn}>
              <Text style={[styles.valueLabel, { color: theme.primary }]}>
                {item.value}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(barHeight, 4),
                    backgroundColor: item.color,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  },
                ]}
              />
              <Text
                style={[styles.barLabel, { color: theme.textMuted }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.label}
              </Text>
            </View>
          );
        })}
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
    fontFamily: 'PoppinsRegular',
    marginBottom: 10,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  valueLabel: {
    fontSize: 11,
    fontFamily: 'PoppinsRegular',
    marginBottom: 4,
  },
  bar: {
    width: '70%',
    minWidth: 16,
    maxWidth: 40,
  },
  barLabel: {
    fontSize: 9,
    fontFamily: 'InterRegular',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'InterRegular',
    fontSize: 12,
  },
});
