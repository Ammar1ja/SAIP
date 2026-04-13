import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import {
  DrupalIPAcademyPageNode,
  DrupalIncludedEntity,
  DrupalTrainingProgramNode,
  DrupalQualificationNode,
  DrupalEducationProjectNode,
  DrupalStatisticsItemNode,
  DrupalMediaTabNode,
} from '../types';
import { DrupalResponse } from '../api-client';

// Helper to get file URL from included entities (proxied through Next.js API route)
// SECURITY: Uses path-based approach for proxy
function getFileUrl(
  entity: any,
  included: any[],
  fieldName: string,
  action: 'download' | 'view' = 'download',
): string | null {
  const rel = entity.relationships?.[fieldName]?.data;
  if (!rel) return null;

  const fileId = rel.id;
  const fileEntity = included.find((inc: any) => inc.id === fileId && inc.type === 'file--file');

  if (fileEntity?.attributes?.uri?.url) {
    // Get file path (already relative, starts with /)
    const filePath = fileEntity.attributes.uri.url;

    // SECURITY: Only proxy /sites/default/files/ paths
    if (!filePath.startsWith('/sites/default/files/')) {
      return filePath; // Return as-is if not a Drupal file
    }

    // Use proxy-file endpoint with path parameter
    const encodedPath = encodeURIComponent(filePath);
    return `/api/proxy-file?path=${encodedPath}&action=${action}`;
  }

  return null;
}

// Helper to format date to DD.MM.YYYY
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}

// Helper to ensure field is always a string (handles {value, format, processed} objects)
function ensureString(field: any): string {
  if (!field) return '';

  const sanitize = (text: string): string => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<') // Decode HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/<[^>]*>/g, '') // Remove any remaining tags after decode
      .trim();
  };

  if (typeof field === 'string') {
    return sanitize(field);
  }
  if (typeof field === 'object') {
    // Handle {value, format, processed} object from Drupal
    const text = field.processed || field.value || '';
    return typeof text === 'string' ? sanitize(text) : '';
  }
  return String(field);
}

// Frontend interfaces
export interface OfferData {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  buttonLabel: string;
  buttonHref: string;
}

export interface AdvantageData {
  title: string;
  description: string;
}

export interface IPAcademyData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    statistics: {
      statistics: StatisticsCardData[];
      statisticsTitle: string;
      statisticsCtaLabel: string;
      statisticsCtaHref: string;
    };
    offers: OfferData[];
    advantages: AdvantageData[];
    relatedPages?: Array<{ title: string; href: string }>;
  };
  trainingPrograms: TrainingProgramData[];
  trainingProgramsForCards: TrainingProgramForCard[];
  trainingHeroTitle: string;
  trainingHeroDescription: string;
  qualifications: QualificationData[];
  qualificationsForCards: QualificationForCard[];
  qualificationsHeroTitle: string;
  qualificationsHeroDescription: string;
  educationProjects: EducationProjectData[];
  educationProjectsForCards: EducationProjectForCard[];
  educationProjectCategoryOptions?: Array<{ label: string; value: string }>;
  projectsHeroTitle: string;
  projectsHeroDescription: string;
  media: {
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    tabs: MediaTabData[];
    content: Record<string, MediaContentData>;
    filterFields: FilterFieldData[];
    badgeLabel: string;
  };
}
async function fetchEducationProjectCategories(
  locale?: string,
): Promise<Array<{ label: string; value: string }>> {
  try {
    const response = await fetchDrupal<DrupalIncludedEntity>(
      `/taxonomy_term/education_project_category?filter[status]=1&sort=weight&filter[langcode]=${locale || 'en'}`,
      {},
      locale,
    );
    const terms = response.data || [];
    return terms
      .map((term) => {
        const name = extractText((term.attributes as { name?: string })?.name) || '';
        return name ? { label: name, value: name } : null;
      })
      .filter(Boolean) as Array<{ label: string; value: string }>;
  } catch (error) {
    console.error('Failed to fetch education project categories:', error);
    return [];
  }
}

export interface StatisticsCardData {
  label: string;
  value?: number;
  chartType: string;
  chartData?: Array<{ value: number }>;
  trend?: {
    value: string;
    direction: string;
    description: string;
  };
  breakdown?: Array<{
    label: string;
    value: number;
    displayValue: string;
    color: string;
  }>;
}

// Format expected by TrainingProgramsSection component
export interface TrainingProgramForCard {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: string;
  duration: string;
  location: string;
  host: string;
  fees: string;
  registerHref?: string;
  [key: string]: unknown;
}

export interface TrainingProgramData {
  id: string;
  title: string;
  description: string;
  details: string;
  forWhom: string;
  whatYouWillLearn: string[];
  startDate: string;
  duration: string;
  fees: string;
  language: string;
  category: string;
  hosts: string;
  location: string;
  faqHref: string;
  registerHref: string;
  registerNote?: string;
  courseFormat: string;
  courseMaterials: string;
  courseMaterialsHref: string;
  relatedServicesTitle?: string;
  relatedServicesDescription?: string;
  programme: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
  }>;
}

// Format expected by ProQualificationSection component
export interface QualificationForCard {
  id: string;
  title: string;
  description: string;
  link?: string;
}

// Format expected by EducationProjectsSection component
export interface EducationProjectForCard {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  detailsUrl: string;
  [key: string]: unknown;
}

export interface QualificationData {
  id: string;
  title: string;
  description: string;
  details: string;
  category?: string;
  forWhom: string[];
  requirements: string[];
  studyMaterialLabel: string;
  studyMaterialHref: string;
  examPrograms: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    link: string;
  }>;
  startDate: string;
  duration: string;
  fees: string;
  language: string;
  testType: string;
  hosts?: string;
  passingScore: string;
  location: string;
  faqHref: string;
  registerHref: string;
  chapters: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
  }>;
}

