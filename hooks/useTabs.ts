import { useState } from 'react';

export function useTabs<T extends { id: string }>(tabs: T[], defaultId?: string) {
  const [activeTab, setActiveTab] = useState(defaultId || tabs[0]?.id);
  return { activeTab, setActiveTab };
}
