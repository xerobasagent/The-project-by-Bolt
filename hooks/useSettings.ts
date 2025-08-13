import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimeTracking } from './useTimeTracking';

export interface AppSettings {
  notifications: boolean;
  hapticFeedback: boolean;
  darkMode: boolean;
  autoClockOut: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}

const SETTINGS_KEY = 'app_settings';

const defaultSettings: AppSettings = {
  notifications: true,
  hapticFeedback: true,
  darkMode: false,
  autoClockOut: false,
  workingHours: {
    start: '09:00',
    end: '17:00',
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const { getAllEntries } = useTimeTracking();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        setSettings(JSON.parse(data));
      } else {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const exportData = async () => {
    try {
      const entries = await getAllEntries();
      const employeeData = await AsyncStorage.getItem('employee_data');
      
      const exportData = {
        entries,
        employee: employeeData ? JSON.parse(employeeData) : null,
        exportDate: new Date().toISOString(),
      };

      // In a real app, this would save to device storage or share
      console.log('Export data:', JSON.stringify(exportData, null, 2));
      
      // For demo purposes, we'll just log it
      // In production, you'd use expo-sharing or expo-file-system
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'timesheet_entries',
        'current_entry',
        'employee_data',
        SETTINGS_KEY,
      ]);
      
      // Reset to defaults
      setSettings(defaultSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  return {
    settings,
    updateSettings,
    exportData,
    clearAllData,
  };
}