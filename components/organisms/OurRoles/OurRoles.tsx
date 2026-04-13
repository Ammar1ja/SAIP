'use client';

import React from 'react';
import { CardGrid, CardGridItem } from '@/components/organisms/CardGrid/CardGrid';
import { rolesData as fallbackRoles } from './OurRoles.data';

interface DrupalRole {
  id: string;
  title?: string;
  description: string;
  icon?: string; // URL from Drupal
}

interface OurRolesProps {
  heading?: string;
  text?: string;
  roles?: typeof fallbackRoles; // Fallback format with component icons
  drupalRoles?: DrupalRole[]; // Drupal format with URL icons
}

export const OurRoles = ({ heading, text, roles, drupalRoles }: OurRolesProps) => {
  // Transform Drupal roles to CardGrid format
  const items: CardGridItem[] = drupalRoles?.length
    ? drupalRoles.map((role, index) => {
        // Safety: Use description, fallback to title, then to simple number 1-6
        const displayText = role.description || role.title || `Role ${index + 1}`; // Simple fallback

        return {
          title: displayText,
          description: '',
          icon: {
            src: role.icon || '/icons/default-role.svg',
            alt: role.title || displayText,
            size: 'large' as const,
            svgSize: 'large' as const,
            background: 'green' as const,
          },
        };
      })
    : (roles || fallbackRoles).map((role) => ({
        title: role.description,
        description: '',
        icon: {
          component: role.icon.component,
          alt: role.icon.alt,
          size: role.icon.size || ('medium' as const),
          svgSize: 'large' as const,
          background: role.icon.background || ('green' as const),
        },
      }));

  return (
    <CardGrid
      items={items}
      heading={heading || 'Our roles'}
      text={
        text || 'To achieve its objectives, SAIP shall have the following tasks & responsibilities:'
      }
      showViewAll={true}
      background="neutral"
      padding="default"
      className="!px-0 md:!px-0"
      headingClassName="font-medium text-[36px] leading-[44px] tracking-[-0.72px] text-gray-900"
      headingWrapperClassName="flex flex-col gap-3 mb-8"
      textClassName="text-[18px] leading-[28px] text-text-primary-paragraph max-w-[720px]"
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      cardClassName="min-h-[176px] max-w-none p-8 rounded-lg border-border-natural-primary bg-white shadow-none flex flex-col items-start"
      cardContentClassName="gap-2"
      titleClassName="!text-[16px] !leading-6 sm:!text-[16px] md:!text-[16px] font-normal text-text-display"
    />
  );
};
