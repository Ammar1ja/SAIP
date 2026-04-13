import { ROUTES } from '@/lib/routes';
import { SitemapListItems } from '@/components/molecules/SitemapList/SitemapList.types';

export const HERO = {
  title: 'Sitemap',
  description:
    'A sitemap serves as a guide, simplifying navigation and making information on the website easier to locate.',
};

export const SITEMAP_DATA: SitemapListItems[] = [
  {
    label: 'Resources',
    children: [
      { href: ROUTES.SAIP.ABOUT, label: 'About SAIP' },
      { href: ROUTES.SAIP.NATIONAL_IP_STRATEGY, label: 'National IP strategy' },
      { href: ROUTES.SAIP.ORGANISATIONAL_STRUCTURE, label: 'Organisational structure' },
      { href: ROUTES.SAIP.PROJECTS, label: 'SAIP projects' },
      { href: ROUTES.SAIP.ENTITIES, label: 'Entities & partners' },
    ],
  },
  {
    label: 'Services',
    children: [
      {
        href: ROUTES.SERVICES.SERVICES_OVERVIEW,
        label: 'Services overview',
      },
      {
        href: ROUTES.SERVICES.SERVICE_DIRECTORY,
        label: 'SAIP service directory',
      },
      {
        label: 'IP protection & management',
        children: [
          {
            href: ROUTES.SERVICES.PATENTS,
            label: 'Patents',
          },
          {
            href: ROUTES.SERVICES.TRADEMARKS,
            label: 'Trademarks',
          },
          {
            href: ROUTES.SERVICES.COPYRIGHTS,
            label: 'Copyrights',
          },
          {
            href: ROUTES.SERVICES.DESIGNS,
            label: 'Designs',
          },
          {
            href: ROUTES.SERVICES.PLANT_VARIETIES,
            label: 'Plants varieties',
          },
          {
            href: ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS,
            label: 'Layout designs of Integrated Circuits',
          },
        ],
      },
      {
        label: 'IP enablement',
        children: [
          {
            href: ROUTES.SERVICES.IP_LICENSING,
            label: 'Licensing of IP activities',
          },
          {
            href: ROUTES.SERVICES.IP_ACADEMY,
            label: 'IP academy',
          },
          {
            href: ROUTES.SERVICES.IP_CLINICS,
            label: 'IP clinics',
          },
          {
            href: ROUTES.SERVICES.IP_SUPPORT_CENTERS,
            label: 'National network of IP support centers',
          },
        ],
      },
      {
        label: 'IP enforcement & dispute',
        children: [
          {
            href: ROUTES.SERVICES.IP_INFRINGEMENT,
            label: 'IP infringement',
          },
          {
            href: ROUTES.SERVICES.IP_GENERAL_SECRETARIAT,
            label: 'General secretariat of IP dispute resolution committees',
          },
        ],
      },
    ],
  },
  {
    label: 'SAIP',
    children: [
      {
        href: ROUTES.RESOURCES.ROOT,
        label: 'Resources overview',
      },
      {
        label: 'IP information',
        children: [
          {
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT,
            label: 'Digital guide',
          },
          {
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
            label: 'Guidelines',
          },
          {
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT,
            label: 'FAQs',
          },
          {
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_GLOSSARY.ROOT,
            label: 'IP glossary',
          },
          {
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.REPORTS.ROOT,
            label: 'Reports',
          },
        ],
      },
      {
        label: 'Tools & Search',
        children: [
          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_SEARCH_ENGINE.ROOT,
            label: 'IP search engine',
          },

          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT,
            label: 'Gazette',
          },

          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLICATIONS.ROOT,
            label: 'Publications',
          },

          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT,
            label: 'IP observatory',
          },

          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.OPEN_DATA.ROOT,
            label: 'Open data',
          },

          {
            href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLIC_CONSULTATIONS.ROOT,
            label: 'Public consultations',
          },
        ],
      },
      {
        label: 'IP licenses',
        children: [
          {
            href: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT,
            label: 'IP agents',
          },
          {
            href: ROUTES.RESOURCES.IP_LICENSING.SUPERVISORY_UNIT_FOR_NON_PROFIT_SECTOR_ORGANIZATIONS
              .ROOT,
            label: 'Supervisory unit for non-profit sector organizations',
          },
        ],
      },
      {
        label: 'Laws & regulations',
        children: [
          {
            href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
            label: 'Systems & regulations',
          },
          {
            href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.LITIGATION_PATHS.ROOT,
            label: 'Litigation paths',
          },
          {
            href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.ITERNATIONAL_TREATIES.ROOT,
            label: 'International treaties & agreements',
          },
        ],
      },
    ],
  },
  {
    label: 'Media Center',
    children: [
      { label: 'Media library' },
      {
        href: ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT,
        label: 'Media Center',
      },
      {
        href: ROUTES.MEDIA_CENTER.BRANDING.ROOT,
        label: 'Branding',
      },
      { href: ROUTES.MEDIA_CENTER.MOVABLES_PLATFORM.ROOT, label: 'Movables platform' },
      {
        href: ROUTES.MEDIA_CENTER.ABOUT_CHAIRWOMAN.ROOT,
        label: 'About chairwoman',
      },
    ],
  },
  {
    label: 'Contact us',
    children: [
      {
        href: ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT,
        label: 'Contact & support',
      },
      {
        href: ROUTES.CONTACT.CAREERS.ROOT,
        label: 'Careers',
      },
    ],
  },
];
