import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/query-client';
import { fetch } from 'expo/fetch';
import type { OrgType } from '@/lib/types';

const ORG_TYPES: { value: OrgType; label: string; icon: string }[] = [
  { value: 'vet', label: 'Vet Clinic', icon: 'medical-bag' },
  { value: 'shelter', label: 'Shelter', icon: 'home-heart' },
  { value: 'rescue', label: 'Rescue', icon: 'hand-heart' },
];

export default function RegisterOrgScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('vet');
  const [abn, setAbn] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if (Platform.OS === 'web') {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to detect your GPS position.');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLatitude(loc.coords.latitude.toFixed(6));
        setLongitude(loc.coords.longitude.toFixed(6));
      }
    } catch {
      Alert.alert('Error', 'Could not detect location. Please enter coordinates manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Organisation name is required.';
    if (!address.trim()) return 'Address is required.';
    if (!phone.trim()) return 'Phone number is required.';
    if (!email.trim()) return 'Email is required.';
    if (!latitude.trim() || !longitude.trim()) return 'GPS location is required. Use the detect button or enter manually.';
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) return 'Latitude and longitude must be valid numbers.';
    if (lat < -90 || lat > 90) return 'Latitude must be between -90 and 90.';
    if (lng < -180 || lng > 180) return 'Longitude must be between -180 and 180.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL('/api/org/register', baseUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          type: orgType,
          abn: abn.trim() || undefined,
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website: website.trim() || undefined,
          description: description.trim() || undefined,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(body.message || 'Registration failed');
      }

      setSubmitted(true);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn} testID="back-button-success">
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Registration Submitted</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.secondary} />
          </View>
          <Text style={styles.successTitle}>Pending Approval</Text>
          <Text style={styles.successMessage}>
            Your organisation registration has been submitted successfully. Our team will review your application and you will be notified once approved.
          </Text>
          <Pressable
            style={styles.successBtn}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')}
            testID="go-back-button"
          >
            <Text style={styles.successBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn} testID="back-button">
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Register Organisation</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + webBottomPadding + 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organisation Details</Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Organisation name"
              placeholderTextColor={Colors.textLight}
              testID="org-name-input"
            />

            <Text style={styles.label}>Type *</Text>
            <View style={styles.typeRow}>
              {ORG_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  style={[styles.typeChip, orgType === t.value && styles.typeChipActive]}
                  onPress={() => setOrgType(t.value)}
                  testID={`org-type-${t.value}`}
                >
                  <MaterialCommunityIcons
                    name={t.icon as any}
                    size={18}
                    color={orgType === t.value ? '#fff' : Colors.textSecondary}
                  />
                  <Text style={[styles.typeChipText, orgType === t.value && styles.typeChipTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>ABN</Text>
            <TextInput
              style={styles.input}
              value={abn}
              onChangeText={setAbn}
              placeholder="Australian Business Number (optional)"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
              testID="org-abn-input"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Full street address"
              placeholderTextColor={Colors.textLight}
              testID="org-address-input"
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Contact phone number"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
              testID="org-phone-input"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Contact email"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="org-email-input"
            />

            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com (optional)"
              placeholderTextColor={Colors.textLight}
              keyboardType="url"
              autoCapitalize="none"
              testID="org-website-input"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of your organisation (optional)"
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              testID="org-description-input"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GPS Location</Text>

            <Pressable
              style={styles.detectBtn}
              onPress={detectLocation}
              disabled={isDetectingLocation}
              testID="detect-location-button"
            >
              {isDetectingLocation ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="locate" size={20} color="#fff" />
              )}
              <Text style={styles.detectBtnText}>
                {isDetectingLocation ? 'Detecting...' : 'Detect My Location'}
              </Text>
            </Pressable>

            <View style={styles.coordRow}>
              <View style={styles.coordField}>
                <Text style={styles.label}>Latitude *</Text>
                <TextInput
                  style={styles.input}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="-33.8688"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="numeric"
                  testID="org-latitude-input"
                />
              </View>
              <View style={styles.coordField}>
                <Text style={styles.label}>Longitude *</Text>
                <TextInput
                  style={styles.input}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="151.2093"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="numeric"
                  testID="org-longitude-input"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Pressable
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              testID="submit-button"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Submit Registration</Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  typeChipText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: '#fff',
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 13,
  },
  detectBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  coordRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coordField: {
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIconWrap: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  successBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  successBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});
