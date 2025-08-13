import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Client {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

const CLIENTS_KEY = 'clients_data';

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    address: '123 Business Ave, Downtown',
    contactPerson: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    email: 'sarah@abccorp.com',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    address: '456 Innovation Blvd, Tech Park',
    contactPerson: 'Mike Chen',
    phone: '+1 (555) 345-6789',
    email: 'mike@techsolutions.com',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Green Energy Co',
    address: '789 Eco Street, Green District',
    contactPerson: 'Lisa Rodriguez',
    phone: '+1 (555) 456-7890',
    email: 'lisa@greenenergy.com',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await AsyncStorage.getItem(CLIENTS_KEY);
      if (data) {
        setClients(JSON.parse(data));
      } else {
        // Initialize with default clients
        await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(defaultClients));
        setClients(defaultClients);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients(defaultClients);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedClients = [...clients, newClient];
      await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
      setClients(updatedClients);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      const updatedClients = clients.map(client =>
        client.id === clientId ? { ...client, ...updates } : client
      );
      
      await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
      setClients(updatedClients);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      const updatedClients = clients.filter(client => client.id !== clientId);
      await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
      setClients(updatedClients);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const getActiveClients = () => {
    return clients.filter(client => client.isActive);
  };

  const getClientById = (clientId: string) => {
    return clients.find(client => client.id === clientId);
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getActiveClients,
    getClientById,
    loadClients,
  };
}