export interface EducationProjectData {
  id: string;
  title: string;
  description: string;
  details: string;
  fileUrl?: string;
  categories: string[];
  partners: Array<{
    id: string;
    name: string;
    logo?: string;
  }>;
  projectScopeDescription: string;
  projectScopeSections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  targetAudience: string[];
  projectDetails: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export interface MediaTabData {
  id: string;
  label: string;
}

export interface MediaContentData {
  title: string;
  description: string;
}

export interface FilterFieldData {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  variant?: 'single' | 'range';
}

// Drupal API functions
export async function fetchIPAcademyPage(
  locale?: string,
): Promise<{ node: DrupalIPAcademyPageNode; included: DrupalIncludedEntity[] } | null> {
  try {
    // Step 1: Get UUID without locale filter (always find the node)
    const nodeUuidResponse = await fetchDrupal<DrupalIPAcademyPageNode>(
      '/node/ip_academy_page?filter[status][value]=1',
      {},
      'en',
    );

    const nodeUuid = nodeUuidResponse.data[0]?.id;
    if (!nodeUuid) {
      console.log('IP ACADEMY: No UUID found');
      return null;
    }

    // Step 2: Fetch with UUID and locale to get translated content
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_statistics_items',
      'field_training_programs',
      'field_qualifications',
      'field_education_projects',
      'field_education_projects.field_project_file',
      'field_education_projects.field_education_project_category',
      'field_education_projects.field_project_scope_sections_p',
      'field_education_projects.field_project_details_p',
      'field_education_projects.field_target_audience_items',
      'field_media_tabs',
    ];

    const response = await fetchDrupal<DrupalIPAcademyPageNode>(
      `/node/ip_academy_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // Handle both single object (UUID fetch) and array (filter fetch) responses
    const node = Array.isArray(response.data) ? response.data[0] : response.data;

    console.log(`🎓 IP ACADEMY: Fetched node for locale ${locale || 'en'}:`);
    console.log(`   Hero Heading: ${(node as any)?.attributes?.field_hero_heading}`);

    return { node, included: response.included || [] };
  } catch (error) {
    console.error(`Failed to fetch IP Academy page for locale ${locale}:`, error);
    return null;
  }
}

// Fetch statistics paragraphs separately (entity_reference_revisions don't work with include)
async function fetchStatisticsItems(
  nodeNid: string,
  locale?: string,
): Promise<StatisticsCardData[]> {
  try {
    // Fetch ALL statistics_item paragraphs and filter by parent_id
    const endpoint = `/paragraph/statistics_item`;
    const response = await fetchDrupal<DrupalIncludedEntity>(endpoint, {}, locale);

    if (!response.data || !Array.isArray(response.data)) {
      console.log(`📊 IP ACADEMY: No statistics paragraphs found`);
      return [];
    }

    console.log(
      `📊 IP ACADEMY: Total paragraphs: ${response.data.length}, filtering for parent_id=${nodeNid}`,
    );

    // Filter by parent_id AND parent_field_name to ensure we get IP Academy statistics
    const filteredData = response.data.filter((p) => {
      const attrs = p.attributes as any;
      const matchesParent = String(attrs.parent_id) === String(nodeNid);
      const matchesField =
        attrs.parent_field_name === 'field_statistics_items' && attrs.parent_type === 'node';

      if (matchesParent && matchesField) {
        console.log(
          `✅ Statistics item ${p.id}: "${attrs.field_stat_label}" (parent_id=${attrs.parent_id})`,
        );
      }

      return matchesParent && matchesField;
    });

    console.log(`📊 IP ACADEMY: Found ${filteredData.length} matching statistics paragraphs`);

    const transformed = filteredData.map((paragraph) => transformStatisticsItem(paragraph, []));
    console.log(
      `📊 IP ACADEMY: Transformed ${transformed.length} statistics:`,
      transformed.map((t) => t.label),
    );

    return transformed;
  } catch (error) {
    console.error('Error fetching IP Academy statistics items:', error);
    return [];
  }
}

// Transformation functions
export function transformStatisticsItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): StatisticsCardData {
  const attrs = (item as any).attributes || {};

  let chartData: Array<{ value: number }> = [];
  let trend: StatisticsCardData['trend'];
  let breakdown: StatisticsCardData['breakdown'];

  // Support both old (field_chart_data) and new (field_stat_chart_data) formats
  const chartDataField = attrs.field_stat_chart_data || attrs.field_chart_data;
  if (chartDataField) {
    try {
      const parsed =
        typeof chartDataField === 'string' ? JSON.parse(chartDataField) : chartDataField;
      chartData = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse chart data:', e);
    }
  }

  // Handle trend - support both old and new field names
  const trendValue = attrs.field_stat_trend_value || attrs.field_trend_value;
  const trendDirection = attrs.field_stat_trend_direction || attrs.field_trend_direction;
  const trendDesc = attrs.field_stat_trend_desc || attrs.field_trend_description;
  if (trendValue && trendDirection) {
    trend = {
      value: trendValue,
      direction: trendDirection as 'up' | 'down' | 'neutral',
      description: trendDesc || '',
    };
  }

  if (attrs.field_breakdown) {
    try {
      breakdown = JSON.parse(attrs.field_breakdown);
    } catch (e) {
      console.warn('Failed to parse breakdown data:', e);
    }
  }

  // Support multiple label/value formats
  const label = attrs.field_stat_label || attrs.field_label || 'Untitled Statistic';
  const value = attrs.field_stat_value || attrs.field_value || 0;
  const chartType = attrs.field_stat_chart_type || attrs.field_chart_type || 'line';

  return {
    label,
    value,
    chartType,
    chartData,
    trend,
    breakdown,
  };
}

export function transformTrainingProgram(
  program: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): TrainingProgramData {
  const attrs = (program as any).attributes || {};
  const nid = attrs.drupal_internal__nid ? String(attrs.drupal_internal__nid) : '';
  const relationships = (program as any).relationships || {};

  let whatYouWillLearn: string[] = [];
  let programme: Array<{ id: string; title: string; subtitle: string; description: string }> = [];

  if (attrs.field_what_you_will_learn) {
    try {
      whatYouWillLearn = JSON.parse(attrs.field_what_you_will_learn);
    } catch (e) {
      const rawValue =
        typeof attrs.field_what_you_will_learn === 'string'
          ? attrs.field_what_you_will_learn
          : attrs.field_what_you_will_learn?.value || '';
      whatYouWillLearn = rawValue
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((line: string) => line.replace(/^[-•]\s*/, ''));
    }
  }

  if (attrs.field_programme) {
    try {
      programme = JSON.parse(attrs.field_programme);
    } catch (e) {
      const rawValue =
        typeof attrs.field_programme === 'string'
          ? attrs.field_programme
          : attrs.field_programme?.value || '';
      const lines = rawValue
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);
      programme = lines.map((line: string, index: number) => {
        const match = line.match(/^(\d+)[.)]\s*(.+)$/);
        const subtitle = match ? match[2] : line;
        const title = match ? match[1] : `Course ${index + 1}`;
        return {
          id: `course-${index + 1}`,
          title,
          subtitle,
          description: '',
        };
      });
    }
  }

  // Extract fees - may be entity reference or plain string
  let fees = '';
  if (typeof attrs.field_fees === 'string') {
    fees = attrs.field_fees;
  } else if (attrs.field_fees?.entity?.name) {
    fees = attrs.field_fees.entity.name;
  }

  // Extract language - may be entity reference or plain string
  let language = '';
  if (typeof attrs.field_language === 'string') {
    language = attrs.field_language;
  } else if (attrs.field_language?.entity?.name) {
    language = attrs.field_language.entity.name;
  }

  const categoryTerms = relationships.field_category
    ? getRelated(relationships, 'field_category', included) || []
    : [];
  const category =
    Array.isArray(categoryTerms) && categoryTerms.length > 0
      ? (categoryTerms[0] as any).attributes?.name || ''
      : '';
  const hosts = attrs.field_hosts || attrs.field_for_whom || '';

  return {
    id: program.id,
    title: attrs.title || 'Untitled Training Program',
    description: ensureString(attrs.field_description),
    details: ensureString(attrs.field_details),
    forWhom: attrs.field_for_whom || '',
    whatYouWillLearn,
    startDate: attrs.field_start_date || '', // Keep ISO format for proper date handling
    duration: attrs.field_duration || '',
    fees: fees || 'Free',
    language: language || 'English',
    category: category || attrs.field_course_format || '',
    hosts,
    location:
      typeof attrs.field_location === 'string'
        ? attrs.field_location
        : attrs.field_location?.title || attrs.field_location?.uri || '',
    faqHref: attrs.field_faq_href || '#',
    registerHref: attrs.field_register_href || '#',
    registerNote: ensureString(
      attrs.field_register_note ||
        attrs.field_registration_note ||
        attrs.field_register_notes ||
        attrs.field_register_helper_text ||
        attrs.field_register_text,
    ),
    courseFormat: attrs.field_course_format || '',
    courseMaterials: attrs.field_course_materials || '',
    courseMaterialsHref: getFileUrl(program, included, 'field_study_material_file') || '#',
    relatedServicesTitle: ensureString(attrs.field_related_services_title),
    relatedServicesDescription: ensureString(
      attrs.field_related_services_description || attrs.field_related_services_desc,
    ),
    programme,
  };
}

// Mapper: Convert TrainingProgramData to format expected by component
export function mapTrainingProgramToCard(
  program: TrainingProgramData,
  locale?: string,
): TrainingProgramForCard {
  // Format date from ISO to readable format
  let formattedDate = '';
  let formattedTime = '';
  if (program.startDate) {
    try {
      const date = new Date(program.startDate);

      if (process.env.NODE_ENV === 'development') {
        console.log('[TRAINING PROGRAMS] Date formatting:', {
          original: program.startDate,
          parsed: date.toISOString(),
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      }

      if (isNaN(date.getTime())) {
        const parts = program.startDate.split('.');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const parsedDate = new Date(year, month, day);
          if (!isNaN(parsedDate.getTime())) {
            formattedDate = `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
          } else {
            formattedDate = program.startDate;
          }
        } else {
          formattedDate = program.startDate;
        }
      } else {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        formattedDate = `${day}.${month}.${year}`;
        formattedTime = new Intl.DateTimeFormat(locale || 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      }
    } catch (error) {
      formattedDate = program.startDate;
    }
  }

  // Extract location - it may be a link object or string
  let locationStr = '';
  if (typeof program.location === 'string') {
    locationStr = program.location;
  } else if (program.location && typeof program.location === 'object') {
    locationStr = (program.location as any).title || (program.location as any).uri || 'Unknown';
  }

  return {
    id: program.id,
    title: program.title,
    date: formattedDate,
    time: formattedTime || undefined,
    category: program.category || 'General',
    duration: program.duration || '',
    location: locationStr,
    host: program.hosts || '',
    fees: program.fees || 'Free',
    registerHref: program.registerHref || '#',
  };
}

