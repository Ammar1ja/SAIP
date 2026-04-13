import { notFound } from 'next/navigation';
import { fetchEducationProjectById } from '@/lib/drupal/services/ip-academy.service';
import { getTranslations } from 'next-intl/server';
import EducationProjectDetailsClient from './EducationProjectDetailsClient';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EducationProjectDetailsPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ipAcademy.projectDetails' });
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });

  const project = await fetchEducationProjectById(id, locale);

  if (!project) {
    return notFound();
  }

  const translations = {
    breadcrumbs: {
      home: tBreadcrumbs('home'),
      services: tBreadcrumbs('services'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
      ipAcademy: tBreadcrumbs('ipAcademy'),
      educationProjects: t('educationProjects'),
    },
    labels: {
      ipAcademy: tBreadcrumbs('ipAcademy'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
    },
    goBack: t('goBack'),
    detailsTitle: t('detailsTitle'),
    partners: t('partners'),
    projectScope: t('projectScope'),
    targetAudience: t('targetAudience'),
    projectDetails: t('projectDetails'),
  };

  return <EducationProjectDetailsClient project={project} translations={translations} />;
}
