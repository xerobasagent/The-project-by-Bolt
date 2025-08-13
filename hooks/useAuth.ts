import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
}

// Demo employees - in production, this would come from your backend
const DEMO_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Software Developer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    employeeId: 'EMP002',
    department: 'Marketing',
    position: 'Marketing Manager',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    employeeId: 'EMP003',
    department: 'Sales',
    position: 'Sales Representative',
  },
];

const AUTH_KEY = 'authenticated_employee';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_KEY);
      if (authData) {
        const employee = JSON.parse(authData);
        setCurrentEmployee(employee);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (employeeId: string, pin: string): Promise<boolean> => {
    try {
      // Simple PIN validation - in production, use proper authentication
      if (pin !== '1234') {
        throw new Error('Invalid PIN');
      }

      const employee = DEMO_EMPLOYEES.find(emp => emp.employeeId === employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(employee));
      setCurrentEmployee(employee);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      setCurrentEmployee(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    isAuthenticated,
    currentEmployee,
    loading,
    signIn,
    signOut,
    employees: DEMO_EMPLOYEES,
  };
}