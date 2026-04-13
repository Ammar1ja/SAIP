import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { ServiceOption } from './IPServicesSection.types';

export const PATENTS_SERVICES_DATA = {
  title: 'SAIP service directory',
  services: [
    {
      title: 'Patent application',
      labels: ['Protection'],
      description: 'A service that allows the user to file a patent application.',
      href: '#',
    },
    {
      title: 'Patent Cooperation Treaty (PCT)',
      labels: ['Protection'],
      description:
        'The Patent Cooperation Treaty (PCT) helps applicants obtain patent protection for their inventions internationally pursuant to a patent, h...',
      href: '#',
    },
    {
      title: 'Fast Track Examination of Patent Applications (PPH) Patent Prosecution Highway',
      labels: ['Protection'],
      description:
        'Under the PPH agreement, patent offices participating in the Program have agreed that when an applicant receives a positive decision fr...',
      href: '#',
    },
    {
      title: 'Amend or add to a patent application',
      labels: ['Service type'],
      description:
        'A service that allows the user to modify the specifications "No substantial change may be made."',
      href: '#',
    },
    {
      title: 'Amend or add to a patent application',
      labels: ['Service type'],
      description:
        'A service that allows the user to delete the wrongly entered data when submitting the application. The service allows the user to (add,...',
      href: '#',
    },
    {
      title: 'Changing the ownership of a patent',
      labels: ['Service type'],
      description:
        'A service that allows the patent applicant to transfer/change the ownership of the application from the current owner to the new one.',
      href: '#',
    },
    {
      title: 'Request for a certified copy (request for a duplicate)',
      labels: ['Service type'],
      description:
        'A service that allows the applicant to obtain a certified copy of the application or the protection document.',
      href: '#',
    },
    {
      title: 'Adding a power of attorney document',
      labels: ['Service type'],
      description: 'A service that allows the applicant to add a power of attorney document.',
      href: '#',
    },
    {
      title: 'Request to add a waiver document',
      labels: ['Service type'],
      description: 'A service that allows the applicant to add a waiver document.',
      href: '#',
    },
    {
      title: 'Request to add precedence documents',
      labels: ['Service type'],
      description: 'A service that allows the user to add precedence documents.',
      href: '#',
    },
    {
      title: 'Request to add/change/cancel an agent',
      labels: ['Service type'],
      description: 'A service that allows the patent applicant to add/change/cancel an agent.',
      href: '#',
    },
    {
      title: 'Request to withdraw a patent application',
      labels: ['Service type'],
      description:
        'A service that allows the applicant to withdraw the application when he/she does not want to complete the application procedures unless it is...',
      href: '#',
    },
  ] as ServiceCardProps[],
  serviceTypeOptions: [
    { value: 'all', label: 'All' },
    { value: 'guidance', label: 'Guidance' },
    { value: 'protection', label: 'Protection' },
    { value: 'management', label: 'Management' },
    { value: 'enforcement', label: 'Enforcement' },
  ] as ServiceOption[],
  targetGroupOptions: [
    { value: 'all', label: 'All' },
    { value: 'individuals', label: 'Individuals' },
    { value: 'enterprises', label: 'Enterprises' },
  ] as ServiceOption[],
};
