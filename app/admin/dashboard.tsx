import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Users, Building2, Clock, TrendingUp, LogOut, CreditCard as Edit3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useClients } from '@/hooks/useClients';

export default function AdminDashboardScreen() {
  const { employees } = useAuth();
  const { getAllEntries } = useTimeTracking();
  const { clients } = useClients();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalClients: 0,
    totalHoursToday: 0,
    activeEmployees: 0,
  });

  useEffect(() => {
    checkAdminAuth();
    loadStats();
  }, []);

  const checkAdminAuth = async () => {
    const isAuthenticated = await AsyncStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  };

  const loadStats = async () => {
    const entries = await getAllEntries();
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => entry.date === today);
    
    const totalHoursToday = todayEntries.reduce((total, entry) => {
      return total + ((entry.duration || 0) / 60);
    }, 0);

    const activeEmployees = new Set(todayEntries.map(entry => entry.id)).size;

    setStats({
      totalEmployees: employees.length,
      totalClients: clients.length,
      totalHoursToday,
      activeEmployees,
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the admin portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('admin_authenticated');
            router.replace('/admin/login');
          },
        },
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, onPress }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Timesheet Management System</Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees.toString()}
              icon={<Users size={24} color="#3B82F6" strokeWidth={2} />}
              color="#3B82F6"
              onPress={() => router.push('/admin/employees')}
            />
            <StatCard
              title="Total Clients"
              value={stats.totalClients.toString()}
              icon={<Building2 size={24} color="#10B981" strokeWidth={2} />}
              color="#10B981"
              onPress={() => router.push('/admin/clients')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Hours Today"
              value={`${stats.totalHoursToday.toFixed(1)}h`}
              icon={<Clock size={24} color="#F59E0B" strokeWidth={2} />}
              color="#F59E0B"
              onPress={() => router.push('/admin/timesheets')}
            />
            <StatCard
              title="Active Today"
              value={stats.activeEmployees.toString()}
              icon={<TrendingUp size={24} color="#8B5CF6" strokeWidth={2} />}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/employees')}
          >
            <View style={styles.actionIcon}>
              <Users size={24} color="#3B82F6" strokeWidth={2} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Employees</Text>
              <Text style={styles.actionSubtitle}>View and edit employee timesheets</Text>
            </View>
            <Edit3 size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/clients')}
          >
            <View style={styles.actionIcon}>
              <Building2 size={24} color="#10B981" strokeWidth={2} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Clients</Text>
              <Text style={styles.actionSubtitle}>Add, edit, and organize client information</Text>
            </View>
            <Edit3 size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/timesheets')}
          >
            <View style={styles.actionIcon}>
              <Clock size={24} color="#F59E0B" strokeWidth={2} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>All Timesheets</Text>
              <Text style={styles.actionSubtitle}>View and edit all employee time entries</Text>
            </View>
            <Edit3 size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});