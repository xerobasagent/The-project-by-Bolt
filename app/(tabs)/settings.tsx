import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Bell, Shield, Download, Trash2, CircleHelp as HelpCircle, ChevronRight, Moon, Vibrate } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { SettingsItem } from '@/components/SettingsItem';

export default function SettingsScreen() {
  const { settings, updateSettings, exportData, clearAllData } = useSettings();
  const { signOut, currentEmployee } = useAuth();

  const handleExportData = async () => {
    try {
      await exportData();
      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your timesheet data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            {currentEmployee && (
              <Text style={styles.headerSubtitle}>
                {currentEmployee.name} ({currentEmployee.employeeId})
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingsItem
            icon={<Bell size={20} color="#6B7280" strokeWidth={2} />}
            title="Push Notifications"
            subtitle="Receive reminders to clock in/out"
            rightComponent={
              <Switch
                value={settings.notifications}
                onValueChange={(value) =>
                  updateSettings({ ...settings, notifications: value })
                }
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            }
          />

          <SettingsItem
            icon={<Vibrate size={20} color="#6B7280" strokeWidth={2} />}
            title="Haptic Feedback"
            subtitle="Vibrate on clock in/out"
            rightComponent={
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) =>
                  updateSettings({ ...settings, hapticFeedback: value })
                }
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingsItem
            icon={<Moon size={20} color="#6B7280" strokeWidth={2} />}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) =>
                  updateSettings({ ...settings, darkMode: value })
                }
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingsItem
            icon={<Download size={20} color="#6B7280" strokeWidth={2} />}
            title="Export Data"
            subtitle="Download your timesheet data"
            rightComponent={<ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
            onPress={handleExportData}
          />

          <SettingsItem
            icon={<Trash2 size={20} color="#EF4444" strokeWidth={2} />}
            title="Clear All Data"
            subtitle="Permanently delete all timesheet entries"
            rightComponent={<ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
            onPress={handleClearData}
            isDestructive
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          
          <SettingsItem
            icon={<Shield size={20} color="#6B7280" strokeWidth={2} />}
            title="Privacy Policy"
            subtitle="View our privacy policy"
            rightComponent={<ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would open here.')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingsItem
            icon={<HelpCircle size={20} color="#6B7280" strokeWidth={2} />}
            title="Help & Support"
            subtitle="Get help with the app"
            rightComponent={<ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
            onPress={() => Alert.alert('Help', 'Help documentation would open here.')}
          />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingsItem
            icon={<User size={20} color="#EF4444" strokeWidth={2} />}
            title="Sign Out"
            subtitle="Sign out of your account"
            rightComponent={<ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
            onPress={handleSignOut}
            isDestructive
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Timesheet App v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Built with Expo & React Native</Text>
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
  editButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 4,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
  },
  appInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});