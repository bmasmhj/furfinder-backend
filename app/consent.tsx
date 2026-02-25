import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useConsent } from '@/lib/consent-context';

export default function ConsentScreen() {
  const insets = useSafeAreaInsets();
  const { acceptConsent } = useConsent();
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [aiChecked, setAiChecked] = useState(false);
  const [dataStorageChecked, setDataStorageChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const allChecked = privacyChecked && termsChecked && aiChecked && dataStorageChecked;

  const handleAccept = async () => {
    if (!allChecked || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await acceptConsent();
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save consent', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="paw" size={48} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Welcome to PetReunite</Text>
          <Text style={styles.subtitle}>
            Before you start, please review and accept our policies to use the app.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>What we need from you</Text>

            <View style={styles.summaryItem}>
              <Ionicons name="person-outline" size={20} color={Colors.secondary} />
              <Text style={styles.summaryText}>
                Your name and phone number to create pet reports so others can contact you
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Ionicons name="location-outline" size={20} color={Colors.secondary} />
              <Text style={styles.summaryText}>
                GPS location (only when you choose) to mark where a pet was lost or found
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Ionicons name="camera-outline" size={20} color={Colors.secondary} />
              <Text style={styles.summaryText}>
                Pet photos to help identify and match lost and found pets
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Ionicons name="sparkles-outline" size={20} color={Colors.secondary} />
              <Text style={styles.summaryText}>
                AI matching analyses pet descriptions to suggest potential matches (not guaranteed)
              </Text>
            </View>
          </View>

          <View style={styles.checkboxSection}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setPrivacyChecked(!privacyChecked)}
            >
              <View style={[styles.checkbox, privacyChecked && styles.checkboxChecked]}>
                {privacyChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I have read and agree to the{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/privacy-policy')}
                >
                  Privacy Policy
                </Text>
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setTermsChecked(!termsChecked)}
            >
              <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
                {termsChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I have read and agree to the{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/terms-of-use')}
                >
                  Terms of Use
                </Text>
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setAiChecked(!aiChecked)}
            >
              <View style={[styles.checkbox, aiChecked && styles.checkboxChecked]}>
                {aiChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I understand that AI matching provides suggestions only and is not guaranteed to be accurate
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setDataStorageChecked(!dataStorageChecked)}
            >
              <View style={[styles.checkbox, dataStorageChecked && styles.checkboxChecked]}>
                {dataStorageChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I consent to my data being stored securely on our servers in accordance with the Australian Privacy Act 1988
              </Text>
            </Pressable>
          </View>

          <View style={styles.noticeCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
            <Text style={styles.noticeText}>
              Your data is stored securely on our cloud servers with encryption. You can delete it at any time from Settings. We comply with the Australian Privacy Act 1988.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + webBottomPadding + 16 }]}>
        <Pressable
          style={[styles.acceptBtn, !allChecked && styles.acceptBtnDisabled]}
          onPress={handleAccept}
          disabled={!allChecked || isSubmitting}
        >
          <Text style={[styles.acceptBtnText, !allChecked && styles.acceptBtnTextDisabled]}>
            {isSubmitting ? 'Getting started...' : 'Accept & Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  checkboxSection: {
    gap: 16,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    lineHeight: 21,
  },
  link: {
    color: Colors.secondary,
    fontFamily: 'Poppins_600SemiBold',
    textDecorationLine: 'underline',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#065F46',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptBtnDisabled: {
    backgroundColor: Colors.borderLight,
  },
  acceptBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  acceptBtnTextDisabled: {
    color: Colors.textLight,
  },
});
