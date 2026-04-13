/**
 * Drupal Configuration
 * Environment-based configuration for different deployment stages
 * Updated to match actual SAIP Drupal Content Types
 */

// Removed child_process import to fix client-side rendering error

const SAIP_ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const;
type SaipEnvironment = (typeof SAIP_ENVIRONMENTS)[number];

const isSaipEnvironment = (value?: string | null): value is SaipEnvironment =>
  !!value && SAIP_ENVIRONMENTS.includes(value.toLowerCase() as SaipEnvironment);

const BRANCH_TO_ENV: Record<string, SaipEnvironment> = {
  development: 'development',
  dev: 'development',
  test: 'test',
  testing: 'test',
  staging: 'staging',
  stage: 'staging',
  production: 'production',
  prod: 'production',
  main: 'production',
  master: 'production',
};

const ENVIRONMENT_URLS: Record<SaipEnvironment, string> = {
  development: 'http://gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa',
  test: 'http://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa',
  staging: 'http://gp-saip-portals-website-backend-v3.staging.internal.saip.gov.sa',
  production: 'http://gp-saip-portals-website-backend-v3.production.internal.saip.gov.sa',
};

const normalizeBranchName = (branch: string) =>
  branch
    .replace(/^origin\//, '')
    .replace(/^refs\/heads\//, '')
    .toLowerCase();

const getEnvironmentFromBranch = (branch?: string | null): SaipEnvironment | null => {
  if (!branch) return null;
  const normalized = normalizeBranchName(branch);
  return BRANCH_TO_ENV[normalized] ?? null;
};

const getEnvironmentFromEnvVar = (value?: string | null): SaipEnvironment | null => {
  if (!value) return null;
  return isSaipEnvironment(value) ? (value.toLowerCase() as SaipEnvironment) : null;
};

const detectEnvironmentFromHostname = (hostname?: string | null): SaipEnvironment | null => {
  if (!hostname) {
    return null;
  }

  const normalized = hostname.toLowerCase();

  if (
    normalized === 'localhost' ||
    normalized.startsWith('127.') ||
    normalized.endsWith('.local')
  ) {
    return 'development';
  }

  if (normalized.includes('development')) {
    return 'development';
  }

  if (normalized.includes('test')) {
    return 'test';
  }

  if (normalized.includes('staging')) {
    return 'staging';
  }

  if (normalized.includes('prod')) {
    return 'production';
  }

  if (normalized.includes('production')) {
    return 'production';
  }

  return null;
};

const getEnvironmentFromRuntimeHostname = (): SaipEnvironment | null => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return detectEnvironmentFromHostname(window.location.hostname);
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL;
  if (!siteUrl) return null;

  try {
    const hostname = new URL(siteUrl).hostname;
    return detectEnvironmentFromHostname(hostname);
  } catch {
    return null;
  }
};

const getExplicitBaseEnv = (): string | null =>
  process.env.NEXT_PUBLIC_BASE_ENV || process.env.NEXT_PUBLIC_SAIP_ENV || null;

/**
 * Hard rule: development runtime host always points to development backend.
 * For other runtimes, resolve from explicit env vars.
 */
const resolveEffectiveEnvironment = (explicitEnv?: string | null): SaipEnvironment | null => {
  const runtimeEnv = getEnvironmentFromRuntimeHostname();
  if (runtimeEnv === 'development') {
    return 'development';
  }

  const parsedExplicitEnv = getEnvironmentFromEnvVar(explicitEnv);
  return parsedExplicitEnv ?? null;
};

// Get current environment for automatic detection
/* global process */
const getCurrentEnvironment = (): SaipEnvironment => {
  const explicitEnv = resolveEffectiveEnvironment(getExplicitBaseEnv());
  if (explicitEnv) {
    return explicitEnv;
  }

  // Default: use test environment
  return 'test';
};

const getBackendUrlForEnvironment = (environment: SaipEnvironment): string =>
  ENVIRONMENT_URLS[environment] ?? ENVIRONMENT_URLS.development;

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

/**
 * Internal K8s service URLs for server-side fetches (pod-to-pod).
 * Used when DRUPAL_INTERNAL_URL is not set and app runs in Kubernetes.
 * For per-env namespaces override with DRUPAL_INTERNAL_URL.
 */
const INTERNAL_SERVICE_FALLBACK_URLS: Partial<Record<SaipEnvironment, string>> = {
  development: 'http://website-backend-v3.saip-portals.svc.cluster.local',
  test: 'http://website-backend-v3.saip-portals.svc.cluster.local',
  staging: 'http://website-backend-v3.saip-portals.svc.cluster.local',
  production: 'http://website-backend-v3.saip-portals.svc.cluster.local',
};

// Environment-specific URLs for SAIP Saudi servers
export const getApiUrl = () => {
  // === PRIORITY 1: Explicit backend URL override (local Docker / custom endpoint) ===
  if (process.env.NEXT_PUBLIC_DRUPAL_API_URL) {
    return process.env.NEXT_PUBLIC_DRUPAL_API_URL;
  }

  // === PRIORITY 2: Explicit NEXT_PUBLIC_SAIP_ENV (Jenkins/DevOps variable) ===
  const explicitEnv = resolveEffectiveEnvironment(getExplicitBaseEnv());
  if (explicitEnv) {
    const backendUrl = ENVIRONMENT_URLS[explicitEnv];
    return backendUrl;
  }

  // === PRIORITY 3: Detect environment from hostname (safe fallback) ===
  const runtimeEnv = getEnvironmentFromRuntimeHostname();
  if (runtimeEnv) {
    return ENVIRONMENT_URLS[runtimeEnv];
  }

  // === DEFAULT: TEST environment (for SAIP test server) ===
  const defaultEnv: SaipEnvironment = 'test';
  const backendUrl = ENVIRONMENT_URLS[defaultEnv];
  return backendUrl;
};

/**
 * Server-side Drupal base URL (API routes like proxy-file, feedback).
 * DRUPAL_INTERNAL_URL if set; else in K8s use INTERNAL_SERVICE_FALLBACK_URLS; else getApiUrl().
 */
export const getServerDrupalBaseUrl = (): string => {
  const internalUrl = process.env.DRUPAL_INTERNAL_URL?.trim();
  if (internalUrl) {
    return stripTrailingSlash(internalUrl).replace(/\/jsonapi$/, '');
  }

  const isK8s = Boolean(process.env.KUBERNETES_SERVICE_HOST);
  const runtimeEnv = getEnvironmentFromRuntimeHostname();
  const explicitEnv = getEnvironmentFromEnvVar(getExplicitBaseEnv());
  const resolvedEnv = (runtimeEnv ?? explicitEnv ?? 'development') as SaipEnvironment;

  if (isK8s && resolvedEnv && INTERNAL_SERVICE_FALLBACK_URLS[resolvedEnv]) {
    const base = INTERNAL_SERVICE_FALLBACK_URLS[resolvedEnv];
    return stripTrailingSlash(base).replace(/\/jsonapi$/, '');
  }

  return stripTrailingSlash(getApiUrl()).replace(/\/jsonapi\/?$/, '');
};

// Environment configuration for SAIP Saudi infrastructure
export const drupalConfig = {
  // API Base URL based on SAIP environment detection
  baseUrl: getApiUrl(),

  // API paths
  jsonApiPath: '/jsonapi',

  // Cache settings based on environment
  revalidateTime:
    process.env.NODE_ENV === 'production' ? parseInt(process.env.DRUPAL_API_CACHE_TIME || '60') : 0,

  // Request timeouts
  timeout: parseInt(process.env.DRUPAL_API_TIMEOUT || '30000'),

  // Debug mode
  debug: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || process.env.NODE_ENV === 'development',

  // Fallback content when API fails
  useFallback: process.env.NEXT_PUBLIC_USE_FALLBACK_DATA !== 'false',

  // Current environment with auto-detection
  environment: getCurrentEnvironment(),
};

// API endpoints matching actual SAIP Content Types
export const API_ENDPOINTS = {
  homepage: '/node/homepage',
  news: '/node/news',
  articles: '/node/article',
  services: '/node/service',
  pages: '/node/page',
  highlights: '/node/highlight',
} as const;

// Field mappings for SAIP Homepage Content Type
export const HOMEPAGE_FIELDS = {
  hero_heading: 'field_hero_heading',
  hero_subheading: 'field_hero_subheading',
  hero_videos: 'field_hero_videos',
  about_heading: 'field_about_heading',
  about_text: 'field_about_text',
  about_image: 'field_about_image',
  services_heading: 'field_services_heading',
  services_text: 'field_services_text',
  news_title: 'field_news_title',
  news_text: 'field_news_text',
  featured_news_items: 'field_featured_news_items',
  highlights_heading: 'field_highlights_heading',
  highlights_text: 'field_highlights_text',
  highlight_items: 'field_highlight_items',
} as const;
