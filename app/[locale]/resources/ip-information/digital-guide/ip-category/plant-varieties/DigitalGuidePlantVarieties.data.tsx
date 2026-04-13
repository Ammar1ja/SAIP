import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import List from '@/components/atoms/List';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import { ROUTES } from '@/lib/routes';
import { HomeIcon } from 'lucide-react';

export const DIGITAL_GUIDE_PLANT_VARIETIES: DigitalGuideTabData[] = [
  {
    id: 'about',
    content: (
      <>
        <Heading as="h3" size="h3">
          About plant varieties
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            New plant variety
          </Heading>
          <Paragraph variant="compact">
            A new plant variety is a botanical group from one botanical class, from the lowest known
            ranks, which can be defined by expressing the characteristics resulting from a specific
            genetic composition or set of genetic structures.
          </Paragraph>
        </TextContent>
        <Paragraph variant="compact">
          It must distinguish itself from any other plant group by expressing at least one of these
          characteristics and must be able to reproduce without change.
        </Paragraph>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Plant breeder
          </Heading>
          <Paragraph variant="compact">
            The plant breeder is the person who bred, discovered, or developed a new plant variety.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Plant variety rights
          </Heading>
          <Paragraph variant="compact">
            Plant variety rights are an exclusive right granted to the owner, providing protection
            under the system and its regulations. This right allows the owner to:
          </Paragraph>
          <List
            items={[
              { id: 1, content: 'produce' },
              { id: 2, content: 'multiply' },
              { id: 3, content: 'adapt for reproduction purposes' },
              { id: 4, content: 'export' },
              { id: 5, content: 'import' },
              { id: 6, content: 'display for sale' },
              { id: 7, content: 'sell' },
              {
                id: 8,
                content:
                  'store for any of the above purposes or license others to do so, and prevents unauthorized exploitation.',
              },
            ]}
          />
        </TextContent>
      </>
    ),
    cta: (
      <>
        <Paragraph variant="compact" className="font-semibold">
          Ensure the plant variety is distinct, uniform, stable and meets registration criteria.
        </Paragraph>
        <Button
          ariaLabel="Go to Plant varieties checklist"
          href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.CHECKLIST}
        >
          Plant varieties checklist
        </Button>
      </>
    ),
  },
  {
    id: 'protection',
    content: (
      <>
        <Heading as="h3" size="h3">
          Protection of Plant varieties
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Conditions for obtaining plant patents
          </Heading>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Novelty:</b> The plant variety must be new, meaning it has not been sold or
                    made available to others by the breeder or consented for commercial exploitation
                    at the time of filing the application or in the priority claimed.
                    <div className="ms-6">
                      <List
                        items={[
                          {
                            id: 1,
                            content: (
                              <>
                                <b>In Saudi Arabia:</b> it must be at least one year ago.
                              </>
                            ),
                          },
                          {
                            id: 2,
                            content: (
                              <>
                                <b>In other countries:</b> it must be at least four or six years
                                ago, depending on whether the variety is a tree or vine.
                              </>
                            ),
                          },
                        ]}
                      />
                    </div>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Distinctness:</b> The plant variety must be clearly distinguishable from any
                    other variety well-known at the time of filing the application or in the
                    priority claimed.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Uniformity:</b> The plant variety must have uniform characteristics, taking
                    into account expected variations in its reproductive properties.
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    <b>Stability:</b> The plant variety must have stable characteristics that do not
                    change after repeated reproduction or at the end of a specific reproduction
                    cycle.
                  </>
                ),
              },
              {
                id: 5,
                content: (
                  <>
                    <b>Identification:</b> The plant variety must have a name that identifies its
                    genus and species and allows for the variety to be clearly identified
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
  },
  {
    id: 'submitting-application',
    content: (
      <>
        <Heading as="h3" size="h3">
          Applying for plant variety protection
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Applying for plant variety protection
          </Heading>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Submit through unified platform:</b> You can apply for plant variety
                    protection through the Unified Platform for IP Services on the SAIP website if
                    your residence is within Saudi Arabia
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Appoint an agent:</b> Alternatively, you can appoint one of the accredited IP
                    agents to submit the application on your behalf.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Reference databases:</b> Before submitting your application, you can search
                    for related plant variety certificates in the previously mentioned databases and
                    use them as a reference when filing your request.
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    cta: (
      <>
        <TextContent className="space-y-1">
          <Paragraph className="font-semibold" variant="compact">
            Start the plant varieties application process on the SAIP Platform
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
            Interested in understanding plant varieties better? Start your journey here!
          </Paragraph>
          <Button
            ariaLabel="Go to Plant Varieties journey"
            href={`${ROUTES.SERVICES.PLANT_VARIETIES}?tab=journey`}
            intent="secondary"
            outline
            className="place-self-center"
          >
            <HomeIcon size={20} /> Go to Plant Varieties journey
          </Button>
        </TextContent>
      </>
    ),
  },
];
