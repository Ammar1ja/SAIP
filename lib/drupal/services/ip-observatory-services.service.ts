import { fetchDrupal } from '../utils';
import { extractText, getRelated, getImageUrl, getImageWithAlt } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for IP Observatory Services
export interface IpServiceData {
  id: string;
  classificationName: string;
  registrationNumber: string;
  status: string;
  date: string;
  type: string;
  country?: string;
  category?: string;
  applicantType?: string;
  fieldValue?: string;
  classification?: string;
}

export interface ChronologicalChartData {
  year: number;
  applications: number;
  status?: string;
  country?: string;
  category?: string;
  applicantType?: string;
  fieldValue?: string;
  classification?: string;
  registrationHistory?: string;
  grantHistory?: string;
}

export interface CountryChartData {
  country: string;
  applications: number;
  color: string;
  status?: string;
  category?: string;
  applicantType?: string;
  fieldValue?: string;
  classification?: string;
  registrationHistory?: string;
  grantHistory?: string;
}

export interface ApplicantChartData {
  type: string;
  percentage: number;
  applications: number;
  color: string;
  status?: string;
  country?: string;
  category?: string;
  fieldValue?: string;
  classification?: string;
  registrationHistory?: string;
  grantHistory?: string;
}

export interface StatisticsTextContent {
  chronologicalChart: {
    title: string;
    description: string;
    tooltip: {
      applications: string;
      year: string;
    };
  };
  countryChart: {
    title: string;
    description: string;
    tooltip: {
      applications: string;
      country: string;
    };
  };
  applicantTypeChart: {
    title: string;
    description: string;
    tooltip: {
      percentage: string;
      type: string;
    };
  };
}

export interface TabChartData {
  chronological: ChronologicalChartData[];
  country: CountryChartData[];
  applicant: ApplicantChartData[];
  textContent: StatisticsTextContent;
}

export interface TabChartDataByType {
  application: TabChartData;
  certificate: TabChartData;
}

export interface FilterField {
  id: string;
  type: 'date' | 'select';
  label: string;
  placeholder: string;
  options?: Array<{ label: string; value: string }>;
}

