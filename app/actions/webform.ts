'use server';

import { getApiUrl } from '@/lib/drupal/config';

const shouldLog = process.env.NODE_ENV !== 'production';
const debugLog = (...args: unknown[]) => {
  if (shouldLog) {
    console.log(...args);
  }
};

export interface WebformSubmissionResult {
  success: boolean;
  sid?: string;
  errors?: Record<string, string>;
  message?: string;
}

export interface WebformSubmissionData {
  webform_id: string;
  [key: string]: string | number | boolean | string[] | File[] | Record<string, string> | undefined;
}

/**
 * Submit a webform to Drupal
 */
export async function submitWebform(data: WebformSubmissionData): Promise<WebformSubmissionResult> {
  try {
    const baseUrl = getApiUrl();
    const endpoint = `${baseUrl}/webform_rest/submit`;

    // Check if data contains files
    const hasFiles = Object.values(data).some(
      (value) => Array.isArray(value) && value.length > 0 && value[0] instanceof File,
    );

    debugLog(`📤 WEBFORM: Submitting to ${endpoint}`, { webform_id: data.webform_id, hasFiles });

    let response: Response;

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) continue;

        // Handle file arrays
        if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
          const files = value as File[];
          files.forEach((file) => {
            formData.append(`${key}[]`, file);
          });
        }
        // Handle regular arrays
        else if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, String(item));
          });
        }
        // Handle strings
        else if (typeof value === 'string' && value !== '') {
          formData.append(key, value);
        }
        // Handle other types
        else if (typeof value !== 'string') {
          formData.append(key, String(value));
        }
      }

      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });
    } else {
      // Use JSON for non-file submissions
      const payload: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          // For checkboxes (reasons), empty object should be omitted
          if (key === 'reasons' && typeof value === 'object' && Object.keys(value).length === 0) {
            continue;
          }
          // For strings, omit empty strings
          if (typeof value === 'string' && value === '') {
            continue;
          }
          payload[key] = value;
        }
      }

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
    }

    // Try to parse as JSON, but handle HTML error pages gracefully
    let result;
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // Clone response for potential text reading (response can only be read once)
    const responseClone = response.clone();

    if (!isJson) {
      // If response is not JSON (e.g., HTML error page), read as text
      const text = await response.text();
      debugLog(`❌ WEBFORM: Non-JSON response received`, {
        status: response.status,
        contentType,
        text: text.substring(0, 200),
      });

      // Try to extract error message from HTML if possible
      const errorMatch =
        text.match(/<title[^>]*>([^<]+)<\/title>/i) ||
        text.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
        text.match(/The website encountered[^<]+/i);
      const errorMessage = errorMatch ? errorMatch[1] : null;

      return {
        success: false,
        message:
          errorMessage ||
          (response.status === 403
            ? 'Access denied. Please check webform permissions.'
            : response.status === 404
              ? 'Webform endpoint not found.'
              : `Server error (${response.status}). Please try again later.`),
      };
    }

    try {
      result = await response.json();
    } catch (parseError) {
      // Even if content-type says JSON, parsing might fail - use cloned response
      const text = await responseClone.text();
      debugLog(`❌ WEBFORM: Failed to parse JSON response`, {
        parseError,
        text: text.substring(0, 200),
        contentType,
      });
      return {
        success: false,
        message: 'Invalid response from server. Please try again.',
      };
    }

    if (response.ok && result.data?.sid) {
      debugLog(`✅ WEBFORM: Submission successful, sid: ${result.data.sid}`);
      return {
        success: true,
        sid: result.data.sid,
      };
    }

    // Handle validation errors
    if (result.data?.error) {
      debugLog(`❌ WEBFORM: Validation errors`, result.data.error);
      return {
        success: false,
        errors: result.data.error,
        message: result.message || 'Validation failed',
      };
    }

    // Handle other errors
    debugLog(`❌ WEBFORM: Submission failed`, result);
    return {
      success: false,
      message: result.message || result.error || 'Submission failed',
    };
  } catch (error) {
    debugLog('❌ WEBFORM: Network error', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Submit contact form
 */
export async function submitContactForm(formData: {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  files?: File[];
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'contact_form',
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
    attachments: formData.files || [],
  });
}

/**
 * Submit open data request form
 */
export async function submitOpenDataRequest(formData: {
  fullName: string;
  email: string;
  phoneNumber: string;
  requestDetails: string;
  purpose: string;
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'open_data_request',
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phoneNumber,
    request_details: formData.requestDetails,
    purpose: formData.purpose,
  });
}

