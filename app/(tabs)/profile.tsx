import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { User, Mail, Phone, MapPin, CreditCard as Edit3, Save, X, Clock, TrendingUp, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEmployee } from '@/hooks/useEmployee';
import { ProfileCard } from '@/components/ProfileCard';
import { StatsCard } from '@/components/StatsCard';

export default function ProfileScreen() {
  const { employee, updateEmployee, getEmployeeStats } = useEmployee();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [stats, setStats] = useState({
    totalHours: 0,
    daysWorked: 0,
    avgHoursPerDay: 0,
    thisWeekHours: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    setEditedEmployee(employee);
  }, [employee]);

  const loadStats = async () => {
    const employeeStats = await getEmployeeStats();
    setStats(employeeStats);
  };

  const handleSave = async () => {
    try {
      await updateEmployee(editedEmployee);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <X size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Edit3 size={24} color="#FFFFFF" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        <ProfileCard
          employee={isEditing ? editedEmployee : employee}
          isEditing={isEditing}
          onUpdate={setEditedEmployee}
        />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Work Statistics</Text>
          <View style={styles.statsGrid}>
            <StatsCard
              title="Total Hours"
              value={`${stats.totalHours.toFixed(1)}h`}
              icon={<Clock size={20} color="#3B82F6" strokeWidth={2} />}
              color="#3B82F6"
            />
            <StatsCard
              title="Days Worked"
              value={stats.daysWorked.toString()}
              icon={<User size={20} color="#10B981" strokeWidth={2} />}
              color="#10B981"
            />
            <StatsCard
              title="Avg Hours/Day"
              value={`${stats.avgHoursPerDay.toFixed(1)}h`}
              icon={<TrendingUp size={20} color="#F59E0B" strokeWidth={2} />}
              color="#F59E0B"
            />
            <StatsCard
              title="This Week"
              value={`${stats.thisWeekHours.toFixed(1)}h`}
              icon={<Calendar size={20} color="#8B5CF6" strokeWidth={2} />}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Mail size={20} color="#6B7280" strokeWidth={2} />
            {isEditing ? (
              <TextInput
                style={styles.contactInput}
                value={editedEmployee.email}
                onChangeText={(text) =>
                  setEditedEmployee({ ...editedEmployee, email: text })
                }
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.contactText}>{employee.email}</Text>
            )}
          </View>

          <View style={styles.contactItem}>
            <Phone size={20} color="#6B7280" strokeWidth={2} />
            {isEditing ? (
              <TextInput
                style={styles.contactInput}
                value={editedEmployee.phone}
                onChangeText={(text) =>
                  setEditedEmployee({ ...editedEmployee, phone: text })
                }
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.contactText}>{employee.phone}</Text>
            )}
          </View>

          <View style={styles.contactItem}>
            <MapPin size={20} color="#6B7280" strokeWidth={2} />
            {isEditing ? (
              <TextInput
                style={styles.contactInput}
                value={editedEmployee.department}
                onChangeText={(text) =>
                  setEditedEmployee({ ...editedEmployee, department: text })
                }
                placeholder="Department"
              />
            ) : (
              <Text style={styles.contactText}>{employee.department}</Text>
            )}
          </View>
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.saveButtonGradient}
              >
                <Save size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
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
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactContainer: {
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
    flex: 1,
  },
  contactInput: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#3B82F6',
    paddingBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});