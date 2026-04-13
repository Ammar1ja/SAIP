import type { ChecklistStep } from '@/context/ChecklistContext';
import Heading from '@/components/atoms/Heading';
import List from '@/components/atoms/List';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_COPYRIGHTS_CHECKLIST: ChecklistStep[] = [
  {
    content: (
      <>
        <Heading as="h3" size="h3">
          Step 1: General eligibility
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          1.1 Is the work an original intellectual creation?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>self-authored research</b> paper qualifies, while a copied or{' '}
            <b>AI-generated work</b> does not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: {
      type: 'nextStep',
    },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 1: General eligibility
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          1.2 Has the work been fixed in a tangible form (written, recorded, digital, or physical)?
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>recorded speech</b> qualifies, but an oral <b>lecture without a recording</b> does
            not.
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Architectural works
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.1 Does the work include building designs, blueprints, or construction plans?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.2 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'Technical drawings and blueprints (PDF format)' },
              { id: 2, content: 'Final architectural design (elevations and sections)' },
              { id: 3, content: 'Final architectural design (elevations and sections)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>modern mosque design,</b> submitted with{' '}
            <b>detailed blueprints and 3D render images.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Computer programs & applications
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.3 Is the work a software program, mobile application, or script?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.4 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'Essential source code (not full proprietary code)' },
              { id: 2, content: 'Software description (functionality and purpose)' },
              { id: 3, content: 'Screenshots of the user interface' },
              { id: 4, content: 'Proof of ownership (if filed by a company)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>finance mobile app</b> with <b>source code, UI design, and proof of ownership.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Cartographic & planning works
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.5 Does the work include maps, town planning designs, or geographical representations?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.6 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'Final cartographic design (PDF format)' },
              { id: 2, content: 'High-resolution map images (JPG, PNG)' },
              { id: 3, content: 'Detailed description of scale, projection, and symbols used' },
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
                    A <b>tourist map of Riyadh</b> with{' '}
                    <b>detailed labels and projection information.</b>
                  </>
                ),
              },
              { id: 2, content: <b>Three-Dimensional Artistic & Geographic Works</b> },
            ]}
          />
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <Paragraph variant="compact" size="lg" weight="semibold">
          2.7 Is the work a sculpture, relief, 3D model, or topographical representation?
        </Paragraph>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.8 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'High-resolution images (JPG, PNG)' },
              { id: 2, content: 'Technical description (dimensions, material, artistic concept)' },
              { id: 3, content: 'Proof of originality (if applicable)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>bronze sculpture of a Saudi historical figure,</b> submitted with{' '}
            <b>detailed photos and an artist’s statement.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Artistic & applied arts works
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.9 Does the work include paintings, calligraphy, industrial designs, or decorative
            arts?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.10 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'High-quality images (JPG, PNG)' },
              { id: 2, content: 'Description of artwork (medium, size, artistic intention)' },
              { id: 3, content: 'Gallery exhibition details (if applicable)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>calligraphy painting with Quranic verses,</b> submitted with{' '}
            <b>a detailed description.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Photographic works
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.11 Is the work a photograph, digital photography, or visual composition?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.12 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'High-quality images (JPG, PNG)' },
              { id: 2, content: 'Metadata (date, location, author name, camera settings)' },
              { id: 3, content: 'Proof of authorship (if applicable)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>photo collection documenting Saudi cultural festivals,</b> submitted with{' '}
            <b>metadata and artistic descriptions.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Written works
          </Paragraph>
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.13 Does the work include books, articles, research papers, or written scripts?
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 2: Work type & specific requirements
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Identify your work type and verify the required documents.
        </Paragraph>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            2.14 Do you have required documents:
          </Paragraph>
          <List
            className="ms-6"
            items={[
              { id: 1, content: 'Full manuscript in Arabic (or with an official translation)' },
              { id: 2, content: 'ISBN (if applicable) for published books' },
              { id: 3, content: 'Proof of publication (if already distributed)' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Paragraph variant="compact" size="lg" weight="semibold">
            Example:
          </Paragraph>
          <Paragraph variant="compact">
            A <b>scientific research paper on environmental sustainability,</b> submitted with{' '}
            <b>ISBN and publisher details.</b>
          </Paragraph>
        </TextContent>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 3: Ownership & legal compliance
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          3.1 Do you own the rights to this work, or have you been assigned the rights?
        </Paragraph>
      </>
    ),
    onYes: { type: 'nextStep' },
    onNo: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection.',
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
          Step 3: Ownership & legal compliance
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          3.2 Does the work contain third-party elements (trademarks, national symbols, copyrighted
          music)?
        </Paragraph>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your work does NOT qualify for protection unless properly licensed.',
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
          Step 4: Public disclosure & registration timeframe
        </Heading>
        <Paragraph variant="compact" size="lg" weight="semibold">
          Has the work been publicly disclosed without registration less than 50 years ago?
        </Paragraph>
      </>
    ),
    onYes: {
      type: 'showAlert',
      content: {
        title: 'Your work qualifies for protection.',
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
        title: 'Your work may be in the public domain and it is not protectable.',
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
