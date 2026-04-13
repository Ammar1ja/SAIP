export interface ArticlesPoliciesData {
  title: string;
  description: string;
  content: {
    blogDescription: string;
    publishingGuidelines: string[];
    submissionInstructions: string[];
    contactEmail: string;
  };
}

export const articlesPoliciesData: ArticlesPoliciesData = {
  title: 'Articles policies',
  description: "Learn about SAIP's Intellectual Property Blog policies and submission guidelines",
  content: {
    blogDescription:
      'The Intellectual Property Blog is an Arabic-language platform launched by the Saudi Authority for Intellectual Property (SAIP). It is dedicated to publishing short articles on topics related to intellectual property. The blog aims to enhance Arabic content by discussing and addressing various intellectual property issues and themes.',
    publishingGuidelines: [
      'Articles must be original and not previously published elsewhere.',
      'Articles should be between 800-1200 words in length.',
      'Content must be directly related to intellectual property topics.',
      'Articles should be informative, educational, and written in a clear, accessible style.',
      'Each article should include key points and practical insights.',
      'Authors should provide balanced discussion of different perspectives.',
      'All sources and references must be properly cited.',
      'Articles must respect intellectual property rights and avoid infringement.',
    ],
    submissionInstructions: [
      'Prepare your article in Microsoft Word format (.docx).',
      'Send your article via email to: rs.policies@saip.gov.sa',
      'Include your full name, title, and contact information.',
      'Articles will be reviewed by our editorial team within 2-3 weeks.',
      'Accepted articles will be published with proper attribution to the author.',
      'Rejected articles will not be published and cannot be resubmitted.',
    ],
    contactEmail: 'rs.policies@saip.gov.sa',
  },
};
