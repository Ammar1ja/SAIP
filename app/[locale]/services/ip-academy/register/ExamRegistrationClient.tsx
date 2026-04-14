'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import { DateSelect } from '@/components/molecules/Filters/DateSelect';
import { submitExamRegistration, submitCourseRegistration } from '@/app/actions/webform';
import { ROUTES } from '@/lib/routes';
import LeadingIcon from '@/assets/images/leading_icon.png';

interface ExamRegistrationClientProps {
  type: 'exam' | 'course';
  prefillName: string;
  translations: {
    breadcrumbs: {
      home: string;
      services: string;
      ipAcademy: string;
      register: string;
    };
    title: string;
    description: string;
    form: {
      fullName: string;
      email: string;
      phone: string;
      nationalId: string;
      examType: string;
      preferredDate: string;
      preferredLocation: string;
      specialRequirements: string;
      organization: string;
      jobTitle: string;
      courseName: string;
      attendanceMode: string;
      additionalInfo: string;
      terms: string;
      submit: string;
    };
    options: {
      examTypes: Record<string, string>;
      locations: Record<string, string>;
      attendanceModes: Record<string, string>;
    };
    success: string;
    error: string;
  };
}

export default function ExamRegistrationClient({
  type,
  prefillName,
  translations: t,
}: ExamRegistrationClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    try {
      let result;

      if (type === 'exam') {
        result = await submitExamRegistration({
          fullName: formData.get('fullName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          nationalId: formData.get('nationalId') as string,
          examType: formData.get('examType') as string,
          preferredDate: formData.get('preferredDate') as string,
          preferredLocation: formData.get('preferredLocation') as string,
          specialRequirements: formData.get('specialRequirements') as string,
        });
      } else {
        result = await submitCourseRegistration({
          fullName: formData.get('fullName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          organization: formData.get('organization') as string,
          jobTitle: formData.get('jobTitle') as string,
          courseName: prefillName || (formData.get('courseName') as string),
          preferredDate: formData.get('preferredDate') as string,
          attendanceMode: formData.get('attendanceMode') as string,
          additionalInfo: formData.get('additionalInfo') as string,
        });
      }

      if (result.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || t.error);
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-2';
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: t.breadcrumbs.home, href: '/' },
            { label: t.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
            { label: t.breadcrumbs.ipAcademy, href: '/services/ip-academy' },
            { label: t.breadcrumbs.register },
          ]}
        />
        <button
          className="cursor-pointer mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
          onClick={() => router.back()}
        >
          <img
    src={LeadingIcon.src}
    alt=""
    className={`w-4 h-4 object-contain ${isRtl ? 'rotate-180 ml-2' : 'rotate-0 mr-2'}`}
  />{' '}
          Go back
        </button>
        <Heading as="h1" size="h1" className="mb-4">
          {t.title}
        </Heading>
        <p className="text-lg text-neutral-700 max-w-2xl">{t.description}</p>
      </Section>

      <Section background="white" padding="default">
        <div className="max-w-2xl mx-auto">
          {submitStatus === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <Heading as="h2" size="h3" className="text-green-800 mb-2">
                {t.success}
              </Heading>
              <Button
                intent="primary"
                ariaLabel="Back to IP Academy"
                onClick={() => router.push('/services/ip-academy')}
              >
                Back to IP Academy
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Common fields */}
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  {t.form.fullName} *
                </label>
                <input type="text" id="fullName" name="fullName" required className={inputClass} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t.form.email} *
                  </label>
                  <input type="email" id="email" name="email" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t.form.phone} *
                  </label>
                  <input type="tel" id="phone" name="phone" required className={inputClass} />
                </div>
              </div>

              {/* Exam-specific fields */}
              {type === 'exam' && (
                <>
                  <div>
                    <label htmlFor="nationalId" className={labelClass}>
                      {t.form.nationalId} *
                    </label>
                    <input
                      type="text"
                      id="nationalId"
                      name="nationalId"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="examType" className={labelClass}>
                        {t.form.examType} *
                      </label>
                      <select id="examType" name="examType" required className={inputClass}>
                        <option value="">Select...</option>
                        {Object.entries(t.options.examTypes).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="preferredLocation" className={labelClass}>
                        {t.form.preferredLocation} *
                      </label>
                      <select
                        id="preferredLocation"
                        name="preferredLocation"
                        required
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {Object.entries(t.options.locations).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <DateSelect
                      id="preferredDate"
                      label={`${t.form.preferredDate} *`}
                      value={preferredDate}
                      onChange={setPreferredDate}
                      placeholder={locale === 'ar' ? 'اختر التاريخ' : 'Select date'}
                      defaultToHijri={locale === 'ar'}
                    />
                    <input type="hidden" name="preferredDate" value={preferredDate} />
                  </div>

                  <div>
                    <label htmlFor="specialRequirements" className={labelClass}>
                      {t.form.specialRequirements}
                    </label>
                    <textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* Course-specific fields */}
              {type === 'course' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="organization" className={labelClass}>
                        {t.form.organization}
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="jobTitle" className={labelClass}>
                        {t.form.jobTitle}
                      </label>
                      <input type="text" id="jobTitle" name="jobTitle" className={inputClass} />
                    </div>
                  </div>

                  {!prefillName && (
                    <div>
                      <label htmlFor="courseName" className={labelClass}>
                        {t.form.courseName} *
                      </label>
                      <input
                        type="text"
                        id="courseName"
                        name="courseName"
                        required
                        className={inputClass}
                      />
                    </div>
                  )}

                  {prefillName && (
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="text-sm text-neutral-600">{t.form.courseName}:</p>
                      <p className="font-semibold">{prefillName}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="attendanceMode" className={labelClass}>
                        {t.form.attendanceMode} *
                      </label>
                      <select
                        id="attendanceMode"
                        name="attendanceMode"
                        required
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {Object.entries(t.options.attendanceModes).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <DateSelect
                        id="preferredDateCourse"
                        label={t.form.preferredDate}
                        value={preferredDate}
                        onChange={setPreferredDate}
                        placeholder={locale === 'ar' ? 'اختر التاريخ' : 'Select date'}
                        defaultToHijri={locale === 'ar'}
                      />
                      <input type="hidden" name="preferredDate" value={preferredDate} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="additionalInfo" className={labelClass}>
                      {t.form.additionalInfo}
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-sm text-neutral-700">
                  {t.form.terms} *
                </label>
              </div>

              <Button
                type="submit"
                intent="primary"
                size="lg"
                disabled={isSubmitting}
                ariaLabel={t.form.submit}
              >
                {isSubmitting ? 'Submitting...' : t.form.submit}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </main>
  );
}
