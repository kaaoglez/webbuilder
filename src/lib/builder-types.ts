// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Type Definitions (Page-based Builder)
// ═══════════════════════════════════════════════════════════════

export type SectionType =
  | 'hero' | 'features' | 'about' | 'testimonials' | 'pricing'
  | 'cta' | 'contact' | 'gallery' | 'faq' | 'stats'
  | 'team' | 'footer';

export type PageTemplate = 'landing' | 'portfolio' | 'restaurant' | 'saas' | 'agency' | 'ecommerce' | 'blog';

export type BuilderPage = 'dashboard' | 'templates' | 'editor' | 'theme' | 'preview';

// ─────────────────────────────────────────────────────────────
// Section Data Types
// ─────────────────────────────────────────────────────────────

export interface HeroSection {
  type: 'hero'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; ctaText: string; ctaLink: string; secondaryCtaText: string; secondaryCtaLink: string; backgroundImage: string; overlayOpacity: number; height: 'small' | 'medium' | 'large'; alignment: 'left' | 'center' | 'right'; };
}
export interface Feature { id: string; icon: string; title: string; description: string; }
export interface FeaturesSection {
  type: 'features'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; columns: 2 | 3 | 4; features: Feature[]; };
}
export interface AboutSection {
  type: 'about'; id: string; enabled: boolean;
  data: { title: string; description: string; image: string; imagePosition: 'left' | 'right'; stats: { value: string; label: string }[]; };
}
export interface Testimonial { id: string; name: string; role: string; avatar: string; quote: string; rating: number; }
export interface TestimonialsSection {
  type: 'testimonials'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; testimonials: Testimonial[]; };
}
export interface PricingPlan { id: string; name: string; price: string; period: string; description: string; features: string[]; highlighted: boolean; ctaText: string; }
export interface PricingSection {
  type: 'pricing'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; plans: PricingPlan[]; };
}
export interface CTASection {
  type: 'cta'; id: string; enabled: boolean;
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
  type: 'contact'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; email: string; phone: string; address: string; showForm: boolean; formFields: FormField[]; };
}
export interface GalleryImage { id: string; src: string; alt: string; caption?: string; }
export interface GallerySection {
  type: 'gallery'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; columns: 2 | 3 | 4; images: GalleryImage[]; };
}
export interface FAQItem { id: string; question: string; answer: string; }
export interface FAQSection {
  type: 'faq'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; items: FAQItem[]; };
}
export interface StatsSection {
  type: 'stats'; id: string; enabled: boolean;
  data: { title: string; items: { value: string; label: string; icon: string }[]; };
}
export interface TeamMember { id: string; name: string; role: string; avatar: string; bio: string; socials: { platform: string; url: string }[]; }
export interface TeamSection {
  type: 'team'; id: string; enabled: boolean;
  data: { title: string; subtitle: string; members: TeamMember[]; };
}
export interface FooterSection {
  type: 'footer'; id: string; enabled: boolean;
  data: { brandName: string; brandDescription: string; columns: { title: string; links: { label: string; url: string }[] }[]; socialLinks: { platform: string; url: string }[]; copyright: string; };
}

export type PageSection =
  | HeroSection | FeaturesSection | AboutSection | TestimonialsSection | PricingSection
  | CTASection | ContactSection | GallerySection | FAQSection | StatsSection
  | TeamSection | FooterSection;

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

// ═══════════════════════════════════════════════════════════════
// Section Meta & Template Meta
// ═══════════════════════════════════════════════════════════════

export const SECTION_META: Record<string, { label: string; icon: string; description: string; category: string }> = {
  hero: { label: 'Encabezado', icon: 'Image', description: 'Encabezado principal con título, subtítulo y CTA', category: 'Principal' },
  features: { label: 'Características', icon: 'Grid3X3', description: 'Cuadrícula de funcionalidades con iconos', category: 'Contenido' },
  about: { label: 'Sobre Nosotros', icon: 'Info', description: 'Sección informativa con imagen y texto', category: 'Contenido' },
  testimonials: { label: 'Testimonios', icon: 'Quote', description: 'Opiniones y reseñas de clientes', category: 'Prueba Social' },
  pricing: { label: 'Precios', icon: 'DollarSign', description: 'Tabla de planes y precios', category: 'Conversión' },
  cta: { label: 'Llamada a la Acción', icon: 'MousePointerClick', description: 'Sección de conversión con botón CTA', category: 'Conversión' },
  contact: { label: 'Contacto', icon: 'Mail', description: 'Información de contacto y formulario', category: 'Contenido' },
  gallery: { label: 'Galería', icon: 'Images', description: 'Galería de imágenes', category: 'Contenido' },
  faq: { label: 'Preguntas Frecuentes', icon: 'HelpCircle', description: 'Sección de preguntas y respuestas', category: 'Soporte' },
  stats: { label: 'Estadísticas', icon: 'BarChart3', description: 'Números y métricas destacadas', category: 'Prueba Social' },
  team: { label: 'Equipo', icon: 'Users', description: 'Presentación del equipo', category: 'Contenido' },
  footer: { label: 'Pie de Página', icon: 'PanelBottom', description: 'Footer con enlaces y redes sociales', category: 'Estructural' },
};

