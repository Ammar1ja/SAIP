export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type BreadcrumbsVariant = 'default' | 'hero' | 'subpage' | 'services';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: BreadcrumbsVariant;
}
