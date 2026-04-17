'use client';

import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Section from '@/components/atoms/Section';
import TableOfContent from '@/components/organisms/TableOfContent';
import { IPJourneySectionProps, TocItem } from './IPJourneySection.types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslations } from 'next-intl';
import JourneyTimelineSteps from '@/components/organisms/JourneyTimelineSteps/JourneyTimelineSteps';
import JourneyExpandableCards from '@/components/organisms/JourneyExpandableCards/JourneyExpandableCards';
import JourneyCategoryCards from '@/components/organisms/JourneyCategoryCards/JourneyCategoryCards';
import JourneyAccordionGroup from '@/components/organisms/JourneyAccordionGroup/JourneyAccordionGroup';
import ContentSwitcher from '@/components/atoms/ContentSwitcher';
import ServicesOverview from '@/components/icons/services/ServicesOverview';

type Props = {
  tocItems: TocItem[];
  onItemClick: (id: string) => void;
  activeId: string;
  ariaLabel?: string;
  tocName?: string;
  onThisPageText?: string;
  journeyText?: string;
  journeyButtonText?: string;
};

function MobileJourneyMenuPortal(props: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(<MobileJourneyMenu {...props} />, document.body);
}

function MobileJourneyMenu({
  tocItems,
  onItemClick,
  activeId,
  ariaLabel,
  tocName,
  onThisPageText,
  journeyText,
  journeyButtonText,
}: Props) {
  const [open, setOpen] = useState(false);
  const buttonText = journeyButtonText || journeyText || 'Journey';

  const handleClick = (id: string) => {
    onItemClick(id);
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <Button
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] right-4 rtl:right-auto rtl:left-4 z-[9999] px-6 py-2.5 rounded-full shadow-lg md:hidden pointer-events-auto"
          onClick={() => setOpen(true)}
          ariaLabel={buttonText}
          intent="primary"
        >
          <span className="inline-flex items-center gap-2">
            <ServicesOverview className="h-4 w-4" aria-hidden="true" />
            {buttonText}
          </span>
        </Button>
      )}

      <div
        className={`
          fixed inset-0 z-50 md:hidden 
          transition-opacity duration-300 ease-in-out 
          ${open ? 'opacity-100 visible bg-black/20' : 'opacity-0 invisible bg-transparent'}
        `}
        onClick={() => setOpen(false)}
      >
        <div
          className={`
            absolute bottom-0 w-full bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${open ? 'translate-y-0' : 'translate-y-full'}
          `}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-neutral-300 px-6 pt-2 pb-4">
            <div className="flex justify-center mb-3">
              <div className="h-1 w-12 rounded-full bg-neutral-300" />
            </div>
            <div className="text-lg font-medium text-neutral-900">{journeyText || buttonText}</div>
          </div>
          <div className="px-6 py-6">
            <TableOfContent
              items={tocItems}
              activeId={activeId}
              onItemClick={handleClick}
              ariaLabel={ariaLabel || 'Journey navigation'}
              name={tocName}
              onThisPageText={onThisPageText}
              journeyText={journeyText}
              variant="sheet"
              showHeader={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function findTocItemById(items: TocItem[], id: string): TocItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.subItems) {
      const found = findTocItemById(item.subItems, id);
      if (found) return found;
    }
  }
  return undefined;
}

