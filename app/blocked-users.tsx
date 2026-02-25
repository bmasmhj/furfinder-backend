import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/query-client';
import { fetch } from 'expo/fetch';

interface BlockedUser {
  id: string;
  displayName: string;
  blockedAt: string;
}

export default function BlockedUsersScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const fetchBlocked = useCallback(async () => {
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL('/api/users/blocked', baseUrl).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error('Failed to load blocked users', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBlocked();
  }, [fetchBlocked]);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              const baseUrl = getApiUrl();
              await fetch(new URL(`/api/users/${user.id}/block`, baseUrl).toString(), {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsers(prev => prev.filter(u => u.id !== user.id));
            } catch {
              Alert.alert('Error', 'Failed to unblock user');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userRow}>
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={20} color={Colors.textLight} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userDate}>
          Blocked {new Date(item.blockedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>
      <Pressable style={styles.unblockBtn} onPress={() => handleUnblock(item)}>
        <Text style={styles.unblockText}>Unblock</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="checkmark-circle-outline" size={48} color={Colors.textLight} />
          <Text style={styles.emptyText}>No blocked users</Text>
          <Text style={styles.emptySubtext}>Users you block will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + webBottomPadding + 20 }}
          scrollEnabled={!!users.length}
        />
      )}
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  userDate: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
  unblockBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unblockText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
  },
});