export function transformQualification(
  qualification: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): QualificationData {
  const attrs = (qualification as any).attributes || {};
  const relationships = (qualification as any).relationships || {};

  let forWhom: string[] = [];
  let requirements: string[] = [];
  let examPrograms: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    link: string;
  }> = [];
  let chapters: Array<{ id: string; title: string; subtitle: string; description: string }> = [];

  if (attrs.field_for_whom) {
    try {
      // Handle both string and formatted text field formats
      const forWhomRaw =
        typeof attrs.field_for_whom === 'string'
          ? attrs.field_for_whom
          : attrs.field_for_whom?.value || '';
      if (forWhomRaw) {
        forWhom = JSON.parse(forWhomRaw.trim());
      }
    } catch (e) {
      console.warn('Failed to parse for whom:', e);
    }
  }

  if (attrs.field_requirements) {
    try {
      // Handle both string and formatted text field formats
      const requirementsRaw =
        typeof attrs.field_requirements === 'string'
          ? attrs.field_requirements
          : attrs.field_requirements?.value || '';
      if (requirementsRaw) {
        // Strip HTML tags and parse JSON
        const cleaned = requirementsRaw
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .trim();
        requirements = JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Failed to parse requirements:', e);
    }
  }

  if (attrs.field_exam_programs) {
    try {
      examPrograms = JSON.parse(attrs.field_exam_programs);
    } catch (e) {
      console.warn('Failed to parse exam programs:', e);
    }
  }

  if (attrs.field_chapters) {
    try {
      chapters = JSON.parse(attrs.field_chapters);
    } catch (e) {
      console.warn('Failed to parse chapters:', e);
    }
  }

  // Extract fees - may be entity reference or plain string
  let fees = '';
  if (typeof attrs.field_fees === 'string') {
    fees = attrs.field_fees;
  } else if (attrs.field_fees?.entity?.name) {
    fees = attrs.field_fees.entity.name;
  }

  // Extract language - may be entity reference or plain string
  let language = '';
  if (typeof attrs.field_language === 'string') {
    language = attrs.field_language;
  } else if (attrs.field_language?.entity?.name) {
    language = attrs.field_language.entity.name;
  }

  let category = '';
  if (relationships.field_category?.data) {
    const categoryEntity = getRelated(relationships, 'field_category', included);
    category = ensureString(
      (Array.isArray(categoryEntity) ? categoryEntity[0] : categoryEntity)?.attributes?.name,
    );
  } else if (typeof attrs.field_category === 'string') {
    category = attrs.field_category;
  }

  const hosts = typeof attrs.field_hosts === 'string' ? attrs.field_hosts : '';

  return {
    id: qualification.id,
    title: attrs.title || 'Untitled Qualification',
    description: ensureString(attrs.field_description),
    details: ensureString(attrs.field_details),
    category,
    forWhom,
    requirements,
    studyMaterialLabel: attrs.field_study_material_label || 'Download study material',
    studyMaterialHref:
      getFileUrl(qualification, included, 'field_study_material_file') ||
      attrs.field_study_material_href ||
      '#',
    examPrograms,
    startDate: formatDate(attrs.field_start_date) || '01.01.2025',
    duration: attrs.field_duration || '120 minutes',
    fees: fees || '1000 SAR',
    language: language || 'Arabic',
    testType: attrs.field_test_type || 'Multiple choice, 100 questions',
    hosts,
    passingScore: attrs.field_passing_score || '',
    location:
      typeof attrs.field_location === 'string'
        ? attrs.field_location
        : attrs.field_location?.title || attrs.field_location?.uri || '',
    faqHref: attrs.field_faq_href || '#',
    registerHref: attrs.field_register_href || '#',
    chapters,
  };
}

