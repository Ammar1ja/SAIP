'use client';

import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useTranslations } from 'next-intl';

// TODO: This content should be migrated to Drupal CMS
export function usePatentsData(): DigitalGuideTabData[] {
  const t = useTranslations('digitalGuide.ipCategory.patentsContent');

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
              {t('about.whatIsInvention.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.whatIsInvention.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('about.whatIsPatent.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.whatIsPatent.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('about.conditions.title')}
            </Heading>
            <Paragraph variant="compact">
              <b>{t('about.conditions.novelty')}</b> {t('about.conditions.noveltyDesc')}
            </Paragraph>
            <Paragraph variant="compact">
              <b>{t('about.conditions.inventive')}</b> {t('about.conditions.inventiveDesc')}
            </Paragraph>
            <Paragraph variant="compact">
              <b>{t('about.conditions.eligibility')}</b> {t('about.conditions.eligibilityDesc')}
            </Paragraph>
          </TextContent>
        </>
      ),
      cta: (
        <>
          <Paragraph className="font-semibold" variant="compact">
            {t('about.cta.text')}
          </Paragraph>
          <Button
            ariaLabel={t('about.cta.ariaLabel')}
            href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PATENTS.CHECKLIST}
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
              {t('protection.nonDisclosure.title')}
            </Heading>
            <Paragraph variant="compact">{t('protection.nonDisclosure.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('protection.nda.title')}
            </Heading>
            <Paragraph variant="compact">{t('protection.nda.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('protection.filing.title')}
            </Heading>
            <Paragraph variant="compact">{t('protection.filing.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('protection.drafting.title')}
            </Heading>
            <Paragraph variant="compact">{t('protection.drafting.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'initial-prototype',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('prototype.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.definition.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.definition.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.requirements.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.requirements.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('prototype.guidance.title')}
            </Heading>
            <Paragraph variant="compact">{t('prototype.guidance.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'patent-application',
      content: (
        <>
          <Heading as="h3" size="h3">
            {t('application.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('application.disclosure.title')}
            </Heading>
            <Paragraph variant="compact">{t('application.disclosure.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('application.period.title')}
            </Heading>
            <Paragraph variant="compact">{t('application.period.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading as="h4" size="h4">
              {t('application.details.title')}
            </Heading>
            <Paragraph variant="compact">{t('application.details.p1')}</Paragraph>
          </TextContent>
        </>
      ),
      cta: (
        <>
          <TextContent className="space-y-1">
            <Paragraph className="font-semibold" variant="compact">
              {t('application.cta.platform.text')}
            </Paragraph>
            <Button
              ariaLabel={t('application.cta.platform.ariaLabel')}
              href={ROUTES.SAIP.ROOT}
              className="place-self-center"
            >
              <HomeIcon size={20} /> {t('application.cta.platform.button')}
            </Button>
          </TextContent>
          <TextContent className="space-y-1">
            <Paragraph className="font-semibold" variant="compact">
              {t('application.cta.journey.text')}
            </Paragraph>
            <Button
              ariaLabel={t('application.cta.journey.ariaLabel')}
              href={`${ROUTES.SERVICES.PATENTS}?tab=journey`}
              intent="secondary"
              outline
              className="place-self-center"
            >
              <HomeIcon size={20} /> {t('application.cta.journey.button')}
            </Button>
          </TextContent>
        </>
      ),
    },
  ];
}

// For backwards compatibility
export const DIGITAL_GUIDE_PATENTS: DigitalGuideTabData[] = [];
