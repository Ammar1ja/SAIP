'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { submitPageFeedback } from '@/app/actions/webform';
import { fetchFeedbackStatistics } from '@/lib/drupal/services/feedback.service';

interface FeedbackSectionProps {
  pageTitle?: string;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ pageTitle }) => {
  const t = useTranslations('feedback');
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [gender, setGender] = useState<string>('');
  const [charLimitError, setCharLimitError] = useState(false);
  const [statistics, setStatistics] = useState<{
    yesPercentage: number;
    totalFeedbacks: number;
  }>({ yesPercentage: 0, totalFeedbacks: 0 });

  const MAX_FEEDBACK_LENGTH = 2000;

  const reasons = [
    t('reasons.contentRelevant'),
    t('reasons.wellWritten'),
    t('reasons.easyToRead'),
    t('reasons.somethingElse'),
  ];

  const genderOptions = [
    { value: 'male', label: t('gender.male') },
    { value: 'female', label: t('gender.female') },
    { value: 'prefer_not_to_say', label: t('gender.preferNotToSay') },
  ];

  // Fetch statistics on mount and after submission
  useEffect(() => {
    const loadStatistics = async () => {
      if (typeof window === 'undefined') return;
      const pageUrl = window.location.pathname;
      const stats = await fetchFeedbackStatistics(pageUrl);
      if (stats) {
        setStatistics({
          yesPercentage: stats.yesPercentage,
          totalFeedbacks: stats.totalFeedbacks,
        });
      }
    };
    loadStatistics();
  }, [pathname, isSubmitted]);

  const handleOptionClick = (option: 'yes' | 'no') => {
    setSelectedOption(option);
    setIsExpanded(true);
  };

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  // Map reason keys for webform submission
  const getReasonKey = (reason: string): string => {
    if (reason === t('reasons.contentRelevant')) return 'content_relevant';
    if (reason === t('reasons.wellWritten')) return 'well_written';
    if (reason === t('reasons.easyToRead')) return 'easy_to_read';
    if (reason === t('reasons.somethingElse')) return 'something_else';
    return reason;
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    // Validate character limit before submission
    if (feedbackText.length > MAX_FEEDBACK_LENGTH) {
      setCharLimitError(true);
      return;
    }

    setIsSubmitting(true);
    setCharLimitError(false);
    try {
      const pageUrl = window.location.pathname;
      const result = await submitPageFeedback({
        pageUrl,
        pageTitle: pageTitle || document.title,
        isUseful: selectedOption,
        reasons: selectedReasons.map(getReasonKey),
        feedbackText: feedbackText || undefined,
        gender: gender || undefined,
      });

      if (result.success) {
        setIsSubmitted(true);
        setIsExpanded(false);
        // Reload statistics after submission
        const stats = await fetchFeedbackStatistics(pageUrl);
        if (stats) {
          setStatistics({
            yesPercentage: stats.yesPercentage,
            totalFeedbacks: stats.totalFeedbacks,
          });
        }
      } else {
        console.error('Failed to submit feedback:', result.message, result.errors);
        const errorMsg = result.errors
          ? Object.values(result.errors).join(', ')
          : result.message || 'Failed to submit feedback. Please try again.';
        setErrorMessage(errorMsg);
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedOption(null);
    setSelectedReasons([]);
    setFeedbackText('');
    setGender('');
    setCharLimitError(false);
  };

  const handleFeedbackTextChange = (value: string) => {
    setFeedbackText(value);
    if (value.length <= MAX_FEEDBACK_LENGTH) {
      setCharLimitError(false);
    }
  };

  // Success icon SVG component
  const SuccessIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M1.5 10.75C1.5 15.8586 5.64137 20 10.75 20C15.8586 20 20 15.8586 20 10.75C20 9.7819 19.8515 8.8499 19.5767 7.97474C19.4525 7.57956 19.6723 7.15858 20.0675 7.03446C20.4626 6.91034 20.8836 7.13008 21.0077 7.52526C21.3278 8.54419 21.5 9.62769 21.5 10.75C21.5 16.6871 16.6871 21.5 10.75 21.5C4.81294 21.5 0 16.6871 0 10.75C0 4.81294 4.81294 0 10.75 0C11.8723 0 12.9558 0.172239 13.9747 0.492266C14.3699 0.616385 14.5897 1.03736 14.4655 1.43254C14.3414 1.82772 13.9204 2.04746 13.5253 1.92334C12.6501 1.64847 11.7181 1.5 10.75 1.5C5.64137 1.5 1.5 5.64137 1.5 10.75Z"
        fill="#1B8354"
      />
      <path
        d="M20.3077 2.25174C20.5848 1.94386 20.5599 1.46964 20.252 1.19254C19.9441 0.915444 19.4699 0.940396 19.1928 1.24828L10.7214 10.6607L7.78033 7.71968C7.48744 7.42678 7.01256 7.42678 6.71967 7.71968C6.42678 8.01257 6.42678 8.48744 6.71967 8.78034L10.2197 12.2803C10.3652 12.4258 10.564 12.5052 10.7697 12.4997C10.9754 12.4943 11.1698 12.4047 11.3075 12.2517L20.3077 2.25174Z"
        fill="#1B8354"
      />
    </svg>
  );

  if (isSubmitted) {
    return (
      <div className="w-full bg-white border-t border-primary-600">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <SuccessIcon />
            <p className="text-gray-900 font-medium">{t('submitted')}</p>
            {statistics.totalFeedbacks > 0 && (
              <div className="ml-auto text-gray-600 text-sm">
                {t('statistics', {
                  yesPercentage: statistics.yesPercentage,
                  yesLabel: t('yes'),
                  totalFeedbacks: statistics.totalFeedbacks,
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-t border-primary-600">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
            <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm flex-1">{errorMessage}</p>
            <Button
              intent="secondary"
              outline
              onClick={() => setErrorMessage(null)}
              className="p-1"
              ariaLabel={t('close')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {!isExpanded ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <p className="text-gray-900 font-medium">{t('question')}</p>
              <div className="flex gap-4">
                <Button
                  intent="primary"
                  onClick={() => handleOptionClick('yes')}
                  className="h-10 rounded-sm px-4 py-0"
                  ariaLabel={t('yes')}
                >
                  {t('yes')}
                </Button>
                <Button
                  intent="primary"
                  onClick={() => handleOptionClick('no')}
                  className="h-10 rounded-sm px-4 py-0"
                  ariaLabel={t('no')}
                >
                  {t('no')}
                </Button>
              </div>
            </div>
            <div className="text-gray-600 text-sm">
              {statistics.totalFeedbacks > 0
                ? t('statistics', {
                    yesPercentage: statistics.yesPercentage,
                    yesLabel: t('yes'),
                    totalFeedbacks: statistics.totalFeedbacks,
                  })
                : t('statistics', {
                    yesPercentage: 0,
                    yesLabel: t('yes'),
                    totalFeedbacks: 0,
                  })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-gray-900 font-medium">{t('question')}</p>
                <div className="flex gap-4">
                  <Button
                    intent="primary"
                    onClick={() => setSelectedOption('yes')}
                    className={
                      selectedOption === 'yes'
                        ? 'h-10 rounded-sm !bg-[#14573A] px-4 py-0 hover:!bg-[#14573A]'
                        : 'h-10 rounded-sm px-4 py-0'
                    }
                    ariaLabel={t('yes')}
                  >
                    {t('yes')}
                  </Button>
                  <Button
                    intent="primary"
                    onClick={() => setSelectedOption('no')}
                    className={
                      selectedOption === 'no'
                        ? 'h-10 rounded-sm !bg-[#14573A] px-4 py-0 hover:!bg-[#14573A]'
                        : 'h-10 rounded-sm px-4 py-0'
                    }
                    ariaLabel={t('no')}
                  >
                    {t('no')}
                  </Button>
                </div>
              </div>
              <Button
                intent="secondary"
                outline
                onClick={handleClose}
                className="p-2"
                ariaLabel={t('close')}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-900 font-medium mb-2">
                  {t('pleaseTellUsWhy')}{' '}
                  <span className="text-gray-500 text-sm">({t('youCanSelectMultiple')})</span>
                </h3>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReasons.includes(reason)}
                        onChange={() => handleReasonToggle(reason)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-gray-900 font-medium mb-2">{t('im')}</p>
                  <div className="flex gap-4">
                    {genderOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={gender === option.value}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 font-medium mb-2">{t('feedbackText')}</h3>
                <textarea
                  value={feedbackText}
                  onChange={(e) => handleFeedbackTextChange(e.target.value)}
                  placeholder={t('feedbackPlaceholder')}
                  maxLength={MAX_FEEDBACK_LENGTH}
                  className={`w-full h-40 p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    charLimitError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={6}
                  aria-describedby="feedback-char-count feedback-char-error"
                />
                <div className="flex items-center justify-between mt-2">
                  <span
                    id="feedback-char-count"
                    className={`text-sm ${
                      feedbackText.length > MAX_FEEDBACK_LENGTH
                        ? 'text-red-600 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('characterCount', { count: feedbackText.length, max: MAX_FEEDBACK_LENGTH })}
                  </span>
                  {charLimitError && (
                    <span id="feedback-char-error" className="text-sm text-red-600 font-medium">
                      {t('characterLimitError', { max: MAX_FEEDBACK_LENGTH })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {t('moreInformation')}{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  {t('eParticipationStatement')}
                </a>{' '}
                {t('and')}{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  {t('rulesOfEngagement')}
                </a>
                .
              </p>
              <Button
                intent="primary"
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !selectedOption || feedbackText.length > MAX_FEEDBACK_LENGTH
                }
                className="px-6 py-2"
                ariaLabel={t('submit')}
              >
                {isSubmitting ? '...' : t('submit')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;
