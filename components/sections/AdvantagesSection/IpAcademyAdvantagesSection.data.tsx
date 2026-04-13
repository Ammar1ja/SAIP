import { ReactNode } from 'react';
import { AddNoteIcon } from '@/components/icons/services';
import { Advantage } from './IpAcademyAdvantagesSection.types';

export function getAdvantageIcon(): ReactNode {
  return (
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-success-700">
      <AddNoteIcon className="h-6 w-6 text-white" aria-hidden="true" />
    </div>
  );
}

export const ADVANTAGES: Advantage[] = [
  {
    title: 'Skills assessment',
    description: 'Get a comprehensive evaluation of your skills with tailored development plans.',
    icon: getAdvantageIcon,
  },
  {
    title: 'Access learning materials',
    description: 'Access premium learning materials tailored to support your educational journey.',
    icon: getAdvantageIcon,
  },
  {
    title: 'Quality services',
    description: 'Providing expert services that meet your budget and timelines.',
    icon: getAdvantageIcon,
  },
];

export default ADVANTAGES;
