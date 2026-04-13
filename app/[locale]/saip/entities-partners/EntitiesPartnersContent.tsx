'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PartnersGrid from '@/components/molecules/PartnersGrid';
import Spinner from '@/components/atoms/Spinner';
import Button from '@/components/atoms/Button';
import { EntitiesPartnersData } from '@/lib/drupal/services/entities-partners.service';
import { useTranslations } from 'next-intl';

const PartnerCard = dynamic(
  () => import('@/components/molecules/PartnerCard').then((m) => m.default),
  {
    loading: () => <Spinner size={40} className="h-40" />,
  },
);

interface EntitiesPartnersContentProps {
  data: EntitiesPartnersData;
}

const INITIAL_ITEMS_COUNT = 6;

/** Desktop matches Figma; scales down on smaller viewports */
const PAGE_H2_CLASS =
  'scroll-mt-24 w-full !font-medium tracking-[-0.02em] text-text-default text-[30px] leading-[38px] sm:text-[36px] sm:leading-[44px] md:text-[42px] md:leading-[52px] lg:text-[48px] lg:leading-[60px]';

const PAGE_H3_CLASS =
  'min-w-0 !font-medium tracking-[-0.02em] text-text-default text-[22px] leading-[30px] sm:text-[26px] sm:leading-[34px] md:text-[30px] md:leading-[38px] lg:text-[36px] lg:leading-[44px]';

