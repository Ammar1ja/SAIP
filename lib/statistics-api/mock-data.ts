import { PATENTS_DOMAIN_AR } from './domains';
import type { CopyrightsStatRow, PatentsStatRow, TrademarksStatRow } from './types';

export const MOCK_PATENTS_FILING: PatentsStatRow[] = [
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2023,
    count_of_applications: 679,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2023,
    count_of_applications: 33,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2024,
    count_of_applications: 1092,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2024,
    count_of_applications: 56,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2023,
    count_of_applications: 270,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2023,
    count_of_applications: 114,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2024,
    count_of_applications: 290,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2024,
    count_of_applications: 152,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.PLANT_VARIETIES,
    year: 2023,
    count_of_applications: 5,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PLANT_VARIETIES,
    year: 2024,
    count_of_applications: 7,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS,
    year: 2023,
    count_of_applications: 4,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS,
    year: 2024,
    count_of_applications: 6,
    applicant_category: 'فرد',
  },
];

export const MOCK_PATENTS_REGISTERED: PatentsStatRow[] = [
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2023,
    count_of_applications: 610,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2023,
    count_of_applications: 25,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2024,
    count_of_applications: 840,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PATENTS,
    year: 2024,
    count_of_applications: 41,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2023,
    count_of_applications: 220,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2023,
    count_of_applications: 98,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2024,
    count_of_applications: 250,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    year: 2024,
    count_of_applications: 121,
    applicant_category: 'فرد',
  },
  {
    domain: PATENTS_DOMAIN_AR.PLANT_VARIETIES,
    year: 2023,
    count_of_applications: 3,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.PLANT_VARIETIES,
    year: 2024,
    count_of_applications: 4,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS,
    year: 2023,
    count_of_applications: 2,
    applicant_category: 'شركة',
  },
  {
    domain: PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS,
    year: 2024,
    count_of_applications: 3,
    applicant_category: 'فرد',
  },
];

export const MOCK_TRADEMARKS_FILING: TrademarksStatRow[] = [
  { year: 2023, owner_type: 'شركة', count_of_applications: 1800 },
  { year: 2023, owner_type: 'فرد', count_of_applications: 620 },
  { year: 2024, owner_type: 'شركة', count_of_applications: 2120 },
  { year: 2024, owner_type: 'فرد', count_of_applications: 710 },
];

export const MOCK_TRADEMARKS_REGISTERED: TrademarksStatRow[] = [
  { year: 2023, owner_type: 'شركة', count_of_applications: 1330 },
  { year: 2023, owner_type: 'فرد', count_of_applications: 420 },
  { year: 2024, owner_type: 'شركة', count_of_applications: 1575 },
  { year: 2024, owner_type: 'فرد', count_of_applications: 505 },
];

export const MOCK_COPYRIGHTS_FILING: CopyrightsStatRow[] = [
  { year: 2023, applicant_category: 'شركة', count_of_applications: 330 },
  { year: 2023, applicant_category: 'فرد', count_of_applications: 290 },
  { year: 2024, applicant_category: 'شركة', count_of_applications: 410 },
  { year: 2024, applicant_category: 'فرد', count_of_applications: 360 },
];

export const MOCK_COPYRIGHTS_REGISTERED: CopyrightsStatRow[] = [
  { year: 2023, applicant_category: 'شركة', count_of_applications: 240 },
  { year: 2023, applicant_category: 'فرد', count_of_applications: 210 },
  { year: 2024, applicant_category: 'شركة', count_of_applications: 300 },
  { year: 2024, applicant_category: 'فرد', count_of_applications: 265 },
];
