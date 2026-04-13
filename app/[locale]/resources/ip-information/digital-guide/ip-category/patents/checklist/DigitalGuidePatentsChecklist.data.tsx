import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import List from '@/components/atoms/List';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_PATENTS_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: Subject matter eligibility
        </Heading>
        <TextContent color="muted" weight="semibold" className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Does the invention fall into a patentable category?
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            Patentable categories in Saudi Arabia:
          </Paragraph>
          <List
            ordered
            className="font-semibold"
            items={[
              {
                id: 1,
                content: (
                  <>
                    Industrial Processes & Manufacturing
                    <Paragraph weight="normal" variant="compact">
                      Example: A <b>3D printing method</b> that reduces material waste and improves
                      efficiency.
                    </Paragraph>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Machines & Mechanical Devices
                    <Paragraph variant="compact">
                      Example: <b>A robotic</b> arm that automates delicate assembly processes in
                      manufacturing.
                    </Paragraph>
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Chemical Compositions & Pharmaceuticals
                    <Paragraph variant="compact">
                      Example: A <b>new drug formulation</b> that enhances the absorption of pain
                      relief medication.
                    </Paragraph>
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    Electrical & Electronic Devices
                    <Paragraph variant="compact">
                      Example: A <b>high-efficiency battery</b> with a longer lifespan for electric
                      vehicles.
                    </Paragraph>
                  </>
                ),
              },
              {
                id: 5,
                content: (
                  <>
                    Biotechnological Inventions
                    <Paragraph variant="compact">
                      Example: A <b>genetically engineered microorganism</b> that improves
                      wastewater treatment.
                    </Paragraph>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your idea does not fall into a patentable category and is NOT patentable.',
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
          Is your invention new and not publicly disclosed before filing?
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
                    Conduct a <b> prior art search</b> in SAIP’s patent database and international
                    databases.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Ensure no <b>public disclosures</b> (e.g., scientific papers, online
                    publications, previous patents).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Saudi law allows a 12-month grace period</b> if the inventor disclosed the
                    invention themselves.
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
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    A <b>new water filtration system</b> that removes contaminants more efficiently
                    than existing models. If no similar technology exists in published patents, it
                    is considered novel.
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The invention lacks novelty and is NOT patentable.',
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
          Step 3: Inventive step (non-obviousness)
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the invention provide a significant improvement or unexpected technical advancement?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph size="lg" weight="semibold">
            How to check inventiveness:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The invention <b>must not be obvious</b> to experts in the field.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    A simple <b>modification or combination</b> of known technology is{' '}
                    <b>not patentable</b> unless it achieves an <b>unexpected result.</b>
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
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    A <b>self-healing concrete</b> that automatically fills cracks using bacteria.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    If this concept had never been applied to construction materials before, it
                    demonstrates an <b>inventive step.</b>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The invention lacks an inventive step and is NOT patentable.',
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
          Step 4: Industrial applicability
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Can the invention be applied in an industry and provide a tangible benefit?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check industrial applicability:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    The invention must be <b>practically</b> usable in an industry (e.g.,
                    healthcare, energy, manufacturing).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    The invention should <b>solve a real-world problem</b> and not be{' '}
                    <b>purely theoretical.</b>
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
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    A <b>solar-powered desalination system</b> for turning seawater into drinking
                    water in remote areas.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    If it is functional and can be manufactured for large-scale use, it has{' '}
                    <b>industrial applicability.</b>
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The invention lacks industrial applicability and is NOT patentable.',
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
          Step 5: Enabling disclosure (technical completeness)
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is the invention described in enough detail for a skilled person to replicate it?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Required documents for patent application:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Detailed description</b> explaining how the invention works.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Claims</b> clearly defining what is being protected.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Drawings or diagrams</b> (if needed for better understanding).
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
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    A <b>new type of smart sensor</b> for monitoring air pollution. The patent
                    application should include:
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    A <b>technical breakdown</b> of how the sensor detects pollutants.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    A <b>diagram</b> showing its components and functions.
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The invention lacks sufficient disclosure and is NOT patentable.',
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
          Step 6: Legal and ethical compliance
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Does the invention comply with Saudi laws and public morality?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Prohibited inventions in Saudi Arabia:
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Anything harmful to Islamic principles or public order.</b>
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Technologies related to <b>weapons of mass destruction.</b>
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    Inventions that <b>risk public health, safety, or the environment.</b>
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
            A <b>medical robotic assistant</b> that helps in hospitals complies with{' '}
            <b>legal and ethical standards.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The invention violates legal or ethical restrictions and is NOT patentable.',
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
          Step 7: Freedom to operate (FTO) – recommended but not mandatory
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Could the invention infringe on existing patents?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            How to check freedom to operate (FTO):
          </Paragraph>
          <List
            ordered
            items={[
              {
                id: 1,
                content: (
                  <>
                    Search for <b>existing patents</b> that may conflict with your invention.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    Consult an <b>IP expert</b> to analyze potential infringement risks.
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
            A <b>next-generation lithium battery</b> may require checking if similar patented
            technologies already exist.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title:
          'Invention could infringe on existing patents – consider modifying the invention or seeking licensing agreements.',
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
        title: 'No existing patents are infringed you can proceed to final decision.',
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
