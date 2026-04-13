import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import List from '@/components/atoms/List';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_TRADEMARKS_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Distinctiveness
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is your trademark unique and capable of distinguishing your goods or services?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check distinctiveness:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: 'The mark should not be generic or purely descriptive.',
              },
              {
                id: 2,
                content:
                  'It should have unique elements (e.g., a coined word, stylized font, or unique design).',
              },
              {
                id: 3,
                content:
                  'Avoid commonly used words in your industry unless they have acquired distinctiveness.',
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A creative brand name like <b>"Zyphon"</b> for an electronics company is distinctive,
            while <b>"Smart Phones"</b> is too generic.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'You have to modify your trademark to make it distinctive.',
      },
    },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 2: Non-conflict with existing marks
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is your trademark free from conflicts with prior registrations?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check for conflicts:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: 'Conduct a trademark search in SAIP’s database.',
              },
              {
                id: 2,
                content:
                  'Ensure the mark does not sound or look too similar to an existing registered trademark.',
              },
              {
                id: 3,
                content: 'Consider variations in spelling, phonetics, and translations.',
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            If <b>"TechStar"</b> is already registered for software, applying for <b>"TekStar"</b>{' '}
            may lead to rejection due to similarity.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'You have to choose more unique name or design for your trademark.',
      },
    },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 3: Compliance with legal restrictions
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does your trademark comply with Saudi and GCC trademark regulations?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Prohibited marks:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    Marks containing <b>public emblems, flags, or official symbols</b> (e.g., Saudi
                    national emblem).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Marks that <b>violate public order, morals, or religious values.</b>
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Marks that <b>mislead consumers</b> about the nature, quality, or origin of the
                    goods/services.
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    Marks containing{' '}
                    <b>well-known personalities’ names or images without consent.</b>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A trademark using a <b>Red Crescent</b> symbol or{' '}
            <b>a deceptive geographical indication</b> like "Swiss Watches" (when not from
            Switzerland) will be rejected.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'You have to modify your mark to comply with legal guidelines.',
      },
    },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 4: Trademark format and classification
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is your trademark properly formatted and classified?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check trademark format:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    Ensure the mark is presented as a{' '}
                    <b>wordmark, figurative mark, or combined mark.</b>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check classification:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    Assign the trademark to the correct <b>Nice Classification</b> category.
                  </>
                ),
              },
              {
                id: 2,
                content: 'Ensure the classification aligns with the intended goods/services.',
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            Registering <b>"AquaPure"</b> for bottled water should fall under Class 32 (beverages),
            not <b>Class 25</b> (clothing).
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'You have to adjust the classification or presentation.',
        description:
          'For more information go to the file about classification that you can find in guidelines.',
        actions: {
          primary: {
            ariaLabel: 'Go to Guidelines',
            children: 'Go to Guidelines',
            href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
          },
        },
      },
    },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 5: Ownership and documentation
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Do you have the required documents for filing?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Required documents for SAIP application:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    A <b>clear representation of the trademark</b> (in JPG or PNG format).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    A <b>list of goods/services</b> under the correct classification.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    A <b>Power of Attorney</b> (if filing through an agent or representative).
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    A <b>priority document</b> (if claiming priority from a foreign registration).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            If applying through a law firm, a signed <b>Power of Attorney</b> must be included in
            the application.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'You have to gather the necessary documentation to continue.',
      },
    },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 6: Use and renewal obligations
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Will your trademark be actively used in commerce?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Trademark use rules:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    A registered trademark must be <b>used in commerce</b> to avoid cancellation.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Non-use for <b>five consecutive years</b> can lead to cancellation by
                    third-party claims.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Trademarks must be <b>renewed every 10 years</b> with SAIP.
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    A <b>priority document</b> (if claiming priority from a foreign registration).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            If a trademark <b>remains unused</b> for over five years, competitors may challenge its
            validity.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your trademark qualifies for protection.',
        description: 'Go to SAIP platform to start the process.',
        actions: {
          primary: {
            ariaLabel: 'Go to SAIP platform',
            children: 'Go to SAIP platform',
            href: ROUTES.SAIP.ROOT,
          },
        },
      },
    },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your trademark does NOT qualify for protection.',
        description:
          'Plan for proper trademark usage to maintain rights. For more information go to IP Clinics.',
        actions: {
          primary: {
            ariaLabel: 'Go to IP clinics',
            children: 'Go to IP clinics',
            href: ROUTES.SERVICES.IP_CLINICS,
          },
        },
      },
    },
  },
];
