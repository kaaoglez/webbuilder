import { create } from 'zustand';
import type { PluginType } from '@/lib/wp-plugin-generator';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface PluginConfig {
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  authorUri: string;
  textDomain: string;
  pluginType: PluginType;
  options: Record<string, unknown>;
}

type PluginEditorTab = 'info' | 'type' | 'options' | 'generate';

interface PluginEditorState {
  config: PluginConfig;
  activeTab: PluginEditorTab;
  isGenerating: boolean;
}

interface PluginEditorActions {
  replaceConfig: (fullConfig: Partial<PluginConfig>) => void;
  updateConfig: (partial: Partial<PluginConfig>) => void;
  setPluginType: (type: PluginType) => void;
  updateOption: (key: string, value: unknown) => void;
  updateOptions: (opts: Record<string, unknown>) => void;
  setGenerating: (v: boolean) => void;
  setActiveTab: (tab: PluginEditorTab) => void;
  resetConfig: () => void;
}

// ─────────────────────────────────────────────────────────────
// Default Options per Plugin Type
// ─────────────────────────────────────────────────────────────

export function getDefaultOptions(pluginType: PluginType): Record<string, unknown> {
  switch (pluginType) {
    case 'contact-form':
      return {
        recipientEmail: 'admin@example.com',
        subject: 'Nuevo mensaje de contacto',
        fields: ['name', 'email', 'subject', 'message'],
        successMessage: 'Mensaje enviado correctamente',
        buttonLabel: 'Enviar',
      };

    case 'slider':
      return {
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        dots: true,
        infinite: true,
        slidesPerView: 1,
        maxHeight: '500px',
      };

    case 'custom-post-type':
      return {
        postTypeName: 'Productos',
        postTypeSlug: 'products',
        supports: ['title', 'editor', 'thumbnail', 'excerpt'],
        public: true,
        hasArchive: true,
        showInRest: true,
        menuIcon: 'dashicons-cart',
        labels: {
          singular: 'Producto',
          plural: 'Productos',
        },
      };

    case 'shortcodes':
      return {
        enableButton: true,
        enableBox: true,
        enableAlert: true,
        enableDivider: true,
        enableCountdown: true,
      };

    case 'widget':
      return {
        title: 'Posts Recientes',
        postCount: 5,
        showThumbnail: true,
        showDate: true,
        showExcerpt: false,
        excerptLength: 50,
      };

    case 'social-share':
      return {
        platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp'],
        position: 'bottom',
        showCount: false,
        floatingSidebar: true,
      };

    case 'seo':
      return {
        metaTitle: '',
        metaDescription: '',
        enableOpenGraph: true,
        enableSitemap: true,
        sitemapInterval: 'daily',
        excludePages: '',
      };

    case 'google-maps':
      return {
        apiKey: '',
        address: '',
        zoom: 15,
        width: '100%',
        height: '400px',
        mapType: 'roadmap',
      };

    case 'countdown':
      return {
        date: '2025-12-31 23:59:59',
        title: 'Cuenta Regresiva',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        theme: 'modern',
      };

    case 'pricing-table':
      return {
        plans: [
          {
            name: 'Básico',
            price: '$9',
            period: '/mes',
            features: ['Característica 1', 'Característica 2', 'Característica 3'],
            highlighted: false,
            buttonLabel: 'Comenzar',
          },
          {
            name: 'Pro',
            price: '$29',
            period: '/mes',
            features: ['Todo lo anterior', 'Soporte prioritario', 'Acceso API'],
            highlighted: true,
            buttonLabel: 'Elegir Pro',
          },
          {
            name: 'Empresarial',
            price: '$99',
            period: '/mes',
            features: [
              'Todo lo anterior',
              'SLA garantizado',
              'Soporte 24/7',
              'Cuenta dedicada',
            ],
            highlighted: false,
            buttonLabel: 'Contactar',
          },
        ],
        columns: 3,
      };

    case 'testimonials':
      return {
        title: 'Lo que dicen nuestros clientes',
        columns: 3,
        showStars: true,
        showRole: true,
        maxCount: 6,
      };

    case 'maintenance-mode':
      return {
        enabled: false,
        title: 'Sitio en Mantenimiento',
        message:
          'Estamos trabajando para mejorar nuestro sitio. Vuelve pronto.',
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff',
        adminBypass: true,
      };

    case 'custom-login':
      return {
        logoUrl: '',
        backgroundColor: '#ffffff',
        formBackgroundColor: '#ffffff',
        buttonColor: '#2563EB',
        buttonTextColor: '#ffffff',
        linkColor: '#2563EB',
        showCustomLogo: false,
      };

    case 'breadcrumbs':
      return {
        separator: '›',
        showHome: true,
        homeLabel: 'Inicio',
        showCurrent: true,
        maxDepth: 3,
      };

    case 'related-posts':
      return {
        count: 3,
        showThumbnail: true,
        showExcerpt: true,
        excerptLength: 100,
        title: 'Posts Relacionados',
        matchBy: 'category',
      };

    default:
      return {};
  }
}

// ─────────────────────────────────────────────────────────────
// Plugin Type Metadata (all labels in Spanish)
// ─────────────────────────────────────────────────────────────

