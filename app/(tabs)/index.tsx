import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, RefreshControl,
  Platform, Pressable, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'expo/fetch';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { usePets } from '@/lib/pet-context';
import { useSubscription } from '@/lib/subscription-context';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/query-client';
import PetCard from '@/components/PetCard';
import EmptyState from '@/components/EmptyState';
import AreaFilterModal, { AreaFilterValue } from '@/components/AreaFilterModal';
import { PetReport } from '@/lib/types';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
  { key: 'reunited', label: 'Reunited' },
];

const PAGE_SIZE = 20;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const { unreadCount } = usePets();
  const { isPremium, canUseScanPost } = useSubscription();

  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState<AreaFilterValue>(null);
  const [showAreaModal, setShowAreaModal] = useState(false);

  const [feedReports, setFeedReports] = useState<PetReport[]>([]);
  const [feedPage, setFeedPage] = useState(0);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedLoadingMore, setFeedLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchingRef = useRef(false);

  const buildUrl = useCallback((page: number) => {
    const url = new URL('/api/reports', getApiUrl());
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(PAGE_SIZE));
    if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);
    if (areaFilter) {
      if (areaFilter.mode === 'geo') {
        url.searchParams.set('lat', String(areaFilter.lat));
        url.searchParams.set('lng', String(areaFilter.lng));
        url.searchParams.set('radius', String(areaFilter.radius));
      } else {
        url.searchParams.set('suburb', areaFilter.suburb);
      }
    }
    return url.toString();
  }, [statusFilter, areaFilter]);

  const fetchPage = useCallback(async (page: number, reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(buildUrl(page), { headers });
      const data = await res.json();
      const incoming: PetReport[] = data.reports ?? [];
      if (reset) {
        setFeedReports(incoming);
      } else {
        setFeedReports(prev => [...prev, ...incoming]);
      }
      setFeedHasMore(data.hasMore ?? false);
      setFeedPage(page);
    } catch (e) {
      console.error('Feed fetch error', e);
    } finally {
      fetchingRef.current = false;
    }
  }, [buildUrl, token]);

  useEffect(() => {
    setFeedLoading(true);
    setFeedReports([]);
    setFeedPage(0);
    fetchPage(0, true).finally(() => setFeedLoading(false));
  }, [statusFilter, areaFilter]);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then(seen => {
      if (!seen) router.replace('/onboarding');
    });
  }, []);

  const suggestedSuburbs = useMemo(() => {
    const seen = new Set<string>();
    const areas: string[] = [];
    feedReports.forEach(r => {
      if (!r.locationName) return;
      const suburb = r.locationName.split(',')[0].trim();
      if (suburb && !seen.has(suburb.toLowerCase())) {
        seen.add(suburb.toLowerCase());
        areas.push(suburb);
      }
    });
    return areas.sort();
  }, [feedReports]);

  const lostCount = useMemo(() => feedReports.filter(r => r.status === 'lost').length, [feedReports]);
  const foundCount = useMemo(() => feedReports.filter(r => r.status === 'found').length, [feedReports]);

  if (!isAuthenticated) return <Redirect href="/login" />;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPage(0, true);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!feedHasMore || feedLoadingMore || fetchingRef.current) return;
    setFeedLoadingMore(true);
    await fetchPage(feedPage + 1);
    setFeedLoadingMore(false);
  };

  const handleStatusFilter = (key: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStatusFilter(key);
  };

  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const ListHeader = (
    <View style={styles.listHeaderContainer}>
      <View style={styles.segmentedRow}>
        {STATUS_FILTERS.map(f => {
          const active = statusFilter === f.key;
          return (
            <Pressable
              key={f.key}
              style={[styles.segmentChip, active && styles.segmentChipActive]}
              onPress={() => handleStatusFilter(f.key)}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.areaFilterBtn, !!areaFilter && styles.areaFilterBtnActive]}
        onPress={() => setShowAreaModal(true)}
      >
        <Ionicons
          name={areaFilter ? 'location' : 'location-outline'}
          size={15}
          color={areaFilter ? Colors.secondary : Colors.textSecondary}
        />
        <Text style={[styles.areaFilterBtnText, !!areaFilter && styles.areaFilterBtnTextActive]}>
          {areaFilter ? areaFilter.label : 'All Australia  ·  Filter by Area'}
        </Text>
        {areaFilter ? (
          <Pressable
            onPress={e => { e.stopPropagation?.(); setAreaFilter(null); }}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={16} color={Colors.secondary} />
          </Pressable>
        ) : (
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B4A', '#FF8A6E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + webTopPadding + 16 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>The Fur Finder</Text>
              <Text style={styles.subtitle}>Help pets find their way home</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Pressable style={styles.bellBtn} onPress={() => router.push('/settings')}>
                <Ionicons name="settings-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.bellBtn} onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
                {unreadCount > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBubble}>
              <Ionicons name="alert-circle" size={14} color={Colors.lost} />
              <Text style={styles.statText}>{lostCount} Lost</Text>
            </View>
            <View style={styles.statBubble}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.found} />
              <Text style={styles.statText}>{foundCount} Found</Text>
            </View>
            <Pressable
              style={styles.scanBubble}
              onPress={() => { if (!canUseScanPost()) { router.push('/paywall'); return; } router.push('/scan-post'); }}
            >
              <Feather name="search" size={14} color="#F97316" />
              <Text style={styles.scanBubbleText}>Scan Post</Text>
              {!canUseScanPost() && <Ionicons name="diamond" size={10} color="#F59E0B" style={{ marginLeft: 2 }} />}
            </Pressable>
            <Pressable style={styles.snapBubble} onPress={() => router.push('/quick-snap')}>
              <MaterialCommunityIcons name="camera-iris" size={14} color={Colors.secondary} />
              <Text style={styles.snapBubbleText}>Quick Snap</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <Pressable style={styles.tipsBubble} onPress={() => router.push('/safety-tips')}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.tipsBubbleText}>Safety Tips</Text>
            </Pressable>
            <Pressable style={styles.suburbBubble} onPress={() => router.push('/suburb-directory')}>
              <Ionicons name="location" size={14} color="#7C3AED" />
              <Text style={styles.suburbBubbleText}>Suburb Pets</Text>
            </Pressable>
            {!isPremium && (
              <Pressable style={styles.upgradeBubble} onPress={() => router.push('/paywall')}>
                <Ionicons name="diamond" size={14} color="#F59E0B" />
                <Text style={styles.upgradeBubbleText}>Upgrade</Text>
              </Pressable>
            )}
          </View>
        </View>
      </LinearGradient>

      {feedLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding pets near you...</Text>
        </View>
      ) : (
        <FlatList
          data={feedReports}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <PetCard report={item} index={index} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="paw-off"
              title={areaFilter ? `No pets in ${areaFilter.label}` : 'No reports yet'}
              subtitle={areaFilter ? 'Try a larger radius or browse all Australia' : 'Be the first to report a lost or found pet'}
            />
          }
          ListFooterComponent={
            feedLoadingMore
              ? <ActivityIndicator size="small" color={Colors.primary} style={styles.loadMoreSpinner} />
              : null
          }
          contentContainerStyle={[
            styles.listContent,
            feedReports.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          removeClippedSubviews={Platform.OS !== 'web'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        />
      )}

      <AreaFilterModal
        visible={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onApply={setAreaFilter}
        currentFilter={areaFilter}
        suggestedSuburbs={suggestedSuburbs}
      />
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
  headerContent: {
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text,
  },
  scanBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  scanBubbleText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#F97316',
  },
  snapBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  snapBubbleText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.secondary,
  },
  tipsBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  tipsBubbleText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#059669',
  },
  upgradeBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  upgradeBubbleText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#D97706',
  },
  suburbBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  suburbBubbleText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#7C3AED',
  },
  listHeaderContainer: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  segmentedRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  segmentChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  segmentChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
  },
  areaFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  areaFilterBtnActive: {
    borderColor: Colors.secondary,
    backgroundColor: '#F0FAFA',
  },
  areaFilterBtnText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  areaFilterBtnTextActive: {
    color: Colors.secondary,
    fontFamily: 'Poppins_600SemiBold',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  loadMoreSpinner: {
    marginVertical: 20,
  },
});
