/**
 * Drupal API Types
 * Shared type definitions for Drupal JSON API responses
 */

// Base Drupal field types
export interface DrupalTextField {
  value: string;
  format: string;
  processed?: string;
}

export interface DrupalFileUri {
  url: string;
}

export interface DrupalRelationshipData {
  type: string;
  id: string;
  meta?: Record<string, unknown>;
}

export interface DrupalRelationship {
  data: DrupalRelationshipData | DrupalRelationshipData[] | null;
  links?: Record<string, string>;
}

// Included entity types
export interface DrupalIncludedEntity {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, DrupalRelationship>;
}

export interface DrupalMediaEntity extends DrupalIncludedEntity {
  type: 'media--image' | 'media--video';
  attributes: {
    name: string;
    field_media_image?: {
      alt?: string;
    };
    uri?: DrupalFileUri;
  };
}

export interface DrupalFileEntity extends DrupalIncludedEntity {
  type: 'file--file';
  attributes: {
    filename: string;
    uri: DrupalFileUri;
    filemime: string;
  };
}

export interface DrupalTaxonomyEntity extends DrupalIncludedEntity {
  type: 'taxonomy_term--news_categories';
  attributes: {
    drupal_internal__tid: number;
    name: string;
    description?: DrupalTextField;
  };
}

// Content item types
export interface DrupalValueItem extends DrupalIncludedEntity {
  type: 'node--value_item';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    body?: DrupalTextField;
  };
}

export interface DrupalRoleItem extends DrupalIncludedEntity {
  type: 'node--role_item';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    body?: DrupalTextField;
  };
}

export interface DrupalPillarItem extends DrupalIncludedEntity {
  type: 'node--pillar_item';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    body?: DrupalTextField;
    field_number?: number;
  };
}

export interface DrupalNewsItem extends DrupalIncludedEntity {
  type: 'node--featured_news';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    field_title?: string;
    field_excerpt?: DrupalTextField;
    field_publish_date?: string;
  };
}

export interface DrupalHighlightItem extends DrupalIncludedEntity {
  type: 'node--highlight';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    field_title?: string;
    field_description?: DrupalTextField;
  };
}

// National IP Strategy Content Types
export interface DrupalStrategyObjectiveItem extends DrupalIncludedEntity {
  type: 'node--strategy_objective';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    field_title?: string;
    field_description?: DrupalTextField;
    body?: DrupalTextField;
  };
}

export interface DrupalNationalPillarItem extends DrupalIncludedEntity {
  type: 'node--national_pillar';
  attributes: {
    drupal_internal__nid: number;
    title: string;
    field_title?: string;
    field_description?: string;
    body?: DrupalTextField;
    field_number?: number;
  };
}

