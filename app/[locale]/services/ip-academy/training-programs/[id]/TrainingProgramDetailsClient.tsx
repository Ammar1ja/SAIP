'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { ROUTES } from '@/lib/routes';
import Section from '@/components/atoms/Section';
import {
  AddNoteIcon,
  CirclePlusIcon,
  CircleInfoIcon,
  LocationPinIcon,
  PatentDocIcon,
} from '@/components/icons/services';
import { UsersIcon } from '@/components/icons/strategy/UsersIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import DetailPageLayout from '@/components/layouts/DetailPageLayout';
import InfoBlock from '@/components/molecules/InfoBlock';
import Heading from '@/components/atoms/Heading';
import Label from '@/components/atoms/Label/Label';
import { ExpandableTab } from '@/components/molecules/ExpandableTab/ExpandableTab';
import { TrainingProgramData } from '@/lib/drupal/services/ip-academy.service';
import CommentsAndSuggestionsSection from '@/components/organisms/CommentsAndSuggestionsSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection/RelatedServicesSection';
import { TrainingProgram } from '@/components/sections/TrainingProgramsSection/TrainingProgramsSection.types';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.png';
import Calendar from '@/assets/images/calendar.png';
import Location from '@/assets/images/location.png';
import Riyal from '@/assets/images/Riyal.png';
import User from '@/assets/images/user.png';
import Watch from '@/assets/images/watch.png';
interface TrainingProgramDetailsClientProps {
  program: TrainingProgramData;
  relatedPrograms?: TrainingProgram[];
  translations: {
    breadcrumbs: {
      home: string;
      services: string;
      ipEnablement: string;
      ipAcademy: string;
      trainingPrograms: string;
    };
    labels: {
      ipAcademy: string;
      ipEnablement: string;
    };
    goBack: string;
    detailsTitle: string;
    forWhom: string;
    whatYouWillLearn: string;
    courseFormat: string;
    courseMaterials: string;
    courseProgramme: string;
    relatedServicesTitle: string;
    relatedServicesDescription: string;
    commentsAndSuggestions: string;
    commentsAndSuggestionsDesc: string;
    contactUs: string;
    sidebar: {
      startDate: string;
      duration: string;
      fees: string;
      language: string;
      location: string;
      faqLabel: string;
      registerLabel: string;
    };
  };
}

