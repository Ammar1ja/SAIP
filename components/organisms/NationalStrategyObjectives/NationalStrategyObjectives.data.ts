import { IconProps } from '@/components/atoms/Icon/Icon.types';
import { StrategyBrainIcon, ChartBarIcon, StrategyLightBulbIcon } from '@/components/icons';
import { CardGridItem } from '@/components/organisms/CardGrid/CardGrid';

export const objectivesData: CardGridItem[] = [
  {
    description: 'Develop creative individuals based on imagination and challenge',
    icon: {
      component: StrategyBrainIcon,
      alt: 'Brain Icon',
      background: 'green',
      size: 'large',
      // Figma: 48×48 tile, 8px radius, ~18×18 glyph
      className:
        '!h-12 !w-12 !min-h-12 !min-w-12 rounded-md !p-0 [&_svg]:!h-[18px] [&_svg]:!w-[18px]',
    },
  },
  {
    description: 'Development establishments based on intellectual property',
    icon: {
      component: ChartBarIcon,
      alt: 'Chart Icon',
      background: 'green',
      size: 'large',
      // Figma: 48×48 tile, 8px radius, ~18×18 glyph
      className:
        '!h-12 !w-12 !min-h-12 !min-w-12 rounded-md !p-0 [&_svg]:!h-[18px] [&_svg]:!w-[18px]',
    },
  },
  {
    description: 'Achieving society based on respect for creative efforts',
    icon: {
      component: StrategyLightBulbIcon,
      alt: 'Light Bulb Icon',
      background: 'green',
      size: 'large',
      // Figma: 48×48 tile, 8px radius, ~18×18 glyph
      className:
        '!h-12 !w-12 !min-h-12 !min-w-12 rounded-md !p-0 [&_svg]:!h-[18px] [&_svg]:!w-[18px]',
    },
  },
];
