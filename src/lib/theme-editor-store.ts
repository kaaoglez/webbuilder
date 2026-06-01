import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeSection, NavItemConfig, FooterColumn, SocialLink } from '@/lib/wp-theme-generator';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type SectionType = ThemeSection['type'];
type EditorTab = 'info' | 'navigation' | 'design' | 'sections' | 'templates' | 'footer';

// ─────────────────────────────────────────────────────────────
// Page Template Types
// ─────────────────────────────────────────────────────────────

export type TemplateLayout = 'full-width' | 'with-sidebar-left' | 'with-sidebar-right';

export type SidebarWidgetType = 'search' | 'recent-posts' | 'categories' | 'tags' | 'archives' | 'pages' | 'custom-text' | 'calendar';

export interface SidebarWidget {
  id: string;
  type: SidebarWidgetType;
  title: string;
  enabled: boolean;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  type: 'predesigned' | 'custom';
  slug: string;
  icon: string;
  enabled: boolean;
  layout: TemplateLayout;
  sidebarWidgets: SidebarWidget[];
  // For custom templates: they use the same section system as the front page
  sections: ThemeSection[];
  // Predesigned-specific toggles
  options: Record<string, boolean>;
}

export const SIDEBAR_WIDGET_TYPES: { value: SidebarWidgetType; label: string; icon: string }[] = [
  { value: 'search', label: 'Búsqueda', icon: '🔍' },
  { value: 'recent-posts', label: 'Posts Recientes', icon: '📝' },
  { value: 'categories', label: 'Categorías', icon: '📁' },
  { value: 'tags', label: 'Etiquetas', icon: '🏷️' },
  { value: 'archives', label: 'Archivos', icon: '📅' },
  { value: 'pages', label: 'Páginas', icon: '📄' },
  { value: 'custom-text', label: 'Texto Personalizado', icon: '✏️' },
  { value: 'calendar', label: 'Calendario', icon: '📆' },
];

export const LAYOUT_OPTIONS: { value: TemplateLayout; label: string; description: string }[] = [
  { value: 'full-width', label: 'Ancho completo', description: 'Sin barra lateral' },
  { value: 'with-sidebar-right', label: 'Sidebar derecha', description: 'Contenido + sidebar a la derecha' },
  { value: 'with-sidebar-left', label: 'Sidebar izquierda', description: 'Sidebar + contenido a la derecha' },
];

const DEFAULT_WIDGETS: SidebarWidget[] = [
  { id: 'w_search', type: 'search', title: 'Buscar', enabled: true },
  { id: 'w_recent', type: 'recent-posts', title: 'Posts Recientes', enabled: true },
  { id: 'w_categories', type: 'categories', title: 'Categorías', enabled: true },
  { id: 'w_tags', type: 'tags', title: 'Etiquetas', enabled: false },
  { id: 'w_archives', type: 'archives', title: 'Archivos', enabled: false },
];

