// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Type Definitions (Page-based Builder)
// ═══════════════════════════════════════════════════════════════

export type SectionType =
  | 'hero' | 'features' | 'about' | 'testimonials' | 'pricing'
  | 'cta' | 'contact' | 'gallery' | 'faq' | 'stats'
  | 'team' | 'footer'
  | 'navbar' | 'blog_list' | 'services' | 'video' | 'newsletter'
  | 'social_feed' | 'map_embed' | 'countdown' | 'tabs' | 'accordion'
  | 'timeline' | 'testimonial_slider';

export type PageTemplate = 'landing' | 'portfolio' | 'restaurant' | 'saas' | 'agency' | 'ecommerce' | 'blog';

export type BuilderPage = 'dashboard' | 'templates' | 'editor' | 'theme' | 'seo' | 'navigation' | 'preview';

// ─────────────────────────────────────────────────────────────
// Section Sizing — LEGO BLOCK for size controls
// ─────────────────────────────────────────────────────────────

export interface SectionSizing {
  // ── Preset Text Sizes ──
  /** Title font size in px (20-80) */
  titleSize?: number;
  /** Subtitle font size in px (14-40) */
  subtitleSize?: number;
  /** Body text font size in px (12-28) */
  bodySize?: number;

  // ── Preset Spacing ──
  /** Vertical padding of the section */
  paddingY?: 'compact' | 'default' | 'spacious';
  /** Max width of the inner container */
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  /** Gap between grid items */
  gap?: 'small' | 'default' | 'large';