export interface DrupalNode {
  id: string;
  type: string;
  attributes: {
    drupal_internal__nid: number;
    title: string;
    created: string;
    changed: string;
    status: boolean;
    langcode?: string; // Language code for translations
    promote?: boolean;
    sticky?: boolean;
    body?: DrupalTextField;
    field_description?: DrupalTextField;
    field_title?: DrupalTextField; // Generic title field for paragraphs/tabs
    // Content-specific fields
    field_hero_heading?: string;
    field_hero_subheading?: DrupalTextField;
    field_hero_description?: DrupalTextField;
    field_hero_background_image?: DrupalRelationship;
    field_about_heading?: string;
    field_about_text?: DrupalTextField;
    field_about_description?: DrupalTextField;
    field_about_image?: DrupalRelationship;
    field_image?: DrupalRelationship;
    field_services_heading?: string;
    field_services_text?: DrupalTextField;
    field_services_title?: string;
    field_services_description?: DrupalTextField;
    field_news_title?: string;
    field_news_text?: DrupalTextField;
    field_highlights_heading?: string;
    field_highlights_text?: DrupalTextField;
    field_mission_text?: DrupalTextField;
    field_vision_text?: DrupalTextField;
    field_values_heading?: string;
    field_values_text?: DrupalTextField;
    field_ceo_title?: string;
    field_ceo_quote?: DrupalTextField;
    field_ceo_caption?: string;
    field_ceo_caption_highlight?: string;
    field_ceo_description?: DrupalTextField;
    field_roles_heading?: string;
    field_roles_text?: DrupalTextField;
    field_pillars_heading?: string;
    field_pillars_text?: DrupalTextField;
    // Footer specific fields
    field_footer_saip_links?: any[]; // Link array
    field_footer_ip_info_links?: any[];
    field_footer_tools_links?: any[];
    field_footer_licensing_links?: any[];
    field_footer_services_links?: any[];
    field_footer_social_links?: any[];
    field_footer_legal_links?: any[];
    // IP Observatory specific fields
    field_overview_heading?: string;
    field_ip_services_heading?: string;
    field_ip_services_desc?: DrupalTextField;
    field_ip_enablement_heading?: string;
    field_ip_enablement_desc?: DrupalTextField;
    field_ip_enforcement_heading?: string;
    field_ip_enforcement_desc?: DrupalTextField;
    // National IP Strategy specific fields
    field_objectives_heading?: string;
    field_objectives_text?: DrupalTextField;
    field_pillars_heading_strategy?: string;
    field_pillars_text_strategy?: DrupalTextField;
    field_document_heading?: string;
    field_document_description?: DrupalTextField;
    field_document_image?: DrupalRelationship;
    field_document_file?: DrupalRelationship;
    field_document_view_href?: string;
    field_document_download_href?: string;
    field_news_heading?: string;
    // IP Clinics specific fields
    field_overview_title?: string;
    field_overview_description?: DrupalTextField;
    field_overview_video_poster?: DrupalRelationship;
    field_video_card_title?: string;
    field_video_card_description?: string;
    field_video_src?: string;
    // IP Support Centers specific fields
    field_how_to_join_title?: string;
    field_how_to_join_description?: DrupalTextField;
    field_cta_banner_title?: string;
    field_cta_banner_button_label?: string;
    field_cta_banner_button_href?: string;
    // IP Infringement specific fields
    field_video_description?: string;
    field_guide_title?: string;
    field_guide_cta_label?: string;
    field_guide_cta_href?: string;
    // IP General Secretariat specific fields
    field_committees_title?: string;
    field_committees_description?: DrupalTextField;
    field_committees_list_title?: string;
    field_committees_list_description?: DrupalTextField;
    // Gazette specific fields
    field_ip_gazette_heading?: string;
    field_ip_gazette_text?: DrupalTextField;
    field_ip_gazette_button_text?: string;
    field_ip_gazette_button_href?: string;
    field_ip_gazette_image?: DrupalRelationship;
    field_ip_newspaper_heading?: string;
    field_ip_newspaper_text?: DrupalTextField;
    field_ip_newspaper_button_text?: string;
    field_ip_newspaper_button_href?: string;
    field_ip_newspaper_image?: DrupalRelationship;
    // IP Glossary specific fields
    field_english_term?: string;
    field_arabic_term?: string;
    field_acronym?: string;
    field_english_name?: string;
    field_arabic_name?: string;
    // Public Consultations specific fields
    field_closing_date?: string;
    field_duration_date?: string;
    field_content?: DrupalTextField;
    field_primary_button_label?: string;
    field_primary_button_href?: string;
    // Reports specific fields
    field_publication_date?: string;
    field_report_type?: string;
    field_href?: string;
    field_secondary_button_label?: string;
    field_secondary_button_href?: string;
    // FAQ specific fields
    field_category_id?: string;
    field_question_id?: string;
    field_question?: string;
    field_answer?: DrupalTextField;
    field_category?: DrupalRelationship;
    weight?: number;
    // Digital Guide specific fields
    field_guide_content?: DrupalTextField;
    field_guide_type?: string;
    field_tab_data?: string; // JSON
  };
  relationships?: Record<string, DrupalRelationship>;
}

export interface DrupalResponse<T = DrupalNode> {
  jsonapi: {
    version: string;
    meta: Record<string, unknown>;
  };
  data: T[];
  links?: Record<string, string>;
  included?: DrupalIncludedEntity[];
}

export interface DrupalError {
  status: string;
  title: string;
  detail: string;
}

// Organisational Structure Types
export interface DrupalBoardMember {
  id: string;
  title: string;
  field_position?: string;
  field_image?: DrupalRelationship;
  field_is_chairperson?: boolean;
  field_description?: DrupalTextField;
  image?: {
    url: string;
    alt: string;
  };
}