export function transformEducationProject(
  project: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): EducationProjectData {
  const attrs = (project as any).attributes || {};
  const fileUrl = getFileUrl(project, included, 'field_project_file') || undefined;
  const relationships = (project as any).relationships || {};

  let partners: Array<{ id: string; name: string; logo?: string }> = [];
  let projectScopeSections: Array<{ id: string; title: string; content: string }> = [];
  let targetAudience: string[] = [];
  let projectDetails: Array<{ id: string; title: string; content: string }> = [];
  let categories: string[] = [];

  if (relationships.field_education_project_category?.data) {
    const catData = Array.isArray(relationships.field_education_project_category.data)
      ? relationships.field_education_project_category.data
      : [relationships.field_education_project_category.data];
    categories = catData
      .map((catRef: any) => {
        const catEntity = included.find((inc: DrupalIncludedEntity) => inc.id === catRef.id);
        return (catEntity as any)?.attributes?.name || '';
      })
      .filter(Boolean);
  }

  const partnerEntities = relationships.field_partners
    ? getRelated(relationships, 'field_partners', included) || []
    : [];
  if (Array.isArray(partnerEntities) && partnerEntities.length > 0) {
    partners = partnerEntities
      .map((partner: DrupalIncludedEntity) => {
        const partnerAttrs = (partner as any).attributes || {};
        const partnerImageRel = getRelated(
          (partner as any).relationships || {},
          'field_image',
          included,
        );
        const partnerImage =
          partnerImageRel && !Array.isArray(partnerImageRel)
            ? getImageWithAlt(partnerImageRel, included)
            : undefined;
        return {
          id: partner.id,
          name: partnerAttrs.name || partnerAttrs.title || '',
          logo: partnerImage?.src,
        };
      })
      .filter((partner) => partner.name);
  } else if (attrs.field_partners) {
    try {
      partners = JSON.parse(attrs.field_partners);
    } catch (e) {
      console.warn('Failed to parse partners:', e);
    }
  }

  const scopeSectionsParagraphs = relationships.field_project_scope_sections_p
    ? getRelated(relationships, 'field_project_scope_sections_p', included) || []
    : [];
  if (Array.isArray(scopeSectionsParagraphs) && scopeSectionsParagraphs.length > 0) {
    projectScopeSections = scopeSectionsParagraphs
      .map((section: DrupalIncludedEntity, index: number) => {
        const sectionAttrs = (section as any).attributes || {};
        const title = ensureString(sectionAttrs.field_title || sectionAttrs.title);
        const content = ensureString(sectionAttrs.field_content);
        return {
          id: section.id || `project-scope-${index}`,
          title,
          content,
        };
      })
      .filter((section) => section.title || section.content);
  }

  const targetAudienceParagraphs = relationships.field_target_audience_items
    ? getRelated(relationships, 'field_target_audience_items', included) || []
    : [];
  if (Array.isArray(targetAudienceParagraphs) && targetAudienceParagraphs.length > 0) {
    targetAudience = targetAudienceParagraphs
      .map((item: DrupalIncludedEntity) => {
        const itemAttrs = (item as any).attributes || {};
        return ensureString(itemAttrs.field_text || itemAttrs.field_title || itemAttrs.title);
      })
      .filter(Boolean);
  }

  const projectDetailsParagraphs = relationships.field_project_details_p
    ? getRelated(relationships, 'field_project_details_p', included) || []
    : [];
  if (Array.isArray(projectDetailsParagraphs) && projectDetailsParagraphs.length > 0) {
    projectDetails = projectDetailsParagraphs
      .map((detail: DrupalIncludedEntity, index: number) => {
        const detailAttrs = (detail as any).attributes || {};
        const title = ensureString(detailAttrs.field_title || detailAttrs.title);
        const content = ensureString(detailAttrs.field_content);
        return {
          id: detail.id || `project-detail-${index}`,
          title,
          content,
        };
      })
      .filter((detail) => detail.title || detail.content);
  }

  return {
    id: project.id,
    title: attrs.title || 'Untitled Education Project',
    description: ensureString(attrs.field_description),
    details: ensureString(attrs.field_details),
    fileUrl,
    categories,
    partners,
    projectScopeDescription: attrs.field_project_scope_description || '',
    projectScopeSections,
    targetAudience,
    projectDetails,
  };
}

export function transformMediaTab(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): MediaTabData {
  const attrs = (tab as any).attributes || {};

  return {
    id: attrs.field_tab_id || 'tab',
    label: attrs.title || 'Untitled Tab',
  };
}

// Mapper: Convert QualificationData to format expected by component
export function mapQualificationToCard(qualification: QualificationData): QualificationForCard {
  return {
    id: qualification.id,
    title: qualification.title,
    description: qualification.description,
    link: `/services/ip-academy/qualifications/${qualification.id}`,
  };
}

// Mapper: Convert EducationProjectData to format expected by component
export function mapEducationProjectToCard(project: EducationProjectData): EducationProjectForCard {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.categories[0] || '',
    fileUrl: project.fileUrl || '#',
    detailsUrl: `/services/ip-academy/education-projects/${project.id}`,
  };
}

