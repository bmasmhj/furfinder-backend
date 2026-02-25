import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetReport, PetStatus, PetProfile, PetNotification } from './types';
import { getApiUrl } from './query-client';
import { useAuth } from './auth-context';
import { fetch } from 'expo/fetch';

const SEARCH_RADIUS_KEY = '@search_radius_km';
const DEFAULT_SEARCH_RADIUS_KM = 10;

async function apiFetch(path: string, token: string | null, options?: RequestInit) {
  const baseUrl = getApiUrl();
  const url = new URL(path, baseUrl).toString();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

interface PetContextValue {
  reports: PetReport[];
  myReports: PetReport[];
  reunitedReports: PetReport[];
  addReport: (report: Omit<PetReport, 'id' | 'createdAt' | 'comments' | 'timeline' | 'rewardPool'>) => Promise<void>;
  updateReport: (id: string, updates: Partial<PetReport>) => Promise<void>;
  updateReportStatus: (id: string, status: PetStatus) => Promise<void>;
  markReunited: (id: string, message: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => PetReport | undefined;
  addComment: (reportId: string, author: string, text: string) => Promise<void>;
  addRewardContribution: (reportId: string, amount: number) => Promise<void>;
  boostReport: (id: string) => Promise<void>;
  profiles: PetProfile[];
  addProfile: (profile: Omit<PetProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PetProfile>;
  updateProfile: (id: string, updates: Partial<PetProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  getProfile: (id: string) => PetProfile | undefined;
  notifications: PetNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  searchRadiusKm: number;
  setSearchRadiusKm: (radius: number) => Promise<void>;
  isLoading: boolean;
  refreshReports: () => Promise<void>;
}

const PetContext = createContext<PetContextValue | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<PetReport[]>([]);
  const [profiles, setProfiles] = useState<PetProfile[]>([]);
  const [notifications, setNotifications] = useState<PetNotification[]>([]);
  const [searchRadiusKm, setSearchRadiusKmState] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const storedRadius = await AsyncStorage.getItem(SEARCH_RADIUS_KEY);
      if (storedRadius) {
        const parsed = parseInt(storedRadius, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
          setSearchRadiusKmState(parsed);
        }
      }

      const reportsRes = await apiFetch('/api/reports', token);
      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data);
      }

      if (token) {
        const [profilesRes, notifsRes] = await Promise.all([
          apiFetch('/api/profiles', token),
          apiFetch('/api/notifications', token),
        ]);

        if (profilesRes.ok) {
          setProfiles(await profilesRes.json());
        }
        if (notifsRes.ok) {
          setNotifications(await notifsRes.json());
        }
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshReports = useCallback(async () => {
    try {
      const res = await apiFetch('/api/reports', token);
      if (res.ok) {
        setReports(await res.json());
      }
    } catch (e) {
      console.error('Failed to refresh reports', e);
    }
  }, [token]);

  const setSearchRadiusKm = useCallback(async (radius: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(radius)));
    setSearchRadiusKmState(clamped);
    try {
      await AsyncStorage.setItem(SEARCH_RADIUS_KEY, String(clamped));
    } catch (e) {
      console.error('Failed to save search radius', e);
    }
  }, []);

  const addReport = useCallback(async (report: Omit<PetReport, 'id' | 'createdAt' | 'comments' | 'timeline' | 'rewardPool'>) => {
    const res = await apiFetch('/api/reports', token, {
      method: 'POST',
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create report' }));
      throw new Error(err.message);
    }
    const newReport = await res.json();
    setReports(prev => [newReport, ...prev]);
  }, [token]);

  const updateReport = useCallback(async (id: string, updates: Partial<PetReport>) => {
    const res = await apiFetch(`/api/reports/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update report' }));
      throw new Error(err.message);
    }
    const updated = await res.json();
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  }, [token]);

  const updateReportStatus = useCallback(async (id: string, status: PetStatus) => {
    await updateReport(id, { status });
  }, [updateReport]);

  const markReunited = useCallback(async (id: string, message: string) => {
    const res = await apiFetch(`/api/reports/${id}/reunite`, token, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to mark as reunited' }));
      throw new Error(err.message);
    }
    const updated = await res.json();
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  }, [token]);

  const toggleLike = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/reports/${id}/like`, token, { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    setReports(prev => prev.map(r => r.id === id ? { ...r, likes: data.likes, likedByMe: data.likedByMe } : r));
  }, [token]);

  const deleteReport = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/reports/${id}`, token, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to delete report' }));
      throw new Error(err.message);
    }
    setReports(prev => prev.filter(r => r.id !== id));
  }, [token]);

  const getReport = useCallback((id: string) => {
    return reports.find(r => r.id === id);
  }, [reports]);

  const addComment = useCallback(async (reportId: string, author: string, text: string) => {
    const res = await apiFetch(`/api/reports/${reportId}/comments`, token, {
      method: 'POST',
      body: JSON.stringify({ author, text }),
    });
    if (!res.ok) return;
    const comment = await res.json();
    setReports(prev => prev.map(r => {
      if (r.id !== reportId) return r;
      return { ...r, comments: [...(r.comments || []), comment] };
    }));
  }, [token]);

  const addRewardContribution = useCallback(async (reportId: string, amount: number) => {
    const res = await apiFetch(`/api/reports/${reportId}/reward`, token, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setReports(prev => prev.map(r => {
      if (r.id !== reportId) return r;
      return { ...r, rewardPool: data.rewardPool };
    }));
  }, [token]);

  const boostReport = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/reports/${id}/boost`, token, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to boost report' }));
      throw new Error(err.message);
    }
    const updated = await res.json();
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  }, [token]);

  const addProfile = useCallback(async (profile: Omit<PetProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await apiFetch('/api/profiles', token, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create profile' }));
      throw new Error(err.message);
    }
    const newProfile = await res.json();
    setProfiles(prev => [newProfile, ...prev]);
    return newProfile;
  }, [token]);

  const updateProfile = useCallback(async (id: string, updates: Partial<PetProfile>) => {
    const res = await apiFetch(`/api/profiles/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update profile' }));
      throw new Error(err.message);
    }
    const updated = await res.json();
    setProfiles(prev => prev.map(p => p.id === id ? updated : p));
  }, [token]);

  const deleteProfile = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/profiles/${id}`, token, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to delete profile' }));
      throw new Error(err.message);
    }
    setProfiles(prev => prev.filter(p => p.id !== id));
  }, [token]);

  const getProfile = useCallback((id: string) => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const markNotificationRead = useCallback(async (notifId: string) => {
    await apiFetch(`/api/notifications/${notifId}/read`, token, { method: 'PUT' });
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, [token]);

  const markAllNotificationsRead = useCallback(async () => {
    await apiFetch('/api/notifications/read-all', token, { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [token]);

  const clearNotifications = useCallback(async () => {
    await apiFetch('/api/notifications', token, { method: 'DELETE' });
    setNotifications([]);
  }, [token]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const myReports = useMemo(() => reports.filter(r => r.isOwner), [reports]);
  const reunitedReports = useMemo(() =>
    reports.filter(r => r.status === 'reunited').sort((a, b) =>
      new Date(b.reunionDate || b.createdAt).getTime() - new Date(a.reunionDate || a.createdAt).getTime()
    ), [reports]);

  const value = useMemo(() => ({
    reports,
    myReports,
    reunitedReports,
    addReport,
    updateReport,
    updateReportStatus,
    markReunited,
    toggleLike,
    deleteReport,
    getReport,
    addComment,
    addRewardContribution,
    boostReport,
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    searchRadiusKm,
    setSearchRadiusKm,
    isLoading,
    refreshReports,
  }), [reports, myReports, reunitedReports, addReport, updateReport, updateReportStatus, markReunited, toggleLike, deleteReport, getReport, addComment, addRewardContribution, boostReport, profiles, addProfile, updateProfile, deleteProfile, getProfile, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, clearNotifications, searchRadiusKm, setSearchRadiusKm, isLoading, refreshReports]);

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