export interface IPObservatoryServicesData {
  hero: {
    title: string;
    description: string;
    backgroundImage?: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  tabs: string[];
  filters: string[];
  tableData: IpServiceData[];
  filterFields: FilterField[];
  tabsFilterFields: Record<string, FilterField[]>;
  tabsChartData: Record<string, TabChartDataByType>;
  lastDataUpdate?: string;
}

// Drupal fetch function - fetch base data to get included entities
async function fetchIPObservatoryServicesPageBase(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields =
    'field_hero_background_image,field_hero_background_image.field_media_image,field_tabs,field_tabs.field_image,field_tabs.field_image.field_media_image,field_filters,field_filters.field_filter_options,field_table_rows,field_tabs.field_filters,field_tabs.field_filters.field_filter_options';
  const fallbackIncludeFields =
    'field_hero_background_image,field_hero_background_image.field_media_image,field_tabs,field_tabs.field_image,field_tabs.field_image.field_media_image';
  const endpoint = `/node/ip_observatory_services_page?filter[status]=1&include=${includeFields}`;
  const fallbackEndpoint = `/node/ip_observatory_services_page?filter[status]=1&include=${fallbackIncludeFields}`;

  // Fetch without locale to get included entities (workaround for JSON:API bug)
  if (!locale) {
    try {
      return await fetchDrupal<DrupalNode>(endpoint, {});
    } catch (error) {
      console.log('⚠️ IP OBSERVATORY SERVICES: Retrying without filter includes');
      return await fetchDrupal<DrupalNode>(fallbackEndpoint, {});
    }
  }

  try {
    return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  } catch (error) {
    console.log('⚠️ IP OBSERVATORY SERVICES: Retrying without filter includes');
    return await fetchDrupal<DrupalNode>(fallbackEndpoint, {}, locale);
  }
}

// Fetch translated node attributes
async function fetchIPObservatoryServicesPageTranslated(
  nodeUuid: string,
  locale: string,
): Promise<DrupalNode | null> {
  try {
    // Fetch individual node with locale to get translated attributes
    const endpoint = `/node/ip_observatory_services_page/${nodeUuid}`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    return data || null;
  } catch (error) {
    console.error('Failed to fetch translated node:', error);
    return null;
  }
}

// Fetch chart data for a specific tab (node) by UUID
// NOTE: Paragraphs are not translatable as entities, but their FIELDS are.
// By passing locale, we set Accept-Language header which makes Drupal
// return translated field values (field_chart_title, field_chart_description) for that locale.
async function fetchTabChartData(
  tabUuid: string,
  locale?: string,
): Promise<DrupalIncludedEntity[]> {
  try {
    const endpoint = `/node/vertical_tab_item?filter[id]=${tabUuid}&include=field_chart_data`;
    console.log(
      `🔵 fetchTabChartData: Fetching for tab UUID ${tabUuid}, locale: ${locale || 'en'}`,
    );
    console.log(`🔵 Endpoint: ${endpoint}`);

    // NOTE: Now that field_chart_data is NON-translatable, we CAN pass locale
    // to get translated paragraph field values (field_chart_title, field_chart_description)
    const response = await fetchDrupal<DrupalNode[]>(endpoint, {}, locale);

    console.log(`🔵 fetchTabChartData: Got response with ${response.data?.length || 0} nodes`);
    console.log(`🔵 fetchTabChartData: Included count: ${response.included?.length || 0}`);

    if (response.included && response.included.length > 0) {
      const paragraphTypes = new Set(response.included.map((item) => item.type));
      console.log(`🔵 fetchTabChartData: Included types:`, Array.from(paragraphTypes));

      // Log first paragraph to check if we got translated fields
      const firstPara = response.included.find(
        (item) => item.type === 'paragraph--chart_data_item',
      );
      if (firstPara) {
        console.log(
          `🔵 First paragraph chart_title:`,
          (firstPara.attributes as any)?.field_chart_title,
        );
      }
    }

    return response.included || [];
  } catch (error) {
    console.error(`❌ Failed to fetch chart data for tab ${tabUuid}:`, error);
    return [];
  }
}

// Transform function
export function transformIPObservatoryServicesPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPObservatoryServicesData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};
  const formatDateForDisplay = (value?: string) => {
    if (!value) return undefined;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return undefined;
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const transformFilterParagraph = (paragraph: DrupalIncludedEntity): FilterField | null => {
    const pAttrs = paragraph.attributes as any;
    const pRels = paragraph.relationships || {};
    const filterId = extractText(pAttrs.field_filter_id) || '';
    const filterType = extractText(pAttrs.field_filter_type) || 'select';
    const label = extractText(pAttrs.field_filter_label) || '';
    const placeholderFromDrupal = extractText(pAttrs.field_filter_placeholder) || '';
    const fallbackPlaceholder =
      filterType === 'date'
        ? locale === 'ar'
          ? 'اختر التاريخ'
          : 'Select date'
        : locale === 'ar'
          ? 'اختر'
          : 'Select';
    const placeholder = placeholderFromDrupal || fallbackPlaceholder;

    if (!filterId) return null;

    const optionsRel = getRelated(pRels, 'field_filter_options', included);
    const options = Array.isArray(optionsRel)
      ? optionsRel
          .map((opt: any) => ({
            label: extractText(opt.attributes?.field_option_label) || '',
            value: extractText(opt.attributes?.field_option_value) || '',
          }))
          .filter((opt) => opt.label || opt.value)
      : [];

    return {
      id: filterId,
      type: filterType === 'date' ? 'date' : 'select',
      label,
      placeholder,
      options: options.length > 0 ? options : undefined,
    };
  };

  const buildFiltersFromNode = (
    nodeRelationships: Record<string, any>,
    fieldName: string,
  ): FilterField[] => {
    const filtersRel = getRelated(nodeRelationships, fieldName, included);
    if (!Array.isArray(filtersRel)) return [];
    return filtersRel.map(transformFilterParagraph).filter(Boolean) as FilterField[];
  };

  // Get tabs from Drupal
  const tabsData = getRelated(rels, 'field_tabs', included) || [];
  const hasDrupalTabs = Array.isArray(tabsData) && tabsData.length > 0;

  const defaultTabs = [
    'Patents',
    'Trademarks',
    'Copyrights',
    'Designs',
    'Plant varieties',
    'Topographic designs of IC',
  ];
  const defaultTabsAr = [
    'براءات الاختراع',
    'العلامات التجارية',
    'حقوق النشر',
    'التصاميم',
    'الأصناف النباتية',
    'التصاميم التخطيطية للدوائر المتكاملة',
  ];
  const tabs = hasDrupalTabs
    ? (tabsData as DrupalIncludedEntity[]).map(
        (tab) =>
          extractText((tab.attributes as any)?.title) ||
          extractText((tab.attributes as any)?.field_title) ||
          'Untitled',
      )
    : locale === 'ar'
      ? defaultTabsAr
      : defaultTabs;

  const defaultFilters = ['Registration application', 'Registration certificates'];
  const defaultFiltersAr = ['طلب تسجيل', 'شهادات التسجيل'];
  const filters = locale === 'ar' ? defaultFiltersAr : defaultFilters;

  // Helper function to create filter fields for each tab
  const createTabFilterFields = (tabName: string): FilterField[] => {
    const isAr = locale === 'ar';

    // Normalize tab names for comparison (handle both English and Arabic)
    const normalizedTab = tabName.toLowerCase();
    const isTrademarks =
      normalizedTab.includes('trademark') ||
      normalizedTab.includes('علامة') ||
      tabName === 'Trademarks' ||
      tabName === 'العلامات التجارية';
    const isCopyrights =
      normalizedTab.includes('copyright') ||
      normalizedTab.includes('حقوق') ||
      tabName === 'Copyrights' ||
      tabName === 'حقوق النشر';
    const isTopographicIC =
      normalizedTab.includes('topographic') ||
      normalizedTab.includes('تخطيطية') ||
      tabName === 'Topographic designs of IC' ||
      tabName === 'التصاميم التخطيطية للدوائر المتكاملة';
    const isDesigns =
      (normalizedTab.includes('design') || normalizedTab.includes('تصاميم')) &&
      !isTopographicIC &&
      (tabName === 'Designs' || tabName === 'التصاميم');
    const isPlantVarieties =
      normalizedTab.includes('plant') ||
      normalizedTab.includes('أصناف') ||
      tabName === 'Plant varieties' ||
      tabName === 'الأصناف النباتية';
    const isPatents =
      normalizedTab.includes('patent') ||
      normalizedTab.includes('براءة') ||
      tabName === 'Patents' ||
      tabName === 'براءات الاختراع';

    const baseFields: FilterField[] = [
      {
        id: 'depositDate',
        type: 'date' as const,
        label: isAr ? 'تاريخ الإيداع' : 'Deposit date',
        placeholder: isAr ? 'اختر التاريخ' : 'Select date',
      },
    ];

    if (isTrademarks) {
      // Trademarks: 6 fields in 2 rows
      return [
        ...baseFields,
        {
          id: 'registrationHistory',
          type: 'select' as const,
          label: isAr ? 'تاريخ التسجيل' : 'Registration history',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'مسجل' : 'Registered', value: 'registered' },
            { label: isAr ? 'قيد التسجيل' : 'Pending', value: 'pending' },
          ],
        },
        {
          id: 'country',
          type: 'select' as const,
          label: isAr ? 'الدولة' : 'Country',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'السعودية' : 'Saudi Arabia', value: 'sa' },
            { label: isAr ? 'الإمارات' : 'UAE', value: 'uae' },
          ],
        },
        {
          id: 'category',
          type: 'select' as const,
          label: isAr ? 'الفئة' : 'Category',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'فئة 1' : 'Category 1', value: 'cat1' },
            { label: isAr ? 'فئة 2' : 'Category 2', value: 'cat2' },
          ],
        },
        {
          id: 'applicantType',
          type: 'select' as const,
          label: isAr ? 'نوع المتقدم' : 'Applicant type',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'فرد' : 'Individual', value: 'individual' },
            { label: isAr ? 'شركة' : 'Company', value: 'company' },
          ],
        },
        {
          id: 'field',
          type: 'select' as const,
          label: isAr ? 'المجال' : 'Field',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'مجال 1' : 'Field 1', value: 'field1' },
            { label: isAr ? 'مجال 2' : 'Field 2', value: 'field2' },
          ],
        },
      ];
    }

    if (isCopyrights) {
      // Copyrights: 3 fields in 1 row
      return [
        ...baseFields,
        {
          id: 'grantHistory',
          type: 'select' as const,
          label: isAr ? 'تاريخ المنح' : 'Grant history',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'ممنوح' : 'Granted', value: 'granted' },
            { label: isAr ? 'قيد الانتظار' : 'Pending', value: 'pending' },
          ],
        },
        {
          id: 'field',
          type: 'select' as const,
          label: isAr ? 'المجال' : 'Field',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'مجال 1' : 'Field 1', value: 'field1' },
            { label: isAr ? 'مجال 2' : 'Field 2', value: 'field2' },
          ],
        },
      ];
    }

    if (isDesigns) {
      // Designs: 6 fields in 2 rows
      return [
        ...baseFields,
        {
          id: 'grantHistory',
          type: 'select' as const,
          label: isAr ? 'تاريخ المنح' : 'Grant history',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'ممنوح' : 'Granted', value: 'granted' },
            { label: isAr ? 'قيد الانتظار' : 'Pending', value: 'pending' },
          ],
        },
        {
          id: 'country',
          type: 'select' as const,
          label: isAr ? 'الدولة' : 'Country',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'السعودية' : 'Saudi Arabia', value: 'sa' },
            { label: isAr ? 'الإمارات' : 'UAE', value: 'uae' },
          ],
        },
        {
          id: 'category',
          type: 'select' as const,
          label: isAr ? 'الفئة' : 'Category',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'فئة 1' : 'Category 1', value: 'cat1' },
            { label: isAr ? 'فئة 2' : 'Category 2', value: 'cat2' },
          ],
        },
        {
          id: 'field',
          type: 'select' as const,
          label: isAr ? 'المجال' : 'Field',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'مجال 1' : 'Field 1', value: 'field1' },
            { label: isAr ? 'مجال 2' : 'Field 2', value: 'field2' },
          ],
        },
        {
          id: 'classification',
          type: 'select' as const,
          label: isAr ? 'التصنيف' : 'Classification',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'تصنيف 1' : 'Classification 1', value: 'class1' },
            { label: isAr ? 'تصنيف 2' : 'Classification 2', value: 'class2' },
          ],
        },
      ];
    }

    if (isPatents || isPlantVarieties || isTopographicIC) {
      // Patents, Plant varieties and Topographic designs of IC: 2 fields in 1 row
      return [
        ...baseFields,
        {
          id: 'grantHistory',
          type: 'select' as const,
          label: isAr ? 'تاريخ المنح' : 'Grant history',
          placeholder: isAr ? 'اختر' : 'Select',
          options: [
            { label: isAr ? 'الكل' : 'All', value: 'all' },
            { label: isAr ? 'ممنوح' : 'Granted', value: 'granted' },
            { label: isAr ? 'قيد الانتظار' : 'Pending', value: 'pending' },
          ],
        },
      ];
    }

    // Default: unknown tab - return base fields
    return baseFields;
  };

  // Create filter fields for each tab
  const tabsFilterFields: Record<string, FilterField[]> = {};
  tabs.forEach((tab) => {
    tabsFilterFields[tab] = createTabFilterFields(tab);
  });

  // Initialize empty chart data (will be populated in getIPObservatoryServicesPageData)
  const tabsChartData: Record<string, TabChartDataByType> = {};

  // Table data from Drupal (content-editor friendly)
  const tableRowsRel = getRelated(rels, 'field_table_rows', included);
  const tableDataFromDrupal: IpServiceData[] = Array.isArray(tableRowsRel)
    ? tableRowsRel.map((row: any, idx: number) => {
        const rowAttrs = row.attributes || {};
        return {
          id: String(row.id || idx),
          classificationName: extractText(rowAttrs.field_classification_name) || '',
          registrationNumber: extractText(rowAttrs.field_registration_number) || '',
          status: extractText(rowAttrs.field_status) || '',
          date: extractText(rowAttrs.field_date) || '',
          type: extractText(rowAttrs.field_registration_type) || '',
          country: extractText(rowAttrs.field_country) || '',
          category: extractText(rowAttrs.field_category) || '',
          applicantType: extractText(rowAttrs.field_applicant_type) || '',
          fieldValue: extractText(rowAttrs.field_field_value) || '',
          classification: extractText(rowAttrs.field_classification) || '',
        };
      })
    : [];

  const fallbackTableData: IpServiceData[] = [
    {
      id: '1',
      classificationName: locale === 'ar' ? 'طعام' : 'Food',
      registrationNumber: '0001',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-01-15',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '2',
      classificationName: locale === 'ar' ? 'الملابس والإكسسوارات' : 'Clothing and accessories',
      registrationNumber: '0002',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-01-20',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '3',
      classificationName:
        locale === 'ar' ? 'الأمتعة والحقائب والمظلات والعصي' : 'Luggage, bags, umbrellas and canes',
      registrationNumber: '0003',
      status: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
      date: '2024-01-25',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '4',
      classificationName: locale === 'ar' ? 'المفروشات المنزلية' : 'Home furnishings',
      registrationNumber: '0004',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-02-01',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '5',
      classificationName:
        locale === 'ar'
          ? 'المنسوجات بما في ذلك أغطية الأسرة والتنجيد'
          : 'Textile goods, including bed covers and upholstery',
      registrationNumber: '0005',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-02-05',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '6',
      classificationName:
        locale === 'ar'
          ? 'الحبال والحبال الصغيرة والشباك والخيام'
          : 'Ropes, small ropes, nets, and tents',
      registrationNumber: '0006',
      status: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
      date: '2024-02-10',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '7',
      classificationName:
        locale === 'ar'
          ? 'الورق والمنتجات الورقية بما في ذلك القرطاسية'
          : 'Paper and paper products, including stationery',
      registrationNumber: '0007',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-02-15',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '8',
      classificationName:
        locale === 'ar' ? 'الأدوات والأجهزة المنزلية' : 'Household tools and appliances',
      registrationNumber: '0008',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-02-20',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '9',
      classificationName:
        locale === 'ar' ? 'معدات صحية وتدفئة وتبريد' : 'Sanitary, heating, and cooling equipment',
      registrationNumber: '0009',
      status: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
      date: '2024-02-25',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
    {
      id: '10',
      classificationName:
        locale === 'ar' ? 'الساعات وأدوات القياس' : 'Watches and measuring instruments',
      registrationNumber: '0010',
      status: locale === 'ar' ? 'نشط' : 'Active',
      date: '2024-03-01',
      type: locale === 'ar' ? 'طلب تسجيل' : 'Registration application',
      country: '',
      category: '',
      applicantType: '',
      fieldValue: '',
      classification: '',
    },
  ];

  const tableData = tableDataFromDrupal.length > 0 ? tableDataFromDrupal : fallbackTableData;

  // Get hero background image from relationships
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(rels, 'field_hero_background_image', included);
        return imageRel && !Array.isArray(imageRel) ? getImageWithAlt(imageRel, included) : null;
      })()
    : null;

  const pageFilters = buildFiltersFromNode(rels, 'field_filters');

  const tabsFilterFieldsFromDrupal: Record<string, FilterField[]> = {};
  if (Array.isArray(tabsData)) {
    tabsData.forEach((tab) => {
      const tabTitle =
        extractText((tab.attributes as any)?.title) ||
        extractText((tab.attributes as any)?.field_title) ||
        'Untitled';
      const tabFilters = buildFiltersFromNode(tab.relationships || {}, 'field_filters');
      if (tabFilters.length > 0) {
        tabsFilterFieldsFromDrupal[tabTitle] = tabFilters;
      }
    });
  }

  return {
    hero: {
      title:
        extractText(attrs.field_hero_heading) ||
        (locale === 'ar' ? 'خدمات الملكية الفكرية' : 'IP Services'),
      description:
        extractText(attrs.field_hero_subheading) ||
        (locale === 'ar'
          ? 'نظرة عامة شاملة على إحصائيات خدمات الملكية الفكرية'
          : 'Comprehensive overview of IP services statistics'),
      backgroundImage: heroImage?.src,
    },
    overview: {
      heading:
        extractText((attrs as any).field_overview_heading) ||
        (locale === 'ar' ? 'نظرة عامة على خدمات الملكية الفكرية' : 'IP Services Overview'),
      description:
        extractText((attrs as any).field_overview_description) ||
        (locale === 'ar'
          ? 'توفر هذه الصفحة نظرة عامة شاملة على مؤشرات الملكية الفكرية الرئيسية من حيث الطلبات والتسجيلات عبر الزمن. يغطي هذا القسم جميع فئات الملكية الفكرية بما في ذلك براءات الاختراع والتصاميم والعلامات التجارية وحقوق النشر والتصاميم التخطيطية للدوائر المتكاملة والأصناف النباتية.'
          : 'This page provides a comprehensive overview of key IP indicators in terms of applications and registrations over time. This section covers all IP categories including patents, designs, trademarks, copyrights, topographic designs of integrated circuits and plant varieties.'),
    },
    tabs,
    filters,
    tableData,
    filterFields:
      pageFilters.length > 0
        ? pageFilters
        : [
            {
              id: 'date',
              type: 'date' as const,
              label: locale === 'ar' ? 'التاريخ' : 'Date',
              placeholder: locale === 'ar' ? 'اختر التاريخ' : 'Select date',
            },
            {
              id: 'status',
              type: 'select' as const,
              label: locale === 'ar' ? 'الحالة' : 'Status',
              placeholder: locale === 'ar' ? 'اختر الحالة' : 'Select status',
              options: [
                { label: locale === 'ar' ? 'نشط' : 'Active', value: 'Active' },
                { label: locale === 'ar' ? 'قيد الانتظار' : 'Pending', value: 'Pending' },
              ],
            },
          ],
    tabsFilterFields:
      Object.keys(tabsFilterFieldsFromDrupal).length > 0
        ? tabsFilterFieldsFromDrupal
        : tabsFilterFields,
    tabsChartData,
    lastDataUpdate: formatDateForDisplay(
      attrs.field_last_data_update || attrs.changed || attrs.created,
    ),
  };
}

