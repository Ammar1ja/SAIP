'use client';

import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import List from '@/components/atoms/List';
import TextContent from '@/components/atoms/TextConent';
import { useTranslations } from 'next-intl';

// TODO: This content should be migrated to Drupal CMS
export function useIPRightsData(): DigitalGuideTabData[] {
  const t = useTranslations('digitalGuide.ipRights.content');

  return [
    {
      id: 'about',
      content: (
        <>
          <Heading
            as="h3"
            size="custom"
            weight="medium"
            color="default"
            className="text-[1.5rem] leading-8 tracking-normal"
          >
            {t('about.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('about.ipSystems.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.ipSystems.intro')}</Paragraph>
            <List
              items={[
                { id: 1, content: t('about.ipSystems.items.0') },
                { id: 2, content: t('about.ipSystems.items.1') },
                { id: 3, content: t('about.ipSystems.items.2') },
              ]}
            />
            <Paragraph variant="compact">{t('about.ipSystems.summary')}</Paragraph>
          </TextContent>
          <Paragraph variant="compact">{t('about.conclusion')}</Paragraph>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('about.characteristics.title')}
            </Heading>
            <Paragraph variant="compact">{t('about.characteristics.p1')}</Paragraph>
            <Paragraph variant="compact">{t('about.characteristics.p2')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'scope-of-protection',
      content: (
        <>
          <Heading
            as="h3"
            size="custom"
            weight="medium"
            color="default"
            className="text-[1.5rem] leading-8 tracking-normal"
          >
            {t('scopeOfProtection.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('scopeOfProtection.ipSystemsProperty.title')}
            </Heading>
            <Paragraph variant="compact">{t('scopeOfProtection.ipSystemsProperty.p1')}</Paragraph>
          </TextContent>
          <Paragraph variant="compact">{t('scopeOfProtection.distinction')}</Paragraph>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('scopeOfProtection.types.title')}
            </Heading>
            <List
              items={[
                {
                  id: 1,
                  content: (
                    <>
                      <b>{t('scopeOfProtection.types.artistic.label')}</b>{' '}
                      {t('scopeOfProtection.types.artistic.description')}
                    </>
                  ),
                },
                {
                  id: 2,
                  content: (
                    <>
                      <b>{t('scopeOfProtection.types.patent.label')}</b>{' '}
                      {t('scopeOfProtection.types.patent.description')}
                    </>
                  ),
                },
                {
                  id: 3,
                  content: (
                    <>
                      <b>{t('scopeOfProtection.types.trademark.label')}</b>{' '}
                      {t('scopeOfProtection.types.trademark.description')}
                    </>
                  ),
                },
                {
                  id: 4,
                  content: (
                    <>
                      <b>{t('scopeOfProtection.types.design.label')}</b>{' '}
                      {t('scopeOfProtection.types.design.description')}
                    </>
                  ),
                },
              ]}
            />
          </TextContent>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('scopeOfProtection.innovators.title')}
            </Heading>
            <Paragraph variant="compact">{t('scopeOfProtection.innovators.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'importance-of-protecting-ip',
      content: (
        <>
          <Heading
            as="h3"
            size="custom"
            weight="medium"
            color="default"
            className="text-[1.5rem] leading-8 tracking-normal"
          >
            {t('importance.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Paragraph variant="compact">{t('importance.intro')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('importance.publicProtection.title')}
            </Heading>
            <Paragraph variant="compact">{t('importance.publicProtection.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('importance.economicImpact.title')}
            </Heading>
            <Paragraph variant="compact">{t('importance.economicImpact.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
    {
      id: 'protecting-an-idea',
      content: (
        <>
          <Heading
            as="h3"
            size="custom"
            weight="medium"
            color="default"
            className="text-[1.5rem] leading-8 tracking-normal"
          >
            {t('protectingIdea.title')}
          </Heading>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('protectingIdea.innovative.title')}
            </Heading>
            <Paragraph variant="compact">{t('protectingIdea.innovative.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('protectingIdea.howTo.title')}
            </Heading>
            <Paragraph variant="compact">{t('protectingIdea.howTo.p1')}</Paragraph>
          </TextContent>
          <TextContent className="space-y-1">
            <Heading
              as="h4"
              size="custom"
              weight="medium"
              color="default"
              className="text-[18px] leading-[28px] tracking-normal"
            >
              {t('protectingIdea.guidance.title')}
            </Heading>
            <Paragraph variant="compact">{t('protectingIdea.guidance.p1')}</Paragraph>
          </TextContent>
        </>
      ),
    },
  ];
}

// For backwards compatibility - fallback to English
export const DIGITAL_GUIDE_IPRIGHTS: DigitalGuideTabData[] = [];
