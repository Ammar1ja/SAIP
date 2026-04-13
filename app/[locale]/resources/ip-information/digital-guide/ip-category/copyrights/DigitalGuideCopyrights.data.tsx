import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import List from '@/components/atoms/List';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const DIGITAL_GUIDE_COPYRIGHTS: DigitalGuideTabData[] = [
  {
    id: 'about',
    content: (
      <>
        <Heading as="h3" size="h3">
          About copyrights
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Definition of an author
          </Heading>
          <Paragraph variant="compact">
            An author is anyone who creates a literary, artistic, or scientific work through their
            own effort, such as novelists, poets, painters, musicians, or creators of similar works.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            What is copyright?
          </Heading>
          <Paragraph variant="compact">
            Copyright grants authors the right to prevent or allow the use of their creations, such
            as:
          </Paragraph>
          <List
            items={[
              { id: 1, content: 'literary works' },
              { id: 2, content: 'audio works' },
              { id: 3, content: 'audiovisual works' },
              { id: 4, content: 'artistic work, for a specified time.' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Literary rights
          </Heading>
          <Paragraph variant="compact">
            Literary rights are fundamental and inalienable rights of authors over their works. They
            include the right to:
          </Paragraph>
          <List
            items={[
              { id: 1, content: 'Be identified as the creator.' },
              { id: 2, content: 'Object to any harm to the work.' },
              { id: 3, content: 'Decide on publication.' },
              { id: 4, content: 'Modify the work.' },
              { id: 5, content: 'Withdraw the work from circulation.' },
            ]}
          />
          <Paragraph variant="compact">
            These rights are permanent, cannot be transferred, and remain with the author
            indefinitely.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Material rights
          </Heading>
          <Paragraph variant="compact">
            Material rights allow authors to exploit their work for financial benefit. These rights
            can be transferred or disposed of, either fully or partially, without affecting the
            author's literary rights. Their duration varies by type and author.
          </Paragraph>
        </TextContent>
      </>
    ),
    cta: (
      <>
        <Paragraph variant="compact" className="font-semibold">
          Confirm your work’s originality, completion and eligibility for copyright protection.
        </Paragraph>
        <Button
          ariaLabel="Go to Copyrights checklist"
          href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.COPYRIGHTS.CHECKLIST}
        >
          Copyrights checklist
        </Button>
      </>
    ),
  },
  {
    id: 'protection',
    content: (
      <>
        <Heading as="h3" size="h3">
          Copyright protection
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Moral rights
          </Heading>
          <Paragraph variant="compact">
            Moral rights are perpetual, eternal, and cannot be transferred, used, or relinquished by
            the creator. These include:
          </Paragraph>
          <List
            items={[
              { id: 1, content: 'Attribution as the author of the work.' },
              { id: 2, content: 'Objection to any infringement of the work.' },
              { id: 3, content: 'Decision on whether to publish the work.' },
              { id: 4, content: 'Modification of the work.' },
              { id: 5, content: 'Withdrawal of the work from circulation.' },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Economic rights
          </Heading>
          <Paragraph variant="compact">
            Economic rights allow authors to exploit their works for financial benefit.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Key points:
          </Heading>
          <List
            items={[
              { id: 1, content: 'Can be transferred or assigned, either wholly or partly.' },
              { id: 2, content: 'Moral rights remain unaffected by fully or partially.' },
              {
                id: 3,
                content:
                  'Specific time frames apply based on the nature and authorship of the work.',
              },
            ]}
          />
        </TextContent>
      </>
    ),
  },
  {
    id: 'protected-categories',
    content: (
      <>
        <Heading as="h3" size="h3">
          Protected categories
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Protected works and materials under copyright law
          </Heading>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Written works:</b> Books, brochures, articles, newsletters, and other written
                    materials.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Dramatic works:</b> Plays, dances, pantomimes, and other theatrical
                    creations.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Audio works:</b> Musical compositions (with or without lyrics) and radio
                    broadcasts.
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    <b>Audiovisual works:</b> Films, television productions, and related works.
                  </>
                ),
              },
              {
                id: 5,
                content: (
                  <>
                    <b>Artistic works:</b> Paintings, sculptures, drawings, designs, and similar
                    creations.
                  </>
                ),
              },
              {
                id: 6,
                content: (
                  <>
                    <b>Photographic works:</b> Photographs and related works.
                  </>
                ),
              },
              {
                id: 7,
                content: (
                  <>
                    <b>Applied arts works:</b> Handmade or industrial works, such as jewelry.
                  </>
                ),
              },
              {
                id: 8,
                content: (
                  <>
                    <b>Diagrammatic works:</b> Illustrations, maps, geographical charts, and
                    diagrams.
                  </>
                ),
              },
              {
                id: 9,
                content: (
                  <>
                    <b>Architectural works:</b> Architectural designs, models, and completed
                    buildings.
                  </>
                ),
              },
              {
                id: 10,
                content: (
                  <>
                    <b>Sculptural works:</b> Three-dimensional works tied to geography, topography,
                    or science.
                  </>
                ),
              },
              {
                id: 11,
                content: (
                  <>
                    <b>Derivative works:</b> Creations from translation, adaptation, arrangement, or
                    modification.
                  </>
                ),
              },
              {
                id: 12,
                content: (
                  <>
                    <b>Computer software:</b> Programs and applications.
                  </>
                ),
              },
            ]}
          />
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Exempted works from protection
          </Heading>
          <List
            items={[
              {
                id: 1,
                content: (
                  <>
                    <b>Legal texts:</b> Systems, regulations, and judicial decisions.
                  </>
                ),
              },
              {
                id: 2,
                content: (
                  <>
                    <b>Abstract concepts:</b> Ideas, methods, procedures, and mathematical concepts.
                  </>
                ),
              },
              {
                id: 3,
                content: (
                  <>
                    <b>Facts:</b> Abstract or universally known facts.
                  </>
                ),
              },
              {
                id: 4,
                content: (
                  <>
                    <b>Daily news:</b> News items published in newspapers and magazines.
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
    id: 'optional-registration',
    content: (
      <>
        <Heading as="h3" size="h3">
          Optional registration
        </Heading>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Copyright and related rights protection
          </Heading>
          <Paragraph variant="compact">
            Copyright and related rights are automatically protected from the date of
            fixation/publication without requiring formal registration. SAIP offers optional
            registration for copyright works through its services platform.
          </Paragraph>
        </TextContent>
        <TextContent className="space-y-1">
          <Heading as="h4" size="h4">
            Conditions for optional registration
          </Heading>
          <List
            items={[
              {
                id: 1,
                content:
                  'The work must not violate Islamic law, Saudi regulations, or public morals.',
              },
              { id: 2, content: 'Complete all required data and attachments for registration.' },
              {
                id: 3,
                content:
                  'The registration request should apply to only one work, considering its nature.',
              },
              {
                id: 4,
                content:
                  'The work must not fall under the exceptions for protection in the system.',
              },
              {
                id: 5,
                content: 'The work must be in its final form, not a draft or preparatory work.',
              },
              {
                id: 6,
                content: 'Payment of the specified fee in accordance with the regulations.',
              },
              {
                id: 7,
                content:
                  'Adherence to any additional guidelines, conditions, or requirements issued by the CEO of the Authority.',
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
            ariaLabel="Go to Copyrights journey"
            href={`${ROUTES.SERVICES.COPYRIGHTS}?tab=journey`}
            intent="secondary"
            outline
            className="place-self-center"
          >
            <HomeIcon size={20} /> Go to Copyrights journey
          </Button>
        </TextContent>
      </>
    ),
  },
];
