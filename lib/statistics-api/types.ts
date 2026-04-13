/**
 * Response row types for the statistics API (matches SQL query outputs).
 * Server executes the queries and returns JSON arrays of these shapes.
 */

/** Patents, industrial designs, plants, integrated circuits (vw_ip_information_patents) */
export interface PatentsStatRow {
  domain: string;
  year: number;
  count_of_applications: number;
  applicant_category: string;
}

/** Trademarks (vw_ip_information_trademarks) */
export interface TrademarksStatRow {
  year: number;
  count_of_applications: number;
  owner_type: string;
}

/** Copyrights (vw_ip_information_copyrights) */
export interface CopyrightsStatRow {
  year: number;
  applicant_category: string;
  count_of_applications: number;
}

export type StatisticsCategory = 'patents' | 'trademarks' | 'copyrights';

/** Optional domain filter for patents view: Patents | Industrial designs | Plant varieties | Integrated circuits */
export type PatentsDomain = string;
