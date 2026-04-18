import StepCard from './StepCard';
import { User, UserPlus, ClipboardPlus, KeyRound, Send } from 'lucide-react';
import type { TimelineStepsProps } from './TimelineSteps.types';

const ICONS_NAMES = ['user', 'user-plus', 'clipboard-plus', 'key-round', 'send'];
const ICONS: Record<string, React.ReactNode> = {
  user: <User className="w-4 h-4 text-white" />,
  'user-plus': <UserPlus className="w-5 h-5 text-white" />,
  'clipboard-plus': <ClipboardPlus className="w-5 h-5 text-white" />,
  'key-round': <KeyRound className="w-5 h-5 text-white" />,
  send: <Send className="w-5 h-5 text-white" />,
};

const TimelineSteps = ({ steps }: TimelineStepsProps) => {
  return (
    <div className="relative pl-0 sm:pl-8">
      <ol className="space-y-0">
        {steps.map((step, idx) => {
          return (
            <li
              key={step.number}
              className="relative flex min-h-[64px] h-fit xl:!h-[57px] sm:grid sm:grid-cols-[40px_1fr] sm:gap-4"
            >
              {/* Timeline (desktop only) */}
              <div className="hidden sm:relative sm:flex sm:flex-col sm:items-center sm:h-full sm:block">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-[#35795A] z-0" />
                {idx === 0 && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-10 h-6 bg-white z-10" />
                )}
                {idx === steps.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-10 h-16 bg-white z-10" />
                )}
                <span className="relative z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[#35795A] shadow mt-2 !p-[8px]">
                  {step.icon && ICONS[step.icon] ? ICONS[step.icon] : ICONS[ICONS_NAMES[idx]]}
                </span>
              </div>
              {/* Card */}
              <div className="flex-1">
                <StepCard {...step} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TimelineSteps;
