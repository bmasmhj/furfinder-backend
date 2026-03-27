import { forwardRef } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const isExpoGoAndroid = Platform.OS === 'android' && Constants.appOwnership === 'expo';

let RNMapView: any = null;
let RNMarker: any = null;
let RNCallout: any = null;

if (!isExpoGoAndroid) {
  try {
    const maps = require('react-native-maps');
    RNMapView = maps.default;
    RNMarker = maps.Marker;
    RNCallout = maps.Callout;
  } catch {}
}

function MapFallback() {
  return (
    <View style={fallbackStyles.container}>
      <Text style={fallbackStyles.text}>Map not available in Expo Go on Android.</Text>
      <Text style={fallbackStyles.subtext}>Use a development build or test on iOS/web.</Text>
    </View>
  );
}

const fallbackStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  text: { fontSize: 15, fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: 4 },
  subtext: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
});

export const NativeMapView = forwardRef<any, any>((props, ref) => {
  if (!RNMapView) return <MapFallback />;
  return <RNMapView ref={ref} {...props} />;
});

export const NativeMarker = RNMarker || View;
export const NativeCallout = RNCallout || View;
