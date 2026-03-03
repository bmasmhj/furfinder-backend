import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'heart' as const,
    iconSet: 'ionicons' as const,
    iconColor: Colors.primary,
    bg: '#FFF5F2',
    title: 'Reunite with your\nfurry family',
    subtitle:
      'Every second counts when a pet goes missing. The Fur Finder helps you reach thousands of local eyes instantly.',
    accent: Colors.primary,
  },
  {
    id: '2',
    icon: 'robot-outline' as const,
    iconSet: 'material' as const,
    iconColor: Colors.secondary,
    bg: '#F0FAFA',
    title: 'AI that never\nmisses a match',
    subtitle:
      'Our AI compares photos, breed, colour, and location to find matches across lost and found reports — even when descriptions are vague.',
    accent: Colors.secondary,
  },
  {
    id: '3',
    icon: 'people' as const,
    iconSet: 'ionicons' as const,
    iconColor: '#7C3AED',
    bg: '#F5F0FF',
    title: "Australia's pet\ncommunity",
    subtitle:
      'Vets, shelters, rescue groups, and thousands of locals working together. Your next-door neighbour might have found your pet.',
    accent: '#7C3AED',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const webTop = Platform.OS === 'web' ? 67 : 0;

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(tabs)');
  };

  const handleSkip = () => completeOnboarding();

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRegisterPet = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(tabs)');
    setTimeout(() => router.push('/register-pet'), 300);
  };

  const isLast = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.bg }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTop + 12 }]}>
        <View style={{ width: 60 }} />
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? currentSlide.accent : '#D1D5DB',
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.bg === '#FFF5F2' ? '#FFE8E0' : item.bg === '#F0FAFA' ? '#D4F2F0' : '#EDE9FE' }]}>
              {item.iconSet === 'ionicons' ? (
                <Ionicons name={item.icon as any} size={72} color={item.iconColor} />
              ) : (
                <MaterialCommunityIcons name={item.icon as any} size={72} color={item.iconColor} />
              )}
            </View>
            <Text style={[styles.title, { color: Colors.text }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 24 }]}>
        {isLast ? (
          <View style={styles.ctaGroup}>
            <Pressable
              style={[styles.ctaPrimary, { backgroundColor: currentSlide.accent }]}
              onPress={handleRegisterPet}
            >
              <Ionicons name="paw" size={20} color="#fff" />
              <Text style={styles.ctaPrimaryText}>Register My Pet</Text>
            </Pressable>
            <Pressable
              style={[styles.ctaSecondary, { borderColor: currentSlide.accent }]}
              onPress={completeOnboarding}
            >
              <Ionicons name="search" size={20} color={currentSlide.accent} />
              <Text style={[styles.ctaSecondaryText, { color: currentSlide.accent }]}>Browse Reports</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.nextBtn, { backgroundColor: currentSlide.accent }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  skipBtn: {
    width: 60,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  ctaGroup: {
    gap: 12,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaPrimaryText: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  ctaSecondaryText: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
  },
});
