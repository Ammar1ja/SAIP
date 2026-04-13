'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import ExpandableTab from '@/components/molecules/ExpandableTab';
import { ExpandableTabGroupProps } from './ExpandableTabGroup.types';
import { expandableTabGroupStyles } from './ExpandableTabGroup.styles';

export const ExpandableTabGroup = ({
  items,
  activeId: controlledId,
  onTabChange,
  expandedIds: controlledExpandedIds,
  onToggle,
  className,
  showFeedback = false,
  variant = 'default',
}: ExpandableTabGroupProps) => {
  const [uncontrolledActiveId, setUncontrolledActiveId] = useState<string | null>(null);
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<Set<string>>(new Set());

  const useMultiExpand = controlledExpandedIds !== undefined || onToggle !== undefined;

  const expandedIds = useMultiExpand
    ? (controlledExpandedIds ?? uncontrolledExpandedIds)
    : new Set<string>();

  const handleToggle = (id: string) => {
    if (useMultiExpand) {
      if (onToggle) {
        onToggle(id);
      } else {
        setUncontrolledExpandedIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      }
    } else {
      const activeId = controlledId ?? uncontrolledActiveId;
      if (id === activeId) {
        if (controlledId !== undefined) {
          onTabChange?.('');
        } else {
          setUncontrolledActiveId(null);
        }
      } else {
        if (controlledId !== undefined) {
          onTabChange?.(id);
        } else {
          setUncontrolledActiveId(id);
        }
      }
    }
  };

  const isExpanded = (id: string) => {
    if (useMultiExpand) {
      return expandedIds.has(id);
    } else {
      const activeId = controlledId ?? uncontrolledActiveId;
      return id === activeId;
    }
  };

  return (
    <div className={twMerge(expandableTabGroupStyles({ variant }), className)}>
      {items.map((item, index) => (
        <ExpandableTab
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description as string}
          image={item.image}
          isExpanded={isExpanded(item.id)}
          onToggle={() => handleToggle(item.id)}
          showFeedback={showFeedback}
          lastUpdate={item.lastUpdate}
          buttonLabel={item.buttonLabel}
          buttonHref={item.buttonHref}
          buttonAriaLabel={item.buttonAriaLabel}
          buttonLabel2={item.buttonLabel2}
          buttonHref2={item.buttonHref2}
          buttonAriaLabel2={item.buttonAriaLabel2}
          variant={variant}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
