import { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Colors from '@/constants/colors';

export type AreaFilterValue = {
  mode: 'geo';
  lat: number;
  lng: number;
  radius: number;
  label: string;
} | {
  mode: 'suburb';
  suburb: string;
  label: string;
} | null;

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: AreaFilterValue) => void;
  currentFilter: AreaFilterValue;
  suggestedSuburbs: string[];
}

const RADIUS_OPTIONS = [5, 10, 25, 50];

export default function AreaFilterModal({ visible, onClose, onApply, currentFilter, suggestedSuburbs }: Props) {
  const [mode, setMode] = useState<'all' | 'geo' | 'suburb'>('all');
  const [suburbText, setSuburbText] = useState('');
  const [radius, setRadius] = useState(10);
  const [detecting, setDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!visible) return;
    if (!currentFilter) {
      setMode('all');
      setSuburbText('');
    } else if (currentFilter.mode === 'geo') {
      setMode('geo');
      setRadius(currentFilter.radius);
      setDetectedLocation({ lat: currentFilter.lat, lng: currentFilter.lng, label: currentFilter.label.split(' (')[0] });
    } else if (currentFilter.mode === 'suburb') {
      setMode('suburb');
      setSuburbText(currentFilter.suburb);
    }
  }, [visible]);

  const detectLocation = async () => {
    setDetecting(true);
    setLocationError('');
    try {
      if (Platform.OS !== 'web') {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          setLocationError('Location services are off. Enable them in your device Settings.');
          setDetecting(false);
          return;
        }
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(
          canAskAgain
            ? 'Location permission denied.'
            : 'Location access denied. Go to Settings > Privacy > Location to enable it.'
        );
        setDetecting(false);
        return;
      }

      let position: Location.LocationObject | null = null;
      if (Platform.OS !== 'web') {
        position = await Location.getLastKnownPositionAsync({ maxAge: 300000 });
      }
      if (!position) {
        position = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
        ]) as Location.LocationObject;
      }

      const [geo] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const suburb = geo?.suburb || geo?.city || geo?.district || 'Your location';
      setDetectedLocation({ lat: position.coords.latitude, lng: position.coords.longitude, label: suburb });
      setMode('geo');
    } catch {
      setLocationError('Could not detect location. Try searching manually below.');
    }
    setDetecting(false);
  };

  const handleApply = () => {
    if (mode === 'all') {
      onApply(null);
    } else if (mode === 'geo' && detectedLocation) {
      onApply({
        mode: 'geo',
        lat: detectedLocation.lat,
        lng: detectedLocation.lng,
        radius,
        label: `${detectedLocation.label} (${radius}km)`,
      });
    } else if (mode === 'suburb' && suburbText.trim()) {
      onApply({
        mode: 'suburb',
        suburb: suburbText.trim(),
        label: suburbText.trim(),
      });
    } else {
      onApply(null);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Filter by Area</Text>

        <Pressable
          style={[styles.optionRow, mode === 'all' && styles.optionRowActive]}
          onPress={() => setMode('all')}
        >
          <View style={[styles.optionIcon, mode === 'all' && styles.optionIconActive]}>
            <Ionicons name="globe-outline" size={18} color={mode === 'all' ? '#fff' : Colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, mode === 'all' && styles.optionTitleActive]}>All Australia</Text>
            <Text style={styles.optionSub}>Show pets from everywhere</Text>
          </View>
          {mode === 'all' && <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />}
        </Pressable>

        <Pressable
          style={[styles.optionRow, mode === 'geo' && styles.optionRowActive]}
          onPress={detecting ? undefined : detectLocation}
          disabled={detecting}
        >
          <View style={[styles.optionIcon, mode === 'geo' && styles.optionIconActive]}>
            <Ionicons name="location" size={18} color={mode === 'geo' ? '#fff' : Colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, mode === 'geo' && styles.optionTitleActive]}>
              {detecting ? 'Detecting location...' : detectedLocation ? detectedLocation.label : 'Use my current location'}
            </Text>
            <Text style={styles.optionSub}>Auto-detect your suburb</Text>
          </View>
          {detecting
            ? <ActivityIndicator size="small" color={Colors.secondary} />
            : mode === 'geo'
            ? <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
            : null}
        </Pressable>

        {!!locationError && <Text style={styles.errorText}>{locationError}</Text>}

        {mode === 'geo' && !!detectedLocation && (
          <View style={styles.radiusSection}>
            <Text style={styles.sectionLabel}>Search radius</Text>
            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map(r => (
                <Pressable
                  key={r}
                  style={[styles.radiusChip, radius === r && styles.radiusChipActive]}
                  onPress={() => setRadius(r)}
                >
                  <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>{r}km</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or search by suburb</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={[styles.searchBox, mode === 'suburb' && styles.searchBoxActive]}>
          <Ionicons name="search" size={16} color={mode === 'suburb' ? Colors.secondary : Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Type a suburb name..."
            placeholderTextColor={Colors.textLight}
            value={suburbText}
            onChangeText={t => {
              setSuburbText(t);
              if (t.trim()) setMode('suburb');
            }}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {suburbText.length > 0 && (
            <Pressable onPress={() => { setSuburbText(''); if (mode === 'suburb') setMode('all'); }}>
              <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {suggestedSuburbs.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
            contentContainerStyle={styles.suggestionsContent}
          >
            {suggestedSuburbs.slice(0, 15).map(s => (
              <Pressable
                key={s}
                style={[styles.suggestionChip, suburbText === s && styles.suggestionChipActive]}
                onPress={() => { setSuburbText(s); setMode('suburb'); }}
              >
                <Text style={[styles.suggestionText, suburbText === s && styles.suggestionTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filter</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
    backgroundColor: Colors.surfaceElevated,
  },
  optionRowActive: {
    borderColor: Colors.secondary,
    backgroundColor: '#F0FAFA',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconActive: {
    backgroundColor: Colors.secondary,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  optionTitleActive: {
    color: Colors.secondary,
  },
  optionSub: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#EF4444',
    marginBottom: 8,
    marginLeft: 4,
  },
  radiusSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  radiusChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  radiusText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
  },
  radiusTextActive: {
    color: '#fff',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: Colors.surfaceElevated,
    marginBottom: 10,
  },
  searchBoxActive: {
    borderColor: Colors.secondary,
    backgroundColor: '#F0FAFA',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
    padding: 0,
  },
  suggestionsScroll: {
    marginBottom: 16,
  },
  suggestionsContent: {
    gap: 8,
    paddingRight: 4,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.textSecondary,
  },
  suggestionTextActive: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
  },
  applyText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});
