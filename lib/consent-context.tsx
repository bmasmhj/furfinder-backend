import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONSENT_KEY = '@user_consent';

interface ConsentState {
  hasConsented: boolean;
  consentDate: string | null;
  privacyVersion: string;
  termsVersion: string;
}

interface ConsentContextValue {
  hasConsented: boolean;
  isLoading: boolean;
  consentDate: string | null;
  acceptConsent: () => Promise<void>;
  revokeConsent: () => Promise<void>;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

const CURRENT_PRIVACY_VERSION = '1.0';
const CURRENT_TERMS_VERSION = '1.0';

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consentDate, setConsentDate] = useState<string | null>(null);

  useEffect(() => {
    loadConsent();
  }, []);

  const loadConsent = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed: ConsentState = JSON.parse(stored);
        if (
          parsed.hasConsented &&
          parsed.privacyVersion === CURRENT_PRIVACY_VERSION &&
          parsed.termsVersion === CURRENT_TERMS_VERSION
        ) {
          setHasConsented(true);
          setConsentDate(parsed.consentDate);
        }
      }
    } catch (e) {
      console.error('Failed to load consent', e);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptConsent = useCallback(async () => {
    const now = new Date().toISOString();
    const state: ConsentState = {
      hasConsented: true,
      consentDate: now,
      privacyVersion: CURRENT_PRIVACY_VERSION,
      termsVersion: CURRENT_TERMS_VERSION,
    };
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    setHasConsented(true);
    setConsentDate(now);
  }, []);

  const revokeConsent = useCallback(async () => {
    await AsyncStorage.removeItem(CONSENT_KEY);
    setHasConsented(false);
    setConsentDate(null);
  }, []);

  const value = useMemo(() => ({
    hasConsented,
    isLoading,
    consentDate,
    acceptConsent,
    revokeConsent,
  }), [hasConsented, isLoading, consentDate, acceptConsent, revokeConsent]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
