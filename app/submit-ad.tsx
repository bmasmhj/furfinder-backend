import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/query-client';
import { fetch } from 'expo/fetch';

const BUSINESS_TYPES: { key: string; label: string; icon: string }[] = [
  { key: 'vet', label: 'Vet Clinic', icon: 'medkit' },
  { key: 'pet_shop', label: 'Pet Shop', icon: 'storefront' },
  { key: 'groomer', label: 'Groomer', icon: 'cut' },
  { key: 'pet_food', label: 'Pet Food', icon: 'nutrition' },
  { key: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { key: 'training', label: 'Training', icon: 'fitness' },
  { key: 'boarding', label: 'Boarding', icon: 'home' },
  { key: 'other', label: 'Other', icon: 'business' },
];

export default function SubmitAdScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('other');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      if (!canAskAgain) {
        Alert.alert('Permission Needed', 'Please enable photo access in your device Settings to upload an ad image.', [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Permission Needed', 'We need access to your photos to upload an ad image.');
      }
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImageUri(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!businessName.trim()) {
      setError('Please enter your business name.');
      return;
    }
    if (!imageUri) {
      setError('Please upload an ad image.');
      return;
    }
    if (!contactEmail.trim()) {
      setError('Please enter a contact email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(new URL('/api/ads/submit', getApiUrl()).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType,
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          website: website.trim(),
          linkUrl: linkUrl.trim(),
          description: description.trim(),
          imageUri,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit');
      }
      setShowSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Failed to submit ad. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Ad Submitted!</Text>
          <Text style={styles.successText}>
            Your ad has been submitted for review. Our team will review it and you'll be notified once it's approved. This usually takes 1–2 business days.
          </Text>
          <Pressable
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')}
            style={[styles.successBtn, { backgroundColor: Colors.secondary }]}
          >
            <Text style={styles.successBtnText}>Back to App</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Advertise with Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + webBottomPadding + 40 }}
      >
        <View style={styles.introCard}>
          <Ionicons name="megaphone" size={28} color={Colors.secondary} />
          <Text style={styles.introTitle}>Reach Pet Owners in Australia</Text>
          <Text style={styles.introText}>
            Promote your pet business to thousands of engaged pet owners. Your ad will appear in the app's home feed, reaching people who care deeply about their pets.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Business Name *</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="e.g. Happy Paws Vet Clinic"
          placeholderTextColor={Colors.textLight}
        />

        <Text style={styles.sectionLabel}>Business Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={styles.chipRow}>
            {BUSINESS_TYPES.map((bt) => (
              <Pressable
                key={bt.key}
                onPress={() => setBusinessType(bt.key)}
                style={[styles.chip, businessType === bt.key && { backgroundColor: Colors.secondary, borderColor: Colors.secondary }]}
              >
                <Ionicons name={bt.icon as any} size={14} color={businessType === bt.key ? '#fff' : Colors.textSecondary} />
                <Text style={[styles.chipText, businessType === bt.key && { color: '#fff' }]}>{bt.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.sectionLabel}>Ad Image *</Text>
        <Pressable onPress={pickImage} style={styles.imageUpload}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={Colors.textLight} />
              <Text style={styles.imagePlaceholderText}>Tap to upload ad image</Text>
              <Text style={styles.imagePlaceholderHint}>Recommended: 16:9 ratio (e.g. 1200×675px)</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.sectionLabel}>Ad Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell pet owners about your business..."
          placeholderTextColor={Colors.textLight}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.sectionLabel}>Link URL</Text>
        <TextInput
          style={styles.input}
          value={linkUrl}
          onChangeText={setLinkUrl}
          placeholder="https://www.yourbusiness.com.au"
          placeholderTextColor={Colors.textLight}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Contact Details</Text>
        <TextInput
          style={styles.input}
          value={contactName}
          onChangeText={setContactName}
          placeholder="Contact person name"
          placeholderTextColor={Colors.textLight}
        />
        <TextInput
          style={styles.input}
          value={contactEmail}
          onChangeText={setContactEmail}
          placeholder="Contact email *"
          placeholderTextColor={Colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={contactPhone}
          onChangeText={setContactPhone}
          placeholder="Phone number"
          placeholderTextColor={Colors.textLight}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          value={website}
          onChangeText={setWebsite}
          placeholder="Website (optional)"
          placeholderTextColor={Colors.textLight}
          keyboardType="url"
          autoCapitalize="none"
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && { opacity: 0.9 },
            isSubmitting && { opacity: 0.6 },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Ad for Review</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.pricingNote}>
          Our team will review your submission and reach out to discuss pricing and duration. Ads start from $50/month.
        </Text>
      </ScrollView>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  introTitle: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  introText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  imageUpload: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    gap: 6,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  imagePlaceholderHint: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.danger,
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  pricingNote: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  successBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  successBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});
