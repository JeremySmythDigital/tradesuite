// useOfflineData hook for IndexedDB storage
import { useState, useEffect, useCallback } from 'react';

// This would typically use Dexie.js for IndexedDB
// For now, using localStorage as fallback

export function useOfflineData<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    if (typeof window === 'undefined') return initialData;
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : initialData;
    } catch {
      return initialData;
    }
  });

  const [pendingSync, setPendingSync] = useState<number>(0);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [key, data]);

  // Add item
  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, { ...item, id: Date.now().toString() } as T]);
    setPendingSync(prev => prev + 1);
  }, []);

  // Update item
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    ));
    setPendingSync(prev => prev + 1);
  }, []);

  // Delete item
  const deleteItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => (item as any).id !== id));
    setPendingSync(prev => prev + 1);
  }, []);

  // Sync with server when online
  const sync = useCallback(async (syncFn: (data: T[]) => Promise<void>) => {
    if (navigator.onLine) {
      try {
        await syncFn(data);
        setPendingSync(0);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }, [data]);

  return {
    data,
    pendingSync,
    addItem,
    updateItem,
    deleteItem,
    sync,
  };
}

// GPS Location hook
export function useLocationTracking() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error };
}

// Online status hook
export function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}