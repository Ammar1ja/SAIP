'use client';

import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import List from '@/components/atoms/List';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useTranslations } from 'next-intl';

// TODO: This content should be migrated to Drupal CMS
export function useDesignsData(): DigitalGuideTabData[] {
  const t = useTranslations('digitalGuide.ipCategory.designsContent');

  return [
    {
      id: 'about',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('about.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('about.whatIs.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.whatIs.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('about.protection.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.protection.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('about.commercial.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.commercial.p1')}</Paragraph>
          </TextContent>
        </>
      ),
      cta: (
        <>
          <Paragraph variant="compact" className="font-semibold">
            {t('about.cta.text')}
          </Paragraph>
          <Button
            ariaLabel={t('about.cta.ariaLabel')}
            href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.DESIGNS.CHECKLIST}
          >
            {t('about.cta.button')}
          </Button>
        </>
      ),
    },
    {
      id: 'protection',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('protection.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('protection.conditions.title')}
            </Heading>
            <List
              items={[
                { id: 1, content: t('protection.conditions.items.0') },
                { id: 2, content: t('protection.conditions.items.1') },
              ]}
            />
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('protection.searching.title')}
            </Heading>
            <Paragraph variant="compact">{t('protection.searching.p1')}</Paragraph>
          </TextContent>
          <Paragraph variant="compact">{t('protection.p2')}</Paragraph>
        </>
      ),
    },
    {
      id: 'prototype',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('prototype.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.model.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.model.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.importance.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.importance.p1')}</Paragraph>
          </TextContent>
          <Paragraph variant="compact">{t('prototype.p2')}</Paragraph>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.clinics.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.clinics.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'registration-of-designs',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('registration.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('registration.submitting.title')}
            </Heading>
            <Paragraph variant="compact">{t('registration.submitting.p1')}</Paragraph>
          </TextContent>
          <Paragraph variant="compact">{t('registration.p2')}</Paragraph>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('registration.reference.title')}
            </Heading>
            <Paragraph variant="compact">{t('registration.reference.p1')}</Paragraph>
          </TextContent>
        </>
      ),
      cta: (
        <>
          <TextContent className="space-y-1">
            <Paragraph className="font-semibold" variant="compact">
              {t('registration.cta.platform.text')}
            </Paragraph>
            <Button
              ariaLabel={t('registration.cta.platform.ariaLabel')}
              href={ROUTES.SAIP.ROOT}
              className="place-self-center"
            >
              <HomeIcon size={20} /> {t('registration.cta.platform.button')}
            </Button>
          </TextContent>
          <TextContent className="space-y-1">
            <Paragraph className="font-semibold" variant="compact">
              {t('registration.cta.journey.text')}
            </Paragraph>
            <Button
              ariaLabel={t('registration.cta.journey.ariaLabel')}
              href={`${ROUTES.SERVICES.DESIGNS}?tab=journey`}
              intent="secondary"
              outline
              className="place-self-center"
            >
              <HomeIcon size={20} /> {t('registration.cta.journey.button')}
            </Button>
          </TextContent>
        </>
      ),
    },
  ];
}

// For backwards compatibility
export const DIGITAL_GUIDE_DESIGNS: DigitalGuideTabData[] = [];
