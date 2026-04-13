/**
 * Cookie utilities for SAIP
 * Uses native Next.js cookies API
 */

// Cookie names
export const COOKIE_NAMES = {
  CONSENT: 'SAIP_COOKIE_CONSENT',
  LOCALE: 'NEXT_LOCALE',
} as const;

// Cookie categories
export type CookieCategory = 'essential' | 'analytics' | 'marketing';

// Consent preferences
export interface CookiePreferences {
  essential: boolean; // Always true, required for site to function
  analytics: boolean;
  marketing: boolean;
}

// Full consent state
export interface CookieConsentState {
  accepted: boolean;
  preferences: CookiePreferences;
  timestamp: string; // ISO date string
}

// Default preferences (essential only)
export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

// All accepted preferences
export const ALL_ACCEPTED_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: true,
};

/**
 * Parse consent cookie value
 */
export function parseConsentCookie(value: string | undefined): CookieConsentState | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (
      typeof parsed.accepted === 'boolean' &&
      typeof parsed.preferences === 'object' &&
      typeof parsed.timestamp === 'string'
    ) {
      return parsed as CookieConsentState;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Serialize consent state to cookie value
 */
export function serializeConsentState(state: CookieConsentState): string {
  return JSON.stringify(state);
}

/**
 * Create consent state
 */
export function createConsentState(
  accepted: boolean,
  preferences: CookiePreferences = DEFAULT_PREFERENCES,
): CookieConsentState {
  return {
    accepted,
    preferences: {
      ...preferences,
      essential: true, // Essential is always true
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Client-side cookie utilities
 * Only use in client components
 */
export const clientCookies = {
  get(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return undefined;
  },

  set(name: string, value: string, days: number = 365): void {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  remove(name: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  getConsent(): CookieConsentState | null {
    const value = this.get(COOKIE_NAMES.CONSENT);
    return parseConsentCookie(value);
  },

  setConsent(state: CookieConsentState): void {
    this.set(COOKIE_NAMES.CONSENT, serializeConsentState(state), 365);
  },

  hasConsent(): boolean {
    const consent = this.getConsent();
    return consent?.accepted ?? false;
  },

  hasConsentFor(category: CookieCategory): boolean {
    const consent = this.getConsent();
    if (!consent?.accepted) return category === 'essential';
    return consent.preferences[category] ?? false;
  },
};
