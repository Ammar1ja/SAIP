'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TabVerticalProps, Tab } from './TabVertical.types';
import { tabStyles, navStyles } from './TabVertical.styles';

export const TabVertical = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  showIcons = false,
  size = 'md',
  ariaLabel,
}: TabVerticalProps) => {
  const renderTabs = (tabs: Tab[], level = 1) => (
    <ul
      className={twMerge(
        level === 1
          ? 'flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-4 md:gap-0'
          : 'ml-4 border-0 md:border-l',
      )}
      role={level === 1 ? 'tablist' : undefined}
      aria-level={level}
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.id ||
          (tab.subItems && tab.subItems.some((sub) => sub.id === activeTab));
        return (
          <li key={tab.id} className={twMerge('relative', level === 1 && 'flex-shrink-0')}>
            <button
              onClick={() => onTabChange(tab.id)}
              className={twMerge(
                tabStyles({ isActive: activeTab === tab.id, hasIcon: showIcons, size }),
                // Na mobile: zmniejszone paddingi, na desktop: normalne
                'leading-tight',
                level === 1 && 'whitespace-nowrap md:whitespace-normal',
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
              aria-controls={`${tab.id}-content`}
              aria-level={level}
              aria-labelledby={`tab-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {showIcons && tab.icon}
              <span className="relative inline-block">{tab.label || tab.id}</span>
            </button>
            {tab.subItems && tab.subItems.length > 0 && (
              <div className="hidden md:block ml-2">{renderTabs(tab.subItems, level + 1)}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className={twMerge(navStyles(), className)} aria-label={ariaLabel} role="navigation">
      {tabs && tabs.length > 0 ? (
        <div className="relative">
          {renderTabs(tabs)}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border-natural-primary md:hidden" />
        </div>
      ) : (
        <div className="text-neutral-500 text-sm p-4">No tabs available</div>
      )}
    </nav>
  );
};
