// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Custom React Hooks
// LEGO BLOCK: Reusable stateful logic for all builder pieces
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback, useRef, useMemo, useSyncExternalStore } from 'react';

// ─────────────────────────────────────────────────────────────
// useDebounce — Debounce a value (centralized, used everywhere)
// ─────────────────────────────────────────────────────────────

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─────────────────────────────────────────────────────────────
// useLocalStorage — Persistent state in localStorage
// ─────────────────────────────────────────────────────────────

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // Storage full — silently ignore
          }
        }
        return nextValue;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ─────────────────────────────────────────────────────────────
// useAutoSave — Auto-save data to API with debounce
// ─────────────────────────────────────────────────────────────

interface UseAutoSaveOptions<T> {
  /** Data to save */
  data: T;
  /** API endpoint URL */
  endpoint: string;
  /** Debounce delay in ms (default: 2000) */
  delay?: number;
  /** Whether auto-save is enabled */
  enabled?: boolean;
  /** HTTP method (default: PUT) */
  method?: 'PUT' | 'POST' | 'PATCH';
  /** Callback on save success */
  onSave?: () => void;
  /** Callback on save error */
  onError?: (error: string) => void;
}

export function useAutoSave<T>({
  data,
  endpoint,
  delay = 2000,
  enabled = true,
  method = 'PUT',
  onSave,
  onError,
}: UseAutoSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataRef = useRef(JSON.stringify(data));

  // Trigger save when data changes (debounced)
  useEffect(() => {
    if (!enabled) return;

    const currentJson = JSON.stringify(data);
    if (currentJson === prevDataRef.current) return;
    prevDataRef.current = currentJson;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Error al guardar: ${response.status}`);

        setLastSaved(new Date());
        onSave?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al guardar';
        setError(message);
        onError?.(message);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, endpoint, delay, enabled, method, onSave, onError]);

  /** Force an immediate save */
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Error al guardar: ${response.status}`);
      prevDataRef.current = JSON.stringify(data);
      setLastSaved(new Date());
      onSave?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar';
      setError(message);
      onError?.(message);
    } finally {
      setIsSaving(false);
    }
  }, [data, endpoint, method, onSave, onError]);

  return { isSaving, lastSaved, error, saveNow };
}

// ─────────────────────────────────────────────────────────────
// useMediaQuery — Responsive detection hook
// ─────────────────────────────────────────────────────────────

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }, [query]);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Predefined responsive hooks */
export function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

// ─────────────────────────────────────────────────────────────
// useClickOutside — Detect clicks outside a ref element
// ─────────────────────────────────────────────────────────────

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

// ─────────────────────────────────────────────────────────────
// useKeyboard — Listen for keyboard shortcuts
// ─────────────────────────────────────────────────────────────

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// ─────────────────────────────────────────────────────────────
// useClipboard — Copy to clipboard utility
// ─────────────────────────────────────────────────────────────

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(success);
      setTimeout(() => setCopied(false), 2000);
      return success;
    }
  }, []);

  return { copied, copy };
}

// ─────────────────────────────────────────────────────────────
// useToggle — Simple boolean toggle with extra helpers
// ─────────────────────────────────────────────────────────────

export function useToggle(initial = false): [boolean, () => void, () => void, (v: boolean) => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const set = useCallback((v: boolean) => setValue(v), []);
  return [value, toggle, setTrue, set];
}

// ─────────────────────────────────────────────────────────────
// useSEO — SEO field management hook
// ─────────────────────────────────────────────────────────────

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType: string;
  twitterCard: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export function useSEO(initialData?: Partial<SEOData>) {
  const [seo, setSeo] = useState<SEOData>({
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    ...initialData,
  });

  const update = useCallback((updates: Partial<SEOData>) => {
    setSeo((prev) => ({ ...prev, ...updates }));
  }, []);

  const addKeyword = useCallback((keyword: string) => {
    setSeo((prev) => {
      if (prev.keywords.includes(keyword)) return prev;
      return { ...prev, keywords: [...prev.keywords, keyword] };
    });
  }, []);

  const removeKeyword = useCallback((keyword: string) => {
    setSeo((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  }, []);

  const titleLength = seo.title.length;
  const descriptionLength = seo.description.length;
  const isTitleValid = titleLength > 0 && titleLength <= 60;
  const isDescriptionValid = descriptionLength > 0 && descriptionLength <= 160;

  return {
    seo,
    update,
    addKeyword,
    removeKeyword,
    titleLength,
    descriptionLength,
    isTitleValid,
    isDescriptionValid,
    keywordsCount: seo.keywords.length,
  };
}

// ─────────────────────────────────────────────────────────────
// useSearch — Client-side search/filter hook
// ─────────────────────────────────────────────────────────────

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs = 300,
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const results = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) => searchFn(item, debouncedQuery));
  }, [items, debouncedQuery, searchFn]);

  return { query, setQuery, results, isSearching: debouncedQuery.length > 0 };
}