  // ── Preset Image ──
  /** Image height preset (for sections with images) */
  imageHeight?: 'auto' | 'sm' | 'md' | 'lg';
  /** Image object-fit */
  imageFit?: 'cover' | 'contain' | 'fill';
  /** Image border radius */
  imageBorderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  // ══════════════════════════════════════════════════════════════
  // CUSTOM APPEARANCE (override theme per-section)
  // ══════════════════════════════════════════════════════════════
  /** Custom section background color (#hex) */
  backgroundColor?: string;
  /** Custom text color (#hex) */
  textColor?: string;
  /** Custom heading color (#hex) */
  headingColor?: string;
  /** Custom card/element background color (#hex) */
  cardBackgroundColor?: string;
  /** Shadow style for cards/elements */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom border color (#hex) */
  borderColor?: string;
  /** Custom border width (px) */
  borderWidth?: number;
  /** Section opacity (0-100) */
  opacity?: number;
  /** Custom border radius for cards (px) */
  cardBorderRadius?: number;
  /** Custom button/accent color (#hex) */
  accentColor?: string;

  // ══════════════════════════════════════════════════════════════
  // CUSTOM TEXT REFINEMENT
  // ══════════════════════════════════════════════════════════════
  /** Title font weight (100-900) */
  titleWeight?: number;
  /** Title line height (1.0-3.0) */
  titleLineHeight?: number;
  /** Title letter spacing in px (-2 to 10) */
  titleLetterSpacing?: number;
  /** Title text transform */
  titleTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Title text alignment */
  titleAlignment?: 'left' | 'center' | 'right';
  /** Subtitle font weight (100-900) */
  subtitleWeight?: number;
  /** Subtitle line height (1.0-3.0) */
  subtitleLineHeight?: number;
  /** Subtitle letter spacing in px (-2 to 10) */
  subtitleLetterSpacing?: number;
  /** Body font weight (100-900) */
  bodyWeight?: number;
  /** Body line height (1.0-3.0) */
  bodyLineHeight?: number;
  /** Body letter spacing in px (-2 to 10) */
  bodyLetterSpacing?: number;

  // ══════════════════════════════════════════════════════════════
  // CUSTOM SPACING (exact pixel values)
  // ══════════════════════════════════════════════════════════════
  /** Exact padding top (px) — overrides preset */
  customPaddingTop?: number;
  /** Exact padding bottom (px) — overrides preset */
  customPaddingBottom?: number;
  /** Exact padding horizontal (px) */
  customPaddingX?: number;
  /** Exact container max-width (px) — overrides preset */
  customContainerWidth?: number;
  /** Exact gap between items (px) — overrides preset */
  customGap?: number;
  /** Margin bottom below section (px) */
  marginBottom?: number;

  // ══════════════════════════════════════════════════════════════
  // CUSTOM IMAGE (exact values)
  // ══════════════════════════════════════════════════════════════
  /** Exact image height (px) — overrides preset */
  customImageHeight?: number;
  /** Exact image width (px or 'auto') */
  customImageWidth?: number;
  /** Exact image border radius (px) — overrides preset */
  customImageBorderRadius?: number;
  /** Image aspect ratio (e.g. '16/9', '4/3', '1/1', 'auto') */
  imageAspectRatio?: string;
}

/** Which sizing controls to show per section type */
export interface SizingCapabilities {
  showText?: boolean;
  showSpacing?: boolean;
  showImage?: boolean;
  showAppearance?: boolean;
  showCustomSpacing?: boolean;
}

export const SECTION_SIZING_CAPABILITIES: Record<string, SizingCapabilities> = {
  hero: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  features: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  about: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  testimonials: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  pricing: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  cta: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  contact: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  gallery: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  faq: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  stats: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  team: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  footer: { showSpacing: true, showAppearance: true, showCustomSpacing: true },
  navbar: { showImage: true, showAppearance: true },
  blog_list: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
  services: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  video: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  newsletter: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  social_feed: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  map_embed: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  countdown: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  tabs: { showSpacing: true, showAppearance: true, showCustomSpacing: true },
  accordion: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  timeline: { showText: true, showSpacing: true, showAppearance: true, showCustomSpacing: true },
  testimonial_slider: { showText: true, showSpacing: true, showImage: true, showAppearance: true, showCustomSpacing: true },
};

// ─────────────────────────────────────────────────────────────
// Section Data Types
// ─────────────────────────────────────────────────────────────

export interface HeroSection {
  type: 'hero'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; ctaText: string; ctaLink: string; secondaryCtaText: string; secondaryCtaLink: string; backgroundImage: string; overlayOpacity: number; height: 'small' | 'medium' | 'large'; alignment: 'left' | 'center' | 'right'; };
}
export interface Feature { id: string; icon: string; title: string; description: string; }
export interface FeaturesSection {
  type: 'features'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; columns: 2 | 3 | 4; features: Feature[]; };
}
export interface AboutSection {
  type: 'about'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; description: string; image: string; imagePosition: 'left' | 'right'; stats: { value: string; label: string }[]; };
}
export interface Testimonial { id: string; name: string; role: string; avatar: string; quote: string; rating: number; }
export interface TestimonialsSection {
  type: 'testimonials'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; testimonials: Testimonial[]; };
}
export interface PricingPlan { id: string; name: string; price: string; period: string; description: string; features: string[]; highlighted: boolean; ctaText: string; }
export interface PricingSection {
  type: 'pricing'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; plans: PricingPlan[]; };
}
export interface CTASection {
  type: 'cta'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; ctaText: string; ctaLink: string; backgroundStyle: 'solid' | 'gradient' | 'image'; backgroundImage: string; };
}
export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date' | 'file';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  halfWidth?: boolean;
}

export interface ContactSection {
  type: 'contact'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; email: string; phone: string; address: string; showForm: boolean; formFields: FormField[]; };
}
export interface GalleryImage { id: string; src: string; alt: string; caption?: string; }
export interface GallerySection {
  type: 'gallery'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; columns: 2 | 3 | 4; images: GalleryImage[]; };
}
export interface FAQItem { id: string; question: string; answer: string; }
export interface FAQSection {
  type: 'faq'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; items: FAQItem[]; };
}
export interface StatsSection {
  type: 'stats'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; items: { value: string; label: string; icon: string }[]; };
}
export interface TeamMember { id: string; name: string; role: string; avatar: string; bio: string; socials: { platform: string; url: string }[]; }
export interface TeamSection {
  type: 'team'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { title: string; subtitle: string; members: TeamMember[]; };
}
export interface FooterSection {
  type: 'footer'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: { brandName: string; brandDescription: string; columns: { title: string; links: { label: string; url: string }[] }[]; socialLinks: { platform: string; url: string }[]; copyright: string; };
}

