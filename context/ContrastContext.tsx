'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type ContrastContextType = {
  highContrast: boolean;
  toggleContrast: () => void;
};

const ContrastContext = createContext<ContrastContextType | undefined>(undefined);

export const ContrastProvider = ({ children }: { children: React.ReactNode }) => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('contrast');
    if (stored === 'high') setHighContrast(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('contrast', highContrast ? 'high' : 'default');
  }, [highContrast]);

  const toggleContrast = () => setHighContrast((prev) => !prev);

  return (
    <ContrastContext.Provider value={{ highContrast, toggleContrast }}>
      {children}
    </ContrastContext.Provider>
  );
};

export const useContrast = () => {
  const ctx = useContext(ContrastContext);
  if (!ctx) throw new Error('useContrast must be used within a ContrastProvider');
  return ctx;
};
