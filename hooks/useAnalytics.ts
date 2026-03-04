import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'expo/fetch';
import { getApiUrl } from '@/lib/query-client';
import { useAuth } from '@/lib/auth-context';

const SESSION_KEY = '@analytics_session_id';

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

async function getOrCreateSessionId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = generateSessionId();
    await AsyncStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return generateSessionId();
  }
}

export function useAnalytics() {
  const { token } = useAuth();
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    getOrCreateSessionId().then(id => {
      sessionIdRef.current = id;
    });
  }, []);

  const track = useCallback((eventName: string, properties: Record<string, unknown> = {}) => {
    const sessionId = sessionIdRef.current || generateSessionId();
    const url = new URL('/api/analytics/event', getApiUrl()).toString();

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        eventName,
        properties,
        sessionId,
        platform: Platform.OS,
      }),
    }).catch(() => {});
  }, [token]);

  return { track };
}
