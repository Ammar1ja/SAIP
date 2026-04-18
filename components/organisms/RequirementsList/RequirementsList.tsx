import type { RequirementsListProps } from './RequirementsList.types';
import { requirementsList, requirementsListItem } from './RequirementsList.styles';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
const RequirementsList = ({ requirements, className }: RequirementsListProps) => {
  const t = useTranslations('');

  return (
    <>
      <h4 className="text-[#161616] text-[24px] md:text-[36px] font-medium mb-[12px]">
        {t('req_for_ent')}
      </h4>
      <ol className={twMerge(requirementsList(), className)}>
        {requirements?.length
          ? requirements.map((req: string, idx: number) => (
              <li key={idx} className={requirementsListItem()}>
                {idx + 1}. {req}
              </li>
            ))
          : null}
      </ol>
    </>
  );
};

export default RequirementsList;
