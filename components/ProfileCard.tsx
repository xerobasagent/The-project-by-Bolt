import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { User, Briefcase, Hash, Calendar } from 'lucide-react-native';
import { Employee } from '@/hooks/useEmployee';

interface ProfileCardProps {
  employee: Employee;
  isEditing: boolean;
  onUpdate: (employee: Employee) => void;
}

export function ProfileCard({ employee, isEditing, onUpdate }: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <User size={32} color="#FFFFFF" strokeWidth={2} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={employee.name}
            onChangeText={(text) => onUpdate({ ...employee, name: text })}
            placeholder="Full Name"
          />
        ) : (
          <Text style={styles.name}>{employee.name}</Text>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Briefcase size={16} color="#FFFFFF" strokeWidth={2} />
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={employee.position}
                onChangeText={(text) => onUpdate({ ...employee, position: text })}
                placeholder="Position"
              />
            ) : (
              <Text style={styles.detailText}>{employee.position}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Hash size={16} color="#FFFFFF" strokeWidth={2} />
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={employee.employeeId}
                onChangeText={(text) => onUpdate({ ...employee, employeeId: text })}
                placeholder="Employee ID"
              />
            ) : (
              <Text style={styles.detailText}>ID: {employee.employeeId}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Calendar size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.detailText}>
              Since {new Date(employee.startDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 4,
    minWidth: 200,
  },
  detailsContainer: {
    alignItems: 'center',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  detailInput: {
    fontSize: 14,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 2,
    minWidth: 120,
    textAlign: 'center',
  },
});