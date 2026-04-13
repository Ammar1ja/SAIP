import { useEffect, useState } from 'react';

export function useHighContrast() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('high-contrast') === 'true';
    setEnabled(stored);
    document.documentElement.classList.toggle('high-contrast', stored);
  }, []);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    document.documentElement.classList.toggle('high-contrast', newValue);
    localStorage.setItem('high-contrast', String(newValue));
  };

  return { enabled, toggle };
}
