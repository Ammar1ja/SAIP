'use client';

import InlineAlert from '@/components/molecules/InlineAlert';
import type { DigitalGuideTabsSectionProps } from './DigitalGuideTabsSection.types';
import DigitalGuideHeading from '@/components/molecules/DigitalGuideHeading';
import Tabs from '@/components/molecules/Tabs';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useAlert } from '@/context/AlertContext';

const CTA = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`xl:sticky top-6 h-[23.25rem] xl:mx-4 p-6 xl:p-12 rounded-lg bg-primary-50 text-center flex flex-col items-center justify-center gap-8`}
    >
      {children}
    </div>
  );
};

const FadeTop = ({ visible }: { visible: boolean }) => {
  return (
    <span
      className={`${visible ? 'opacity-100' : 'opacity-0'} transition-opacity hidden xl:block pointer-events-none absolute top-0 left-0 rtl:left-auto rtl:right-0 w-[39rem] h-14 bg-gradient-to-b from-white to-transparent z-10`}
    ></span>
  );
};

const FadeBottom = ({ visible }: { visible: boolean }) => {
  return (
    <span
      className={`${visible ? 'opacity-100' : 'opacity-0'} transition-opacity hidden xl:block pointer-events-none absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-[39rem] h-14 bg-gradient-to-t from-white to-transparent z-10`}
    ></span>
  );
};

function DigitalGuideTabsSection({
  title,
  tabs,
  data,
  defaultActiveTab,
  label,
  icon,
  description,
}: DigitalGuideTabsSectionProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || defaultActiveTab);
  const { alertContent, isOpen, closeAlert } = useAlert();
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [fadeTop, setFadeTop] = useState(false);
  const [fadeBottom, setFadeBottom] = useState(false);

  const activeTabData = data.find((tab) => tab.id === activeTab);

  useEffect(() => {
    const contentContainer = contentContainerRef.current;
    if (!contentContainer) return;

    const updateFade = () => {
      const { clientHeight, scrollHeight, scrollTop } = contentContainer;

      const isScrollable = scrollHeight > clientHeight;

      if (isScrollable) {
        setFadeTop(scrollTop > 0);
        setFadeBottom(scrollTop + clientHeight < scrollHeight);
      } else {
        setFadeTop(false);
        setFadeBottom(false);
      }
    };

    // Ensure scroll starts at top when switching tabs
    contentContainer.scrollTop = 0;

    // Initial fade effect on mount
    updateFade();

    // Early return to prevent from adding listeners when there is no scroll
    if (contentContainer.scrollHeight <= contentContainer.clientHeight) return;

    contentContainer.addEventListener('scroll', updateFade);
    window.addEventListener('resize', updateFade);
    return () => {
      contentContainer.removeEventListener('scroll', updateFade);
      window.removeEventListener('resize', updateFade);
    };
  }, [activeTab]);

  const renderContentContainer = () => {
    if (!activeTabData) return null;

    const { content, cta } = activeTabData;

    return (
      <>
        <FadeTop visible={fadeTop} />
        <section
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[39rem_1fr] gap-6 xl:gap-12"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
        >
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-none w-full">{content}</div>
          {cta && <CTA>{cta}</CTA>}
        </section>
        <FadeBottom visible={fadeBottom} />
      </>
    );
  };

  return (
    <>
      <InlineAlert
        className="xl:absolute xl:bottom-8 xl:max-w-[52rem]"
        variant="info"
        emphasized
        alertContent={alertContent}
        isOpen={isOpen}
        onClose={closeAlert}
      />
      <div className="flex flex-col w-full h-full gap-8">
        <DigitalGuideHeading title={title} icon={icon} label={label} description={description} />
        <div className="box-border flex flex-col flex-1 overflow-hidden gap-6 p-6 rounded-lg border border-border-natural-secondary bg-white xl:h-[538px]">
          <Tabs
            tabs={tabs}
            onTabChange={(tab) => setActiveTab(tab)}
            syncWithQueryParam="tab"
            ariaLabel={title}
            enableMobileScroll
          />
          <div className="overflow-hidden relative xl:min-h-[440px]">
            <div className="overflow-y-auto overscroll-contain h-full" ref={contentContainerRef}>
              {renderContentContainer()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DigitalGuideTabsSection;
