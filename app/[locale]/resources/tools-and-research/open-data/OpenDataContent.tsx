'use client';

import { useState } from 'react';
import Section from '@/components/atoms/Section';
import DocumentSection from '@/components/organisms/DocumentSection';
import { Form } from '@/components/molecules/Form';
import { OpenDataData } from '@/lib/drupal/services/open-data.service';
import { submitOpenDataRequest } from '@/app/actions/webform';
import { useTranslations, useLocale } from 'next-intl';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { Download } from 'lucide-react';

interface OpenDataContentProps {
  data: OpenDataData;
}

export function OpenDataContent({ data }: OpenDataContentProps) {
  const [formValues, setFormValues] = useState<Record<string, string | boolean | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const t = useTranslations('openData');
  const locale = useLocale();

  const handleFormChange = (fieldId: string, value: string | boolean | string[]) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = async (values: Record<string, string | boolean | string[]>) => {
    // Validate acknowledgement checkbox
    if (!values.acknowledgement) {
      setSubmitStatus('error');
      setSubmitMessage(
        locale === 'ar'
          ? 'يجب الموافقة على سياسة الخصوصية والاستخدام'
          : 'Please confirm that you have read and agreed to the privacy and usage policy',
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      console.log('📤 OPEN DATA: Submitting request...', {
        fullName: String(values.fullName || ''),
        email: String(values.email || ''),
        hasAcknowledgement: !!values.acknowledgement,
      });

      const result = await submitOpenDataRequest({
        fullName: String(values.fullName || ''),
        email: String(values.email || ''),
        phoneNumber: String(values.phoneNumber || ''),
        requestDetails: String(values.requestDetails || ''),
        purpose: String(values.purpose || ''),
      });

      console.log('✅ OPEN DATA: Result received', result);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(t('form.successMessage'));
        setFormValues({});
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || t('form.errorMessage'));
      }
    } catch (error) {
      console.error('❌ OPEN DATA: Error', error);
      setSubmitStatus('error');
      setSubmitMessage(t('form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="saip-policy">
        <DocumentSection
          heading={data.saipPolicy.heading}
          description={data.saipPolicy.description}
          variant="buttons-only"
          background="white"
          buttons={[
            {
              label: data.saipPolicy.viewButtonLabel,
              href: data.saipPolicy.viewButtonHref,
              ariaLabel: data.saipPolicy.viewButtonLabel,
              icon: <img src="/icons/eyes.svg" alt="" aria-hidden className="h-[19px] w-[19px]" />,
              intent: 'secondary',
              outline: true,
              className:
                '!h-10 !min-h-10 !max-h-10 !w-[299px] !max-w-full !rounded-sm !px-4 !py-0 !gap-2',
            },
            {
              label: data.saipPolicy.downloadButtonLabel,
              href: data.saipPolicy.downloadButtonHref,
              ariaLabel: data.saipPolicy.downloadButtonLabel,
              icon: <Download className="h-[19px] w-[19px] shrink-0" aria-hidden />,
              intent: 'primary',
              className:
                '!h-10 !min-h-10 !max-h-10 !w-[299px] !max-w-full !rounded-sm !px-4 !py-0 !gap-2',
            },
          ]}
        />
      </section>

      <section id="national-platform">
        <DocumentSection
          heading={data.nationalPlatform.heading}
          description={data.nationalPlatform.description}
          alignEnabled
          alignDirection="auto"
          background="primary-50"
          buttons={[
            {
              label: data.nationalPlatform.buttonLabel,
              href: data.nationalPlatform.buttonHref,
              ariaLabel: data.nationalPlatform.buttonLabel,
              icon: <img src="/icons/share.svg" alt="" aria-hidden className="h-5 w-5 shrink-0" />,
              intent: 'primary',
              size: 'mdWide',
              target: '_blank',
              className:
                '!h-10 !min-h-10 !max-h-10 !w-[309px] !max-w-full !rounded-sm !px-[18px] !py-0 !gap-2',
            },
          ]}
          image={{
            src: data.nationalPlatform.image.src,
            alt: data.nationalPlatform.image.alt,
            aspect: 'aspect-[3/2] lg:aspect-[708/474]',
          }}
        />
      </section>

      <section id="request-data">
        <Section
          columns="two"
          className="gap-12 lg:grid-cols-[minmax(0,1fr)_736px] lg:gap-x-8 lg:gap-y-0"
        >
          <h2 className="text-3xl font-medium text-gray-900 md:text-4xl lg:text-5xl">
            {data.requestForm.heading}
          </h2>

          {submitStatus === 'success' ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <p className="text-lg font-medium text-green-800">{submitMessage}</p>
            </div>
          ) : (
            <div className="min-w-0 space-y-4">
              <Form
                fields={data.requestForm.fields}
                values={formValues}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                submitLabel={isSubmitting ? t('form.submitting') : data.requestForm.submitLabel}
                submitIntent="primary"
                columns={1}
              />
              {submitStatus === 'error' && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-red-800">{submitMessage}</p>
                </div>
              )}
            </div>
          )}
        </Section>
      </section>
      <FeedbackSection />
    </>
  );
}
