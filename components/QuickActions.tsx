import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChartBar as BarChart3, Calendar, Clock } from 'lucide-react-native';
import { TimeEntry } from '@/hooks/useTimeTracking';

interface QuickActionsProps {
  todayEntries: TimeEntry[];
}

export function QuickActions({ todayEntries }: QuickActionsProps) {
  const getLastClockIn = () => {
    if (todayEntries.length === 0) return 'No entries today';
    const lastEntry = todayEntries[todayEntries.length - 1];
    return new Date(lastEntry.clockIn).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <BarChart3 size={24} color="#3B82F6" strokeWidth={2} />
          <Text style={styles.actionTitle}>View Reports</Text>
          <Text style={styles.actionSubtitle}>Weekly summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Calendar size={24} color="#10B981" strokeWidth={2} />
          <Text style={styles.actionTitle}>Schedule</Text>
          <Text style={styles.actionSubtitle}>View calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Clock size={20} color="#6B7280" strokeWidth={2} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Last Clock In</Text>
          <Text style={styles.infoValue}>{getLastClockIn()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
});