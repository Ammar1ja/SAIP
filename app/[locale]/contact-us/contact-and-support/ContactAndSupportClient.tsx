'use client';

import { ROUTES } from '@/lib/routes';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { Section } from '@/components/atoms/Section';
import InfoItem from '@/components/molecules/InfoItem';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import DocumentSection from '@/components/organisms/DocumentSection';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { HookForm } from '@/components/molecules/HookForm';
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import type { ContactSupportData } from '@/lib/drupal/services/contact-support.service';
import type { FormValues } from './ContactAndSupport.data';
import type { HookFormField } from '@/components/molecules/HookForm';
import { submitContactForm } from '@/app/actions/webform';
import FeedbackSection from '@/components/organisms/FeedbackSection';

interface ContactAndSupportClientProps {
  data: ContactSupportData;
}

export default function ContactAndSupportClient({ data }: ContactAndSupportClientProps) {
  const t = useTranslations('contactAndSupport');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    if (!text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / restricted contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1500);
    } catch {
      // no-op: clipboard might be blocked by browser permissions
    }
  };

  // Map contact item IDs to translation keys
  const getTitleTranslation = (id: string, fallback: string): string => {
    const translationMap: Record<string, string> = {
      'customer-service': t('contactInfo.customerService', { defaultValue: fallback }),
      'beneficiary-support': t('contactInfo.beneficiarySupport', { defaultValue: fallback }),
      'appointment-booking': t('contactInfo.appointmentBooking', { defaultValue: fallback }),
      'saip-location': t('contactInfo.location', { defaultValue: fallback }),
      'social-media': t('contactInfo.socialMedia', { defaultValue: fallback }),
    };
    return translationMap[id] || fallback;
  };

  // Map button labels to translations
  const getButtonTranslation = (id: string, fallback: string): string => {
    const buttonMap: Record<string, string> = {
      'beneficiary-support': t('contactCards.goToBeneficiarySupport', { defaultValue: fallback }),
      'appointment-booking': t('contactCards.bookYourAppointment', { defaultValue: fallback }),
    };
    return buttonMap[id] || fallback;
  };

  const handleSubmit = async (formValues: FormValues & { files?: File[] }) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const files = formValues.files || [];
      const hasFiles = files.length > 0;

      if (hasFiles) {
        // File objects cannot survive Server Action serialization.
        // Submit via the /api/webform proxy route using FormData instead.
        const formData = new FormData();
        formData.append('webform_id', 'contact_form');
        formData.append('full_name', formValues.fullName);
        formData.append('email', formValues.email);
        if (formValues.phoneNumber) formData.append('phone', formValues.phoneNumber);
        formData.append('subject', formValues.subject);
        formData.append('message', formValues.howCanWeHelp);
        files.forEach((file) => formData.append('attachments[]', file));

        const response = await fetch('/api/webform', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.data?.sid) {
          setSubmitStatus('success');
          setSubmitMessage(t('form.successMessage'));
        } else {
          setSubmitStatus('error');
          const errorMsg =
            result.data?.message ||
            (typeof result.data?.error === 'string'
              ? result.data.error
              : result.data?.error?.message) ||
            t('form.errorMessage');
          setSubmitMessage(errorMsg);
        }
      } else {
        // No files — Server Action works fine for plain JSON
        const result = await submitContactForm({
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phoneNumber,
          subject: formValues.subject,
          message: formValues.howCanWeHelp,
          files: [],
        });

        if (result.success) {
          setSubmitStatus('success');
          setSubmitMessage(t('form.successMessage'));
        } else {
          setSubmitStatus('error');
          setSubmitMessage(result.message || t('form.errorMessage'));
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(t('form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic form fields with translations
  const formFields: HookFormField[] = useMemo(
    () => [
      {
        id: 'fullName',
        label: t('form.fullName'),
        type: 'text',
        required: true,
        placeholder: t('form.fullNamePlaceholder'),
        helperText: t('form.fullNameHelper'),
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, { message: t('form.fullNameHelper') })
          .min(2, { message: t('form.fullNameHelper') }),
      },
      {
        id: 'email',
        label: t('form.email'),
        type: 'email',
        required: true,
        placeholder: t('form.emailPlaceholder'),
        helperText: t('form.emailHelper'),
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, { message: t('form.emailHelper') })
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: t('form.emailHelper') }),
      },
      {
        id: 'phoneNumber',
        label: t('form.phoneNumber'),
        type: 'tel',
        required: true,
        placeholder: t('form.phoneNumberPlaceholder'),
        helperText: t('form.phoneNumberHelper'),
        options: [
          { label: '+966', value: '+966' },
          { label: '+48', value: '+48' },
          { label: '+47', value: '+47' },
        ],
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, { message: t('form.phoneNumberHelper') }),
      },
      {
        id: 'subject',
        label: t('form.subject'),
        type: 'select',
        required: true,
        placeholder: t('form.subjectPlaceholder'),
        helperText: t('form.subjectHelper'),
        options: [
          { label: t('form.subjectOptions.general'), value: 'general' },
          { label: t('form.subjectOptions.support'), value: 'support' },
          { label: t('form.subjectOptions.feedback'), value: 'feedback' },
          { label: t('form.subjectOptions.complaint'), value: 'complaint' },
          { label: t('form.subjectOptions.other'), value: 'other' },
        ],
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, { message: t('form.subjectHelper') }),
      },
      {
        id: 'howCanWeHelp',
        label: t('form.howCanWeHelp'),
        type: 'textarea',
        required: true,
        placeholder: t('form.howCanWeHelpPlaceholder'),
        helperText: t('form.howCanWeHelpHelper'),
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, { message: t('form.howCanWeHelpHelper') })
          .min(10, { message: t('form.howCanWeHelpHelper') }),
      },
    ],
    [t],
  );

  const breadcrumbItems = [
    { label: tBreadcrumbs('home'), href: ROUTES.HOME },
    { label: tBreadcrumbs('contactUs') },
    { label: tBreadcrumbs('contactAndSupport') },
  ];

  const anchorItems = [
    { label: t('anchors.contactInformation'), href: '#contact-information' },
    { label: t('anchors.appointmentBooking'), href: '#appointment-booking' },
    { label: t('anchors.beneficiarySupport'), href: '#beneficiary-support' },
    { label: t('anchors.followUs'), href: '#follow-us' },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <section id="contact-information">
        <Section>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[640px_minmax(0,1fr)] lg:gap-x-[80px]">
            <div className="flex w-full flex-col gap-12 rounded-3xl bg-neutral-50 p-8 lg:w-[640px] lg:p-16">
              <h2 className="w-[480px] max-w-full font-body text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px]">
                {data.contactInfoHeading}
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* Render contact information dynamically from Drupal */}
                {data.contactInformation.map((item) => {
                  const translatedTitle = getTitleTranslation(item.id, item.title);

                  return (
                    <div key={item.id}>
                      <InfoItem alt={translatedTitle} title={translatedTitle} icon={item.icon}>
                        {/* Phone number with link */}
                        {item.linkLabel && item.linkHref && (
                          <div className="flex items-center gap-2">
                            <Link
                              href={item.linkHref}
                              className="text-sm text-text-primary-paragraph underline"
                            >
                              {item.linkLabel}
                            </Link>
                            <Button
                              ariaLabel={copiedKey === `${item.id}-copy` ? 'Copied' : 'Copy'}
                              intent="secondary"
                              outline
                              onClick={() =>
                                copyToClipboard(item.linkLabel || '', `${item.id}-copy`)
                              }
                              size="sm"
                              className="md:hidden w-8 h-8 p-0 flex items-center justify-center !rounded-sm"
                            >
                              {copiedKey === `${item.id}-copy` ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Availability hours */}
                        {item.availability && item.availability.length > 0 && (
                          <div className="text-xs md:text-sm">
                            {item.availability.map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                          </div>
                        )}

                        {/* Button (for Beneficiary/Appointment) */}
                        {item.buttonLabel && item.buttonHref && (
                          <Button
                            ariaLabel={getButtonTranslation(item.id, item.buttonLabel)}
                            intent="secondary"
                            outline
                            href={item.buttonHref}
                            size="sm"
                            className="text-xs w-full md:w-auto"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <ExternalLink className="w-4 h-4" />
                              {getButtonTranslation(item.id, item.buttonLabel)}
                            </span>
                          </Button>
                        )}

                        {/* Location address */}
                        {item.locationAddress && item.locationAddress.length > 0 && (
                          <div className="relative text-xs md:text-sm text-text-primary-paragraph ltr:pr-12 rtl:pl-12">
                            {item.locationAddress.map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                            <Button
                              ariaLabel={copiedKey === `${item.id}-copy` ? 'Copied' : 'Copy'}
                              intent="secondary"
                              outline
                              onClick={() =>
                                copyToClipboard(
                                  (item.locationAddress || []).join('\n'),
                                  `${item.id}-copy`,
                                )
                              }
                              size="sm"
                              className="md:hidden absolute top-0 ltr:right-0 rtl:left-0 w-8 h-8 p-0 flex items-center justify-center !rounded-sm"
                            >
                              {copiedKey === `${item.id}-copy` ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Social media icons */}
                        {item.socialMedia && item.socialMedia.length > 0 && (
                          <div className="flex w-full max-w-full flex-wrap gap-4">
                            {item.socialMedia.map((mediaItem) => (
                              <Button
                                key={mediaItem.ariaLabel}
                                ariaLabel={mediaItem.ariaLabel}
                                intent="secondary"
                                outline
                                href={mediaItem.href}
                                size="sm"
                                className="w-10 h-10 min-w-10 min-h-10 p-0 flex items-center justify-center !rounded-sm"
                              >
                                <img
                                  src={mediaItem.icon}
                                  alt={mediaItem.ariaLabel}
                                  className="w-6 h-6"
                                />
                              </Button>
                            ))}
                          </div>
                        )}
                      </InfoItem>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col space-y-4 md:space-y-6 mt-8 lg:mt-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-text-default">
                {data.formHeading}
              </h2>
              {submitStatus === 'success' ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{submitMessage}</p>
                </div>
              ) : (
                <>
                  <HookForm
                    fields={formFields}
                    onSubmit={handleSubmit}
                    submitLabel={isSubmitting ? t('form.submitting') : t('buttons.sendRequest')}
                    uploadFiles
                    wrapped={false}
                    className="[&_input]:text-sm [&_textarea]:text-sm [&_select]:text-sm [&_label]:text-sm [&_input]:shadow-none [&_textarea]:shadow-none [&_select]:shadow-none [&_input]:rtl:text-right [&_textarea]:rtl:text-right [&_select]:rtl:text-right [&_label]:rtl:text-right [&_*]:shadow-none"
                  />
                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{submitMessage}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Section>
      </section>
      <section id="appointment-booking">
        <DocumentSection
          heading={data.appointmentBooking.heading}
          description={data.appointmentBooking.description}
          image={data.appointmentBooking.image}
          buttons={[
            {
              label: t('buttons.bookAppointment'),
              href: data.appointmentBooking.buttonHref || '#',
              intent: 'primary',
              icon: <ExternalLink className="w-5 h-5" />,
            },
          ]}
          className="bg-white"
        />
      </section>
      <section id="beneficiary-support">
        <div className="mx-auto py-4 md:py-8 lg:py-12">
          <DocumentSection
            heading={data.beneficiarySupport.heading}
            description={
              Array.isArray(data.beneficiarySupport.description) ? (
                <div className="space-y-3">
                  {data.beneficiarySupport.description.map((desc) => (
                    <p key={desc}>{desc}</p>
                  ))}
                </div>
              ) : (
                data.beneficiarySupport.description
              )
            }
            image={{
              ...data.beneficiarySupport.image,
              className: `object-cover ${data.beneficiarySupport.image?.className || ''} rounded-none md:rounded-2xl`,
            }}
            imagePosition="left"
            buttons={[
              {
                label: t('buttons.goToBeneficiary'),
                href: data.beneficiarySupport.buttonHref || '#',
                intent: 'primary',
                icon: <ExternalLink className="w-5 h-5" />,
              },
            ]}
            background="primary-50"
          />
        </div>
      </section>
      <section id="follow-us">
        <Section>
          <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-12">
            <h2 className="w-full self-stretch font-body text-[30px] leading-[38px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px] font-medium tracking-[-0.02em] text-text-default text-center">
              {data.socialHeading}
            </h2>
            <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:flex-nowrap lg:gap-16">
              {data.followUs.map((mediaItem) => (
                <Button
                  key={mediaItem.ariaLabel}
                  ariaLabel={mediaItem.ariaLabel}
                  intent="secondary"
                  outline
                  href={mediaItem.href}
                  className="w-10 h-10 min-w-10 min-h-10 p-0 flex items-center justify-center !rounded-sm"
                >
                  <img src={mediaItem.icon} alt={mediaItem.ariaLabel} className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>
        </Section>
      </section>
      <FeedbackSection />
    </>
  );
}
