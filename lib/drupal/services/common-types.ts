/**
 * Common Types for Drupal Services
 * Shared type definitions used across multiple services
 */

// Statistics Card Data - used in most IP category pages
export interface StatisticsCardData {
  label: string;
  value?: number;
  chartType: 'line' | 'pie' | 'bar';
  chartData?: Array<{ value: number; date?: string }>;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    description?: string;
  };
  breakdown?: Array<{
    label: string;
    value: number;
    displayValue: string;
    color: string;
  }>;
  icon?: React.ReactNode;
}

// Guide Card Data - used in Patents, Trademarks, IP Infringement, Guidelines
export interface GuideCardData {
  title: string;
  description: string;
  labels: string[];
  publicationDate: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  titleBg?: 'default' | 'green';
}

// Publication Card Data - used in Patents, Trademarks, Publications
export interface PublicationCardData {
  title: string;
  description?: string;
  labels?: string[];
  publicationNumber?: string;
  durationDate?: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  titleBg?: 'default' | 'green';
}

// Media Tab Data - used in most IP category pages
export interface MediaTabData {
  id: string;
  label: string;
}

// Media Content Data - used in most IP category pages
export interface MediaContentData {
  title: string;
  description: string;
}

// Filter Field Data - used in most IP category pages
export interface FilterFieldData {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  options?: Array<{ label: string; value: string }>;
  multiselect?: boolean;
  variant?: 'single' | 'range';
}

// Service Item Data - used in multiple service pages
export interface ServiceItemData {
  title: string;
  labels: string[];
  description: string;
  href: string;
  primaryButtonLabel?: string;
  targetGroups?: string[];
}

// Service Option Data - used for filter dropdowns
export interface ServiceOptionData {
  value: string;
  label: string;
}

// Journey Section Content - structured content for expandable items
export interface JourneyContentSection {
  heading?: string;
  content?: string | string[];
  isNumbered?: boolean;
}

export interface JourneyItemExample {
  items: string[];
}

// Journey Section Data - used in Patents, Trademarks
export interface JourneySectionData {
  title: string;
  subtitle?: string; // ✅ NEW: Subtitle (displayed inside accordion-group container)
  description?: string; // Optional - some sections only have title
  buttonLabel?: string;
  buttonHref?: string;
  items?: Array<{
    title: string;
    description?: string; // Legacy support
    sections?: JourneyContentSection[]; // ✅ NEW: Structured content
    example?: JourneyItemExample; // ✅ NEW: Examples in nested accordion
    icon?: string; // ✅ NEW: Icon name for timeline/checklist layouts
    category?: string; // ✅ NEW: Category for filtering (e.g., 'applicant', 'patent', 'priority', 'language')
    buttonLabel?: string; // Optional button label for list-with-button
    buttonHref?: string; // Optional button URL for list-with-button
  }>;
  showContentSwitcher?: boolean; // ✅ NEW: Show tabs before items
  contentSwitcherItems?: Array<{ id: string; label: string }>; // ✅ NEW: Tab options
  parentSectionId?: string | null; // For hierarchical structure
  subsections?: Array<JourneySectionData & { id: string }>; // Child sections (level 2)
  isLevel3?: boolean; // Flag to mark level 3 subsections (for internal use, not displayed in TOC)
  displayType?:
    | 'default'
    | 'timeline'
    | 'expandable'
    | 'checklist'
    | 'cards'
    | 'header'
    | 'accordion-group'
    | 'list-with-button'; // ✅ NEW: Display type for list with buttons
}

// TOC Item Data - used in Patents, Trademarks
export interface TOCItemData {
  id: string;
  label: string;
  subItems?: TOCItemData[];
}

const TOC_ITEMS_FROM_SECTION_ITEMS = new Set(['default', 'checklist', 'list-with-button']);

export function shouldBuildTocItemsFromSectionItems(section: JourneySectionData): boolean {
  const displayType = section.displayType || 'default';
  return TOC_ITEMS_FROM_SECTION_ITEMS.has(displayType);
}

export function buildJourneyTocItems(
  journeySections: Record<string, JourneySectionData>,
): TOCItemData[] {
  const buildTocItems = (
    subsections: Array<JourneySectionData & { id: string }>,
  ): TOCItemData[] => {
    return subsections.map((sub) => ({
      id: sub.id,
      label: sub.title,
      subItems: sub.subsections ? buildTocItems(sub.subsections) : undefined,
    }));
  };

  return Object.keys(journeySections)
    .filter((sectionId) => {
      const section = journeySections[sectionId];
      return !section.parentSectionId;
    })
    .map((sectionId) => {
      const section = journeySections[sectionId];
      const subItems = section.subsections
        ? buildTocItems(section.subsections)
        : shouldBuildTocItemsFromSectionItems(section)
          ? section.items?.map((item, index) => ({
              id: `${sectionId}-${index}`,
              label: item.title,
            })) || []
          : [];

      return {
        id: sectionId,
        label: section.title,
        subItems,
      };
    });
}

