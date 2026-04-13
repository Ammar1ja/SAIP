import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Section from '@/components/atoms/Section';
import EntitiesPartnersContent from './EntitiesPartnersContent';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { getEntitiesPartnersPageData } from '@/lib/drupal/services/entities-partners.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function EntitiesPartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getEntitiesPartnersPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.saip || 'SAIP' },
    { label: messages.breadcrumbs?.entitiesPartners || 'Entities & Partners' },
  ];

  const anchorItems = [
    {
      label: (messages.entitiesPartners as any)?.government || 'Government',
      href: '#government-sector',
    },
    {
      label: (messages.entitiesPartners as any)?.healthcare || 'Healthcare',
      href: '#healthcare-sector',
    },
    {
      label: (messages.entitiesPartners as any)?.academic || 'Academic',
      href: '#academic-sector',
    },
    {
      label: (messages.entitiesPartners as any)?.private || 'Private',
      href: '#private-sector',
    },
    {
      label:
        (messages.entitiesPartners as any)?.internationalOrganizations ||
        'International Organizations and Institutions',
      href: '#international-sector',
    },
  ];
  return (
    <>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage={data.heroImage?.url || '/images/national-ip-strategy/hero.jpg'}
        breadcrumbs={breadcrumbItems}
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <Section>
        <EntitiesPartnersContent data={data} />
      </Section>
      <FeedbackSection />
    </>
  );
}
