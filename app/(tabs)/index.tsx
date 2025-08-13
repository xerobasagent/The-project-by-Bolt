import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Clock, Play, Square, MapPin, Calendar, Building2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { TimeEntry, useTimeTracking } from '@/hooks/useTimeTracking';
import { Client, useClients } from '@/hooks/useClients';
import { StatusCard } from '@/components/StatusCard';
import { QuickActions } from '@/components/QuickActions';
import { ClientSelector } from '@/components/ClientSelector';
import { ClientSurvey, SurveyData } from '@/components/ClientSurvey';

const { width } = Dimensions.get('window');

export default function ClockScreen() {
  const {
    isClocked,
    currentEntry,
    clockIn,
    clockOutWithSurvey,
    getTodayEntries,
    getTodayHours,
  } = useTimeTracking();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [todayHours, setTodayHours] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const { getClientById } = useClients();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadTodayData();
  }, [isClocked]);

  const loadTodayData = async () => {
    const entries = await getTodayEntries();
    const hours = await getTodayHours();
    setTodayEntries(entries);
    setTodayHours(hours);
  };

  const handleClockIn = async () => {
    try {
      await clockIn(selectedClient.address, selectedClient.id, selectedClient.name);
      Alert.alert('Success', 'Clocked in successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clock in. Please try again.');
    }
  };

  const handleClockOut = async () => {
    setShowSurvey(true);
  };

  const handleSurveySubmit = async (surveyData: SurveyData) => {
    try {
      await clockOutWithSurvey(surveyData);
      setSelectedClient(null);
      setShowSurvey(false);
      Alert.alert('Success', 'Clocked out successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clock out. Please try again.');
    }
  };

  const handleSurveyCancel = () => {
    setShowSurvey(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWorkingTime = () => {
    if (!isClocked || !currentEntry) return '00:00:00';
    
    const now = new Date();
    const start = new Date(currentEntry.clockIn);
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  // Get current client info if clocked in
  const getCurrentClientInfo = () => {
    if (currentEntry?.clientId) {
      const client = getClientById(currentEntry.clientId);
      return client || { name: currentEntry.clientName || 'Unknown Client' };
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
            </View>
          </View>
        </View>

        {/* Status Cards */}
        <View style={styles.statusContainer}>
          <StatusCard
            title="Today's Hours"
            value={`${todayHours.toFixed(1)}h`}
            icon={<Clock size={24} color="#3B82F6" strokeWidth={2} />}
            backgroundColor="#EFF6FF"
          />
          <StatusCard
            title="Status"
            value={isClocked ? 'Clocked In' : 'Clocked Out'}
            icon={
              isClocked ? (
                <Play size={24} color="#10B981" strokeWidth={2} />
              ) : (
                <Square size={24} color="#6B7280" strokeWidth={2} />
              )
            }
            backgroundColor={isClocked ? '#ECFDF5' : '#F9FAFB'}
          />
        </View>

        {/* Working Time Display */}
        {isClocked && (
          <BlurView intensity={20} style={styles.workingTimeContainer}>
            <Text style={styles.workingTimeLabel}>Working Time</Text>
            <Text style={styles.workingTimeValue}>{getWorkingTime()}</Text>
            {currentEntry && (
              <View style={styles.workingInfo}>
                <View style={styles.clockInInfo}>
                  <MapPin size={14} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.clockInText}>
                    Clocked in at {new Date(currentEntry.clockIn).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
                {getCurrentClientInfo() && (
                  <View style={styles.clientInfo}>
                    <Building2 size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.clientText}>
                      {getCurrentClientInfo()?.name}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </BlurView>
        )}

        {/* Clock In/Out Button */}
        <View style={styles.clockButtonContainer}>
          {!isClocked && selectedClient && (
            <View style={styles.selectedClientCard}>
              <Building2 size={20} color="#3B82F6" strokeWidth={2} />
              <View style={styles.selectedClientInfo}>
                <Text style={styles.selectedClientName}>{selectedClient.name}</Text>
                <Text style={styles.selectedClientContact}>{selectedClient.contactPerson}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedClient(null)}
                style={styles.changeClientButton}
              >
                <Text style={styles.changeClientText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.clockButton,
              { backgroundColor: isClocked ? '#EF4444' : selectedClient ? '#10B981' : '#6B7280' },
            ]}
            onPress={isClocked ? handleClockOut : selectedClient ? handleClockIn : () => setShowClientSelector(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isClocked
                  ? ['#EF4444', '#DC2626']
                  : selectedClient 
                    ? ['#10B981', '#059669']
                    : ['#6B7280', '#4B5563']
              }
              style={styles.clockButtonGradient}
            >
              {isClocked ? (
                <Square size={32} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <Play size={32} color="#FFFFFF" strokeWidth={2.5} />
              )}
              <Text style={styles.clockButtonText}>
                {isClocked ? 'Clock Out' : selectedClient ? `Clock In at ${selectedClient.name}` : 'Select Client to Clock In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <QuickActions todayEntries={todayEntries} />
        
        {/* Client Selector Modal */}
        <ClientSelector
          visible={showClientSelector}
          onClose={() => setShowClientSelector(false)}
          onSelectClient={handleSelectClient}
          selectedClientId={selectedClient?.id}
        />

        {/* Client Survey Modal */}
        <ClientSurvey
          visible={showSurvey}
          clientName={getCurrentClientInfo()?.name || 'Unknown Client'}
          onSubmit={handleSurveySubmit}
          onCancel={handleSurveyCancel}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  dateTimeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  workingTimeContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  workingTimeLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  workingTimeValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  workingInfo: {
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  clockInInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockInText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    opacity: 0.8,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    opacity: 0.9,
    fontWeight: '600',
  },
  clockButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  selectedClientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedClientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedClientContact: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  changeClientButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  changeClientText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  clockButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  clockButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  clockButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});