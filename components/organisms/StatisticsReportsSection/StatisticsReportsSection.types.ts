export interface StatisticsReportsSectionProps {
  className?: string;
  tab?: string;
  filter?: string;
  // Filter props
  filterValues?: Record<string, string | string[]>;
  onFilterChange?: (fieldId: string, value: string | string[]) => void;
  onFilterClear?: () => void;
  isFilterOpen?: boolean;
  onFilterToggle?: () => void;
  // Chart data props
  chronologicalData?: ChronologicalPatentData[];
  countryData?: CountryPatentData[];
  applicantData?: ApplicantTypeData[];
  textContent?: StatisticsTextContent;
}

export interface ChronologicalPatentData {
  year: number;
  applications: number;
  status?: string;
}

export interface CountryPatentData {
  country: string;
  applications: number;
  color: string;
  status?: string;
}

export interface ApplicantTypeData {
  type: string;
  percentage: number;
  applications: number;
  color: string;
  status?: string;
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
