import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  rightComponent: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  rightComponent,
  onPress,
  isDestructive = false,
}: SettingsItemProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, isDestructive && styles.destructiveIcon]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        {rightComponent}
      </View>
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#FEE2E2',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  rightContent: {
    marginLeft: 16,
  },
});