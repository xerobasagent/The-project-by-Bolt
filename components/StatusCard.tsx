import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  backgroundColor: string;
}

export function StatusCard({ title, value, icon, backgroundColor }: StatusCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});