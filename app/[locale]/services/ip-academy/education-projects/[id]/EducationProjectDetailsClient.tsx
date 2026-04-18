'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import DetailPageLayout from '@/components/layouts/DetailPageLayout';
import InfoBlock from '@/components/molecules/InfoBlock';
import Heading from '@/components/atoms/Heading';
import Label from '@/components/atoms/Label/Label';
import { ExpandableTab } from '@/components/molecules/ExpandableTab/ExpandableTab';
import { EducationProjectData } from '@/lib/drupal/services/ip-academy.service';
import { ROUTES } from '@/lib/routes';
import LeadingIcon from '@/assets/images/leading_icon.png';
import { useLocale } from 'next-intl';

interface EducationProjectDetailsClientProps {
  project: EducationProjectData;
  translations: {
    breadcrumbs: {
      home: string;
      services: string;
      ipEnablement: string;
      ipAcademy: string;
      educationProjects: string;
    };
    labels: {
      ipAcademy: string;
      ipEnablement: string;
    };
    goBack: string;
    detailsTitle: string;
    partners: string;
    projectScope: string;
    targetAudience: string;
    projectDetails: string;
  };
}

export default function EducationProjectDetailsClient({
  project,
  translations: t,
}: EducationProjectDetailsClientProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const locale = useLocale();
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t.breadcrumbs.home, href: '/' },
              { label: t.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
              { label: t.breadcrumbs.ipEnablement },
              { label: t.breadcrumbs.ipAcademy, href: '/services/ip-academy' },
              {
                label: t.breadcrumbs.educationProjects,
                href: '/services/ip-academy?tab=projects',
              },
              { label: project.title },
            ]}
          />
          <button
            className="cursor-pointer mb-[44px] px-3 h-8 border border-[#d2d6db] rounded-[4px] text-sm font-medium text-[#161616] hover:bg-neutral-100 transition inline-flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <img
              src={LeadingIcon.src}
              alt=""
              className={`w-4 h-4 object-contain ${isRtl ? 'rotate-180 ml-2' : 'rotate-0 mr-2'}`}
            />{' '}
            {t.goBack}
          </button>

          <Heading
            as="h1"
            size="h1"
            className="mb-[16px] max-w-[66.666%] !text-[48px] !xl:text-[72px] max-w-[945px]"
          >
            {project.title}
          </Heading>
          <div className="flex gap-2 mb-4">
            <Label size="sm" className="mb-0" variant="default">
              {t.labels.ipAcademy}
            </Label>
            <Label size="sm" className="mb-0" variant="default">
              {t.labels.ipEnablement}
            </Label>
          </div>
          <div className="text-lg text-neutral-700 mb-4 max-w-2xl">{project.description}</div>
        </div>
      </Section>

      <DetailPageLayout
        sectionProps={{ background: 'white', padding: 'default' }}
        reserveSidebarSpace={true}
      >
        <Heading as="h2" size="h2" className="mb-4">
          {t.detailsTitle}
        </Heading>
        <div className="text-lg text-neutral-700 mb-8 max-w-2xl">{project.details}</div>

        {project.partners && project.partners.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4" className="!text-[24px] !font-medium">
                {t.partners}
              </Heading>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.partners.map((partner) => (
                <div
                  key={partner.id}
                  className="border border-gray-200 rounded-lg p-6 text-center bg-white"
                >
                  {partner.logo && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-medium text-gray-900">{partner.name}</h3>
                </div>
              ))}
            </div>
          </InfoBlock>
        )}

        {project.projectScopeSections.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.projectScope}
              </Heading>
            }
          >
            {project.projectScopeDescription && (
              <div className="mb-6">{project.projectScopeDescription}</div>
            )}
            <div className="space-y-3">
              {project.projectScopeSections.map((section) => (
                <ExpandableTab
                  key={section.id}
                  title={
                    <div className="text-lg font-medium text-neutral-900">{section.title}</div>
                  }
                  variant="minimal"
                  description={section.content}
                  isExpanded={openSection === section.id}
                  onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="!bg-white shadow-sm !border-neutral-200"
                />
              ))}
            </div>
          </InfoBlock>
        )}

        {project.targetAudience.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.targetAudience}
              </Heading>
            }
          >
            <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2">
              {project.targetAudience.map((audience, index) => (
                <li key={index}>{audience}</li>
              ))}
            </ul>
          </InfoBlock>
        )}

        {project.projectDetails.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.projectDetails}
              </Heading>
            }
          >
            <div className="space-y-3">
              {project.projectDetails.map((detail) => (
                <ExpandableTab
                  key={detail.id}
                  variant={'minimal'}
                  title={<div className="text-lg font-medium text-neutral-900">{detail.title}</div>}
                  description={detail.content}
                  isExpanded={openDetail === detail.id}
                  onToggle={() => setOpenDetail(openDetail === detail.id ? null : detail.id)}
                  className="!bg-white shadow-sm !border-neutral-200"
                />
              ))}
            </div>
          </InfoBlock>
        )}
      </DetailPageLayout>
    </main>
  );
}
