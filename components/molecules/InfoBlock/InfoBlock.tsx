import { InfoBlockProps } from './InfoBlock.types';

export const InfoBlock: React.FC<InfoBlockProps> = ({ title, children, className }) => (
  <div
    className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-6 ${className || ''}`}
  >
    <div className="text-lg font-semibold mb-2">{title}</div>
    <div>{children}</div>
  </div>
);
