import type { DocumentSectionTextRhythm } from './DocumentSection.types';

/**
 * Tailwind classes for the text column in the `with-image` variant.
 * Keeps spacing rules in one place — extend the record when adding rhythms.
 */
export const documentSectionWithImageTextRhythmLayout: Record<
  DocumentSectionTextRhythm,
  {
    /** flex gap on the stack (heading + description + actions) */
    stackGap: string;
    /** margin-top on the description wrapper (used when stack uses gap-0) */
    descriptionOffset: string | undefined;
    /** margin-top on the actions row */
    actionsOffset: string | undefined;
  }
> = {
  even: {
    stackGap: 'gap-8',
    descriptionOffset: undefined,
    actionsOffset: undefined,
  },
  'display-intro': {
    stackGap: 'gap-0',
    descriptionOffset: 'mt-6',
    actionsOffset: 'mt-8',
  },
};
