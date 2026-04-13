/**
 * Drupal Services - Centralized API service layer
 * Each service handles one content type or related group
 */

export * from './news.service';
export * from './about.service';
export * from './homepage.service';
export * from './header.service';
export {
  getServicesOverviewPageData,
  transformServiceItem as transformServicesOverviewItem,
} from './services-overview.service';
export {
  getServiceDirectoryPageData,
  transformServiceItem as transformServiceDirectoryItem,
} from './service-directory.service';
export * from './entities-partners.service';
export * from './projects.service';
export * from './organisational-structure.service';
// Export only main functions, not duplicate types
export { getNationalIPStrategyData } from './national-ip-strategy.service';
export { getPatentsPageData } from './patents.service';
export { getTrademarksPageData } from './trademarks.service';
export { getIPLicensingPageData } from './ip-licensing.service';
export { getIPAcademyPageData } from './ip-academy.service';
export { getIPClinicsPageData } from './ip-clinics.service';
export { getIPSupportCentersPageData } from './ip-support-centers.service';
export { getIPInfringementPageData } from './ip-infringement.service';
export {
  getIPGeneralSecretariatPageData,
  fetchProtectionServices,
} from './ip-general-secretariat.service';
export { getGuidelinesPageData } from './guidelines.service';
export { getPublicationsPageData } from './publications.service';
export { getGazettePageData } from './gazette.service';
export { getReportsPageData } from './reports.service';
export { getIPGlossaryPageData } from './ip-glossary.service';
export {
  getPublicConsultationsPageData,
  getConsultationDetailData,
} from './public-consultations.service';
export { getFaqPageData } from './faq.service';
export { getDigitalGuidePageData } from './digital-guide.service';
export { getBrandingPageData } from './branding.service';
export { getMediaLibraryPageData } from './media-library.service';
export { getAboutChairwomanPageData } from './about-chairwoman.service';
export { getMovablesPlatformPageData } from './movables-platform.service';
export { getIPObservatoryPageData } from './ip-observatory.service';
export { getIPObservatoryServicesPageData } from './ip-observatory-services.service';
export { getIPObservatoryEnablementPageData } from './ip-observatory-enablement.service';
export { getIPObservatoryEnforcementPageData } from './ip-observatory-enforcement.service';
export { getIPSearchEnginePageData } from './ip-search-engine.service';
export { getIPAgentsPageData } from './ip-agents.service';
export { getCopyrightsPageData } from './copyrights.service';
export { getDesignsPageData } from './designs.service';
export { getPlantVarietiesPageData } from './plant-varieties.service';
export { getTopographicDesignsPageData } from './topographic-designs.service';
export { getCareersPageData } from './careers.service';
export { getContactSupportPageData } from './contact-support.service';

// Functional exports - no more class instances
