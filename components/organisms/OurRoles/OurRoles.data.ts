import { IconProps } from '@/components/atoms/Icon/Icon.types';
import {
  ChartsIcon,
  MegaphoneIcon,
  InternetIcon,
  CourtIcon,
  AimIcon,
  BookIcon,
  LightBulbIcon,
  BrainIcon,
} from '@/components/icons';

interface Role {
  id: string;
  title?: string;
  description: string;
  icon: {
    component: IconProps['component'];
    alt?: string;
    size?: IconProps['size'];
    svgSize?: IconProps['svgSize'];
    background?: IconProps['background'];
  };
}

export const rolesData: Role[] = [
  {
    id: '1',
    description: 'Develop the National Strategy for IP.',
    icon: {
      component: ChartsIcon,
      alt: 'Charts Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '2',
    description: 'Raise awareness about the importance of IP and protect its rights.',
    icon: {
      component: MegaphoneIcon,
      alt: 'Megaphone Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '3',
    description: 'Express opinion on the international agreements related to IP rights.',
    icon: {
      component: InternetIcon,
      alt: 'Internet Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '4',
    description: 'Suggesting rules and regulations related to IP rights.',
    icon: {
      component: CourtIcon,
      alt: 'Court Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '5',
    description: 'Strengthen the use of IP to build an advanced knowledge-based economy.',
    icon: {
      component: AimIcon,
      alt: 'Aim Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '6',
    description:
      'Establish information bases in the SAIP field of work, and exchange information with local, regional and international bodies.',
    icon: {
      component: InternetIcon,
      alt: 'Internet Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '7',
    description: 'Register IP rights, grant and enforce their protection documents.',
    icon: {
      component: BookIcon,
      alt: 'Document Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '8',
    description: 'License the activities related to the SAIP field of work.',
    icon: {
      component: LightBulbIcon,
      alt: 'License Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
  {
    id: '9',
    description:
      'Represent the Kingdom of Saudi Arabia in international and regional organizations related to IP rights, and defend its interests.',
    icon: {
      component: BrainIcon,
      alt: 'Representation Icon',
      background: 'green',
      size: 'large',
      svgSize: 'medium',
    },
  },
];
