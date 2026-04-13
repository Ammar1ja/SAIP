'use client';

import { useEffect, useState } from 'react';

interface ContentSwitcherProps {
  items: Array<{ id: string; label: string }>;
  activeItem?: string;
  onSwitch?: (itemId: string) => void;
  className?: string;
}

const ContentSwitcher = ({ items, activeItem, onSwitch, className = '' }: ContentSwitcherProps) => {
  const [active, setActive] = useState(activeItem || items[0]?.id);

  useEffect(() => {
    if (activeItem && activeItem !== active) {
      setActive(activeItem);
    }
  }, [activeItem, active]);

  const handleSwitch = (itemId: string) => {
    setActive(itemId);
    onSwitch?.(itemId);
  };

  return (
    <div className={`inline-flex items-start ${className}`}>
      {items.map((item, index) => {
        const isActive = active === item.id;
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <button
            key={item.id}
            onClick={() => handleSwitch(item.id)}
            className={`
              flex items-center justify-center h-10 min-w-[76px] px-3 py-0 whitespace-nowrap
              text-[18px] leading-[28px] font-normal text-center transition-colors
              ${isActive ? 'bg-[#0D121C] text-white' : 'bg-[#F3F4F6] text-[#161616]'}
              ${isFirst ? 'rounded-s-[8px]' : ''}
              ${isLast ? 'rounded-e-[8px]' : ''}
              ${!isFirst ? 'border-s-[0.5px] border-[#D2D6DB]' : ''}
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ContentSwitcher;
