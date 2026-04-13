import type { ChecklistStep } from '@/context/ChecklistContext';
import List from '@/components/atoms/List';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_CHECK_IDEA_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <Paragraph variant="compact" size="lg" weight="semibold">
        Is the idea a creative work expressed in a tangible form?
      </Paragraph>
    ),
    onYes: {
      type: 'nextStep',
    },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'The idea is not eligible for IP protection.',
        description: 'It must be documented, created, or developed into a tangible form.',
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
      <List
        className="font-semibold text-lg space-y-4"
        ordered
        items={[
          {
            id: 1,
            content: (
              <>
                Is the idea an original work of authorship, such as:
                <List
                  className="font-normal text-base space-y-2"
                  items={[
                    {
                      id: 1,
                      content: (
                        <>
                          <b>Books, articles, and written content</b> (e.g., novels, academic
                          papers, scripts).
                        </>
                      ),
                    },
                    {
                      id: 2,
                      content: (
                        <>
                          <b>Art, sculptural, and photography</b> (e.g., Paintings, sculptures,
                          artistic photographs.).
                        </>
                      ),
                    },
                    {
                      id: 3,
                      content: (
                        <>
                          <b>Software and digital content</b> (e.g., website code, video game
                          designs, mobile apps).
                        </>
                      ),
                    },
                  ]}
                />
              </>
            ),
          },
          {
            id: 2,
            content:
              'Is the work fixed in a tangible medium (written, recorded, stored digitally)?',
          },
          { id: 3, content: 'Is the work original and not copied?' },
        ]}
      />
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.COPYRIGHTS.ROOT,
      content: {
        title:
          'You have been redirected to the copyright information page as your work satisfies the criteria for copyright protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'nextStep',
    },
  },
  {
    content: (
      <>
        <List
          className="font-semibold text-lg space-y-4"
          ordered
          items={[
            {
              id: 1,
              content: 'Is the idea identify or distinguish a business, product, or service?',
            },
            {
              id: 2,
              content: 'Is it a unique name, logo, slogan, or symbol?',
            },
            { id: 3, content: 'Is it intended for commercial use?' },
            {
              id: 4,
              content: (
                <>
                  Examples:
                  <List
                    className="font-normal"
                    items={[
                      {
                        id: 1,
                        content: (
                          <>
                            <b>Logo</b> (e.g., the Nike swoosh, Apple logo).
                          </>
                        ),
                      },
                      {
                        id: 2,
                        content: (
                          <>
                            <b>Brand names</b> (e.g., "Coca-Cola," "Samsung").
                          </>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </>
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.TRADEMARKS.ROOT,
      content: {
        title:
          'You have been redirected to the trademark information page as your work meets the criteria for trademark protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'nextStep',
    },
  },
  {
    content: (
      <>
        <List
          className="font-semibold text-lg space-y-4"
          ordered
          items={[
            { id: 1, content: 'Is the idea solve a technical or functional problem?' },
            {
              id: 2,
              content: 'Is it a new product, process, machine, or technological innovation?',
            },
            { id: 3, content: 'Is it novel, inventive, and industrially applicable?' },
            {
              id: 4,
              content: 'Is it more than just an abstract idea, theory, or mathematical formula?',
            },
          ]}
        />
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Examples:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>New machines or devices</b> (e.g., a solar-powered water purification
                    system).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Medical innovations</b> (e.g., a new vaccine formulation).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Software-based inventions</b> (e.g., an AI-driven diagnostic tool).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PATENTS.ROOT,
      content: {
        title:
          'You have been redirected to the patent information page as your work meets the criteria for patent protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'nextStep',
    },
  },
  {
    content: (
      <>
        <List
          className="font-semibold text-lg space-y-4"
          ordered
          items={[
            {
              id: 1,
              content: 'Is the idea relate to the visual or aesthetic appearance of a product?',
            },
            {
              id: 2,
              content: 'Is it a new and unique shape, pattern, or decoration?',
            },
            {
              id: 3,
              content: "Does it enhance a product's marketability without affecting its function?",
            },
          ]}
        />
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Examples:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Fashion designs</b> (e.g., a unique handbag shape or clothing pattern).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Electronics</b> (e.g., the design of a smartphone body).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Furniture and home products</b> (e.g., a uniquely designed chair).
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    <b>Car body shapes</b> (e.g., the streamlined design of a sports car).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.DESIGNS.ROOT,
      content: {
        title:
          'You have been redirected to the design information page as your work meets the criteria for design protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'nextStep',
    },
  },
  {
    content: (
      <>
        <List
          className="font-semibold text-lg space-y-4"
          ordered
          items={[
            {
              id: 1,
              content:
                'Is the idea involve the design of a semiconductor or electronic circuit layout?',
            },
            {
              id: 2,
              content: 'Is it original and not commonly known in the industry?',
            },
          ]}
        />
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Examples:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Microchip design</b> (e.g., a new architecture for faster processors).
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Printed circuit board (PCB) layouts</b> (e.g., a specialized motherboard for
                    gaming PCs).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Semiconductor design patterns</b> (e.g., an efficient power management
                    circuit).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
        .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.ROOT,
      content: {
        title:
          'You have been redirected to the topographic designs of IC information page as your work meets the criteria for design protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'nextStep',
    },
  },
  {
    content: (
      <>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Is the idea contains plant variety distinct, uniform, stable, and new?
        </Paragraph>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Was it developed through breeding or genetic modification?
        </Paragraph>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Can it be reproduced consistently?
        </Paragraph>{' '}
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Examples:
          </Paragraph>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Microchip design</b> (e.g., a new architecture for faster processors).{' '}
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Printed circuit board (PCB) layouts</b> (e.g., a specialized motherboard for
                    gaming PCs).
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Semiconductor design patterns</b> (e.g., an efficient power management
                    circuit).
                  </>
                ),
              },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: {
      type: 'redirect',
      href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.ROOT,
      content: {
        title:
          'You have been redirected to the plant varieties information page as your work meets the criteria for plants protection.',
        actions: {
          primary: {
            ariaLabel: 'Go back',
            children: 'Go back',
            action: 'back',
          },
        },
      },
    },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Probably your idea is not an IP.',
        description: 'For more information and help go to IP Clinics.',
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
