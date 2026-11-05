import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

/**
 * Hook to safely read the authentication state from Zustand.
 * Handles Next.js SSR hydration to prevent mismatch errors.
 * 
 * @returns {Object} Session details including hydration state, tokens, user data, and auth boolean.
 */
export function useAuthSession() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const domain = useAuthStore((state) => state.domain);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsHydrated(true), 0);
    
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return {
    isHydrated,
    token,
    user,
    domain,
    isAuthenticated: !!token,
  };
}
