'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import ServiceCard from '@/components/molecules/ServiceCard';
import {
  CircleInfoIcon,
  PatentDocIcon,
} from '@/components/icons/services';
import { UsersIcon } from '@/components/icons/strategy/UsersIcon';
import { AimIcon } from '@/components/icons/roles/AimIcon';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import DetailPageLayout from '@/components/layouts/DetailPageLayout';
import InfoBlock from '@/components/molecules/InfoBlock';
import Heading from '@/components/atoms/Heading';
import { ExpandableTab } from '@/components/molecules/ExpandableTab/ExpandableTab';
import Label from '@/components/atoms/Label/Label';
import DownloadButton from '@/components/atoms/Button/DownloadButton';
import { QualificationData } from '@/lib/drupal/services/ip-academy.service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CommentsAndSuggestionsSection from '@/components/organisms/CommentsAndSuggestionsSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { ROUTES } from '@/lib/routes';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.png';
import Calendar from '@/assets/images/calendar.png';
import Leading from '@/assets/images/leading_icon.png';
import Location from '@/assets/images/location.png';
import Riyal from '@/assets/images/Riyal.png';
import User from '@/assets/images/user.png';
import Watch from '@/assets/images/watch.png';
interface QualificationDetailsClientProps {
  qualification: QualificationData;
  relatedQualifications?: QualificationData[];
  translations: {
    breadcrumbs: {
      home: string;
      services: string;
      ipEnablement: string;
      ipAcademy: string;
      proQualifications: string;
    };
    labels: {
      ipAcademy: string;
      ipEnablement: string;
    };
    goBack: string;
    detailsTitle: string;
    forWhom: string;
    testRequirements: string;
    studyMaterial: string;
    examPrograms: string;
    chaptersEvaluation: string;
    relatedServices: string;
    shortDescription: string;
    sidebar: {
      startDate: string;
      duration: string;
      fees: string;
      language: string;
      testType: string;
      passingScore: string;
      location: string;
      faqLabel: string;
      registerLabel: string;
    };
    readMore: string;
  };
}

