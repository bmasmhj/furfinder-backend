import { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetch } from 'expo/fetch';
import { useTheme } from '@/hooks/useTheme';
import { getApiUrl } from '@/lib/query-client';
import type { Organisation, OrgType } from '@/lib/types';

const TYPE_COLORS: Record<OrgType, string> = {
  vet: '#3B82F6',
  shelter: '#22C55E',
  rescue: '#F97316',
};

const TYPE_LABELS: Record<OrgType, string> = {
  vet: 'Vet',
  shelter: 'Shelter',
  rescue: 'Rescue',
};

const FILTERS: { label: string; value: OrgType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Vets', value: 'vet' },
  { label: 'Shelters', value: 'shelter' },
  { label: 'Rescue', value: 'rescue' },
];

export default function PartnersScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrgType | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const baseUrl = getApiUrl();
        const res = await fetch(new URL('/api/org/public', baseUrl).toString());
        if (res.ok) {
          const data = await res.json();
          setOrgs(data);
        }
      } catch {}
      setLoading(false);
    };
    loadOrgs();
  }, []);

  const filtered = useMemo(() => {
    let result = orgs;
    if (activeFilter !== 'all') {
      result = result.filter((o) => o.type === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((o) => o.name.toLowerCase().includes(q));
    }
    return result;
  }, [orgs, activeFilter, search]);

  const renderCard = ({ item }: { item: Organisation }) => (
    <Pressable
      testID={`partner-card-${item.id}`}
      style={styles.card}
      onPress={() => router.push(`/partner/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] + '18' }]}>
          <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[item.type] }]}>
            {TYPE_LABELS[item.type]}
          </Text>
        </View>
      </View>
      {item.address ? (
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.cardRowText} numberOfLines={1}>{item.address}</Text>
        </View>
      ) : null}
      {typeof item.animalCount === 'number' ? (
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="paw" size={14} color={Colors.textSecondary} />
          <Text style={styles.cardRowText}>
            {item.animalCount} animal{item.animalCount !== 1 ? 's' : ''}
          </Text>
        </View>
      ) : null}
      {item.description ? (
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
      ) : null}
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable testID="partners-back" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Partner Directory</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            testID="partners-search"
            style={styles.searchInput}
            placeholder="Search organisations..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable testID="partners-search-clear" onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            testID={`filter-${f.value}`}
            key={f.value}
            style={[
              styles.filterBtn,
              activeFilter === f.value && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f.value)}
          >
            <Text
              style={[
                styles.filterBtnText,
                activeFilter === f.value && styles.filterBtnTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : (
        <FlatList
          testID="partners-list"
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + webBottomPadding + 20,
            paddingTop: 8,
          }}
          scrollEnabled={filtered.length > 0}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="store-search-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No organisations found</Text>
              <Text style={styles.emptySubtext}>
                {search.trim() || activeFilter !== 'all'
                  ? 'Try adjusting your filters or search'
                  : 'Partner organisations will appear here once approved'}
              </Text>
            </View>
          }
        />
      )}
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
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: Colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    height: 44,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
  },
  filterBtnActive: {
    backgroundColor: Colors.secondary,
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardRowText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    lineHeight: 19,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginTop: 4,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
