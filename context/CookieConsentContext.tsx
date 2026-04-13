'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CookieConsentState,
  CookiePreferences,
  CookieCategory,
  clientCookies,
  createConsentState,
  DEFAULT_PREFERENCES,
  ALL_ACCEPTED_PREFERENCES,
} from '@/lib/cookies';

interface CookieConsentContextType {
  // State
  consent: CookieConsentState | null;
  hasConsent: boolean;
  isLoading: boolean;

  // Check specific category
  hasConsentFor: (category: CookieCategory) => boolean;

  // Actions
  acceptAll: () => void;
  acceptEssential: () => void;
  updatePreferences: (preferences: Partial<CookiePreferences>) => void;
  revokeConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from cookie on mount
  useEffect(() => {
    const storedConsent = clientCookies.getConsent();
    setConsent(storedConsent);
    setIsLoading(false);
  }, []);

  // Derived state
  const hasConsent = useMemo(() => consent?.accepted ?? false, [consent]);

  // Check if user has consent for specific category
  const hasConsentFor = useCallback(
    (category: CookieCategory): boolean => {
      if (category === 'essential') return true;
      if (!consent?.accepted) return false;
      return consent.preferences[category] ?? false;
    },
    [consent],
  );

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const newState = createConsentState(true, ALL_ACCEPTED_PREFERENCES);
    clientCookies.setConsent(newState);
    setConsent(newState);
  }, []);

  // Accept only essential cookies
  const acceptEssential = useCallback(() => {
    const newState = createConsentState(true, DEFAULT_PREFERENCES);
    clientCookies.setConsent(newState);
    setConsent(newState);
  }, []);

  // Update specific preferences
  const updatePreferences = useCallback(
    (preferences: Partial<CookiePreferences>) => {
      const currentPrefs = consent?.preferences ?? DEFAULT_PREFERENCES;
      const newPreferences: CookiePreferences = {
        essential: true,
        analytics: preferences.analytics ?? currentPrefs.analytics,
        marketing: preferences.marketing ?? currentPrefs.marketing,
      };
      const newState = createConsentState(true, newPreferences);
      clientCookies.setConsent(newState);
      setConsent(newState);
    },
    [consent],
  );

  // Revoke consent
  const revokeConsent = useCallback(() => {
    clientCookies.remove('SAIP_COOKIE_CONSENT');
    setConsent(null);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      hasConsent,
      isLoading,
      hasConsentFor,
      acceptAll,
      acceptEssential,
      updatePreferences,
      revokeConsent,
    }),
    [
      consent,
      hasConsent,
      isLoading,
      hasConsentFor,
      acceptAll,
      acceptEssential,
      updatePreferences,
      revokeConsent,
    ],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

/**
 * Hook to access cookie consent context
 */
export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

/**
 * Hook to check if analytics cookies are allowed
 */
export function useAnalyticsConsent(): boolean {
  const { hasConsentFor } = useCookieConsent();
  return hasConsentFor('analytics');
}

/**
 * Hook to check if marketing cookies are allowed
 */
export function useMarketingConsent(): boolean {
  const { hasConsentFor } = useCookieConsent();
  return hasConsentFor('marketing');
}
