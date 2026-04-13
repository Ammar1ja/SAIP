export interface ConsultationCard {
  id: string;
  title: string;
  durationDate: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
}

export interface ConsultationDetail {
  id: string;
  title: string;
  closingDate: string;
  description: string;
  content: string;
}

export interface ConsultationData {
  card: ConsultationCard;
  detail: ConsultationDetail;
}

export const consultationsData: Record<string, ConsultationData> = {
  'nice-classification-ce34': {
    card: {
      id: 'nice-classification-ce34',
      title: 'Public opinion poll on the Nice Classification Expert Committee Meeting (CE34)',
      durationDate: 'Date of closing public consultations: 27.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref:
        '/resources/tools-and-research/public-consultations/nice-classification-ce34',
    },
    detail: {
      id: 'nice-classification-ce34',
      title: 'Public opinion poll on the Nice Classification Expert Committee Meeting (CE34)',
      closingDate: '27.02.2025',
      description: 'Date of closing public consultations: 27.02.2025',
      content: `The Nice Agreement Concerning the International Classification of Goods and Services for the Purposes of the Registration of Marks was signed in 1957. Saudi Arabia acceded to this agreement in 2021.

The purpose of this classification is to facilitate trademark protection by choosing from 45 classes (34 for products, 11 for services). This classification helps in organizing and categorizing goods and services for trademark registration purposes.

Examples of class headings include:

• Class 30: "coffee, tea, cocoa, artificial coffee, rice, tapioca and sago, flour and preparations made from cereals, bread, pastry and confectionery, ices, sugar, honey, treacle, yeast, baking-powder, salt, mustard, vinegar, sauces (condiments), spices, ice"

• Class 41: "education, training, entertainment, sports and cultural activities"

A committee of experts has been established to oversee this classification system. The committee holds annual meetings to make decisions on:

• Changes and amendments to the classification
• Transfers of goods and services between classes
• Deletions and additions to the classification
• Updates to the alphabetical list
• Explanatory notes and guidelines

This public opinion poll seeks your valuable feedback on the proposed changes and improvements to the Nice Classification system, ensuring it better serves the needs of trademark applicants and intellectual property professionals in Saudi Arabia.`,
    },
  },
  'phonograms-convention': {
    card: {
      id: 'phonograms-convention',
      title:
        'Convention for the Protection of Producers of Phonograms against Unauthorized Duplication of Their Phonograms',
      durationDate: 'Date of closing public consultations: 30.12.2024',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/phonograms-convention',
    },
    detail: {
      id: 'phonograms-convention',
      title:
        'Convention for the Protection of Producers of Phonograms against Unauthorized Duplication of Their Phonograms',
      closingDate: '30.12.2024',
      description: 'Date of closing public consultations: 30.12.2024',
      content: `The Convention for the Protection of Producers of Phonograms against Unauthorized Duplication of Their Phonograms, also known as the Geneva Phonograms Convention, was adopted in Geneva on October 29, 1971.

This convention provides international protection for phonogram producers against unauthorized duplication of their phonograms. Saudi Arabia is considering accession to this convention to strengthen intellectual property protection in the audio industry.

Key provisions include:

• Protection against unauthorized duplication
• Rights of phonogram producers
• International recognition of rights
• Enforcement mechanisms
• Cross-border protection

The convention aims to protect the rights of producers of sound recordings and ensure fair compensation for their creative work.`,
    },
  },
  'patent-law-amendments': {
    card: {
      id: 'patent-law-amendments',
      title: 'Additional consultation on Patent Law Amendments',
      durationDate: 'Date of closing public consultations: 15.01.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/patent-law-amendments',
    },
    detail: {
      id: 'patent-law-amendments',
      title: 'Additional consultation on Patent Law Amendments',
      closingDate: '15.01.2025',
      description: 'Date of closing public consultations: 15.01.2025',
      content: `SAIP is seeking public feedback on proposed amendments to the Patent Law to enhance the protection of intellectual property rights and streamline the patent registration process.

The proposed amendments include:

• Streamlined application procedures
• Enhanced protection for inventors
• Improved enforcement mechanisms
• Updated examination guidelines
• International harmonization measures

These changes aim to create a more efficient and effective patent system that better serves the needs of inventors and businesses in Saudi Arabia.`,
    },
  },
  'trademark-registration': {
    card: {
      id: 'trademark-registration',
      title: 'Trademark Registration Process Review',
      durationDate: 'Date of closing public consultations: 20.01.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref:
        '/resources/tools-and-research/public-consultations/trademark-registration',
    },
    detail: {
      id: 'trademark-registration',
      title: 'Trademark Registration Process Review',
      closingDate: '20.01.2025',
      description: 'Date of closing public consultations: 20.01.2025',
      content: `SAIP is conducting a comprehensive review of the trademark registration process to improve efficiency and user experience.

The review covers:

• Online application procedures
• Examination timelines
• Opposition and cancellation processes
• International trademark registration
• Enforcement and protection measures

Your feedback will help us create a more user-friendly and efficient trademark registration system.`,
    },
  },
  'copyright-protection': {
    card: {
      id: 'copyright-protection',
      title: 'Copyright Protection Guidelines Update',
      durationDate: 'Date of closing public consultations: 25.01.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/copyright-protection',
    },
    detail: {
      id: 'copyright-protection',
      title: 'Copyright Protection Guidelines Update',
      closingDate: '25.01.2025',
      description: 'Date of closing public consultations: 25.01.2025',
      content: `SAIP is updating its copyright protection guidelines to align with international best practices and address emerging challenges in the digital age.

The updated guidelines will cover:

• Digital rights management
• Online content protection
• Fair use provisions
• International copyright treaties
• Enforcement mechanisms

We invite stakeholders to provide input on these important updates.`,
    },
  },
  'industrial-design': {
    card: {
      id: 'industrial-design',
      title: 'Industrial Design Registration Consultation',
      durationDate: 'Date of closing public consultations: 30.01.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/industrial-design',
    },
    detail: {
      id: 'industrial-design',
      title: 'Industrial Design Registration Consultation',
      closingDate: '30.01.2025',
      description: 'Date of closing public consultations: 30.01.2025',
      content: `SAIP is seeking public input on the industrial design registration process to enhance protection for design creators.

The consultation covers:

• Design examination criteria
• Registration procedures
• Protection duration
• International design registration
• Enforcement measures

Your feedback will help improve the industrial design protection system.`,
    },
  },
  'geographical-indications': {
    card: {
      id: 'geographical-indications',
      title: 'Geographical Indications Framework Review',
      durationDate: 'Date of closing public consultations: 05.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref:
        '/resources/tools-and-research/public-consultations/geographical-indications',
    },
    detail: {
      id: 'geographical-indications',
      title: 'Geographical Indications Framework Review',
      closingDate: '05.02.2025',
      description: 'Date of closing public consultations: 05.02.2025',
      content: `SAIP is reviewing the geographical indications framework to better protect products with specific geographical origins.

The review includes:

• Registration criteria
• Protection scope
• Enforcement mechanisms
• International cooperation
• Quality control measures

This framework will help protect traditional products and promote local economic development.`,
    },
  },
  'intellectual-property-education': {
    card: {
      id: 'intellectual-property-education',
      title: 'Intellectual Property Education and Awareness Program',
      durationDate: 'Date of closing public consultations: 10.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref:
        '/resources/tools-and-research/public-consultations/intellectual-property-education',
    },
    detail: {
      id: 'intellectual-property-education',
      title: 'Intellectual Property Education and Awareness Program',
      closingDate: '10.02.2025',
      description: 'Date of closing public consultations: 10.02.2025',
      content: `SAIP is developing a comprehensive intellectual property education and awareness program to promote understanding of IP rights among the public.

The program will include:

• Educational materials and resources
• Training programs for businesses
• Public awareness campaigns
• School and university partnerships
• Online learning platforms

This initiative aims to build a culture of respect for intellectual property rights in Saudi Arabia.`,
    },
  },
  'digital-ip-services': {
    card: {
      id: 'digital-ip-services',
      title: 'Digital IP Services Platform Enhancement',
      durationDate: 'Date of closing public consultations: 15.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/digital-ip-services',
    },
    detail: {
      id: 'digital-ip-services',
      title: 'Digital IP Services Platform Enhancement',
      closingDate: '15.02.2025',
      description: 'Date of closing public consultations: 15.02.2025',
      content: `SAIP is enhancing its digital IP services platform to provide better online services for IP registration and management.

The enhancements will include:

• Improved user interface and experience
• Mobile application development
• Enhanced security features
• Integration with international databases
• Real-time status updates

These improvements will make IP services more accessible and efficient for users.`,
    },
  },
  'ip-enforcement': {
    card: {
      id: 'ip-enforcement',
      title: 'IP Enforcement and Dispute Resolution Framework',
      durationDate: 'Date of closing public consultations: 20.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/ip-enforcement',
    },
    detail: {
      id: 'ip-enforcement',
      title: 'IP Enforcement and Dispute Resolution Framework',
      closingDate: '20.02.2025',
      description: 'Date of closing public consultations: 20.02.2025',
      content: `SAIP is developing a comprehensive framework for IP enforcement and dispute resolution to protect intellectual property rights effectively.

The framework will include:

• Alternative dispute resolution mechanisms
• Specialized IP courts
• Enforcement procedures
• International cooperation
• Training for enforcement officials

This framework will strengthen IP protection and provide efficient resolution of IP disputes.`,
    },
  },
  'startup-ip-support': {
    card: {
      id: 'startup-ip-support',
      title: 'Startup IP Support and Incentive Program',
      durationDate: 'Date of closing public consultations: 25.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref: '/resources/tools-and-research/public-consultations/startup-ip-support',
    },
    detail: {
      id: 'startup-ip-support',
      title: 'Startup IP Support and Incentive Program',
      closingDate: '25.02.2025',
      description: 'Date of closing public consultations: 25.02.2025',
      content: `SAIP is launching a support program for startups to encourage innovation and IP protection among emerging businesses.

The program will offer:

• Reduced fees for IP registration
• IP consultation services
• Training and mentorship programs
• Networking opportunities
• Fast-track processing

This initiative aims to foster innovation and entrepreneurship in Saudi Arabia.`,
    },
  },
  'international-ip-cooperation': {
    card: {
      id: 'international-ip-cooperation',
      title: 'International IP Cooperation and Agreements',
      durationDate: 'Date of closing public consultations: 28.02.2025',
      primaryButtonLabel: 'Read more',
      primaryButtonHref:
        '/resources/tools-and-research/public-consultations/international-ip-cooperation',
    },
    detail: {
      id: 'international-ip-cooperation',
      title: 'International IP Cooperation and Agreements',
      closingDate: '28.02.2025',
      description: 'Date of closing public consultations: 28.02.2025',
      content: `SAIP is seeking input on international IP cooperation initiatives and agreements to strengthen Saudi Arabia's position in the global IP landscape.

The initiatives include:

• Bilateral IP agreements
• International IP treaties
• Cooperation with WIPO
• Regional IP partnerships
• Information sharing protocols

These efforts will enhance Saudi Arabia's international IP standing and facilitate cross-border IP protection.`,
    },
  },
};

export function getAllConsultationCards(): ConsultationCard[] {
  return Object.values(consultationsData).map((data) => data.card);
}

export function getConsultationDetail(id: string): ConsultationDetail | null {
  const consultation = consultationsData[id];
  return consultation ? consultation.detail : null;
}

export function getConsultationCard(id: string): ConsultationCard | null {
  const consultation = consultationsData[id];
  return consultation ? consultation.card : null;
}
