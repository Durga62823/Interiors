import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface ActionDropdownProps {
  actions?: ActionItem[];
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ActionDropdown({ actions, onEdit, onDuplicate, onDelete, className }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const effectiveActions: ActionItem[] = actions ? [...actions] : [];
  if (!actions) {
    if (onEdit) effectiveActions.push({ label: 'Edit', onClick: onEdit });
    if (onDuplicate) effectiveActions.push({ label: 'Duplicate', onClick: onDuplicate });
    if (onDelete) effectiveActions.push({ label: 'Delete', onClick: onDelete, variant: 'destructive' });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted focus:outline-none transition-colors"
      >
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Open menu</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-popover border shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {effectiveActions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors",
                  action.variant === 'destructive' ? "text-destructive hover:text-destructive" : "text-foreground"
                )}
                role="menuitem"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
