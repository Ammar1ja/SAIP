'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DocumentSection from '@/components/organisms/DocumentSection';
import ScrollableCards from '@/components/molecules/ScrollableCards';
import { User, Building, FileText } from 'lucide-react';
import Pagination from '@/components/atoms/Pagination';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import LocationFigmaIcon from '@/components/icons/ip-agents/LocationFigmaIcon';
import EmailFigmaIcon from '@/components/icons/ip-agents/EmailFigmaIcon';
import Button from '@/components/atoms/Button';
import {
  SupervisoryUnitData,
  CivilAssociation,
  TargetArea,
  ObjectiveItem,
} from '@/lib/drupal/services/supervisory-unit.service';

interface SupervisoryUnitContentProps {
  data: SupervisoryUnitData & { civilAssociations: CivilAssociation[] };
}

const getIconForArea = (icon: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    user: <User className="w-5 h-5 text-white" />,
    building: <Building className="w-5 h-5 text-white" />,
    file: <FileText className="w-5 h-5 text-white" />,
  };
  return iconMap[icon] || iconMap.user;
};

const LinkSquareIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M14 4H20V10"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14L20 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 14V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H10"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function SupervisoryUnitContent({ data }: SupervisoryUnitContentProps) {
  const t = useTranslations('supervisoryUnit');
  const tButtons = useTranslations('buttons');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllTargetAreas, setShowAllTargetAreas] = useState(false);
  const [showAllObjectives, setShowAllObjectives] = useState(false);
  const itemsPerPage = 6;
  const mobileItemsLimit = 3;

  // Transform target areas for ScrollableCards
  const targetAreasCards = data.targetAreas.items.map((area: TargetArea) => ({
    id: area.id,
    title: area.title,
    icon: getIconForArea(area.icon),
  }));

  // Pagination for civil associations
  const totalPages = Math.ceil(data.civilAssociations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssociations = data.civilAssociations.slice(startIndex, endIndex);
  const visibleTargetAreas = showAllTargetAreas
    ? targetAreasCards
    : targetAreasCards.slice(0, mobileItemsLimit);
  const visibleObjectives = showAllObjectives
    ? data.objectives.items
    : data.objectives.items.slice(0, mobileItemsLimit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const rawContactDescription = data.contact.description?.trim();
  const heroTitle = data.hero.title?.trim().toLowerCase();
  const contactDescriptionText =
    rawContactDescription && rawContactDescription.toLowerCase() !== heroTitle
      ? rawContactDescription
      : t('contactDescription');

  return (
    <>
      <div id="overview">
        <DocumentSection
          heading={data.overview.heading}
          description={data.overview.description}
          image={{
            src: data.overview.image?.src || '/images/photo-container.png',
            alt: data.overview.image?.alt || 'Data visualization dashboard on laptop',
          }}
          alignEnabled
          alignDirection="auto"
        />
      </div>

      {targetAreasCards.length > 0 && (
        <div id="target-areas">
          <div className="md:hidden px-4 pt-24 pb-12">
            <h2 className="text-[30px] leading-[38px] font-medium text-[#161616] mb-8">
              {data.targetAreas.heading}
            </h2>
            <div className="flex flex-col gap-4">
              {visibleTargetAreas.map((area) => (
                <div
                  key={area.id}
                  className="rounded-2xl border border-[#d2d6db] bg-white p-4 flex flex-col items-start gap-6"
                >
                  <div className="w-12 h-12 rounded-md bg-success-700 flex items-center justify-center">
                    <span className="w-6 h-6 flex items-center justify-center text-white">
                      {area.icon}
                    </span>
                  </div>
                  <p className="text-base leading-6 text-[#1f2a37]">{area.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                intent="secondary"
                outline
                className="w-full h-11 !rounded-sm"
                onClick={() => setShowAllTargetAreas((prev) => !prev)}
                ariaLabel={showAllTargetAreas ? tButtons('viewLess') : tButtons('viewAll')}
              >
                {showAllTargetAreas ? tButtons('viewLess') : tButtons('viewAll')}
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <ScrollableCards
              heading={data.targetAreas.heading}
              variant="highlight"
              items={targetAreasCards}
              cardWidth={280}
            />
          </div>
        </div>
      )}

      {data.objectives.items.length > 0 && (
        <div id="objectives" className="w-full bg-primary-25">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
            <h2 className="text-[48px] leading-[60px] tracking-[-0.96px] font-medium text-[#161616] mb-12 max-w-[720px]">
              {data.objectives.heading}
            </h2>
            <div className="md:hidden flex flex-col gap-4">
              {visibleObjectives.map((objective: ObjectiveItem) => (
                <div
                  key={objective.id}
                  className="border-l border-l-success-700 pl-4 rtl:border-l-0 rtl:pl-0 rtl:border-r rtl:border-r-success-700 rtl:pr-4 py-4"
                >
                  <p className="text-base leading-6 text-[#1f2a37]">{objective.text}</p>
                </div>
              ))}
            </div>
            {data.objectives.items.length > mobileItemsLimit && (
              <div className="md:hidden mt-4">
                <Button
                  intent="secondary"
                  outline
                  className="w-full h-11 !rounded-sm"
                  onClick={() => setShowAllObjectives((prev) => !prev)}
                  ariaLabel={showAllObjectives ? tButtons('viewLess') : tButtons('viewAll')}
                >
                  {showAllObjectives ? tButtons('viewLess') : tButtons('viewAll')}
                </Button>
              </div>
            )}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.objectives.items.map((objective: ObjectiveItem) => (
                <div
                  key={objective.id}
                  className="h-[144px] border-l border-l-success-700 pl-4 rtl:border-l-0 rtl:pl-0 rtl:border-r rtl:border-r-success-700 rtl:pr-4 py-6"
                >
                  <p className="text-base leading-6 text-[#1f2a37]">{objective.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {data.civilAssociations.length > 0 && (
        <div id="civil-associations" className="py-8 md:py-12 lg:py-16">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-[800px] font-medium text-gray-900 mb-6 md:mb-8">
              {data.associations.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {currentAssociations.map((association: CivilAssociation) => (
                <div
                  key={association.id}
                  className="bg-white rounded-2xl border border-[#d2d6db] p-4 flex flex-col gap-6 h-full"
                >
                  <div className="flex flex-col gap-2 text-[#1f2a37]">
                    <h3 className="text-[18px] leading-[28px] font-medium">{association.title}</h3>
                    <p className="text-base leading-6">
                      {t('classification')}: {association.classification || '-'}
                    </p>
                  </div>

                  <div className="bg-[#f9fafb] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-sm bg-success-700 flex items-center justify-center shrink-0">
                        <EmailFigmaIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <p className="text-base leading-6 font-medium text-[#1f2a37]">
                          {t('email')}
                        </p>
                        {association.email ? (
                          <a
                            href={`mailto:${association.email}`}
                            className="text-sm leading-5 text-[#384250] break-all"
                          >
                            {association.email}
                          </a>
                        ) : (
                          <p className="text-sm leading-5 text-[#384250]">-</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-sm bg-success-700 flex items-center justify-center shrink-0">
                        <LocationFigmaIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <p className="text-base leading-6 font-medium text-[#1f2a37]">
                          {t('location')}
                        </p>
                        <p className="text-sm leading-5 text-[#384250]">
                          {association.location || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {association.website && (
                    <Button
                      href={association.website}
                      target="_blank"
                      ariaLabel={t('goToWebsite')}
                      intent="primary"
                      className="h-10 w-full sm:w-auto sm:flex-none self-stretch sm:self-start px-4"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LinkSquareIcon className="w-5 h-5" />
                        {t('goToWebsite')}
                      </span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div id="contact">
        <DocumentSection
          heading={data.contact.heading?.trim() || t('contactHeading')}
          description={
            <div className="flex min-h-0 flex-col justify-start gap-6">
              <p className="text-[#384250]">{contactDescriptionText}</p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#079455]"
                  aria-hidden
                >
                  <EmailFigmaIcon
                    variant="contactTile"
                    className="block h-[12px] w-[14px] shrink-0 text-white"
                  />
                </div>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-base leading-6 text-[#384250] underline underline-offset-2 break-all transition-colors hover:text-[#079455]"
                >
                  {data.contact.email}
                </a>
              </div>
            </div>
          }
          variant="with-image"
          imagePosition="left"
          background="neutral"
          image={{
            src: data.contact.image?.src || '/images/photo-container.png',
            alt: data.contact.image?.alt || 'Contact us - laptop on desk with office background',
          }}
          alignEnabled
          alignDirection="auto"
          sectionPadding="none"
          sectionOuterClassName="pt-20 pb-20"
          itemsAlign="stretch"
          className="max-w-[1440px] w-full min-w-0 mx-auto overflow-x-clip px-4 md:px-8 lg:px-0 lg:ps-0 lg:pe-20"
        />
      </div>
      <FeedbackSection />
    </>
  );
}