const DEFAULT_PREDESIGNED_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'single-post',
    name: 'Artículo Individual',
    description: 'Plantilla para artículos individuales del blog',
    type: 'predesigned',
    slug: 'single',
    icon: 'FileText',
    enabled: true,
    layout: 'with-sidebar-right',
    sidebarWidgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS)),
    sections: [],
    options: {
      showFeaturedImage: true,
      showAuthorBox: true,
      showRelatedPosts: true,
      showComments: true,
      showShareButtons: true,
      showPostNavigation: true,
    },
  },
  {
    id: 'blog-archive',
    name: 'Blog / Archivo',
    description: 'Listado de posts por categoría, tag, fecha o autor',
    type: 'predesigned',
    slug: 'archive',
    icon: 'LayoutList',
    enabled: true,
    layout: 'with-sidebar-right',
    sidebarWidgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS)),
    sections: [],
    options: {
      showExcerpt: true,
      showFeaturedImage: true,
      showAuthor: true,
      showDate: true,
      showReadMore: true,
      postsPerRow: true,
    },
  },
  {
    id: 'static-page',
    name: 'Página Estática',
    description: 'Template genérico para páginas de contenido',
    type: 'predesigned',
    slug: 'page',
    icon: 'File',
    enabled: true,
    layout: 'full-width',
    sidebarWidgets: [],
    sections: [],
    options: {
      showHeroBanner: true,
      showTitle: true,
      showSidebar: false,
    },
  },
  {
    id: 'page-404',
    name: 'Página 404',
    description: 'Página de error "No encontrado"',
    type: 'predesigned',
    slug: '404',
    icon: 'AlertTriangle',
    enabled: true,
    layout: 'full-width',
    sidebarWidgets: [],
    sections: [],
    options: {
      showSearchBox: true,
      showRecentPosts: true,
      showBackToHome: true,
    },
  },
  {
    id: 'search-results',
    name: 'Resultados de Búsqueda',
    description: 'Resultados de búsqueda del sitio',
    type: 'predesigned',
    slug: 'search',
    icon: 'Search',
    enabled: true,
    layout: 'with-sidebar-right',
    sidebarWidgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS)),
    sections: [],
    options: {
      showExcerpt: true,
      showFeaturedImage: true,
      showHighlight: true,
    },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Barra lateral del sitio con widgets configurables',
    type: 'predesigned',
    slug: 'sidebar',
    icon: 'PanelRight',
    enabled: true,
    layout: 'full-width',
    sidebarWidgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS)),
    sections: [],
    options: {
      showSearchWidget: true,
      showRecentPostsWidget: true,
      showCategoriesWidget: true,
      showTagsWidget: true,
      showArchivesWidget: false,
      showPagesWidget: true,
      showCustomTextWidget: false,
      showCalendarWidget: false,
    },
  },
  {
    id: 'site-header',
    name: 'Encabezado',
    description: 'Encabezado del sitio con logo, navegación y menú móvil',
    type: 'predesigned',
    slug: 'header',
    icon: 'PanelTop',
    enabled: true,
    layout: 'full-width',
    sidebarWidgets: [],
    sections: [],
    options: {
      showLogo: true,
      showSiteTitle: true,
      showTagline: true,
      showStickyHeader: true,
      showMobileMenu: true,
      showSearchIcon: true,
    },
  },
];

function generateTemplateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// ─────────────────────────────────────────────────────────────
// Custom Pages
// ─────────────────────────────────────────────────────────────

export interface ThemePage {
  id: string;
  name: string;
  slug: string; // e.g. 'about', 'services' — used for page-{slug}.php
  sections: ThemeSection[];
}

