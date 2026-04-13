export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Dynamic segment helper
 * Example: routeWithParams(ROUTES.SERVICE_DETAILS, { id: '123' })
 */
export const routeWithParams = (path: string, params: Record<string, string>) => {
  return Object.entries(params).reduce((acc, [key, value]) => acc.replace(`:${key}`, value), path);
};

/**
 * Returns a localized route with the current locale
 */
export const getLocalizedRoute = (locale: Locale, path: string): string => `/${locale}${path}`;

/**
 * App routes definitions with dynamic segment typing where needed
 */
export const ROUTES = {
  HOME: '/',
  SAIP: {
    ROOT: '/saip',
    ABOUT: '/saip/about',
    NATIONAL_IP_STRATEGY: '/saip/national-ip-strategy',
    ORGANISATIONAL_STRUCTURE: '/saip/organisational-structure',
    PROJECTS: '/saip/projects',
    ENTITIES: '/saip/entities-partners',
  },
  SERVICES: {
    ROOT: '/services',
    SERVICES_OVERVIEW: '/services/services-overview',
    SERVICE_DIRECTORY: '/services/service-directory',
    PATENTS: '/services/patents',
    TRADEMARKS: '/services/trademarks',
    COPYRIGHTS: '/services/copyrights',
    DESIGNS: '/services/designs',
    PLANT_VARIETIES: '/services/plant-varieties',
    TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS: '/services/layout-designs-of-integrated-circuits',
    IP_LICENSING: '/services/ip-licensing',
    IP_ACADEMY: '/services/ip-academy',
    IP_SUPPORT_CENTERS: '/services/ip-support-centers',
    IP_CLINICS: '/services/ip-clinics',
    IP_INFRINGEMENT: '/services/ip-infringement',
    IP_GENERAL_SECRETARIAT: '/services/ip-general-secretariat',
  },
  RESOURCES: {
    ROOT: '/resources',
    IP_INFORMATION: {
      ROOT: '/resources/ip-information',
      DIGITAL_GUIDE: {
        ROOT: '/resources/ip-information/digital-guide',
        IP_RIGHTS: {
          ROOT: '/resources/ip-information/digital-guide/ip-rights',
        },
        GUIDELINES: {
          ROOT: '/resources/ip-information/guidelines',
        },
        FAQ: {
          ROOT: '/resources/ip-information/faq',
        },
        IP_GLOSSARY: {
          ROOT: '/resources/ip-information/ip-glossary',
        },
        REPORTS: {
          ROOT: '/resources/ip-information/reports',
        },
        IP_CATEGORY: {
          ROOT: '/resources/ip-information/digital-guide/ip-category',
          PATENTS: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/patents',
            CHECKLIST: '/resources/ip-information/digital-guide/ip-category/patents/checklist',
          },
          TRADEMARKS: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/trademarks',
            CHECKLIST: '/resources/ip-information/digital-guide/ip-category/trademarks/checklist',
          },
          COPYRIGHTS: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/copyrights',
            CHECKLIST: '/resources/ip-information/digital-guide/ip-category/copyrights/checklist',
          },
          DESIGNS: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/designs',
            CHECKLIST: '/resources/ip-information/digital-guide/ip-category/designs/checklist',
          },
          PLANT_VARIETIES: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/plant-varieties',
            CHECKLIST:
              '/resources/ip-information/digital-guide/ip-category/plant-varieties/checklist',
          },
          TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS: {
            ROOT: '/resources/ip-information/digital-guide/ip-category/topographic-designs-of-integrated-circuits',
            CHECKLIST:
              '/resources/ip-information/digital-guide/ip-category/topographic-designs-of-integrated-circuits/checklist',
          },
        },
        CHECK_YOUR_IDEA: {
          ROOT: '/resources/ip-information/digital-guide/check-your-idea',
        },
      },
    },
    TOOLS_AND_RESEARCH: {
      ROOT: '/resources/tools-and-research',

      IP_SEARCH_ENGINE: {
        ROOT: '/resources/tools-and-research/ip-search-engine',
      },
      GAZZETE: {
        ROOT: '/resources/tools-and-research/gazette',
      },
      PUBLICATIONS: {
        ROOT: '/resources/tools-and-research/publications',
      },
      IP_OBSERVATORY: {
        ROOT: '/resources/tools-and-research/ip-observatory',
        IP_SERVICES: {
          ROOT: '/resources/tools-and-research/ip-observatory/ip-services',
        },
        IP_ENABLEMENT: {
          ROOT: '/resources/tools-and-research/ip-observatory/ip-enablement',
        },
        IP_ENFORCEMENT: {
          ROOT: '/resources/tools-and-research/ip-observatory/ip-enforcement',
        },
      },

      OPEN_DATA: {
        ROOT: '/resources/tools-and-research/open-data',
      },
      PUBLIC_CONSULTATIONS: {
        ROOT: '/resources/tools-and-research/public-consultations',
      },
    },
    IP_LICENSING: {
      ROOT: '/resources/ip-licensing',

      IP_AGENTS: {
        ROOT: '/resources/ip-licensing/ip-agents',
      },
      SUPERVISORY_UNIT_FOR_NON_PROFIT_SECTOR_ORGANIZATIONS: {
        ROOT: '/resources/ip-licensing/supervisory-unit',
      },
    },
    LOWS_AND_REGULATIONS: {
      ROOT: '/resources/lows-and-regulations',

      SYSTEMS_AND_REGULATIONS: {
        ROOT: '/resources/lows-and-regulations/systems-and-regulations',
      },
      ITERNATIONAL_TREATIES: {
        ROOT: '/resources/lows-and-regulations/international-treaties',
      },
      LITIGATION_PATHS: {
        ROOT: '/resources/lows-and-regulations/litigation-paths',
      },
    },
  },
  MEDIA_CENTER: {
    ROOT: '/media-center',
    MEDIA_LIBRARY: {
      ROOT: '/media-center/media-library',
      MEDIA_CENTER: {
        ROOT: '/media-center/media-library/media-center',
      },
      ARTICLES_POLICIES: '/media-center/media-library/articles-policies',
    },
    MOVABLES_PLATFORM: {
      ROOT: '/media-center/movables-platform',
    },
    ABOUT_CHAIRWOMAN: {
      ROOT: '/media-center/about-chairwoman',
    },
    BRANDING: {
      ROOT: '/media-center/branding',
    },
  },
  CONTACT: {
    ROOT: '/contact-us',
    CONTACT_AND_SUPPORT: {
      ROOT: '/contact-us/contact-and-support',
    },
    CAREERS: {
      ROOT: '/contact-us/careers',
    },
  },
  SITEMAP: {
    ROOT: '/sitemap',
  },
} as const;

/**
 * Inferred route path string literal type
 */
export type RoutePath =
  | typeof ROUTES.HOME
  | (typeof ROUTES.SAIP)[keyof typeof ROUTES.SAIP]
  | (typeof ROUTES.SERVICES)[keyof typeof ROUTES.SERVICES]
  | (typeof ROUTES.RESOURCES)[keyof typeof ROUTES.RESOURCES]
  | (typeof ROUTES.MEDIA_CENTER)[keyof typeof ROUTES.MEDIA_CENTER]
  | (typeof ROUTES.CONTACT)[keyof typeof ROUTES.CONTACT];
