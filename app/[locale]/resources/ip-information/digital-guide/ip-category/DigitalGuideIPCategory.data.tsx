import type { IconProps } from '@/components/atoms/Icon';
import { ROUTES } from '@/lib/routes';
import { HomeIcon } from 'lucide-react';

type DigitalGuideIPCategoryCard = {
  icon: NonNullable<IconProps['component']>;
  title: string;
  href: string;
};

export const DIGITAL_GUIDE_IPCATEGORY_CARDS: DigitalGuideIPCategoryCard[] = [
  {
    title: 'Patents',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PATENTS.ROOT,
    icon: HomeIcon,
  },
  {
    title: 'Trademarks',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.TRADEMARKS.ROOT,
    icon: HomeIcon,
  },
  {
    title: 'Copyrights',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.COPYRIGHTS.ROOT,
    icon: HomeIcon,
  },
  {
    title: 'Designs',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.DESIGNS.ROOT,
    icon: HomeIcon,
  },
  {
    title: 'Plant varieties',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.ROOT,
    icon: HomeIcon,
  },
  {
    title: 'Layout Designs of Integrated Circuits',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
      .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.ROOT,
    icon: HomeIcon,
  },
];
