'use client';

import { createContext, useContext } from 'react';

type Direction = 'ltr' | 'rtl';

const DirectionContext = createContext<Direction>('ltr');

export const useDirection = () => useContext(DirectionContext);

export const DirectionProvider = ({
  dir,
  children,
}: {
  dir: Direction;
  children: React.ReactNode;
}) => {
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>;
};