// Helper function to build journey sections hierarchy from flat list
// Supports Parent->Children->Children of children (3 levels)
export function buildJourneySectionsHierarchy(
  sectionsData: Array<{ id: string; section: JourneySectionData }>,
): {
  sections: Record<string, JourneySectionData>;
  sectionIds: string[];
} {
  // Build a map of all sections by ID for quick lookup
  const allSectionsMap: Record<string, JourneySectionData & { id: string }> = {};
  sectionsData.forEach(({ id, section }) => {
    allSectionsMap[id] = { ...section, id };
  });

  // Separate sections by level:
  // Level 1: No parent (root sections)
  // Level 2: Parent is a Level 1 section
  // Level 3: Parent is a Level 2 section
  const level1Sections: Record<string, JourneySectionData & { id: string }> = {};
  const level2ByParent: Record<string, Array<JourneySectionData & { id: string }>> = {};
  const level3ByParent: Record<string, Array<JourneySectionData & { id: string }>> = {};

  sectionsData.forEach(({ id, section }) => {
    if (!section.parentSectionId) {
      // Level 1: Root section
      level1Sections[id] = { ...section, id };
    } else {
      // Check if parent is Level 1 or Level 2
      const parent = allSectionsMap[section.parentSectionId];
      if (parent && !parent.parentSectionId) {
        // Level 2: Parent is Level 1
        if (!level2ByParent[section.parentSectionId]) {
          level2ByParent[section.parentSectionId] = [];
        }
        level2ByParent[section.parentSectionId].push({ ...section, id });
      } else if (parent && parent.parentSectionId) {
        // Level 3: Parent is Level 2 (parent has its own parent)
        if (!level3ByParent[section.parentSectionId]) {
          level3ByParent[section.parentSectionId] = [];
        }
        level3ByParent[section.parentSectionId].push({ ...section, id });
      }
      // If parent doesn't exist in map or has invalid structure, skip it
      // This prevents level 3 from being incorrectly treated as level 2
    }
  });

  // Build final sections structure
  const sections: Record<string, JourneySectionData> = { ...level1Sections };

  // Add Level 2 subsections to Level 1 parents
  Object.keys(level2ByParent).forEach((parentId) => {
    if (sections[parentId]) {
      const level2Subsections = level2ByParent[parentId];
      sections[parentId] = {
        ...sections[parentId],
        subsections: level2Subsections,
      };
      // Also add Level 2 sections as separate entries for frontend rendering
      level2Subsections.forEach((subsection) => {
        sections[subsection.id] = subsection;
      });
    }
  });

  // Add Level 3 subsections to Level 2 parents
  Object.keys(level3ByParent).forEach((parentId) => {
    if (sections[parentId]) {
      const level3Subsections = level3ByParent[parentId];
      sections[parentId] = {
        ...sections[parentId],
        subsections: level3Subsections,
      };
      // IMPORTANT: DO NOT add Level 3 sections as separate entries in sections object
      // They should ONLY appear as subsections under their level 2 parents
      // This prevents duplication in the TOC where level 3 items would appear both as
      // separate level 2 items and as nested items under their actual level 2 parents
      // However, we still need them in sections for scroll tracking, so add them with a flag
      level3Subsections.forEach((subsection) => {
        sections[subsection.id] = { ...subsection, isLevel3: true };
      });
    }
  });

  // Create virtual sections for items (JSON array) that are used in TOC
  // These items need to be in sections object so frontend can render them
  // BUT they should NOT appear as separate items in the TOC (they are already in subItems)
  Object.keys(sections).forEach((sectionId) => {
    const section = sections[sectionId];
    // If section has items but no subsections, create virtual sections for items
    if (
      section.items &&
      section.items.length > 0 &&
      !section.subsections &&
      shouldBuildTocItemsFromSectionItems(section)
    ) {
      section.items.forEach((item, index) => {
        const virtualId = `${sectionId}-${index}`;
        // Only create if not already exists (e.g., from subsections)
        if (!sections[virtualId]) {
          sections[virtualId] = {
            title: item.title,
            description: item.description || '',
            items: [], // No nested items for virtual sections
            parentSectionId: sectionId, // Set parent to the real section so they don't appear in TOC root
          };
        }
      });
    }
  });

  return {
    sections,
    sectionIds: Object.keys(sections),
  };
}

// Media Section Data - common structure for media sections
export interface MediaSectionData {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  tabs: MediaTabData[];
  content: Record<string, MediaContentData>;
  filterFields: FilterFieldData[];
  badgeLabel: string;
}

// Related Page Data - used for Related Pages sections
export interface RelatedPageData {
  title: string;
  href: string;
}

// Related Pages Section Data - used across IP category pages
export interface RelatedPagesSectionData {
  title: string;
  pages: RelatedPageData[];
}