export const TEMPLATE_META: Record<PageTemplate, { label: string; description: string; icon: string; color: string; sections: SectionType[]; preview: string; tags: string[] }> = {
  landing: { label: 'Página de Aterrizaje', description: 'Página de aterrizaje moderna con hero impactante, secciones de características y testimonios. Perfecta para lanzamientos de producto.', icon: 'Rocket', color: '#0F766E', sections: ['hero', 'features', 'about', 'testimonials', 'cta', 'footer'], preview: '/templates/landing.png', tags: ['Marketing', 'Startup', 'Producto'] },
  portfolio: { label: 'Portafolio', description: 'Muestra tu trabajo creativo con galerías elegantes, estadísticas y testimonios de clientes satisfechos.', icon: 'Briefcase', color: '#7C3AED', sections: ['hero', 'gallery', 'stats', 'testimonials', 'cta', 'footer'], preview: '/templates/portfolio.png', tags: ['Diseño', 'Fotografía', 'Arte'] },
  restaurant: { label: 'Restaurante', description: 'Sitio web completo para restaurantes con menú, galería de platos, reservas y sección de contacto.', icon: 'UtensilsCrossed', color: '#DC2626', sections: ['hero', 'features', 'about', 'testimonials', 'gallery', 'contact', 'footer'], preview: '/templates/restaurant.png', tags: ['Gastronomía', 'Local', 'Catering'] },
  saas: { label: 'SaaS', description: 'Página de producto SaaS con planes de precios, FAQ, testimonios y llamada a la acción.', icon: 'Cloud', color: '#2563EB', sections: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'], preview: '/templates/saas.png', tags: ['Software', 'Tech', 'Startup'] },
  agency: { label: 'Agencia', description: 'Sitio profesional para agencias creativas con equipo, portafolio, estadísticas y casos de éxito.', icon: 'Building2', color: '#EA580C', sections: ['hero', 'about', 'features', 'gallery', 'stats', 'team', 'cta', 'footer'], preview: '/templates/agency.png', tags: ['Marketing', 'Creatividad', 'Diseño'] },
  ecommerce: { label: 'E-Commerce', description: 'Tienda en línea con catálogo de productos, planes de precios y preguntas frecuentes.', icon: 'ShoppingCart', color: '#059669', sections: ['hero', 'features', 'gallery', 'pricing', 'testimonials', 'faq', 'footer'], preview: '/templates/ecommerce.png', tags: ['Ventas', 'Tienda', 'Producto'] },
  blog: { label: 'Blog', description: 'Sitio de artículos y contenido con diseño editorial clásico, galería y testimonios.', icon: 'PenLine', color: '#B45309', sections: ['hero', 'features', 'gallery', 'testimonials', 'cta', 'footer'], preview: '/templates/blog.png', tags: ['Contenido', 'Artículos', 'Noticias'] },
};

// ═══════════════════════════════════════════════════════════════
// Section Sizing Capabilities (used by SizingControls)
// ═══════════════════════════════════════════════════════════════

export interface SectionSizingCapability {
  hasTypography: boolean;
  hasSpacing: boolean;
  hasImageOptions: boolean;
  hasAppearance: boolean;
}

export const SECTION_SIZING_CAPABILITIES: Record<string, SectionSizingCapability> = {
  hero:         { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  features:     { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  about:        { hasTypography: true, hasSpacing: true, hasImageOptions: true,  hasAppearance: true },
  testimonials: { hasTypography: true, hasSpacing: true, hasImageOptions: true,  hasAppearance: true },
  pricing:      { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  cta:          { hasTypography: true, hasSpacing: true, hasImageOptions: true,  hasAppearance: true },
  contact:      { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  gallery:      { hasTypography: true, hasSpacing: true, hasImageOptions: true,  hasAppearance: true },
  faq:          { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  stats:        { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
  team:         { hasTypography: true, hasSpacing: true, hasImageOptions: true,  hasAppearance: true },
  footer:       { hasTypography: true, hasSpacing: true, hasImageOptions: false, hasAppearance: true },
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
