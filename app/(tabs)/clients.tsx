import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Building2, Plus, Search, MapPin, Phone, Mail, CreditCard as Edit3, Trash2, X, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Client, useClients } from '@/hooks/useClients';

export default function ClientsScreen() {
  const { clients, addClient, updateClient, deleteClient, loadClients } = useClients();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    isActive: true,
  });

  useEffect(() => {
    loadClients();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async () => {
    if (!newClient.name.trim() || !newClient.contactPerson.trim()) {
      Alert.alert('Error', 'Please fill in at least the client name and contact person.');
      return;
    }

    try {
      await addClient(newClient);
      setNewClient({
        name: '',
        address: '',
        contactPerson: '',
        phone: '',
        email: '',
        isActive: true,
      });
      setShowAddModal(false);
      Alert.alert('Success', 'Client added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add client. Please try again.');
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    try {
      await updateClient(editingClient.id, editingClient);
      setEditingClient(null);
      Alert.alert('Success', 'Client updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update client. Please try again.');
    }
  };

  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(client.id);
              Alert.alert('Success', 'Client deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete client. Please try again.');
            }
          },
        },
      ]
    );
  };

  const ClientModal = ({ visible, onClose, client, onSave, title }: {
    visible: boolean;
    onClose: () => void;
    client: any;
    onSave: () => void;
    title: string;
  }) => (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Client Name *</Text>
              <TextInput
                style={styles.input}
                value={client.name}
                onChangeText={(text) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, name: text })
                    : setNewClient({ ...newClient, name: text })
                }
                placeholder="Enter client name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Person *</Text>
              <TextInput
                style={styles.input}
                value={client.contactPerson}
                onChangeText={(text) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, contactPerson: text })
                    : setNewClient({ ...newClient, contactPerson: text })
                }
                placeholder="Enter contact person name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={client.address}
                onChangeText={(text) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, address: text })
                    : setNewClient({ ...newClient, address: text })
                }
                placeholder="Enter client address"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={client.phone}
                onChangeText={(text) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, phone: text })
                    : setNewClient({ ...newClient, phone: text })
                }
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={client.email}
                onChangeText={(text) => 
                  editingClient 
                    ? setEditingClient({ ...editingClient, email: text })
                    : setNewClient({ ...newClient, email: text })
                }
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={onSave}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.saveButtonGradient}
              >
                <Save size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Clients</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#FFFFFF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clients.length}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clients.filter(c => c.isActive).length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Building2 size={64} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Add your first client to get started'
              }
            </Text>
          </View>
        ) : (
          filteredClients.map((client) => (
            <View key={client.id} style={styles.clientCard}>
              <View style={styles.clientHeader}>
                <View style={styles.clientIcon}>
                  <Building2 size={24} color="#3B82F6" strokeWidth={2} />
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.contactPerson}>{client.contactPerson}</Text>
                </View>
                <View style={styles.clientActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => setEditingClient(client)}
                  >
                    <Edit3 size={20} color="#6B7280" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDeleteClient(client)}
                  >
                    <Trash2 size={20} color="#EF4444" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.clientDetails}>
                {client.address && (
                  <View style={styles.detailItem}>
                    <MapPin size={16} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.detailText}>{client.address}</Text>
                  </View>
                )}
                {client.phone && (
                  <View style={styles.detailItem}>
                    <Phone size={16} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.detailText}>{client.phone}</Text>
                  </View>
                )}
                {client.email && (
                  <View style={styles.detailItem}>
                    <Mail size={16} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.detailText}>{client.email}</Text>
                  </View>
                )}
              </View>

              <View style={styles.clientFooter}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: client.isActive ? '#D1FAE5' : '#FEE2E2' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: client.isActive ? '#065F46' : '#991B1B' }
                  ]}>
                    {client.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Client Modal */}
      <ClientModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewClient({
            name: '',
            address: '',
            contactPerson: '',
            phone: '',
            email: '',
            isActive: true,
          });
        }}
        client={newClient}
        onSave={handleAddClient}
        title="Add New Client"
      />

      {/* Edit Client Modal */}
      <ClientModal
        visible={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient || {}}
        onSave={handleUpdateClient}
        title="Edit Client"
      />
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactPerson: {
    fontSize: 14,
    color: '#6B7280',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  clientDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  clientFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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