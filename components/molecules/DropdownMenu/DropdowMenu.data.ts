import { HomeIcon } from 'lucide-react';
import type { DropdownMenuItem } from './DropdownMenu.types';

export const mockDropdownItems: DropdownMenuItem[] = [
  {
    label: 'Test item 1',
    href: '/item-1',
    description: 'Test description 1',
    group: 'Group 1',
    icon: { component: HomeIcon },
  },
  {
    label: 'Test item 2',
    href: '/item-2',
    description: 'Test description 2',
    group: 'Group 1',
  },
  {
    label: 'Test item 3',
    href: '/item-3',
    description: 'Test description 3',
    group: 'Group 1',
  },
];

export const mockDropdownDisabledItems: DropdownMenuItem[] = [
  {
    label: 'Test item 1',
    href: '/item-1',
    description: 'Test description 1',
    group: 'Group 1',
    disabled: true,
  },
];

export const mockMultiColumnDropdownItems: DropdownMenuItem[] = [
  {
    label: 'Test item 1',
    href: '/item-1',
    description: 'Test description 1',
    group: 'Group 1',
    icon: { component: HomeIcon },
  },
  {
    label: 'Test item 2',
    href: '/item-2',
    description: 'Test description 2',
    group: 'Group 1',
  },
  {
    label: 'Test item 3',
    href: '/item-3',
    description: 'Test description 3',
    group: 'Group 2',
  },
  {
    label: 'Test item 4',
    href: '/item-4',
    description: 'Test description 4',
    group: 'Group 3',
  },
  {
    label: 'Test item 5',
    href: '/item-5',
    description: 'Test description 5',
    group: 'Group 4',
  },
  {
    label: 'Test item 6',
    href: '/item-6',
    description: 'Test description 6',
    group: 'Group 5',
  },
];
