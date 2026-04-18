'use client';

import { User, UserPlus, ClipboardPlus, KeyRound, Send, CheckCircle2 } from 'lucide-react';

interface JourneyTimelineStepsProps {
  items: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
}
const ICONS_NAMES = ['user', 'user-plus', 'clipboard-plus', 'key-round', 'send', 'check-circle'];
const ICONS: Record<string, React.ReactNode> = {
  user: <User className="w-5 h-5 text-white" />,
  'user-plus': <UserPlus className="w-5 h-5 text-white" />,
  'clipboard-plus': <ClipboardPlus className="w-5 h-5 text-white" />,
  'key-round': <KeyRound className="w-5 h-5 text-white" />,
  send: <Send className="w-5 h-5 text-white" />,
  'check-circle': <CheckCircle2 className="w-5 h-5 text-white" />,
};

const JourneyTimelineSteps = ({ items }: JourneyTimelineStepsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative pl-0 sm:pl-8 mt-6">
      <ol className="space-y-0">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="relative flex min-h-[80px] sm:grid sm:grid-cols-[40px_1fr] sm:gap-4"
          >
            {/* Timeline (desktop only) */}
            <div className="hidden sm:relative sm:flex sm:flex-col sm:items-center sm:h-full sm:block">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-primary-300 z-0" />
              {idx === 0 && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-10 h-6 bg-white z-10" />
              )}
              {idx === items.length - 1 && (
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-10 h-16 bg-white z-10" />
              )}
              <span className="relative z-20 flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 shadow mt-2">
                {item.icon && ICONS[item.icon] ? (
                  ICONS[item.icon]
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="rounded-lg bg-neutral-50 p-5 border-l-4 border-primary-400">
                <div className="flex items-start gap-3 sm:hidden mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 shadow flex-shrink-0">
                    {item.icon && ICONS[item.icon] ? ICONS[item.icon] : ICONS[ICONS_NAMES[idx]]}
                  </span>
                  <h4 className="text-lg font-semibold text-neutral-900 flex-1">{item.title}</h4>
                </div>
                <h4 className="hidden sm:block text-lg font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-base text-neutral-700 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default JourneyTimelineSteps;
