'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps } from './Navigation.type';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { twMerge } from 'tailwind-merge';
import { useVerificationBar } from '@/context/VerificationBarContext';
import {
  NavigationContainer,
  NavigationInner,
  NavigationOuter,
} from '@/components/molecules/Navigation/Navigation.styles';

export const Navigation: React.FC<NavigationProps> = ({
  items,
  className = '',
  bold = false,
  topOffset,
  forceCompact = false,
  showActiveMarker = true,
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isCompact, setIsCompact] = useState(false);
  const [stickyTop, setStickyTop] = useState<number | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { accordionHeight } = useVerificationBar();
  const effectiveTopOffset = topOffset ?? 32 + accordionHeight + 72;

  const getScrollOffset = () => {
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 100;
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
    // Keep a small visual gap so the target heading is not clipped.
    return Math.round(headerHeight + navHeight + 16);
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerEl = document.querySelector('header');
      const topForCompact = headerEl
        ? Math.round(headerEl.getBoundingClientRect().bottom)
        : effectiveTopOffset;
      if (headerEl) {
        const nextTop = topForCompact;
        setStickyTop((prev) => (prev === nextTop ? prev : nextTop));
      } else {
        setStickyTop((prev) => (prev === effectiveTopOffset ? prev : effectiveTopOffset));
      }

      const navRect = navRef.current?.getBoundingClientRect();
      if (navRect) {
        const compactThreshold = topForCompact + 1;
        if (forceCompact) {
          setIsCompact(false);
        } else {
          setIsCompact(navRect.top <= compactThreshold && window.scrollY > 0);
        }
      }

      if (isScrollingRef.current) {
        return;
      }

      const scrollPosition = window.scrollY + getScrollOffset();

      let currentSection = '';
      for (const item of items) {
        if (item.href.startsWith('#')) {
          const id = item.href.slice(1);
          const element = document.getElementById(id);
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;

            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              currentSection = item.href;
              break;
            }
          }
        }
      }

      if (!currentSection && items.length > 0) {
        const lastItem = items[items.length - 1];
        if (lastItem.href.startsWith('#')) {
          const id = lastItem.href.slice(1);
          const element = document.getElementById(id);
          if (element && scrollPosition >= element.offsetTop) {
            currentSection = lastItem.href;
          }
        }
      }

      if (!currentSection && items.length > 0 && scrollPosition < 200) {
        currentSection = items[0].href;
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [items, effectiveTopOffset, forceCompact]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const element = document.getElementById(id);

      if (element) {
        setActiveSection(href);

        isScrollingRef.current = true;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - getScrollOffset();

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    }
  };

  return (
    <nav
      ref={navRef}
      className={twMerge(
        NavigationContainer({ compact: forceCompact ? false : isCompact }),
        className,
      )}
      style={{ top: `${stickyTop ?? effectiveTopOffset}px` }}
    >
      <LayoutWrapper className="px-4 md:px-8">
        <div className={NavigationOuter({ compact: forceCompact ? false : isCompact })}>
          {items.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={twMerge(
                  NavigationInner({
                    bold,
                    active: showActiveMarker && isActive,
                    compact: forceCompact ? false : isCompact,
                  }),
                  !showActiveMarker && 'px-4 py-2 rounded-sm',
                  isActive && !showActiveMarker && 'font-medium text-text-default',
                )}
                onClick={(e) => handleClick(e, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </LayoutWrapper>
    </nav>
  );
};