export const PLUGIN_TYPES: Array<{
  value: PluginType;
  label: string;
  description: string;
  icon: string;
  hasShortcode: boolean;
  shortcode?: string;
  hasSettings: boolean;
}> = [
  {
    value: 'contact-form',
    label: 'Formulario de Contacto',
    description:
      'Formulario profesional con validación AJAX, envío por email y diseño responsive.',
    icon: '📧',
    hasShortcode: true,
    shortcode: '[pageforge_contact]',
    hasSettings: false,
  },
  {
    value: 'slider',
    label: 'Slider de Imágenes',
    description:
      'Crea sliders de imágenes con transiciones suaves. Gestión desde el panel de administración.',
    icon: '🖼️',
    hasShortcode: true,
    shortcode: '[pageforge_slider]',
    hasSettings: false,
  },
  {
    value: 'custom-post-type',
    label: 'Tipo de Contenido Personalizado',
    description:
      'Registra custom post types y taxonomías personalizadas en WordPress.',
    icon: '📋',
    hasShortcode: false,
    hasSettings: false,
  },
  {
    value: 'shortcodes',
    label: 'Colección de Shortcodes',
    description:
      'Botones, cajas, alertas, separadores y cuenta regresiva como shortcodes.',
    icon: '🏷️',
    hasShortcode: true,
    shortcode: '[pf_button] [pf_box] [pf_alert]',
    hasSettings: false,
  },
  {
    value: 'widget',
    label: 'Widget de Posts Recientes',
    description:
      'Muestra los posts más recientes con miniaturas en el sidebar.',
    icon: '📌',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'social-share',
    label: 'Botones de Redes Sociales',
    description:
      'Comparte en Facebook, Twitter, LinkedIn y WhatsApp. Barra flotante opcional.',
    icon: '🔗',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'seo',
    label: 'SEO Básico',
    description:
      'Meta tags, Open Graph, Twitter Cards y sitemap XML automático.',
    icon: '🔍',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'google-maps',
    label: 'Google Maps',
    description:
      'Inserta mapas de Google con shortcode. Configura dirección y zoom.',
    icon: '🗺️',
    hasShortcode: true,
    shortcode: '[pf_map]',
    hasSettings: true,
  },
  {
    value: 'countdown',
    label: 'Cuenta Regresiva',
    description:
      'Temporizador de cuenta regresiva con diseños personalizables.',
    icon: '⏳',
    hasShortcode: true,
    shortcode: '[pf_countdown]',
    hasSettings: false,
  },
  {
    value: 'pricing-table',
    label: 'Tabla de Precios',
    description:
      'Tablas de precios profesionales con planes destacados y botones de acción.',
    icon: '💰',
    hasShortcode: true,
    shortcode: '[pf_pricing]',
    hasSettings: true,
  },
  {
    value: 'testimonials',
    label: 'Testimonios',
    description:
      'Sección de testimonios con estrellas, rol del autor y diseño en columnas.',
    icon: '⭐',
    hasShortcode: true,
    shortcode: '[pf_testimonials]',
    hasSettings: false,
  },
  {
    value: 'maintenance-mode',
    label: 'Modo Mantenimiento',
    description:
      'Página de mantenimiento con bypass para administradores. Colores personalizables.',
    icon: '🔧',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'custom-login',
    label: 'Página de Login Personalizada',
    description:
      'Personaliza la página de login de WordPress: logo, colores y fondo.',
    icon: '🔐',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'breadcrumbs',
    label: 'Migas de Pan (Breadcrumbs)',
    description:
      'Ruta de navegación con soporte schema.org para SEO. Personalizable.',
    icon: '🧭',
    hasShortcode: false,
    hasSettings: true,
  },
  {
    value: 'related-posts',
    label: 'Posts Relacionados',
    description:
      'Muestra posts relacionados por categoría o etiqueta con thumbnails.',
    icon: '📖',
    hasShortcode: false,
    hasSettings: true,
  },
];

// ─────────────────────────────────────────────────────────────
// Default Config
// ─────────────────────────────────────────────────────────────

function createInitialConfig(): PluginConfig {
  return {
    name: 'Mi Plugin WordPress',
    slug: 'mi-plugin',
    description: 'Un plugin de WordPress generado con PageForge',
    version: '1.0.0',
    author: 'PageForge',
    authorUri: 'https://pageforge.dev',
    textDomain: 'mi-plugin',
    pluginType: 'contact-form',
    options: getDefaultOptions('contact-form'),
  };
}

const INITIAL_CONFIG = createInitialConfig();

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const usePluginEditorStore = create<PluginEditorState & PluginEditorActions>()(
  (set) => ({
    // State
    config: INITIAL_CONFIG,
    activeTab: 'info',
    isGenerating: false,

    // Actions
    replaceConfig: (fullConfig) =>
      set(() => ({
        config: { ...createInitialConfig(), ...fullConfig },
        activeTab: 'info' as PluginEditorTab,
        isGenerating: false,
      })),

    setActiveTab: (tab) => set({ activeTab: tab }),

    setGenerating: (v) => set({ isGenerating: v }),

    updateConfig: (partial) =>
      set((state) => ({
        config: { ...state.config, ...partial },
      })),

    setPluginType: (type) =>
      set((state) => ({
        config: {
          ...state.config,
          pluginType: type,
          options: getDefaultOptions(type),
        },
      })),

    updateOption: (key, value) =>
      set((state) => ({
        config: {
          ...state.config,
          options: { ...state.config.options, [key]: value },
        },
      })),

    updateOptions: (opts) =>
      set((state) => ({
        config: {
          ...state.config,
          options: { ...state.config.options, ...opts },
        },
      })),

    resetConfig: () =>
      set({
        config: createInitialConfig(),
        activeTab: 'info',
        isGenerating: false,
      }),
  }),
);
