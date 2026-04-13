'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Home, Folder, Copy, Newspaper } from 'lucide-react';
import clsx from 'clsx';

interface TabItem {
  href: string;
  labelKey: 'home' | 'services' | 'resources' | 'mediaCenter';
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  matchPaths: string[];
}

const tabs: TabItem[] = [
  {
    href: '/',
    labelKey: 'home',
    icon: Home,
    matchPaths: ['/'],
  },
  {
    href: '/services/services-overview',
    labelKey: 'services',
    icon: Folder,
    matchPaths: ['/services'],
  },
  {
    href: '/resources',
    labelKey: 'resources',
    icon: Copy,
    matchPaths: ['/resources'],
  },
  {
    href: '/media-center/media-library/media-center',
    labelKey: 'mediaCenter',
    icon: Newspaper,
    matchPaths: ['/media-center'],
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations('navigation.main');

  const isActive = (tab: TabItem) => {
    if (tab.href === '/') return pathname === '/';
    return pathname.startsWith(tab.href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-between px-1">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          const label =
            tab.labelKey === 'home' ? t('homepage', { defaultValue: t('home') }) : t(tab.labelKey);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
                active ? 'text-primary-600 border-t-2 border-primary-600' : 'text-neutral-500',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={clsx('h-6 w-6', active ? 'text-primary-600' : 'text-neutral-400')}
                strokeWidth={active ? 2 : 1.5}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for iOS devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}