export default function QualificationDetailsClient({
  qualification,
  relatedQualifications = [],
  translations: t,
}: QualificationDetailsClientProps) {
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const tCommons = useTranslations('common');
  const locale = useLocale();

  const updateCarouselState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const absoluteLeft = Math.ceil(Math.abs(scrollLeft));
    const maxDistance = Math.max(0, scrollWidth - clientWidth);
    setCanScrollPrev(absoluteLeft > 0);
    setCanScrollNext(absoluteLeft < maxDistance);
  }, []);

  useEffect(() => {
    updateCarouselState();
    const current = carouselRef.current;
    if (!current) return;
    current.addEventListener('scroll', updateCarouselState, { passive: true });
    return () => current.removeEventListener('scroll', updateCarouselState);
  }, [relatedQualifications, updateCarouselState]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 384;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-0">
      <Section background="primary-25" padding="large">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: t.breadcrumbs.home, href: '/' },
            { label: t.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
            { label: t.breadcrumbs.ipEnablement },
            { label: t.breadcrumbs.ipAcademy, href: '/services/ip-academy' },
            {
              label: t.breadcrumbs.proQualifications,
              href: '/services/ip-academy?tab=qualifications',
            },
            { label: qualification.title },
          ]}
        />
        <button
          className="mb-8 inline-flex h-8 cursor-pointer items-center rounded-sm border border-[#D2D6DB] px-3 text-sm leading-5 font-medium text-[#161616] transition hover:bg-neutral-100"
          onClick={() => window.history.back()}
        >
          <img
            src={LeadingIcon.src}
            alt=""
            className={`w-4 h-4 object-contain ${isRtl ? 'rotate-180 ml-2' : 'rotate-0 mr-2'}`}
          />
          {t.goBack}
        </button>
        <Heading
          as="h1"
          size="h1"
          className="mb-4 max-w-[945px] text-[48px] leading-[60px] tracking-[-0.96px] font-medium lg:text-[72px] lg:leading-[90px] lg:tracking-[-1.44px]"
        >
          {qualification.title}
        </Heading>
        <div className="flex gap-2 mb-4">
          <Label size="sm" className="mb-0" variant="success">
            {t.labels.ipAcademy}
          </Label>
          <Label size="sm" className="mb-0" variant="success">
            {t.labels.ipEnablement}
          </Label>
        </div>
        <p className="mb-0 max-w-[628px] text-[20px] leading-[30px] text-primary-paragraph">
          {qualification.description}
        </p>
      </Section>
      <DetailPageLayout
        sidebar={
          <DetailSidebar
            items={[
              {
                icon: <img src={Calendar.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.startDate,
                value: qualification.startDate,
              },
              {
                icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.duration,
                value: qualification.duration,
              },
              {
                icon: <CircleInfoIcon className="w-6 h-6" />,
                label: t.sidebar.fees,
                value: qualification.fees,
              },
              {
                icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.language,
                value: qualification.language,
              },
              {
                icon: <PatentDocIcon className="w-6 h-6" />,
                label: t.sidebar.testType,
                value: qualification.testType,
              },
              {
                icon: <AimIcon className="w-6 h-6" />,
                label: t.sidebar.passingScore,
                value: qualification.passingScore,
              },
              {
                icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.location,
                value: qualification.location,
              },
            ]}
            faqHref={qualification.faqHref}
            faqLabel={t.sidebar.faqLabel}
            primaryButtonLabel={t.sidebar.registerLabel}
            primaryButtonHref={qualification.registerHref}
            primaryButtonAriaLabel={t.sidebar.registerLabel}
            className="rounded-2xl border-[#D2D6DB] p-10 shadow-none"
          />
        }
        className="gap-6"
        sidebarClassName="lg:w-[411px] lg:sticky lg:top-[128px] self-start"
        sectionProps={{ background: 'white', padding: 'large' }}
      >
        <Heading as="h2" size="h2" className="mb-4">
          {t.detailsTitle}
        </Heading>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{qualification.details}</p>

        {qualification.forWhom.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.forWhom}
              </Heading>
            }
          >
            <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2">
              {qualification.forWhom.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </InfoBlock>
        )}

        {qualification.requirements.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.testRequirements}
              </Heading>
            }
          >
            <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2">
              {qualification.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </InfoBlock>
        )}

        {qualification.studyMaterialHref && qualification.studyMaterialHref !== '#' && (
          <InfoBlock
            title={
              <div className="flex items-center justify-between w-full">
                <Heading as="h4" size="h4">
                  {t.studyMaterial}
                </Heading>
                <DownloadButton
                  href={qualification.studyMaterialHref}
                  ariaLabel={qualification.studyMaterialLabel}
                >
                  {qualification.studyMaterialLabel}
                </DownloadButton>
              </div>
            }
          >
            <div />
          </InfoBlock>
        )}

        {qualification.examPrograms.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.examPrograms}
              </Heading>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualification.examPrograms.map((program) => (
                <ServiceCard
                  key={program.id}
                  title={program.title}
                  description={program.description}
                  primaryButtonLabel={t.readMore}
                  primaryButtonHref={program.link || '#'}
                  labels={[]}
                  publicationDate={program.date}
                />
              ))}
            </div>
          </InfoBlock>
        )}

        {qualification.chapters.length > 0 && (
          <InfoBlock title={t.chaptersEvaluation} className="mt-12 p-0">
            <div className="space-y-3 py-6">
              {qualification.chapters.map((ch, index) => (
                <ExpandableTab
                  variant="minimal"
                  key={ch.id}
                  title={
                    <div>
                      {/* <span className="text-sm text-neutral-500 font-medium">{ch.title}</span> */}
                      <div className="text-lg font-medium text-neutral-900">
                        {index + 1}. {ch.subtitle}
                      </div>
                    </div>
                  }
                  description={ch.description}
                  isExpanded={openChapter === ch.id}
                  onToggle={() => setOpenChapter(openChapter === ch.id ? null : ch.id)}
                  className="!bg-white shadow-sm !border-neutral-200"
                />
              ))}
            </div>
          </InfoBlock>
        )}
      </DetailPageLayout>

      {/* Related Services Section */}
      {relatedQualifications.length > 0 && (
        <Section background="white" padding="large">
          <div className="max-w-screen-xl mx-auto lg:px-0">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
              <div className="lg:w-[411px] lg:shrink-0 flex flex-col gap-6">
                <Heading
                  as="h2"
                  size="h2"
                  className="text-[48px] leading-[60px] tracking-[-0.96px]"
                >
                  {t.relatedServices}
                </Heading>
                <p className="text-[18px] leading-[28px] text-[#384250]">{t.shortDescription}</p>
                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={() => scrollCarousel('left')}
                    disabled={!canScrollPrev}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${canScrollPrev
                        ? 'bg-primary-700 text-white hover:bg-primary-800 cursor-pointer'
                        : 'bg-[#e5e7eb] text-[#9aa4b2] cursor-not-allowed'
                      }`}
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    disabled={!canScrollNext}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${canScrollNext
                        ? 'bg-primary-700 text-white hover:bg-primary-800 cursor-pointer'
                        : 'bg-[#e5e7eb] text-[#9aa4b2] cursor-not-allowed'
                      }`}
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {relatedQualifications.map((service) => {
                    const detailsHref = `/services/ip-academy/qualifications/${service.id}`;
                    const labels = service.category ? [service.category] : [];

                    return (
                      <ServiceCard
                        key={service.id}
                        title={service.title}
                        description={service.description}
                        variant="services"
                        primaryButtonLabel={t.readMore}
                        primaryButtonHref={detailsHref}
                        labels={labels}
                        className="h-[318px] w-[410px] max-w-[410px] shrink-0"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Comments & Suggestions Section */}
      <Section background="white" padding="large">
        <div className="max-w-7xl mx-auto">
          <CommentsAndSuggestionsSection
            title={tCommons('commentsAndSuggestions') || 'Comments & suggestions'}
            description={
              tCommons('commentsAndSuggestionsDesc') ||
              'For any inquiry or feedback on Government Services, please fill the required information.'
            }
            buttonLabel={tCommons('contactUs') || 'Contact us'}
            buttonHref={ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT}
          />
        </div>
      </Section>

      {/* Feedback Section */}
      <FeedbackSection />
    </main>
  );
}
