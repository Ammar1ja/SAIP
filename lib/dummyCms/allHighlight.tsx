import React from 'react';
import { ROUTES } from '@/lib/routes';

export interface HighlightCmsProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonHref?: string;
}

export const allHighlights: HighlightCmsProps[] = [
  {
    id: '1',
    title: 'IP Agents',
    description:
      'Check the list of IP Agents to get professional assistance in applying for services in SAIP.',
    icon: <img src="/icons/highlights/agent.svg" alt="IP Agents" />,
    buttonHref: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT,
  },
  {
    id: '2',
    title: 'IP Academy',
    description:
      'Academy provides a diversified suite of specialized and qualitative programs to support the IP initiatives in the KSA and MENA. ',
    icon: <img src="/icons/highlights/academy.svg" alt="IP Academy" />,
    buttonHref: ROUTES.SERVICES.IP_ACADEMY,
  },
  {
    id: '3',
    title: 'Gazette',
    description: 'Gazette is the place to check for the latest updates on IP in Saudi Arabia.',
    icon: <img src="/icons/highlights/gazette.svg" alt="Gazette" />,
    buttonHref: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT,
  },
  {
    id: '4',
    title: 'IP Agents',
    description:
      'Check the list of IP Agents to get professional assistance in applying for services in SAIP.',
    icon: <img src="/icons/highlights/agent.svg" alt="IP Agents" />,
    buttonHref: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT,
  },
  {
    id: '5',
    title: 'IP Academy',
    description:
      'Academy provides a diversified suite of specialized and qualitative programs to support the IP initiatives in the KSA and MENA. ',
    icon: <img src="/icons/highlights/academy.svg" alt="IP Academy" />,
    buttonHref: ROUTES.SERVICES.IP_ACADEMY,
  },
  {
    id: '6',
    title: 'Gazette',
    description: 'Gazette is the place to check for the latest updates on IP in Saudi Arabia.',
    icon: <img src="/icons/highlights/gazette.svg" alt="Gazette" />,
    buttonHref: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT,
  },
];
