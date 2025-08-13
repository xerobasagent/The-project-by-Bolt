import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { ArrowLeft, Search, Clock, CreditCard as Edit3, Save, X, Calendar, Building2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { TimeEntry, useTimeTracking } from '@/hooks/useTimeTracking';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';

export default function AdminTimesheetsScreen() {
  const { getAllEntries } = useTimeTracking();
  const { employees } = useAuth();
  const { clients } = useClients();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const allEntries = await getAllEntries();
    // Sort by most recent first
    const sortedEntries = allEntries.sort((a, b) => 
      new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
    );
    setEntries(sortedEntries);
  };

  const getEmployeeName = (entryId: string) => {
    // In a real app, you'd have employee ID in the entry
    // For demo, we'll use a simple mapping
    const employee = employees.find(emp => entryId.startsWith(emp.id));
    return employee?.name || 'Unknown Employee';
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'No Client';
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const filteredEntries = entries.filter(entry => {
    const employeeName = getEmployeeName(entry.id);
    const clientName = getClientName(entry.clientId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      employeeName.toLowerCase().includes(searchLower) ||
      clientName.toLowerCase().includes(searchLower) ||
      entry.date.toLowerCase().includes(searchLower)
    );
  });

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry({ ...entry });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    try {
      // Calculate new duration if times changed
      if (editingEntry.clockOut) {
        const clockInTime = new Date(editingEntry.clockIn).getTime();
        const clockOutTime = new Date(editingEntry.clockOut).getTime();
        const duration = Math.floor((clockOutTime - clockInTime) / (1000 * 60));
        editingEntry.duration = duration;
      }

      // Update the entry in the list
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id ? editingEntry : entry
      );
      setEntries(updatedEntries);

      // In a real app, you'd save to AsyncStorage here
      // await updateTimeEntry(editingEntry);

      setShowEditModal(false);
      setEditingEntry(null);
      Alert.alert('Success', 'Time entry updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update time entry. Please try again.');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const EditModal = () => (
    <Modal visible={showEditModal} animationType="slide" transparent>
      <BlurView intensity={20} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Time Entry</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setEditingEntry(null);
              }}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {editingEntry && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Employee</Text>
                <Text style={styles.readOnlyText}>
                  {getEmployeeName(editingEntry.id)}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Client</Text>
                <Text style={styles.readOnlyText}>
                  {getClientName(editingEntry.clientId)}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Clock In Time</Text>
                <TextInput
                  style={styles.input}
                  value={editingEntry.clockIn}
                  onChangeText={(text) =>
                    setEditingEntry({ ...editingEntry, clockIn: text })
                  }
                  placeholder="2024-01-01T09:00:00.000Z"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Clock Out Time</Text>
                <TextInput
                  style={styles.input}
                  value={editingEntry.clockOut || ''}
                  onChangeText={(text) =>
                    setEditingEntry({ ...editingEntry, clockOut: text })
                  }
                  placeholder="2024-01-01T17:00:00.000Z"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editingEntry.location || ''}
                  onChangeText={(text) =>
                    setEditingEntry({ ...editingEntry, location: text })
                  }
                  placeholder="Work location"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editingEntry.notes || ''}
                  onChangeText={(text) =>
                    setEditingEntry({ ...editingEntry, notes: text })
                  }
                  placeholder="Additional notes"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setShowEditModal(false);
                setEditingEntry(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveEdit}
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
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Timesheets</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#FFFFFF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by employee or client..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {filteredEntries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryInfo}>
                <Text style={styles.employeeName}>
                  {getEmployeeName(entry.id)}
                </Text>
                <View style={styles.entryMeta}>
                  <Calendar size={14} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.entryDate}>
                    {new Date(entry.clockIn).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditEntry(entry)}
              >
                <Edit3 size={20} color="#3B82F6" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.entryDetails}>
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Clock size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.timeLabel}>In: {formatTime(entry.clockIn)}</Text>
                </View>
                {entry.clockOut && (
                  <View style={styles.timeItem}>
                    <Clock size={16} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.timeLabel}>Out: {formatTime(entry.clockOut)}</Text>
                  </View>
                )}
              </View>

              {entry.duration && (
                <View style={styles.durationRow}>
                  <Text style={styles.durationLabel}>Duration:</Text>
                  <Text style={styles.durationValue}>
                    {formatDuration(entry.duration)}
                  </Text>
                </View>
              )}

              {entry.clientId && (
                <View style={styles.clientRow}>
                  <Building2 size={16} color="#3B82F6" strokeWidth={2} />
                  <Text style={styles.clientText}>
                    {getClientName(entry.clientId)}
                  </Text>
                </View>
              )}

              {entry.location && (
                <View style={styles.locationRow}>
                  <Text style={styles.locationText}>📍 {entry.location}</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {filteredEntries.length === 0 && (
          <View style={styles.emptyState}>
            <Clock size={64} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.emptyStateText}>No time entries found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'No time entries available'}
            </Text>
          </View>
        )}
      </ScrollView>

      <EditModal />
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  entryDetails: {
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 24,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  durationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 6,
    fontWeight: '500',
  },
  locationRow: {
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
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
  readOnlyText: {
    fontSize: 16,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
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