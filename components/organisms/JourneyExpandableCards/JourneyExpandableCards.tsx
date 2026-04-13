'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ContentSwitcher from '@/components/atoms/ContentSwitcher';

interface ContentSection {
  heading?: string;
  content?: string | string[];
  isNumbered?: boolean;
}

interface JourneyItem {
  title: string;
  description?: string; // Legacy support
  sections?: ContentSection[];
  example?: {
    items: string[];
  };
  icon?: string;
  category?: string; // NEW: Category for filtering
}

interface JourneyExpandableCardsProps {
  items: JourneyItem[];
  showContentSwitcher?: boolean;
  contentSwitcherItems?: Array<{ id: string; label: string }>;
}

const JourneyExpandableCards = ({
  items,
  showContentSwitcher,
  contentSwitcherItems,
}: JourneyExpandableCardsProps) => {
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState(contentSwitcherItems?.[0]?.id);

  if (!items || items.length === 0) {
    return null;
  }

  const toggleExample = (index: number) => {
    setExpandedExamples((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderContent = (content: string | string[], isNumbered?: boolean) => {
    if (Array.isArray(content)) {
      if (isNumbered) {
        return (
          <ol className="list-decimal ms-5 space-y-4">
            {content.map((item, idx) => {
              // Remove "1. ", "2. ", etc. if already present in content
              const cleanItem = item.replace(/^\s*\d+\.\s*/, '');
              return (
                <li key={idx} className="leading-6 text-neutral-700 ps-1">
                  {cleanItem}
                </li>
              );
            })}
          </ol>
        );
      }
      return (
        <ul className="list-disc ms-5 space-y-2">
          {content.map((item, idx) => {
            const cleanItem = item.replace(/^\s*[•-]\s*/, '');
            return (
              <li key={idx} className="leading-6 text-neutral-700 ps-1">
                {cleanItem}
              </li>
            );
          })}
        </ul>
      );
    }
    return <p className="text-base text-neutral-700 leading-6">{content}</p>;
  };

  // Filter items based on active tab (if showContentSwitcher is true)
  const shouldFilter =
    (showContentSwitcher || (contentSwitcherItems?.length || 0) > 0) && activeTab;
  const filteredItems = shouldFilter ? items.filter((item) => item.category === activeTab) : items;
  const safeItems = filteredItems.length > 0 ? filteredItems : items;

  return (
    <div className="mt-6">
      {(showContentSwitcher || (contentSwitcherItems?.length || 0) > 0) && contentSwitcherItems && (
        <ContentSwitcher
          items={contentSwitcherItems}
          activeItem={activeTab}
          onSwitch={setActiveTab}
          className="mb-6"
        />
      )}

      <div className="space-y-4">
        {safeItems.map((item, idx) => {
          const isExampleExpanded = expandedExamples.has(idx);
          const hasStructuredContent = item.sections && item.sections.length > 0;

          return (
            <div key={idx} className="rounded-lg bg-neutral-50 p-6">
              <h4 className="text-lg font-semibold text-default leading-7 mb-4">{item.title}</h4>

              <div className="space-y-4">
                {hasStructuredContent ? (
                  <>
                    {item.sections!.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        {section.heading && (
                          <p className="text-base font-semibold text-default leading-6">
                            {section.heading}
                          </p>
                        )}
                        {section.content && renderContent(section.content, section.isNumbered)}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-base text-neutral-700 leading-6 whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {item.example && (
                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <button
                      onClick={() => toggleExample(idx)}
                      className="w-full flex items-center justify-between px-4 py-4 text-start"
                      aria-expanded={isExampleExpanded}
                    >
                      <span className="text-base font-semibold text-default">Example</span>
                      {isExampleExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                      )}
                    </button>

                    {isExampleExpanded && (
                      <div className="px-4 pb-6 pt-2">
                        <ul className="list-disc ms-5 space-y-0">
                          {item.example.items.map((exampleItem, eIdx) => (
                            <li
                              key={eIdx}
                              className="leading-6 text-neutral-700 ps-1"
                              dangerouslySetInnerHTML={{ __html: exampleItem }}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyExpandableCards;
