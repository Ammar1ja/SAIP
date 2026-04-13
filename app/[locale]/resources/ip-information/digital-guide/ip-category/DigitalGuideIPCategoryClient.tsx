'use client';

import { ROUTES } from '@/lib/routes';
import Heading from '@/components/atoms/Heading';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import Icon from '@/components/atoms/Icon';
import { useTranslations } from 'next-intl';
import { HomeIcon } from 'lucide-react';
import type { DigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';

interface DigitalGuideIPCategoryClientProps {
  drupalCategories: DigitalGuideCategoryData[];
  locale: string;
  messages: any;
  categoryRoutes: Record<string, string>;
}

export default function DigitalGuideIPCategoryClient({
  drupalCategories,
  locale,
  messages,
  categoryRoutes,
}: DigitalGuideIPCategoryClientProps) {
  const t = useTranslations('digitalGuide.ipCategory');
  const tMain = useTranslations('digitalGuide');

  const resolveTitle = (value: unknown, fallback?: string): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'value' in (value as any)) {
      const resolved = (value as any).value;
      if (typeof resolved === 'string') return resolved;
    }
    return fallback || '';
  };

  // Map category keys to icon paths
  const getIconPath = (key: string): string => {
    const iconMap: Record<string, string> = {
      patents: '/icons/digitalGuide/patents.svg',
      trademarks: '/icons/digitalGuide/trademarks.svg',
      copyrights: '/icons/digitalGuide/copyrights.svg',
      designs: '/icons/digitalGuide/design.svg',
      plantvarieties: '/icons/digitalGuide/plants.svg',
      plant_varieties: '/icons/digitalGuide/plants.svg',
      layoutdesigns: '/icons/digitalGuide/layout.svg',
      layout_designs: '/icons/digitalGuide/layout.svg',
      topographicdesignsofintegratedcircuits: '/icons/digitalGuide/layout.svg',
    };
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
    return (
      iconMap[normalizedKey] || iconMap[key.toLowerCase()] || '/icons/digitalGuide/patents.svg'
    );
  };

  // If we have Drupal categories, use them; otherwise fallback to hardcoded
  const cards: Array<{
    key: string;
    title?: string;
    href: string;
    iconPath: string;
  }> =
    drupalCategories.length > 0
      ? drupalCategories.map((category) => {
          const resolvedTitle = resolveTitle(category.title, category.label);
          const rawKey =
            (category.categoryType && category.categoryType.trim()) || resolvedTitle || 'category';
          const key = rawKey.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
          return {
            key,
            title: resolvedTitle,
            href: categoryRoutes[rawKey.toLowerCase()] || '#',
            iconPath: getIconPath(key),
          };
        })
      : [
          {
            key: 'patents',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PATENTS.ROOT,
            iconPath: '/icons/digitalGuide/patents.svg',
          },
          {
            key: 'trademarks',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.TRADEMARKS.ROOT,
            iconPath: '/icons/digitalGuide/trademarks.svg',
          },
          {
            key: 'copyrights',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.COPYRIGHTS.ROOT,
            iconPath: '/icons/digitalGuide/copyrights.svg',
          },
          {
            key: 'designs',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.DESIGNS.ROOT,
            iconPath: '/icons/digitalGuide/design.svg',
          },
          {
            key: 'plantVarieties',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.ROOT,
            iconPath: '/icons/digitalGuide/plants.svg',
          },
          {
            key: 'layoutDesigns',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
              .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.ROOT,
            iconPath: '/icons/digitalGuide/layout.svg',
          },
        ];

  return (
    <>
      <Heading as="h2" size="h2" className="xl:text-center xl:max-w-[39.25rem]">
        {t('selectArea')}
      </Heading>
      <LayoutWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-0">
        {cards.map(({ key, href, iconPath, title: cardTitle }) => {
          const title = cardTitle || t(`categories.${key}`);
          return (
            <Card className="grid gap-6 xl:shadow-card xl:border-none max-w-full" key={key}>
              <Icon
                src={iconPath}
                alt={title}
                background="green"
                size="medium"
                className="w-12 h-12"
              />
              <Heading as="h3" weight="medium" className="text-lg sm:text-lg md:text-lg lg:text-lg">
                {title}
              </Heading>
              <Button
                ariaLabel={tMain('goTo', { title })}
                href={href}
                intent="secondary"
                className="justify-self-end"
              >
                <ArrowWide direction="right" size="smallWide" background="natural" shape="square" />
              </Button>
            </Card>
          );
        })}
      </LayoutWrapper>
    </>
  );
}
