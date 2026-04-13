import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { ServiceOption } from '@/components/organisms/IPServicesSection/IPServicesSection.types';

export const TOPOGRAPHIC_DESIGNS_SERVICES_DATA = {
  title: 'SAIP service directory',
  services: [
    {
      title: 'Layout design registration',
      labels: ['Protection'],
      description:
        'A service that allows the user to register a layout design of integrated circuits for protection.',
      href: '#',
    },
    {
      title: 'Layout design examination',
      labels: ['Protection'],
      description:
        'Professional examination service to assess the originality and registrability of your layout design before formal application.',
      href: '#',
    },
    {
      title: 'Prior art search for layout designs',
      labels: ['Guidance'],
      description:
        'Comprehensive search service to identify existing layout designs and assess the novelty of your integrated circuit design.',
      href: '#',
    },
    {
      title: 'Amend or add to a layout design application',
      labels: ['Management'],
      description:
        'A service that allows the user to modify the specifications of a layout design application. "No substantial change may be made to the original design."',
      href: '#',
    },
    {
      title: 'Changing the ownership of a layout design',
      labels: ['Management'],
      description:
        'A service that allows the layout design applicant to transfer/change the ownership of the application from the current owner to the new one.',
      href: '#',
    },
    {
      title: 'Request for a certified copy of layout design',
      labels: ['Management'],
      description:
        'A service that allows the applicant to obtain a certified copy of the layout design application or the protection document.',
      href: '#',
    },
    {
      title: 'Adding a power of attorney document',
      labels: ['Management'],
      description:
        'A service that allows the applicant to add a power of attorney document for layout design proceedings.',
      href: '#',
    },
    {
      title: 'Layout design renewal',
      labels: ['Management'],
      description:
        'Service to renew the protection period for registered layout designs of integrated circuits.',
      href: '#',
    },
    {
      title: 'Request to add/change/cancel an agent',
      labels: ['Management'],
      description:
        'A service that allows the layout design applicant to add/change/cancel an agent for representation.',
      href: '#',
    },
    {
      title: 'Request to withdraw a layout design application',
      labels: ['Management'],
      description:
        'A service that allows the applicant to withdraw the layout design application when they do not want to complete the application procedures.',
      href: '#',
    },
    {
      title: 'Layout design infringement consultation',
      labels: ['Enforcement'],
      description:
        'Professional consultation service for cases involving potential infringement of layout design rights.',
      href: '#',
    },
    {
      title: 'Layout design licensing assistance',
      labels: ['Management'],
      description:
        'Guidance and assistance in licensing your layout design rights to third parties for commercial exploitation.',
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
