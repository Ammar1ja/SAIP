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

export const chronologicalPatentData: ChronologicalPatentData[] = [
  { year: 1985, applications: 120 },
  { year: 1990, applications: 220 },
  { year: 1995, applications: 100 },
  { year: 2000, applications: 222 },
  { year: 2005, applications: 230 },
  { year: 2010, applications: 170 },
  { year: 2015, applications: 200 },
  { year: 2020, applications: 280 },
  { year: 2025, applications: 300 },
  { year: 2030, applications: 320 },
];

export const countryPatentData: CountryPatentData[] = [
  { country: 'Bar 1', applications: 420, color: '#10B981' },
  { country: 'Bar 2', applications: 280, color: '#F59E0B' },
  { country: 'Bar 3', applications: 120, color: '#8B5CF6' },
  { country: 'Bar 4', applications: 350, color: '#3B82F6' },
  { country: 'Bar 5', applications: 480, color: '#EF4444' },
];

export const applicantTypeData: ApplicantTypeData[] = [
  { type: 'Institutions', percentage: 65, applications: 650, color: '#88D8AD' },
  { type: 'Individuals', percentage: 35, applications: 350, color: '#074D31' },
];

export const statisticsTextContent = {
  chronologicalChart: {
    title: 'Patents in chronological order',
    description:
      'The graph shows the temporal distribution of the number of patent applications over the years. The years are represented on the horizontal axis, while the vertical axis shows the number of applications filed in each year. Changes in the number of applications can be observed by the height of the points, with a higher point indicating an increase in the number of applications, while a lower point reflects a decrease in innovative activity during that year.',
    tooltip: {
      applications: 'applications',
      year: 'Year',
    },
  },
  countryChart: {
    title: 'Patents by country of applicant',
    description:
      'The chart below shows the distribution of patent applications by country of origin. The size of each bar reflects the number of applications filed by each country, making it easier to identify the most active countries in this area. Larger bars represent countries with high innovation activity, while smaller bars indicate countries with lower contributions.',
    tooltip: {
      applications: 'applications',
      country: 'Country',
    },
  },
  applicantTypeChart: {
    title: "Patents by applicant's type",
    description:
      'The pie chart below shows the distribution of patent applications by applicant type, with applicants divided into two main types: individuals and institutions. Larger slices in the graph indicate higher entries, indicating greater activity in filing applications. Smaller slices indicate fewer entries, reflecting less activity in the field.',
    tooltip: {
      percentage: 'Percentage',
      type: 'Type',
    },
  },
};