// Fallback data function
export function getIPObservatoryServicesFallbackData(locale?: string): IPObservatoryServicesData {
  return transformIPObservatoryServicesPage(
    { attributes: {}, relationships: {} } as DrupalNode,
    [],
    locale,
  );
}

// Main export function
export async function getIPObservatoryServicesPageData(
  locale?: string,
): Promise<IPObservatoryServicesData> {
  try {
    console.log(`🔵 IP OBSERVATORY SERVICES: Fetching data from Drupal (${locale || 'en'})...`);

    // Step 1: Fetch base data (EN) to get included entities
    const baseResponse = await fetchIPObservatoryServicesPageBase();
    const baseNodes = baseResponse.data;
    let included = baseResponse.included || [];

    if (locale && locale !== 'en') {
      const localizedResponse = await fetchIPObservatoryServicesPageBase(locale);
      if (localizedResponse.included && localizedResponse.included.length > 0) {
        included = localizedResponse.included;
      }
    }

    console.log(`📊 IP OBSERVATORY SERVICES: Found ${baseNodes.length} node(s)`);

    if (baseNodes.length === 0) {
      console.log(
        `🔴 IP OBSERVATORY SERVICES: Using fallback data ❌ (${locale || 'en'}) - No nodes found`,
      );
      return getIPObservatoryServicesFallbackData(locale);
    }

    const mergeIncluded = (entities: DrupalIncludedEntity[] = []) => {
      if (entities.length === 0) return;
      const existing = new Set(included.map((item) => `${item.type}:${item.id}`));
      entities.forEach((entity) => {
        const key = `${entity.type}:${entity.id}`;
        if (!existing.has(key)) {
          existing.add(key);
          included.push(entity);
        }
      });
    };

    const collectRelationIds = (data: any): string[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data.map((item) => item.id).filter(Boolean);
      return data?.id ? [data.id] : [];
    };

    const fetchParagraphsByIds = async (
      paragraphType: string,
      ids: string[],
      includeQuery = '',
    ) => {
      if (!ids.length) return;
      const endpoint = `/paragraph/${paragraphType}?filter[id][operator]=IN&filter[id][value]=${ids.join(
        ',',
      )}${includeQuery}`;
      const response = await fetchDrupal(endpoint, {}, locale);
      if (response.data && response.data.length > 0) {
        mergeIncluded(response.data as DrupalIncludedEntity[]);
      }
      if (response.included && response.included.length > 0) {
        mergeIncluded(response.included as DrupalIncludedEntity[]);
      }
    };

    const baseNode = baseNodes[0];
    const pageFilterIds = collectRelationIds(baseNode.relationships?.field_filters?.data);
    const tableRowIds = collectRelationIds(baseNode.relationships?.field_table_rows?.data);

    if (pageFilterIds.length > 0) {
      const alreadyIncludedFilters = included.some(
        (item) => item.type === 'paragraph--ip_observatory_filter',
      );
      if (!alreadyIncludedFilters) {
        await fetchParagraphsByIds(
          'ip_observatory_filter',
          pageFilterIds,
          '&include=field_filter_options',
        );
      }
    }

    if (tableRowIds.length > 0) {
      const alreadyIncludedRows = included.some(
        (item) => item.type === 'paragraph--ip_observatory_table_row',
      );
      if (!alreadyIncludedRows) {
        await fetchParagraphsByIds('ip_observatory_table_row', tableRowIds);
      }
    }

    const tabRelIds = collectRelationIds(baseNode.relationships?.field_tabs?.data);
    let tabEntities = included.filter(
      (item) => item.type === 'node--vertical_tab_item' && tabRelIds.includes(item.id),
    );
    if (tabRelIds.length > 0 && tabEntities.length < tabRelIds.length) {
      const endpoint = `/node/vertical_tab_item?filter[id][operator]=IN&filter[id][value]=${tabRelIds.join(
        ',',
      )}`;
      const response = await fetchDrupal(endpoint, {}, locale);
      if (response.data && response.data.length > 0) {
        mergeIncluded(response.data as DrupalIncludedEntity[]);
      }
      tabEntities = included.filter(
        (item) => item.type === 'node--vertical_tab_item' && tabRelIds.includes(item.id),
      );
    }

    const tabFilterIds = tabEntities.flatMap((tab) =>
      collectRelationIds((tab as any).relationships?.field_filters?.data),
    );
    if (tabFilterIds.length > 0) {
      const alreadyIncludedTabFilters = included.some(
        (item) => item.type === 'paragraph--ip_observatory_filter',
      );
      if (!alreadyIncludedTabFilters) {
        await fetchParagraphsByIds(
          'ip_observatory_filter',
          tabFilterIds,
          '&include=field_filter_options',
        );
      }
    }

    let node = baseNodes[0];

    // Step 2: If locale is not default (en), fetch translated node
    if (locale && locale !== 'en') {
      console.log(`🔵 IP OBSERVATORY SERVICES: Fetching translated node for locale: ${locale}`);
      const translatedNode = await fetchIPObservatoryServicesPageTranslated(node.id, locale);

      if (translatedNode) {
        console.log(`✅ Got translated node, merging with base data...`);
        // Use translated node's attributes, but keep base node's relationships
        node = {
          ...translatedNode,
          relationships: node.relationships, // Keep relationships from base fetch
        };
      } else {
        console.log(`⚠️  Failed to fetch translated node, using base node`);
      }
    }

    const data = transformIPObservatoryServicesPage(node, included, locale);

    // Fetch chart data for each tab
    console.log(`🔵 IP OBSERVATORY SERVICES: Checking field_tabs relationship...`);
    console.log(
      `🔵 node.relationships:`,
      node.relationships ? Object.keys(node.relationships) : 'undefined',
    );
    console.log(`🔵 node.relationships.field_tabs:`, node.relationships?.field_tabs);
    console.log(`🔵 included.length:`, included.length);

    const tabsData = (getRelated(node.relationships || {}, 'field_tabs', included) ||
      []) as DrupalIncludedEntity[];

    console.log(`🔵 tabsData type:`, Array.isArray(tabsData) ? 'array' : typeof tabsData);
    console.log(`🔵 tabsData.length:`, Array.isArray(tabsData) ? tabsData.length : 'N/A');

    if (Array.isArray(tabsData) && tabsData.length > 0) {
      console.log(`🟢 Processing ${tabsData.length} tabs...`);
      for (const tab of tabsData) {
        const tabTitle =
          extractText((tab.attributes as any)?.title) ||
          extractText((tab.attributes as any)?.field_title) ||
          '';
        const tabId = tab.id;

        // Fetch chart data for this tab
        const chartDataIncluded = await fetchTabChartData(tabId, locale);

        // Separate data by registration type
        const applicationData = {
          chronological: [] as ChronologicalChartData[],
          country: [] as CountryChartData[],
          applicant: [] as ApplicantChartData[],
        };

        const certificateData = {
          chronological: [] as ChronologicalChartData[],
          country: [] as CountryChartData[],
          applicant: [] as ApplicantChartData[],
        };

        for (const item of chartDataIncluded) {
          if (item.type === 'paragraph--chart_data_item') {
            const itemAttrs = item.attributes as any;
            const chartType = itemAttrs.field_chart_type;
            const registrationType = itemAttrs.field_registration_type || 'application';

            const targetData =
              registrationType === 'certificate' ? certificateData : applicationData;

            if (chartType === 'chronological') {
              const rawYear = itemAttrs.field_chart_year || itemAttrs.field_year || 0;
              targetData.chronological.push({
                year: Number(rawYear) || 0,
                applications: itemAttrs.field_applications_count || 0,
                status: itemAttrs.field_chart_status || undefined,
                country: itemAttrs.field_country || undefined,
                category: itemAttrs.field_category || undefined,
                applicantType: itemAttrs.field_applicant_type || undefined,
                fieldValue: itemAttrs.field_field_value || undefined,
                classification: itemAttrs.field_classification || undefined,
                registrationHistory: itemAttrs.field_registration_history || undefined,
                grantHistory: itemAttrs.field_grant_history || undefined,
              });
            } else if (chartType === 'country') {
              targetData.country.push({
                country: itemAttrs.field_country_name || '',
                applications: itemAttrs.field_applications_count || 0,
                color: itemAttrs.field_chart_color || '#000000',
                status: itemAttrs.field_chart_status || undefined,
                category: itemAttrs.field_category || undefined,
                applicantType: itemAttrs.field_applicant_type || undefined,
                fieldValue: itemAttrs.field_field_value || undefined,
                classification: itemAttrs.field_classification || undefined,
                registrationHistory: itemAttrs.field_registration_history || undefined,
                grantHistory: itemAttrs.field_grant_history || undefined,
              });
            } else if (chartType === 'applicant') {
              targetData.applicant.push({
                type: itemAttrs.field_applicant_type || '',
                percentage: itemAttrs.field_percentage || 0,
                applications: itemAttrs.field_applications_count || 0,
                color: itemAttrs.field_chart_color || '#000000',
                status: itemAttrs.field_chart_status || undefined,
                country: itemAttrs.field_country || undefined,
                category: itemAttrs.field_category || undefined,
                fieldValue: itemAttrs.field_field_value || undefined,
                classification: itemAttrs.field_classification || undefined,
                registrationHistory: itemAttrs.field_registration_history || undefined,
                grantHistory: itemAttrs.field_grant_history || undefined,
              });
            }
          }
        }

        if (tabTitle) {
          console.log(
            `📊 Processing tab: "${tabTitle}", found ${chartDataIncluded.length} chart items`,
          );

          // Get text content from first application item
          const firstAppItem = chartDataIncluded.find(
            (item) =>
              item.type === 'paragraph--chart_data_item' &&
              (item.attributes as any)?.field_registration_type === 'application',
          );
          const appItemAttrs = firstAppItem?.attributes as any;

          // Get text content from first certificate item
          const firstCertItem = chartDataIncluded.find(
            (item) =>
              item.type === 'paragraph--chart_data_item' &&
              (item.attributes as any)?.field_registration_type === 'certificate',
          );
          const certItemAttrs = firstCertItem?.attributes as any;

          console.log(
            `  - Application items: ${applicationData.chronological.length} chronological, ${applicationData.country.length} country, ${applicationData.applicant.length} applicant`,
          );
          console.log(
            `  - Certificate items: ${certificateData.chronological.length} chronological, ${certificateData.country.length} country, ${certificateData.applicant.length} applicant`,
          );

          const createTextContent = (itemAttrs: any): StatisticsTextContent => ({
            chronologicalChart: {
              title:
                extractText(itemAttrs?.field_chart_title) ||
                `${tabTitle} - ${locale === 'ar' ? 'الرسوم البيانية' : 'Charts'}`,
              description:
                extractText(itemAttrs?.field_chart_description) ||
                (locale === 'ar'
                  ? `الرسوم البيانية الإحصائية لـ ${tabTitle}`
                  : `Statistical charts for ${tabTitle}`),
              tooltip: {
                applications: locale === 'ar' ? 'الطلبات' : 'applications',
                year: locale === 'ar' ? 'السنة' : 'Year',
              },
            },
            countryChart: {
              title:
                extractText(itemAttrs?.field_chart_title) ||
                `${tabTitle} ${locale === 'ar' ? 'حسب الدولة' : 'by country'}`,
              description:
                extractText(itemAttrs?.field_chart_description) ||
                (locale === 'ar'
                  ? `التوزيع حسب الدولة لـ ${tabTitle}`
                  : `Distribution by country for ${tabTitle}`),
              tooltip: {
                applications: locale === 'ar' ? 'الطلبات' : 'applications',
                country: locale === 'ar' ? 'الدولة' : 'Country',
              },
            },
            applicantTypeChart: {
              title:
                extractText(itemAttrs?.field_chart_title) ||
                `${tabTitle} ${locale === 'ar' ? 'حسب نوع المتقدم' : 'by applicant type'}`,
              description:
                extractText(itemAttrs?.field_chart_description) ||
                (locale === 'ar'
                  ? `التوزيع حسب نوع المتقدم لـ ${tabTitle}`
                  : `Distribution by applicant type for ${tabTitle}`),
              tooltip: {
                percentage: locale === 'ar' ? 'النسبة المئوية' : 'Percentage',
                type: locale === 'ar' ? 'النوع' : 'Type',
              },
            },
          });

          data.tabsChartData[tabTitle] = {
            application: {
              ...applicationData,
              textContent: createTextContent(appItemAttrs),
            },
            certificate: {
              ...certificateData,
              textContent: createTextContent(certItemAttrs),
            },
          };
        }
      }
    } else {
      console.log(
        `🔴 NO TABS DATA! tabsData is ${Array.isArray(tabsData) ? `empty array (length: ${tabsData.length})` : `not an array (type: ${typeof tabsData})`}`,
      );
    }

    console.log(`🟢 IP OBSERVATORY SERVICES: Using Drupal data ✅ (${locale || 'en'})`);
    console.log('Hero Title:', data.hero.title);
    console.log('Tabs:', data.tabs.length);
    console.log('Table Data:', data.tableData.length, 'items');
    console.log('Tabs with Chart Data:', Object.keys(data.tabsChartData).length);

    return data;
  } catch (error) {
    console.log(`🔴 IP OBSERVATORY SERVICES: Using fallback data ❌ (${locale || 'en'})`);
    console.error('IP Observatory Services fetch error:', error);
    return getIPObservatoryServicesFallbackData(locale);
  }
}
