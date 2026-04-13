'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  saipLinks,
  servicesLinks,
  resourcesLinks,
  mediaCenterLinks,
  contactLinks,
} from '@/lib/navigation';
import { ChevronRight, Search as SearchIcon } from 'lucide-react';
import clsx from 'clsx';
import { HomeIcon } from '@/public/icons/nav/Home';
import { useDirection } from '@/context/DirectionContext';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher/LanguageSwitcher';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

function getFocusableElement(parent: HTMLElement) {
  return Array.from(
    parent.querySelectorAll<HTMLElement>('button, [href], input, select, textarea'),
  ).filter((child) => child.getAttribute('tabindex') !== '-1');
}

export const MobileNavDrawer = ({ isOpen, onClose, locale }: MobileNavDrawerProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const t = useTranslations('navigation.main');
  const tLinks = useTranslations('navigation.links');

  // Sections with translated titles
  const sections = [
    { key: 'saip', title: t('saip'), links: saipLinks },
    { key: 'services', title: t('services'), links: servicesLinks },
    { key: 'resources', title: t('resources'), links: resourcesLinks },
    { key: 'mediaCenter', title: t('mediaCenter'), links: mediaCenterLinks },
    { key: 'contactUs', title: t('contactUs'), links: contactLinks },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const drawer = drawerRef.current;

    if (!isOpen || !drawer) return;

    const drawerOpenBtn = document.activeElement;

    const handleTabPress = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElement(drawer);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    drawer.addEventListener('keydown', handleTabPress);
    return () => {
      drawer.removeEventListener('keydown', handleTabPress);
      if (drawerOpenBtn instanceof HTMLElement) {
        drawerOpenBtn.focus();
      }
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      <nav
        ref={drawerRef}
        className={clsx(
          'fixed top-0 h-full w-[100%] max-w-sm bg-white p-6 overflow-y-auto shadow-lg z-[70] transition-transform duration-300 ease-in-out',
          isRtl
            ? isOpen
              ? 'right-0 translate-x-0'
              : 'right-0 translate-x-full'
            : isOpen
              ? 'left-0 translate-x-0'
              : 'left-0 -translate-x-full',
        )}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-300 pb-6 mt-3">
          <div className="min-w-0 flex-1">
            <LanguageSwitcher locale={locale} />
          </div>
          <button
            onClick={onClose}
            className={clsx(
              'rounded-md bg-gray-100 size-9 font-semibold',
              isRtl ? 'mr-auto' : 'ml-auto',
            )}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <Link
          href="/"
          className="flex flex-1 h-12 items-center font-semibold text-gray-900 mt-3 cursor-pointer"
          onClick={onClose}
          aria-label={t('home')}
        >
          <HomeIcon className={clsx('shrink-0', isRtl ? 'ml-2' : 'mr-2')} fill="black" />
          <span>{t('home')}</span>
        </Link>

        <Link
          href="/search"
          className="flex h-12 items-center font-semibold text-gray-900 cursor-pointer"
          onClick={onClose}
          aria-label={t('search')}
        >
          <SearchIcon className={clsx('h-5 w-5 shrink-0', isRtl ? 'ml-2' : 'mr-2')} />
          <span>{t('search')}</span>
        </Link>

        <div className="border-b border-neutral-300 pb-3" />

        <ul>
          {sections.map(({ key, title, links }) => (
            <li key={key} className="first:pt-6 py-3">
              <button
                onClick={() => setExpanded((prev) => (prev === key ? null : key))}
                className="group flex w-full items-bottom align-middle text-left text-sm font-semibold text-gray-900 pb-3 cursor-pointer"
                aria-expanded={expanded === key}
                aria-controls={`${key}-content`}
              >
                <HomeIcon className={clsx('shrink-0', isRtl ? 'ml-2' : 'mr-2')} fill="black" />
                <span className={clsx('flex-1', isRtl ? 'text-right' : 'text-left')}>{title}</span>
                <ChevronRight
                  className={clsx(
                    'transition-transform self-end',
                    isRtl
                      ? expanded === key
                        ? 'rotate-90'
                        : 'rotate-180'
                      : expanded === key
                        ? 'rotate-90'
                        : 'rotate-0',
                  )}
                  size={16}
                />
              </button>

              <div
                id={`${key}-content`}
                hidden={expanded !== key}
                className={isRtl ? 'mr-8' : 'ml-8'}
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-gray-700 hover:underline py-3"
                    onClick={onClose}
                    tabIndex={expanded !== key ? -1 : 0}
                  >
                    {tLinks(link.labelKey)}
                  </Link>
                ))}
              </div>
              <div className="border-b border-neutral-300 pb-3" />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
