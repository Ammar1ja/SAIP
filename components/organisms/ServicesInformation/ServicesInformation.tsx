import TabVertical from '@/components/molecules/TabVertical';
import PhotoContainer from '@/components/molecules/PhotoContainer';
import ExpandableTabGroup from '@/components/molecules/ExpandableTabGroup';
import Heading from '@/components/atoms/Heading';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export type VerticalTab = { id: string; label: string };

export type VerticalTabData = {
  id: string;
  title: string;
  description: ReactNode;
  image?: { src: string; alt: string };
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
  buttonLabel2?: string;
  buttonHref2?: string;
  buttonAriaLabel2?: string;
};

interface ServicesInformationProps {
  tabs: VerticalTab[];
  data: VerticalTabData[];
  activeTab: string;
  onTabChange: (id: string) => void;
  title?: string;
  description?: string;
  showHeader?: boolean;
  tabsContainerClassName?: string;
  photoContainerClassName?: string;
  photoImageClassName?: string;
  photoContentClassName?: string;
  photoDescriptionClassName?: string;
  headerDescriptionClassName?: string;
}

const ServicesInformation = ({
  tabs,
  data,
  activeTab,
  onTabChange,
  title,
  description,
  showHeader = true,
  tabsContainerClassName,
  photoContainerClassName,
  photoImageClassName,
  photoContentClassName,
  photoDescriptionClassName,
  headerDescriptionClassName,
}: ServicesInformationProps) => {
  const t = useTranslations('servicesOverview.nav');
  const tButtons = useTranslations('buttons');

  const activeTabData = data.find((tab) => tab.id === activeTab);
  const resolveImage = (image?: { src: string; alt: string }, title?: string) => {
    if (image?.src) {
      return image;
    }
    return title ? { src: '/images/photo-container.png', alt: title } : undefined;
  };
  const resolvedActiveImage = resolveImage(activeTabData?.image, activeTabData?.title);

  // First button (label + href)
  const buttonLabel =
    activeTabData?.buttonLabel === 'Read More'
      ? tButtons('readMore')
      : activeTabData?.buttonLabel || undefined;

  const buttonHref =
    activeTabData?.buttonHref && activeTabData.buttonHref !== '#'
      ? activeTabData.buttonHref
      : undefined;

  // Second button (label + href)
  const buttonLabel2 =
    activeTabData?.buttonLabel2 === 'View file'
      ? tButtons('viewFile')
      : activeTabData?.buttonLabel2;

  const buttonHref2 =
    activeTabData?.buttonHref2 && activeTabData.buttonHref2 !== '#'
      ? activeTabData.buttonHref2
      : undefined;

  return (
    <>
      {showHeader && (
        <>
          <Heading
            as="h2"
            size="custom"
            weight="medium"
            color="default"
            className="pb-12 font-body text-[30px] leading-[38px] tracking-[-0.02em] text-text-default sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px]"
          >
            {title || t('infoYouNeed')}
          </Heading>
          <p
            className={twMerge(
              'max-w-[500px] pb-6 text-md text-neutral-500',
              headerDescriptionClassName,
            )}
          >
            {description || t('infoDescription')}
          </p>
        </>
      )}
      {/* Desktop version */}
      <div className="hidden lg:block">
        <div className="flex gap-8">
          <div className={tabsContainerClassName || 'w-[280px] shrink-0'}>
            <TabVertical
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              ariaLabel="Services navigation"
            />
          </div>
          <div className="min-w-0 flex-1">
            <PhotoContainer
              title={activeTabData?.title}
              description={activeTabData?.description || ''}
              image={resolvedActiveImage}
              className={photoContainerClassName}
              buttonLabel={buttonLabel}
              buttonHref={buttonHref}
              buttonAriaLabel={activeTabData?.buttonAriaLabel || buttonLabel}
              buttonLabel2={buttonLabel2}
              buttonHref2={buttonHref2}
              buttonAriaLabel2={activeTabData?.buttonAriaLabel2 || buttonLabel2}
              imageClassName={photoImageClassName}
              contentClassName={photoContentClassName}
              descriptionClassName={photoDescriptionClassName}
            />
          </div>
        </div>
      </div>
      {/* Mobile version */}
      <div className="lg:hidden">
        <ExpandableTabGroup
          items={data.map((item) => ({
            ...item,
            description: typeof item.description === 'string' ? item.description : '',
            image: resolveImage(item.image, item.title),
            buttonLabel: item.buttonLabel,
            buttonHref: item.buttonHref,
            buttonAriaLabel: item.buttonAriaLabel,
            buttonLabel2: item.buttonLabel2,
            buttonHref2: item.buttonHref2,
            buttonAriaLabel2: item.buttonAriaLabel2,
          }))}
          activeId={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </>
  );
};

export default ServicesInformation;
