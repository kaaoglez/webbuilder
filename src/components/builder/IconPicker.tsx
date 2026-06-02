'use client';

import * as LucideIcons from 'lucide-react';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Names that lucide-react exports but are NOT icon components. */
const KNOWN_NON_ICONS = new Set([
  'Icon',
  'LucideIcon',
  'LucideProps',
  'icons',
  'default',
  'createReactComponent',
]);

/**
 * Every exported icon name from lucide-react.
 * Computed once at module level so it is not re-created on every render.
 */
const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons)
  .filter(
    (k) =>
      /^[A-Z]/.test(k) &&
      !KNOWN_NON_ICONS.has(k) &&
      (typeof LucideIcons[k as keyof typeof LucideIcons] === 'object' ||
        typeof LucideIcons[k as keyof typeof LucideIcons] === 'function'),
  )
  .sort();

/** Pre-selected commonly used icons shown before the full list. */
const POPULAR_ICONS: string[] = [
  'Zap',
  'Shield',
  'Sparkles',
  'BarChart3',
  'Headphones',
  'Puzzle',
  'Globe',
  'Cpu',
  'Lock',
  'Rocket',
  'Heart',
  'Target',
  'Star',
  'Users',
  'Mail',
  'Phone',
  'MapPin',
  'Calendar',
  'Clock',
  'Camera',
  'FileText',
  'Image',
  'Code',
  'Database',
  'Cloud',
  'Wifi',
  'Settings',
  'Bell',
  'Bookmark',
  'Share2',
  'Download',
  'Upload',
  'Eye',
  'EyeOff',
  'Check',
  'X',
  'Plus',
  'Minus',
  'Search',
  'Filter',
  'Trash2',
  'Copy',
  'Edit',
  'ChevronRight',
  'ArrowRight',
];

const MAX_SEARCH_RESULTS = 200;

// ---------------------------------------------------------------------------
// Helper: DynamicIcon
// ---------------------------------------------------------------------------

function DynamicIcon({
  name,
  className,
  fallback = false,
}: {
  name: string;
  className?: string;
  /** When true, render nothing instead of a fallback placeholder icon. */
  fallback?: boolean;
}) {
  const Component = LucideIcons[name as keyof typeof LucideIcons] as
    | React.ComponentType<{ className?: string }>
    | undefined;

  if (!Component) {
    if (fallback) return null;
    const Fallback = LucideIcons.HelpCircle as React.ComponentType<{
      className?: string;
    }>;
    return <Fallback className={className} />;
  }

  return <Component className={className} />;
}

// ---------------------------------------------------------------------------
// Helper: Debounce hook
// ---------------------------------------------------------------------------

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IconPickerProps {
  /** Currently selected icon name (e.g. "Star"). */
  value: string;
  /** Callback fired when the user picks a different icon. */
  onChange: (name: string) => void;
  /** Optional label rendered above the trigger button. */
  label?: string;
  /** Additional class names forwarded to the wrapper element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// IconPicker
// ---------------------------------------------------------------------------

export function IconPicker({
  value,
  onChange,
  label,
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // -----------------------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------------------

  const filteredPopular = useMemo(() => {
    if (!debouncedQuery) return POPULAR_ICONS;
    const q = debouncedQuery.toLowerCase();
    return POPULAR_ICONS.filter((n) => n.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const filteredAll = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return ALL_ICON_NAMES;
    return ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(q)).slice(
      0,
      MAX_SEARCH_RESULTS,
    );
  }, [debouncedQuery]);

  // -----------------------------------------------------------------------
  // Alphabetical grouping (letter → icon names)
  // -----------------------------------------------------------------------

  const groupedAll = useMemo(() => {
    const groups: { letter: string; names: string[] }[] = [];
    let currentLetter = '';

    for (const name of filteredAll) {
      const letter = name[0]!;
      if (letter !== currentLetter) {
        currentLetter = letter;
        groups.push({ letter, names: [name] });
      } else {
        groups[groups.length - 1]!.names.push(name);
      }
    }

    return groups;
  }, [filteredAll]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name);
      setOpen(false);
      setSearchQuery('');
    },
    [onChange],
  );

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  /** Small grid button that represents a single icon choice. */
  const renderIconButton = useCallback(
    (name: string) => {
      const isSelected = name === value;
      return (
        <Tooltip key={name}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleSelect(name)}
              className={cn(
                'inline-flex items-center justify-center rounded-md size-9 transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected &&
                  'bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950 dark:ring-emerald-400',
              )}
            >
              <DynamicIcon
                name={name}
                className="size-4 shrink-0 text-foreground"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            <p className="text-xs font-medium">{name}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    [value, handleSelect],
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-start gap-2 font-normal"
          >
            {value ? (
              <>
                <DynamicIcon
                  name={value}
                  className="size-4 shrink-0 text-foreground"
                />
                <span className="truncate">{value}</span>
              </>
            ) : (
              <>
                <DynamicIcon
                  name="Search"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="text-muted-foreground truncate">
                  Select icon&hellip;
                </span>
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-80 p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Search */}
          <div className="sticky top-0 z-10 border-b bg-popover p-2">
            <div className="relative">
              <DynamicIcon
                name="Search"
                className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search icons…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {/* Scrollable icon area */}
          <div className="max-h-80 overflow-y-auto p-2">
            <TooltipProvider delayDuration={200}>
              {/* Popular section (only when not searching, or when search has popular matches) */}
              {filteredPopular.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Popular
                  </p>
                  <div className="grid grid-cols-5 gap-1">
                    {filteredPopular.map(renderIconButton)}
                  </div>
                </div>
              )}

              {/* Alphabetical list */}
              {groupedAll.length > 0 && (
                <div className={cn(filteredPopular.length > 0 && 'border-t pt-3')}>
                  {debouncedQuery && (
                    <p className="mb-1.5 px-1 text-xs text-muted-foreground">
                      {filteredAll.length} icon
                      {filteredAll.length !== 1 ? 's' : ''} found
                      {filteredAll.length >= MAX_SEARCH_RESULTS && (
                        <span> (showing first {MAX_SEARCH_RESULTS})</span>
                      )}
                    </p>
                  )}
                  <div className="space-y-2.5">
                    {groupedAll.map((group) => (
                      <div key={group.letter}>
                        {!debouncedQuery && (
                          <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                            {group.letter}
                          </p>
                        )}
                        <div className="grid grid-cols-5 gap-1">
                          {group.names.map(renderIconButton)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {filteredPopular.length === 0 && groupedAll.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <DynamicIcon
                    name="SearchX"
                    className="mb-2 size-8 text-muted-foreground/50"
                  />
                  <p className="text-sm text-muted-foreground">
                    No icons found for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                </div>
              )}
            </TooltipProvider>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default IconPicker;
