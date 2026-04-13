import { CommitteeResponsibility } from '@/app/[locale]/services/ip-general-secretariat/GeneralSecretariat.data';

export interface GeneralSecretariatCommitteeSectionProps {
  title: string;
  description: string;
  responsibilities: CommitteeResponsibility[];
  ctaTitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
}
