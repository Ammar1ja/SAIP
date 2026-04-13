import { fetchDrupal, getProxyUrl } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Logo Variant
export interface LogoVariant {
  title: string;
  description: string;
  downloads: {
    svg?: string;
    png?: string;
    jpg?: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

// Color Item (Main Colors)
export interface ColorItem {
  color: string; // hex
  r: number;
  g: number;
  b: number;
  title: string;
  description: string;
  className?: string;
}

// Simple Color Item (Secondary Colors)
export interface SimpleColorItem {
  color: string; // hex
  r: number;
  g: number;
  b: number;
  className?: string;
}

// Gradient Item
export interface GradientItem {
  gradient: string; // CSS gradient
  mobileRotation: number;
  className?: string;
}

// Frontend interface for Branding page
export interface BrandingData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  logo: {
    heading: string;
    description: string;
    fullDescription: string;
    image: string;
    imageLight: string;
  };
  logoVariants: LogoVariant[];
  colors: {
    heading: string;
    mainColors: ColorItem[];
    secondaryColors: SimpleColorItem[];
    secondaryGradientColors: GradientItem[];
  };
  font: {
    heading: string;
    description: string;
    fontName: string;
    downloadUrl: string;
  };
  brandGuide: {
    heading: string;
    description: string;
    image: string;
    downloadUrl?: string; // ✅ NEW: Editable download URL from CMS
  };
}

// Step 1: Fetch branding_page UUID (without locale to get canonical)
async function fetchBrandingPageUUID(): Promise<string | null> {
  try {
    const endpoint = `/node/branding_page?filter[status]=1&fields[node--branding_page]=drupal_internal__nid`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {});
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch branding page UUID:', error);
    return null;
  }
}

// Step 2: Fetch branding_page by UUID with locale
async function fetchBrandingPageByUUID(
  uuid: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    const includeFields = [
      'field_hero_background_image.field_media_image',
      'field_brand_guide_image.field_media_image',
      'field_brand_guide_document', // ✅ NEW: Brand guide download file
      'field_brand_guide_document.field_media_document', // ✅ File entity
      'field_logo_image.field_media_image',
      'field_logo_light_image.field_media_image',
      'field_logo_variants',
      'field_logo_variants.field_preview_image.field_media_image',
      'field_logo_variants.field_variant_svg',
      'field_logo_variants.field_variant_png',
      'field_logo_variants.field_variant_jpg',
      'field_main_colors',
      'field_secondary_colors',
      'field_gradient_colors',
    ].join(',');
    const endpoint = `/node/branding_page/${uuid}?include=${includeFields}`;
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
    console.error(`Failed to fetch branding page by UUID (${locale}):`, error);
    return null;
  }
}

