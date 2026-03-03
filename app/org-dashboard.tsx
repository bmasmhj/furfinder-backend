import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, getApiUrl } from '@/lib/query-client';
import { fetch } from 'expo/fetch';
import type { Organisation, OrganisationAnimal, AnimalStatus } from '@/lib/types';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  approved: { bg: '#D1FAE5', text: '#059669' },
  rejected: { bg: '#FEE2E2', text: '#DC2626' },
  available: { bg: '#D1FAE5', text: '#059669' },
  adopted: { bg: '#DBEAFE', text: '#2563EB' },
  on_hold: { bg: '#FEF3C7', text: '#D97706' },
  fostered: { bg: '#EDE9FE', text: '#7C3AED' },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>
        {status.replace('_', ' ')}
      </Text>
    </View>
  );
}

export default function OrgDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const orgQuery = useQuery<Organisation>({
    queryKey: ['/api/org/me'],
    queryFn: async () => {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL('/api/org/me', baseUrl).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch organisation');
      return res.json();
    },
    enabled: !!token,
  });

  const animalsQuery = useQuery<OrganisationAnimal[]>({
    queryKey: ['/api/org/animals'],
    queryFn: async () => {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL('/api/org/animals', baseUrl).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch animals');
      return res.json();
    },
    enabled: !!token,
  });

  const org = orgQuery.data;
  const animals = animalsQuery.data || [];

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/org/me'] });
    queryClient.invalidateQueries({ queryKey: ['/api/org/animals'] });
  }, [queryClient]);

  const handleDelete = useCallback((animalId: string, animalName: string) => {
    Alert.alert(
      'Delete Animal',
      `Are you sure you want to delete "${animalName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(animalId);
            try {
              const baseUrl = getApiUrl();
              const res = await fetch(new URL(`/api/org/animals/${animalId}`, baseUrl).toString(), {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ['/api/org/animals'] });
                queryClient.invalidateQueries({ queryKey: ['/api/org/me'] });
              } else {
                Alert.alert('Error', 'Failed to delete animal.');
              }
            } catch {
              Alert.alert('Error', 'Something went wrong.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }, [token, queryClient]);

  const renderAnimal = useCallback(({ item }: { item: OrganisationAnimal }) => {
    const isDeleting = deletingId === item.id;
    return (
      <View style={styles.animalCard} testID={`animal-card-${item.id}`}>
        <View style={styles.animalRow}>
          {item.photoUris && item.photoUris.length > 0 ? (
            <Image source={{ uri: item.photoUris[0] }} style={styles.animalThumb} testID={`animal-photo-${item.id}`} />
          ) : (
            <View style={[styles.animalThumb, styles.animalThumbPlaceholder]}>
              <MaterialCommunityIcons name="paw" size={24} color={Colors.textLight} />
            </View>
          )}
          <View style={styles.animalInfo}>
            <Text style={styles.animalName} numberOfLines={1}>{item.petName}</Text>
            <Text style={styles.animalBreed} numberOfLines={1}>
              {item.breed || item.petType} {item.size ? `\u2022 ${item.size}` : ''}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <View style={styles.animalActions}>
            <Pressable
              testID={`edit-animal-${item.id}`}
              onPress={() => router.push(`/org-animal-form?animalId=${item.id}`)}
              style={styles.actionBtn}
            >
              <Ionicons name="create-outline" size={20} color={Colors.secondary} />
            </Pressable>
            <Pressable
              testID={`delete-animal-${item.id}`}
              onPress={() => handleDelete(item.id, item.petName)}
              style={styles.actionBtn}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={Colors.danger} />
              ) : (
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  }, [deletingId, handleDelete]);

  const isLoading = orgQuery.isLoading || animalsQuery.isLoading;
  const isRefreshing = orgQuery.isRefetching || animalsQuery.isRefetching;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + webTopPadding }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const orgTypeBadgeColor = org?.type === 'vet' ? '#2563EB' : org?.type === 'shelter' ? '#7C3AED' : '#D97706';

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]} testID="org-dashboard-screen">
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn} testID="back-button">
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Organisation</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimal}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomPadding + 80 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
        scrollEnabled={animals.length > 0}
        ListHeaderComponent={
          <View>
            {org && (
              <View style={styles.orgHeader} testID="org-info-header">
                <View style={styles.orgNameRow}>
                  <Text style={styles.orgName}>{org.name}</Text>
                </View>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: '#EEF2FF' }]}>
                    <Text style={[styles.badgeText, { color: orgTypeBadgeColor }]}>{org.type}</Text>
                  </View>
                  <StatusBadge status={org.status} />
                </View>
                {org.address ? (
                  <View style={styles.orgDetailRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.orgDetailText}>{org.address}</Text>
                  </View>
                ) : null}
              </View>
            )}

            <View style={styles.statsRow} testID="animal-stats">
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{animals.length}</Text>
                <Text style={styles.statLabel}>Total Animals</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {animals.filter((a) => a.status === 'available').length}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {animals.filter((a) => a.status === 'adopted').length}
                </Text>
                <Text style={styles.statLabel}>Adopted</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Animals</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState} testID="empty-animals">
            <MaterialCommunityIcons name="paw-off" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No animals yet</Text>
            <Text style={styles.emptySubtext}>
              {org?.status === 'approved'
                ? 'Tap the + button to add your first animal'
                : 'Your organisation must be approved before adding animals'}
            </Text>
          </View>
        }
        testID="animals-list"
      />

      {org?.status === 'approved' && (
        <Pressable
          style={[styles.fab, { bottom: insets.bottom + webBottomPadding + 20 }]}
          onPress={() => router.push('/org-animal-form')}
          testID="add-animal-fab"
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
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
  orgHeader: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  orgNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    textTransform: 'capitalize',
  },
  orgDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orgDetailText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  animalCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  animalThumbPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  animalName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  animalBreed: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  animalActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
