import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Star, MessageSquare, X, Send, Building2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export interface SurveyData {
  clientRating: number;
  workQuality: number;
  communication: number;
  workEnvironment: number;
  comments: string;
  wouldReturnToClient: boolean;
}

interface ClientSurveyProps {
  visible: boolean;
  clientName: string;
  onSubmit: (surveyData: SurveyData) => void;
  onCancel: () => void;
}

export function ClientSurvey({ visible, clientName, onSubmit, onCancel }: ClientSurveyProps) {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    clientRating: 0,
    workQuality: 0,
    communication: 0,
    workEnvironment: 0,
    comments: '',
    wouldReturnToClient: false,
  });

  const handleSubmit = () => {
    if (surveyData.clientRating === 0) {
      Alert.alert('Required Field', 'Please rate your overall experience with the client.');
      return;
    }

    onSubmit(surveyData);
    
    // Reset survey data
    setSurveyData({
      clientRating: 0,
      workQuality: 0,
      communication: 0,
      workEnvironment: 0,
      comments: '',
      wouldReturnToClient: false,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Survey',
      'You must complete the client survey to clock out. Are you sure you want to cancel?',
      [
        { text: 'Continue Survey', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: () => {
            // Reset survey data
            setSurveyData({
              clientRating: 0,
              workQuality: 0,
              communication: 0,
              workEnvironment: 0,
              comments: '',
              wouldReturnToClient: false,
            });
            onCancel();
          }
        },
      ]
    );
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    label 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void;
    label: string;
  }) => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? '#F59E0B' : '#D1D5DB'}
              fill={star <= rating ? '#F59E0B' : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Building2 size={24} color="#3B82F6" strokeWidth={2} />
              <View style={styles.headerText}>
                <Text style={styles.title}>Client Survey</Text>
                <Text style={styles.subtitle}>{clientName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Please rate your experience today</Text>

            {/* Overall Client Rating */}
            <StarRating
              rating={surveyData.clientRating}
              onRatingChange={(rating) => setSurveyData({ ...surveyData, clientRating: rating })}
              label="Overall Client Experience *"
            />

            {/* Work Quality */}
            <StarRating
              rating={surveyData.workQuality}
              onRatingChange={(rating) => setSurveyData({ ...surveyData, workQuality: rating })}
              label="Work Quality & Organization"
            />

            {/* Communication */}
            <StarRating
              rating={surveyData.communication}
              onRatingChange={(rating) => setSurveyData({ ...surveyData, communication: rating })}
              label="Client Communication"
            />

            {/* Work Environment */}
            <StarRating
              rating={surveyData.workEnvironment}
              onRatingChange={(rating) => setSurveyData({ ...surveyData, workEnvironment: rating })}
              label="Work Environment & Safety"
            />

            {/* Would Return */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionLabel}>Would you work with this client again?</Text>
              <View style={styles.yesNoContainer}>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    surveyData.wouldReturnToClient && styles.yesNoButtonActive,
                  ]}
                  onPress={() => setSurveyData({ ...surveyData, wouldReturnToClient: true })}
                >
                  <Text
                    style={[
                      styles.yesNoButtonText,
                      surveyData.wouldReturnToClient && styles.yesNoButtonTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    !surveyData.wouldReturnToClient && styles.yesNoButtonActive,
                  ]}
                  onPress={() => setSurveyData({ ...surveyData, wouldReturnToClient: false })}
                >
                  <Text
                    style={[
                      styles.yesNoButtonText,
                      !surveyData.wouldReturnToClient && styles.yesNoButtonTextActive,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Comments */}
            <View style={styles.commentsContainer}>
              <Text style={styles.commentsLabel}>Additional Comments (Optional)</Text>
              <TextInput
                style={styles.commentsInput}
                value={surveyData.comments}
                onChangeText={(text) => setSurveyData({ ...surveyData, comments: text })}
                placeholder="Share any additional feedback about your experience..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelActionButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelActionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.submitButtonGradient}
              >
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.submitButtonText}>Submit & Clock Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  yesNoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  yesNoButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  yesNoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  yesNoButtonTextActive: {
    color: '#3B82F6',
  },
  commentsContainer: {
    marginBottom: 24,
  },
  commentsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    height: 100,
  },
  actions: {
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
  cancelActionButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});