import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { ROUTES } from '@/lib/routes';

export const IP_INFRINGEMENT_VIDEO_DATA = {
  videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoPoster: '/images/ip-infringement/video-poster.jpg',
  description: 'Watch the video and learn more about IP Infringement',
};

export const IP_INFRINGEMENT_GUIDE_DATA = {
  guideTitle: 'IP infringement guides',
  ctaLabel: 'Go to Guidelines',
  ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
  guideCards: [
    {
      title: 'Beneficiary Guide IP Infringement Complaint',
      description: 'description',
      labels: ['IP infringement'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/beneficiary-guide-ip-infringement.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/beneficiary-guide-ip-infringement.pdf',
      titleBg: 'green' as const,
    },
  ] as ServiceCardProps[],
};