// ─────────────────────────────────────────────────────────────
// NEW Section Data Types
// ─────────────────────────────────────────────────────────────

export interface NavLink {
  id: string;
  label: string;
  url: string;
  children: NavLink[];
}

export interface NavbarSection {
  type: 'navbar'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    brandName: string;
    logo: string;
    links: NavLink[];
    ctaText: string;
    ctaLink: string;
    style: 'solid' | 'transparent' | 'sticky' | 'floating';
    showOnScroll: boolean;
    mobileMenu: boolean;
    backgroundColor: string;
    textColor: string;
  };
}

export interface BlogListSection {
  type: 'blog_list'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    layout: 'grid' | 'list';
    columns: 2 | 3 | 4;
    showAuthor: boolean;
    showDate: boolean;
    showCategory: boolean;
    showExcerpt: boolean;
    readMoreText: string;
  };
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface ServicesSection {
  type: 'services'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    columns: 2 | 3 | 4;
    items: ServiceItem[];
  };
}

export interface VideoSection {
  type: 'video'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    url: string;
    title: string;
    autoplay: boolean;
    muted: boolean;
    showControls: boolean;
    aspectRatio: '16:9' | '4:3' | '1:1';
    overlayText: string;
    overlayEnabled: boolean;
  };
}

export interface NewsletterSection {
  type: 'newsletter'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    buttonText: string;
    backgroundColor: string;
    textColor: string;
    successMessage: string;
  };
}

export interface SocialFeedItem {
  id: string;
  platform: string;
  url: string;
  handle: string;
}

export interface SocialFeedSection {
  type: 'social_feed'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    platforms: SocialFeedItem[];
    layout: 'grid' | 'carousel' | 'bar';
  };
}

export interface MapEmbedSection {
  type: 'map_embed'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    url: string;
    title: string;
    height: 'small' | 'medium' | 'large' | 'custom';
    customHeight: string;
    showMarker: boolean;
    markerLabel: string;
    style: 'standard' | 'satellite' | 'dark';
  };
}

export interface CountdownSection {
  type: 'countdown'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    targetDate: string;
    ctaText: string;
    ctaLink: string;
    style: 'modern' | 'classic' | 'minimal';
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
  };
}

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  content: string;
}

export interface TabsSection {
  type: 'tabs'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    items: TabItem[];
    style: 'line' | 'card' | 'pill';
    defaultTab: number;
  };
}

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  defaultOpen: boolean;
}

export interface AccordionSection {
  type: 'accordion'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    items: AccordionItem[];
    allowMultiple: boolean;
  };
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  side: 'left' | 'right' | 'center';
}

export interface TimelineSection {
  type: 'timeline'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    items: TimelineItem[];
    style: 'vertical' | 'horizontal' | 'alternating';
  };
}

export interface TestimonialSliderSection {
  type: 'testimonial_slider'; id: string; enabled: boolean; sizing?: SectionSizing;
  data: {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
    autoplay: boolean;
    autoplaySpeed: number;
    showDots: boolean;
    showArrows: boolean;
  };
}

// ─────────────────────────────────────────────────────────────
// Page Section Union (ALL sections)
// ─────────────────────────────────────────────────────────────

