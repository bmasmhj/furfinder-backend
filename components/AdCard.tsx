import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface Ad {
  id: string;
  business_name: string;
  business_type: string;
  image_uri: string;
  link_url?: string;
  description?: string;
  website?: string;
}

const BUSINESS_LABELS: Record<string, string> = {
  vet: 'Vet Clinic',
  pet_shop: 'Pet Shop',
  groomer: 'Groomer',
  pet_food: 'Pet Food',
  insurance: 'Pet Insurance',
  training: 'Dog Training',
  boarding: 'Pet Boarding',
  other: 'Pet Services',
};

export default function AdCard({ ad }: { ad: Ad }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handlePress = () => {
    const raw = ad.link_url || ad.website;
    if (!raw) return;
    const url = raw.startsWith('http') ? raw : `https://${raw}`;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        Linking.openURL(url);
      }
    } catch {}
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.container, pressed && { opacity: 0.95 }]}>
      <View style={styles.sponsoredRow}>
        <Ionicons name="megaphone-outline" size={12} color={Colors.textLight} />
        <Text style={styles.sponsoredText}>Sponsored</Text>
      </View>
      <Image source={{ uri: ad.image_uri }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.businessName} numberOfLines={1}>{ad.business_name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{BUSINESS_LABELS[ad.business_type] || 'Pet Services'}</Text>
          </View>
        </View>
        {ad.description ? (
          <Text style={styles.description} numberOfLines={2}>{ad.description}</Text>
        ) : null}
        {(ad.link_url || ad.website) && (
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Learn More</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.secondary} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  sponsoredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  sponsoredText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 14,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  businessName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: Colors.secondaryLight || '#E0F7F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: Colors.secondary,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.secondary,
  },
});
