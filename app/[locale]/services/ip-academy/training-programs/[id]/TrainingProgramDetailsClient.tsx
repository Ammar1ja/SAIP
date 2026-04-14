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
                  icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tTraining('fees'),
                  value: service.fees,
                },
                {
                  icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tTraining('location'),
                  value: service.location,
                },
                {
                  icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
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
