'use server';

import { cookies } from 'next/headers';
import {
  COOKIE_NAMES,
  CookieConsentState,
  CookiePreferences,
  createConsentState,
  serializeConsentState,
  parseConsentCookie,
  DEFAULT_PREFERENCES,
  ALL_ACCEPTED_PREFERENCES,
} from '@/lib/cookies';

/**
 * Get current cookie consent state (Server Action)
 */
export async function getConsentState(): Promise<CookieConsentState | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAMES.CONSENT)?.value;
  return parseConsentCookie(value);
}

/**
 * Check if user has given consent (Server Action)
 */
export async function hasConsent(): Promise<boolean> {
  const state = await getConsentState();
  return state?.accepted ?? false;
}

/**
 * Accept all cookies (Server Action)
 */
export async function acceptAllCookies(): Promise<CookieConsentState> {
  const cookieStore = await cookies();
  const state = createConsentState(true, ALL_ACCEPTED_PREFERENCES);

  cookieStore.set(COOKIE_NAMES.CONSENT, serializeConsentState(state), {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
  });

  return state;
}

/**
 * Accept only essential cookies (Server Action)
 */
export async function acceptEssentialCookies(): Promise<CookieConsentState> {
  const cookieStore = await cookies();
  const state = createConsentState(true, DEFAULT_PREFERENCES);

  cookieStore.set(COOKIE_NAMES.CONSENT, serializeConsentState(state), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
  });

  return state;
}

/**
 * Update cookie preferences (Server Action)
 */
export async function updateCookiePreferences(
  preferences: Partial<CookiePreferences>,
): Promise<CookieConsentState> {
  const cookieStore = await cookies();
  const currentState = await getConsentState();

  const newPreferences: CookiePreferences = {
    essential: true, // Always true
    analytics: preferences.analytics ?? currentState?.preferences.analytics ?? false,
    marketing: preferences.marketing ?? currentState?.preferences.marketing ?? false,
  };

  const state = createConsentState(true, newPreferences);

  cookieStore.set(COOKIE_NAMES.CONSENT, serializeConsentState(state), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
  });

  return state;
}

/**
 * Revoke cookie consent (Server Action)
 */
export async function revokeCookieConsent(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.CONSENT);
}