// Transform function
export function transformBrandingPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): BrandingData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero background image
  let heroImageUrl = '/images/branding/hero.jpg';
  const heroImageRel = getRelated(rels, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  // Get logo image
  let logoImage = '/images/saip-logo-color.svg';
  const logoImageRel = getRelated(rels, 'field_logo_image', included);
  if (logoImageRel && !Array.isArray(logoImageRel)) {
    const imageData = getImageWithAlt(logoImageRel, included);
    if (imageData?.src) {
      logoImage = imageData.src;
    }
  }

  // Get logo light image
  let logoLightImage = '/images/saip-logo-white.svg';
  const logoLightImageRel = getRelated(rels, 'field_logo_light_image', included);
  if (logoLightImageRel && !Array.isArray(logoLightImageRel)) {
    const imageData = getImageWithAlt(logoLightImageRel, included);
    if (imageData?.src) {
      logoLightImage = imageData.src;
    }
  }

  // Get brand guide image
  let brandGuideImage = '/images/branding/saip-brand-guide.png';
  const brandGuideImageRel = getRelated(rels, 'field_brand_guide_image', included);
  if (brandGuideImageRel && !Array.isArray(brandGuideImageRel)) {
    const imageData = getImageWithAlt(brandGuideImageRel, included);
    if (imageData?.src) {
      brandGuideImage = imageData.src;
    }
  }

  // ✅ NEW: Get brand guide download file URL
  let brandGuideDownloadUrl: string | undefined;
  const brandGuideDocRel = getRelated(rels, 'field_brand_guide_document', included);
  if (brandGuideDocRel && !Array.isArray(brandGuideDocRel)) {
    // This is a media entity, get the file from field_media_document
    const fileEntity = getRelated(
      (brandGuideDocRel as any).relationships || {},
      'field_media_document',
      included,
    );
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        brandGuideDownloadUrl = getProxyUrl(uri, 'download');
      }
    }
  }

  // ============================================================================
  // LOGO VARIANTS
  // ============================================================================
  const logoVariants: LogoVariant[] = [];
  const logoVariantsRel = getRelated(rels, 'field_logo_variants', included);
  if (Array.isArray(logoVariantsRel)) {
    logoVariantsRel.forEach((paragraph: any) => {
      const pAttrs = paragraph.attributes || {};
      const pRels = paragraph.relationships || {};

      // Get file URLs from file fields (relationships -> file entities)
      const getFileUrl = (fieldName: string): string => {
        const fileEntity = getRelated(pRels, fieldName, included);
        if (fileEntity && !Array.isArray(fileEntity)) {
          const uri = (fileEntity.attributes as any)?.uri?.url;
          return uri || '';
        }
        return '';
      };

      const svgUrl = getFileUrl('field_variant_svg');
      const pngUrl = getFileUrl('field_variant_png');
      const jpgUrl = getFileUrl('field_variant_jpg');

      // Get preview image
      let previewSrc = '/images/saip-logo-color.svg';
      let previewAlt = extractText(pAttrs.field_variant_title) || 'Logo variant';
      const previewImageRel = getRelated(pRels, 'field_preview_image', included);
      if (previewImageRel && !Array.isArray(previewImageRel)) {
        const previewData = getImageWithAlt(previewImageRel, included);
        if (previewData?.src) {
          previewSrc = previewData.src;
          previewAlt = previewData.alt || previewAlt;
        }
      }

      logoVariants.push({
        title: extractText(pAttrs.field_variant_title) || '',
        description: extractText(pAttrs.field_variant_description) || '',
        downloads: {
          svg: svgUrl ? getProxyUrl(svgUrl, 'download') : undefined,
          png: pngUrl ? getProxyUrl(pngUrl, 'download') : undefined,
          jpg: jpgUrl ? getProxyUrl(jpgUrl, 'download') : undefined,
        },
        image: {
          src: previewSrc,
          alt: previewAlt,
        },
      });
    });
  }

  // ============================================================================
  // MAIN COLORS
  // ============================================================================
  const mainColors: ColorItem[] = [];
  const mainColorsRel = getRelated(rels, 'field_main_colors', included);
  if (Array.isArray(mainColorsRel)) {
    mainColorsRel.forEach((paragraph: any, idx: number) => {
      const pAttrs = paragraph.attributes || {};
      const className =
        idx === 0
          ? 'rounded-t-xl overflow-hidden'
          : idx === 3
            ? 'rounded-b-xl overflow-hidden'
            : '';
      mainColors.push({
        color: extractText(pAttrs.field_color_hex) || '#000000',
        r: pAttrs.field_color_r || 0,
        g: pAttrs.field_color_g || 0,
        b: pAttrs.field_color_b || 0,
        title: extractText(pAttrs.field_color_title) || '',
        description: extractText(pAttrs.field_color_description) || '',
        className,
      });
    });
  }

  // ============================================================================
  // SECONDARY COLORS
  // ============================================================================
  const secondaryColors: SimpleColorItem[] = [];
  const secondaryColorsRel = getRelated(rels, 'field_secondary_colors', included);
  if (Array.isArray(secondaryColorsRel)) {
    secondaryColorsRel.forEach((paragraph: any, idx: number) => {
      const pAttrs = paragraph.attributes || {};
      const className =
        idx === 0
          ? 'rounded-tl-xl overflow-hidden'
          : idx === 6
            ? 'rounded-tr-xl overflow-hidden'
            : '';
      secondaryColors.push({
        color: extractText(pAttrs.field_color_hex) || '#000000',
        r: pAttrs.field_color_r || 0,
        g: pAttrs.field_color_g || 0,
        b: pAttrs.field_color_b || 0,
        className,
      });
    });
  }

  // ============================================================================
  // GRADIENTS
  // ============================================================================
  const secondaryGradientColors: GradientItem[] = [];
  const gradientsRel = getRelated(rels, 'field_gradient_colors', included);
  if (Array.isArray(gradientsRel)) {
    gradientsRel.forEach((paragraph: any, idx: number) => {
      const pAttrs = paragraph.attributes || {};
      const className =
        idx === 0
          ? 'rounded-bl-xl overflow-hidden'
          : idx === 6
            ? 'rounded-br-xl overflow-hidden'
            : '';
      const mobileRotationValue = extractText(pAttrs.field_gradient_mobile);
      const mobileRotation = mobileRotationValue ? Number(mobileRotationValue) : 0;

      secondaryGradientColors.push({
        gradient: extractText(pAttrs.field_gradient_css) || '',
        mobileRotation: isNaN(mobileRotation) ? 0 : mobileRotation,
        className,
      });
    });
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Branding',
      description: extractText(attrs.field_hero_subheading) || '',
      backgroundImage: heroImageUrl,
    },
    logo: {
      heading: extractText(attrs.field_logo_heading) || 'SAIP logo',
      description: extractText(attrs.field_logo_description) || '',
      fullDescription: extractText(attrs.field_logo_full_description) || '',
      image: logoImage,
      imageLight: logoLightImage,
    },
    logoVariants,
    colors: {
      heading: extractText(attrs.field_colors_heading) || 'SAIP colors',
      mainColors,
      secondaryColors,
      secondaryGradientColors,
    },
    font: {
      heading: extractText(attrs.field_font_heading) || 'SAIP font',
      description: extractText(attrs.field_font_description) || '',
      fontName: extractText(attrs.field_font_name) || '29LT Bukra',
      downloadUrl: getProxyUrl(extractText(attrs.field_font_download_url) || '#', 'download'), // ✅ FIX: Use proxy
    },
    brandGuide: {
      heading: extractText(attrs.field_brand_guide_heading) || 'SAIP brand guide',
      description: extractText(attrs.field_brand_guide_description) || '',
      image: brandGuideImage,
      downloadUrl: brandGuideDownloadUrl, // ✅ NEW: From CMS, undefined = fallback
    },
  };
}

