import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { ConsultationHero } from './ConsultationHero';
import { ConsultationDetailContent } from './ConsultationDetailContent';
import {
  fetchConsultationById,
  transformConsultationDetail,
  ConsultationDetailData,
} from '@/lib/drupal/services/public-consultations.service';
import { getConsultationDetail, ConsultationDetail } from '../consultationData';

async function getConsultationData(
  id: string,
  locale?: string,
): Promise<{ data: ConsultationDetailData; consultationDetail: ConsultationDetail } | null> {
  // Try to get data from consultationData first, then fallback to Drupal
  let consultationDetail = getConsultationDetail(id);
  let data: ConsultationDetailData | null = null;

  if (consultationDetail) {
    data = {
      id: consultationDetail.id,
      title: consultationDetail.title,
      closingDate: consultationDetail.closingDate,
      description: consultationDetail.description,
      content: consultationDetail.content,
    };
  } else {
    // Fallback to Drupal
    const node = await fetchConsultationById(id, locale);
    if (node) {
      data = transformConsultationDetail(node, []);
      consultationDetail = {
        id: data.id,
        title: data.title,
        closingDate: data.closingDate,
        description: data.description,
        content: data.content,
      };
    }
  }

  if (!data || !consultationDetail) {
    return null;
  }

  return { data, consultationDetail };
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { locale, id } = await params;
  const result = await getConsultationData(id, locale);

  if (!result) {
    return {
      title: 'Consultation Not Found',
    };
  }

  const { data } = result;

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [
        {
          url: '/images/public-consultations/hero.jpg',
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
  };
};

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const messages = (await getMessages({ locale })) as any;

  const result = await getConsultationData(id, locale);

  if (!result) {
    notFound();
  }

  const { data, consultationDetail } = result;

  const breadcrumbs = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.toolsAndResearch || 'Tools and Research',
      href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.ROOT,
    },
    {
      label: messages.breadcrumbs?.publicConsultations || 'Public Consultations',
      href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLIC_CONSULTATIONS.ROOT,
    },
    { label: data.title },
  ];

  return (
    <>
      <ConsultationHero consultation={consultationDetail} breadcrumbs={breadcrumbs} />

      <ConsultationDetailContent data={data} />
      <FeedbackSection />
    </>
  );
}