export type PageSection =
  | HeroSection | FeaturesSection | AboutSection | TestimonialsSection | PricingSection
  | CTASection | ContactSection | GallerySection | FAQSection | StatsSection
  | TeamSection | FooterSection
  | NavbarSection | BlogListSection | ServicesSection | VideoSection | NewsletterSection
  | SocialFeedSection | MapEmbedSection | CountdownSection | TabsSection | AccordionSection
  | TimelineSection | TestimonialSliderSection;

// ─────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────

export interface PageTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  style: 'modern' | 'classic' | 'minimal' | 'bold';
}

// ─────────────────────────────────────────────────────────────
// Page (the main entity)
// ─────────────────────────────────────────────────────────────

export interface PageData {
  id: string;
  name: string;
  template: PageTemplate;
  sections: PageSection[];
  theme: PageTheme;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// NEW: SEO Types
// ─────────────────────────────────────────────────────────────

export interface PageSEO {
  id: string;
  pageId: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType: 'website' | 'article' | 'profile';
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

// ─────────────────────────────────────────────────────────────
// NEW: Navigation Types
// ─────────────────────────────────────────────────────────────

export type NavStyle = 'solid' | 'transparent' | 'sticky' | 'floating';

export interface SiteNavigation {
  id: string;
  brandName: string;
  logo: string;
  links: NavLink[];
  ctaText: string;
  ctaLink: string;
  style: NavStyle;
  showOnScroll: boolean;
  mobileMenu: boolean;
  backgroundColor: string;
  textColor: string;
}

// ─────────────────────────────────────────────────────────────
// NEW: Blog Types
// ─────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

// ─────────────────────────────────────────────────────────────
// NEW: Settings Types
// ─────────────────────────────────────────────────────────────

export interface GlobalSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  favicon: string;
  logo: string;
  language: string;
  analytics: {
    googleAnalyticsId: string;
    facebookPixelId: string;
    hotjarId: string;
  };
  security: {
    captchaEnabled: boolean;
    captchaSiteKey: string;
    captchaSecretKey: string;
    httpsRedirect: boolean;
    contentProtection: boolean;
  };
  integrations: {
    mailchimpApiKey: string;
    mailchimpServer: string;
    mailchimpAudienceId: string;
    resendApiKey: string;
    googleMapsApiKey: string;
    googleMapsStyle: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// Section Meta & Template Meta
// ═══════════════════════════════════════════════════════════════

export const SECTION_META: Record<string, { label: string; icon: string; description: string; category: string }> = {
  // ── Existing sections ──
  hero: { label: 'Hero', icon: 'Image', description: 'Encabezado principal con título, subtítulo y CTA', category: 'Principal' },
  features: { label: 'Características', icon: 'Grid3X3', description: 'Cuadrícula de funcionalidades con iconos', category: 'Contenido' },
  about: { label: 'Sobre Nosotros', icon: 'Info', description: 'Sección informativa con imagen y texto', category: 'Contenido' },
  testimonials: { label: 'Testimonios', icon: 'Quote', description: 'Opiniones y reseñas de clientes', category: 'Social Proof' },
  pricing: { label: 'Precios', icon: 'DollarSign', description: 'Tabla de planes y precios', category: 'Conversión' },
  cta: { label: 'Llamada a la Acción', icon: 'MousePointerClick', description: 'Sección de conversión con botón CTA', category: 'Conversión' },
  contact: { label: 'Contacto', icon: 'Mail', description: 'Información de contacto y formulario', category: 'Contenido' },
  gallery: { label: 'Galería', icon: 'Images', description: 'Galería de imágenes', category: 'Contenido' },
  faq: { label: 'Preguntas Frecuentes', icon: 'HelpCircle', description: 'Sección de preguntas y respuestas', category: 'Soporte' },
  stats: { label: 'Estadísticas', icon: 'BarChart3', description: 'Números y métricas destacadas', category: 'Social Proof' },
  team: { label: 'Equipo', icon: 'Users', description: 'Presentación del equipo', category: 'Contenido' },
  footer: { label: 'Pie de Página', icon: 'PanelBottom', description: 'Footer con enlaces y redes sociales', category: 'Estructural' },

  // ── NEW sections ──
  navbar: { label: 'Barra de Navegación', icon: 'Menu', description: 'Barra de navegación con logo, enlaces y CTA', category: 'NAVEGACION' },
  blog_list: { label: 'Lista de Blog', icon: 'FileText', description: 'Cuadrícula de artículos del blog', category: 'BLOG' },
  services: { label: 'Servicios', icon: 'Wrench', description: 'Catálogo de servicios con precios y características', category: 'Contenido' },
  video: { label: 'Video', icon: 'PlayCircle', description: 'Reproductor de video embebido con overlay', category: 'MEDIA' },
  newsletter: { label: 'Newsletter', icon: 'Send', description: 'Formulario de suscripción por correo electrónico', category: 'INTEGRACION' },
  social_feed: { label: 'Redes Sociales', icon: 'Share2', description: 'Feed de redes sociales embebido', category: 'INTEGRACION' },
  map_embed: { label: 'Mapa', icon: 'MapPin', description: 'Mapa embebido con marcador de ubicación', category: 'INTEGRACION' },
  countdown: { label: 'Cuenta Regresiva', icon: 'Timer', description: 'Temporizador con fecha objetivo y CTA', category: 'Contenido' },
  tabs: { label: 'Pestañas', icon: 'Columns', description: 'Contenido organizado en pestañas', category: 'Contenido' },
  accordion: { label: 'Acordeón', icon: 'ChevronDown', description: 'Contenido desplegable tipo acordeón', category: 'SOPORTE' },
  timeline: { label: 'Línea de Tiempo', icon: 'Clock', description: 'Cronología de eventos y hitos', category: 'Contenido' },
  testimonial_slider: { label: 'Carrusel de Testimonios', icon: 'MessageSquareQuote', description: 'Slider animado de testimonios de clientes', category: 'Social Proof' },
};

export const TEMPLATE_META: Record<PageTemplate, { label: string; description: string; icon: string; color: string; sections: SectionType[] }> = {
  landing: { label: 'Landing Page', description: 'Página de aterrizaje moderna', icon: 'Rocket', color: '#0F766E', sections: ['navbar', 'hero', 'features', 'about', 'testimonials', 'cta', 'footer'] },
  portfolio: { label: 'Portafolio', description: 'Muestra tu trabajo creativo', icon: 'Briefcase', color: '#7C3AED', sections: ['navbar', 'hero', 'gallery', 'stats', 'testimonials', 'cta', 'footer'] },
  restaurant: { label: 'Restaurante', description: 'Sitio para restaurantes', icon: 'UtensilsCrossed', color: '#DC2626', sections: ['navbar', 'hero', 'features', 'about', 'testimonials', 'gallery', 'contact', 'footer'] },
  saas: { label: 'SaaS', description: 'Producto de software como servicio', icon: 'Cloud', color: '#2563EB', sections: ['navbar', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'] },
  agency: { label: 'Agencia', description: 'Agencia creativa o de marketing', icon: 'Building2', color: '#EA580C', sections: ['navbar', 'hero', 'about', 'features', 'gallery', 'stats', 'team', 'cta', 'footer'] },
  ecommerce: { label: 'E-Commerce', description: 'Tienda en línea', icon: 'ShoppingCart', color: '#059669', sections: ['navbar', 'hero', 'features', 'gallery', 'pricing', 'testimonials', 'faq', 'footer'] },
  blog: { label: 'Blog', description: 'Sitio de artículos y contenido', icon: 'PenLine', color: '#B45309', sections: ['navbar', 'hero', 'blog_list', 'newsletter', 'cta', 'footer'] },
};

// ─────────────────────────────────────────────────────────────
// Font Options
// ─────────────────────────────────────────────────────────────

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Source Sans 3', value: 'Source Sans 3' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'Sora', value: 'Sora' },
];
