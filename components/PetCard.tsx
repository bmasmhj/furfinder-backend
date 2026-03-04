import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { PetReport } from '@/lib/types';
import { getStatusColor, getStatusBg, getStatusLabel, getPetTypeIcon, formatDate } from '@/lib/helpers';

interface PetCardProps {
  report: PetReport;
  index: number;
}

export default function PetCard({ report, index }: PetCardProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const statusColor = getStatusColor(report.status);
  const statusBg = getStatusBg(report.status);
  const isActiveBoosted = !!(report.isBoosted && report.boostExpiresAt && new Date(report.boostExpiresAt).getTime() > Date.now());

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: '/pet/[id]', params: { id: report.id } });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          isActiveBoosted && styles.cardBoosted,
          pressed && styles.cardPressed,
        ]}
      >
        {isActiveBoosted && (
          <View style={styles.boostBanner}>
            <Ionicons name="rocket" size={13} color="#fff" />
            <Text style={styles.boostBannerText}>BOOSTED</Text>
          </View>
        )}
        <View style={styles.imageContainer}>
          {report.photoUri ? (
            <Image
              source={{ uri: report.photoUri }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: statusBg }]}>
              <MaterialCommunityIcons
                name={getPetTypeIcon(report.petType) as any}
                size={40}
                color={statusColor}
              />
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
          </View>
          {!!report.reward && (
            <View style={styles.rewardBadge}>
              <Ionicons name="gift" size={12} color={Colors.accent} />
              <Text style={styles.rewardText}>{report.reward}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {report.status === 'found' && report.petName === 'Unknown'
                ? `${report.breed} ${report.petType}`
                : report.petName}
            </Text>
            <Text style={styles.time}>{formatDate(report.createdAt)}</Text>
          </View>

          <Text style={styles.breed} numberOfLines={1}>
            {report.breed} · {report.color}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={Colors.textSecondary} />
            <Text style={styles.location} numberOfLines={1}>{report.locationName}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBoosted: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  boostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    paddingVertical: 5,
  },
  boostBannerText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  rewardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  content: {
    padding: 14,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
  },
  breed: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
});
