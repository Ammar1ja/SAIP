import { ReactNode } from 'react';

export interface ListItem {
  /** Unique id used for identify key*/
  id: number | string;
  /** List item content*/
  content: ReactNode;
}

export interface ListProps {
  /** Required list items array*/
  items: ListItem[];
  /** Whether the list is ordered or unordered*/
  ordered?: boolean;
  /** Text size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS list classes */
  className?: string;
  /** Additional CSS list item classes */
  listItemClassName?: string;
}
