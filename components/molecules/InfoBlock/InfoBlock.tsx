import { InfoBlockProps } from './InfoBlock.types';

export const InfoBlock: React.FC<InfoBlockProps> = ({ title, children, className }) => (
  <div
    className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-6 ${className || ''}`}
  >
    <div className="!text-[24px] !font-medium mb-2">{title}</div>
    <div className="">{children}</div>
  </div>
);