export function transformIPAcademyPage(
  node: DrupalIPAcademyPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPAcademyData {
  const attrs = node.attributes as any;
  console.log('🔄 Transforming IP Academy page data...');
  console.log('Node attributes:', attrs);
  console.log('Included entities count:', included.length);

  const rels = node.relationships || {};

  // Get hero image from relationships
  const heroImageRel = getRelated(rels, 'field_hero_background_image', included);
  const heroImage =
    heroImageRel && !Array.isArray(heroImageRel)
      ? getImageWithAlt(heroImageRel, included)
      : undefined;

  // Get statistics items
  const statisticsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', included) || []
    : [];
  console.log('📊 Statistics data from getRelated:', statisticsData);
  console.log(
    '📊 Statistics data length:',
    Array.isArray(statisticsData) ? statisticsData.length : 'not an array',
  );
  console.log(
    '📊 Statistics IDs:',
    Array.isArray(statisticsData) ? statisticsData.map((s: any) => s.id) : 'N/A',
  );

  const statistics = Array.isArray(statisticsData)
    ? statisticsData.map((item: DrupalIncludedEntity) => transformStatisticsItem(item, included))
    : [];
  console.log('📊 Transformed statistics count:', statistics.length);
  console.log(
    '📊 Transformed statistics labels:',
    statistics.map((s) => s.label),
  );

  // Get training programs
  const trainingProgramsData = node.relationships?.field_training_programs
    ? getRelated(node.relationships, 'field_training_programs', included) || []
    : [];
  console.log('Training programs data:', trainingProgramsData);
  const trainingPrograms = Array.isArray(trainingProgramsData)
    ? trainingProgramsData.map((program: DrupalIncludedEntity) =>
        transformTrainingProgram(program, included),
      )
    : [];
  console.log('Transformed training programs:', trainingPrograms);

  // Get qualifications
  const qualificationsData = node.relationships?.field_qualifications
    ? getRelated(node.relationships, 'field_qualifications', included) || []
    : [];
  console.log('Qualifications data:', qualificationsData);
  const qualifications = Array.isArray(qualificationsData)
    ? qualificationsData.map((qualification: DrupalIncludedEntity) =>
        transformQualification(qualification, included),
      )
    : [];
  console.log('Transformed qualifications:', qualifications);

  // Get education projects
  const educationProjectsData = node.relationships?.field_education_projects
    ? getRelated(node.relationships, 'field_education_projects', included) || []
    : [];
  console.log('Education projects data:', educationProjectsData);
  const educationProjects = Array.isArray(educationProjectsData)
    ? educationProjectsData.map((project: DrupalIncludedEntity) =>
        transformEducationProject(project, included),
      )
    : [];
  console.log('Transformed education projects:', educationProjects);

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', included) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => transformMediaTab(tab, included))
    : [];

  // Build offers from Drupal fields
  // Get images from Drupal or use defaults
  const trainingImageData =
    node.relationships && getRelated(node.relationships, 'field_offers_training_image', included);
  const qualImageData =
    node.relationships && getRelated(node.relationships, 'field_offers_qual_image', included);
  const eduImageData =
    node.relationships && getRelated(node.relationships, 'field_offers_edu_image', included);

  const trainingImage =
    trainingImageData && !Array.isArray(trainingImageData)
      ? getImageWithAlt(trainingImageData, included)
      : null;
  const qualImage =
    qualImageData && !Array.isArray(qualImageData)
      ? getImageWithAlt(qualImageData, included)
      : null;
  const eduImage =
    eduImageData && !Array.isArray(eduImageData) ? getImageWithAlt(eduImageData, included) : null;

  const offers: OfferData[] = [
    {
      id: extractText(attrs.field_offers_training_id) || 'training',
      title: extractText(attrs.field_offers_training_title) || 'Training programs',
      description:
        extractText(attrs.field_offers_training_desc) ||
        'Our training programs are meticulously designed to provide you with the expertise needed to excel in the field of IP.',
      image: trainingImage || {
        src: '/images/services/ip-academy/training-programs.jpg',
        alt: 'Training programs at IP Academy',
      },
      buttonLabel: extractText(attrs.field_offers_training_btn_label) || 'Learn more',
      buttonHref:
        extractText(attrs.field_offers_training_btn_href) || '/services/ip-academy?tab=training',
    },
    {
      id: extractText(attrs.field_offers_qual_id) || 'qualifications',
      title: extractText(attrs.field_offers_qual_title) || 'Professional qualifications',
      description:
        extractText(attrs.field_offers_qual_desc) ||
        'Professional qualifications aim to support the professional development of specialists and practitioners in the domains of IP.',
      image: qualImage || {
        src: '/images/services/ip-academy/professional-qualifications.jpg',
        alt: 'Professional qualifications at IP Academy',
      },
      buttonLabel: extractText(attrs.field_offers_qual_btn_label) || 'Learn more',
      buttonHref:
        extractText(attrs.field_offers_qual_btn_href) || '/services/ip-academy?tab=qualifications',
    },
    {
      id: extractText(attrs.field_offers_edu_id) || 'projects',
      title: extractText(attrs.field_offers_edu_title) || 'Education projects',
      description:
        extractText(attrs.field_offers_edu_desc) ||
        'Education projects designed to foster learning, skill development, and knowledge sharing.',
      image: eduImage || {
        src: '/images/services/ip-academy/education-projects.jpg',
        alt: 'Education projects at IP Academy',
      },
      buttonLabel: extractText(attrs.field_offers_edu_btn_label) || 'Learn more',
      buttonHref:
        extractText(attrs.field_offers_edu_btn_href) || '/services/ip-academy?tab=projects',
    },
  ];

  // Parse advantages from JSON
  let advantages: AdvantageData[] = [];
  if (attrs.field_key_advantages) {
    try {
      advantages = JSON.parse(attrs.field_key_advantages);
    } catch (e) {
      console.warn('Failed to parse key advantages:', e);
      advantages = [
        {
          title: 'Skills assessment',
          description:
            'Get a comprehensive evaluation of your skills with tailored development plans.',
        },
        {
          title: 'Access learning materials',
          description:
            'Access premium learning materials tailored to support your educational journey.',
        },
        {
          title: 'Quality services',
          description: 'Providing expert services that meet your budget and timelines.',
        },
      ];
    }
  } else {
    advantages = [
      {
        title: 'Skills assessment',
        description:
          'Get a comprehensive evaluation of your skills with tailored development plans.',
      },
      {
        title: 'Access learning materials',
        description:
          'Access premium learning materials tailored to support your educational journey.',
      },
      {
        title: 'Quality services',
        description: 'Providing expert services that meet your budget and timelines.',
      },
    ];
  }

  const result = {
    heroHeading: extractText(attrs.field_hero_heading) || 'IP Academy overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Through the training plan, the Academy provides a diversified suite of specialized and qualitative programs.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      statistics: {
        statistics,
        statisticsTitle: attrs.field_statistics_title || 'Statistics',
        statisticsCtaLabel: attrs.field_statistics_cta_label || 'View more statistics',
        statisticsCtaHref: attrs.field_statistics_cta_href || '/resources/statistics',
      },
      offers,
      advantages,
    },
    trainingPrograms,
    trainingProgramsForCards: trainingPrograms.map((program) =>
      mapTrainingProgramToCard(program, locale),
    ),
    trainingHeroTitle: ensureString(attrs.field_training_hero_title) || 'Training programs',
    trainingHeroDescription:
      ensureString(attrs.field_training_hero_desc) ||
      'Explore our diverse range of over 40 specialized training courses.',
    qualifications,
    qualificationsForCards: qualifications.map(mapQualificationToCard),
    qualificationsHeroTitle:
      ensureString(attrs.field_qual_hero_title) || 'Professional qualifications',
    qualificationsHeroDescription:
      ensureString(attrs.field_qual_hero_desc) ||
      'Professional qualifications aim to support the professional development of specialists.',
    educationProjects,
    educationProjectsForCards: educationProjects.map(mapEducationProjectToCard),
    projectsHeroTitle: ensureString(attrs.field_projects_hero_title) || 'Education projects',
    projectsHeroDescription:
      ensureString(attrs.field_projects_hero_desc) ||
      'Education projects designed to foster learning and skill development.',
    media: {
      heroTitle: extractText(attrs.field_media_hero_title) || 'Media for IP Academy',
      heroDescription:
        extractText(attrs.field_media_hero_description) ||
        'Here you can find news related to IP Academy.',
      heroImage: '/images/ip-academy/hero.jpg',
      tabs:
        mediaTabs.length > 0
          ? mediaTabs
          : [
              { id: 'news', label: extractText(attrs.field_media_news_title) || 'News' },
              { id: 'videos', label: extractText(attrs.field_media_videos_title) || 'Videos' },
              {
                id: 'articles',
                label: extractText(attrs.field_media_articles_title) || 'Articles',
              },
            ],
      content: {
        news: {
          title: extractText(attrs.field_media_news_title) || 'News',
          description:
            extractText(attrs.field_media_news_description) ||
            'Get the latest information about news related to IP academy in Saudi Arabia.',
        },
        videos: {
          title: extractText(attrs.field_media_videos_title) || 'Videos',
          description:
            extractText(attrs.field_media_videos_description) ||
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about IP Academy.',
        },
        articles: {
          title: extractText(attrs.field_media_articles_title) || 'Articles',
          description:
            extractText(attrs.field_media_articles_description) ||
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses to stay ahead in the world of intellectual property.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        {
          id: 'date',
          label: 'Date',
          type: 'date',
          variant: 'range' as const,
          placeholder: 'Select date',
        },
      ] as FilterFieldData[],
      badgeLabel: 'IP Academy',
    },
  };

  console.log('✅ Final transformed result:', result);
  return result;
}