/**
 * Submit exam registration form
 */
export async function submitExamRegistration(formData: {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  examType: string;
  preferredDate: string;
  preferredLocation: string;
  specialRequirements?: string;
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'exam_registration',
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    national_id: formData.nationalId,
    exam_type: formData.examType,
    preferred_date: formData.preferredDate,
    preferred_location: formData.preferredLocation,
    special_requirements: formData.specialRequirements,
    terms_acceptance: '1',
  });
}

/**
 * Submit article comment form
 */
export async function submitArticleComment(formData: {
  fullName: string;
  email: string;
  phoneNumber?: string;
  comment: string;
  articleId: string;
  articleTitle: string;
  pageUrl: string;
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'article_comment',
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phoneNumber,
    comment: formData.comment,
    article_id: formData.articleId,
    article_title: formData.articleTitle,
    page_url: formData.pageUrl,
  });
}

/**
 * Submit course registration form
 */
export async function submitCourseRegistration(formData: {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  jobTitle?: string;
  courseName: string;
  preferredDate?: string;
  attendanceMode: string;
  additionalInfo?: string;
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'course_registration',
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    organization: formData.organization,
    job_title: formData.jobTitle,
    course_name: formData.courseName,
    preferred_date: formData.preferredDate,
    attendance_mode: formData.attendanceMode,
    additional_info: formData.additionalInfo,
    terms_acceptance: '1',
  });
}

/**
 * Submit page feedback
 */
export async function submitPageFeedback(formData: {
  pageUrl: string;
  pageTitle?: string;
  isUseful: 'yes' | 'no';
  reasons?: string[];
  feedbackText?: string;
  gender?: string;
}): Promise<WebformSubmissionResult> {
  // Map reasons array to webform format (checkboxes expect object with keys)
  // Webform checkboxes need format: { 'key': 'key' } for selected values
  const reasonsObj: Record<string, string> = {};
  if (formData.reasons && formData.reasons.length > 0) {
    formData.reasons.forEach((reasonKey) => {
      // reasonKey should already be the webform key (content_relevant, well_written, etc.)
      if (reasonKey) {
        reasonsObj[reasonKey] = reasonKey;
      }
    });
  }

  const payload: WebformSubmissionData = {
    webform_id: 'page_feedback',
    page_url: formData.pageUrl,
    is_useful: formData.isUseful,
  };

  // Only include optional fields if they have values
  if (formData.pageTitle) {
    payload.page_title = formData.pageTitle;
  }
  if (formData.feedbackText) {
    payload.feedback_text = formData.feedbackText;
  }
  if (formData.gender) {
    payload.gender = formData.gender;
  }

  // Only include reasons if there are any selected
  // For webform checkboxes, format should be array of selected keys
  if (Object.keys(reasonsObj).length > 0) {
    payload.reasons = Object.keys(reasonsObj);
  }

  return submitWebform(payload);
}

/**
 * Submit FAQ question feedback
 */
export async function submitFaqQuestionFeedback(formData: {
  questionId: string;
  questionTitle: string;
  pageUrl: string;
  isUseful: 'yes' | 'no';
}): Promise<WebformSubmissionResult> {
  return submitWebform({
    webform_id: 'faq_question_feedback',
    question_id: formData.questionId,
    question_title: formData.questionTitle,
    page_url: formData.pageUrl,
    is_useful: formData.isUseful,
  });
}