const IPJourneySection = ({
  sectionIds,
  sections,
  tocItems,
  tocAriaLabel,
  tocName,
}: IPJourneySectionProps) => {
  const t = useTranslations('common.labels');
  const orderedSectionIds = useMemo(() => {
    if (!tocItems || tocItems.length === 0) {
      return sectionIds;
    }
    const ids: string[] = [];
    const walk = (items: TocItem[]) => {
      items.forEach((item) => {
        ids.push(item.id);
        if (item.subItems && item.subItems.length > 0) {
          walk(item.subItems);
        }
      });
    };
    walk(tocItems);
    return ids;
  }, [tocItems, sectionIds]);
  const [activeTocId, setActiveTocId] = useState(orderedSectionIds[0] || sectionIds[0]);
  const isMobile = useIsMobile();
  const sectionRefsContainer = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeSwitcherBySection, setActiveSwitcherBySection] = useState<Record<string, string>>(
    {},
  );

  const onThisPageText = t('onThisPage');
  const journeyText = tocName
    ? t('journey', { category: tocName })
    : t('journey', { category: '' }).trim();
  const journeyButtonText = t('journey', { category: '' }).trim() || 'Journey';

  // Helper to render description with bullet points and formatting
  const renderDescription = (
    description: string,
    typography: 'default' | 'guidance' = 'default',
  ) => {
    const paragraphClass =
      typography === 'guidance'
        ? 'text-[18px] text-neutral-700 leading-[28px] mb-2'
        : 'text-base text-[#161616] font-normal mb-2 !w-full';
    const listItemClass =
      typography === 'guidance'
        ? 'text-[18px] text-neutral-700 leading-[28px] pl-1'
        : 'text-base text-neutral-700 leading-6 pl-1';
    const lines = description.split('\n').filter((line) => line.trim());
    const result: React.JSX.Element[] = [];
    let currentList: string[] = [];
    let currentListType: 'bullet' | 'numbered' | null = null;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Check if line is a bullet point or numbered
      const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ');
      const isNumbered = /^\d+\.\s/.test(trimmed);

      if (isBullet || isNumbered) {
        const text = isBullet ? trimmed.substring(2) : trimmed.replace(/^\d+\.\s/, '');
        const listType = isBullet ? 'bullet' : 'numbered';

        // If switching list types, flush current list
        if (currentListType && currentListType !== listType) {
          result.push(renderList(currentList, currentListType, result.length, typography));
          currentList = [];
        }

        currentListType = listType;
        currentList.push(text);
      } else {
        // Flush current list if any
        if (currentList.length > 0) {
          result.push(renderList(currentList, currentListType!, result.length, typography));
          currentList = [];
          currentListType = null;
        }

        // Check if line is a heading (bold text followed by colon)
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0 && colonIndex < 50 && trimmed[0] === trimmed[0].toUpperCase()) {
          const heading = trimmed.substring(0, colonIndex);
          const content = trimmed.substring(colonIndex + 1).trim();
          result.push(
            <p key={`p-${idx}`} className={paragraphClass}>
              {heading}: {content}
            </p>,
          );
        } else {
          result.push(
            <p key={`p-${idx}`} className={paragraphClass}>
              {trimmed}
            </p>,
          );
        }
      }
    });

    // Flush remaining list
    if (currentList.length > 0) {
      result.push(renderList(currentList, currentListType!, result.length, typography));
    }

    return <div className="space-y-1">{result}</div>;
  };

  const renderList = (
    items: string[],
    type: 'bullet' | 'numbered',
    key: number,
    typography: 'default' | 'guidance' = 'default',
  ) => {
    const Tag = type === 'bullet' ? 'ul' : 'ol';
    const listClass = type === 'bullet' ? 'list-disc ml-5' : 'list-decimal ml-5';
    const listItemClass =
      typography === 'guidance'
        ? 'text-[18px] text-neutral-700 leading-[28px] pl-1'
        : 'text-base text-neutral-700 leading-6 pl-1';

    return (
      <Tag key={`list-${key}`} className={`${listClass} space-y-0 mb-2`}>
        {items.map((item, idx) => (
          <li key={idx} className={listItemClass}>
            {item}
          </li>
        ))}
      </Tag>
    );
  };

  const sectionRefs = useMemo(() => {
    const refs: Record<string, { current: HTMLDivElement | null }> = {};
    orderedSectionIds.forEach((id) => {
      refs[id] = {
        get current() {
          return sectionRefsContainer.current[id] || null;
        },
        set current(el: HTMLDivElement | null) {
          sectionRefsContainer.current[id] = el;
        },
      };
    });
    return refs;
  }, [orderedSectionIds]);

  // ✅ NEW: Track if we're programmatically scrolling (after TOC click)
  const isScrollingProgrammatically = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // ✅ NEW: Don't auto-update activeId during programmatic scroll
      if (isScrollingProgrammatically.current) return;

      let current = orderedSectionIds[0];
      for (const id of orderedSectionIds) {
        const ref = sectionRefs[id];
        if (ref && ref.current) {
          const { top } = ref.current.getBoundingClientRect();
          if (top < 120) current = id;
        }
      }
      setActiveTocId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [orderedSectionIds, sectionRefs]);

  useEffect(() => {
    if (orderedSectionIds.length > 0 && !orderedSectionIds.includes(activeTocId)) {
      setActiveTocId(orderedSectionIds[0]);
    }
  }, [orderedSectionIds, activeTocId]);

  const handleTocClick = (id: string) => {
    const ref = sectionRefs[id];
    if (ref && ref.current) {
      // ✅ NEW: Set activeId IMMEDIATELY and block auto-updates
      setActiveTocId(id);
      isScrollingProgrammatically.current = true;

      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // ✅ NEW: Re-enable auto-updates after scroll completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1000); // Smooth scroll usually takes ~500-800ms
    }
  };

  const renderJourneySection = (id: string, level = 1, isFirst = false) => {
    const section = sections[id];
    if (!section) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '⚠️ Section not found in sections object:',
          id,
          'Available:',
          Object.keys(sections),
        );
      }
      return null;
    }
    const tocItem = findTocItemById(tocItems, id);
    const subItems = tocItem?.subItems || [];
    const hasContentSwitcherItems = (section.contentSwitcherItems?.length || 0) > 0;
    const shouldShowSwitcher = section.showContentSwitcher || hasContentSwitcherItems;
    const activeSwitcherId = activeSwitcherBySection[id] || section.contentSwitcherItems?.[0]?.id;
    const itemsToRender = (() => {
      if (!section.items || section.items.length === 0) return section.items;
      if (!shouldShowSwitcher || !activeSwitcherId) return section.items;
      const filtered = section.items.filter((item) => item.category === activeSwitcherId);
      return filtered.length > 0 ? filtered : section.items;
    })();

    if (level === 1) {
      return (
        <div key={id} ref={sectionRefs[id]} id={id} className="ml-4 rtl:mr-4 mb-8">
          <Heading
            size="custom"
            as="h1"
            weight="medium"
            color="primary"
            className="mb-6 text-4xl leading-11 md:text-display-lg"
          >
            {section.title}
          </Heading>
          {section.description && (
            <div className="mb-0 text-lg text-neutral-700 max-w-[640px]">
              {renderDescription(section.description, 'guidance')}
            </div>
          )}
          {section.subDescription && (
            <div className="mb-0 mt-3 text-lg text-neutral-700 max-w-[640px]">
              {renderDescription(section.subDescription, 'guidance')}
            </div>
          )}
          {subItems.length > 0 && (
            <div className="mt-8 flex flex-col gap-6">
              {subItems.map((sub, idx) => (
                <Fragment key={sub.id}>{renderJourneySection(sub.id, 2, idx === 0)}</Fragment>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (level === 2) {
      const isButtonVisible = !!section.buttonLabel;
      const isCompactJourneyCard =
        isButtonVisible &&
        (!!section.description || !!section.subDescription) &&
        !itemsToRender?.length;

      // ✅ NEW: Handle 'header' display type - no card wrapper
      if (section.displayType === 'header') {
        return (
          <div key={id} ref={sectionRefs[id]} id={id} className="mb-6">
            <h3 className="text-[20px] leading-[30px] md:text-3xl md:leading-[38px] font-semibold mb-3 text-default">
              {section.title}
            </h3>
            {section.description && (
              <div className="text-lg text-neutral-700 mb-0 max-w-[640px]">
                {renderDescription(section.description)}
              </div>
            )}
            {/* Render subsections if any */}
            {subItems.length > 0 && (
              <div className="flex flex-col gap-6 mt-6">
                {subItems.map((sub, idx) => (
                  <Fragment key={sub.id}>{renderJourneySection(sub.id, 3, idx === 0)}</Fragment>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={id} ref={sectionRefs[id]} id={id} className="mb-6">
          <div
            className={`rounded-2xl border border-neutral-200 p-6 bg-white flex flex-col gap-3 relative ${`box-border w-full xl:w-[954px] xl:min-w-[954px] xl:max-w-[954px] ${
              isCompactJourneyCard ? 'xl:h-[196px]' : ''
            }`}`}
          >
            {!isMobile && (
              <div className="flex flex-row justify-between items-start w-auto lg:w-[628px]">
                <h3 className="mb-0 !text-[24px] font-medium  tracking-normal text-[#161616]">
                  {section.title}
                </h3>
                {isButtonVisible && (
                  <Button
                    href={section.buttonHref}
                    intent="primary"
                    ariaLabel={section.buttonLabel!}
                    className="mb-0"
                  >
                    {section.buttonLabel}
                  </Button>
                )}
              </div>
            )}
            {isMobile && (
              <h3 className="mb-0 text-2xl font-medium leading-8 tracking-normal text-text-default">
                {section.title}
              </h3>
            )}

            {section.description && (
              <div className="text-base text-neutral-700 mb-0 max-w-[640px]">
                {renderDescription(section.description)}
              </div>
            )}

            {isMobile && isButtonVisible && (
              <Button
                href={section.buttonHref}
                intent="primary"
                ariaLabel={section.buttonLabel!}
                className="mt-2 w-full"
              >
                {section.buttonLabel}
              </Button>
            )}

            {/* ✅ NEW: Render items with different display types */}
            {itemsToRender && itemsToRender.length > 0 && (
              <>
                {shouldShowSwitcher && hasContentSwitcherItems && (
                  <ContentSwitcher
                    items={section.contentSwitcherItems!}
                    activeItem={activeSwitcherId}
                    onSwitch={(itemId) =>
                      setActiveSwitcherBySection((prev) => ({ ...prev, [id]: itemId }))
                    }
                    className="mb-6"
                  />
                )}
                {section.displayType === 'timeline' && (
                  <JourneyTimelineSteps items={itemsToRender} />
                )}
                {section.displayType === 'expandable' && (
                  <JourneyExpandableCards items={itemsToRender} />
                )}
                {(section.displayType === 'accordion-group' ||
                  section.displayType === 'accordion') && (
                  <JourneyAccordionGroup
                    subtitle={section.subtitle}
                    items={itemsToRender.map((item) => ({
                      title: item.title,
                      content: item.description || '',
                    }))}
                  />
                )}
                {section.displayType === 'cards' && <JourneyCategoryCards items={itemsToRender} />}
                {section.displayType === 'checklist' && (
                  <ol className="list-decimal pl-5 space-y-2 mt-4">
                    {itemsToRender.map((item, idx) => (
                      <li key={idx} className="text-base text-neutral-700 py-1">
                        <span className="font-semibold">{item.title}</span>
                        {item.description && (
                          <span className="block mt-1 text-neutral-600">{item.description}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {section.displayType === 'list-with-button' && (
                  <div className="mt-4 space-y-4">
                    {itemsToRender.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-default mb-1">
                              {item.title}
                            </h4>
                            <p className="text-base text-neutral-700 leading-6">
                              {item.description}
                            </p>
                          </div>
                          {item.buttonLabel && item.buttonHref && (
                            <Button
                              href={item.buttonHref}
                              intent="primary"
                              ariaLabel={item.buttonLabel}
                              className="w-full md:w-auto"
                            >
                              {item.buttonLabel}
                            </Button>
                          )}
                        </div>
                        {idx < section.items!.length - 1 && (
                          <div className="border-b border-neutral-200 mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {(!section.displayType || section.displayType === 'default') && (
                  <ol className="list-decimal pl-5 space-y-2 mt-4">
                    {itemsToRender.map((item, idx) => (
                      <li key={idx} className="text-base text-neutral-700 py-1">
                        <span className="font-semibold inline">{item.title} </span>
                        <span className="inline">{item.description}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </>
            )}

            {/* Render subsections (Level 3 - actual journey_section nodes or virtual items) */}
            {subItems.length > 0 && (
              <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-neutral-200">
                {subItems.map((sub, idx) => (
                  <Fragment key={sub.id}>{renderJourneySection(sub.id, 3, idx === 0)}</Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Level 3 and above - render with proper indentation and styling
    if (level === 3) {
      return (
        <div key={id} ref={sectionRefs[id]} id={id} className="mb-4 ml-4">
          <div className="rounded-xl bg-neutral-50 p-5 border-l-4 border-primary-300">
            <h4 className="text-base font-semibold mb-2">{section.title}</h4>
            {section.items && section.items.length > 0 ? (
              <ol className="list-decimal pl-5 space-y-1 max-w-xl text-sm">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-neutral-700 py-1">
                    <span className="font-semibold inline">{item.title} </span>
                    <span className="inline">{item.description}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-sm text-neutral-700">{section.description}</div>
            )}
            {/* Render subsections (Level 4 and above - recursive) */}
            {subItems.length > 0 && (
              <div className="flex flex-col gap-2 mt-3 border-l-2 border-neutral-300">
                {subItems.map((sub, idx) => (
                  <Fragment key={sub.id}>
                    {renderJourneySection(sub.id, level + 1, idx === 0)}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Level 4 and above - render with deeper indentation
    return (
      <div key={id} ref={sectionRefs[id]} id={id} className="mb-3">
        <div className="rounded-lg bg-neutral-100 p-4 border-l-2 border-neutral-300 ml-4">
          <h5 className="text-base font-semibold mb-1">{section.title}</h5>
          {section.items && section.items.length > 0 ? (
            <ol className="list-decimal pl-5 space-y-1 max-w-xl text-sm">
              {section.items.map((item, idx) => (
                <li key={idx} className="text-sm text-neutral-700 py-1">
                  <span className="font-semibold inline">{item.title} </span>
                  <span className="inline">{item.description}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-neutral-700">{section.description}</div>
          )}
          {/* Render subsections (Level 5 and above - recursive) */}
          {subItems.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 pl-3 border-l-2 border-neutral-400">
              {subItems.map((sub, idx) => (
                <Fragment key={sub.id}>
                  {renderJourneySection(sub.id, level + 1, idx === 0)}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Section background="neutral-25" className="flex flex-row gap-8 items-start">
      {!isMobile && (
        <div className="sticky top-24 self-start z-10">
          <TableOfContent
            items={tocItems}
            activeId={activeTocId}
            onItemClick={handleTocClick}
            ariaLabel={tocAriaLabel || 'Journey navigation'}
            name={tocName}
            onThisPageText={onThisPageText}
            journeyText={journeyText}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {tocItems.map((item, idx) => (
          <Fragment key={item.id}>{renderJourneySection(item.id, 1, idx === 0)}</Fragment>
        ))}
      </div>
      <MobileJourneyMenuPortal
        tocItems={tocItems}
        onItemClick={handleTocClick}
        activeId={activeTocId}
        ariaLabel={tocAriaLabel}
        tocName={tocName}
        onThisPageText={onThisPageText}
        journeyText={journeyText}
        journeyButtonText={journeyButtonText}
      />
    </Section>
  );
};

export default IPJourneySection;