function generatePageId(): string {
  return `pg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/** Partial shape matching ThemeConfig from wp-theme-generator.ts */
export interface ThemeEditorConfig {
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  authorUri: string;
  textDomain: string;
  // Branding
  siteTitle: string;
  logoUrl: string;
  tagline: string;
  // Design
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: number;
  sections: ThemeSection[];
  navItems: NavItemConfig[];
  footerColumns: FooterColumn[];
  copyrightText: string;
  socialLinks: SocialLink[];
  // Navigation behavior
  navbarBehavior: 'sticky' | 'hide-on-scroll' | 'static';
  showScrollToTop: boolean;
  // Card ordering per tab
  cardOrders: Record<string, string[]>;
  // Page Templates
  pageTemplates: ThemeTemplate[];
  // Template editing state
  activeTemplateId: string | null;
  // Custom Pages
  pages: ThemePage[];
  activePageId: string | null;
}

interface ThemeEditorState {
  config: Partial<ThemeEditorConfig>;
  activeTab: EditorTab;
  activeSectionIndex: number | null;
  isGenerating: boolean;
  activePageId: string | null;
  activePageSectionIndex: number | null;
}

interface ThemeEditorActions {
  setActiveTab: (tab: EditorTab) => void;
  setActiveSectionIndex: (index: number | null) => void;
  setIsGenerating: (val: boolean) => void;
  updateConfig: (partial: Partial<ThemeEditorConfig>) => void;
  addSection: (type: SectionType) => void;
  removeSection: (index: number) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  updateSection: (index: number, partial: Partial<ThemeSection>) => void;
  toggleSection: (index: number) => void;
  updateSectionData: (index: number, dataPartial: Record<string, unknown>) => void;
  setDefaultSections: (templateType: string) => void;
  addNavItem: (item?: NavItemConfig) => void;
  removeNavItem: (index: number) => void;
  updateNavItem: (index: number, partial: Partial<NavItemConfig>) => void;
  moveNavItem: (fromIndex: number, toIndex: number) => void;
  addFooterColumn: () => void;
  removeFooterColumn: (index: number) => void;
  updateFooterColumn: (index: number, partial: Partial<FooterColumn>) => void;
  addFooterLink: (colIndex: number, link?: { label: string; url: string }) => void;
  removeFooterLink: (colIndex: number, linkIndex: number) => void;
  updateFooterLink: (colIndex: number, linkIndex: number, partial: Partial<{ label: string; url: string }>) => void;
  addSocialLink: (link?: SocialLink) => void;
  removeSocialLink: (index: number) => void;
  updateSocialLink: (index: number, partial: Partial<SocialLink>) => void;
  // ─── Page Templates Management ───────────────────
  addPageTemplate: (name: string, description?: string) => void;
  removePageTemplate: (id: string) => void;
  updatePageTemplate: (id: string, partial: Partial<ThemeTemplate>) => void;
  togglePageTemplate: (id: string) => void;
  setActiveTemplateId: (id: string | null) => void;
  addTemplateSection: (templateId: string, type: SectionType) => void;
  removeTemplateSection: (templateId: string, index: number) => void;
  moveTemplateSection: (templateId: string, fromIndex: number, toIndex: number) => void;
  updateTemplateSection: (templateId: string, index: number, partial: Partial<ThemeSection>) => void;
  toggleTemplateSection: (templateId: string, index: number) => void;
  updateTemplateSectionData: (templateId: string, index: number, dataPartial: Record<string, unknown>) => void;
  updateTemplateWidget: (templateId: string, widgetId: string, partial: Partial<SidebarWidget>) => void;
  // Generic array reorder within section data
  reorderSectionDataArray: (sectionIndex: number, dataKey: string, fromIndex: number, toIndex: number) => void;
  // Card reorder per tab
  reorderCards: (tab: string, fromIndex: number, toIndex: number) => void;
  // ─── Custom Pages CRUD ────────────────────────────
  addPage: (name: string, slug: string) => void;
  removePage: (id: string) => void;
  updatePage: (id: string, partial: Partial<ThemePage>) => void;
  setActivePageId: (id: string | null) => void;
  setActivePageSectionIndex: (index: number | null) => void;
  addPageSection: (pageId: string, type: SectionType) => void;
  removePageSection: (pageId: string, index: number) => void;
  movePageSection: (pageId: string, fromIndex: number, toIndex: number) => void;
  updatePageSection: (pageId: string, index: number, partial: Partial<ThemeSection>) => void;
  togglePageSection: (pageId: string, index: number) => void;
  updatePageSectionData: (pageId: string, index: number, dataPartial: Record<string, unknown>) => void;
}

// ─────────────────────────────────────────────────────────────
// Font Options
// ─────────────────────────────────────────────────────────────

export const FONT_OPTIONS = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Roboto',
  'Open Sans',
  'Lato',
  'Playfair Display',
  'Merriweather',
  'Oswald',
  'Raleway',
  'Nunito',
  'Source Sans Pro',
] as const;

// ─────────────────────────────────────────────────────────────
// Default Section Data by Type
// ─────────────────────────────────────────────────────────────

export const SECTION_DEFAULT_DATA: Record<SectionType, Record<string, unknown>> = {
  hero: {
    title: 'Sección Principal',
    subtitle: '',
    ctaText: '',
    ctaLink: '#',
    secondaryCtaText: '',
    secondaryCtaLink: '#',
    backgroundImage: '',
    overlayOpacity: 0.5,
  },
  about: {
    title: 'Sobre Nosotros',
    subtitle: '',
    image: '',
    stats: [],
  },
  services: {
    title: 'Nuestros Servicios',
    subtitle: '',
    items: [{ icon: '⚡', title: 'Servicio 1', description: '' }],
    columns: 3,
  },
  features: {
    title: 'Nuestras Características',
    subtitle: '',
    items: [{ icon: '✦', title: 'Característica 1', description: '' }],
    columns: 3,
  },
  testimonials: {
    title: 'Lo Que Dicen Nuestros Clientes',
    subtitle: '',
    testimonials: [{ quote: '', name: '', role: '', rating: 5 }],
  },
  pricing: {
    title: 'Planes de Precios',
    subtitle: '',
    plans: [{ name: 'Básico', price: '$0', period: '/mes', features: [], highlighted: false }],
  },
  cta: {
    title: 'Llamada a la Acción',
    subtitle: '',
    ctaText: 'Comenzar',
    ctaLink: '#',
  },
  contact: {
    title: 'Contáctanos',
    subtitle: '',
    email: '',
    phone: '',
    address: '',
    showForm: false,
  },
  gallery: {
    title: 'Galería',
    subtitle: '',
    images: [],
    columns: 3,
  },
  faq: {
    title: 'Preguntas Frecuentes',
    subtitle: '',
    items: [{ question: '', answer: '' }],
  },
  stats: {
    title: 'Estadísticas',
    items: [{ icon: '📊', value: '0', label: '' }],
  },
  team: {
    title: 'Nuestro Equipo',
    members: [{ name: '', role: '', bio: '', avatar: '', socials: [] }],
  },
  blog_posts: {
    title: 'Últimas Publicaciones',
    subtitle: '',
  },
  custom: {
    mode: 'visual',
    rows: [],
    customHtml: '',
    customCss: '',
  },
};

// ─────────────────────────────────────────────────────────────
// Section title map (human-readable names)
// ─────────────────────────────────────────────────────────────

export const SECTION_TITLES: Record<SectionType, string> = {
  hero: 'Sección Principal',
  about: 'Sobre Nosotros',
  services: 'Nuestros Servicios',
  features: 'Nuestras Características',
  testimonials: 'Lo Que Dicen Nuestros Clientes',
  pricing: 'Planes de Precios',
  cta: 'Llamada a la Acción',
  contact: 'Contáctanos',
  gallery: 'Galería',
  faq: 'Preguntas Frecuentes',
  stats: 'Estadísticas',
  team: 'Nuestro Equipo',
  blog_posts: 'Últimas Publicaciones',
  custom: 'Sección Personalizada',
};

// ─────────────────────────────────────────────────────────────
// Template-specific default sections
// ─────────────────────────────────────────────────────────────

export const TEMPLATE_SECTIONS: Record<string, SectionType[]> = {
  landing: ['hero', 'features', 'about', 'testimonials', 'cta'],
  portfolio: ['hero', 'about', 'gallery', 'testimonials', 'cta'],
  restaurant: ['hero', 'features', 'about', 'gallery', 'testimonials', 'contact'],
  saas: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta'],
  agency: ['hero', 'about', 'services', 'gallery', 'team', 'cta'],
  ecommerce: ['hero', 'features', 'gallery', 'pricing', 'testimonials', 'faq'],
  blog: ['hero', 'features', 'blog_posts', 'testimonials', 'cta'],
};

/** Returns a default array of sections based on template type */
export function getDefaultSections(templateType: string): ThemeSection[] {
  const types = TEMPLATE_SECTIONS[templateType] || TEMPLATE_SECTIONS.landing;
  return types.map(type => createDefaultSection(type));
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function createDefaultSection(type: SectionType): ThemeSection {
  return {
    type,
    enabled: true,
    title: SECTION_TITLES[type],
    data: JSON.parse(JSON.stringify(SECTION_DEFAULT_DATA[type])),
  };
}

// ─────────────────────────────────────────────────────────────
// Default config (mirrors generate-theme-schema/route.ts)
// ─────────────────────────────────────────────────────────────

const INITIAL_CONFIG: Partial<ThemeEditorConfig> = {
  name: 'Mi Theme WordPress',
  slug: 'my-theme',
  description: 'A professional WordPress theme generated by PageForge',
  version: '1.0.0',
  author: 'PageForge',
  authorUri: 'https://pageforge.dev',
  textDomain: 'my-theme',
  siteTitle: 'Mi Sitio Web',
  logoUrl: '',
  tagline: 'Un sitio web profesional creado con PageForge',
  primaryColor: '#2563EB',
  secondaryColor: '#7C3AED',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  borderRadius: 8,
  sections: getDefaultSections('landing'),
  navItems: [
    { label: 'Inicio', url: '/' },
    { label: 'Características', url: '#section-features' },
    { label: 'Sobre Nosotros', url: '#section-about' },
    { label: 'Testimonios', url: '#section-testimonials' },
  ],
  footerColumns: [
    { title: 'Acerca de', links: [{ label: 'Nuestra Historia', url: '/about' }] },
    { title: 'Servicios', links: [{ label: 'Lo Que Hacemos', url: '/services' }] },
    { title: 'Recursos', links: [{ label: 'Blog', url: '/blog' }] },
    { title: 'Contacto', links: [{ label: 'Contáctanos', url: '/contact' }] },
  ],
  copyrightText: 'Todos los derechos reservados',
  socialLinks: [
    { platform: 'twitter', url: '#' },
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
  ],
  navbarBehavior: 'sticky' as const,
  showScrollToTop: false,
  cardOrders: {
    info: ['branding', 'metadata'],
    design: ['colors', 'typography', 'borders'],
    navigation: ['banner', 'preview', 'menu', 'behavior', 'quick-add'],
    footer: ['copyright', 'social', 'columns'],
  },
  pageTemplates: JSON.parse(JSON.stringify(DEFAULT_PREDESIGNED_TEMPLATES)),
  activeTemplateId: null,
  pages: [] as ThemePage[],
  activePageId: null,
};

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useThemeEditorStore = create<ThemeEditorState & ThemeEditorActions>()(
  persist(
    (set) => ({
  // State
  config: INITIAL_CONFIG,
  activeTab: 'info',
  activeSectionIndex: null,
  isGenerating: false,
  activePageId: null,
  activePageSectionIndex: null,

  // Simple setters
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  setActivePageId: (id) => set({ activePageId: id }),
  setActivePageSectionIndex: (index) => set({ activePageSectionIndex: index }),

  // Merge partial config
  updateConfig: (partial) =>
    set((state) => ({
      config: { ...state.config, ...partial },
    })),

  // Fully replace config (used by template load and project reload)
  replaceConfig: (fullConfig) =>
    set(() => ({
      config: { ...INITIAL_CONFIG, ...fullConfig },
      activeTab: 'info' as EditorTab,
      activeSectionIndex: null,
    })),

  // Add a new section with defaults based on type
  addSection: (type) =>
    set((state) => {
      const newSection = createDefaultSection(type);
      return {
        config: {
          ...state.config,
          sections: [...(state.config.sections || []), newSection],
        },
      };
    }),

  // Remove section by index
  removeSection: (index) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      sections.splice(index, 1);
      return {
        config: { ...state.config, sections },
        activeSectionIndex:
          state.activeSectionIndex === index
            ? null
            : state.activeSectionIndex !== null && state.activeSectionIndex > index
              ? state.activeSectionIndex - 1
              : state.activeSectionIndex,
      };
    }),

  // Reorder section (move fromIndex to toIndex)
  moveSection: (fromIndex, toIndex) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return {
        config: { ...state.config, sections },
        activeSectionIndex: toIndex,
      };
    }),

  // Update a specific section's top-level properties
  updateSection: (index, partial) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      if (sections[index]) {
        sections[index] = { ...sections[index], ...partial };
      }
      return { config: { ...state.config, sections } };
    }),

  // Toggle section enabled/disabled
  toggleSection: (index) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      if (sections[index]) {
        sections[index] = { ...sections[index], enabled: !sections[index].enabled };
      }
      return { config: { ...state.config, sections } };
    }),

  // Update section.data with a partial merge
  updateSectionData: (index, dataPartial) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      if (sections[index]) {
        sections[index] = {
          ...sections[index],
          data: { ...sections[index].data, ...dataPartial },
        };
      }
      return { config: { ...state.config, sections } };
    }),

  // Reset sections based on template type
  setDefaultSections: (templateType) =>
    set((state) => ({
      config: {
        ...state.config,
        sections: getDefaultSections(templateType),
      },
      activeSectionIndex: null,
    })),

  // ─── Navigation Items Management ──────────────────────
  addNavItem: (item) =>
    set((state) => ({
      config: {
        ...state.config,
        navItems: [
          ...(state.config.navItems || []),
          item || { label: '', url: '#' },
        ],
      },
    })),

  removeNavItem: (index) =>
    set((state) => {
      const navItems = [...(state.config.navItems || [])];
      navItems.splice(index, 1);
      return { config: { ...state.config, navItems } };
    }),

  updateNavItem: (index, partial) =>
    set((state) => {
      const navItems = [...(state.config.navItems || [])];
      if (navItems[index]) {
        navItems[index] = { ...navItems[index], ...partial };
      }
      return { config: { ...state.config, navItems } };
    }),

  moveNavItem: (fromIndex, toIndex) =>
    set((state) => {
      const navItems = [...(state.config.navItems || [])];
      const [moved] = navItems.splice(fromIndex, 1);
      navItems.splice(toIndex, 0, moved);
      return { config: { ...state.config, navItems } };
    }),

  // ─── Footer Columns Management ────────────────────────
  addFooterColumn: () =>
    set((state) => ({
      config: {
        ...state.config,
        footerColumns: [
          ...(state.config.footerColumns || []),
          { title: '', links: [] },
        ],
      },
    })),

  removeFooterColumn: (index) =>
    set((state) => {
      const cols = [...(state.config.footerColumns || [])];
      cols.splice(index, 1);
      return { config: { ...state.config, footerColumns: cols } };
    }),

  updateFooterColumn: (index, partial) =>
    set((state) => {
      const cols = [...(state.config.footerColumns || [])];
      if (cols[index]) {
        cols[index] = { ...cols[index], ...partial };
      }
      return { config: { ...state.config, footerColumns: cols } };
    }),

  addFooterLink: (colIndex, link) =>
    set((state) => {
      const cols = [...(state.config.footerColumns || [])];
      if (cols[colIndex]) {
        cols[colIndex] = {
          ...cols[colIndex],
          links: [
            ...(cols[colIndex].links || []),
            link || { label: '', url: '#' },
          ],
        };
      }
      return { config: { ...state.config, footerColumns: cols } };
    }),

  removeFooterLink: (colIndex, linkIndex) =>
    set((state) => {
      const cols = [...(state.config.footerColumns || [])];
      if (cols[colIndex]) {
        const links = [...cols[colIndex].links];
        links.splice(linkIndex, 1);
        cols[colIndex] = { ...cols[colIndex], links };
      }
      return { config: { ...state.config, footerColumns: cols } };
    }),

  updateFooterLink: (colIndex, linkIndex, partial) =>
    set((state) => {
      const cols = [...(state.config.footerColumns || [])];
      if (cols[colIndex] && cols[colIndex].links[linkIndex]) {
        const links = [...cols[colIndex].links];
        links[linkIndex] = { ...links[linkIndex], ...partial };
        cols[colIndex] = { ...cols[colIndex], links };
      }
      return { config: { ...state.config, footerColumns: cols } };
    }),

  // ─── Social Links Management ──────────────────────────
  addSocialLink: (link) =>
    set((state) => ({
      config: {
        ...state.config,
        socialLinks: [
          ...(state.config.socialLinks || []),
          link || { platform: 'twitter' as const, url: '#' },
        ],
      },
    })),

  removeSocialLink: (index) =>
    set((state) => {
      const links = [...(state.config.socialLinks || [])];
      links.splice(index, 1);
      return { config: { ...state.config, socialLinks: links } };
    }),

  updateSocialLink: (index, partial) =>
    set((state) => {
      const links = [...(state.config.socialLinks || [])];
      if (links[index]) {
        links[index] = { ...links[index], ...partial };
      }
      return { config: { ...state.config, socialLinks: links } };
    }),

  // ─── Page Templates Management ─────────────────────
  setActiveTemplateId: (id) => set((state) => ({
    config: { ...state.config, activeTemplateId: id },
  })),

  addPageTemplate: (name, description) =>
    set((state) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const newTemplate: ThemeTemplate = {
        id: generateTemplateId(),
        name,
        description: description || `Plantilla personalizada: ${name}`,
        type: 'custom',
        slug: slug || 'custom-page',
        icon: 'Layers',
        enabled: true,
        layout: 'full-width',
        sidebarWidgets: [],
        sections: [],
        options: {},
      };
      return {
        config: {
          ...state.config,
          pageTemplates: [...(state.config.pageTemplates || []), newTemplate],
          activeTemplateId: newTemplate.id,
        },
      };
    }),

  removePageTemplate: (id) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).filter((t) => t.id !== id);
      return {
        config: {
          ...state.config,
          pageTemplates: templates,
          activeTemplateId: state.config.activeTemplateId === id ? null : state.config.activeTemplateId,
        },
      };
    }),

  updatePageTemplate: (id, partial) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) =>
        t.id === id ? { ...t, ...partial } : t,
      );
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  togglePageTemplate: (id) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) =>
        t.id === id ? { ...t, enabled: !t.enabled } : t,
      );
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  addTemplateSection: (templateId, type) =>
    set((state) => {
      const newSection = createDefaultSection(type);
      const templates = (state.config.pageTemplates || []).map((t) =>
        t.id === templateId
          ? { ...t, sections: [...(t.sections || []), newSection] }
          : t,
      );
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  removeTemplateSection: (templateId, index) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const sections = [...(t.sections || [])];
        sections.splice(index, 1);
        return { ...t, sections };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  moveTemplateSection: (templateId, fromIndex, toIndex) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const sections = [...(t.sections || [])];
        const [moved] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, moved);
        return { ...t, sections };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  updateTemplateSection: (templateId, index, partial) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const sections = [...(t.sections || [])];
        if (sections[index]) sections[index] = { ...sections[index], ...partial };
        return { ...t, sections };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  toggleTemplateSection: (templateId, index) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const sections = [...(t.sections || [])];
        if (sections[index]) sections[index] = { ...sections[index], enabled: !sections[index].enabled };
        return { ...t, sections };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  updateTemplateSectionData: (templateId, index, dataPartial) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const sections = [...(t.sections || [])];
        if (sections[index]) {
          sections[index] = {
            ...sections[index],
            data: { ...sections[index].data, ...dataPartial },
          };
        }
        return { ...t, sections };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  updateTemplateWidget: (templateId, widgetId, partial) =>
    set((state) => {
      const templates = (state.config.pageTemplates || []).map((t) => {
        if (t.id !== templateId) return t;
        const widgets = (t.sidebarWidgets || []).map((w) =>
          w.id === widgetId ? { ...w, ...partial } : w,
        );
        return { ...t, sidebarWidgets: widgets };
      });
      return { config: { ...state.config, pageTemplates: templates } };
    }),

  // Generic reorder for any array within section.data
  reorderSectionDataArray: (sectionIndex, dataKey, fromIndex, toIndex) =>
    set((state) => {
      const sections = [...(state.config.sections || [])];
      if (!sections[sectionIndex]) return state;
      const section = sections[sectionIndex];
      const arr = [...((section.data as Record<string, unknown>)[dataKey] as unknown[]) || []];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      sections[sectionIndex] = {
        ...section,
        data: { ...section.data, [dataKey]: arr },
      };
      return { config: { ...state.config, sections } };
    }),

  // Reorder cards within a tab (e.g. 'info', 'design', 'navigation', 'footer')
  reorderCards: (tab, fromIndex, toIndex) =>
    set((state) => {
      const cardOrders = { ...(state.config.cardOrders || {}) };
      const order = [...(cardOrders[tab] || [])];
      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
      cardOrders[tab] = order;
      return { config: { ...state.config, cardOrders } };
    }),

  // ─── Custom Pages CRUD ──────────────────────────────
  addPage: (name, slug) =>
    set((state) => {
      const newPage: ThemePage = {
        id: generatePageId(),
        name,
        slug: slug.replace(/^\//, '').replace(/\/$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || name.toLowerCase().replace(/\s+/g, '-'),
        sections: [],
      };
      return {
        config: {
          ...state.config,
          pages: [...(state.config.pages || []), newPage],
        },
        activePageId: newPage.id,
        activePageSectionIndex: null,
      };
    }),

  removePage: (id) =>
    set((state) => {
      const pages = (state.config.pages || []).filter((p) => p.id !== id);
      return {
        config: { ...state.config, pages },
        activePageId: state.activePageId === id ? null : state.activePageId,
        activePageSectionIndex: null,
      };
    }),

  updatePage: (id, partial) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) =>
        p.id === id ? { ...p, ...partial } : p,
      );
      return { config: { ...state.config, pages } };
    }),

  addPageSection: (pageId, type) =>
    set((state) => {
      const newSection = createDefaultSection(type);
      const pages = (state.config.pages || []).map((p) =>
        p.id === pageId
          ? { ...p, sections: [...(p.sections || []), newSection] }
          : p,
      );
      return { config: { ...state.config, pages } };
    }),

  removePageSection: (pageId, index) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) => {
        if (p.id !== pageId) return p;
        const sections = [...(p.sections || [])];
        sections.splice(index, 1);
        return { ...p, sections };
      });
      return { config: { ...state.config, pages }, activePageSectionIndex: null };
    }),

  movePageSection: (pageId, fromIndex, toIndex) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) => {
        if (p.id !== pageId) return p;
        const sections = [...(p.sections || [])];
        const [moved] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, moved);
        return { ...p, sections };
      });
      return { config: { ...state.config, pages }, activePageSectionIndex: toIndex };
    }),

  updatePageSection: (pageId, index, partial) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) => {
        if (p.id !== pageId) return p;
        const sections = [...(p.sections || [])];
        if (sections[index]) sections[index] = { ...sections[index], ...partial };
        return { ...p, sections };
      });
      return { config: { ...state.config, pages } };
    }),

  togglePageSection: (pageId, index) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) => {
        if (p.id !== pageId) return p;
        const sections = [...(p.sections || [])];
        if (sections[index]) {
          sections[index] = { ...sections[index], enabled: !sections[index].enabled };
        }
        return { ...p, sections };
      });
      return { config: { ...state.config, pages } };
    }),

  updatePageSectionData: (pageId, index, dataPartial) =>
    set((state) => {
      const pages = (state.config.pages || []).map((p) => {
        if (p.id !== pageId) return p;
        const sections = [...(p.sections || [])];
        if (sections[index]) {
          sections[index] = {
            ...sections[index],
            data: { ...sections[index].data, ...dataPartial },
          };
        }
        return { ...p, sections };
      });
      return { config: { ...state.config, pages } };
    }),
  }),
  {
    name: 'pageforge-theme-editor',
    partialize: (state) => ({ config: state.config }),
    merge: (persisted, current) => {
      const p = persisted as Partial<ThemeEditorState>;
      const persistedConfig = (p.config || {}) as Partial<ThemeEditorConfig>;
      const defaultCardOrders: Record<string, string[]> = {
        info: ['branding', 'metadata'],
        design: ['colors', 'typography', 'borders'],
        navigation: ['banner', 'preview', 'menu', 'behavior', 'quick-add'],
        footer: ['copyright', 'social', 'columns'],
      };
      return {
        ...current,
        config: {
          ...INITIAL_CONFIG,
          ...persistedConfig,
          cardOrders: persistedConfig.cardOrders || defaultCardOrders,
        },
      } as ThemeEditorState & ThemeEditorActions;
    },
  },
));
