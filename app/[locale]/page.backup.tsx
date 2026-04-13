import { AboutSaip } from '@/components/organisms/AboutSaip';
import { FeaturedNews } from '@/components/organisms/FeaturedNews';
import Highlights from '@/components/organisms/Highlights';
import { MainIpServices } from '@/components/organisms/MainIpServices';
import { Hero } from '@/components/organisms/Hero';
import { allHighlights, type HighlightCmsProps } from '@/lib/dummyCms/allHighlight';
import Seo from '@/components/atoms/Seo';
import { PageProps } from './types';

const getHighlights = async (): Promise<HighlightCmsProps[]> => allHighlights;

export default async function Web({ searchParams, params }: PageProps) {
  const { featuredNewsIndex, heroVideoIndex } = await searchParams;
  const { locale } = await params;
  const highlights = await getHighlights();

  return (
    <>
      <Seo titleKey="home.title" descriptionKey="home.description" />
      <Hero currentIndex={heroVideoIndex ? parseInt(heroVideoIndex as string, 10) : 0} />
      <AboutSaip
        heading="About SAIP"
        text="SAIP aims to guide, protect, manage and enforce beneficiaries' IP in the Kingdom in line with
                international best practices."
        image="/images/photo-container.png"
      />
      <MainIpServices
        heading="Main IP Services"
        text={
          <>
            <p>
              Intellectual property is the set of rights that protect human innovations and
              creations.
            </p>
            <p>
              At SAIP, through a wide range of services, we take care of IPs in multiple stages from
              guidance, protection, management to enforcement.
            </p>
            <p>Learn more about our Main IP Services:</p>
          </>
        }
      />
      <FeaturedNews
        currentIndex={featuredNewsIndex ? parseInt(featuredNewsIndex as string, 10) : 0}
        title="Featured news"
        text={
          <p>
            Stay informed with the latest updates from the SAIP including key announcements, policy
            changes, initiatives, and developments in the IP sector.
          </p>
        }
      />
      <Highlights
        highlights={highlights}
        heading="Highlights"
        text="Discover key sections of the SAIP website and access essential services, regulations, and resources
                designed to support and protect IP"
      />
    </>
  );
}
