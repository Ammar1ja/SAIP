/**
 * Feedback Service
 * Handles fetching feedback statistics from Drupal
 */

import { getApiUrl } from '../config';

export interface FeedbackStatistics {
  yesPercentage: number;
  totalFeedbacks: number;
  yesCount: number;
  noCount: number;
}

/**
 * Fetch feedback statistics for a specific page URL
 * Uses webform_rest to get submissions and calculates statistics
 * @param pageUrl - The URL of the page or question
 * @param type - Type of feedback: 'page' or 'faq_question'
 * 
 * SECURITY: Uses Next.js API proxy to avoid mixed content issues
 */
export async function fetchFeedbackStatistics(
  pageUrl: string,
  type: 'page' | 'faq_question' = 'page',
  locale?: string,
): Promise<FeedbackStatistics | null> {
  try {
    // Use Next.js API proxy instead of direct backend call
    // This prevents mixed content issues (HTTPS frontend → HTTP backend)
    const endpoint = `/api/feedback?page_url=${encodeURIComponent(pageUrl)}&type=${type}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.log(`⚠️ FEEDBACK: Could not fetch statistics for ${pageUrl}`);
      return null;
    }

    const data = await response.json();
    return {
      yesPercentage: data.yes_percentage || 0,
      totalFeedbacks: data.total_feedbacks || 0,
      yesCount: data.yes_count || 0,
      noCount: data.no_count || 0,
    };
  } catch (error) {
    console.error('❌ FEEDBACK: Error fetching statistics', error);
    return null;
  }
}
