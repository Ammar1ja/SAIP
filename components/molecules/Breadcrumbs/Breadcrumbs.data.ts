import { BreadcrumbItem } from './Breadcrumbs.types';

export const mockBreadcrumbsWithHref: BreadcrumbItem[] = [
  { label: 'breadcrumb-1', href: '/test/breadcrumb-1' },
  { label: 'breadcrumb-2', href: '/test/breadcrumb-2' },
  { label: 'breadcrumb-3', href: '/test/breadcrumb-3' },
];

export const mockBreadcrumbsWithoutHref: BreadcrumbItem[] = [
  { label: 'breadcrumb-1' },
  { label: 'breadcrumb-2' },
  { label: 'breadcrumb-3' },
];
