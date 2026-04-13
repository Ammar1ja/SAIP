'use client';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner';

const OrgChart = dynamic(() => import('@/components/organisms/OrgChart').then((m) => m.default), {
  loading: () => <Spinner size={80} className="h-[600px]" />,
});

interface OrgChartClientProps {
  heading?: string;
  description?: string;
}

export default function OrgChartClient({ heading, description }: OrgChartClientProps) {
  return <OrgChart heading={heading} description={description} />;
}
