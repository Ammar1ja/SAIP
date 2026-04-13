import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_TRADEMARKS: DigitalGuideTabData[] = [
  {
    id: 'about',
    content: (
      <>
        <Heading as="h3" size="h3">
          About trademarks
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            What is a trademark?
          </Heading>
          <Paragraph variant="compact">
            A trademark includes names, words, symbols, numbers, images, patterns, colors, or
            combinations of these, used to distinguish goods or services of one enterprise from
            another or indicate the performance of a service.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Importance of trademark protection
          </Heading>
          <Paragraph variant="compact">
            Registering trademarks grants exclusive rights to use, license, and sell them. Over
            time, trademarks gain value, enhancing the owner's intangible assets.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Trademark vs. trade name
          </Heading>
          <Paragraph variant="compact">
            A trademark distinguishes products or services and falls under SAIP's jurisdiction. A
            trade name represents a business legally in contracts and is regulated by the Ministry
            of Trade.
          </Paragraph>
        </TextContent>
      </>
    ),
    cta: (
      <>
        <Paragraph variant="compact" className="font-semibold">
          Verify that your trademark is distinctive, unregistered, and aligned with classification
          standards.
        </Paragraph>
        <Button
          ariaLabel="Go to Trademarks checklist"
          href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.TRADEMARKS.CHECKLIST}
        >
          Trademarks checklist
        </Button>
      </>
    ),
  },
  {
    id: 'protection',
    content: (
      <>
        <Heading as="h3" size="h3">
          Trademark protection
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Trademark protection
          </Heading>
          <Paragraph variant="compact">
            To protect a trademark, submit a registration application via the Unified Platform for
            the SAIP Services on the SAIP platform.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Submitting a registration request
          </Heading>
          <Paragraph variant="compact">
            You may file the request personally or appoint an accredited IP agent to handle it on
            your behalf.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Selecting categories and activities
          </Heading>
          <Paragraph variant="compact">
            Choose the appropriate categories under the NICE Classification, which organizes goods
            and services into specific classes. Ensure the selected activity aligns with your
            trademark’s purpose, as protection applies only to registered categories.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Issuance of the trademark certificate
          </Heading>
          <Paragraph variant="compact">
            Upon fulfilling all requirements, a certificate is issued, granting exclusive rights to
            use, license, or sell the trademark. This protection lasts 10 years and is renewable.
          </Paragraph>
        </TextContent>
      </>
    ),
  },
  {
    id: 'registration-of-trademark',
    content: (
      <>
        <Heading as="h3" size="h3">
          Registration of trademark
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Providing trademark details
          </Heading>
          <Paragraph variant="compact">
            Include all required details of the intended trademark during registration, ensuring
            compliance with the SAIP platform requirements and avoiding prohibited elements under
            the Law of Trademarks for GCC countries (Royal Decree No. 51/M, dated 26/7/1435 AH) and
            related regulations.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Verifying trademark availability
          </Heading>
          <Paragraph variant="compact">
            Ensure the trademark is not previously registered by requesting a trademark search
            service or using the IP search engine.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Searching registered trademarks
          </Heading>
          <Paragraph variant="compact">
            Search for registered trademarks using keywords, applicant names, trademark owners,
            categories, classifications (International NICE Classification) or other standards
            before submission to the SAIP.
          </Paragraph>
        </TextContent>
      </>
    ),
    cta: (
      <>
        <TextContent className="space-y-1">
          <Paragraph className="font-semibold" variant="compact">
            Start the trademark registration process on the SAIP Platform
          </Paragraph>
          <Button
            ariaLabel="Go to SAIP Platform"
            href={ROUTES.SAIP.ROOT}
            className="place-self-center"
          >
            <HomeIcon size={20} /> Go to SAIP Platform
          </Button>
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph className="font-semibold" variant="compact">
            Interested in understanding trademarks better? Start your journey here!
          </Paragraph>
          <Button
            ariaLabel="Go to Trademarks journey"
            href={`${ROUTES.SERVICES.TRADEMARKS}?tab=journey`}
            intent="secondary"
            outline
            className="place-self-center"
          >
            <HomeIcon size={20} /> Go to Trademarks journey
          </Button>
        </TextContent>
      </>
    ),
  },
];
