'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TabsProps, TabItem } from './Tabs.types';
import { tabsContainerStyles, tabButtonStyles } from './Tabs.styles';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDirection } from '@/context/DirectionContext';

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onTabChange,
  className,
  tabListClassName,
  tabButtonClassName,
  orientation = 'horizontal',
  ariaLabel,
  syncWithQueryParam,
  enableMobileScroll = false,
}) => {
  const resolvedDir = useDirection() || 'ltr';
  // Query param sync
  const isSyncEnabled = Boolean(syncWithQueryParam);

  const router = isSyncEnabled ? useRouter() : null;
  const searchParams = isSyncEnabled ? useSearchParams() : null;
  const param = syncWithQueryParam || 'tab';
  const tabFromUrl = isSyncEnabled && searchParams ? searchParams.get(param) : null;

  // Controlled/uncontrolled logic
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState<string | undefined>(
    tabFromUrl || defaultActiveTab || tabs[0]?.id,
  );
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : uncontrolledActiveTab;

  useEffect(() => {
    if (syncWithQueryParam && tabFromUrl && tabFromUrl !== uncontrolledActiveTab) {
      setUncontrolledActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, syncWithQueryParam]);

  // Focus management for accessibility
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // If activeTab changes, focus the tab
    const idx = tabs.findIndex((tab) => tab.id === activeTab);
    if (typeof window !== 'undefined' && idx !== -1 && tabRefs.current[idx]) {
      tabRefs.current[idx]?.focus();
    }
  }, [activeTab, tabs]);

  const handleTabClick = useCallback(
    (tab: TabItem, idx: number) => {
      if (tab.disabled) return;
      if (!isControlled) setUncontrolledActiveTab(tab.id);
      onTabChange?.(tab.id);
      if (isSyncEnabled && router) {
        const params = new URLSearchParams(window.location.search);
        params.set(param, tab.id);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
      tabRefs.current[idx]?.focus();
    },
    [isControlled, onTabChange, syncWithQueryParam, param, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight' || (resolvedDir === 'rtl' && e.key === 'ArrowLeft')) {
      e.preventDefault();
      const nextIdx = (idx + 1) % tabs.length;
      tabRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft' || (resolvedDir === 'rtl' && e.key === 'ArrowRight')) {
      e.preventDefault();
      const prevIdx = (idx - 1 + tabs.length) % tabs.length;
      tabRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      tabRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      tabRefs.current[tabs.length - 1]?.focus();
    }
  };

  return (
    <div
      className={clsx(
        'w-full',
        enableMobileScroll &&
          'overflow-x-auto md:overflow-x-visible -mx-1 md:mx-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      dir={resolvedDir}
    >
      <div
        className={clsx(
          tabsContainerStyles({ orientation, dir: resolvedDir }),
          enableMobileScroll ? 'w-fit md:w-full justify-start md:justify-center' : 'w-full',
          tabListClassName,
        )}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            className={twMerge(
              tabButtonStyles({
                isActive: activeTab === tab.id,
                isFirst: idx === 0,
                isLast: idx === tabs.length - 1,
                withDivider: idx !== 0,
                disabled: tab.disabled,
                dir: resolvedDir,
                mobileScrollable: enableMobileScroll,
              }),
              tabButtonClassName,
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            type="button"
          >
            {tab.icon && (
              <span className="hidden md:inline-flex ltr:md:mr-3 rtl:md:ml-3 align-middle">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ltr:ml-2 rtl:mr-2 inline-flex align-middle">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
