import { fetchDrupal, getApiUrl } from '../utils';
import { getRelated, getImageWithAlt, extractText, getProxyUrl } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for Open Data
export interface OpenDataData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  saipPolicy: {
    heading: string;
    description: string;
    viewButtonLabel: string;
    viewButtonHref: string;
    downloadButtonLabel: string;
    downloadButtonHref: string;
  };
  nationalPlatform: {
    heading: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    image: {
      src: string;
      alt: string;
    };
  };
  requestForm: {
    heading: string;
    fields: Array<{
      id: string;
      type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox';
      label: string;
      placeholder?: string;
      required: boolean;
      helperText?: string;
      options?: Array<{ value: string; label: string }>;
    }>;
    submitLabel: string;
  };
}

// Drupal fetch function
export async function fetchOpenDataPage(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // Include fields that have media/file relationships
  // For field_policy_document, we need to include the media entity AND its file field
  const includeFields =
    'field_policy_document,field_policy_document.field_media_document,field_hero_background_image,field_hero_background_image.field_media_image,field_platform_image,field_platform_image.field_media_image';
  const endpoint = `/node/open_data_page?filter[status]=1&include=${includeFields}`;
  
  // Force fresh data - no cache
  const options = {
    cache: 'no-store' as const,
    next: { revalidate: 0 }
  };
  
  return await fetchDrupal<DrupalNode>(endpoint, options, locale);
}

