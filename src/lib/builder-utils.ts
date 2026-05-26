// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Utility Functions
// LEGO BLOCK: Shared tools used by all builder pieces
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// ID Generation
// ─────────────────────────────────────────────────────────────

/** Generate a short unique ID (8 chars) */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Generate a prefixed ID (e.g. nav-abc12345) */
export function prefixedUid(prefix: string): string {
  return `${prefix}-${uid()}`;
}

// ─────────────────────────────────────────────────────────────
// Object Utilities
// ─────────────────────────────────────────────────────────────

/** Deep clone an object using structured clone (modern) or JSON fallback */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/** Deep merge two objects (target gets overridden by source) */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(
        tgtVal as Record<string, unknown>,
        srcVal as Record<string, unknown>,
      ) as T[keyof T];
    } else if (srcVal !== undefined) {
      result[key] = srcVal as T[keyof T];
    }
  }
  return result;
}

/** Safe get nested property with dot notation */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ─────────────────────────────────────────────────────────────
// String Utilities
// ─────────────────────────────────────────────────────────────

/** Generate URL-safe slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/** Capitalize first letter */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Extract domain from URL */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// ─────────────────────────────────────────────────────────────
// Date Utilities
// ─────────────────────────────────────────────────────────────

/** Format date to locale string */
export function formatDate(date: string | Date, locale = 'es-ES', options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/** Format relative time (e.g. "hace 5 minutos") */
export function formatRelativeTime(date: string | Date, locale = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
  return formatDate(d, locale);
}

// ─────────────────────────────────────────────────────────────
// Reading Time Estimation
// ─────────────────────────────────────────────────────────────

/** Estimate reading time for text content */
export function getReadingTime(text: string, wordsPerMinute = 200): {
  minutes: number;
  text: string;
} {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return {
    minutes,
    text: minutes === 1 ? '1 min de lectura' : `${minutes} min de lectura`,
  };
}

// ─────────────────────────────────────────────────────────────
// Color Utilities
// ─────────────────────────────────────────────────────────────

/** Check if a string is a valid hex color */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

/** Convert hex to RGBA */
export function hexToRgba(hex: string, alpha = 1): string {
  if (!isValidHexColor(hex)) return `rgba(0,0,0,${alpha})`;
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Lighten a hex color by percentage */
export function lightenColor(hex: string, percent: number): string {
  if (!isValidHexColor(hex)) return hex;
  const cleanHex = hex.replace('#', '');
  const r = Math.min(255, parseInt(cleanHex.substring(0, 2), 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, parseInt(cleanHex.substring(2, 4), 16) + Math.round(255 * percent / 100));
  const b = Math.min(255, parseInt(cleanHex.substring(4, 6), 16) + Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// URL Utilities
// ─────────────────────────────────────────────────────────────

/** Check if a string is a valid URL */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Extract YouTube video ID from various URL formats */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Extract Vimeo video ID */
export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

/** Get video embed URL (YouTube or Vimeo) */
export function getVideoEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  const vimeoId = getVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  return null;
}

// ─────────────────────────────────────────────────────────────
// File Utilities
// ─────────────────────────────────────────────────────────────

/** Format file size to human-readable string */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Get file extension from filename */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// ─────────────────────────────────────────────────────────────
// Border Radius Helper (used by renderers)
// ─────────────────────────────────────────────────────────────

/** Get CSS border-radius value from theme setting */
export function br(radius: string): string {
  const map: Record<string, string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };
  return map[radius] || '8px';
}

// ─────────────────────────────────────────────────────────────
// SEO Utilities
// ─────────────────────────────────────────────────────────────

/** Generate HTML meta tags from SEO settings */
export function generateMetaTags(seo: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}): Record<string, string> {
  const tags: Record<string, string> = {};

  if (seo.title) {
    tags['og:title'] = seo.title;
    tags['twitter:title'] = seo.title;
  }
  if (seo.description) {
    tags['og:description'] = seo.description;
    tags['twitter:description'] = seo.description;
  }
  if (seo.ogImage) {
    tags['og:image'] = seo.ogImage;
    tags['twitter:image'] = seo.ogImage;
  }
  if (seo.ogType) tags['og:type'] = seo.ogType;
  if (seo.twitterCard) tags['twitter:card'] = seo.twitterCard;
  if (seo.canonicalUrl) tags['canonical'] = seo.canonicalUrl;

  const robots = [
    seo.robotsIndex !== false ? 'index' : 'noindex',
    seo.robotsFollow !== false ? 'follow' : 'nofollow',
  ];
  tags['robots'] = robots.join(', ');

  return tags;
}

/** Truncate text for SEO (title: 60, description: 160) */
export const SEO_LIMITS = {
  title: 60,
  description: 160,
  slug: 75,
} as const;

// ─────────────────────────────────────────────────────────────
// Array Utilities
// ─────────────────────────────────────────────────────────────

/** Move array item from one index to another */
export function moveItem<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

/** Remove item from array by id */
export function removeById<T extends { id: string }>(array: T[], id: string): T[] {
  return array.filter((item) => item.id !== id);
}

/** Find and update item in array by id */
export function updateById<T extends { id: string }>(array: T[], id: string, updates: Partial<T>): T[] {
  return array.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

/** Add item to array (with optional position) */
export function addItem<T extends { id: string }>(array: T[], item: T, position?: number): T[] {
  if (position !== undefined) {
    const result = [...array];
    result.splice(position, 0, item);
    return result;
  }
  return [...array, item];
}

// ─────────────────────────────────────────────────────────────
// Section Sizing Styles (LEGO BLOCK: converts sizing to CSS)
// ─────────────────────────────────────────────────────────────

import type { SectionSizing } from './builder-types';

/** Convert SectionSizing config to CSS inline styles */
export function getSectionSizingStyles(sizing?: SectionSizing): {
  sectionStyle: React.CSSProperties;
  containerStyle: React.CSSProperties;
  titleStyle: React.CSSProperties;
  subtitleStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
  imageStyle: React.CSSProperties;
  imageContainerStyle: React.CSSProperties;
  gapClass: string;
  gapStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  textColor: string | undefined;
} {
  const empty = {};
  const s = sizing || {};

  // Padding Y map (preset)
  const paddingYMap: Record<string, { top: string; bottom: string }> = {
    compact: { top: '48px', bottom: '48px' },
    default: { top: '80px', bottom: '80px' },
    spacious: { top: '120px', bottom: '120px' },
  };

  // Gap class map (preset)
  const gapClassMap: Record<string, string> = {
    small: 'gap-4',
    default: 'gap-8',
    large: 'gap-12',
  };

  // Image border radius map (preset)
  const imageBrMap: Record<string, string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };

  // Image height map (preset)
  const imageHeightMap: Record<string, string> = {
    auto: 'auto',
    sm: '200px',
    md: '300px',
    lg: '450px',
  };

  // Shadow map
  const shadowMap: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
  };

  // ── Build Section Style ──
  const paddingTop = s.customPaddingTop != null ? `${s.customPaddingTop}px` : undefined;
  const paddingBottom = s.customPaddingBottom != null ? `${s.customPaddingBottom}px` : undefined;
  const paddingX = s.customPaddingX != null ? `${s.customPaddingX}px` : undefined;

  const sectionStyle: React.CSSProperties = {
    ...(paddingTop && { paddingTop }),
    ...(paddingBottom && { paddingBottom }),
    ...(paddingX && { paddingLeft: paddingX, paddingRight: paddingX }),
    ...(s.backgroundColor && { backgroundColor: s.backgroundColor }),
    ...(s.textColor && { color: s.textColor }),
    ...(s.opacity != null && { opacity: s.opacity / 100 }),
    ...(s.borderColor && s.borderWidth != null ? { borderColor: s.borderColor, borderWidth: `${s.borderWidth}px`, borderStyle: 'solid' } : {}),
  };

  if (s.marginBottom != null) {
    sectionStyle.marginBottom = `${s.marginBottom}px`;
  }

  // ── Build Container Style ──
  const containerStyle: React.CSSProperties = {
    ...(s.customContainerWidth ? { maxWidth: `${s.customContainerWidth}px` } : {}),
  };

  // ── Build Title Style ──
  const titleStyle: React.CSSProperties = {
    ...(s.titleSize ? { fontSize: `${s.titleSize}px` } : {}),
    ...(s.titleWeight ? { fontWeight: s.titleWeight } : {}),
    ...(s.titleLineHeight != null ? { lineHeight: s.titleLineHeight } : {}),
    ...(s.titleLetterSpacing != null ? { letterSpacing: `${s.titleLetterSpacing}px` } : {}),
    ...(s.titleTextTransform ? { textTransform: s.titleTextTransform } : {}),
    ...(s.titleAlignment ? { textAlign: s.titleAlignment } : {}),
    ...(s.headingColor ? { color: s.headingColor } : {}),
  };

  // ── Build Subtitle Style ──
  const subtitleStyle: React.CSSProperties = {
    ...(s.subtitleSize ? { fontSize: `${s.subtitleSize}px` } : {}),
    ...(s.subtitleWeight ? { fontWeight: s.subtitleWeight } : {}),
    ...(s.subtitleLineHeight != null ? { lineHeight: s.subtitleLineHeight } : {}),
    ...(s.subtitleLetterSpacing != null ? { letterSpacing: `${s.subtitleLetterSpacing}px` } : {}),
  };

  // ── Build Body Style ──
  const bodyStyle: React.CSSProperties = {
    ...(s.bodySize ? { fontSize: `${s.bodySize}px` } : {}),
    ...(s.bodyWeight ? { fontWeight: s.bodyWeight } : {}),
    ...(s.bodyLineHeight != null ? { lineHeight: s.bodyLineHeight } : {}),
    ...(s.bodyLetterSpacing != null ? { letterSpacing: `${s.bodyLetterSpacing}px` } : {}),
  };

  // ── Build Image Style ──
  // Only set object-fit/backgroundSize when the user EXPLICITLY sets imageFit.
  // The renderers in PreviewPanel apply their own Tailwind defaults (object-contain, bg-contain).
  // If we always inject contain here, it overrides those defaults and can conflict
  // when imageStyle is spread on a container div (where objectFit is meaningless
  // but width/height constraints may crop the image).

  // imageStyle — for <img> elements or single-purpose containers
  const imageStyle: React.CSSProperties = {
    ...(s.customImageHeight != null ? { height: `${s.customImageHeight}px` } : {}),
    ...(s.customImageWidth != null ? { width: `${s.customImageWidth}px`, maxWidth: '100%' } : {}),
    ...(s.imageFit ? { objectFit: s.imageFit, backgroundSize: s.imageFit } : {}),
    ...(s.customImageBorderRadius != null ? { borderRadius: `${s.customImageBorderRadius}px` } : {}),
    ...(s.imageAspectRatio && s.imageAspectRatio !== 'auto' ? { aspectRatio: s.imageAspectRatio } : {}),
  };

  // imageContainerStyle — for wrapper divs that contain images.
  // Omits width (container should stay responsive) and objectFit (irrelevant on divs).
  const imageContainerStyle: React.CSSProperties = {
    ...(s.customImageHeight != null ? { height: `${s.customImageHeight}px` } : {}),
    ...(s.customImageBorderRadius != null ? { borderRadius: `${s.customImageBorderRadius}px` } : {}),
    ...(s.imageAspectRatio && s.imageAspectRatio !== 'auto' ? { aspectRatio: s.imageAspectRatio } : {}),
  };

  // ── Build Gap Class ──
  const gapClass = gapClassMap[s.gap || 'default'] || gapClassMap.default;

  // ── Build Gap Style (for custom pixel gap) ──
  const gapStyle: React.CSSProperties = {
    ...(s.customGap != null ? { gap: `${s.customGap}px` } : {}),
  };

  // ── Build Card Style ──
  const cardStyle: React.CSSProperties = {
    ...(s.cardBackgroundColor ? { backgroundColor: s.cardBackgroundColor } : {}),
    ...(s.shadow ? { boxShadow: shadowMap[s.shadow] || 'none' } : {}),
    ...(s.cardBorderRadius != null ? { borderRadius: `${s.cardBorderRadius}px` } : {}),
    ...(s.accentColor ? { '--section-accent': s.accentColor } as any : {}),
  };

  return {
    sectionStyle,
    containerStyle,
    titleStyle: Object.keys(titleStyle).length > 0 ? titleStyle : empty,
    subtitleStyle: Object.keys(subtitleStyle).length > 0 ? subtitleStyle : empty,
    bodyStyle: Object.keys(bodyStyle).length > 0 ? bodyStyle : empty,
    imageStyle,
    imageContainerStyle,
    gapClass,
    gapStyle,
    cardStyle: Object.keys(cardStyle).length > 0 ? cardStyle : empty,
    textColor: s.textColor,
  };
}
