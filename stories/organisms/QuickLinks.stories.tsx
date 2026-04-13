import React from 'react';
import QuickLinks, { QuickLinkItem } from '@/components/organisms/QuickLinks';

export default {
  title: 'Organisms/QuickLinks',
  component: QuickLinks,
};

const LINKS: QuickLinkItem[] = [
  { label: 'IP agents', href: '/ip-agents' },
  { label: 'Supervisory unit for non-profit sector organizations', href: '/supervisory-unit' },
  { label: 'Trademark search', href: '/trademark-search' },
];

export const OneLink = () => <QuickLinks title="Quick links" links={[LINKS[0]]} />;
export const TwoLinks = () => <QuickLinks title="Quick links" links={LINKS.slice(0, 2)} />;
export const ThreeLinks = () => <QuickLinks title="Quick links" links={LINKS} />;
