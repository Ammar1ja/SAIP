import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { getReportDetailData } from '@/lib/drupal/services/reports.service';
import { ReportDetailContent } from './ReportDetailContent';

const stripHtml = (value?: string) =>
  value
    ? value
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { locale, id } = await params;
  const report = await getReportDetailData(id, locale);

  if (!report) {
    return { title: 'Report Not Found' };
  }

  return {
    title: report.title,
    description: stripHtml(report.overview) || report.title,
    openGraph: {
      title: report.title,
      description: stripHtml(report.overview) || report.title,
      images: [
        {
          url: '/images/reports/hero.jpg',
          width: 1200,
          height: 630,
          alt: report.title,
        },
      ],
    },
  };
};

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const messages = await getMessages({ locale });
  const report = await getReportDetailData(id, locale);

  if (!report) {
    notFound();
  }

  const breadcrumbs = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.ipInformation || 'IP Information',
      href: ROUTES.RESOURCES.IP_INFORMATION.ROOT,
    },
    {
      label: messages.breadcrumbs?.reports || 'Reports',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.REPORTS.ROOT,
    },
    { label: report.title },
  ];

  return (
    <main>
      <HeroStatic
        title={report.title}
        description={stripHtml(report.overview)}
        backgroundImage="/images/reports/hero.jpg"
        breadcrumbs={breadcrumbs}
      />
      <ReportDetailContent report={report} />
      <FeedbackSection />
    </main>
  );
}
