import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface WeeklyChartProps {
  data: number[];
}

const { width } = Dimensions.get('window');
const chartWidth = width - 80;
const maxBarHeight = 80;

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxValue = Math.max(...data, 8); // Minimum scale of 8 hours
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getBarHeight = (value: number) => {
    return (value / maxValue) * maxBarHeight;
  };

  const getBarColor = (value: number) => {
    if (value === 0) return '#E5E7EB';
    if (value < 4) return '#FEF3C7';
    if (value < 8) return '#DBEAFE';
    return '#D1FAE5';
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: getBarHeight(value),
                    backgroundColor: getBarColor(value),
                  },
                ]}
              />
              {value > 0 && (
                <Text style={styles.barValue}>{value.toFixed(1)}</Text>
              )}
            </View>
            <Text style={styles.dayLabel}>{days[index]}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E5E7EB' }]} />
          <Text style={styles.legendText}>No work</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FEF3C7' }]} />
          <Text style={styles.legendText}>Part-time</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#DBEAFE' }]} />
          <Text style={styles.legendText}>Full-time</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#D1FAE5' }]} />
          <Text style={styles.legendText}>Overtime</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: maxBarHeight + 40,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: maxBarHeight + 20,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
  },
});