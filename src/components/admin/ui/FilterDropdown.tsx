import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({ label, options, value, onChange, className }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.value === value);
  const isActive = value !== '' && value !== 'all';

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-center gap-2 w-full rounded-md border px-4 py-2 bg-background text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors h-10",
          isActive ? "border-primary/50 text-primary" : "border-input text-foreground"
        )}
      >
        <Filter className="h-4 w-4" />
        {label}
        {isActive && activeOption && (
          <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold">
            {activeOption.label}
          </span>
        )}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-popover border shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-muted",
                !isActive ? "bg-muted/50 font-medium" : "text-foreground"
              )}
            >
              All
              {!isActive && <Check className="h-4 w-4" />}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-muted",
                  value === option.value ? "bg-muted/50 font-medium" : "text-foreground"
                )}
              >
                {option.label}
                {value === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
