import { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import { usePets } from '@/lib/pet-context';
import { useSubscription } from '@/lib/subscription-context';
import { useAuth } from '@/lib/auth-context';
import PetCard from '@/components/PetCard';
import FilterBar from '@/components/FilterBar';
import EmptyState from '@/components/EmptyState';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { reports, isLoading, unreadCount, refreshReports } = usePets();
  const { isPremium, canUseScanPost } = useSubscription();
  const [filter, setFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const availableAreas = useMemo(() => {
    const seen = new Set<string>();
    const areas: string[] = [];
    reports.forEach(r => {
      if (!r.locationName) return;
      const suburb = r.locationName.split(',')[0].trim();
      if (suburb && !seen.has(suburb.toLowerCase())) {
        seen.add(suburb.toLowerCase());
        areas.push(suburb);
      }
    });
    return areas.sort();
  }, [reports]);

  const filteredReports = useMemo(() => {
    let base = filter === 'all' ? reports : reports.filter(r => r.status === filter);
    if (areaFilter) {
      base = base.filter(r =>
        r.locationName?.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }
    const now = Date.now();
    return [...base].sort((a, b) => {
      const aBoosted = a.isBoosted && a.boostExpiresAt && new Date(a.boostExpiresAt).getTime() > now;
      const bBoosted = b.isBoosted && b.boostExpiresAt && new Date(b.boostExpiresAt).getTime() > now;
      if (aBoosted && !bBoosted) return -1;
      if (!aBoosted && bBoosted) return 1;
      return 0;
    });
  }, [reports, filter, areaFilter]);

  const lostCount = useMemo(() => reports.filter(r => r.status === 'lost').length, [reports]);
  const foundCount = useMemo(() => reports.filter(r => r.status === 'found').length, [reports]);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then((seen) => {
      if (!seen) {
        router.replace('/onboarding');
      }
    });
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshReports();
    } catch (e) {
      console.error('Refresh failed', e);
    }
    setRefreshing(false);
  };

  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

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
              <Pressable
                style={styles.bellBtn}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="settings-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable
                style={styles.bellBtn}
                onPress={() => router.push('/notifications')}
              >
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
              onPress={() => {
                if (!canUseScanPost()) {
                  router.push('/paywall');
                  return;
                }
                router.push('/scan-post');
              }}
            >
              <Feather name="search" size={14} color="#F97316" />
              <Text style={styles.scanBubbleText}>Scan Post</Text>
              {!canUseScanPost() && <Ionicons name="diamond" size={10} color="#F59E0B" style={{ marginLeft: 2 }} />}
            </Pressable>
            <Pressable
              style={styles.snapBubble}
              onPress={() => router.push('/quick-snap')}
            >
              <MaterialCommunityIcons name="camera-iris" size={14} color={Colors.secondary} />
              <Text style={styles.snapBubbleText}>Quick Snap</Text>
            </Pressable>
          </View>
          <View style={styles.statsRow}>
            <Pressable
              style={styles.tipsBubble}
              onPress={() => router.push('/safety-tips')}
            >
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.tipsBubbleText}>Safety Tips</Text>
            </Pressable>
            <Pressable
              style={styles.suburbBubble}
              onPress={() => router.push('/suburb-directory')}
            >
              <Ionicons name="location" size={14} color="#7C3AED" />
              <Text style={styles.suburbBubbleText}>Suburb Pets</Text>
            </Pressable>
            {!isPremium && (
              <Pressable
                style={styles.upgradeBubble}
                onPress={() => router.push('/paywall')}
              >
                <Ionicons name="diamond" size={14} color="#F59E0B" />
                <Text style={styles.upgradeBubbleText}>Upgrade</Text>
              </Pressable>
            )}
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <PetCard report={item} index={index} />}
        ListHeaderComponent={
          <View>
            <FilterBar selected={filter} onSelect={setFilter} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.areaFilterRow}
            >
              <Pressable
                style={[styles.areaChip, !areaFilter && styles.areaChipActive]}
                onPress={() => setAreaFilter('')}
              >
                <Ionicons name="globe-outline" size={13} color={!areaFilter ? '#fff' : Colors.textSecondary} />
                <Text style={[styles.areaChipText, !areaFilter && styles.areaChipTextActive]}>All Areas</Text>
              </Pressable>
              {availableAreas.map(area => (
                <Pressable
                  key={area}
                  style={[styles.areaChip, areaFilter === area && styles.areaChipActive]}
                  onPress={() => setAreaFilter(areaFilter === area ? '' : area)}
                >
                  <Ionicons name="location" size={13} color={areaFilter === area ? '#fff' : Colors.secondary} />
                  <Text style={[styles.areaChipText, areaFilter === area && styles.areaChipTextActive]}>{area}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {areaFilter ? (
              <View style={styles.areaFilterBanner}>
                <Ionicons name="location" size={14} color={Colors.secondary} />
                <Text style={styles.areaFilterBannerText}>Showing pets in <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{areaFilter}</Text></Text>
                <Pressable onPress={() => setAreaFilter('')} style={styles.areaFilterClear}>
                  <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="paw-off"
            title={areaFilter ? `No pets reported in ${areaFilter}` : 'No reports yet'}
            subtitle={areaFilter ? 'Try selecting a different area or view all areas' : 'Be the first to report a lost or found pet in your area'}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredReports.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filteredReports.length || true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
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
  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  areaFilterRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 2,
    gap: 8,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  areaChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  areaChipText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  areaChipTextActive: {
    color: '#fff',
  },
  areaFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E6FAF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#99E9E7',
  },
  areaFilterBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
  },
  areaFilterClear: {
    padding: 2,
  },
});
