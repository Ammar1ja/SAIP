import { ROUTES } from '@/lib/routes';

// Navigation links with translation keys (labelKey) instead of hardcoded labels
export const saipLinks = [
  { href: ROUTES.SAIP.ABOUT, labelKey: 'aboutSaip' },
  { href: ROUTES.SAIP.NATIONAL_IP_STRATEGY, labelKey: 'nationalIpStrategy' },
  { href: ROUTES.SAIP.ORGANISATIONAL_STRUCTURE, labelKey: 'organisationalStructure' },
  { href: ROUTES.SAIP.PROJECTS, labelKey: 'saipProjects' },
  { href: ROUTES.SAIP.ENTITIES, labelKey: 'entitiesPartners' },
];

export const servicesLinks = [
  { href: ROUTES.SERVICES.SERVICES_OVERVIEW, labelKey: 'servicesOverview' },
  { href: ROUTES.SERVICES.SERVICE_DIRECTORY, labelKey: 'serviceDirectory' },
  { href: ROUTES.SERVICES.PATENTS, labelKey: 'patents' },
  { href: ROUTES.SERVICES.TRADEMARKS, labelKey: 'trademarks' },
  { href: ROUTES.SERVICES.COPYRIGHTS, labelKey: 'copyrights' },
  { href: ROUTES.SERVICES.DESIGNS, labelKey: 'designs' },
  { href: ROUTES.SERVICES.PLANT_VARIETIES, labelKey: 'plantVarieties' },
  { href: ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS, labelKey: 'layoutDesigns' },
  { href: ROUTES.SERVICES.IP_LICENSING, labelKey: 'ipLicensing' },
  { href: ROUTES.SERVICES.IP_ACADEMY, labelKey: 'ipAcademy' },
  { href: ROUTES.SERVICES.IP_SUPPORT_CENTERS, labelKey: 'ipSupportCenters' },
  { href: ROUTES.SERVICES.IP_CLINICS, labelKey: 'ipClinics' },
  { href: ROUTES.SERVICES.IP_INFRINGEMENT, labelKey: 'ipInfringement' },
  { href: ROUTES.SERVICES.IP_GENERAL_SECRETARIAT, labelKey: 'generalSecretariat' },
];

export const resourcesLinks = [
  { href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT, labelKey: 'digitalGuide' },
  { href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT, labelKey: 'guidelines' },
  { href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT, labelKey: 'faqs' },
  { href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_GLOSSARY.ROOT, labelKey: 'ipGlossary' },
  { href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.REPORTS.ROOT, labelKey: 'reports' },
  { href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_SEARCH_ENGINE.ROOT, labelKey: 'ipSearchEngine' },
  { href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT, labelKey: 'gazette' },
  { href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLICATIONS.ROOT, labelKey: 'publications' },
  { href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT, labelKey: 'ipObservatory' },
  { href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.OPEN_DATA.ROOT, labelKey: 'openData' },
  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLIC_CONSULTATIONS.ROOT,
    labelKey: 'publicConsultations',
  },
  { href: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT, labelKey: 'ipAgents' },
  {
    href: ROUTES.RESOURCES.IP_LICENSING.SUPERVISORY_UNIT_FOR_NON_PROFIT_SECTOR_ORGANIZATIONS.ROOT,
    labelKey: 'supervisoryUnit',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
    labelKey: 'systemsRegulations',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.LITIGATION_PATHS.ROOT,
    labelKey: 'litigationPaths',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.ITERNATIONAL_TREATIES.ROOT,
    labelKey: 'internationalTreaties',
  },
];

export const mediaCenterLinks = [
  { href: ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT, labelKey: 'mediaCenterMain' },
  { href: ROUTES.MEDIA_CENTER.BRANDING.ROOT, labelKey: 'branding' },
  { href: ROUTES.MEDIA_CENTER.MOVABLES_PLATFORM.ROOT, labelKey: 'movablesPlatform' },
  { href: ROUTES.MEDIA_CENTER.ABOUT_CHAIRWOMAN.ROOT, labelKey: 'aboutChairwoman' },
];

export const contactLinks = [
  { href: ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT, labelKey: 'contactSupport' },
  { href: ROUTES.CONTACT.CAREERS.ROOT, labelKey: 'careers' },
];
