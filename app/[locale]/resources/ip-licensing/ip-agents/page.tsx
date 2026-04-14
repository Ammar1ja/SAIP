import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import IpAgentsSection from './IpAgentsSection';
import { getIPAgentsPageData } from '@/lib/drupal/services/ip-agents.service';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getIPAgentsPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/ip-agents/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'IP agents - SAIP',
        },
      ],
    },
  };
};

export default async function IpAgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const data = await getIPAgentsPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    { label: messages.breadcrumbs.ipLicensing },
    { label: messages.breadcrumbs.ipAgents },
  ];

  // Transform agents to match frontend interface
  const agents = data.agentsList.map((agent) => ({
    id: agent.id,
    name: agent.name,
    licenseNumber: agent.licenseNumber,
    location: agent.location,
    email: agent.email,
    phone: agent.phone,
    categories: agent.categories,
  }));

  const translations = {
    search: messages.common?.filters?.search || 'Search',
    select: messages.common?.filters?.select || 'Select',
    category: messages.common?.filters?.category || 'Category',
    location: messages.ipAgents?.location || 'Location',
    totalNumber: messages.common?.filters?.totalNumber || 'Total number',
    locationLabel: messages.ipAgents?.locationLabel || 'Location',
    emailLabel: messages.ipAgents?.emailLabel || 'Email',
    phoneLabel: messages.ipAgents?.phoneLabel || 'Phone',
    categoryLabel: messages.ipAgents?.categoryLabel || 'Category',
  };

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        overlay={true}
        textColor="white"
      />

      <IpAgentsSection agents={agents} translations={translations} />
    </>
  );
}
