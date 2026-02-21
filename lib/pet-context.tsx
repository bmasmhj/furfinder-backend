import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { PetReport, PetStatus, PetProfile } from './types';

const REPORTS_KEY = '@pet_reports';
const PROFILES_KEY = '@pet_profiles';

const SAMPLE_REPORTS: PetReport[] = [
  {
    id: 'sample-1',
    status: 'lost',
    petType: 'dog',
    petName: 'Buddy',
    breed: 'Golden Retriever',
    size: 'large',
    color: 'Golden',
    markings: 'White patch on chest',
    photoUri: '',
    description: 'Friendly golden retriever, responds to name. Wearing blue collar with tag.',
    latitude: -33.8688,
    longitude: 151.2093,
    locationName: 'Sydney CBD',
    lastSeenDate: '2026-02-20',
    reward: '$200',
    contactName: 'Sarah M.',
    contactPhone: '0412 345 678',
    createdAt: '2026-02-20T10:30:00Z',
    isOwner: false,
  },
  {
    id: 'sample-2',
    status: 'found',
    petType: 'cat',
    petName: 'Unknown',
    breed: 'Tabby',
    size: 'small',
    color: 'Grey with stripes',
    markings: 'White paws',
    photoUri: '',
    description: 'Found hiding under a car. Very timid but friendly once approached. No collar.',
    latitude: -33.8750,
    longitude: 151.2100,
    locationName: 'Darling Harbour',
    lastSeenDate: '2026-02-19',
    reward: '',
    contactName: 'James K.',
    contactPhone: '0423 456 789',
    createdAt: '2026-02-19T15:45:00Z',
    isOwner: false,
  },
  {
    id: 'sample-3',
    status: 'lost',
    petType: 'dog',
    petName: 'Max',
    breed: 'Border Collie',
    size: 'medium',
    color: 'Black and white',
    markings: 'Half white face',
    photoUri: '',
    description: 'Very energetic, might be scared. Microchipped. Please contact ASAP.',
    latitude: -33.8600,
    longitude: 151.2050,
    locationName: 'The Rocks',
    lastSeenDate: '2026-02-21',
    reward: '$500',
    contactName: 'Emma L.',
    contactPhone: '0434 567 890',
    createdAt: '2026-02-21T08:15:00Z',
    isOwner: false,
  },
  {
    id: 'sample-4',
    status: 'found',
    petType: 'rabbit',
    petName: 'Unknown',
    breed: 'Holland Lop',
    size: 'small',
    color: 'White and brown',
    markings: 'Floppy ears',
    photoUri: '',
    description: 'Found in backyard garden. Very tame, likely someone\'s pet.',
    latitude: -33.8800,
    longitude: 151.2150,
    locationName: 'Surry Hills',
    lastSeenDate: '2026-02-18',
    reward: '',
    contactName: 'Tom R.',
    contactPhone: '0445 678 901',
    createdAt: '2026-02-18T12:00:00Z',
    isOwner: false,
  },
];

interface PetContextValue {
  reports: PetReport[];
  myReports: PetReport[];
  addReport: (report: Omit<PetReport, 'id' | 'createdAt'>) => Promise<void>;
  updateReportStatus: (id: string, status: PetStatus) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => PetReport | undefined;
  profiles: PetProfile[];
  addProfile: (profile: Omit<PetProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PetProfile>;
  updateProfile: (id: string, updates: Partial<PetProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  getProfile: (id: string) => PetProfile | undefined;
  isLoading: boolean;
}

const PetContext = createContext<PetContextValue | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<PetReport[]>([]);
  const [profiles, setProfiles] = useState<PetProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedReports, storedProfiles] = await Promise.all([
        AsyncStorage.getItem(REPORTS_KEY),
        AsyncStorage.getItem(PROFILES_KEY),
      ]);

      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(SAMPLE_REPORTS);
        await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(SAMPLE_REPORTS));
      }

      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      }
    } catch (e) {
      console.error('Failed to load data', e);
      setReports(SAMPLE_REPORTS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReports = async (updated: PetReport[]) => {
    try {
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save reports', e);
    }
  };

  const saveProfiles = async (updated: PetProfile[]) => {
    try {
      await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profiles', e);
    }
  };

  const addReport = useCallback(async (report: Omit<PetReport, 'id' | 'createdAt'>) => {
    const newReport: PetReport = {
      ...report,
      id: Crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    await saveReports(updated);
  }, [reports]);

  const updateReportStatus = useCallback(async (id: string, status: PetStatus) => {
    const updated = reports.map(r => r.id === id ? { ...r, status } : r);
    setReports(updated);
    await saveReports(updated);
  }, [reports]);

  const deleteReport = useCallback(async (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    await saveReports(updated);
  }, [reports]);

  const getReport = useCallback((id: string) => {
    return reports.find(r => r.id === id);
  }, [reports]);

  const addProfile = useCallback(async (profile: Omit<PetProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProfile: PetProfile = {
      ...profile,
      id: Crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    await saveProfiles(updated);
    return newProfile;
  }, [profiles]);

  const updateProfile = useCallback(async (id: string, updates: Partial<PetProfile>) => {
    const updated = profiles.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setProfiles(updated);
    await saveProfiles(updated);
  }, [profiles]);

  const deleteProfile = useCallback(async (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    await saveProfiles(updated);
  }, [profiles]);

  const getProfile = useCallback((id: string) => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const myReports = useMemo(() => reports.filter(r => r.isOwner), [reports]);

  const value = useMemo(() => ({
    reports,
    myReports,
    addReport,
    updateReportStatus,
    deleteReport,
    getReport,
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    isLoading,
  }), [reports, myReports, addReport, updateReportStatus, deleteReport, getReport, profiles, addProfile, updateProfile, deleteProfile, getProfile, isLoading]);

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
