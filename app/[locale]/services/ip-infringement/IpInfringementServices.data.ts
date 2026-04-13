import { FilterableItem } from '@/components/organisms/FilterableCardsSection/FilterableCardsSection.types';

export interface IpInfringementService extends FilterableItem {
  id: string;
  title: string;
  description: string;
  category: string;
  labels: string[];
  href: string;
}

export const IP_INFRINGEMENT_SERVICES: IpInfringementService[] = [
  {
    id: 'trademark-infringement',
    title: 'Complaint of trademark infringement',
    description: 'A service that allows the user to file an industrial model application.',
    category: 'Protection',
    labels: ['Protection'],
    href: '/services/ip-infringement/trademark-complaint',
  },
  {
    id: 'copyright-infringement',
    title: 'Complaint of copyright infringement',
    description:
      'A service that allows the user to modify the specifications "No substantial change may be made".',
    category: 'Protection',
    labels: ['Protection'],
    href: '/services/ip-infringement/copyright-complaint',
  },
];
