/**
 * About SAIP Integration
 * Seamlessly integrate Drupal CMS with existing About page components
 * Includes fallback to existing static data according to SAIP rules
 */

import {
  getAboutPageData as getDrupalAboutPageData,
  type AboutPageData,
} from './services/about.service';
import { data as ceoSpeechData } from '@/components/organisms/CeoSpeech/CeoSpeech.data';
import { pillarsData } from '@/components/organisms/OurPillars/OurPillars.data';
import { missionVision } from '@/components/organisms/MissionAndVision/MissionAndVision.data';
import { ourValues } from '@/components/organisms/OurValues/OurValues.data';
import { rolesData } from '@/components/organisms/OurRoles/OurRoles.data';

/**
 * Get About page data with smart fallback handling
 * Integrates Drupal data with existing fallback data according to SAIP rules
 */
export async function getAboutPageData(locale?: string): Promise<AboutPageData> {
  try {
    // Attempt to fetch from Drupal with locale support
    const drupalData = await getDrupalAboutPageData(locale);

    // Merge with fallback data for empty sections
    // ✅ FIX: Only use fallback if description is truly empty or default
    if (
      drupalData.ceoSpeech.description.length === 1 &&
      (drupalData.ceoSpeech.description[0] === 'CEO description from Drupal...' ||
        drupalData.ceoSpeech.description[0].length < 50)
    ) {
      // Use existing CEO speech data if Drupal has default/empty content
      drupalData.ceoSpeech = {
        ...drupalData.ceoSpeech,
        title: ceoSpeechData.title,
        quote: ceoSpeechData.quote,
        image: ceoSpeechData.image,
        caption: ceoSpeechData.caption,
        captionHighlight: ceoSpeechData.captionHighlight,
        description: ceoSpeechData.description,
      };
    }

    // Merge with fallback pillars if empty
    if (drupalData.pillars.pillars.length === 0) {
      drupalData.pillars.pillars = pillarsData;
    }

    // Merge with fallback values if empty
    if (!drupalData.values || !drupalData.values.items || drupalData.values.items.length === 0) {
      drupalData.values = {
        heading: locale === 'ar' ? 'قيمنا' : 'Our Values',
        text:
          locale === 'ar'
            ? 'قيمنا الأساسية توجه كل ما نقوم به في الهيئة.'
            : 'Our core values guide everything we do at SAIP.',
        items: ourValues.map((v) => ({
          id: v.title.toLowerCase(),
          title: v.title,
          icon: v.icon,
          description: v.description,
        })),
      };
    }

    // Merge with fallback roles if empty
    if (!drupalData.roles || !drupalData.roles.items || drupalData.roles.items.length === 0) {
      drupalData.roles = {
        heading: locale === 'ar' ? 'أدوارنا' : 'Our Roles',
        text:
          locale === 'ar'
            ? 'نقوم بأدوار حاسمة في تطوير وحماية نظام الملكية الفكرية.'
            : 'We play crucial roles in developing and protecting intellectual property ecosystem.',
        items: undefined, // Use fallback from OurRoles component
      };
    }

    return drupalData;
  } catch (error) {
    // Failed to fetch About page data from Drupal, using fallback

    // Return complete fallback data with all component data
    const fallbackData: AboutPageData = {
      hero: {
        title: locale === 'ar' ? 'عن الهيئة' : 'About SAIP',
        description:
          locale === 'ar'
            ? 'تهدف الهيئة إلى تنظيم ودعم وتطوير ورعاية وحماية وإنفاذ وترقية مجالات الملكية الفكرية في المملكة العربية السعودية وفقًا لأفضل الممارسات الدولية، وهي مرتبطة تنظيميًا برئيس مجلس الوزراء.'
            : 'SAIP aims to regulate, support, develop, sponsor, protect, enforce and upgrade the fields of intellectual property in Saudi Arabia in accordance with international best practices, and it is organizationally linked to the Prime Minister.',
        backgroundImage: '/images/about/hero.jpg',
      },
      mission: {
        text: locale === 'ar' ? missionVision[0].description : missionVision[0].description,
      },
      vision: {
        text: locale === 'ar' ? missionVision[1].description : missionVision[1].description,
      },
      values: {
        heading: locale === 'ar' ? 'قيمنا' : 'Our Values',
        text:
          locale === 'ar'
            ? 'قيمنا الأساسية توجه كل ما نقوم به في الهيئة.'
            : 'Our core values guide everything we do at SAIP.',
        items: ourValues.map((v) => ({
          id: v.title.toLowerCase(),
          title: v.title,
          icon: v.icon,
          description: v.description,
        })),
      },
      ceoSpeech: {
        title: ceoSpeechData.title,
        quote: ceoSpeechData.quote,
        image: ceoSpeechData.image,
        caption: ceoSpeechData.caption,
        captionHighlight: ceoSpeechData.captionHighlight,
        description: ceoSpeechData.description,
      },
      roles: {
        heading: locale === 'ar' ? 'أدوارنا' : 'Our Roles',
        text:
          locale === 'ar'
            ? 'نقوم بأدوار حاسمة في تطوير وحماية نظام الملكية الفكرية.'
            : 'We play crucial roles in developing and protecting intellectual property ecosystem.',
        items: undefined, // Use fallback from OurRoles component
      },
      pillars: {
        heading: locale === 'ar' ? 'ركائزنا' : 'Our Pillars',
        text:
          locale === 'ar'
            ? 'تمكين نظام حيوي للملكية الفكرية محليًا وعالميًا.'
            : 'Empowering a vital system for IP locally and globally.',
        pillars: pillarsData,
      },
    };

    return fallbackData;
  }
}

/**
 * Transform text for component compatibility
 * Handles both JSX and string content from Drupal
 */
export function transformAboutText(text: React.ReactNode | string) {
  if (typeof text === 'string') {
    // Return string - JSX transformation happens in component
    return text;
  }
  return text;
}

/**
 * Note: API URL configuration moved to drupalConfig in config.ts
 * Automatic environment detection for development/test/staging/production
 */
