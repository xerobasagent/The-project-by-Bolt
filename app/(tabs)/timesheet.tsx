import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Calendar, Clock, TrendingUp, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TimeEntry, useTimeTracking } from '@/hooks/useTimeTracking';
import { TimesheetEntry } from '@/components/TimesheetEntry';
import { WeeklyChart } from '@/components/WeeklyChart';

export default function TimesheetScreen() {
  const { getAllEntries, getWeeklyHours } = useTimeTracking();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allEntries = await getAllEntries();
    const weekly = await getWeeklyHours();
    setEntries(allEntries);
    setWeeklyHours(weekly);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getFilteredEntries = () => {
    const now = new Date();
    const startOfPeriod = new Date();
    
    if (selectedPeriod === 'week') {
      startOfPeriod.setDate(now.getDate() - now.getDay());
    } else {
      startOfPeriod.setDate(1);
    }
    startOfPeriod.setHours(0, 0, 0, 0);

    return entries.filter(entry => 
      new Date(entry.clockIn) >= startOfPeriod
    );
  };

  const getTotalHours = () => {
    return getFilteredEntries().reduce((total, entry) => {
      if (entry.clockOut) {
        const duration = new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime();
        return total + (duration / (1000 * 60 * 60));
      }
      return total;
    }, 0);
  };

  const filteredEntries = getFilteredEntries();
  const totalHours = getTotalHours();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Timesheet</Text>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'month' && styles.periodButtonTextActive,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <TrendingUp size={24} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.summaryValue}>{totalHours.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
          <View style={styles.summaryCard}>
            <Calendar size={24} color="#10B981" strokeWidth={2} />
            <Text style={styles.summaryValue}>{filteredEntries.length}</Text>
            <Text style={styles.summaryLabel}>Days Worked</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Weekly Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <WeeklyChart data={weeklyHours} />
        </View>

        {/* Recent Entries */}
        <View style={styles.entriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {filteredEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No entries found</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your time by clocking in
              </Text>
            </View>
          ) : (
            filteredEntries.map((entry) => (
              <TimesheetEntry key={entry.id} entry={entry} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  periodButtonTextActive: {
    color: '#667eea',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  entriesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});