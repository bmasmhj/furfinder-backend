import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Alert, ActivityIndicator, Switch } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/query-client';
import { fetch } from 'expo/fetch';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  approved: { bg: '#D1FAE5', text: '#059669', label: 'Active' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Rejected' },
  paused: { bg: '#E0E7FF', text: '#6366F1', label: 'Paused' },
  expired: { bg: '#F3F4F6', text: '#6B7280', label: 'Expired' },
};

const BUSINESS_LABELS: Record<string, string> = {
  vet: 'Vet Clinic',
  pet_shop: 'Pet Shop',
  groomer: 'Groomer',
  pet_food: 'Pet Food',
  insurance: 'Insurance',
  training: 'Training',
  boarding: 'Boarding',
  other: 'Pet Services',
};

export default function AdminAdsScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const [ads, setAds] = useState<any[]>([]);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchAds = async () => {
    try {
      const res = await fetch(new URL('/api/admin/ads/all', getApiUrl()).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads);
        setAdsEnabled(data.adsEnabled);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleApprove = (id: string) => {
    Alert.alert('Approve Ad', 'How long should this ad run?', [
      { text: 'Cancel', style: 'cancel' },
      { text: '30 Days', onPress: () => approveAd(id, 30) },
      { text: '60 Days', onPress: () => approveAd(id, 60) },
      { text: '90 Days', onPress: () => approveAd(id, 90) },
    ]);
  };

  const approveAd = async (id: string, days: number) => {
    setActionLoading(id);
    try {
      await fetch(new URL(`/api/admin/ads/${id}/approve`, getApiUrl()).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ durationDays: days }),
      });
      Alert.alert('Approved', `Ad approved for ${days} days.`);
      fetchAds();
    } catch {
      Alert.alert('Error', 'Failed to approve ad.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Ad', 'Are you sure you want to reject this ad?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive', onPress: async () => {
          setActionLoading(id);
          try {
            await fetch(new URL(`/api/admin/ads/${id}/reject`, getApiUrl()).toString(), {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Rejected', 'Ad has been rejected.');
            fetchAds();
          } catch {
            Alert.alert('Error', 'Failed to reject ad.');
          } finally {
            setActionLoading(null);
          }
        }
      },
    ]);
  };

  const handlePauseResume = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'approved' ? 'pause' : 'resume';
    setActionLoading(id);
    try {
      await fetch(new URL(`/api/admin/ads/${id}/${action}`, getApiUrl()).toString(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAds();
    } catch {
      Alert.alert('Error', `Failed to ${action} ad.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Ad', 'This will permanently remove this ad. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setActionLoading(id);
          try {
            await fetch(new URL(`/api/admin/ads/${id}`, getApiUrl()).toString(), {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchAds();
          } catch {
            Alert.alert('Error', 'Failed to delete ad.');
          } finally {
            setActionLoading(null);
          }
        }
      },
    ]);
  };

  const handleToggleAds = async (enabled: boolean) => {
    try {
      await fetch(new URL('/api/admin/ads/toggle', getApiUrl()).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled }),
      });
      setAdsEnabled(enabled);
      Alert.alert(enabled ? 'Ads Enabled' : 'Ads Disabled', enabled ? 'Ads are now showing in the app.' : 'All ads have been hidden from users.');
    } catch {
      Alert.alert('Error', 'Failed to toggle ads.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.accessDenied}>
          <Ionicons name="lock-closed" size={48} color={Colors.textLight} />
          <Text style={styles.accessDeniedText}>Admin access required</Text>
        </View>
      </View>
    );
  }

  const filteredAds = filter === 'all' ? ads : ads.filter(a => a.status === filter);
  const pendingCount = ads.filter(a => a.status === 'pending').length;
  const activeCount = ads.filter(a => a.status === 'approved').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Ads</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomPadding + 40 }}
      >
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Ads Enabled</Text>
              <Text style={styles.toggleHint}>Turn off to hide all ads from users</Text>
            </View>
            <Switch
              value={adsEnabled}
              onValueChange={handleToggleAds}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#D97706' }]}>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#059669' }]}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, { borderColor: Colors.textLight }]}>
            <Text style={[styles.statNumber, { color: Colors.text }]}>{ads.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={styles.filterRow}>
            {['all', 'pending', 'approved', 'paused', 'rejected'].map(f => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, filter === f && { backgroundColor: Colors.secondary, borderColor: Colors.secondary }]}
              >
                <Text style={[styles.filterChipText, filter === f && { color: '#fff' }]}>
                  {f === 'all' ? `All (${ads.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${ads.filter(a => a.status === f).length})`}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 40 }} />
        ) : filteredAds.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No ads found</Text>
          </View>
        ) : (
          filteredAds.map(ad => {
            const status = STATUS_COLORS[ad.status] || STATUS_COLORS.pending;
            const isExpired = ad.end_date && new Date(ad.end_date) < new Date() && ad.status === 'approved';
            return (
              <View key={ad.id} style={styles.adCard}>
                {ad.image_uri && (
                  <Image source={{ uri: ad.image_uri }} style={styles.adImage} contentFit="cover" />
                )}
                <View style={styles.adContent}>
                  <View style={styles.adHeader}>
                    <Text style={styles.adName} numberOfLines={1}>{ad.business_name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isExpired ? STATUS_COLORS.expired.bg : status.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: isExpired ? STATUS_COLORS.expired.text : status.text }]}>
                        {isExpired ? 'Expired' : status.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.adType}>{BUSINESS_LABELS[ad.business_type] || 'Pet Services'}</Text>

                  {ad.description && (
                    <Text style={styles.adDescription} numberOfLines={2}>{ad.description}</Text>
                  )}

                  <View style={styles.adMeta}>
                    <Ionicons name="person-outline" size={13} color={Colors.textLight} />
                    <Text style={styles.adMetaText}>{ad.registrant_name || 'Unknown'} · {ad.contact_email}</Text>
                  </View>

                  {ad.end_date && (
                    <View style={styles.adMeta}>
                      <Ionicons name="calendar-outline" size={13} color={Colors.textLight} />
                      <Text style={styles.adMetaText}>
                        Runs until {new Date(ad.end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  )}

                  {actionLoading === ad.id ? (
                    <ActivityIndicator size="small" color={Colors.secondary} style={{ marginTop: 10 }} />
                  ) : (
                    <View style={styles.adActions}>
                      {ad.status === 'pending' && (
                        <>
                          <Pressable onPress={() => handleApprove(ad.id)} style={[styles.actionBtn, { backgroundColor: '#D1FAE5' }]}>
                            <Ionicons name="checkmark-circle" size={16} color="#059669" />
                            <Text style={[styles.actionBtnText, { color: '#059669' }]}>Approve</Text>
                          </Pressable>
                          <Pressable onPress={() => handleReject(ad.id)} style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="close-circle" size={16} color="#DC2626" />
                            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Reject</Text>
                          </Pressable>
                        </>
                      )}
                      {(ad.status === 'approved' || ad.status === 'paused') && (
                        <Pressable
                          onPress={() => handlePauseResume(ad.id, ad.status)}
                          style={[styles.actionBtn, { backgroundColor: ad.status === 'approved' ? '#E0E7FF' : '#D1FAE5' }]}
                        >
                          <Ionicons name={ad.status === 'approved' ? 'pause-circle' : 'play-circle'} size={16} color={ad.status === 'approved' ? '#6366F1' : '#059669'} />
                          <Text style={[styles.actionBtnText, { color: ad.status === 'approved' ? '#6366F1' : '#059669' }]}>
                            {ad.status === 'approved' ? 'Pause' : 'Resume'}
                          </Text>
                        </Pressable>
                      )}
                      <Pressable onPress={() => handleDelete(ad.id)} style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="trash" size={14} color="#DC2626" />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
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
  toggleCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  toggleHint: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textLight,
  },
  adCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 140,
  },
  adContent: {
    padding: 14,
    gap: 6,
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  adName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
  },
  adType: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: Colors.secondary,
  },
  adDescription: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  adMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  adMetaText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
  },
  adActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  accessDeniedText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textLight,
  },
});
