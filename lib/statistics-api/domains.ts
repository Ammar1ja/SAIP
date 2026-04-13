/**
 * Known domain labels coming from vw_ip_information_patents.
 *
 * The DB may return Arabic labels; the external API can either pass them through
 * or normalize to a canonical slug. This module helps the frontend map domains
 * deterministically when we add filtering (designs/plant varieties/ICs).
 */

export const PATENTS_DOMAIN_AR = {
  PATENTS: 'براءة اختراع',
  INDUSTRIAL_DESIGNS: 'نموذج صناعي',
  PLANT_VARIETIES: 'صنف نباتي',
  INTEGRATED_CIRCUITS: 'دارة متكاملة',
} as const;

export type PatentsDomainSlug = 'patents' | 'industrial-designs' | 'plant-varieties' | 'ic-layout';

export function mapPatentsDomainToSlug(domainLabel: string): PatentsDomainSlug | null {
  const normalized = (domainLabel || '').trim();
  switch (normalized) {
    case PATENTS_DOMAIN_AR.PATENTS:
      return 'patents';
    case PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS:
      return 'industrial-designs';
    case PATENTS_DOMAIN_AR.PLANT_VARIETIES:
      return 'plant-varieties';
    case PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS:
      return 'ic-layout';
    default:
      return null;
  }
}
