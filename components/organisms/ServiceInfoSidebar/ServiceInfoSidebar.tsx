import { Clock, BadgeDollarSign, Users, MapPin } from 'lucide-react';
import type { ServiceInfoSidebarProps } from './ServiceInfoSidebar.types';

const ServiceInfoSidebar = ({
  executionTime,
  serviceFee,
  targetGroup,
  serviceChannel,
  faqHref,
  platformHref,
}: ServiceInfoSidebarProps) => (
  <aside className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-full">
    <ul className="mb-6 space-y-4 text-base">
      <li className="flex items-start gap-3">
        <Clock className="w-6 h-6 text-primary-700 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold">Execution time</span>
          <br />
          <span className="text-neutral-700">{executionTime}</span>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <BadgeDollarSign className="w-6 h-6 text-primary-700 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold">Service fee</span>
          <br />
          <span className="text-neutral-700">{serviceFee}</span>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <Users className="w-6 h-6 text-primary-700 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold">Target group</span>
          <br />
          <span className="text-neutral-700">{targetGroup}</span>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <MapPin className="w-6 h-6 text-primary-700 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold">Service channel</span>
          <br />
          <span className="text-neutral-700">{serviceChannel}</span>
        </div>
      </li>
    </ul>
    <div className="mb-4">
      <span className="font-bold block mb-1">Frequently Asked Questions</span>
      <a href={faqHref} className="text-primary-700 underline text-base">
        Go to FAQs page
      </a>
    </div>
    <a
      href={platformHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#35795A] text-white rounded-lg font-bold text-lg hover:bg-primary-800 transition"
    >
      Go to SAIP Platform
      <span className="ml-2" aria-hidden>
        ↗
      </span>
    </a>
  </aside>
);

export default ServiceInfoSidebar;
