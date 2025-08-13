import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimeTracking } from './useTimeTracking';
import { useAuth } from './useAuth';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;
  startDate: string;
  avatar?: string;
}

const EMPLOYEE_KEY = 'employee_data';

const defaultEmployee: Employee = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'Engineering',
  position: 'Software Developer',
  employeeId: 'EMP001',
  startDate: '2024-01-15',
};

export function useEmployee() {
  const [employee, setEmployee] = useState<Employee>(defaultEmployee);
  const { getAllEntries } = useTimeTracking();
  const { currentEmployee } = useAuth();

  useEffect(() => {
    if (currentEmployee) {
      setEmployee({
        ...currentEmployee,
        phone: '+1 (555) 123-4567',
        startDate: '2024-01-15',
      });
    } else {
      loadEmployee();
    }
  }, [currentEmployee]);

  const loadEmployee = async () => {
    try {
      const data = await AsyncStorage.getItem(EMPLOYEE_KEY);
      if (data) {
        setEmployee(JSON.parse(data));
      } else {
        // Save default employee on first load
        await AsyncStorage.setItem(EMPLOYEE_KEY, JSON.stringify(defaultEmployee));
      }
    } catch (error) {
      console.error('Error loading employee:', error);
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    try {
      await AsyncStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployee));
      setEmployee(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const getEmployeeStats = async () => {
    const entries = await getAllEntries();
    
    const totalMinutes = entries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);
    
    const totalHours = totalMinutes / 60;
    const daysWorked = new Set(entries.map(entry => entry.date)).size;
    const avgHoursPerDay = daysWorked > 0 ? totalHours / daysWorked : 0;

    // Calculate this week's hours
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekEntries = entries.filter(entry => 
      new Date(entry.clockIn) >= startOfWeek
    );
    
    const thisWeekMinutes = thisWeekEntries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);
    
    const thisWeekHours = thisWeekMinutes / 60;

    return {
      totalHours,
      daysWorked,
      avgHoursPerDay,
      thisWeekHours,
    };
  };

  return {
    employee,
    updateEmployee,
    getEmployeeStats,
  };
}