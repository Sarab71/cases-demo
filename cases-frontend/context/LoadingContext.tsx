'use client';

import { loadingRef } from '@/lib/loadingStore';
import { createContext, useContext, useEffect, useState } from 'react';

const LoadingContext = createContext<{ loading: boolean; progress: number }>({ loading: false, progress: 0 });

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadingRef.subscribe((isLoading, percent) => {
      setLoading(isLoading);
      setProgress(percent);
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, progress }}>
      {children}
    </LoadingContext.Provider>
  );
};
