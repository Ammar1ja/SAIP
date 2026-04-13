'use client';
import dynamic from 'next/dynamic';
import { AdvisoryBoardCarouselProps } from '@/components/organisms/AdvisoryBoardCarousel/AdvisoryBoardCarousel.types';
import Spinner from '@/components/atoms/Spinner';

const AdvisoryBoardCarousel = dynamic(
  () => import('@/components/organisms/AdvisoryBoardCarousel').then((m) => m.default),
  { loading: () => <Spinner size={60} className="h-60 mb-8" /> },
);

export default function AdvisoryBoardCarouselClient(props: AdvisoryBoardCarouselProps) {
  return <AdvisoryBoardCarousel {...props} />;
}
