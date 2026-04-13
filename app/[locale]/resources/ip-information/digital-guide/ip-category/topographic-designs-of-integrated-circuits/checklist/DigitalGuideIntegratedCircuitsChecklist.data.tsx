import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_INTEGRATED_CIRCUITS_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Novelty & originality
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          1.1 Has the design been publicly disclosed or commercially used for more than two years
          before filing?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A circuit design used in commercial production for <b>five years</b> before filing is{' '}
            <b>not eligible</b> for protection.
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
          1.2 Does the design reflect intellectual effort beyond standard layouts?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            If your design is <b>merely a duplication</b> of existing integrated circuit layouts
            without any novel arrangement, it <b>does not qualify.</b>
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
          Step 2: Structure & functionality
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          2.1 Does the design include a three-dimensional arrangement of circuit elements?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A design consisting of <b>only a schematic diagram</b> with no physical arrangement does{' '}
            <b>not qualify.</b>
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
          Step 2: Structure & functionality
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          2.2 Does the design contain at least one active element that contributes to circuit
          function?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A layout that only <b>includes passive components (e.g., resistors, capacitors)</b>{' '}
            without active elements <b>does not qualify.</b>
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
          Step 3: Non-functional exclusivity
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is the layout dictated solely by functional or technical requirements?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A design arranged purely for <b>functional efficiency</b> without any unique layout
            innovation <b>does not qualify.</b>
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
          Step 4: Commercial use & protection
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          4.1 Has the design been commercially used for more than two years before filing?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A design that has been used in <b>mass production for three years</b> is{' '}
            <b>not eligible</b> for registration.
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
          Step 4: Commercial use & protection
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          4.2 Do you intend to use, sell, or license the design as a protected intellectual property
          asset?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            If you only created the design for{' '}
            <b>personal research without plans for commercialization,</b> it{' '}
            <b>does not qualify.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
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
    onYes: { type: 'nextStep' },
  },
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 5: Compliance with legal & ethical standards
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          5.1 Does the design include trademarks, flags, or official emblems of third parties?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A TDIC containing a <b>company’s logo or a national flag</b> is <b>not eligible</b> for
            protection.
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
          Step 5: Compliance with legal & ethical standards
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          5.2 Does the design violate Islamic law, public safety, or environmental standards?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A design intended for <b>illegal or harmful activities,</b> such as disrupting
            communication networks, <b>does not qualify.</b>
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
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your design qualifies for protection.',
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
  },
];
