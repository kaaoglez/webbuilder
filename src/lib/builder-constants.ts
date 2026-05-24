// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Constants (Centralized Configuration)
// LEGO BLOCK: Standard interfaces and defaults for all pieces
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Section Categories (used by SECTION_META and editor filters)
// ─────────────────────────────────────────────────────────────

export const SECTION_CATEGORIES = {
  PRINCIPAL: 'Principal',
  CONTENIDO: 'Contenido',
  SOCIAL_PROOF: 'Social Proof',
  CONVERSION: 'Conversión',
  SOPORTE: 'Soporte',
  ESTRUCTURAL: 'Estructural',
  NAVEGACION: 'Navegación',
  MEDIA: 'Media',
  BLOG: 'Blog',
  INTEGRACION: 'Integración',
} as const;

export type SectionCategory = keyof typeof SECTION_CATEGORIES;

// ─────────────────────────────────────────────────────────────
// Responsive Breakpoints (used by PreviewPanel and renderers)
// ─────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  mobile: { label: 'Móvil', width: 375, icon: 'Smartphone' },
  tablet: { label: 'Tablet', width: 768, icon: 'Tablet' },
  desktop: { label: 'Escritorio', width: 1024, icon: 'Monitor' },
  wide: { label: 'Pantalla ancha', width: 1440, icon: 'Monitor' },
} as const;

export type DeviceKey = keyof typeof BREAKPOINTS;

// ─────────────────────────────────────────────────────────────
// Animation Presets (used by section editors)
// ─────────────────────────────────────────────────────────────

export const ANIMATION_PRESETS = [
  { value: 'none', label: 'Sin animación' },
  { value: 'fadeIn', label: 'Aparecer' },
  { value: 'fadeInUp', label: 'Aparecer desde abajo' },
  { value: 'fadeInDown', label: 'Aparecer desde arriba' },
  { value: 'fadeInLeft', label: 'Aparecer desde izquierda' },
  { value: 'fadeInRight', label: 'Aparecer desde derecha' },
  { value: 'zoomIn', label: 'Zoom in' },
  { value: 'zoomOut', label: 'Zoom out' },
  { value: 'slideUp', label: 'Deslizar arriba' },
  { value: 'slideDown', label: 'Deslizar abajo' },
  { value: 'bounce', label: 'Rebotar' },
  { value: 'pulse', label: 'Pulsar' },
] as const;

export type AnimationPreset = typeof ANIMATION_PRESETS[number]['value'];

// ─────────────────────────────────────────────────────────────
// Social Platforms (used by social_feed, footer, team)
// ─────────────────────────────────────────────────────────────

export const SOCIAL_PLATFORMS = [
  { id: 'twitter', label: 'Twitter / X', icon: 'Twitter', color: '#000000' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { id: 'facebook', label: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { id: 'youtube', label: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { id: 'github', label: 'GitHub', icon: 'Github', color: '#333333' },
  { id: 'tiktok', label: 'TikTok', icon: 'Music2', color: '#000000' },
  { id: 'pinterest', label: 'Pinterest', icon: 'Pin', color: '#E60023' },
  { id: 'dribbble', label: 'Dribbble', icon: 'Dribbble', color: '#EA4C89' },
  { id: 'behance', label: 'Behance', icon: 'Figma', color: '#1769FF' },
] as const;

export type SocialPlatformId = typeof SOCIAL_PLATFORMS[number]['id'];

// ─────────────────────────────────────────────────────────────
// Default SEO Settings (per page)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_SEO = {
  title: '',
  description: '',
  keywords: [] as string[],
  ogImage: '',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
  canonicalUrl: '',
  robotsIndex: true,
  robotsFollow: true,
} as const;

// ─────────────────────────────────────────────────────────────
// Default Navigation Settings (global)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_NAVIGATION = {
  logo: '',
  brandName: 'Mi Empresa',
  links: [
    { id: 'nav-1', label: 'Inicio', url: '#', children: [] },
    { id: 'nav-2', label: 'Servicios', url: '#services', children: [] },
    { id: 'nav-3', label: 'Blog', url: '#blog', children: [] },
    { id: 'nav-4', label: 'Contacto', url: '#contact', children: [] },
  ],
  ctaText: 'Empezar',
  ctaLink: '#contact',
  style: 'solid' as const,
  showOnScroll: true,
  mobileMenu: true,
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
} as const;

export type NavStyle = 'solid' | 'transparent' | 'sticky' | 'floating';

// ─────────────────────────────────────────────────────────────
// Default Blog Settings (global)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_BLOG_SETTINGS = {
  postsPerPage: 9,
  layout: 'grid' as const,
  columns: 3 as 2 | 3 | 4,
  showAuthor: true,
  showDate: true,
  showCategory: true,
  showExcerpt: true,
  readMoreText: 'Leer más',
  featuredPostCount: 1,
} as const;

export type BlogLayout = 'grid' | 'list' | 'masonry';

// ─────────────────────────────────────────────────────────────
// Default Global Settings (site-wide)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_GLOBAL_SETTINGS = {
  siteName: 'Mi Sitio Web',
  siteDescription: '',
  siteUrl: '',
  favicon: '',
  logo: '',
  language: 'es',
  analytics: {
    googleAnalyticsId: '',
    facebookPixelId: '',
    hotjarId: '',
  },
  security: {
    captchaEnabled: false,
    captchaSiteKey: '',
    captchaSecretKey: '',
    httpsRedirect: true,
    contentProtection: false,
  },
  integrations: {
    mailchimpApiKey: '',
    mailchimpServer: '',
    mailchimpAudienceId: '',
    resendApiKey: '',
    googleMapsApiKey: '',
    googleMapsStyle: 'standard' as const,
  },
} as const;

export type MapsStyle = 'standard' | 'satellite' | 'terrain' | 'dark';

// ─────────────────────────────────────────────────────────────
// Generic Section Editor/Renderer Props (LEGO Interface)
// ─────────────────────────────────────────────────────────────

export interface SectionEditorProps<T = unknown> {
  section: T;
  onUpdate: (data: Partial<T>) => void;
}

export interface SectionRendererProps<T = unknown> {
  section: T;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    borderRadius: string;
    style: string;
  };
}

// ─────────────────────────────────────────────────────────────
// Validation Result (used by validators)
// ─────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// ─────────────────────────────────────────────────────────────
// Border Radius Map (used by ThemeEditor and renderers)
// ─────────────────────────────────────────────────────────────

export const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '16px',
  full: '9999px',
};

// ─────────────────────────────────────────────────────────────
// Color Helpers
// ─────────────────────────────────────────────────────────────

export const DEFAULT_COLOR_PALETTE = [
  '#0F766E', '#134E4A', '#F59E0B', '#059669', '#047857',
  '#7C3AED', '#5B21B6', '#EC4899', '#DC2626', '#991B1B',
  '#2563EB', '#1D4ED8', '#06B6D4', '#EA580C', '#C2410C',
  '#0D9488', '#B45309', '#92400E', '#FFFFFF', '#1F2937',
] as const;
