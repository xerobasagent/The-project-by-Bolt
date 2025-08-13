import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  duration?: number; // in minutes
  location?: string;
  clientId?: string;
  clientName?: string;
  notes?: string;
  surveyData?: {
    clientRating: number;
    workQuality: number;
    communication: number;
    workEnvironment: number;
    comments: string;
    wouldReturnToClient: boolean;
  };
}

const STORAGE_KEY = 'timesheet_entries';
const CURRENT_ENTRY_KEY = 'current_entry';

export function useTimeTracking() {
  const [isClocked, setIsClocked] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    loadCurrentState();
  }, []);

  const loadCurrentState = async () => {
    try {
      const currentEntryData = await AsyncStorage.getItem(CURRENT_ENTRY_KEY);
      if (currentEntryData) {
        const entry = JSON.parse(currentEntryData);
        setCurrentEntry(entry);
        setIsClocked(true);
      }
    } catch (error) {
      console.error('Error loading current state:', error);
    }
  };

  const clockIn = async (location?: string, clientId?: string, clientName?: string) => {
    const now = new Date();
    const entry: TimeEntry = {
      id: Date.now().toString(),
      clockIn: now.toISOString(),
      date: now.toDateString(),
      location,
      clientId,
      clientName,
    };

    try {
      await AsyncStorage.setItem(CURRENT_ENTRY_KEY, JSON.stringify(entry));
      setCurrentEntry(entry);
      setIsClocked(true);
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  };

  const clockOut = async () => {
    if (!currentEntry) return;

    const now = new Date();
    const clockInTime = new Date(currentEntry.clockIn);
    const duration = Math.floor((now.getTime() - clockInTime.getTime()) / (1000 * 60));

    const completedEntry: TimeEntry = {
      ...currentEntry,
      clockOut: now.toISOString(),
      duration,
    };

    try {
      // Save to entries list
      const existingEntries = await getAllEntries();
      const updatedEntries = [...existingEntries, completedEntry];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));

      // Clear current entry
      await AsyncStorage.removeItem(CURRENT_ENTRY_KEY);
      setCurrentEntry(null);
      setIsClocked(false);
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  };

  const clockOutWithSurvey = async (surveyData: any) => {
    if (!currentEntry) return;

    const now = new Date();
    const clockInTime = new Date(currentEntry.clockIn);
    const duration = Math.floor((now.getTime() - clockInTime.getTime()) / (1000 * 60));

    const completedEntry: TimeEntry = {
      ...currentEntry,
      clockOut: now.toISOString(),
      duration,
      surveyData,
    };

    try {
      // Save to entries list
      const existingEntries = await getAllEntries();
      const updatedEntries = [...existingEntries, completedEntry];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));

      // Clear current entry
      await AsyncStorage.removeItem(CURRENT_ENTRY_KEY);
      setCurrentEntry(null);
      setIsClocked(false);
    } catch (error) {
      console.error('Error clocking out with survey:', error);
      throw error;
    }
  };

  const getAllEntries = async (): Promise<TimeEntry[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  };

  const getTodayEntries = async (): Promise<TimeEntry[]> => {
    const entries = await getAllEntries();
    const today = new Date().toDateString();
    return entries.filter(entry => entry.date === today);
  };

  const getTodayHours = async (): Promise<number> => {
    const todayEntries = await getTodayEntries();
    const totalMinutes = todayEntries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);

    // Add current session if clocked in
    if (isClocked && currentEntry) {
      const now = new Date();
      const clockInTime = new Date(currentEntry.clockIn);
      const currentMinutes = Math.floor((now.getTime() - clockInTime.getTime()) / (1000 * 60));
      return (totalMinutes + currentMinutes) / 60;
    }

    return totalMinutes / 60;
  };

  const getWeeklyHours = async (): Promise<number[]> => {
    const entries = await getAllEntries();
    const now = new Date();
    const weeklyHours = Array(7).fill(0);

    // Get start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    entries.forEach(entry => {
      const entryDate = new Date(entry.clockIn);
      if (entryDate >= startOfWeek) {
        const dayIndex = entryDate.getDay();
        const hours = (entry.duration || 0) / 60;
        weeklyHours[dayIndex] += hours;
      }
    });

    return weeklyHours;
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const entries = await getAllEntries();
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  return {
    isClocked,
    currentEntry,
    clockIn,
    clockOut,
    clockOutWithSurvey,
    getAllEntries,
    getTodayEntries,
    getTodayHours,
    getWeeklyHours,
    deleteEntry,
  };
}