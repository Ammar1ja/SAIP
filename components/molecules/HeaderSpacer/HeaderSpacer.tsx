'use client';

import { useVerificationBar } from '@/context/VerificationBarContext';

export const HeaderSpacer = () => {
  const { accordionHeight } = useVerificationBar();
  const mobileHeight = 72;
  const desktopHeight = 32 + accordionHeight + 72;

  return (
    <>
      <div
        className="md:hidden transition-all duration-300 ease-in-out"
        style={{ height: `${mobileHeight}px` }}
        aria-hidden="true"
      />
      <div
        className="hidden md:block transition-all duration-300 ease-in-out"
        style={{ height: `${desktopHeight}px` }}
        aria-hidden="true"
      />
    </>
  );
};

export default HeaderSpacer;
