import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { usePets } from '@/lib/pet-context';
import { PetMatch, PetReport, PetProfile } from '@/lib/types';
import { getPetTypeIcon, getStatusColor, getStatusLabel } from '@/lib/helpers';
import { apiRequest } from '@/lib/query-client';
import { PetType } from '@/lib/types';

export default function QuickSnapScreen() {
  const insets = useSafeAreaInsets();
  const { reports, profiles, getReport, getProfile } = usePets();
  const [photoUri, setPhotoUri] = useState('');
  const [petType, setPetType] = useState<PetType | ''>('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<PetMatch[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is needed to snap a photo of the pet.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const mimeType = asset.mimeType || 'image/jpeg';
        setPhotoUri(`data:${mimeType};base64,${asset.base64}`);
      } else {
        setPhotoUri(asset.uri);
      }
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const mimeType = asset.mimeType || 'image/jpeg';
        setPhotoUri(`data:${mimeType};base64,${asset.base64}`);
      } else {
        setPhotoUri(asset.uri);
      }
    }
  };

  const handleMatch = async () => {
    if (!photoUri) {
      Alert.alert('No photo', 'Please take or select a photo of the pet first.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setLoading(true);
    setError('');
    setMatches([]);
    setHasSearched(true);

    try {
      const response = await apiRequest('POST', '/api/quick-snap-match', {
        photoUri,
        petType: petType || undefined,
        reports,
        profiles,
      });
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to find matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToMatch = (match: PetMatch) => {
    if (match.type === 'report') {
      router.push({ pathname: '/pet/[id]', params: { id: match.id } });
    } else {
      router.push({ pathname: '/my-pet/[id]', params: { id: match.id } });
    }
  };

  const getMatchDetails = (match: PetMatch) => {
    if (match.type === 'report') {
      const report = reports.find(r => r.id === match.id);
      return report ? { name: report.petName, breed: report.breed, photo: report.photoUris?.[0] || report.photoUri, status: report.status, type: report.petType } : null;
    }
    const profile = profiles.find(p => p.id === match.id);
    return profile ? { name: profile.petName, breed: profile.breed, photo: profile.photoUris?.[0], status: 'registered', type: profile.petType } : null;
  };

  const petTypes: { key: PetType | ''; label: string; icon: string }[] = [
    { key: '', label: 'Any', icon: 'paw' },
    { key: 'dog', label: 'Dog', icon: 'dog' },
    { key: 'cat', label: 'Cat', icon: 'cat' },
    { key: 'bird', label: 'Bird', icon: 'bird' },
    { key: 'rabbit', label: 'Rabbit', icon: 'rabbit' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.secondary, Colors.secondaryLight]}
        style={[styles.header, { paddingTop: insets.top + webTopPadding + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Quick Snap</Text>
            <Text style={styles.headerSubtitle}>Snap a photo to identify a pet</Text>
          </View>
          <MaterialCommunityIcons name="camera-iris" size={28} color="rgba(255,255,255,0.6)" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={styles.content}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="fingerprint" size={20} color={Colors.secondary} />
            <Text style={styles.infoText}>
              Spotted a pet? Snap a quick photo and our AI will compare it against lost pet reports and registered profiles, including biometric ID scans.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Pet Photo</Text>
          {photoUri ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} contentFit="cover" />
              <Pressable onPress={() => setPhotoUri('')} style={styles.clearPhotoBtn}>
                <Ionicons name="close-circle" size={28} color={Colors.danger} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoActions}>
              <Pressable onPress={takePhoto} style={styles.photoActionBtn}>
                <LinearGradient colors={[Colors.secondary, Colors.secondaryLight]} style={styles.photoActionGradient}>
                  <MaterialCommunityIcons name="camera" size={32} color="#fff" />
                  <Text style={styles.photoActionLabel}>Take Photo</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={pickFromGallery} style={styles.photoActionBtn}>
                <View style={styles.photoActionOutline}>
                  <Ionicons name="images" size={32} color={Colors.secondary} />
                  <Text style={[styles.photoActionLabel, { color: Colors.secondary }]}>Gallery</Text>
                </View>
              </Pressable>
            </View>
          )}

          <Text style={styles.sectionLabel}>Pet Type (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typePills}>
            {petTypes.map(pt => (
              <Pressable
                key={pt.key}
                onPress={() => setPetType(pt.key)}
                style={[styles.typePill, petType === pt.key && styles.typePillActive]}
              >
                <MaterialCommunityIcons
                  name={pt.icon as any}
                  size={16}
                  color={petType === pt.key ? '#fff' : Colors.textSecondary}
                />
                <Text style={[styles.typePillText, petType === pt.key && styles.typePillTextActive]}>
                  {pt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={handleMatch}
            disabled={loading || !photoUri}
            style={({ pressed }) => [
              styles.matchBtn,
              (!photoUri || loading) && styles.matchBtnDisabled,
              pressed && { opacity: 0.9 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="magnify-scan" size={22} color="#fff" />
                <Text style={styles.matchBtnText}>Find Matches</Text>
              </>
            )}
          </Pressable>

          {loading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={Colors.secondary} size="large" />
              <Text style={styles.loadingText}>Analysing photo with AI biometric matching...</Text>
              <Text style={styles.loadingSubtext}>Comparing nose prints, eye patterns, and facial features</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={20} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {hasSearched && !loading && matches.length === 0 && !error && (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="magnify-close" size={40} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No matches found</Text>
              <Text style={styles.emptySubtext}>
                Try a clearer photo, or report this pet as found so owners can find it.
              </Text>
              <Pressable
                onPress={() => router.push('/report-form')}
                style={styles.reportFoundBtn}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.found} />
                <Text style={styles.reportFoundText}>Report as Found</Text>
              </Pressable>
            </View>
          )}

          {matches.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                {matches.length} Potential Match{matches.length > 1 ? 'es' : ''}
              </Text>
              {matches.map((match, idx) => {
                const details = getMatchDetails(match);
                if (!details) return null;
                return (
                  <Animated.View key={match.id} entering={FadeInUp.delay(idx * 80).duration(300)}>
                    <Pressable
                      onPress={() => navigateToMatch(match)}
                      style={({ pressed }) => [styles.matchCard, pressed && { opacity: 0.95 }]}
                    >
                      <View style={styles.matchCardTop}>
                        {details.photo ? (
                          <Image source={{ uri: details.photo }} style={styles.matchPhoto} contentFit="cover" />
                        ) : (
                          <View style={styles.matchPhotoPlaceholder}>
                            <MaterialCommunityIcons name={getPetTypeIcon(details.type) as any} size={24} color={Colors.textLight} />
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.matchName}>{details.name}</Text>
                          <Text style={styles.matchBreed}>{details.breed}</Text>
                          <View style={styles.matchBadgeRow}>
                            <View style={[styles.typeBadge, { backgroundColor: match.type === 'report' ? Colors.lostBg : Colors.foundBg }]}>
                              <Text style={[styles.typeBadgeText, { color: match.type === 'report' ? Colors.lost : Colors.found }]}>
                                {match.type === 'report' ? 'Lost Report' : 'Registered Pet'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.confidenceCircle}>
                          <Text style={[styles.confidenceValue, {
                            color: match.confidence >= 70 ? Colors.success : match.confidence >= 50 ? Colors.accent : Colors.textSecondary,
                          }]}>{match.confidence}%</Text>
                        </View>
                      </View>
                      <Text style={styles.matchReason}>{match.reason}</Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          )}

          <View style={styles.disclaimerCard}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textLight} />
            <Text style={styles.disclaimerText}>
              AI matching provides suggestions only. Always verify identity with the pet's owner or vet. Biometric visual matching enhances accuracy but is not a definitive identification.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.foundBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  photoPreview: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  clearPhotoBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoActionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
    borderRadius: 16,
  },
  photoActionOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
    backgroundColor: Colors.foundBg,
  },
  photoActionLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  typePills: {
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typePillActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  typePillText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  typePillTextActive: {
    color: '#fff',
  },
  matchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  matchBtnDisabled: {
    opacity: 0.5,
  },
  matchBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  loadingCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.lostBg,
    padding: 14,
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.danger,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  reportFoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: Colors.foundBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  reportFoundText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.found,
  },
  resultsSection: {
    gap: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  matchCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchPhoto: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  matchPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  matchBreed: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  matchBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    textTransform: 'uppercase',
  },
  confidenceCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceValue: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  matchReason: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    lineHeight: 16,
  },
});
