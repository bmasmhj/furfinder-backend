import { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { usePets } from '@/lib/pet-context';
import { getStatusColor, getStatusLabel, getPetTypeIcon, formatDate } from '@/lib/helpers';
import FilterBar from '@/components/FilterBar';
import { PetReport, VetShelter } from '@/lib/types';
import { NativeMapView, NativeMarker, NativeCallout } from '@/components/MapViewNative';
import { VET_SHELTERS } from '@/lib/vet-shelters';

const INITIAL_REGION = {
  latitude: -33.8688,
  longitude: 151.2093,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const SERVICE_COLORS: Record<VetShelter['type'], string> = {
  vet: '#059669',
  shelter: '#3B82F6',
  rescue: '#8B5CF6',
};

const SERVICE_ICONS: Record<VetShelter['type'], keyof typeof Ionicons.glyphMap> = {
  vet: 'medical',
  shelter: 'home',
  rescue: 'heart',
};

function WebMapFallback({ reports, showServices }: { reports: PetReport[]; showServices: boolean }) {
  return (
    <ScrollView style={styles.webFallback} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.webFallbackHeader}>
        <Ionicons name="map" size={48} color={Colors.primary} />
        <Text style={styles.webFallbackTitle}>Map View</Text>
        <Text style={styles.webFallbackSubtitle}>
          Interactive map is available on the mobile app. Browse reported pets below:
        </Text>
      </View>
      {reports.map((report) => (
        <Pressable
          key={report.id}
          onPress={() => router.push({ pathname: '/pet/[id]', params: { id: report.id } })}
          style={({ pressed }) => [styles.webListItem, pressed && { opacity: 0.8 }]}
        >
          <View style={[styles.webListIcon, { backgroundColor: getStatusColor(report.status) + '20' }]}>
            <MaterialCommunityIcons
              name={getPetTypeIcon(report.petType) as any}
              size={22}
              color={getStatusColor(report.status)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.webListName}>
              {report.petName === 'Unknown' ? report.breed : report.petName}
            </Text>
            <Text style={styles.webListMeta}>{report.locationName} · {formatDate(report.createdAt)}</Text>
          </View>
          <View style={[styles.webListBadge, { backgroundColor: getStatusColor(report.status) }]}>
            <Text style={styles.webListBadgeText}>{getStatusLabel(report.status)}</Text>
          </View>
        </Pressable>
      ))}

      {showServices && (
        <>
          <View style={styles.webServicesHeader}>
            <Ionicons name="medical" size={24} color={SERVICE_COLORS.vet} />
            <Text style={styles.webServicesTitle}>Nearby Services</Text>
          </View>
          {VET_SHELTERS.map((service) => (
            <View key={service.id} style={styles.webServiceCard}>
              <View style={[styles.webServiceIcon, { backgroundColor: SERVICE_COLORS[service.type] + '20' }]}>
                <Ionicons
                  name={SERVICE_ICONS[service.type]}
                  size={20}
                  color={SERVICE_COLORS[service.type]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.webServiceRow}>
                  <Text style={styles.webServiceName}>{service.name}</Text>
                  <View style={[styles.webServiceBadge, { backgroundColor: SERVICE_COLORS[service.type] }]}>
                    <Text style={styles.webServiceBadgeText}>{service.type.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.webServiceAddress}>{service.address}</Text>
                <Pressable onPress={() => Linking.openURL(`tel:${service.phone}`)}>
                  <Text style={styles.webServicePhone}>{service.phone}</Text>
                </Pressable>
                <Text style={styles.webServiceHours}>{service.hours}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function Legend({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const items = [
    { color: Colors.lost, label: 'Lost' },
    { color: Colors.found, label: 'Found' },
    { color: SERVICE_COLORS.vet, label: 'Vet' },
    { color: SERVICE_COLORS.shelter, label: 'Shelter' },
    { color: SERVICE_COLORS.rescue, label: 'Rescue' },
  ];

  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
          <Text style={[styles.legendLabel, variant === 'light' && { color: Colors.textSecondary }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { reports } = usePets();
  const [filter, setFilter] = useState('all');
  const [showServices, setShowServices] = useState(true);
  const mapRef = useRef<any>(null);
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const isWeb = Platform.OS === 'web';

  const filteredReports = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter(r => r.status === filter);
  }, [reports, filter]);

  const handleMarkerPress = (id: string) => {
    if (!isWeb) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: '/pet/[id]', params: { id } });
  };

  const recenter = () => {
    mapRef.current?.animateToRegion?.(INITIAL_REGION, 500);
  };

  const toggleServices = () => {
    if (!isWeb) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowServices(prev => !prev);
  };

  if (isWeb) {
    return (
      <View style={[styles.container, { paddingTop: webTopPadding }]}>
        <View style={styles.webFilterRow}>
          <View style={{ flex: 1 }}>
            <FilterBar selected={filter} onSelect={setFilter} />
          </View>
          <Pressable
            onPress={toggleServices}
            style={[
              styles.servicesToggle,
              showServices && styles.servicesToggleActive,
            ]}
          >
            <Ionicons
              name="medical"
              size={20}
              color={showServices ? '#fff' : Colors.textSecondary}
            />
          </Pressable>
        </View>
        <Legend variant="light" />
        <WebMapFallback reports={filteredReports} showServices={showServices} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NativeMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredReports.map((report) => (
          <NativeMarker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            onCalloutPress={() => handleMarkerPress(report.id)}
          >
            <View style={[styles.markerContainer, { borderColor: getStatusColor(report.status) }]}>
              <MaterialCommunityIcons
                name={getPetTypeIcon(report.petType) as any}
                size={18}
                color={getStatusColor(report.status)}
              />
            </View>
            <NativeCallout tooltip>
              <View style={styles.callout}>
                <View style={[styles.calloutBadge, { backgroundColor: getStatusColor(report.status) }]}>
                  <Text style={styles.calloutBadgeText}>{getStatusLabel(report.status)}</Text>
                </View>
                <Text style={styles.calloutName}>
                  {report.petName === 'Unknown' ? report.breed : report.petName}
                </Text>
                <Text style={styles.calloutLocation}>{report.locationName}</Text>
                <Text style={styles.calloutTap}>Tap for details</Text>
              </View>
            </NativeCallout>
          </NativeMarker>
        ))}

        {showServices && VET_SHELTERS.map((service) => (
          <NativeMarker
            key={service.id}
            coordinate={{
              latitude: service.latitude,
              longitude: service.longitude,
            }}
          >
            <View style={[styles.serviceMarker, { backgroundColor: SERVICE_COLORS[service.type] }]}>
              <Ionicons
                name={SERVICE_ICONS[service.type]}
                size={12}
                color="#fff"
              />
            </View>
            <NativeCallout tooltip>
              <View style={styles.callout}>
                <View style={[styles.calloutBadge, { backgroundColor: SERVICE_COLORS[service.type] }]}>
                  <Text style={styles.calloutBadgeText}>{service.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.calloutName}>{service.name}</Text>
                <Text style={styles.calloutLocation}>{service.address}</Text>
                <Text style={styles.calloutLocation}>{service.phone}</Text>
                <Text style={styles.calloutLocation}>{service.hours}</Text>
              </View>
            </NativeCallout>
          </NativeMarker>
        ))}
      </NativeMapView>

      <View style={[styles.filterOverlay, { top: insets.top + 8 }]}>
        <FilterBar selected={filter} onSelect={setFilter} />
      </View>

      <Pressable
        onPress={toggleServices}
        style={[
          styles.servicesToggleMobile,
          { bottom: insets.bottom + 152 },
          showServices && styles.servicesToggleActive,
        ]}
      >
        <Ionicons
          name="medical"
          size={20}
          color={showServices ? '#fff' : Colors.textSecondary}
        />
      </Pressable>

      <Pressable
        onPress={recenter}
        style={[styles.recenterBtn, { bottom: insets.bottom + 100 }]}
      >
        <Ionicons name="locate" size={22} color={Colors.primary} />
      </Pressable>

      <View style={[styles.countOverlay, { bottom: insets.bottom + 100 }]}>
        <Text style={styles.countText}>{filteredReports.length} pets nearby</Text>
        <Legend />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
  },
  filterOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  serviceMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.2)',
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    alignItems: 'center',
    gap: 4,
  },
  calloutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  calloutBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  calloutName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  calloutLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  calloutTap: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 2,
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  servicesToggleMobile: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  servicesToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  servicesToggleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  countOverlay: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
  },
  webFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 16,
  },
  webFallback: {
    flex: 1,
    padding: 16,
  },
  webFallbackHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingTop: 20,
  },
  webFallbackTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
  },
  webFallbackSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  webListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  webListIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webListName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  webListMeta: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  webListBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  webListBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  webServicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  webServicesTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  webServiceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  webServiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  webServiceName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  webServiceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  webServiceBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  webServiceAddress: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
  },
  webServicePhone: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: Colors.primary,
    marginTop: 2,
  },
  webServiceHours: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
});
