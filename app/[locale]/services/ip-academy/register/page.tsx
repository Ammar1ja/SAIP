import { getTranslations } from 'next-intl/server';
import ExamRegistrationClient from './ExamRegistrationClient';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; name?: string }>;
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type, name } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'ipAcademy.registration' });
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });

  const isExam = type === 'exam';

  const translations = {
    breadcrumbs: {
      home: tBreadcrumbs('home'),
      services: tBreadcrumbs('services'),
      ipAcademy: tBreadcrumbs('ipAcademy'),
      register: isExam ? t('examTitle') : t('courseTitle'),
    },
    title: isExam ? t('examTitle') : t('courseTitle'),
    description: isExam ? t('examDescription') : t('courseDescription'),
    form: {
      fullName: t('form.fullName'),
      email: t('form.email'),
      phone: t('form.phone'),
      nationalId: t('form.nationalId'),
      examType: t('form.examType'),
      preferredDate: t('form.preferredDate'),
      preferredLocation: t('form.preferredLocation'),
      specialRequirements: t('form.specialRequirements'),
      organization: t('form.organization'),
      jobTitle: t('form.jobTitle'),
      courseName: t('form.courseName'),
      attendanceMode: t('form.attendanceMode'),
      additionalInfo: t('form.additionalInfo'),
      terms: t('form.terms'),
      submit: isExam ? t('form.submitExam') : t('form.submitCourse'),
    },
    options: {
      examTypes: {
        ip_agents: t('options.ipAgents'),
        enforcement: t('options.enforcement'),
        other: t('options.other'),
      },
      locations: {
        riyadh: t('options.riyadh'),
        jeddah: t('options.jeddah'),
        dammam: t('options.dammam'),
      },
      attendanceModes: {
        online: t('options.online'),
        onsite: t('options.onsite'),
        hybrid: t('options.hybrid'),
      },
    },
    success: t('success'),
    error: t('error'),
  };

  return (
    <ExamRegistrationClient
      type={isExam ? 'exam' : 'course'}
      prefillName={name || ''}
      translations={translations}
    />
  );
}

