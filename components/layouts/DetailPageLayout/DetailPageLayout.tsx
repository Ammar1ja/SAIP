import React from 'react';
import Section from '@/components/atoms/Section';
import { ExpandableTabGroup } from '@/components/molecules/ExpandableTabGroup/ExpandableTabGroup';
import { DetailPageLayoutProps } from './DetailPageLayout.types';

const DetailPageLayout: React.FC<DetailPageLayoutProps> = ({
  sidebar,
  children,
  defaultTabs,
  sectionProps,
  className = '',
  sidebarClassName = '',
  reserveSidebarSpace = false,
}) => (
  <Section {...sectionProps}>
    <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 ${className}`}>
      <div className="flex-1 min-w-0">
        {children ? children : defaultTabs ? <ExpandableTabGroup items={defaultTabs} /> : null}
      </div>
      {sidebar ? (
        <div className={`w-full lg:w-[340px] flex-shrink-0 ${sidebarClassName}`}>{sidebar}</div>
      ) : reserveSidebarSpace ? (
        <div className="hidden lg:block w-[340px] flex-shrink-0" />
      ) : null}
    </div>
  </Section>
);

export default DetailPageLayout;