export default function EntitiesPartnersContent({ data }: EntitiesPartnersContentProps) {
  const t = useTranslations('entitiesPartners');
  const tButtons = useTranslations('buttons');
  const [showAllGovernment, setShowAllGovernment] = useState(false);
  const [showAllHealthcare, setShowAllHealthcare] = useState(false);
  const [showAllAcademic, setShowAllAcademic] = useState(false);
  const [showAllPrivate, setShowAllPrivate] = useState(false);
  const [showAllInternational, setShowAllInternational] = useState(false);

  const hasMoreGovernment = data.governmentPartners.length > INITIAL_ITEMS_COUNT;
  const hasMoreHealthcare = data.healthcarePartners.length > INITIAL_ITEMS_COUNT;
  const hasMoreAcademic = data.academicPartners.length > INITIAL_ITEMS_COUNT;
  const hasMorePrivate = data.privatePartners.length > INITIAL_ITEMS_COUNT;
  const hasMoreInternational = data.internationalPartners.length > INITIAL_ITEMS_COUNT;

  const displayedGovernmentPartners = showAllGovernment
    ? data.governmentPartners
    : data.governmentPartners.slice(0, INITIAL_ITEMS_COUNT);

  const displayedHealthcarePartners = showAllHealthcare
    ? data.healthcarePartners
    : data.healthcarePartners.slice(0, INITIAL_ITEMS_COUNT);

  const displayedAcademicPartners = showAllAcademic
    ? data.academicPartners
    : data.academicPartners.slice(0, INITIAL_ITEMS_COUNT);

  const displayedPrivatePartners = showAllPrivate
    ? data.privatePartners
    : data.privatePartners.slice(0, INITIAL_ITEMS_COUNT);

  const displayedInternationalPartners = showAllInternational
    ? data.internationalPartners
    : data.internationalPartners.slice(0, INITIAL_ITEMS_COUNT);

  return (
    <>
      <h2 id="national-partners" className={`mt-0 mb-8 md:mb-12 ${PAGE_H2_CLASS}`}>
        {t('nationalPartners')}
      </h2>

      <section id="government-sector">
        <div className="flex items-center justify-between mb-8 mt-0">
          <h3 className={PAGE_H3_CLASS}>{t('governmentSector')}</h3>
          {hasMoreGovernment && (
            <Button
              intent="secondary"
              outline
              onClick={() => setShowAllGovernment(!showAllGovernment)}
              ariaLabel={showAllGovernment ? tButtons('viewLess') : tButtons('viewAll')}
              className="hidden md:inline-flex w-full md:w-auto"
            >
              {showAllGovernment ? tButtons('viewLess') : tButtons('viewAll')}
            </Button>
          )}
        </div>
        <PartnersGrid>
          {displayedGovernmentPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              logo={partner.logo}
              name={partner.name}
              website={partner.website || ''}
              websiteLabel={t('goToWebsite')}
            />
          ))}
        </PartnersGrid>
        {hasMoreGovernment && (
          <Button
            intent="secondary"
            outline
            onClick={() => setShowAllGovernment(!showAllGovernment)}
            ariaLabel={showAllGovernment ? tButtons('viewLess') : tButtons('viewAll')}
            className="mt-6 w-full md:hidden"
          >
            {showAllGovernment ? tButtons('viewLess') : tButtons('viewAll')}
          </Button>
        )}
      </section>

      <section id="healthcare-sector">
        <div className="flex items-center justify-between mb-8 mt-12">
          <h3 className={PAGE_H3_CLASS}>{t('healthcareSector')}</h3>
          {hasMoreHealthcare && (
            <Button
              intent="secondary"
              outline
              onClick={() => setShowAllHealthcare(!showAllHealthcare)}
              ariaLabel={showAllHealthcare ? tButtons('viewLess') : tButtons('viewAll')}
              className="hidden md:inline-flex w-full md:w-auto"
            >
              {showAllHealthcare ? tButtons('viewLess') : tButtons('viewAll')}
            </Button>
          )}
        </div>
        <PartnersGrid>
          {displayedHealthcarePartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              logo={partner.logo}
              name={partner.name}
              website={partner.website || ''}
              websiteLabel={t('goToWebsite')}
            />
          ))}
        </PartnersGrid>
        {hasMoreHealthcare && (
          <Button
            intent="secondary"
            outline
            onClick={() => setShowAllHealthcare(!showAllHealthcare)}
            ariaLabel={showAllHealthcare ? tButtons('viewLess') : tButtons('viewAll')}
            className="mt-6 w-full md:hidden"
          >
            {showAllHealthcare ? tButtons('viewLess') : tButtons('viewAll')}
          </Button>
        )}
      </section>

      {data.academicPartners.length > 0 && (
        <section id="academic-sector">
          <div className="flex items-center justify-between mb-8 mt-12">
            <h3 className={PAGE_H3_CLASS}>{t('academicSector')}</h3>
            {hasMoreAcademic && (
              <Button
                intent="secondary"
                outline
                onClick={() => setShowAllAcademic(!showAllAcademic)}
                ariaLabel={showAllAcademic ? tButtons('viewLess') : tButtons('viewAll')}
                className="hidden md:inline-flex w-full md:w-auto"
              >
                {showAllAcademic ? tButtons('viewLess') : tButtons('viewAll')}
              </Button>
            )}
          </div>
          <PartnersGrid>
            {displayedAcademicPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                logo={partner.logo}
                name={partner.name}
                website={partner.website || ''}
                websiteLabel={t('goToWebsite')}
              />
            ))}
          </PartnersGrid>
          {hasMoreAcademic && (
            <Button
              intent="secondary"
              outline
              onClick={() => setShowAllAcademic(!showAllAcademic)}
              ariaLabel={showAllAcademic ? tButtons('viewLess') : tButtons('viewAll')}
              className="mt-6 w-full md:hidden"
            >
              {showAllAcademic ? tButtons('viewLess') : tButtons('viewAll')}
            </Button>
          )}
        </section>
      )}

      {data.privatePartners.length > 0 && (
        <section id="private-sector">
          <div className="flex items-center justify-between mb-8 mt-12">
            <h3 className={PAGE_H3_CLASS}>{t('privateSector')}</h3>
            {hasMorePrivate && (
              <Button
                intent="secondary"
                outline
                onClick={() => setShowAllPrivate(!showAllPrivate)}
                ariaLabel={showAllPrivate ? tButtons('viewLess') : tButtons('viewAll')}
                className="hidden md:inline-flex w-full md:w-auto"
              >
                {showAllPrivate ? tButtons('viewLess') : tButtons('viewAll')}
              </Button>
            )}
          </div>
          <PartnersGrid>
            {displayedPrivatePartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                logo={partner.logo}
                name={partner.name}
                website={partner.website || ''}
                websiteLabel={t('goToWebsite')}
              />
            ))}
          </PartnersGrid>
          {hasMorePrivate && (
            <Button
              intent="secondary"
              outline
              onClick={() => setShowAllPrivate(!showAllPrivate)}
              ariaLabel={showAllPrivate ? tButtons('viewLess') : tButtons('viewAll')}
              className="mt-6 w-full md:hidden"
            >
              {showAllPrivate ? tButtons('viewLess') : tButtons('viewAll')}
            </Button>
          )}
        </section>
      )}

      {data.internationalPartners.length > 0 && (
        <>
          <h2
            id="international-partners-heading"
            className={`mt-12 lg:mt-16 mb-8 md:mb-12 ${PAGE_H2_CLASS}`}
          >
            {t('internationalPartners')}
          </h2>

          <section id="international-sector">
            <div className="flex items-center justify-between mb-8 mt-0">
              <h3 className={PAGE_H3_CLASS}>{t('internationalOrganizations')}</h3>
              {hasMoreInternational && (
                <Button
                  intent="secondary"
                  outline
                  onClick={() => setShowAllInternational(!showAllInternational)}
                  ariaLabel={showAllInternational ? tButtons('viewLess') : tButtons('viewAll')}
                  className="hidden md:inline-flex w-full md:w-auto"
                >
                  {showAllInternational ? tButtons('viewLess') : tButtons('viewAll')}
                </Button>
              )}
            </div>
            <PartnersGrid>
              {displayedInternationalPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  logo={partner.logo}
                  name={partner.name}
                  website={partner.website || ''}
                  websiteLabel={t('goToWebsite')}
                />
              ))}
            </PartnersGrid>
            {hasMoreInternational && (
              <Button
                intent="secondary"
                outline
                onClick={() => setShowAllInternational(!showAllInternational)}
                ariaLabel={showAllInternational ? tButtons('viewLess') : tButtons('viewAll')}
                className="mt-6 w-full md:hidden"
              >
                {showAllInternational ? tButtons('viewLess') : tButtons('viewAll')}
              </Button>
            )}
          </section>
        </>
      )}
    </>
  );
}
