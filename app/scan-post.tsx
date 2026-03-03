import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { usePets } from '@/lib/pet-context';
import { PetMatch, PetReport, PetProfile } from '@/lib/types';
import { getPetTypeIcon, getStatusColor, getStatusLabel } from '@/lib/helpers';
import { apiRequest } from '@/lib/query-client';

interface ExtractedInfo {
  isRelevant: boolean;
  status: string;
  petType: string;
  petName: string;
  breed: string;
  size: string;
  color: string;
  markings: string;
  description: string;
  locationName: string;
  contactInfo: string;
  reward: string;
  postSummary: string;
}

export default function ScanPostScreen() {
  const insets = useSafeAreaInsets();
  const { reports, profiles } = usePets();
  const [postText, setPostText] = useState('');
  const [url, setUrl] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedInfo | null>(null);
  const [matches, setMatches] = useState<PetMatch[]>([]);
  const [error, setError] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const handleScan = async () => {
    const content = inputMode === 'text' ? postText.trim() : url.trim();
    if (!content) return;

    setLoading(true);
    setError('');
    setExtracted(null);
    setMatches([]);
    setHasResults(false);

    try {
      const body: any = { reports, profiles };
      if (inputMode === 'text') {
        body.postText = content;
      } else {
        body.url = content;
      }

      const res = await apiRequest('POST', '/api/scan-post', body);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setExtracted(data.extracted || null);
        setMatches(data.matches || []);
        setHasResults(true);
        if (data.message) {
          setError(data.message);
        }
      }
    } catch (e: any) {
      console.error('Scan error:', e);
      setError(e.message?.includes('400') ? 'Could not process that content. Try pasting the post text directly.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPostText('');
    setUrl('');
    setExtracted(null);
    setMatches([]);
    setError('');
    setHasResults(false);
  };

  const getMatchedItem = (match: PetMatch): PetReport | PetProfile | undefined => {
    if (match.type === 'report') {
      return reports.find(r => r.id === match.id);
    }
    return profiles.find(p => p.id === match.id);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return Colors.success;
    if (confidence >= 50) return Colors.accent;
    return Colors.textSecondary;
  };

  const handleMatchPress = (match: PetMatch) => {
    if (match.type === 'report') {
      router.push(`/pet/${match.id}`);
    } else {
      router.push(`/my-pet/${match.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#F97316', '#FB923C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerGradient, { paddingTop: insets.top + webTopPadding + 12 }]}
          >
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
            <View style={styles.headerContent}>
              <View style={styles.scanIcon}>
                <Feather name="search" size={22} color="#fff" />
              </View>
              <Text style={styles.headerTitle}>Scan Online Post</Text>
              <Text style={styles.headerSubtitle}>
                Paste a Facebook post or any online listing about a lost/found pet to find matches
              </Text>
              <View style={styles.aiNotice}>
                <Ionicons name="information-circle" size={13} color="rgba(255,255,255,0.9)" />
                <Text style={styles.aiNoticeText}>AI suggestions only — results are not guaranteed</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.body}>
            {!hasResults ? (
              <>
                <View style={styles.modeToggle}>
                  <Pressable
                    style={[styles.modeBtn, inputMode === 'text' && styles.modeBtnActive]}
                    onPress={() => setInputMode('text')}
                  >
                    <Ionicons name="document-text-outline" size={18} color={inputMode === 'text' ? '#fff' : Colors.textSecondary} />
                    <Text style={[styles.modeBtnText, inputMode === 'text' && styles.modeBtnTextActive]}>Paste Text</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modeBtn, inputMode === 'url' && styles.modeBtnActive]}
                    onPress={() => setInputMode('url')}
                  >
                    <Ionicons name="link-outline" size={18} color={inputMode === 'url' ? '#fff' : Colors.textSecondary} />
                    <Text style={[styles.modeBtnText, inputMode === 'url' && styles.modeBtnTextActive]}>Paste URL</Text>
                  </Pressable>
                </View>

                {inputMode === 'text' ? (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Post Content</Text>
                    <Text style={styles.inputHint}>Copy the text from a Facebook, Instagram, Nextdoor, or any online post about a lost/found pet</Text>
                    <TextInput
                      style={styles.textArea}
                      value={postText}
                      onChangeText={setPostText}
                      placeholder={'Example:\n"LOST DOG - Golden Retriever named Buddy, last seen near Central Park. He has a white patch on his chest and was wearing a blue collar. Please call 555-1234 if found. $200 reward."'}
                      placeholderTextColor={Colors.textLight}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                ) : (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Post URL</Text>
                    <Text style={styles.inputHint}>Paste a link to a public post. Works best with community boards and classifieds (Facebook may block access)</Text>
                    <TextInput
                      style={styles.urlInput}
                      value={url}
                      onChangeText={setUrl}
                      placeholder="https://..."
                      placeholderTextColor={Colors.textLight}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </View>
                )}

                {!!error && !hasResults && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={18} color={Colors.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Pressable
                  onPress={handleScan}
                  disabled={loading || (inputMode === 'text' ? !postText.trim() : !url.trim())}
                  style={({ pressed }) => [
                    styles.scanBtn,
                    pressed && { opacity: 0.9 },
                    (loading || (inputMode === 'text' ? !postText.trim() : !url.trim())) && styles.scanBtnDisabled,
                  ]}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.scanBtnText}>Analyzing Post...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={20} color="#fff" />
                      <Text style={styles.scanBtnText}>Scan & Find Matches</Text>
                    </>
                  )}
                </Pressable>

                <View style={styles.tipsSection}>
                  <Text style={styles.tipsTitle}>Tips for best results</Text>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                    <Text style={styles.tipText}>Include the full post text with all pet details</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                    <Text style={styles.tipText}>Posts mentioning breed, color, and location work best</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                    <Text style={styles.tipText}>Copy text directly from the social media post</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {extracted && extracted.isRelevant && (
                  <Animated.View entering={FadeInUp.duration(400)} style={styles.extractedCard}>
                    <View style={styles.extractedHeader}>
                      <Ionicons name="scan" size={18} color="#F97316" />
                      <Text style={styles.extractedTitle}>Extracted from Post</Text>
                    </View>

                    {!!extracted.postSummary && (
                      <Text style={styles.postSummary}>{extracted.postSummary}</Text>
                    )}

                    <View style={styles.extractedGrid}>
                      <View style={styles.extractedItem}>
                        <Text style={styles.extractedLabel}>Status</Text>
                        <View style={[styles.statusPill, { backgroundColor: extracted.status === 'lost' ? Colors.lostBg : Colors.foundBg }]}>
                          <Text style={[styles.statusPillText, { color: extracted.status === 'lost' ? Colors.lost : Colors.found }]}>
                            {extracted.status?.toUpperCase() || 'UNKNOWN'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.extractedItem}>
                        <Text style={styles.extractedLabel}>Type</Text>
                        <Text style={styles.extractedValue}>{extracted.petType || 'Unknown'}</Text>
                      </View>
                      {extracted.petName && extracted.petName !== 'unknown' && (
                        <View style={styles.extractedItem}>
                          <Text style={styles.extractedLabel}>Name</Text>
                          <Text style={styles.extractedValue}>{extracted.petName}</Text>
                        </View>
                      )}
                      {extracted.breed && extracted.breed !== 'unknown' && (
                        <View style={styles.extractedItem}>
                          <Text style={styles.extractedLabel}>Breed</Text>
                          <Text style={styles.extractedValue}>{extracted.breed}</Text>
                        </View>
                      )}
                      {extracted.color && extracted.color !== 'unknown' && (
                        <View style={styles.extractedItem}>
                          <Text style={styles.extractedLabel}>Color</Text>
                          <Text style={styles.extractedValue}>{extracted.color}</Text>
                        </View>
                      )}
                      {extracted.locationName && extracted.locationName !== 'unknown' && (
                        <View style={styles.extractedItem}>
                          <Text style={styles.extractedLabel}>Location</Text>
                          <Text style={styles.extractedValue}>{extracted.locationName}</Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                )}

                {!!error && (
                  <View style={styles.warningBox}>
                    <Ionicons name="information-circle" size={18} color="#F97316" />
                    <Text style={styles.warningText}>{error}</Text>
                  </View>
                )}

                {matches.length > 0 ? (
                  <View style={styles.matchesSection}>
                    <Text style={styles.matchesTitle}>
                      {matches.length} Potential Match{matches.length !== 1 ? 'es' : ''} Found
                    </Text>

                    {matches.map((match, index) => {
                      const matched = getMatchedItem(match);
                      if (!matched) return null;

                      const isReport = match.type === 'report';
                      const matchedReport = isReport ? (matched as PetReport) : null;
                      const matchedProfile = !isReport ? (matched as PetProfile) : null;

                      const name = isReport
                        ? (matchedReport!.petName === 'Unknown' ? `${matchedReport!.breed} ${matchedReport!.petType}` : matchedReport!.petName)
                        : matchedProfile!.petName;

                      const photoUri = isReport ? matchedReport!.photoUri : (matchedProfile!.photoUris?.[0] || '');
                      const petType = isReport ? matchedReport!.petType : matchedProfile!.petType;
                      const breed = isReport ? matchedReport!.breed : matchedProfile!.breed;
                      const color = isReport ? matchedReport!.color : matchedProfile!.color;

                      return (
                        <Animated.View key={`${match.type}-${match.id}`} entering={FadeInUp.duration(400).delay(index * 80)}>
                          <Pressable
                            style={({ pressed }) => [styles.matchCard, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
                            onPress={() => handleMatchPress(match)}
                          >
                            <View style={styles.matchHeader}>
                              <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(match.confidence) }]}>
                                <Ionicons name="sparkles" size={12} color="#fff" />
                                <Text style={styles.confidenceText}>{match.confidence}%</Text>
                              </View>
                              <View style={[styles.typeBadge, { backgroundColor: isReport ? (matchedReport!.status === 'found' ? Colors.foundBg : Colors.lostBg) : '#F0F0FF' }]}>
                                <Text style={[styles.typeText, { color: isReport ? getStatusColor(matchedReport!.status) : '#6366F1' }]}>
                                  {isReport ? getStatusLabel(matchedReport!.status) : 'REGISTERED'}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.matchBody}>
                              {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.matchImage} contentFit="cover" />
                              ) : (
                                <View style={styles.matchImagePlaceholder}>
                                  <MaterialCommunityIcons name={getPetTypeIcon(petType) as any} size={28} color={Colors.textLight} />
                                </View>
                              )}
                              <View style={styles.matchInfo}>
                                <Text style={styles.matchName} numberOfLines={1}>{name}</Text>
                                <Text style={styles.matchBreed} numberOfLines={1}>{breed} · {color}</Text>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                            </View>

                            <View style={styles.reasonContainer}>
                              <Ionicons name="bulb-outline" size={14} color={Colors.secondary} />
                              <Text style={styles.reasonText}>{match.reason}</Text>
                            </View>
                          </Pressable>
                        </Animated.View>
                      );
                    })}
                  </View>
                ) : (
                  !error && (
                    <View style={styles.noMatchesBox}>
                      <MaterialCommunityIcons name="magnify-close" size={40} color={Colors.textLight} />
                      <Text style={styles.noMatchesTitle}>No Matches Found</Text>
                      <Text style={styles.noMatchesText}>
                        The pet from this post doesn't match any reports or profiles in the app yet. Try adding more reports or check back later.
                      </Text>
                    </View>
                  )
                )}

                <Pressable onPress={handleReset} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.9 }]}>
                  <Ionicons name="refresh" size={18} color={Colors.primary} />
                  <Text style={styles.resetBtnText}>Scan Another Post</Text>
                </Pressable>
              </>
            )}
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
  headerGradient: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerContent: {
    gap: 6,
  },
  scanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  body: {
    padding: 16,
    gap: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: '#F97316',
  },
  modeBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  modeBtnTextActive: {
    color: '#fff',
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  inputHint: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    minHeight: 160,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    lineHeight: 22,
  },
  urlInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.danger,
    lineHeight: 20,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 14,
  },
  scanBtnDisabled: {
    opacity: 0.5,
  },
  scanBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  tipsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  extractedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  extractedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extractedTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  postSummary: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  extractedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extractedItem: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 2,
  },
  extractedLabel: {
    fontSize: 10,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  extractedValue: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#9A3412',
    lineHeight: 20,
  },
  matchesSection: {
    gap: 10,
  },
  matchesTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  matchBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  matchImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchInfo: {
    flex: 1,
    gap: 2,
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
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 10,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noMatchesBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  noMatchesTitle: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  noMatchesText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  resetBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.primary,
  },
  aiNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiNoticeText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.9)',
  },
});
