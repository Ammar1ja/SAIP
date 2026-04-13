export interface ProjectCardProps {
  /** Project title */
  title: string;
  /** Project reference number */
  reference: string;
  /** Current tender stage */
  tenderStage: string;
  /** Main activity of the tender */
  mainActivity: string;
  /** Type of tender */
  tenderType: string;
  /** Tender fees information */
  tenderFees: string;
  /** Publication date */
  publicationDate: string;
  /** Announcement vendor information */
  announcementVendor: string;
  /** Bid submission deadline */
  bidSubmissionDeadline: string;
}
