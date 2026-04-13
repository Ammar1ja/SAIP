import { fetchDrupal, extractText, getRelated, getImageWithAlt } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import {
  CONTACT_INFORMATION as FALLBACK_CONTACT_INFORMATION,
  FOLLOW_US as FALLBACK_FOLLOW_US,
} from '@/app/[locale]/contact-us/contact-and-support/ContactAndSupport.data';

// Interfaces describing the data structure used by the Contact & Support page
export interface ContactInformationItem {
  id: string;
  title: string;
  icon: string;
  linkLabel?: string;
  linkHref?: string;
  availability?: string[];
  buttonLabel?: string;
  buttonHref?: string;
  locationHref?: string;
  locationAddress?: string[];
  socialMedia?: Array<{
    ariaLabel: string;
    href: string;
    icon: string;
  }>;
}

export interface ContactSupportHero {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface ContactSupportDocumentSection {
  heading: string;
  description: string | string[];
  image: {
    src: string;
    alt: string;
    className?: string;
  };
  buttonLabel?: string;
  buttonHref?: string;
}

export interface ContactSupportData {
  hero: ContactSupportHero;
  contactInformation: ContactInformationItem[];
  appointmentBooking: ContactSupportDocumentSection;
  beneficiarySupport: ContactSupportDocumentSection;
  followUs: Array<{
    ariaLabel: string;
    href: string;
    icon: string;
  }>;
  // Section headings from Drupal
  contactInfoHeading?: string;
  formHeading?: string;
  socialHeading?: string;
}

// NO MORE PARAGRAPH HELPERS - Using simple fields now

// Step 1: Fetch UUID (without locale to get canonical)
async function fetchContactSupportUUID(): Promise<string | null> {
  try {
    const endpoint = `/node/contact_support_page?filter[status]=1&fields[node--contact_support_page]=drupal_internal__nid`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {});
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch contact support UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchContactSupportByUUID(
  uuid: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    // Simple fields - no paragraphs needed, all data in node attributes
    const includeFields = 'field_hero_background_image.field_media_image';
    const endpoint = `/node/contact_support_page/${uuid}?include=${includeFields}`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

    if (!response.data) {
      return null;
    }

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    return {
      node,
      included: response.included || [],
    };
  } catch (error) {
    console.error(`Failed to fetch contact support by UUID (${locale}):`, error);
    return null;
  }
}

function getFallbackData(): ContactSupportData {
  return {
    hero: {
      title: 'Contact & support',
      description: "Have a question or need support? We're here to help!",
      backgroundImage: '/images/contact-and-support/hero.jpg',
    },
    contactInformation: FALLBACK_CONTACT_INFORMATION,
    appointmentBooking: {
      heading: 'Book your appointment with SAIP',
      description:
        'Before you visit the SAIP headquarters, remember to book your visit online through our platform.',
      image: {
        src: '/images/contact-and-support/appointment-booking.png',
        alt: 'Appointment booking',
        className: 'rounded-2xl',
      },
      buttonHref: '#',
    },
    beneficiarySupport: {
      heading: 'Beneficiary support',
      description:
        'Our Beneficiary support service is here to assist you with any questions or issues.',
      image: {
        src: '/images/contact-and-support/beneficiary-support.png',
        alt: 'Beneficiary support',
        className: 'rounded-2xl',
      },
      buttonHref: '#',
    },
    followUs: FALLBACK_FOLLOW_US,
    // Section headings from Drupal
    contactInfoHeading: 'Contact information',
    formHeading: 'How can we help you?',
    socialHeading: 'Follow us on social media',
  };
}

// Transform function
function transformContactSupportPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ContactSupportData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero background image
  let heroImageUrl = '/images/contact-and-support/hero.jpg';
  const heroImageRel = getRelated(rels, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  // Build contact information from simple fields
  const contactInformation: ContactInformationItem[] = [];
  
  // 1. Customer service number
  if (attrs.field_cs_phone) {
    contactInformation.push({
      id: 'customer-service',
      title: 'Customer service number',
      icon: '/icons/contact-and-support/headphones.svg',
      linkLabel: attrs.field_cs_phone,
      linkHref: `tel:${attrs.field_cs_phone.replace(/\s/g, '')}`,
      availability: attrs.field_cs_hours || [],
    });
  }
  
  // 2. Beneficiary support (button)
  if (attrs.field_beneficiary_button_url) {
    contactInformation.push({
      id: 'beneficiary-support',
      title: 'Beneficiary support',
      icon: '/icons/contact-and-support/circle_info.svg',
      buttonLabel: 'Go to Beneficiary support',
      buttonHref: attrs.field_beneficiary_button_url,
    });
  }
  
  // 3. Appointment booking (button)
  if (attrs.field_appointment_button_url) {
    contactInformation.push({
      id: 'appointment-booking',
      title: 'Appointment booking platform',
      icon: '/icons/contact-and-support/calendar.svg',
      buttonLabel: 'Book your appointment',
      buttonHref: attrs.field_appointment_button_url,
    });
  }
  
  // 4. SAIP location
  if (attrs.field_location_address_lines && attrs.field_location_address_lines.length > 0) {
    contactInformation.push({
      id: 'saip-location',
      title: 'SAIP location',
      icon: '/icons/contact-and-support/location.svg',
      locationAddress: attrs.field_location_address_lines,
    });
  }
  
  // 5. Social media (from simple link fields)
  const socialMedia: Array<{ ariaLabel: string; href: string; icon: string }> = [];
  const socialPlatforms = [
    { name: 'X', field: 'field_social_x_url', icon: '/icons/contact-and-support/x.svg' },
    { name: 'YouTube', field: 'field_social_youtube_url', icon: '/icons/contact-and-support/youtube.svg' },
    { name: 'Instagram', field: 'field_social_instagram_url', icon: '/icons/contact-and-support/instagram.svg' },
    { name: 'LinkedIn', field: 'field_social_linkedin_url', icon: '/icons/contact-and-support/linkedin.svg' },
    { name: 'Snapchat', field: 'field_social_snapchat_url', icon: '/icons/contact-and-support/snapchat.svg' },
    { name: 'Facebook', field: 'field_social_facebook_url', icon: '/icons/contact-and-support/facebook.svg' },
  ];
  
  socialPlatforms.forEach((platform) => {
    const url = (attrs as any)[platform.field]?.uri;
    if (url) {
      socialMedia.push({
        ariaLabel: platform.name,
        href: url,
        icon: platform.icon,
      });
    }
  });
  
  if (socialMedia.length > 0) {
    contactInformation.push({
      id: 'social-media',
      title: 'Social media',
      icon: '/icons/contact-and-support/internet.svg',
      socialMedia,
    });
  }
  
  // Use fallback if no data from Drupal
  const finalContactInfo = contactInformation.length > 0 ? contactInformation : FALLBACK_CONTACT_INFORMATION;
  
  console.log(`📞 CONTACT SUPPORT: Contact info items: ${finalContactInfo.length}`);
  if (finalContactInfo === FALLBACK_CONTACT_INFORMATION) {
    console.log('⚠️  CONTACT SUPPORT: Using FALLBACK contact information');
  } else {
    console.log(`✅ CONTACT SUPPORT: Using Drupal data (${finalContactInfo.length} items)`);
    console.log('  Items:', finalContactInfo.map(i => i.title).join(', '));
  }
  
  // Follow us section - same social media links
  const followUs = socialMedia.length > 0 ? socialMedia : FALLBACK_FOLLOW_US;
  
  console.log(`🔗 CONTACT SUPPORT: Follow us links: ${followUs.length}`);
  if (followUs === FALLBACK_FOLLOW_US) {
    console.log('⚠️  CONTACT SUPPORT: Using FALLBACK social links');
  } else {
    console.log(`✅ CONTACT SUPPORT: Using Drupal social links (${followUs.length} platforms)`);
    console.log('  Platforms:', followUs.map(s => s.ariaLabel).join(', '));
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Contact & support',
      description: extractText(attrs.field_hero_subheading) || '',
      backgroundImage: heroImageUrl,
    },
    contactInformation: finalContactInfo,
    appointmentBooking: {
      heading: extractText(attrs.field_appointment_heading) || 'Book your appointment with SAIP',
      description: extractText(attrs.field_appointment_description) || '',
      image: {
        src: '/images/contact-and-support/appointment-booking.png',
        alt: 'Appointment booking',
        className: 'rounded-2xl',
      },
      buttonHref: extractText(attrs.field_appointment_button_url) || '#',
    },
    beneficiarySupport: {
      heading: extractText(attrs.field_beneficiary_heading) || 'Beneficiary support',
      description: extractText(attrs.field_beneficiary_description) || '',
      image: {
        src: '/images/contact-and-support/beneficiary-support.png',
        alt: 'Beneficiary support',
        className: 'rounded-2xl',
      },
      buttonHref: extractText(attrs.field_beneficiary_button_url) || '#',
    },
    followUs,
    // Section headings from Drupal
    contactInfoHeading: extractText(attrs.field_contact_info_heading) || 'Contact information',
    formHeading: extractText(attrs.field_form_heading) || 'How can we help you?',
    socialHeading: extractText(attrs.field_social_heading) || 'Follow us on social media',
  };
}

// Main export function with 2-step UUID fetch
export async function getContactSupportPageData(locale?: string): Promise<ContactSupportData> {
  try {
    // Step 1: Get UUID
    const uuid = await fetchContactSupportUUID();
    if (!uuid) {
      console.log(`🔴 CONTACT SUPPORT: No UUID found, using fallback ❌ (${locale || 'en'})`);
      return getFallbackData();
    }

    // Step 2: Fetch by UUID with locale
    const result = await fetchContactSupportByUUID(uuid, locale);
    if (!result) {
      console.log(
        `🔴 CONTACT SUPPORT: Failed to fetch by UUID, using fallback ❌ (${locale || 'en'})`,
      );
      return getFallbackData();
    }

    const data = transformContactSupportPage(result.node, result.included);
    console.log(`🟢 CONTACT SUPPORT: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 CONTACT SUPPORT: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Contact Support fetch error:', error);
    return getFallbackData();
  }
}
