export interface NewsArticle {
  id: number;
  title: string;
  publishData: string;
  excerpt: string;
  content: string;
  categories: {
    id: string;
    name: string;
  }[];
  image: string;
}

export const newsArticlesData: NewsArticle[] = [
  {
    id: 1,
    title:
      'In a Historic Step Toward Supporting Global Creativity: Adoption of the Riyadh Treaty on Design Law',
    publishData: '10.11.2024',
    excerpt:
      'In a Historic Step Toward Supporting Global Creativity: Adoption of the Riyadh Treaty on Design Law',
    content: `In a Historic Step Toward Supporting Global Creativity: Adoption of the Riyadh Treaty on Design Law

This landmark treaty represents a significant advancement in international intellectual property law, establishing unified standards for design registration across participating nations. The Riyadh Treaty aims to streamline the process of protecting industrial designs globally, reducing administrative burdens for creators and businesses while enhancing legal certainty.

The treaty's adoption marks a new era of cooperation in intellectual property protection, bringing together diverse legal systems under a common framework. This initiative supports the creative economy by making design protection more accessible and cost-effective for innovators worldwide.

Key provisions include simplified registration procedures, harmonized examination standards, and enhanced enforcement mechanisms. The treaty also establishes a framework for international cooperation in design protection, facilitating cross-border enforcement and reducing duplication of efforts.

This development aligns with Saudi Arabia's Vision 2030 goals of fostering innovation and creativity, positioning the kingdom as a global leader in intellectual property protection and supporting the growth of creative industries.`,
    categories: [
      { id: '1', name: 'General' },
      { id: '2', name: 'Designs' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 2,
    title: 'The Kingdom of Saudi Arabia Hosts 193 Countries at the Diplomatic',
    publishData: '10.11.2024',
    excerpt: 'The Kingdom of Saudi Arabia Hosts 193 Countries at the Diplomatic',
    content: `The Kingdom of Saudi Arabia Hosts 193 Countries at the Diplomatic Conference

Riyadh has become the global center for intellectual property diplomacy as Saudi Arabia hosts representatives from all 193 WIPO member countries for the Diplomatic Conference on Design Law Treaty. This historic gathering represents the largest international IP conference ever held in the Middle East.

The conference brings together government officials, legal experts, and industry representatives to discuss and finalize the Design Law Treaty, which will establish international standards for design protection. This treaty is expected to significantly impact global trade and innovation by creating a unified system for design registration.

Saudi Arabia's role as host reflects its growing influence in international intellectual property matters and its commitment to supporting global innovation. The kingdom has invested heavily in IP infrastructure and legal frameworks to support this leadership position.

The conference includes multiple working groups addressing technical aspects of design protection, enforcement mechanisms, and international cooperation. These discussions will shape the future of design protection for decades to come, benefiting creators, businesses, and consumers worldwide.`,
    categories: [
      { id: '3', name: 'General' },
      { id: '4', name: 'Conferences' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 3,
    title: 'Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty',
    publishData: '10.11.2024',
    excerpt:
      "Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic.",
    content: `Saudi Arabia Chairs the Diplomatic Conference on Design Law Treaty

Demonstrating confidence in Saudi Arabia's international standing and effectiveness in the field of intellectual property, Dr. Abdulaziz bin Mohammed Al-Swailem has been elected to chair the Diplomatic Conference on Design Law Treaty. The conference, which opened in Riyadh, brings together representatives from 193 WIPO member countries with the aim to unify global systems for design registration.

Dr. Abdulaziz bin Mohammed Al-Swailem's election to chair the Diplomatic Conference on Design Law Treaty marks a significant milestone in Saudi Arabia's international standing and effectiveness in the field of intellectual property. The conference, which opened in Riyadh, brings together representatives from 193 WIPO member countries with the aim to unify global systems for design registration.

The conference chair plays a crucial role in overseeing proceedings, managing committees, facilitating negotiations, and bridging viewpoints among WIPO member states. This treaty represents a comprehensive effort to standardize and simplify design registration procedures, ultimately benefiting creative individuals and private-sector entities worldwide.

Saudi Arabia's efforts to enhance the intellectual property environment and its role in supporting IP rights and innovation demonstrate its commitment to becoming a global hub for creatives and investors. This leadership position reinforces the kingdom's status as a key contributor to the knowledge-based economy.

The conference reflects Saudi Arabia's unwavering commitment to protecting intellectual property rights, benefiting individuals and institutions alike, and contributing to global sustainable development goals through innovative IP frameworks.`,
    categories: [
      { id: '5', name: 'Intellectual property' },
      { id: '6', name: 'Conferences' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 4,
    title: 'New IP Regulations Strengthen Protection Framework',
    publishData: '08.11.2024',
    excerpt:
      'The Saudi Authority for Intellectual Property announces comprehensive new regulations to strengthen IP protection across the kingdom.',
    content: `New IP Regulations Strengthen Protection Framework

The Saudi Authority for Intellectual Property announces comprehensive new regulations to strengthen IP protection across the kingdom. These new regulations represent a significant enhancement to the existing IP legal framework, providing stronger protection for innovators and creators while streamlining administrative processes.

The updated regulations address key areas including trademark registration, patent protection, copyright enforcement, and industrial design registration. These changes align with international best practices and support Saudi Arabia's Vision 2030 goals of building a knowledge-based economy.

Key improvements include faster processing times for IP applications, enhanced enforcement mechanisms, and improved international cooperation protocols. The regulations also introduce new provisions for emerging technologies and digital IP protection.

This regulatory update demonstrates Saudi Arabia's commitment to creating an environment that supports innovation and creativity, attracting international businesses and fostering local talent development in the IP sector.`,
    categories: [
      { id: '7', name: 'Regulations' },
      { id: '8', name: 'IP Protection' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 5,
    title: 'IP Academy Launches Advanced Training Program',
    publishData: '05.11.2024',
    excerpt:
      'A comprehensive training program designed to enhance IP knowledge among professionals and businesses across various sectors.',
    content: `IP Academy Launches Advanced Training Program

A comprehensive training program designed to enhance IP knowledge among professionals and businesses across various sectors. The IP Academy's new advanced training program represents a significant investment in human capital development, providing specialized education in intellectual property law and practice.

The program offers multiple tracks including basic IP awareness, advanced legal training, and specialized courses for specific industries. Participants gain practical skills in IP management, enforcement, and commercialization strategies.

The training program features expert instructors from leading international institutions, case studies from real-world IP disputes, and hands-on workshops. Graduates receive internationally recognized certifications that enhance their professional credentials.

This initiative supports Saudi Arabia's goal of developing a skilled workforce capable of managing complex IP matters, supporting the growth of innovative industries and attracting international investment in research and development.`,
    categories: [
      { id: '9', name: 'Education' },
      { id: '10', name: 'Training' },
    ],
    image: '/images/photo-container.png',
  },
  {
    id: 6,
    title: 'Trademark Registration Process Streamlined',
    publishData: '03.11.2024',
    excerpt:
      'New digital tools and processes make trademark registration faster and more accessible for businesses.',
    content: `Trademark Registration Process Streamlined

New digital tools and processes make trademark registration faster and more accessible for businesses. The streamlined trademark registration process represents a major improvement in SAIP's digital services, reducing processing times from months to weeks while maintaining high quality standards.

The new system features an intuitive online application portal, automated preliminary screening, and integrated payment processing. Businesses can now complete the entire trademark registration process digitally, from initial application to final certificate issuance.

Key improvements include real-time application tracking, automated conflict detection, and streamlined opposition procedures. The system also provides comprehensive guidance and support resources for applicants.

This digital transformation supports Saudi Arabia's goal of creating a business-friendly environment that encourages entrepreneurship and innovation, making IP protection more accessible to small and medium-sized enterprises.`,
    categories: [
      { id: '11', name: 'Trademarks' },
      { id: '12', name: 'Digital Services' },
    ],
    image: '/images/photo-container.png',
  },
];

export const getArticleById = (id: string): NewsArticle | undefined => {
  const articleId = parseInt(id);
  return newsArticlesData.find((article) => article.id === articleId);
};
