import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Building2, Search, MapPin, Phone, Mail, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Client, useClients } from '@/hooks/useClients';

interface ClientSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectClient: (client: Client) => void;
  selectedClientId?: string;
}

export function ClientSelector({
  visible,
  onClose,
  onSelectClient,
  selectedClientId,
}: ClientSelectorProps) {
  const { getActiveClients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeClients = getActiveClients();
  const filteredClients = activeClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Client</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.clientsList}>
            {filteredClients.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientItem,
                  selectedClientId === client.id && styles.selectedClient,
                ]}
                onPress={() => handleSelectClient(client)}
              >
                <View style={styles.clientIcon}>
                  <Building2 size={24} color="#3B82F6" strokeWidth={2} />
                </View>
                
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.contactPerson}>{client.contactPerson}</Text>
                  
                  <View style={styles.clientDetails}>
                    <View style={styles.detailItem}>
                      <MapPin size={14} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.detailText}>{client.address}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Phone size={14} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.detailText}>{client.phone}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredClients.length === 0 && (
            <View style={styles.emptyState}>
              <Building2 size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No clients found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try a different search term' : 'No active clients available'}
              </Text>
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  clientsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clientItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedClient: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  clientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactPerson: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  clientDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});