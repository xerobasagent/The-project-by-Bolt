import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ArrowLeft, Search, Clock, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTimeTracking } from '@/hooks/useTimeTracking';

export default function AdminEmployeesScreen() {
  const { employees } = useAuth();
  const { getAllEntries } = useTimeTracking();
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeStats, setEmployeeStats] = useState<Record<string, any>>({});

  useEffect(() => {
    loadEmployeeStats();
  }, []);

  const loadEmployeeStats = async () => {
    const entries = await getAllEntries();
    const stats: Record<string, any> = {};

    employees.forEach(employee => {
      const employeeEntries = entries.filter(entry => 
        entry.notes?.includes(employee.employeeId) || 
        entry.id.startsWith(employee.id)
      );

      const totalMinutes = employeeEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);

      const today = new Date().toDateString();
      const todayEntries = employeeEntries.filter(entry => entry.date === today);
      const todayMinutes = todayEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);

      stats[employee.id] = {
        totalHours: totalMinutes / 60,
        todayHours: todayMinutes / 60,
        totalDays: new Set(employeeEntries.map(entry => entry.date)).size,
        lastWorked: employeeEntries.length > 0 
          ? new Date(employeeEntries[employeeEntries.length - 1].clockIn).toLocaleDateString()
          : 'Never',
      };
    });

    setEmployeeStats(stats);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Management</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#FFFFFF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {filteredEmployees.map((employee) => {
          const stats = employeeStats[employee.id] || {};
          
          return (
            <TouchableOpacity
              key={employee.id}
              style={styles.employeeCard}
              onPress={() => router.push(`/admin/employee/${employee.id}`)}
            >
              <View style={styles.employeeHeader}>
                <View style={styles.employeeAvatar}>
                  <User size={24} color="#3B82F6" strokeWidth={2} />
                </View>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeId}>ID: {employee.employeeId}</Text>
                  <Text style={styles.employeeDepartment}>{employee.department}</Text>
                </View>
                <View style={styles.employeeStats}>
                  <Text style={styles.statValue}>{stats.totalHours?.toFixed(1) || '0.0'}h</Text>
                  <Text style={styles.statLabel}>Total Hours</Text>
                </View>
              </View>

              <View style={styles.employeeDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>
                    Today: {stats.todayHours?.toFixed(1) || '0.0'}h
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>
                    Days Worked: {stats.totalDays || 0}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>
                    Last Worked: {stats.lastWorked}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <User size={64} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.emptyStateText}>No employees found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'No employees available'}
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  employeeStats: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  employeeDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
});