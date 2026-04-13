import { notFound } from 'next/navigation';
import {
  fetchRelatedTrainingPrograms,
  fetchTrainingProgramById,
  mapTrainingProgramToCard,
} from '@/lib/drupal/services/ip-academy.service';
import { getTranslations } from 'next-intl/server';
import TrainingProgramDetailsClient from './TrainingProgramDetailsClient';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function TrainingProgramDetailsPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ipAcademy.trainingDetails' });
  const tButtons = await getTranslations({ locale, namespace: 'buttons' });
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const program = await fetchTrainingProgramById(id, locale);
  const relatedPrograms = await fetchRelatedTrainingPrograms(id, locale);

  if (!program) {
    return notFound();
  }

  const translations = {
    breadcrumbs: {
      home: tBreadcrumbs('home'),
      services: tBreadcrumbs('services'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
      ipAcademy: tBreadcrumbs('ipAcademy'),
      trainingPrograms: t('trainingPrograms'),
    },
    labels: {
      ipAcademy: tBreadcrumbs('ipAcademy'),
      ipEnablement: tBreadcrumbs('ipEnablement'),
    },
    goBack: t('goBack'),
    detailsTitle: t('detailsTitle'),
    forWhom: t('forWhom'),
    whatYouWillLearn: t('whatYouWillLearn'),
    courseFormat: t('courseFormat'),
    courseMaterials: t('courseMaterials'),
    courseProgramme: t('courseProgramme'),
    relatedServicesTitle: t('relatedServicesTitle'),
    relatedServicesDescription: t('relatedServicesDescription'),
    commentsAndSuggestions: tCommon('commentsAndSuggestions'),
    commentsAndSuggestionsDesc: tCommon('commentsAndSuggestionsDesc'),
    contactUs: tCommon('contactUs'),
    sidebar: {
      startDate: t('sidebar.startDate'),
      duration: t('sidebar.duration'),
      fees: t('sidebar.fees'),
      language: t('sidebar.language'),
      location: t('sidebar.location'),
      faqLabel: tButtons('goToFaq'),
      registerLabel: t('sidebar.registerLabel'),
    },
  };

  return (
    <TrainingProgramDetailsClient
      program={program}
      relatedPrograms={relatedPrograms.map((related) => mapTrainingProgramToCard(related, locale))}
      translations={translations}
    />
  );
}
