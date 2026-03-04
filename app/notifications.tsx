import { StyleSheet, Text, View, FlatList, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { usePets } from '@/lib/pet-context';
import { PetNotification } from '@/lib/types';
import { formatDate } from '@/lib/helpers';

function getNotificationIcon(type: string, Colors: any): { name: string; color: string; bg: string } {
  switch (type) {
    case 'lost_nearby':
      return { name: 'alert-circle', color: '#EF4444', bg: '#FEE2E2' };
    case 'found_nearby':
      return { name: 'checkmark-circle', color: Colors.secondary, bg: '#D1FAE5' };
    case 'match_found':
      return { name: 'sparkles', color: '#6366F1', bg: '#E0E7FF' };
    case 'ai_match':
      return { name: 'paw', color: '#6366F1', bg: '#EDE9FE' };
    case 'status_update':
      return { name: 'information-circle', color: Colors.primary, bg: '#FFF1EE' };
    case 'message':
      return { name: 'chatbubble', color: Colors.secondary, bg: '#D1FAE5' };
    default:
      return { name: 'notifications', color: Colors.textLight, bg: '#F3F4F6' };
  }
}

function NotificationItem({ notification, onPress }: { notification: PetNotification; onPress: () => void }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const icon = getNotificationIcon(notification.type, Colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.notifCard,
        !notification.read && styles.notifCardUnread,
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={[styles.notifIcon, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name as any} size={22} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !notification.read && styles.notifTitleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={3}>{notification.message}</Text>
        <Text style={styles.notifTime}>{formatDate(notification.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, clearNotifications } = usePets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const handleNotificationPress = async (notification: PetNotification) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
    if (notification.reportId) {
      router.push({ pathname: '/pet/[id]', params: { id: notification.reportId } });
    }
  };

  const handleMarkAllRead = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await markAllNotificationsRead();
  };

  const handleClear = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await clearNotifications();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</Text>
          )}
        </View>
        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <Pressable onPress={handleMarkAllRead} style={styles.actionBtn}>
                <Ionicons name="checkmark-done" size={20} color={Colors.secondary} />
              </Pressable>
            )}
            <Pressable onPress={handleClear} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={20} color={Colors.textLight} />
            </Pressable>
          </View>
        )}
      </Animated.View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 50).duration(300)}>
            <NotificationItem
              notification={item}
              onPress={() => handleNotificationPress(item)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>
              When a pet is reported lost or found near your registered pets, you'll get alerts here
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.list,
          notifications.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
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
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notifCardUnread: {
    backgroundColor: '#FFF8F6',
    borderColor: Colors.primary + '30',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  notifTitleUnread: {
    color: Colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifMessage: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
