import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import List from '@/components/atoms/List';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_INTEGRATED_CIRCUITS: DigitalGuideTabData[] = [
  {
    id: 'about',
    content: (
      <>
        <Heading as="h3" size="h3">
          About Layout designs of Integrated Circuits
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            What is a Layout designs of IC?
          </Heading>
          <Paragraph variant="compact">
            It is the three-dimensional arrangement of elements of an integrated circuit and all or
            some of its interconnections — where at least one of these elements is active — or the
            three-dimensional layout intended for the manufacture of an integrated circuit.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Layout design protection
          </Heading>
          <Paragraph variant="compact">
            It is a document that grants its owner exclusive rights to use the design commercially,
            license it, or sell it. It also prevents others from copying or imitating the design
            without permission. Registering topographic designs of IC aims to protect the
            arrangement of circuit lines and interconnections that connect the circuit’s elements to
            perform an electronic function.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Commercial use and restrictions
          </Heading>
          <Paragraph variant="compact">
            Exploitation of the design for commercial purposes must not Violate Islamic law
            (Sharia), harm human, animal, or plant life or health, cause environmental damage,
            contain trademarks, flags, or official emblems of third parties without authorization.
          </Paragraph>
        </TextContent>
      </>
    ),
    cta: (
      <>
        <Paragraph variant="compact" className="font-semibold">
          Verify the originality and eligibility of your Layout Designs of Integrated Circuits
          Checklist for legal protection.
        </Paragraph>
        <Button
          ariaLabel="Go to Layout designs of IC checklist"
          href={
            ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
              .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.CHECKLIST
          }
        >
          Layout designs of IC checklist
        </Button>
      </>
    ),
  },
  {
    id: 'protection',
    content: (
      <>
        <Heading as="h3" size="h3">
          Layout design of Integrated Circuits protection
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Layout design of IC mandatory conditions
          </Heading>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    Layout design of IC must be new and not previously known among designers and
                    manufacturers of integrated circuits at the time of its creation, and consisting
                    of a combination of known elements and interconnections may still be considered
                    original if the combination itself is unique.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    It must not have been <b>commercially exploited</b> for more than{' '}
                    <b>two years</b> before the application date in any part of the world, If the
                    design was commercially used beyond this period, it is <b>not eligible</b> for
                    registration.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Topographic design of IC must have an original arrangement of circuit elements
                    that sets it apart from existing designs in the industry, a layout dictated
                    purely by <b>functional or technical necessity</b> without innovation is{' '}
                    <b>not registrable.</b>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Searching databases
          </Heading>
          <Paragraph variant="compact">
            To verify whether the topographic design of IC is new, specialized information databases
            can be searched, these databases help finding ideas for new products, Identifying
            opportunities to improve existing products, Ensuring that the design does not infringe
            on others' registered intellectual property rights.
          </Paragraph>
          <Paragraph variant="compact">
            You can search registered design information using keywords, competitor or applicant
            name searches, designers using IP search engines and global design database
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Commercial use and restrictions
          </Heading>
          <Paragraph variant="compact">
            Exploitation of the design for commercial purposes must not Violate Islamic law
            (Sharia), harm human, animal, or plant life or health, cause environmental damage,
            contain trademarks, flags, or official emblems of third parties without authorization.
          </Paragraph>
        </TextContent>
      </>
    ),
  },
  {
    id: 'prototype',
    content: (
      <>
        <Heading as="h3" size="h3">
          The prototype
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Layout design of IC mandatory conditions
          </Heading>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The initial <b>prototype model</b> is a preliminary version of a{' '}
                    <b>Layout design of Integrated Circuits</b>, created to evaluate the idea and
                    refine it into a final design for market release. It serves as a{' '}
                    <b>practical representation</b> of the concept, helping assess key
                    specifications and ensure functionality.
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Importance of the prototype
          </Heading>
          <Paragraph variant="compact">
            While a prototype is not required to obtain a topographic design of Integrated Circuits
            certificate, it is a valuable tool for testing, improving the design, and validating its
            feasibility before market launch.
          </Paragraph>
        </TextContent>
        <Paragraph variant="compact">
          Additionally, developing an experimental prototype can be beneficial for presenting the
          design to investors.
        </Paragraph>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            IP Clinics
          </Heading>
          <Paragraph variant="compact">
            You can benefit from guidance services provided by IP clinics.
          </Paragraph>
        </TextContent>
      </>
    ),
  },
  {
    id: 'registration-of-designs',
    content: (
      <>
        <Heading as="h3" size="h3">
          Registration of designs
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Submit a Layout design of Integrated Circuits application
          </Heading>
          <Paragraph variant="compact">
            You can submit an electronic application to register your topographic design of IC
            through the SAIP website if you reside in Saudi Arabia.
          </Paragraph>
          <Paragraph variant="compact">
            Alternatively, you may appoint an authorized IP agent to submit the application on your
            behalf.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Searching for reference models
          </Heading>
          <Paragraph variant="compact">
            To submit the application for registering the topographic design of IC yourself, you can
            search for relevant design certificates in the previously mentioned databases and use
            them as a reference model when preparing your application.
          </Paragraph>
        </TextContent>
      </>
    ),
    cta: (
      <>
        <TextContent className="space-y-1">
          <Paragraph className="font-semibold" variant="compact">
            Start the optional registration process on the SAIP Platform
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
            Interested in understanding copyrights better? Start your journey here!
          </Paragraph>
          <Button
            ariaLabel="Go to Layout designs of IC journey"
            href={`${ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS}?tab=journey`}
            intent="secondary"
            outline
            className="place-self-center"
          >
            <HomeIcon size={20} /> Go to Layout designs of IC journey
          </Button>
        </TextContent>
      </>
    ),
  },
];
