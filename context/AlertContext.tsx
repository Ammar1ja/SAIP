'use client';

import type { InlineAlertContent } from '@/components/molecules/InlineAlert';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type AlertContextType = {
  isOpen: boolean;
  alertContent?: InlineAlertContent;
  closeAlert: () => void;
  setAlert: (
    config: InlineAlertContent,
    options?: {
      persist: boolean;
    },
  ) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [alertContent, setAlertContent] = useState<InlineAlertContent | undefined>(undefined);
  const [persisted, setPersisted] = useState(false);
  const pathname = usePathname();

  const setAlert = (config: InlineAlertContent, options = { persist: false }) => {
    setAlertContent(config);
    setPersisted(!!options.persist);
  };

  const closeAlert = () => {
    clearAlert();
  };

  const clearAlert = () => {
    setAlertContent(undefined);
    setPersisted(false);
  };

  useEffect(() => {
    if (!persisted) {
      setAlertContent(undefined);
    }
    setPersisted(false);
  }, [pathname]);

  return (
    <AlertContext.Provider value={{ setAlert, alertContent, closeAlert, isOpen: !!alertContent }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('AlertContext was used outside of AlertProvider');
  }

  return context;
};
