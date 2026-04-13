'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { DropdownMenuProps, DropdownMenuItem } from './DropdownMenu.types';
import { dropdownButton, dropdownMenu, menuItem } from './DropdownMenu.styles';
import { ChevronIcon } from '@/components/icons';
import Icon from '@/components/atoms/Icon';

const rootPaths = ['/services', '/resources', '/about'];

/**
 * DropdownMenu component for displaying a dropdown menu with various styles and accessibility features
 */
export const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  DropdownMenuProps & { rootPath?: string }
>(
  (
    {
      label,
      items,
      className,
      ariaLabel,
      ariaDescribedby,
      role = 'menu',
      id,
      tabIndex = 0,
      onOpenChange,
      onItemSelect,
      rootPath = '',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const pathname = usePathname();

    // Use rootPath instead of label for multi-column detection (works with translations)
    const isMultiColumn = rootPath === '/resources' || rootPath === '/services';
    const menuId = id || `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const buttonId = `${menuId}-button`;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case 'Escape':
            setIsOpen(false);
            onOpenChange?.(false);
            buttonRef.current?.focus();
            break;
          case 'ArrowDown':
            event.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % items.length);
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (focusedIndex >= 0) {
              const items = menuRef.current?.querySelectorAll(
                '[role="menuitem"]:not([aria-disabled="true"])',
              );
              const el = items?.[focusedIndex] as HTMLElement;
              el?.click();
            }
            break;
        }
      };

      if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
      }
      return () => {
        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleKeyDown);
        }
      };
    }, [isOpen, items, focusedIndex, onOpenChange, onItemSelect]);

    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && menuRef.current) {
        const items = menuRef.current.querySelectorAll(
          '[role="menuitem"]:not([aria-disabled="true"])',
        );
        const item = items[focusedIndex] as HTMLElement | undefined;
        item?.focus();
      }
    }, [focusedIndex, isOpen]);

    useEffect(() => {
      setIsOpen(false);
      onOpenChange?.(false);
    }, [pathname]);

    const groupedItems = items.reduce<Record<string, DropdownMenuItem[]>>((acc, item) => {
      const group = item.group || 'Other';
      acc[group] = acc[group] || [];
      acc[group].push(item);
      return acc;
    }, {});

    const isActiveRoot =
      !!rootPath && (pathname === rootPath || pathname.startsWith(rootPath + '/'));

    const handleButtonClick = () => {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      onOpenChange?.(newIsOpen);
      if (newIsOpen) {
        setFocusedIndex(-1);
      }
    };

    return (
      <div ref={ref} className={twMerge('inline-block text-left', className)} {...props}>
        <button
          ref={buttonRef}
          id={buttonId}
          onClick={handleButtonClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
          className={twMerge('relative', dropdownButton({ isOpen, isActive: !!isActiveRoot }))}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={ariaLabel || label}
          tabIndex={tabIndex}
        >
          {label}
          <ChevronIcon
            className={twMerge('transition-transform', isOpen && 'rotate-180')}
            aria-hidden="true"
          />

          <span
            className={clsx(
              'pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[6px] rounded-full z-0',
              {
                'bg-primary-400': isActiveRoot,
                'bg-neutral-800': !isActiveRoot && isOpen,
                'group-hover:bg-neutral-800': !isActiveRoot && !isOpen,
              },
            )}
          />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            id={menuId}
            role={role}
            aria-labelledby={buttonId}
            aria-describedby={ariaDescribedby}
            className={dropdownMenu({ variant: isMultiColumn ? 'multiColumn' : 'default' })}
          >
            {isMultiColumn ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(groupedItems!).map(([groupName, links], index) => {
                  if (index === 3) {
                    return (
                      <div key={index} className="flex flex-col gap-2 col-start-4 row-start-1">
                        <div>
                          {groupName !== 'Other' && (
                            <h3 className="mb-2 px-2 text-[18px] leading-[28px] font-bold text-primary-600 rtl:text-right">
                              {groupName}
                            </h3>
                          )}
                          <ul className="space-y-1">
                            {links.map(({ href, label, icon, description, disabled }, idx) => (
                              <li key={idx}>
                                <Link
                                  href={href}
                                  className={menuItem({ isActive: pathname === href, disabled })}
                                  role="menuitem"
                                  aria-disabled={disabled}
                                  tabIndex={disabled ? -1 : 0}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {icon && <Icon {...icon} aria-hidden="true" />}
                                  <span className="rtl:text-right">{label}</span>
                                  {description && (
                                    <span className="block text-xs text-gray-500">
                                      {description}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {Object.entries(groupedItems!)[4] && (
                          <div key="subgroup-4">
                            {Object.entries(groupedItems!)[4][0] !== 'Other' && (
                              <h3 className="mb-2 px-2 text-[18px] leading-[28px] font-bold text-primary-600 mt-4 rtl:text-right">
                                {Object.entries(groupedItems!)[4][0]}
                              </h3>
                            )}
                            <ul className="space-y-1">
                              {Object.entries(groupedItems!)[4][1].map(
                                ({ href, label, icon, description, disabled }, idx) => (
                                  <li key={idx}>
                                    <Link
                                      href={href}
                                      className={menuItem({
                                        isActive: pathname === href,
                                        disabled,
                                      })}
                                      role="menuitem"
                                      aria-disabled={disabled}
                                      tabIndex={disabled ? -1 : 0}
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {icon && <Icon {...icon} aria-hidden="true" />}
                                      <span>{label}</span>
                                      {description && (
                                        <span className="block text-xs text-gray-500">
                                          {description}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (index === 4) return null;

                  return (
                    <div key={index}>
                      {groupName !== 'Other' && (
                        <h3 className="mb-2 px-2 text-[18px] leading-[28px] font-bold text-primary-600 rtl:text-right">
                          {groupName}
                        </h3>
                      )}
                      <ul className="space-y-1">
                        {links.map(({ href, label, icon, description, disabled }, idx) => (
                          <li key={idx}>
                            <Link
                              href={href}
                              className={menuItem({ isActive: pathname === href, disabled })}
                              role="menuitem"
                              aria-disabled={disabled}
                              tabIndex={disabled ? -1 : 0}
                              onClick={() => setIsOpen(false)}
                            >
                              {icon && <Icon {...icon} aria-hidden="true" />}
                              {<span>{label}</span>}
                              {description && (
                                <span className="block text-xs text-gray-500">{description}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid">
                {Object.entries(groupedItems!).map(([groupName, links]) => (
                  <div key={groupName}>
                    {groupName !== 'Other' && (
                      <h3 className="mb-2 px-2 text-[18px] leading-[28px] font-bold text-primary-600 rtl:text-right">
                        {groupName}
                      </h3>
                    )}
                    <ul className="space-y-1">
                      {links.map(({ href, label, icon, description, disabled }) => (
                        <li key={href}>
                          <Link
                            href={href}
                            className={menuItem({ isActive: pathname === href, disabled })}
                            role="menuitem"
                            aria-disabled={disabled}
                            tabIndex={disabled ? -1 : 0}
                            onClick={() => setIsOpen(false)}
                          >
                            {icon && <Icon {...icon} aria-hidden="true" />}
                            <span>{label}</span>
                            {description && (
                              <span className="block text-xs text-gray-500">{description}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