export function getIPAcademyFallbackData(): IPAcademyData {
  return {
    heroHeading: 'IP Academy overview',
    heroSubheading:
      'Through the training plan, the Academy provides a diversified suite of specialized and qualitative programs which are likely to contribute to developing the relevant staff, and support the IP initiatives in the KSA and MENA.',
    heroImage: {
      src: '/images/ip-academy/hero.jpg',
      alt: 'IP Academy overview',
    },
    overview: {
      statistics: {
        statistics: [
          {
            label: 'Number of courses SAIP has delivered',
            value: 200,
            chartType: 'line',
            chartData: [{ value: 100 }, { value: 120 }, { value: 150 }, { value: 200 }],
            trend: { value: '100%', direction: 'up', description: 'vs last month' },
          },
          {
            label: 'Number of learners SAIP has taught',
            value: 8000,
            chartType: 'line',
            chartData: [{ value: 4000 }, { value: 5000 }, { value: 7000 }, { value: 8000 }],
            trend: { value: '100%', direction: 'up', description: 'vs last month' },
          },
          {
            label: 'Number of dedicated courses SAIP has created for companies',
            value: 40,
            chartType: 'line',
            chartData: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }],
            trend: { value: '100%', direction: 'up', description: 'vs last month' },
          },
          {
            label: 'Number of institutions SAIP partner with',
            value: 100,
            chartType: 'line',
            chartData: [{ value: 20 }, { value: 40 }, { value: 70 }, { value: 100 }],
            trend: { value: '100%', direction: 'up', description: 'vs last month' },
          },
        ],
        statisticsTitle: 'Statistics',
        statisticsCtaLabel: 'View more statistics',
        statisticsCtaHref: '/resources/statistics',
      },
      offers: [
        {
          id: 'training',
          title: 'Training programs',
          description:
            "Our training programs are meticulously designed to provide you with the expertise needed to excel in the field of IP.<br/><br/>Whether you're looking to deepen your knowledge or enhance your professional skills, our programs offer a comprehensive and practical approach to IP education.",
          image: {
            src: '/images/services/ip-academy/training-programs.jpg',
            alt: 'Training programs at IP Academy',
          },
          buttonLabel: 'Learn more',
          buttonHref: '/services/ip-academy?tab=training',
        },
        {
          id: 'qualifications',
          title: 'Professional qualifications',
          description:
            'Professional qualifications aim to support the professional development of specialists and practitioners in the domains of IP by enhancing the quality of their performance in line with established professional standards.',
          image: {
            src: '/images/services/ip-academy/professional-qualifications.jpg',
            alt: 'Professional qualifications at IP Academy',
          },
          buttonLabel: 'Learn more',
          buttonHref: '/services/ip-academy?tab=qualifications',
        },
        {
          id: 'projects',
          title: 'Education projects',
          description:
            'Education projects designed to foster learning, skill development, and knowledge sharing, our initiatives support individuals and communities in achieving their full potential.',
          image: {
            src: '/images/services/ip-academy/education-projects.jpg',
            alt: 'Education projects at IP Academy',
          },
          buttonLabel: 'Learn more',
          buttonHref: '/services/ip-academy?tab=projects',
        },
      ],
      advantages: [
        {
          title: 'Skills assessment',
          description:
            'Get a comprehensive evaluation of your skills with tailored development plans.',
        },
        {
          title: 'Access learning materials',
          description:
            'Access premium learning materials tailored to support your educational journey.',
        },
        {
          title: 'Quality services',
          description: 'Providing expert services that meet your budget and timelines.',
        },
      ],
    },
    trainingPrograms: [
      {
        id: '1',
        title: 'Using data as an IP asset',
        description:
          "In today's digital economy, data is a crucial asset that can significantly enhance a company's competitive edge.",
        details:
          'This course is best suited for graduates, subject matter experts who are new to government advisory, policy analysts, and whole teams who wish to establish a shared view of quality advice.',
        forWhom:
          'This course is best suited for graduates, subject matter experts who are new to government advisory, policy analysts, and whole teams who wish to establish a shared view of quality advice.',
        whatYouWillLearn: [
          'Automate routine tasks',
          'Unleash creativity and problem-solving with AI',
          'Develop prompts for GPT-4, ChatGPT, and LLMs',
          'Integrate AI into your daily workflows',
          'Deepen AI knowledge',
        ],
        startDate: '10.12.2024',
        duration: '3 hours',
        fees: 'Free',
        language: 'English',
        category: 'Copyrights',
        hosts: 'Umm Al-Qura University',
        location: 'SAIP office',
        faqHref: '#',
        registerHref: '#',
        registerNote:
          'Register by 26.01.2025 to secure your spot in the course starting on 26.03.2025',
        courseFormat:
          'This one-day course is designed with a self-paced approach to accommodate your schedule.',
        courseMaterials:
          'This course includes 12 months of access to our self-paced online platform, featuring: 8 video lessons, downloadable materials, sample exams, quizzes, and more.',
        courseMaterialsHref: '#',
        relatedServicesTitle: 'Related services',
        relatedServicesDescription: 'Short description',
        programme: [
          {
            id: 'course1',
            title: 'Course 1',
            subtitle: 'Introduction to data as an IP',
            description: '',
          },
          {
            id: 'course2',
            title: 'Course 2',
            subtitle: 'Legal frameworks and data protection',
            description: '',
          },
          {
            id: 'course3',
            title: 'Course 3',
            subtitle: 'Data valuation techniques',
            description: '',
          },
          {
            id: 'course4',
            title: 'Course 4',
            subtitle: 'Strategic data management',
            description: '',
          },
          {
            id: 'course5',
            title: 'Course 5',
            subtitle: 'Wrap-up and closing remarks',
            description: '',
          },
        ],
      },
    ],
    trainingProgramsForCards: [
      {
        id: '1',
        title: 'Using data as an IP asset',
        date: '10.12.2024',
        time: '11:00 AM',
        category: 'Copyrights',
        duration: '3 hours',
        location: 'SAIP office',
        host: 'Umm Al-Qura University',
        fees: 'Free',
        registerHref: '#',
      },
    ],
    trainingHeroTitle: 'Training programs',
    trainingHeroDescription:
      'Explore our diverse range of over 40 specialized training courses designed to advance your skills in 10 distinct areas. Get professional-level training that aligns with your career goals and prepares you for success.',
    qualifications: [
      {
        id: '1',
        title: 'Professional examination for IP agents',
        description:
          'The professional test for agents is one of the requirements for obtaining a license to practice activities providing services related to intellectual property.',
        details:
          'The test aims to build national professional cadres specialized in the field, and includes a number of knowledge, skills, practices and real-life examples that enable them to perform professionally and expertly in providing intellectual property services on behalf of others before the SAIP.',
        forWhom: [
          'Those wishing to obtain qualification to practice IP service provision activities before the SAIP',
          'Lawyers and specialists in professional offices and companies working in the field of law and providing legal and administrative consultations.',
        ],
        requirements: [
          'The Professional Examination for IP agents is part of the requirements for Saudi IP agents to obtain a practicing license from the SAIP.',
        ],
        studyMaterialLabel: 'Download study material',
        studyMaterialHref: '#',
        examPrograms: [
          {
            id: 'prep1',
            title: 'IP agent exam preparation program',
            description:
              'Get ready for the IP agent exam with our focused preparation program. Access key materials, practice exams, and support to ensure your success.',
            date: '18.01.2025',
            link: '#',
          },
        ],
        startDate: '01.01.2025 | 08.03.2025',
        duration: '120 minutes',
        fees: '1000 SAR',
        language: 'Arabic',
        testType: 'Multiple choice, 100 questions',
        passingScore: '70%',
        location: 'Test Center',
        faqHref: '#',
        registerHref: '#',
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1',
            subtitle: 'General introduction to IP',
            description:
              'This chapter provides a concise guide to the fundamentals of intellectual property (IP), its importance, and the different types of IP rights.',
          },
          {
            id: 'chapter2',
            title: 'Chapter 2',
            subtitle: 'Regulation, licensing and IP business',
            description:
              'Overview of IP regulation, licensing models, and the business aspects of managing IP assets.',
          },
        ],
      },
    ],
    qualificationsForCards: [
      {
        id: '1',
        title: 'Professional examination for IP agents',
        description:
          'The professional test for agents is one of the requirements for obtaining a license to practice activities providing services related to intellectual property.',
        link: '/services/ip-academy/qualifications/1',
      },
    ],
    qualificationsHeroTitle: 'Professional qualifications',
    qualificationsHeroDescription:
      'Professional qualifications aim to support the professional development of specialists and practitioners in the domains of IP by enhancing the quality of their performance in line with established professional standards.',
    educationProjects: [
      {
        id: '1',
        title: 'Integrating IP into general education studies project',
        description:
          'During the project, topics related to IP were incorporated into general education materials after being processed in an educational manner.',
        details:
          'Supporting initiatives were implemented in collaboration with the Ministry of Education to build the capacities of teachers and curriculum developers using the latest methods for teaching IP.',
        categories: [],
        partners: [
          {
            id: 'ministry-education',
            name: 'Ministry of Education',
            logo: '/images/partners/ministry-education.png',
          },
          {
            id: 'saip',
            name: 'Saudi Authority for Intellectual Property',
            logo: '/images/partners/saip.png',
          },
        ],
        projectScopeDescription:
          'This course includes 12 months of access to our self-paced online platform, featuring:',
        projectScopeSections: [
          {
            id: 'ip-overview',
            title: 'IP overview',
            content:
              'Concept of IP, Importance of IP protection, Penalties for IP infringement, IP protection authorities international treaties & agreements',
          },
          {
            id: 'patent',
            title: 'Patent',
            content:
              'Patent concept and objectives, Patent registration and rights, Protection of plant varieties and agricultural products, Protection of industrial designs and models',
          },
        ],
        targetAudience: ['Teachers', 'General education students'],
        projectDetails: [
          {
            id: 'secondary-stage',
            title: 'Secondary stage',
            content:
              'Subjects: Islamic studies (Hadith - Fiqh - Inheritance), Critical thinking, English language, Digital citizenship, Life skills',
          },
          {
            id: 'intermediate-stage',
            title: 'Intermediate stage',
            content: 'Subjects: Social studies, Critical thinking, Arabic studies, Art',
          },
        ],
      },
    ],
    educationProjectsForCards: [
      {
        id: '1',
        title: 'Integrating IP into general education studies project',
        description:
          'During the project, topics related to IP were incorporated into general education materials after being processed in an educational manner.',
        category: 'Education',
        fileUrl: '#',
        detailsUrl: '/services/ip-academy/projects/1',
      },
    ],
    projectsHeroTitle: 'Education projects',
    projectsHeroDescription:
      'Education projects designed to foster learning, skill development, and knowledge sharing. Our initiatives support individuals and communities in achieving their full potential.',
    media: {
      heroTitle: 'Media for IP Academy',
      heroDescription: 'Here you can find news related to IP Academy.',
      heroImage: '/images/ip-academy/hero.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
        { id: 'articles', label: 'Articles' },
      ],
      content: {
        news: {
          title: 'News',
          description:
            'Get the latest information about news related to IP academy in Saudi Arabia.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about IP Academy.',
        },
        articles: {
          title: 'Articles',
          description:
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses to stay ahead in the world of intellectual property.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        {
          id: 'date',
          label: 'Date',
          type: 'date',
          variant: 'range' as const,
          placeholder: 'Select date',
        },
      ] as FilterFieldData[],
      badgeLabel: 'IP Academy',
    },
  };
}

