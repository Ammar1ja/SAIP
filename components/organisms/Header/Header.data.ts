import { ROUTES } from '@/lib/routes';
import { group } from 'console';
import ServicesOverview from '@/components/icons/services/ServicesOverview';
import { ServicesDirectory } from '@/components/icons/services';

export const saipLinks = [
  { href: ROUTES.SAIP.ABOUT, label: 'About SAIP', group: 'SAIP' },
  { href: ROUTES.SAIP.NATIONAL_IP_STRATEGY, label: 'National IP strategy', group: 'SAIP' },
  { href: ROUTES.SAIP.ORGANISATIONAL_STRUCTURE, label: 'Organisational structure', group: 'SAIP' },
  { href: ROUTES.SAIP.PROJECTS, label: 'SAIP projects', group: 'SAIP' },
  { href: ROUTES.SAIP.ENTITIES, label: 'Entities & partners', group: 'SAIP' },
];

export const servicesLinks = [
  {
    href: ROUTES.SERVICES.SERVICES_OVERVIEW,
    label: 'Services overview',
    icon: {
      component: ServicesOverview,
    },
  },
  {
    href: ROUTES.SERVICES.SERVICE_DIRECTORY,
    label: 'SAIP service directory',
    icon: {
      component: ServicesDirectory,
    },
  },
  {
    href: ROUTES.SERVICES.PATENTS,
    label: 'Patents',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.TRADEMARKS,
    label: 'Trademarks',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.COPYRIGHTS,
    label: 'Copyrights',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.DESIGNS,
    label: 'Designs',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.PLANT_VARIETIES,
    label: 'Plants varieties',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS,
    label: 'Layout designs of Integrated Circuits',
    group: 'IP Protection & Management',
  },
  {
    href: ROUTES.SERVICES.IP_LICENSING,
    label: 'Licensing of IP activities',
    group: 'IP enablement',
  },
  {
    href: ROUTES.SERVICES.IP_ACADEMY,
    label: 'IP academy',
    group: 'IP enablement',
  },
  {
    href: ROUTES.SERVICES.IP_CLINICS,
    label: 'IP clinics',
    group: 'IP enablement',
  },
  {
    href: ROUTES.SERVICES.IP_SUPPORT_CENTERS,
    label: 'National network of IP support centers',
    group: 'IP enablement',
  },
  {
    href: ROUTES.SERVICES.IP_INFRINGEMENT,
    label: 'IP infringement',
    group: 'IP enforcement & dispute',
  },
  {
    href: ROUTES.SERVICES.IP_GENERAL_SECRETARIAT,
    label: 'General secretariat of IP dispute resolution committees',
    group: 'IP enforcement & dispute',
  },
];

export const resourcesLinks = [
  {
    href: ROUTES.RESOURCES.ROOT,
    label: 'Resources overview',
    icon: {
      component: ServicesOverview,
    },
  },
  {
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT,
    label: 'Digital guide',
    group: 'IP information',
  },
  {
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
    label: 'Guidelines',
    group: 'IP information',
  },
  {
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT,
    label: 'FAQs',
    group: 'IP information',
  },
  {
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_GLOSSARY.ROOT,
    label: 'IP glossary',
    group: 'IP information',
  },
  {
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.REPORTS.ROOT,
    label: 'Reports',
    group: 'IP information',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_SEARCH_ENGINE.ROOT,
    label: 'IP search engine',
    group: 'Tools & research',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT,
    label: 'Gazette',
    group: 'Tools & research',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLICATIONS.ROOT,
    label: 'Publications',
    group: 'Tools & research',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT,
    label: 'IP observatory',
    group: 'Tools & research',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.OPEN_DATA.ROOT,
    label: 'Open data',
    group: 'Tools & research',
  },

  {
    href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLIC_CONSULTATIONS.ROOT,
    label: 'Public consultations',
    group: 'Tools & research',
  },
  { href: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT, label: 'IP agents', group: 'IP licenses' },

  {
    href: ROUTES.RESOURCES.IP_LICENSING.SUPERVISORY_UNIT_FOR_NON_PROFIT_SECTOR_ORGANIZATIONS.ROOT,
    label: 'Supervisory unit for non-profit sector organizations',
    group: 'IP licenses',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
    label: 'Systems & regulations',
    group: 'Laws & regulations',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.LITIGATION_PATHS.ROOT,
    label: 'Litigation paths',
    group: 'Laws & regulations',
  },
  {
    href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.ITERNATIONAL_TREATIES.ROOT,
    label: 'International treaties & agreements',
    group: 'Laws & regulations',
  },
];

export const mediaCenterLinks = [
  {
    href: ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT,
    label: 'Media Center',
    group: 'Media Library',
  },
  {
    href: ROUTES.MEDIA_CENTER.MOVABLES_PLATFORM.ROOT,
    label: 'Movables platform',
    group: 'Media Library',
  },
  {
    href: ROUTES.MEDIA_CENTER.BRANDING.ROOT,
    label: 'Branding',
    group: 'Media Library',
  },
];

export const contactLinks = [
  {
    href: ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT,
    label: 'Contact & support',
    group: 'Contact us',
  },
  {
    href: ROUTES.CONTACT.CAREERS.ROOT,
    label: 'Careers',
    group: 'Contact us',
  },
];
