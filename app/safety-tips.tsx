import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const categories = [
  {
    title: 'When Your Pet Goes Missing',
    icon: 'alert-circle' as const,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    tips: [
      'Search your home and neighborhood thoroughly first',
      'Contact local shelters and vets with your pet\'s description',
      'Post on social media and community groups immediately',
      'Put out familiar items (bed, toys) near your home',
      'Check with microchip company to ensure contact details are current',
      'Browse our Partner Directory for local vets, shelters & rescue groups',
    ],
  },
  {
    title: 'If You Find a Lost Pet',
    icon: 'heart' as const,
    color: '#2CBCB6',
    bgColor: '#F0FDFA',
    tips: [
      'Check for tags, collar, or microchip (any vet can scan)',
      'Post in local lost & found groups with photo and location',
      'Contact local council and animal shelters to report',
      'Provide food, water, and a safe space while searching for owner',
      'Do not chase the animal - use treats to coax them close',
    ],
  },
  {
    title: 'Prevention Tips',
    icon: 'shield-checkmark' as const,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    tips: [
      'Microchip your pet and keep registration details updated',
      'Use a collar with ID tag including your phone number',
      'Take clear, recent photos of your pet from multiple angles',
      'Keep gates and fences secure, check for escape points',
      'Consider GPS tracking collars for adventurous pets',
    ],
  },
  {
    title: 'Emergency Contacts',
    icon: 'call' as const,
    color: '#F97316',
    bgColor: '#FFF7ED',
    tips: [
      'RSPCA: 1300 278 3589',
      'Animal Emergency: Contact your nearest 24hr vet',
      'Local Council Animal Services',
      'National Pet Register: 1300 734 738',
      'The Fur Finder AI Matching: Use our app\'s AI feature!',
    ],
  },
];

function TipCard({ category, index }: { category: typeof categories[number]; index: number }) {
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
            <Ionicons name={category.icon} size={22} color={category.color} />
          </View>
          <Text style={styles.cardTitle}>{category.title}</Text>
        </View>
        <View style={styles.tipsContainer}>
          {category.tips.map((tip, tipIndex) => {
            const isPartnerLink = tip.includes('Partner Directory');
            return (
              <Pressable
                key={tipIndex}
                style={styles.tipRow}
                onPress={isPartnerLink ? () => router.push('/partners') : undefined}
                disabled={!isPartnerLink}
              >
                <View style={[styles.checkIcon, { backgroundColor: category.bgColor }]}>
                  <Ionicons name="checkmark-circle" size={18} color={category.color} />
                </View>
                <Text style={[styles.tipText, isPartnerLink && styles.tipLink]}>{tip}</Text>
                {isPartnerLink && (
                  <Ionicons name="chevron-forward" size={16} color={Colors.secondary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

export default function SafetyTipsScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + webTopPadding + 12 }]}
      >
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.shieldIcon}>
            <Ionicons name="shield" size={22} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Pet Safety Guide</Text>
          <Text style={styles.headerSubtitle}>Essential tips for lost & found situations</Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, index) => (
          <TipCard key={index} category={category} index={index} />
        ))}

        <Animated.View entering={FadeInUp.duration(400).delay(categories.length * 100)}>
          <LinearGradient
            colors={['#059669', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            <View style={styles.ctaIconContainer}>
              <Ionicons name="sparkles" size={24} color="#fff" />
            </View>
            <Text style={styles.ctaText}>
              Use The Fur Finder's AI matching to quickly find potential matches for lost or found pets
            </Text>
            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.9 }]}
              onPress={() => router.push('/')}
            >
              <Ionicons name="search" size={18} color="#059669" />
              <Text style={styles.ctaButtonText}>Try AI Matching</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
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
  shieldIcon: {
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
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  tipsContainer: {
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tipLink: {
    color: Colors.secondary,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline',
  },
  ctaCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  ctaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  ctaButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#059669',
  },
});
