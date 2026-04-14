import { AboutSaip } from '@/components/organisms/AboutSaip';
import { FeaturedNews } from '@/components/organisms/FeaturedNews';
import Highlights from '@/components/organisms/Highlights';
import { MainIpServices } from '@/components/organisms/MainIpServices';
import { Hero } from '@/components/organisms/Hero';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import {
  getHomepageData,
  transformServiceText,
  transformNewsText,
} from '@/lib/drupal/homepage.integration';
import Seo from '@/components/atoms/Seo';
import { PageProps } from './types';
import { getTranslations } from 'next-intl/server';

export const revalidate = 300;

export default async function Web({ searchParams, params }: PageProps) {
  const { featuredNewsIndex, heroVideoIndex } = await searchParams;
  const { locale } = await params;

  // Fetch homepage data and translation fallback in parallel.
  const [homepageData, t] = await Promise.all([getHomepageData(locale), getTranslations('home')]);

  // Extract video index with fallback handling
  const currentVideoIndex = heroVideoIndex ? parseInt(heroVideoIndex as string, 10) : 0;

  // Hero title and subtitle: use Drupal data if available and not empty, otherwise use translations.
  const heroTitle = homepageData.hero.heading?.trim() || t('heroTitle');
  const heroSubtitle = homepageData.hero.subheading?.trim() || t('heroSubtitle');

  return (
    <>
      {/* comment */}
      <Seo titleKey="home.title" descriptionKey="home.description" />

      <Hero
        title={heroTitle}
        description={heroSubtitle}
        currentIndex={currentVideoIndex}
        videos={homepageData.hero.videos}
      />

      <AboutSaip
        heading={homepageData.about.heading}
        text={homepageData.about.text}
        image={homepageData.about.image}
      />

      <MainIpServices
        heading={homepageData.services.heading}
        text={transformServiceText(homepageData.services.text)}
        items={homepageData.services.items}
      />

      <FeaturedNews
        currentIndex={featuredNewsIndex ? parseInt(featuredNewsIndex as string, 10) : 0}
        title={homepageData.featuredNews.title}
        text={transformNewsText(homepageData.featuredNews.text)}
        buttonLabel={homepageData.featuredNews.buttonLabel}
        items={homepageData.featuredNews.items}
      />

      <Highlights
        highlights={homepageData.highlights.highlights}
        heading={homepageData.highlights.heading}
        text={homepageData.highlights.text}
      />

      <FeedbackSection />
    </>
  );
}