export interface DrupalAdvisoryBoardMember {
  id: string;
  title: string;
  field_position?: string;
  field_image?: DrupalRelationship;
  image?: {
    url: string;
    alt: string;
  };
}

export interface DrupalOrgChartPosition {
  id: string;
  title: string;
  field_person_name?: string;
  field_image?: DrupalRelationship;
  field_position_type?: string;
  field_parent_position?: DrupalRelationship;
  field_is_ceo?: boolean;
  field_is_audit?: boolean;
  image?: {
    url: string;
    alt: string;
  };
}

export interface DrupalOrganisationalStructureNode {
  id: string;
  type: string;
  attributes: {
    title: string;
    body?: DrupalTextField;
    field_hero_heading?: string;
    field_hero_subheading?: DrupalTextField;
    field_board_heading?: string;
    field_advisory_heading?: string;
    field_advisory_description?: DrupalTextField;
    field_advisory_description2?: DrupalTextField;
    field_org_chart_heading?: string;
    field_org_chart_description?: DrupalTextField;
  };
  relationships: {
    field_hero_background_image?: DrupalRelationship;
    field_board_members?: DrupalRelationship;
    field_advisory_members?: DrupalRelationship;
    field_org_chart_positions?: DrupalRelationship;
  };
}

// Projects Types
export interface DrupalProject {
  id: string;
  title: string;
  field_reference?: string;
  field_tender_stage?: DrupalRelationship;
  field_activity?: DrupalRelationship;
  field_tender_type?: DrupalRelationship;
  field_tender_fees?: string;
  field_publication_date?: string;
  field_announcement_vendor?: string;
  field_bid_submission_deadline?: string;
  field_description?: DrupalTextField;
  field_image?: DrupalRelationship;
  field_status?: string;
  image?: {
    url: string;
    alt: string;
  };
  tenderStage?: string;
  activity?: string;
  tenderType?: string;
}

export interface DrupalProjectsPageNode {
  id: string;
  type: string;
  attributes: {
    title: string;
    body?: DrupalTextField;
    field_hero_background_image?: DrupalRelationship;
  };
  relationships: {
    field_projects?: DrupalRelationship;
  };
}

// Entities & Partners types
export interface DrupalPartner extends DrupalIncludedEntity {
  attributes: {
    title: string;
    field_image?: DrupalRelationship;
    field_main_category?: DrupalRelationship;
    field_partner_type?: string;
    field_website_url?: string;
    body?: DrupalTextField;
  };
  relationships?: {
    field_image?: DrupalRelationship;
    field_main_category?: DrupalRelationship;
  };
}

export interface DrupalEntitiesPartnersPageNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_hero_heading?: string;
    field_hero_subheading?: string;
    field_hero_background_image?: DrupalRelationship;
    field_government_partners?: DrupalRelationship;
    field_healthcare_partners?: DrupalRelationship;
    field_academic_partners?: DrupalRelationship;
    field_private_partners?: DrupalRelationship;
    field_international_partners?: DrupalRelationship;
  };
  relationships?: {
    field_hero_background_image?: DrupalRelationship;
    field_government_partners?: DrupalRelationship;
    field_healthcare_partners?: DrupalRelationship;
    field_academic_partners?: DrupalRelationship;
    field_private_partners?: DrupalRelationship;
    field_international_partners?: DrupalRelationship;
  };
}

// Services Overview types
export interface DrupalServiceItem extends DrupalIncludedEntity {
  attributes: {
    title: string;
    field_description?: string;
    field_icon?: DrupalRelationship;
    field_alt_text?: string;
  };
  relationships?: {
    field_icon?: DrupalRelationship;
  };
}

export interface DrupalVerticalTabItem extends DrupalIncludedEntity {
  attributes: {
    title: string;
    field_description?: string;
    field_image?: DrupalRelationship;
  };
  relationships?: {
    field_image?: DrupalRelationship;
  };
}

export interface DrupalServicesOverviewPageNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_hero_heading?: string;
    field_hero_subheading?: string;
    field_discover_heading?: string;
    field_info_heading?: string;
    field_info_description?: string;
    field_hero_background_image?: DrupalRelationship;
    field_services_data?: DrupalRelationship;
    field_vertical_tabs_data?: DrupalRelationship;
    field_directory_section?: DrupalRelationship;
    field_protection_section?: DrupalRelationship;
    field_enablement_section?: DrupalRelationship;
    field_enforcement_section?: DrupalRelationship;
  };
  relationships?: {
    field_hero_background_image?: DrupalRelationship;
    field_services_data?: DrupalRelationship;
    field_vertical_tabs_data?: DrupalRelationship;
    field_directory_section?: DrupalRelationship;
    field_protection_section?: DrupalRelationship;
    field_enablement_section?: DrupalRelationship;
    field_enforcement_section?: DrupalRelationship;
  };
}

// Services Protection Section
export interface DrupalServicesProtectionSectionNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_heading: string;
    field_description: string;
    field_image?: DrupalRelationship;
  };
  relationships?: {
    field_image?: DrupalRelationship;
    field_vertical_tabs?: DrupalRelationship;
  };
}

// Services Enablement Section
export interface DrupalServicesEnablementSectionNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_heading: string;
    field_description: string;
    field_image?: DrupalRelationship;
  };
  relationships?: {
    field_image?: DrupalRelationship;
    field_vertical_tabs?: DrupalRelationship;
  };
}

// Services Enforcement Section
export interface DrupalServicesEnforcementSectionNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_heading: string;
    field_description: string;
    field_info_heading?: string;
    field_info_description?: string;
    field_image?: DrupalRelationship;
  };
  relationships?: {
    field_image?: DrupalRelationship;
    field_vertical_tabs?: DrupalRelationship;
  };
}

// Vertical Tab Item
export interface DrupalVerticalTabItemNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description: string;
    field_button_label?: string;
    field_button_href?: string;
    field_button_aria_label?: string;
  };
  relationships?: {
    field_image?: DrupalRelationship;
  };
}

// IP Category Page (Patents & Trademarks)
export interface DrupalIPCategoryPageNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_hero_heading?: string;
    field_hero_subheading?: string;
    field_hero_background_image?: DrupalRelationship;
    field_overview_header_title?: string;
    field_overview_header_description?: string;
    field_overview_header_descriptio?: string; // Correct field name in Drupal (typo in DB)
    field_overview_video_src?: string;
    field_overview_video_poster?: DrupalRelationship;
    field_guide_title?: string;
    field_publications_title?: string;
    field_publications_description?: string;
    field_publications_cta_label?: string;
    field_publications_cta_href?: string;
    field_statistics_title?: string;
    field_statistics_cta_label?: string;
    field_statistics_cta_href?: string;
    field_services_title?: string;
    // Gazette fields
    field_gazette_title?: string;
    field_gazette_description?: DrupalTextField;
    field_gazette_cta_label?: string;
    field_gazette_cta_href?: string;
  };
  relationships?: {
    field_hero_background_image?: DrupalRelationship;
    field_overview_video_poster?: DrupalRelationship;
    field_guide_items?: DrupalRelationship;
    field_publications_items?: DrupalRelationship;
    field_statistics_items?: DrupalRelationship;
    field_journey_sections?: DrupalRelationship;
    field_services_items?: DrupalRelationship;
    field_media_tabs?: DrupalRelationship;
    field_gazette_image?: DrupalRelationship;
  };
}

// Guide Item
export interface DrupalGuideItemNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_publication_date?: string;
    field_primary_button_label?: string;
    field_primary_button_href?: string;
    field_secondary_button_label?: string;
    field_secondary_button_href?: string;
    field_title_bg?: string;
  };
}

// Publication Item
export interface DrupalPublicationItemNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_publication_number?: string;
    field_duration_date?: string;
    field_primary_button_label?: string;
    field_primary_button_href?: string;
    field_secondary_button_label?: string;
    field_secondary_button_href?: string;
    field_title_bg?: string;
  };
}

// Statistics Item
export interface DrupalStatisticsItemNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_label?: string;
    field_value?: number;
    field_chart_type?: string;
    field_chart_data?: string; // JSON
    field_trend_value?: string;
    field_trend_direction?: string;
    field_trend_description?: string;
    field_breakdown?: string; // JSON
  };
}