export default function TrainingProgramDetailsClient({
  program,
  relatedPrograms = [],
  translations: t,
}: TrainingProgramDetailsClientProps) {
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const tTraining = useTranslations('ipAcademy.training');
  const locale = useLocale();

  const withLocale = (href: string | undefined) => {
    if (!href) return href;
    if (href.startsWith('http')) return href;
    if (href.startsWith('/api/')) return href;
    if (locale === 'en') return href.startsWith('/') ? href : `/${href}`;
    if (href.startsWith(`/${locale}/`)) return href;
    return href.startsWith('/') ? `/${locale}${href}` : `/${locale}/${href}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const registerHelperText =
    program.registerNote?.trim() ||
    (program.startDate
      ? `Register to secure your spot in the course starting on ${formatDate(program.startDate)}`
      : undefined);

  const renderCourseFormat = (text: string) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return (
      <div className="space-y-3 text-[#384250]">
        {lines.map((line, index) => {
          const parts = line.split(':');
          if (parts.length > 1) {
            const [label, ...rest] = parts;
            return (
              <p key={`${label}-${index}`}>
                <span className="font-medium text-[#1f2a37]">{label}:</span> {rest.join(':').trim()}
              </p>
            );
          }

          return <p key={`${line}-${index}`}>{line}</p>;
        })}
      </div>
    );
  };

  const renderCourseMaterials = (text: string) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const bulletLines = lines.filter((line) => line.startsWith('-') || line.startsWith('•'));
    const paragraphs = lines.filter((line) => !line.startsWith('-') && !line.startsWith('•'));

    return (
      <div className="space-y-3 text-[#384250]">
        {paragraphs.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
        {bulletLines.length > 0 && (
          <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2">
            {bulletLines.map((line, index) => (
              <li key={`${line}-${index}`}>{line.replace(/^[-•]\s*/, '')}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  const isRtl = locale === 'ar' ? true : false;
  const RiyalFigmaIcon = ({ className = 'text-white' }: { className?: string }) => (
    <svg viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M11.2025 17.7177C10.8813 18.4258 10.669 19.1942 10.5876 20L17.385 18.5635C17.7062 17.8556 17.9183 17.0871 17.9998 16.2812L11.2025 17.7177Z"
        fill="currentColor"
      />
      <path
        d="M17.385 14.2599C17.7062 13.552 17.9185 12.7835 17.9998 11.9776L12.7049 13.0972V10.945L17.3848 9.9563C17.706 9.2484 17.9183 8.47985 17.9997 7.67405L12.7048 8.79265V1.0527C11.8934 1.50558 11.1729 2.10842 10.5871 2.81951V9.24028L8.46951 9.68776V0C7.65817 0.452726 6.93762 1.05572 6.3519 1.76681V10.1351L1.61371 11.136C1.29251 11.8439 1.08003 12.6125 0.998523 13.4183L6.3519 12.2873V14.9976L0.61471 16.2096C0.293504 16.9175 0.0811821 17.6861 -0.000160122 18.4919L6.00507 17.2232C6.49392 17.1221 6.91409 16.8347 7.18725 16.4393L8.28858 14.8161V14.8158C8.4029 14.6478 8.46951 14.4454 8.46951 14.2273V11.8398L10.5871 11.3923V15.6967L17.3848 14.2596L17.385 14.2599Z"
        fill="currentColor"
      />
    </svg>
  );
  const LocationFigmaIcon = ({ className = 'text-white' }: { className?: string }) => (
    <svg
      viewBox="0 0 16.1839 19.4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15.9454 6.29C14.9954 1.95 11.3054 0 8.08535 0C4.86535 0 1.18535 1.94 0.225353 6.28C-0.824647 11.08 1.99535 15.11 4.53535 17.64C5.66535 18.81 6.86535 19.4 8.08535 19.4C9.30535 19.4 10.4954 18.81 11.6254 17.65C14.1854 15.12 17.0154 11.1 15.9554 6.3L15.9454 6.29ZM10.8354 16.87C8.99535 18.76 7.16535 18.77 5.31535 16.87C2.95535 14.53 0.345353 10.83 1.29535 6.52C2.17535 2.52 5.50535 1.11 8.08535 1.11C10.6654 1.11 13.9954 2.53 14.8754 6.53C15.8254 10.84 13.2054 14.53 10.8354 16.87Z"
        fill="currentColor"
      />
      <path
        d="M8.08535 6.52C6.87535 6.52 5.89535 7.5 5.89535 8.71C5.89535 9.92 6.87535 10.9 8.08535 10.9C9.29535 10.9 10.2754 9.92 10.2754 8.71C10.2754 7.5 9.29535 6.52 8.08535 6.52ZM8.08535 9.8C7.48535 9.8 7.00535 9.32 7.00535 8.72C7.00535 8.12 7.48535 7.64 8.08535 7.64C8.68535 7.64 9.16535 8.12 9.16535 8.72C9.16535 9.32 8.68535 9.8 8.08535 9.8Z"
        fill="currentColor"
      />
    </svg>
  );
  return (
    <main className="min-h-screen pb-0">
      <Section background="primary-50" padding="none" className="pt-10 pb-16">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: t.breadcrumbs.home, href: '/' },
            { label: t.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
            { label: t.breadcrumbs.ipEnablement },
            { label: t.breadcrumbs.ipAcademy, href: '/services/ip-academy' },
            {
              label: t.breadcrumbs.trainingPrograms,
              href: '/services/ip-academy?tab=training',
            },
            { label: program.title },
          ]}
        />
        <button
          className="cursor-pointer mb-8 px-3 h-8 border border-[#d2d6db] rounded-[4px] text-sm font-medium text-[#161616] hover:bg-neutral-100 transition inline-flex items-center gap-2"
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
          className="mb-4 !text-[72px] leading-[60px] md:text-[72px] md:leading-[90px] tracking-[-0.02em] font-medium text-[#161616]"
        >
          {program.title}
        </Heading>
        <div className="flex gap-2 mb-4">
          <Label size="sm" className="mb-0" variant="default">
            {t.labels.ipAcademy}
          </Label>
          <Label size="sm" className="mb-0" variant="default">
            {t.labels.ipEnablement}
          </Label>
        </div>
        <p className="text-[20px] leading-[30px] text-[#384250] mb-3 max-w-2xl">
          {program.description}
        </p>
        {program.details && (
          <p className="text-[20px] leading-[30px] text-[#384250] max-w-2xl">{program.details}</p>
        )}
      </Section>
      <DetailPageLayout
        sidebar={
          <DetailSidebar
            items={[
              {
                icon: <img src={Calendar.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.startDate,
                value: formatDate(program.startDate),
              },
              {
                icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.duration,
                value: program.duration,
              },
              {
                icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.fees,
                value: program.fees,
              },
              {
                icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.language,
                value: program.language,
              },
              {
                icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                label: t.sidebar.location,
                value: program.location,
              },
            ]}
            faqHref={program.faqHref}
            faqLabel={t.sidebar.faqLabel}
            primaryButtonLabel={t.sidebar.registerLabel}
            primaryButtonHref={withLocale(program.registerHref)}
            primaryButtonAriaLabel={t.sidebar.registerLabel}
            primaryButtonHelperText={registerHelperText}
            className="shadow-none border-[#d2d6db] rounded-2xl p-10"
          />
        }
        sectionProps={{ background: 'white', padding: 'default' }}
        sidebarClassName="lg:w-[411px]"
        className="lg:gap-16"
      >
        <Heading as="h2" size="h2" className="mb-6 text-[48px] leading-[60px] text-[#161616]">
          {t.detailsTitle}
        </Heading>
        {program.forWhom && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.forWhom}
              </Heading>
            }
            className="shadow-none border-[#d2d6db] rounded-2xl"
          >
            <p className="text-[#384250]">{program.forWhom}</p>
          </InfoBlock>
        )}

        {program.whatYouWillLearn.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.whatYouWillLearn}
              </Heading>
            }
            className="shadow-none border-[#d2d6db] rounded-2xl"
          >
            <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-[#384250]">
              {program.whatYouWillLearn.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </InfoBlock>
        )}

        {program.courseFormat && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.courseFormat}
              </Heading>
            }
            className="shadow-none border-[#d2d6db] rounded-2xl"
          >
            {renderCourseFormat(program.courseFormat)}
          </InfoBlock>
        )}

        {program.courseMaterials && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.courseMaterials}
              </Heading>
            }
            className="shadow-none border-[#d2d6db] rounded-2xl"
          >
            {renderCourseMaterials(program.courseMaterials)}
          </InfoBlock>
        )}

        {program.programme.length > 0 && (
          <InfoBlock
            title={
              <Heading as="h4" size="h4">
                {t.courseProgramme}
              </Heading>
            }
            className="shadow-none border-[#d2d6db] rounded-2xl"
          >
            <div className="space-y-3 py-6">
              {program.programme.map((course, index) => (
                <ExpandableTab
                  variant="minimal"
                  key={course.id}
                  title={
                    <div>
                      {/* <span className="text-sm text-neutral-500 font-medium">{course.title}</span> */}
                      <div className="text-lg font-medium text-neutral-900">
                        {index + 1}. {course.subtitle}
                      </div>
                    </div>
                  }
                  description={course.description}
                  isExpanded={openCourse === course.id}
                  onToggle={() => setOpenCourse(openCourse === course.id ? null : course.id)}
                  className="!bg-white shadow-sm !border-neutral-200"
                />
              ))}
            </div>
          </InfoBlock>
        )}
      </DetailPageLayout>

      {relatedPrograms.length > 0 && (
        <RelatedServicesSection
          title={program.relatedServicesTitle || t.relatedServicesTitle}
          description={program.relatedServicesDescription || t.relatedServicesDescription}
          services={relatedPrograms.map((service) => {
            const dateValue = service.time ? [service.time, service.date] : service.date;

            return {
              title: service.title,
              variant: 'training',
              details: [
                {
                  icon: <AddNoteIcon className="w-4 h-4 text-white" />,
                  label: tTraining('date'),
                  value: dateValue,
                },
                {
                  icon: <PatentDocIcon className="w-4 h-4 text-white" />,
                  label: tTraining('category'),
                  value: service.category,
                },
                {
                  icon: <BookIcon className="w-4 h-4 text-white" />,
                  label: tTraining('duration'),
                  value: service.duration,
                },
                {
                  icon: <RiyalFigmaIcon className="w-6 h-6 !text-white" />,
                  label: tTraining('fees'),
                  value: service.fees,
                },
                {
                  icon: <LocationFigmaIcon className="w-6 h-6 !text-white" />,
                  label: tTraining('location'),
                  value: service.location,
                },
                {
                  icon: (
                    <img
                      src={'/icons/highlights/agent.svg'}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  ),
                  label: tTraining('hosts'),
                  value: service.host,
                },
              ],
              primaryButtonLabel: t.sidebar.registerLabel,
              primaryButtonHref: withLocale(service.registerHref),
              secondaryButtonLabel: tTraining('viewDetails'),
              secondaryButtonHref: withLocale(
                `/services/ip-academy/training-programs/${service.id}`,
              ),
            };
          })}
        />
      )}

      {/* Comments & Suggestions */}
      <Section background="white" padding="large">
        <div className="max-w-7xl mx-auto">
          <CommentsAndSuggestionsSection
            title={t.commentsAndSuggestions}
            description={t.commentsAndSuggestionsDesc}
            buttonLabel={t.contactUs}
            buttonHref={ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT}
          />
        </div>
      </Section>

      {/* Feedback Section */}
      <FeedbackSection pageTitle={program.title} />
    </main>
  );
}
