import type { RequirementsListProps } from './RequirementsList.types';
import { requirementsList, requirementsListItem } from './RequirementsList.styles';
import { twMerge } from 'tailwind-merge';

const RequirementsList = ({ requirements, className }: RequirementsListProps) => (
  <ol className={twMerge(requirementsList(), className)}>
    {requirements?.length
      ? requirements.map((req: string, idx: number) => (
          <li key={idx} className={requirementsListItem()}>
            {idx + 1}. {req}
          </li>
        ))
      : null}
  </ol>
);

export default RequirementsList;
