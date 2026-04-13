import { IconPlayProps } from '@/components/molecules/VideoPlayer/IconPlay.types';

export const IconPlay = ({ color = '#ffffff' }: IconPlayProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15.5"
      height="16.5"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className="feather feather-play"
      viewBox="0 0 15.5 16.5"
    >
      <path d="M0 0L15.5 8.25L0 16.5V0Z" />
    </svg>
  );
};
