import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import List from '@/components/atoms/List';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_PLANT_VARIETIES_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Subject matter eligibility
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the plant variety qualify as a protectable plant variety?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Eligible Plant varieties in Saudi Arabia:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    New plant varieties developed through{' '}
                    <b>breeding, selection, or genetic modification.</b>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Varieties that belong to a <b>recognized plant species</b> under SAIP
                    regulations.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Varieties that are <b>not naturally occurring</b> and result from human
                    intervention.
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
            A drought-resistant wheat variety developed through selective breeding.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety is NOT eligible for protection.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 2: Novelty (newness)
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is your plant variety new and not publicly available before filing?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check novelty:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The variety has <b>not been sold or commercially used</b> for more than:
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>1 year</b> in Saudi Arabia.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>4 years</b> internationally (6 years for trees and vines).
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    It has <b>not been disclosed</b> in publications, exhibitions, or databases.
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
            A high-yield tomato variety released in local markets 3 months ago would still be
            considered new.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety is NOT eligible for protection.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 3: Distinctiveness
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is your plant variety clearly distinguishable from known varieties?
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
                content: (
                  <>
                    The variety has at least{' '}
                    <b>one unique characteristic not found in existing varieties.</b>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Differences could be in{' '}
                    <b>
                      color, shape, growth habit, yield, resistance to diseases, or environmental
                      adaptability.
                    </b>
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    The distinctiveness must <b>be consistent across multiple samples.</b>
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
            A purple rice variety that remains purple throughout its growth cycle, unlike any
            existing variety.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety is NOT eligible for protection.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 4: Uniformity
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Do plants of this variety consistently show the same characteristics?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check uniformity:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The variety must <b>produce consistent traits</b> when propagated.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Variations should be minimal when grown under <b>similar conditions.</b>
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
            A melon variety with uniform sweetness levels and fruit size across different crops.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety is NOT eligible for protection.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 5: Stability
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the plant variety retain its characteristics over successive generations?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check stability:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The plant variety should <b>maintain its distinct and uniform traits</b> across
                    multiple propagation cycles (e.g., seeds, grafting, cuttings).
                  </>
                ),
              },
              {
                id: 2,
                content: <>No significant genetic drift or mutations should occur over time.</>,
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A grape variety that retains the same fruit color and yield over five propagation
            cycles.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety is NOT eligible for protection.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 6: Naming and documentation
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the plant variety have a unique and compliant name?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check stability:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The variety name must be{' '}
                    <b>unique, non-misleading, and not identical to an existing variety.</b>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    It should not contain <b>trademarks, commercial names, or offensive terms.</b>
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
            A breeder naming their new lettuce variety "Emerald Crisp" instead of using a generic
            term like "Green Lettuce."
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The variety must be renamed or additional documentation is required.',
        description: 'For more information go to IP clinics.',
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
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 7: Legal and ethical compliance
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the variety comply with Saudi regulations and public policies?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Prohibited Plant varieties:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    Varieties that <b>threaten biodiversity or public safety.</b>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Varieties <b>harmful to Islamic principles</b> (e.g., plants used for illegal
                    drugs).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Varieties that <b>contain unauthorized genetic modifications.</b>
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
            A medicinal plant variety that is legally recognized and not classified as a controlled
            substance is compliant.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'This plant variety qualifies for protection.',
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
        title: 'The variety is NOT protectable.',
        description: 'For more information go to IP clinics.',
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
