'use client';
import React, { useRef, useLayoutEffect, useState } from 'react';
import { GlossaryTabsProps } from './GlossaryTabs.types';

const ACTIVE_INDICATOR_CLASS =
  'absolute top-0 h-[3px] rounded-full bg-button-background-primary-default transition-all duration-300 ease-out';

export const GlossaryTabs: React.FC<GlossaryTabsProps> = ({
  tabs,
  tabLabels,
  activeTab,
  onTabChange,
  indicatorInsetPx = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) {
        setIndicatorStyle({ left: 0, width: 0 });
        return;
      }

      const activeIndex = tabs.indexOf(activeTab);
      const activeButton = container.querySelectorAll('button')[activeIndex] as
        | HTMLElement
        | undefined;

      if (!activeButton) {
        setIndicatorStyle({ left: 0, width: 0 });
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const btnRect = activeButton.getBoundingClientRect();

      const left = btnRect.left - trackRect.left + indicatorInsetPx;
      const width = Math.max(btnRect.width - indicatorInsetPx * 2, 24);

      setIndicatorStyle({ left, width });
    };

    update();

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [activeTab, tabs, indicatorInsetPx]);

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-full flex-col">
        <div ref={containerRef} className="flex w-max min-w-full items-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={[
                'relative flex min-h-[52px] shrink-0 items-center justify-center px-4 text-sm transition-colors duration-200 whitespace-nowrap',
                tab === activeTab
                  ? 'font-bold text-text-default'
                  : 'font-medium text-text-primary-paragraph hover:text-text-default',
              ].join(' ')}
            >
              {tabLabels?.[tab] || tab}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className="relative h-[3px] w-full min-w-full shrink-0 rounded-full bg-border-natural-primary"
        >
          <div className={ACTIVE_INDICATOR_CLASS} style={indicatorStyle} />
        </div>
      </div>
    </div>
  );
};

export default GlossaryTabs;