// Fallback data function
export function getBrandingFallbackData(): BrandingData {
  return {
    hero: {
      title: 'Branding',
      description: 'SAIP brand guidelines, logos, and visual identity resources.',
      backgroundImage: '/images/branding/hero.jpg',
    },
    logo: {
      heading: 'SAIP logo',
      description: 'The SAIP logo is available in multiple formats for different applications.',
      fullDescription: `The logo idea is inspired by the shape of a shield, reflecting the circular composition which embodies the spirit of continuous work and collaboration.

This shape also gives the inspiration of a protective shield, representing the role of SAIP in protecting and preserving rights.

The palm tree and sword are considered symbols of the Kingdom of Saudi Arabia, indicating a strong connection to all that this symbol reflects of authentic values, pride, strength, and honor.`,
      image: '/images/saip-logo-color.svg',
      imageLight: '/images/saip-logo-white.svg',
    },
    logoVariants: [],
    colors: {
      heading: 'SAIP colors',
      mainColors: [],
      secondaryColors: [],
      secondaryGradientColors: [],
    },
    font: {
      heading: 'SAIP font',
      description: "The font used in the SAIP's brand identity is:",
      fontName: '29LT Bukra',
      downloadUrl: '#',
    },
    brandGuide: {
      heading: 'SAIP brand guide',
      description: 'The guide to the identity of the SAIP and its uses.',
      image: '/images/branding/saip-brand-guide.png',
      downloadUrl: undefined, // Will use hardcoded fallback in page.tsx
    },
  };
}

// Main export function with 2-step UUID fetch
export async function getBrandingPageData(locale?: string): Promise<BrandingData> {
  try {
    // Step 1: Get UUID
    const uuid = await fetchBrandingPageUUID();
    if (!uuid) {
      console.log(`🔴 BRANDING: No UUID found, using fallback ❌ (${locale || 'en'})`);
      return getBrandingFallbackData();
    }

    // Step 2: Fetch by UUID with locale
    const result = await fetchBrandingPageByUUID(uuid, locale);
    if (!result) {
      console.log(`🔴 BRANDING: Failed to fetch by UUID, using fallback ❌ (${locale || 'en'})`);
      return getBrandingFallbackData();
    }

    const data = transformBrandingPage(result.node, result.included);
    console.log(`🟢 BRANDING: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 BRANDING: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Branding fetch error:', error);
    return getBrandingFallbackData();
  }
}
