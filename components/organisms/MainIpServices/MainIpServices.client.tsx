'use client';

import { useEffect, useState, JSX } from 'react';
import { MainIpServicesProps } from './index';
import { MainIpServices } from './index';

export const MainIpServicesClient = (props: MainIpServicesProps) => {
  const [Component, setComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      const rendered = await MainIpServices(props);
      setComponent(rendered);
    })();
  }, [props]);

  return Component;
};
