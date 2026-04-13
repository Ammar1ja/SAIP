'use client';

import BlurredCard from '@/components/molecules/BlurredCard';
import { missionVision as fallbackMissionVision } from './MissionAndVision.data';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface MissionAndVisionProps {
  mission?: string;
  vision?: string;
  missionTitle?: string; // ✅ NEW: Editable title from Drupal
  visionTitle?: string; // ✅ NEW: Editable title from Drupal
}

export const MissionAndVision = ({
  mission,
  vision,
  missionTitle,
  visionTitle,
}: MissionAndVisionProps) => {
  const t = useTranslations('about');

  // ✅ Use Drupal title if available, fallback to i18n
  const missionVision =
    mission && vision
      ? [
          { title: missionTitle || t('mission'), description: mission },
          { title: visionTitle || t('vision'), description: vision },
        ]
      : fallbackMissionVision;
  return (
    <section className="relative z-20 overflow-hidden mb-[-140px]">
      <div className="w-full max-w-[1280px] px-4 mx-auto">
        <h2 className="text-left md:text-center mb-12 font-medium text-5xl leading-[60px] tracking-[-0.96px]">
          {t('nav.missionVision')}
        </h2>

        <div className="hidden md:block relative w-full max-w-[1062px] mx-auto h-auto mb-[80px]">
          <div className="relative w-full pb-[49%] rounded-[32px] overflow-hidden">
            <Image
              src="/images/about/missionvision.png"
              alt="Mission Vision Background"
              fill
              className="object-cover object-center"
            />

            <div className="absolute inset-0 flex items-center justify-end rtl:justify-start p-4 sm:p-8">
              <div className="w-full max-w-[450px] space-y-5">
                {missionVision.map((item) => (
                  <BlurredCard
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    className="border-0"
                    variant="mission"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-6 mb-26">
          {missionVision.map((item) => (
            <BlurredCard
              key={item.title}
              title={item.title}
              description={item.description}
              className="border-0"
              variant="mission"
              contentClassName="space-y-2"
              titleClassName="text-[30px] leading-[38px] font-medium"
              descriptionClassName="text-[16px] leading-[24px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
