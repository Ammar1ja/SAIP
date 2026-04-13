import { ROUTES } from '@/lib/routes';

export const socialLinks = [
  {
    label: 'X (formerly Twitter)',
    iconPath: '/icons/x.svg',
    href: '#',
  },
  {
    label: 'Facebook',
    iconPath: '/icons/facebook.svg',
    href: '#',
  },
  {
    label: 'YouTube',
    iconPath: '/icons/youtube.svg',
    href: '#',
  },
  {
    label: 'LinkedIn',
    iconPath: '/icons/linkedin.svg',
    href: '#',
  },
  {
    label: 'Instagram',
    iconPath: '/icons/instagram.svg',
    href: '#',
  },
];

export const footerLinks = [
  {
    title: 'saip', // Translation key
    items: [
      { label: 'About SAIP', href: ROUTES.SAIP.ABOUT },
      { label: 'National IP strategy', href: ROUTES.SAIP.NATIONAL_IP_STRATEGY },
      { label: 'Organisational structure', href: ROUTES.SAIP.ORGANISATIONAL_STRUCTURE },
      { label: 'SAIP projects', href: ROUTES.SAIP.PROJECTS },
      { label: 'Entities & partners', href: ROUTES.SAIP.ENTITIES },
    ],
  },
  {
    title: 'ipInformation', // Translation key
    items: [
      { label: 'Digital guide', href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT },
      { label: 'Guidelines', href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT },
      { label: 'FAQs', href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT },
      {
        label: 'IP glossary',
        href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_GLOSSARY.ROOT,
      },
      { label: 'Reports', href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.REPORTS.ROOT },
    ],
  },
  {
    title: 'toolsResearch', // Translation key
    items: [
      {
        label: 'IP search engine',
        href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_SEARCH_ENGINE.ROOT,
      },
      { label: 'Gazette', href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT },
      { label: 'Publications', href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLICATIONS.ROOT },
      { label: 'IP observatory', href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT },
      { label: 'Open data', href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.OPEN_DATA.ROOT },
      {
        label: 'Public consultations',
        href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLIC_CONSULTATIONS.ROOT,
      },
    ],
  },
  {
    title: 'importantLinks', // Translation key
    items: [
      { label: 'Services overview', href: ROUTES.SERVICES.SERVICES_OVERVIEW },
      { label: 'IP agents', href: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT },
      {
        label: 'Systems & regulations',
        href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
      },
      { label: 'SAIP services directory', href: ROUTES.SERVICES.SERVICE_DIRECTORY },
    ],
  },
  {
    title: 'mediaContact', // Translation key
    items: [
      { label: 'Media Center', href: ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT },
      { label: 'Contact & support', href: ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT },
      { label: 'Employment', href: ROUTES.CONTACT.CAREERS.ROOT },
      { label: 'Movables', href: ROUTES.MEDIA_CENTER.MOVABLES_PLATFORM.ROOT },
      { label: 'Branding', href: ROUTES.MEDIA_CENTER.BRANDING.ROOT },
    ],
  },
];

export const legalLinks = [
  { label: 'Sitemap', href: ROUTES.SITEMAP.ROOT },
  { label: 'Cookies', href: '#' },
  { label: 'Request Open Data', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];