export async function getIPAcademyPageData(locale?: string): Promise<IPAcademyData> {
  try {
    const [response, categoryOptions] = await Promise.all([
      fetchIPAcademyPage(locale),
      fetchEducationProjectCategories(locale),
    ]);

    if (!response) {
      console.log(`🔴 IP ACADEMY: Using fallback data ❌ (${locale || 'en'})`);
      const fallback = getIPAcademyFallbackData();
      const fallbackPrograms = await getAllTrainingPrograms(locale);
      if (fallbackPrograms.length > 0) {
        return {
          ...fallback,
          trainingPrograms: fallbackPrograms,
          trainingProgramsForCards: fallbackPrograms.map((program) =>
            mapTrainingProgramToCard(program, locale),
          ),
        };
      }
      return fallback;
    }

    const { node, included } = response;
    const data = transformIPAcademyPage(node, included, locale);
    data.educationProjectCategoryOptions = categoryOptions;
    const linkedPrograms = data.trainingPrograms || [];
    if (!linkedPrograms.length) {
      const allPrograms = await getAllTrainingPrograms(locale);
      if (allPrograms.length > 0) {
        data.trainingPrograms = allPrograms;
        data.trainingProgramsForCards = allPrograms.map((program) =>
          mapTrainingProgramToCard(program, locale),
        );
      }
    }

    console.log(
      `🟢 IP ACADEMY: Using Drupal data with ${data.overview.statistics.statistics.length} statistics ✅ (${locale || 'en'})`,
    );
    return data;
  } catch (error) {
    console.log(`🔴 IP ACADEMY: Using fallback data ❌ (${locale || 'en'})`);
    return getIPAcademyFallbackData();
  }
}

