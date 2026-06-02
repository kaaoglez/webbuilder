import { NextResponse } from 'next/server';

/**
 * GET /api/generate-plugin-schema
 *
 * Devuelve el esquema de PluginConfig para que el frontend sepa qué campos
 * enviar al llamar a POST /api/generate-plugin.
 * Todo el texto de la interfaz está en español.
 */

const DEFAULT_PLUGIN_CONFIG = {
  name: 'Mi Plugin WordPress',
  slug: 'mi-plugin',
  description: 'Un plugin de WordPress generado con PageForge',
  version: '1.0.0',
  author: 'PageForge',
  authorUri: 'https://pageforge.dev',
  textDomain: 'mi-plugin',
  pluginType: 'contact-form' as const,
  options: {},
};

const PLUGIN_TYPES = [
  {
    value: 'contact-form',
    label: 'Formulario de Contacto',
    description: 'Formulario con campos de nombre, email, asunto y mensaje. Envío por email con validación AJAX.',
    shortcode: '[pageforge_contact]',
    hasCss: true,
    hasJs: true,
  },
  {
    value: 'slider',
    label: 'Slider de Imágenes',
    description: 'Carrusel de imágenes profesional con transiciones suaves. Usa un custom post type para gestionar diapositivas.',
    shortcode: '[pageforge_slider]',
    hasCss: true,
    hasJs: true,
  },
  {
    value: 'custom-post-type',
    label: 'Custom Post Type',
    description: 'Registra un tipo de contenido personalizado con taxonomías configurables.',
    shortcode: null,
    hasCss: false,
    hasJs: false,
  },
  {
    value: 'shortcodes',
    label: 'Shortcodes Múltiples',
    description: 'Colección de shortcodes: botones, cajas, alertas, separadores y cuenta regresiva.',
    shortcode: '[pf_button], [pf_box], [pf_alert], [pf_divider], [pf_countdown]',
    hasCss: true,
    hasJs: true,
  },
  {
    value: 'widget',
    label: 'Widget de Posts Recientes',
    description: 'Widget personalizado que muestra los posts más recientes con miniaturas.',
    shortcode: null,
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'social-share',
    label: 'Botones Sociales',
    description: 'Botones para compartir en Facebook, Twitter/X, LinkedIn, WhatsApp y Pinterest. Incluye barra flotante lateral.',
    shortcode: null,
    hasCss: true,
    hasJs: true,
  },
  {
    value: 'seo',
    label: 'SEO Básico',
    description: 'Meta títulos, descripciones, Open Graph, Twitter Cards y sitemap.xml automático.',
    shortcode: null,
    hasCss: false,
    hasJs: false,
  },
  {
    value: 'google-maps',
    label: 'Google Maps',
    description: 'Inserta mapas de Google con el shortcode [pf_map]. Configurable con API key, dirección, zoom y dimensiones.',
    shortcode: '[pf_map]',
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'countdown',
    label: 'Cuenta Regresiva',
    description: 'Temporizador de cuenta regresiva con colores y título personalizables.',
    shortcode: '[pf_countdown date="2025-12-31"]',
    hasCss: true,
    hasJs: true,
  },
  {
    value: 'pricing-table',
    label: 'Tabla de Precios',
    description: 'Tabla de precios profesional con planes configurables, destacado y botones de acción.',
    shortcode: '[pf_pricing]',
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'testimonials',
    label: 'Testimonios',
    description: 'Sistema de testimonios con custom post type, valoración con estrellas y diseño en cuadrícula.',
    shortcode: '[pf_testimonials]',
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'maintenance-mode',
    label: 'Modo Mantenimiento',
    description: 'Página de mantenimiento para visitantes. Los administradores ven el sitio normalmente.',
    shortcode: null,
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'custom-login',
    label: 'Login Personalizado',
    description: 'Personaliza la página de login de WordPress: logo, colores de fondo, formulario y botón.',
    shortcode: null,
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'breadcrumbs',
    label: 'Breadcrumbs (Migas de Pan)',
    description: 'Navegación de migas de pan automática con marcado schema.org. Soporta páginas, posts, categorías, tags, archivos y 404.',
    shortcode: null,
    hasCss: true,
    hasJs: false,
  },
  {
    value: 'related-posts',
    label: 'Posts Relacionados',
    description: 'Muestra posts relacionados automáticamente al final de cada entrada. Relaciona por categoría y etiquetas.',
    shortcode: null,
    hasCss: true,
    hasJs: false,
  },
];

export async function GET() {
  return NextResponse.json({
    schema: {
      // --- Identidad del Plugin ---
      name:        { type: 'string', required: true,  label: 'Nombre del Plugin',     description: 'Nombre visible del plugin (se muestra en el panel de WP)' },
      slug:        { type: 'string', required: false, label: 'Slug del Plugin',        description: 'Identificador máquina (minúsculas, guiones). Se genera automáticamente si se deja vacío.' },
      description: { type: 'string', required: false, label: 'Descripción',            description: 'Descripción breve del plugin', default: 'Un plugin de WordPress generado con PageForge' },
      version:     { type: 'string', required: false, label: 'Versión',               description: 'Versión semántica', default: '1.0.0' },
      author:      { type: 'string', required: false, label: 'Autor',                 description: 'Nombre del autor', default: 'PageForge' },
      authorUri:   { type: 'string', required: false, label: 'URI del Autor',         description: 'Sitio web del autor' },
      textDomain:  { type: 'string', required: false, label: 'Text Domain',           description: 'Dominio de traducción (por defecto coincide con el slug)' },

      // --- Tipo de Plugin ---
      pluginType:  { type: 'string', required: true,  label: 'Tipo de Plugin',        description: 'El tipo de plugin a generar' },

      // --- Opciones Específicas ---
      options:     { type: 'object', required: false, label: 'Opciones',               description: 'Opciones específicas del tipo de plugin seleccionado' },
    },
    pluginTypes: PLUGIN_TYPES,
    defaultConfig: DEFAULT_PLUGIN_CONFIG,
  });
}
