import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_DESIGNS_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Novelty & originality
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          1.1 Has the design been publicly disclosed, exhibited, or used in commerce before filing?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A chair design publicly displayed at a trade show one year before filing is eligible,
            but one disclosed five years ago is not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
    onNo: { type: 'nextStep' },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Novelty & originality
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          1.2 Is the design significantly different from existing registered designs?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A handbag design featuring a unique pattern arrangement may qualify, while an identical
            copy of an existing design will not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
          Step 2: Aesthetic & non-functional features
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          2.1 Does the design focus on ornamental or decorative features rather than functional
          aspects?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A decorative smartphone case with engraved patterns qualifies, but a case designed
            solely for durability without unique visual elements does not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
          Step 2: Aesthetic & non-functional features
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          2.2 Does the design apply to a physical product?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A textile pattern for clothing is eligible, but a purely conceptual drawing with no
            intended application is not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
          Step 3: Compliance with legal & ethical standards
        </Heading>
        <Paragraph
          variant="compact"
          size="lg"
          weight="semibold"
          className="text-text-pri-paragraph"
        >
          3.1 Does the design include official emblems, national flags, religious symbols, or
          offensive content?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold" className="text-text-default">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A coffee mug featuring a copyrighted company logo without permission does not qualify.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
    onNo: { type: 'nextStep' },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 3: Compliance with legal & ethical standards
        </Heading>
        <Paragraph
          variant="compact"
          size="lg"
          weight="semibold"
          className="text-text-pri-paragraph"
        >
          3.2 Does the design comply with Islamic law, public order, and safety standards?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold" className="text-text-default">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A packaging design for a legally prohibited product would not be eligible for
            protection.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
          Step 4: Classification & documentation
        </Heading>
        <Paragraph
          variant="compact"
          size="lg"
          weight="semibold"
          className="text-text-pri-paragraph"
        >
          4.1 Has the design been classified under the Locarno Classification system?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold" className="text-text-default">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A car wheel rim design must be classified under Class 12 (means of transport).
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title:
          'Your design has not been classified under the Locarno Classification system. Ensure proper classification before submission.',
        description: 'For more information go to classification file in guidelines.',
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
          Step 4: Classification & documentation
        </Heading>
        <Paragraph
          variant="compact"
          size="lg"
          weight="semibold"
          className="text-text-pri-paragraph"
        >
          4.2 Do you have clear design representations (drawings, images, multiple views)?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold" className="text-text-default">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A filing with only a verbal description and no visual representation will be rejected.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your design qualifies for protection.',
        description: 'For more information go to IP clinics.',
        actions: {
          primary: {
            ariaLabel: 'Go to SAIP platfom',
            children: 'Go to SAIP platfom',
            href: ROUTES.SAIP.ROOT,
          },
        },
      },
    },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design does NOT qualify for protection.',
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
