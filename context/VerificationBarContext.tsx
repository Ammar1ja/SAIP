'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VerificationBarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  accordionHeight: number;
  setAccordionHeight: (height: number) => void;
}

const VerificationBarContext = createContext<VerificationBarContextType | undefined>(undefined);

export const VerificationBarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [accordionHeight, setAccordionHeight] = useState(0);

  return (
    <VerificationBarContext.Provider
      value={{ isExpanded, setIsExpanded, accordionHeight, setAccordionHeight }}
    >
      {children}
    </VerificationBarContext.Provider>
  );
};

export const useVerificationBar = () => {
  const context = useContext(VerificationBarContext);
  if (context === undefined) {
    throw new Error('useVerificationBar must be used within a VerificationBarProvider');
  }
  return context;
};
