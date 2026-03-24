import { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle: string;
  color: string;
  type: 'pet' | 'service';
  serviceType?: string;
}

interface WebMapViewProps {
  markers: MapMarker[];
  initialLatitude?: number;
  initialLongitude?: number;
  initialZoom?: number;
  onMarkerPress?: (id: string) => void;
  style?: any;
}

export default function WebMapView({
  markers,
  initialLatitude = -33.8688,
  initialLongitude = 151.2093,
  initialZoom = 13,
  onMarkerPress,
  style,
}: WebMapViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'markerPress' && data.id && onMarkerPress) {
        onMarkerPress(data.id);
      }
    } catch {}
  }, [onMarkerPress]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const timeout = setTimeout(() => {
      iframe.contentWindow?.postMessage(JSON.stringify({
        type: 'updateMarkers',
        markers,
      }), '*');
    }, 500);
    return () => clearTimeout(timeout);
  }, [markers]);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body,#map{width:100%;height:100%}
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map').setView([${initialLatitude}, ${initialLongitude}], ${initialZoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  var markersLayer = L.layerGroup().addTo(map);

  function createIcon(color, type, serviceType) {
    var size = type === 'service' ? 10 : 14;
    var icons = { vet: '🏥', shelter: '🏠', rescue: '❤️' };
    var petIcon = '🐾';
    var icon = type === 'service' ? (icons[serviceType] || '📍') : petIcon;
    return L.divIcon({
      html: '<div style="background:'+color+';width:'+size*2+'px;height:'+size*2+'px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:'+size+'px;cursor:pointer">'+icon+'</div>',
      className: '',
      iconSize: [size*2, size*2],
      iconAnchor: [size, size]
    });
  }

  function renderMarkers(markers) {
    markersLayer.clearLayers();
    markers.forEach(function(m) {
      var icon = createIcon(m.color, m.type, m.serviceType);
      var marker = L.marker([m.latitude, m.longitude], { icon: icon }).addTo(markersLayer);
      marker.bindPopup('<b>'+m.title+'</b><br>'+m.subtitle);
      if (m.type === 'pet') {
        marker.on('click', function() {
          window.parent.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }), '*');
        });
      }
    });
  }

  window.addEventListener('message', function(e) {
    try {
      var data = JSON.parse(e.data);
      if (data.type === 'updateMarkers') renderMarkers(data.markers);
    } catch(ex) {}
  });
<\/script>
</body>
</html>`;

  if (Platform.OS !== 'web') return null;

  return (
    <View style={[styles.container, style]}>
      <iframe
        ref={iframeRef as any}
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 0,
  },
});
