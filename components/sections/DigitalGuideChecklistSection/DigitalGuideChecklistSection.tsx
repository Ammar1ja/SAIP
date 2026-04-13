'use client';

import DigitalGuideHeading, {
  type DigitalGuideHeadingProps,
} from '@/components/molecules/DigitalGuideHeading';
import Button from '@/components/atoms/Button';
import InlineAlert from '@/components/molecules/InlineAlert';
import { useChecklist } from '@/context/ChecklistContext';
import { useAlert } from '@/context/AlertContext';
import { useTranslations } from 'next-intl';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import { useRouter } from '@/i18n/navigation';

function DigitalGuideChecklistSection(props: DigitalGuideHeadingProps) {
  const t = useTranslations('digitalGuide.checkYourIdea');
  const { currentStep, steps, onAnswer } = useChecklist();
  const { alertContent, isOpen, closeAlert } = useAlert();
  const router = useRouter();
  const stepData = steps[currentStep];

  const handleBack = () => {
    if (currentStep > 0) {
      router.back();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full gap-8">
        <DigitalGuideHeading {...props} />
        <section className="overflow-hidden flex-1 p-6 md:p-8 rounded-3xl border border-neutral-secondary bg-white relative">
          <InlineAlert
            className="w-full xl:absolute xl:bottom-8 xl:left-1/2 xl:-translate-x-1/2 xl:w-[52rem] xl:max-w-[52rem] mb-4 md:mb-6 xl:mb-0"
            variant="info"
            emphasized
            alertContent={alertContent}
            isOpen={isOpen}
            onClose={closeAlert}
          />
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_39rem)] xl:grid-cols-[39rem_1fr] gap-8 xl:gap-12 h-full">
            <div className="space-y-4 overflow-y-auto overscroll-contain flex flex-col">
              <div className="flex-1 space-y-4">{stepData.content}</div>
              <div className="hidden md:flex justify-start pt-4">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    aria-label={t('goBack')}
                    className="w-10 h-10 flex items-center justify-center bg-black rounded-sm flex-shrink-0"
                  >
                    <ArrowWide
                      direction="left"
                      size="small"
                      shape="square"
                      background="none"
                      className="text-white [&_svg_path]:fill-white"
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-end relative z-10">
              <div className="flex gap-4 items-center justify-end">
                <Button
                  ariaLabel={t('answerYes')}
                  intent="primary"
                  fullWidth
                  onClick={() => {
                    if (stepData?.onYes) {
                      onAnswer(stepData.onYes);
                    }
                  }}
                >
                  {t('yes')}
                </Button>
                <Button
                  ariaLabel={t('answerNo')}
                  intent="primary"
                  fullWidth
                  onClick={() => {
                    if (stepData?.onNo) {
                      onAnswer(stepData.onNo);
                    }
                  }}
                >
                  {t('no')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DigitalGuideChecklistSection;
