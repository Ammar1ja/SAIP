'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';
import { fetchFeedbackStatistics } from '@/lib/drupal/services/feedback.service';
import { submitFaqQuestionFeedback } from '@/app/actions/webform';

interface FaqQuestionFeedbackProps {
  questionId: string;
  questionTitle: string;
  lastUpdate?: string;
}

export const FaqQuestionFeedback: React.FC<FaqQuestionFeedbackProps> = ({
  questionId,
  questionTitle,
  lastUpdate,
}) => {
  const t = useTranslations('feedback');
  const tFaq = useTranslations('faq');
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statistics, setStatistics] = useState<{
    yesCount: number;
    totalFeedbacks: number;
    yesPercentage: number;
  }>({ yesCount: 0, totalFeedbacks: 0, yesPercentage: 0 });

  useEffect(() => {
    const loadStatistics = async () => {
      if (typeof window === 'undefined') return;
      const pageUrl = `${window.location.pathname}#${questionId}`;
      const stats = await fetchFeedbackStatistics(pageUrl, 'faq_question');
      if (stats) {
        setStatistics({
          yesCount: stats.yesCount || 0,
          totalFeedbacks: stats.totalFeedbacks || 0,
          yesPercentage: stats.yesPercentage || 0,
        });
      }
    };
    loadStatistics();
  }, [questionId, isSubmitted]);

  const handleOptionClick = async (option: 'yes' | 'no') => {
    setSelectedOption(option);

    // Submit feedback to Drupal webform
    try {
      if (typeof window === 'undefined') return;

      const pageUrl = `${window.location.pathname}#${questionId}`;
      const result = await submitFaqQuestionFeedback({
        questionId,
        questionTitle,
        pageUrl,
        isUseful: option,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error('Failed to submit feedback:', result.message || result.errors);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-neutral-50 rounded-2xl p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-base leading-6 text-text-default">
            {tFaq('feedbackQuestion') || 'Do you find the answer to this question helpful?'}
          </p>
          <div className="flex items-center gap-3">
            <Button
              intent="primary"
              outline={false}
              onClick={() => handleOptionClick('yes')}
              className="h-8 px-3 py-0 text-sm"
              ariaLabel={t('yes')}
              disabled={isSubmitted}
            >
              {t('yes')}
            </Button>
            <Button
              intent="primary"
              outline={false}
              onClick={() => handleOptionClick('no')}
              className="h-8 px-3 py-0 text-sm"
              ariaLabel={t('no')}
              disabled={isSubmitted}
            >
              {t('no')}
            </Button>
          </div>
        </div>

        <div className="text-sm text-text-default">
          {statistics.totalFeedbacks > 0
            ? tFaq('feedbackStatistics', {
                percentage: statistics.yesPercentage,
                total: statistics.totalFeedbacks,
              }) ||
              `${statistics.yesPercentage}% found this helpful (${statistics.totalFeedbacks} responses)`
            : tFaq('noFeedbackYet') || 'No feedback yet'}
        </div>

        <div className="text-sm text-text-secondary-paragraph">
          {tFaq('lastUpdate') || 'Date of last update:'}{' '}
          {lastUpdate ? formatDate(lastUpdate) : formatDate(new Date().toISOString())}
        </div>
      </div>
    </div>
  );
};

export default FaqQuestionFeedback;
