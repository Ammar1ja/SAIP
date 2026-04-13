'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface JourneyAccordionItem {
  title: string;
  content: string;
}

interface JourneyAccordionGroupProps {
  subtitle?: string;
  items: JourneyAccordionItem[];
}

const JourneyAccordionGroup = ({ subtitle, items }: JourneyAccordionGroupProps) => {
  // ✅ NEW: Accordions start CLOSED by default (matching Figma)
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  if (!items || items.length === 0) {
    return null;
  }

  const toggleAccordion = (index: number) => {
    setExpandedIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Parse content to handle bold labels in lists
  const renderContent = (content: string) => {
    const lines = content.split('\n').filter((line) => line.trim());
    const result: React.JSX.Element[] = [];
    let inList = false;
    let listItems: React.JSX.Element[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const isBulletLine = /^([•-])\s*/.test(trimmed);

      if (isBulletLine) {
        const text = trimmed.replace(/^([•-])\s*/, '');
        // Check if it has bold label (text before colon)
        const colonIndex = text.indexOf(':');
        if (colonIndex > 0 && colonIndex < 30) {
          const label = text.substring(0, colonIndex);
          const rest = text.substring(colonIndex + 1).trim();
          listItems.push(
            <li
              key={`list-${idx}`}
              className="text-base leading-6 text-text-primary-paragraph ps-1"
            >
              <strong className="font-medium">{label}:</strong> {rest}
            </li>,
          );
        } else {
          listItems.push(
            <li
              key={`list-${idx}`}
              className="text-base leading-6 text-text-primary-paragraph ps-1"
            >
              {text}
            </li>,
          );
        }
        inList = true;
      } else {
        if (inList) {
          result.push(
            <ul key={`ul-${idx}`} className="list-disc ms-6 space-y-1">
              {listItems}
            </ul>,
          );
          listItems = [];
          inList = false;
        }
        result.push(
          <p key={`p-${idx}`} className="text-base leading-6 text-text-primary-paragraph">
            {trimmed}
          </p>,
        );
      }
    });

    // Flush remaining list items
    if (inList && listItems.length > 0) {
      result.push(
        <ul key="ul-final" className="list-disc ms-6 space-y-1">
          {listItems}
        </ul>,
      );
    }

    return <div className="space-y-1">{result}</div>;
  };

  return (
    <div className="mt-6">
      {subtitle && <h3 className="text-xl font-medium text-default leading-8 mb-6">{subtitle}</h3>}

      <div className="flex flex-col">
        {items.map((item, idx) => {
          const isExpanded = expandedIndexes.has(idx);

          return (
            <div key={idx} className="border-t border-neutral-200">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between p-4 text-start"
                aria-expanded={isExpanded}
              >
                <span className="text-base font-medium text-default pe-4">{item.title}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="ps-4 pe-12 pt-2 pb-6 max-w-[628px]">
                  {renderContent(item.content)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyAccordionGroup;
