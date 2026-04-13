import { ROUTES } from '@/lib/routes';

type DigitalGuideCard = { title: string; description: string; href: string };

export const DIGITAL_GUIDE_CARDS: DigitalGuideCard[] = [
  {
    title: 'IP rights',
    description: 'Learn about types, benefits and protections of IP rights.',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_RIGHTS.ROOT,
  },
  {
    title: 'IP category',
    description:
      'Discover patents, trademarks, copyrights, designs, plant varieties and topographic designs of integrated circuits.',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.ROOT,
  },
  {
    title: 'Check your idea',
    description: 'Find the best protection method for your idea or innovation.',
    href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.CHECK_YOUR_IDEA.ROOT,
  },
];