// Journey Section
export interface DrupalJourneySectionNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_button_label?: string;
    field_button_href?: string;
    field_items?: string; // JSON
    field_section_id?: string;
  };
}

// Media Tab
export interface DrupalMediaTabNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_tab_id?: string;
  };
}

// IP Licensing Page
export interface DrupalIPLicensingPageNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_hero_heading?: string;
    field_hero_subheading?: string;
    field_hero_background_image?: DrupalRelationship;
    field_guide_title?: string;
    field_guide_description?: string;
    field_guide_image?: DrupalRelationship;
    field_guide_view_file_label?: string;
    field_guide_view_file_href?: string;
    field_guide_download_file_label?: string;
    field_guide_download_file_href?: string;
    field_requirements_title?: string;
    field_requirements_description?: string;
    field_exemptions?: string;
    field_quick_links_title?: string;
    field_quick_links?: string; // JSON
    field_services_title?: string;
  };
  relationships?: {
    field_hero_background_image?: DrupalRelationship;
    field_guide_image?: DrupalRelationship;
    field_guide_file?: DrupalRelationship;
    field_requirements_items?: DrupalRelationship;
    field_quick_link_items?: DrupalRelationship;
    field_exemption_items?: DrupalRelationship;
    field_services_items?: DrupalRelationship;
    field_related_page_items?: DrupalRelationship;
    field_related_service_items?: DrupalRelationship;
    field_media_background_image?: DrupalRelationship;
    field_media_tabs?: DrupalRelationship;
  };
}

// Requirement Item
export interface DrupalRequirementItemNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_number?: number;
    field_text?: string;
  };
}

// IP Academy Page
export interface DrupalIPAcademyPageNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_hero_heading?: string;
    field_hero_subheading?: string;
    field_hero_background_image?: DrupalRelationship;
    field_statistics_title?: string;
    field_statistics_cta_label?: string;
    field_statistics_cta_href?: string;
  };
  relationships?: {
    field_hero_background_image?: DrupalRelationship;
    field_statistics_items?: DrupalRelationship;
    field_training_programs?: DrupalRelationship;
    field_qualifications?: DrupalRelationship;
    field_education_projects?: DrupalRelationship;
    field_related_page_items?: DrupalRelationship;
    field_media_tabs?: DrupalRelationship;
  };
}

// Training Program
export interface DrupalTrainingProgramNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_details?: string;
    field_for_whom?: string;
    field_what_you_will_learn?: string; // JSON
    field_start_date?: string;
    field_duration?: string;
    field_fees?: string;
    field_language?: string;
    field_location?: string;
    field_hosts?: string;
    field_faq_href?: string;
    field_register_href?: string;
    field_register_note?: string;
    field_course_format?: string;
    field_course_materials?: string;
    field_programme?: string; // JSON
    field_related_services_title?: string;
    field_related_services_description?: string;
    field_related_services_desc?: string;
  };
  relationships?: {
    field_category?: DrupalRelationship;
  };
}

// Qualification
export interface DrupalQualificationNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_details?: string;
    field_for_whom?: string; // JSON
    field_requirements?: string; // JSON
    field_study_material_label?: string;
    field_study_material_href?: string;
    field_exam_programs?: string; // JSON
    field_start_date?: string;
    field_duration?: string;
    field_fees?: string;
    field_language?: string;
    field_test_type?: string;
    field_category?: string;
    field_hosts?: string;
    field_passing_score?: string;
    field_location?: string;
    field_faq_href?: string;
    field_register_href?: string;
    field_chapters?: string; // JSON
  };
  relationships?: {
    field_category?: DrupalRelationship;
  };
}

// Education Project
export interface DrupalEducationProjectNode extends DrupalNode {
  attributes: DrupalNode['attributes'] & {
    field_description?: string;
    field_details?: string;
    field_partners?: string; // JSON
    field_project_scope_description?: string;
  };
  relationships?: {
    field_project_file?: DrupalRelationship;
    field_education_project_category?: DrupalRelationship;
    field_project_scope_sections_p?: DrupalRelationship;
    field_project_details_p?: DrupalRelationship;
    field_target_audience_items?: DrupalRelationship;
  };
}