// ============================================
// SINGLE ITEM FETCHERS (for detail pages)
// ============================================

/**
 * Fetch a single qualification by ID (NID or UUID)
 */
export async function fetchQualificationById(
  id: string,
  locale?: string,
): Promise<QualificationData | null> {
  try {
    // First get UUID without locale
    const isUuid = id.includes('-');
    let nodeUuid = id;

    if (!isUuid) {
      // ID is NID, need to get UUID first
      const response = await fetchDrupal<any>(
        `/node/qualification?filter[drupal_internal__nid]=${id}`,
        {},
        'en',
      );
      nodeUuid = response.data?.[0]?.id;
      if (!nodeUuid) {
        console.log(`🔴 QUALIFICATION: Node ${id} not found`);
        return null;
      }
    }

    const includeFields = ['field_study_material_file', 'field_category'];
    const response = await fetchDrupal<any>(
      `/node/qualification/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    if (!node) return null;

    console.log(`🟢 QUALIFICATION: Fetched ${node.attributes?.title} (${locale || 'en'})`);
    return transformQualification(node, response.included || []);
  } catch (error) {
    console.error(`Failed to fetch qualification ${id}:`, error);
    return null;
  }
}

/**
 * Fetch a single training program by ID (NID or UUID)
 */
export async function fetchTrainingProgramById(
  id: string,
  locale?: string,
): Promise<TrainingProgramData | null> {
  try {
    const isUuid = id.includes('-');
    let nodeUuid = id;

    if (!isUuid) {
      const response = await fetchDrupal<any>(
        `/node/training_program?filter[drupal_internal__nid]=${id}`,
        {},
        'en',
      );
      nodeUuid = response.data?.[0]?.id;
      if (!nodeUuid) {
        console.log(`🔴 TRAINING PROGRAM: Node ${id} not found`);
        return null;
      }
    }

    // Fetch with UUID, locale, and include file
    const response = await fetchDrupal<any>(
      `/node/training_program/${nodeUuid}?include=field_study_material_file`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    if (!node) return null;

    console.log(`🟢 TRAINING PROGRAM: Fetched ${node.attributes?.title} (${locale || 'en'})`);
    return transformTrainingProgram(node, response.included || []);
  } catch (error) {
    console.error(`Failed to fetch training program ${id}:`, error);
    return null;
  }
}

/**
 * Fetch a single education project by ID (NID or UUID)
 */
export async function fetchEducationProjectById(
  id: string,
  locale?: string,
): Promise<EducationProjectData | null> {
  try {
    const isUuid = id.includes('-');
    let nodeUuid = id;

    if (!isUuid) {
      const response = await fetchDrupal<any>(
        `/node/education_project?filter[drupal_internal__nid]=${id}`,
        {},
        'en',
      );
      nodeUuid = response.data?.[0]?.id;
      if (!nodeUuid) {
        console.log(`🔴 EDUCATION PROJECT: Node ${id} not found`);
        return null;
      }
    }

    const includeFields = [
      'field_project_file',
      'field_education_project_category',
      'field_project_scope_sections_p',
      'field_project_details_p',
      'field_target_audience_items',
      'field_partners',
      'field_partners.field_image',
    ];
    const response = await fetchDrupal<any>(
      `/node/education_project/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    if (!node) return null;

    console.log(`🟢 EDUCATION PROJECT: Fetched ${node.attributes?.title} (${locale || 'en'})`);
    return transformEducationProject(node, response.included || []);
  } catch (error) {
    console.error(`Failed to fetch education project ${id}:`, error);
    return null;
  }
}

/**
 * Get all qualifications for listing (with locale)
 */
export async function getAllQualifications(locale?: string): Promise<QualificationData[]> {
  try {
    const response = await fetchDrupal<any>(
      '/node/qualification?filter[status][value]=1&sort=-created&include=field_category',
      {},
      locale,
    );

    if (!response.data?.length) return [];

    return response.data.map((node: any) => transformQualification(node, response.included || []));
  } catch (error) {
    console.error('Failed to fetch qualifications:', error);
    return [];
  }
}

/**
 * Fetch related qualifications (excluding the current one)
 */
export async function fetchRelatedQualifications(
  currentId: string,
  locale?: string,
  limit: number = 5,
): Promise<QualificationData[]> {
  try {
    const allQualifications = await getAllQualifications(locale);
    // Filter out the current qualification and limit results
    return allQualifications
      .filter((q) => q.id !== currentId && !q.id.includes(currentId))
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch related qualifications:', error);
    return [];
  }
}

/**
 * Fetch related training programs (excluding the current one)
 */
export async function fetchRelatedTrainingPrograms(
  currentId: string,
  locale?: string,
  limit: number = 3,
): Promise<TrainingProgramData[]> {
  try {
    const allPrograms = await getAllTrainingPrograms(locale);
    return allPrograms
      .filter((p) => p.id !== currentId && !p.id.includes(currentId))
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch related training programs:', error);
    return [];
  }
}

/**
 * Get all training programs for listing (with locale)
 */
export async function getAllTrainingPrograms(locale?: string): Promise<TrainingProgramData[]> {
  try {
    const response = await fetchDrupal<any>(
      '/node/training_program?filter[status][value]=1&sort=-created',
      {},
      locale,
    );

    if (!response.data?.length) return [];

    return response.data.map((node: any) =>
      transformTrainingProgram(node, response.included || []),
    );
  } catch (error) {
    console.error('Failed to fetch training programs:', error);
    return [];
  }
}

/**
 * Get all education projects for listing (with locale)
 */
export async function getAllEducationProjects(locale?: string): Promise<EducationProjectData[]> {
  try {
    const response = await fetchDrupal<any>(
      '/node/education_project?filter[status][value]=1&sort=-created&include=field_project_file',
      {},
      locale,
    );

    if (!response.data?.length) return [];

    return response.data.map((node: any) =>
      transformEducationProject(node, response.included || []),
    );
  } catch (error) {
    console.error('Failed to fetch education projects:', error);
    return [];
  }
}
