import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin, MoveVertical as MoreVertical, Building2 } from 'lucide-react-native';
import { TimeEntry } from '@/hooks/useTimeTracking';

interface TimesheetEntryProps {
  entry: TimeEntry;
}

export function TimesheetEntry({ entry }: TimesheetEntryProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = () => {
    return entry.clockOut ? '#10B981' : '#F59E0B';
  };

  const getStatusText = () => {
    return entry.clockOut ? 'Completed' : 'In Progress';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {new Date(entry.clockIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Clock size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.timeLabel}>Clock In</Text>
          <Text style={styles.timeValue}>{formatTime(entry.clockIn)}</Text>
        </View>

        {entry.clockOut && (
          <View style={styles.timeItem}>
            <Clock size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>{formatTime(entry.clockOut)}</Text>
          </View>
        )}
      </View>

      {entry.duration && (
        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Total Duration</Text>
          <Text style={styles.durationValue}>{formatDuration(entry.duration)}</Text>
        </View>
      )}

      {entry.location && (
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.locationText}>{entry.location}</Text>
        </View>
      )}

      {entry.clientName && (
        <View style={styles.clientContainer}>
          <Building2 size={14} color="#3B82F6" strokeWidth={2} />
          <Text style={styles.clientText}>{entry.clientName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuButton: {
    padding: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 20,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  durationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  clientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  clientText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 6,
    fontWeight: '600',
  },
});