// Transform function
export function transformOpenDataPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): OpenDataData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero background image from Drupal or fallback
  const heroBackgroundImage = getImageWithAlt(
    getRelated(rels, 'field_hero_background_image', included) as any,
  );

  // Get platform image from Drupal or fallback
  console.log('🖼️ [OPEN-DATA] rels.field_platform_image:', rels.field_platform_image);
  console.log('🖼️ [OPEN-DATA] included array length:', included.length);
  console.log('🖼️ [OPEN-DATA] included types:', included.map(i => i.type));
  
  const platformImageMedia = getRelated(rels, 'field_platform_image', included);
  console.log('🖼️ [OPEN-DATA] Platform image media:', platformImageMedia);
  const platformImage = getImageWithAlt(platformImageMedia as any, included);  // ✅ FIX: Pass included array!
  console.log('🖼️ [OPEN-DATA] Platform image result:', platformImage);

  // Get policy document URL from Media entity
  const getPolicyDocumentUrl = (): string | null => {
    if (!rels.field_policy_document) {
      return null;
    }

    const mediaEntity = getRelated(rels, 'field_policy_document', included);
    if (!mediaEntity || Array.isArray(mediaEntity)) {
      return null;
    }

    // Get file from media entity's field_media_document relationship
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mediaRels = (mediaEntity as any).relationships || {};
    const fileEntity = getRelated(mediaRels, 'field_media_document', included);
    if (!fileEntity || Array.isArray(fileEntity)) {
      return null;
    }

    // Get file URL from file entity attributes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileAttrs = (fileEntity as any).attributes || {};
    if (fileAttrs.uri?.url) {
      const drupalBaseUrl = getApiUrl();
      const fileUrl = fileAttrs.uri.url.startsWith('/')
        ? fileAttrs.uri.url
        : `/${fileAttrs.uri.url}`;
      return `${drupalBaseUrl}${fileUrl}`;
    }

    return null;
  };

  const policyDocumentUrl = getPolicyDocumentUrl();

  // Fallback values for each language
  const fallbacks = {
    hero: {
      title: locale === 'ar' ? 'البيانات المفتوحة' : 'Open Data',
      description:
        locale === 'ar'
          ? 'الوصول إلى مجموعات البيانات والواجهات البرمجية لبيانات وإحصائيات الملكية الفكرية.'
          : 'Access open datasets and APIs for intellectual property data and statistics.',
      backgroundImage: '/images/open-data/hero.jpg',
    },
    overview: {
      heading: locale === 'ar' ? 'مبادرة البيانات المفتوحة' : 'Open Data Initiative',
      description:
        locale === 'ar'
          ? 'توفر الهيئة الوصول المفتوح إلى بيانات الملكية الفكرية لتعزيز الشفافية والبحث والابتكار.'
          : 'SAIP provides open access to intellectual property data to promote transparency, research, and innovation.',
    },
    saipPolicy: {
      heading: locale === 'ar' ? 'سياسة البيانات المفتوحة للهيئة' : 'SAIP open data policy',
      description:
        locale === 'ar'
          ? 'سعيًا لتحقيق مبدأ الشفافية وإثراء مجتمع البيانات من خلال الوصول إلى مجموعات البيانات الحكومية، أصدرت السلطات التنظيمية سياسات وتشريعات متعلقة بالبيانات المفتوحة، والتي تعمل كمرجع أساسي للشروط والأحكام الموضحة في هذه السياسة.'
          : 'Striving to achieve the principle of transparency and enrich the data community through access to government datasets, regulatory authorities have issued policies and legislation related to open data, which serve as the primary reference for the terms and conditions outlined in this policy.',
      viewButtonLabel: locale === 'ar' ? 'عرض الملف' : 'View file',
      downloadButtonLabel:
        locale === 'ar' ? 'تحميل سياسة البيانات المفتوحة للهيئة' : 'Download SAIP open data policy',
    },
    nationalPlatform: {
      heading: locale === 'ar' ? 'منصة البيانات المفتوحة الوطنية' : 'National open data platform',
      description:
        locale === 'ar'
          ? 'لعرض والاستفادة من البيانات المفتوحة، يرجى زيارة صفحة الهيئة على منصة البيانات المفتوحة الوطنية:'
          : "To view and benefit from open data, please visit the Authority's page on the National Open Data Platform:",
      buttonLabel:
        locale === 'ar'
          ? 'انتقل إلى منصة البيانات المفتوحة الوطنية'
          : 'Go to National open data platform',
      buttonHref: '#',
      image: {
        src: '/images/photo-container.png',
        alt:
          locale === 'ar'
            ? 'شخص يكتب على لوحة مفاتيح الكمبيوتر المحمول'
            : 'Person typing on laptop keyboard',
      },
    },
    requestForm: {
      heading: locale === 'ar' ? 'طلب البيانات المفتوحة' : 'Request for open data',
    },
  };

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || fallbacks.hero.title,
      description: extractText(attrs.field_hero_subheading) || fallbacks.hero.description,
      backgroundImage: heroBackgroundImage?.src || fallbacks.hero.backgroundImage,
    },
    overview: {
      heading: extractText(attrs.field_overview_heading) || fallbacks.overview.heading,
      description: extractText(attrs.field_overview_description) || fallbacks.overview.description,
    },
    saipPolicy: {
      heading: extractText(attrs.field_policy_heading) || fallbacks.saipPolicy.heading,
      description: extractText(attrs.field_policy_description) || fallbacks.saipPolicy.description,
      viewButtonLabel:
        extractText(attrs.field_policy_view_btn_label) || fallbacks.saipPolicy.viewButtonLabel,
      viewButtonHref: getProxyUrl(policyDocumentUrl ?? undefined, 'view'),
      downloadButtonLabel:
        extractText(attrs.field_policy_download_btn_label) ||
        fallbacks.saipPolicy.downloadButtonLabel,
      downloadButtonHref: getProxyUrl(policyDocumentUrl ?? undefined, 'download'),
    },
    nationalPlatform: {
      heading: extractText(attrs.field_platform_heading) || fallbacks.nationalPlatform.heading,
      description:
        extractText(attrs.field_platform_description) || fallbacks.nationalPlatform.description,
      buttonLabel:
        extractText(attrs.field_platform_btn_label) || fallbacks.nationalPlatform.buttonLabel,
      buttonHref: extractText(attrs.field_platform_link) || fallbacks.nationalPlatform.buttonHref,
      image: {
        src: platformImage?.src || fallbacks.nationalPlatform.image.src,
        alt: platformImage?.alt || fallbacks.nationalPlatform.image.alt,
      },
    },
    requestForm: {
      heading: extractText(attrs.field_request_heading) || fallbacks.requestForm.heading,
      fields: [
        {
          id: 'fullName',
          type: 'text' as const,
          label: locale === 'ar' ? '* الاسم الكامل' : '* Full name',
          placeholder: locale === 'ar' ? 'اكتب اسمك الكامل' : 'Type your full name',
          required: true,
        },
        {
          id: 'email',
          type: 'email' as const,
          label: locale === 'ar' ? '* البريد الإلكتروني' : '* Email',
          placeholder: locale === 'ar' ? 'اكتب بريدك الإلكتروني' : 'Type your Email',
          required: true,
        },
        {
          id: 'phoneNumber',
          type: 'tel' as const,
          label: locale === 'ar' ? '* رقم الهاتف' : '* Phone number',
          placeholder: locale === 'ar' ? 'اكتب رقم هاتفك' : 'Type your phone number',
          required: true,
          options: [
            { label: '+966', value: '+966' },
            { label: '+1', value: '+1' },
            { label: '+44', value: '+44' },
            { label: '+971', value: '+971' },
            { label: '+20', value: '+20' },
            { label: '+974', value: '+974' },
            { label: '+968', value: '+968' },
            { label: '+965', value: '+965' },
            { label: '+973', value: '+973' },
            { label: '+961', value: '+961' },
            { label: '+962', value: '+962' },
            { label: '+27', value: '+27' },
            { label: '+290', value: '+290' },
            { label: '+291', value: '+291' },
            { label: '+297', value: '+297' },
            { label: '+298', value: '+298' },
            { label: '+299', value: '+299' },
            { label: '+30', value: '+30' },
            { label: '+31', value: '+31' },
            { label: '+32', value: '+32' },
            { label: '+45', value: '+45' },
            { label: '+46', value: '+46' },
            { label: '+47', value: '+47' },
            { label: '+48', value: '+48' },
            { label: '+49', value: '+49' },
            { label: '+51', value: '+51' },
          ],
        },
        {
          id: 'requestDetails',
          type: 'textarea' as const,
          label: locale === 'ar' ? '* تفاصيل الطلب' : '* Request details',
          placeholder: locale === 'ar' ? 'اكتب تفاصيل طلبك' : 'Type your request details',
          required: true,
          helperText: locale === 'ar' ? 'اكتب ما تحتاجه بدقة' : 'Write exactly what you need',
        },
        {
          id: 'purpose',
          type: 'textarea' as const,
          label: locale === 'ar' ? '* الغرض من الطلب' : '* Purpose of the request',
          placeholder: locale === 'ar' ? 'اكتب رسالتك' : 'Type your message',
          required: true,
          helperText:
            locale === 'ar' ? 'اكتب سبب حاجتك لهذه البيانات' : 'Write why you need this data',
        },
        {
          id: 'acknowledgement',
          type: 'checkbox' as const,
          label:
            locale === 'ar'
              ? 'أقر بأنني قرأت ووافقت على سياسة الخصوصية والاستخدام المنشورة على الموقع والشروط واللوائح ذات الصلة.'
              : 'Please confirm that you have read and agreed to the privacy and usage policy',
          required: true,
        },
      ],
      submitLabel:
        extractText(attrs.field_request_submit_label) ||
        (locale === 'ar' ? 'إرسال الطلب' : 'Send request'),
    },
  };
}

// Fallback data function
export function getOpenDataFallbackData(locale?: string): OpenDataData {
  return transformOpenDataPage({ attributes: {}, relationships: {} } as DrupalNode, [], locale);
}

// Main export function
export async function getOpenDataPageData(locale?: string): Promise<OpenDataData> {
  try {
    const response = await fetchOpenDataPage(locale);
    const nodes = response.data;
    const included = response.included || [];

    if (nodes.length === 0) {
      console.log(`🔴 OPEN DATA: Using fallback data ❌ (${locale || 'en'})`);
      return getOpenDataFallbackData(locale);
    }

    const node = nodes[0];
    const data = transformOpenDataPage(node, included, locale);
    console.log(`🟢 OPEN DATA: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 OPEN DATA: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Open Data fetch error:', error);
    return getOpenDataFallbackData(locale);
  }
}
