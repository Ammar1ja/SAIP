import { notFound } from 'next/navigation';
import {
  fetchQualificationById,
  fetchRelatedQualifications,
} from '@/lib/drupal/services/ip-academy.service';
import { getTranslations } from 'next-intl/server';
import QualificationDetailsClient from './QualificationDetailsClient';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function QualificationDetailsPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ipAcademy.qualificationDetails' });
  const tButtons = await getTranslations({ locale, namespace: 'buttons' });
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });

  const [qualification, relatedQualifications] = await Promise.all([
    fetchQualificationById(id, locale),
    fetchRelatedQualifications(id, locale),
  ]);

  if (!qualification) {
    return notFound();
  }

  const translations = {
    breadcrumbs: {
      home: tBreadcrumbs('home'),
      services: tBreadcrumbs('services'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
      ipAcademy: tBreadcrumbs('ipAcademy'),
      proQualifications: t('proQualifications'),
    },
    labels: {
      ipAcademy: tBreadcrumbs('ipAcademy'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
    },
    goBack: t('goBack'),
    detailsTitle: t('detailsTitle'),
    forWhom: t('forWhom'),
    testRequirements: t('testRequirements'),
    studyMaterial: t('studyMaterial'),
    examPrograms: t('examPrograms'),
    chaptersEvaluation: t('chaptersEvaluation'),
    relatedServices: t('relatedServices'),
    shortDescription: t('shortDescription'),
    sidebar: {
      startDate: t('sidebar.startDate'),
      duration: t('sidebar.duration'),
      fees: t('sidebar.fees'),
      language: t('sidebar.language'),
      testType: t('sidebar.testType'),
      passingScore: t('sidebar.passingScore'),
      location: t('sidebar.location'),
      faqLabel: tButtons('goToFaq'),
      registerLabel: t('sidebar.registerLabel'),
    },
    readMore: tButtons('readMore'),
  };

  return (
    <QualificationDetailsClient
      qualification={qualification}
      relatedQualifications={relatedQualifications}
      translations={translations}
    />
  );
}
