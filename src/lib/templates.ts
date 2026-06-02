// ═══════════════════════════════════════════════════════════════
// PAGEFORGE v2 — Prebuilt Template Library
// Each template is a complete ThemeEditorConfig ready to load
// into the Zustand store with one click.
// ═══════════════════════════════════════════════════════════════

import type { ThemeSection, NavItemConfig, FooterColumn, SocialLink } from '@/lib/wp-theme-generator';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'business'
  | 'portfolio'
  | 'blog'
  | 'ecommerce'
  | 'saas'
  | 'restaurant'
  | 'medical'
  | 'education'
  | 'realestate'
  | 'legal';

export interface TemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  badge?: string;         // e.g. "Popular", "Nuevo"
  sections: ThemeSection[];
  navItems: NavItemConfig[];
  footerColumns: FooterColumn[];
  copyrightText: string;
  socialLinks: SocialLink[];
  // Design tokens
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: number;
  // Metadata
  themeName: string;
  themeSlug: string;
  themeDescription: string;
}

// ─────────────────────────────────────────────────────────────
// Category metadata
// ─────────────────────────────────────────────────────────────

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; emoji: string; count: number }[] = [
  { id: 'business', label: 'Empresa / Corporativa', emoji: '🏢', count: 2 },
  { id: 'portfolio', label: 'Portafolio', emoji: '📸', count: 2 },
  { id: 'blog', label: 'Blog / Revista', emoji: '📝', count: 2 },
  { id: 'ecommerce', label: 'Tienda en Línea', emoji: '🛒', count: 2 },
  { id: 'saas', label: 'SaaS / Tecnología', emoji: '💻', count: 2 },
  { id: 'restaurant', label: 'Restaurante / Gastronomía', emoji: '🍽️', count: 1 },
  { id: 'medical', label: 'Médico / Salud', emoji: '🏥', count: 1 },
  { id: 'education', label: 'Educación / LMS', emoji: '🎓', count: 1 },
  { id: 'realestate', label: 'Inmobiliaria', emoji: '🏠', count: 1 },
  { id: 'legal', label: 'Abogados / Legal', emoji: '⚖️', count: 1 },
];

// ─────────────────────────────────────────────────────────────
// Helper: create sections from config
// ─────────────────────────────────────────────────────────────

function s(type: ThemeSection['type'], title: string, subtitle: string, data: Record<string, any>): ThemeSection {
  return { type, enabled: true, title, subtitle, data };
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const templates: TemplateMeta[] = [
  // ─── BUSINESS / CORPORATE ─────────────────────────────────
  {
    id: 'business-pro',
    name: 'Business Pro',
    category: 'business',
    description: 'Sitio corporativo profesional con hero impactante, servicios, equipo, testimonios y CTA. Ideal para empresas medianas y grandes.',
    badge: 'Popular',
    primaryColor: '#1B4332',
    secondaryColor: '#2D6A4F',
    accentColor: '#D4A373',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans',
    borderRadius: 8,
    themeName: 'Business Pro',
    themeSlug: 'business-pro',
    themeDescription: 'Tema WordPress profesional corporativo generado por PageForge',
    sections: [
      s('hero', 'Impulsa Tu Negocio al Siguiente Nivel', 'Soluciones digitales integrales para empresas que buscan crecer', {
        title: 'Impulsa Tu Negocio al Siguiente Nivel',
        subtitle: 'Soluciones digitales integrales para empresas que buscan crecer',
        ctaText: 'Solicitar Propuesta',
        ctaLink: '#contact',
        secondaryCtaText: 'Nuestros Servicios',
        secondaryCtaLink: '#services',
        backgroundImage: '/templates/hero-business-pro.png',
        overlayOpacity: 0.65,
      }),
      s('services', 'Nuestros Servicios', 'Ofrecemos soluciones completas para tu empresa', {
        title: 'Nuestros Servicios',
        subtitle: 'Ofrecemos soluciones completas para tu empresa',
        items: [
          { icon: '📊', title: 'Consultoría Estratégica', description: 'Análisis profundo de tu negocio para identificar oportunidades de crecimiento y optimización.' },
          { icon: '💻', title: 'Desarrollo Web', description: 'Sitios web modernos, rápidos y optimizados para conversión.' },
          { icon: '📱', title: 'Marketing Digital', description: 'Estrategias de SEO, SEM y redes sociales para maximizar tu alcance.' },
          { icon: '🔒', title: 'Ciberseguridad', description: 'Protección integral de datos y sistemas contra amenazas digitales.' },
          { icon: '☁️', title: 'Soluciones en la Nube', description: 'Infraestructura en la nube escalable y segura para tu operación.' },
          { icon: '🤖', title: 'Inteligencia Artificial', description: 'Automatización y análisis inteligente para tomar mejores decisiones.' },
        ],
        columns: 3,
      }),
      s('about', 'Sobre Nosotros', 'Más de 15 años de experiencia transformando negocios', {
        title: 'Sobre Nosotros',
        subtitle: 'Más de 15 años de experiencia transformando negocios',
        image: '/templates/about-business-pro.png',
        stats: [
          { value: '500+', label: 'Clientes Satisfechos' },
          { value: '15+', label: 'Años de Experiencia' },
          { value: '98%', label: 'Tasa de Retención' },
          { value: '50+', label: 'Expertos en el Equipo' },
        ],
      }),
      s('stats', '', '', {
        items: [
          { icon: '🏆', value: '200+', label: 'Proyectos Completados' },
          { icon: '🌍', value: '12', label: 'Países Atendidos' },
          { icon: '⭐', value: '4.9/5', label: 'Calificación Promedio' },
          { icon: '🚀', value: '99.9%', label: 'Uptime Garantizado' },
        ],
      }),
      s('testimonials', 'Lo Que Dicen Nuestros Clientes', 'Historias de éxito de empresas que confiaron en nosotros', {
        title: 'Lo Que Dicen Nuestros Clientes',
        subtitle: 'Historias de éxito de empresas que confiaron en nosotros',
        testimonials: [
          { quote: 'Business Pro transformó completamente nuestra presencia digital. Nuestro tráfico web aumentó un 300% en solo 6 meses.', name: 'María García', role: 'CEO, TechStart', rating: 5 },
          { quote: 'El equipo es increíblemente profesional. Entregaron el proyecto antes del plazo y superó todas nuestras expectativas.', name: 'Carlos Rodríguez', role: 'Director de Marketing, InnovaGroup', rating: 5 },
          { quote: 'Gracias a sus soluciones de marketing digital, nuestras ventas online se duplicaron en el primer trimestre.', name: 'Ana Martínez', role: 'Fundadora, E-Shop Pro', rating: 5 },
        ],
      }),
      s('team', 'Nuestro Equipo', 'Profesionales apasionados por lo que hacen', {
        title: 'Nuestro Equipo',
        subtitle: 'Profesionales apasionados por lo que hacen',
        members: [
          { name: 'Roberto Sánchez', role: 'CEO & Fundador', bio: 'Más de 20 años liderando proyectos tecnológicos innovadores.', avatar: '/templates/avatar-business-1.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'Laura Fernández', role: 'Directora de Operaciones', bio: 'Experta en optimización de procesos empresariales.', avatar: '/templates/avatar-business-2.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'Diego Morales', role: 'CTO', bio: 'Arquitecto de software con experiencia en sistemas de gran escala.', avatar: '/templates/avatar-business-3.png', socials: [{ platform: 'linkedin', url: '#' }] },
        ],
      }),
      s('cta', '¿Listo Para Transformar Tu Empresa?', 'Agenda una consulta gratuita y descubre cómo podemos ayudarte', {
        title: '¿Listo Para Transformar Tu Empresa?',
        subtitle: 'Agenda una consulta gratuita y descubre cómo podemos ayudarte',
        ctaText: 'Agendar Consulta Gratuita',
        ctaLink: '#contact',
      }),
      s('contact', 'Contáctanos', 'Estamos listos para escucharte', {
        title: 'Contáctanos',
        subtitle: 'Estamos listos para escucharte',
        email: 'info@businesspro.com',
        phone: '+1 (555) 123-4567',
        address: 'Av. Reforma 250, Col. Juárez, CDMX, México',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Servicios', url: '#services' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Equipo', url: '#team' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#about' }, { label: 'Nuestro Equipo', url: '#team' }, { label: 'Carreras', url: '#' }] },
      { title: 'Servicios', links: [{ label: 'Consultoría', url: '#services' }, { label: 'Desarrollo Web', url: '#services' }, { label: 'Marketing Digital', url: '#services' }] },
      { title: 'Recursos', links: [{ label: 'Blog', url: '/blog' }, { label: 'Casos de Éxito', url: '#' }, { label: 'FAQ', url: '#' }] },
      { title: 'Contacto', links: [{ label: 'Ubicación', url: '#contact' }, { label: 'Email', url: '#contact' }, { label: 'Teléfono', url: '#contact' }] },
    ],
    copyrightText: 'Business Pro. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
  },
  {
    id: 'startup-hub',
    name: 'Startup Hub',
    category: 'business',
    description: 'Diseño moderno y audaz para startups tecnológicas. Landing page optimizada para conversión con secciones de características, precios y testimonios.',
    badge: 'Nuevo',
    primaryColor: '#7C3AED',
    secondaryColor: '#4F46E5',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    borderRadius: 12,
    themeName: 'Startup Hub',
    themeSlug: 'startup-hub',
    themeDescription: 'Tema WordPress de landing page para startups moderno por PageForge',
    sections: [
      s('hero', 'Construye Algo Increíble Hoy', 'La plataforma todo en uno que ayuda a las startups a lanzarse más rápido, crecer de forma inteligente y escalar sin esfuerzo.', {
        title: 'Construye Algo Increíble Hoy',
        subtitle: 'La plataforma todo en uno que ayuda a las startups a lanzarse más rápido, crecer de forma inteligente y escalar sin esfuerzo.',
        ctaText: 'Prueba Gratuita',
        ctaLink: '#pricing',
        secondaryCtaText: 'Ver Demo',
        secondaryCtaLink: '#',
        backgroundImage: '/templates/hero-startup-hub.png',
        overlayOpacity: 0.7,
      }),
      s('features', 'Todo lo que Necesitas para Triunfar', 'Funciones potentes diseñadas para acelerar tu crecimiento', {
        title: 'Todo lo que Necesitas para Triunfar',
        subtitle: 'Funciones potentes diseñadas para acelerar tu crecimiento',
        items: [
          { icon: '⚡', title: 'Velocidad Relámpago', description: 'Tiempos de carga inferiores a un segundo. Tus usuarios nunca esperan.' },
          { icon: '🛡️', title: 'Seguridad Empresarial', description: 'Cumplimiento SOC 2 con cifrado de extremo a extremo.' },
          { icon: '📈', title: 'Analítica Integrada', description: 'Paneles en tiempo real para rastrear cada métrica importante.' },
          { icon: '🔌', title: '200+ Integraciones', description: 'Conéctate con Slack, Stripe, HubSpot y más.' },
          { icon: '🤖', title: 'Impulsado por IA', description: 'Automatización inteligente que aprende de tu flujo de trabajo.' },
          { icon: '🌍', title: 'CDN Global', description: 'Sirve contenido desde más de 50 ubicaciones periféricas en todo el mundo.' },
        ],
        columns: 3,
      }),
      s('testimonials', 'Adorado por Fundadores en Todo el Mundo', 'Únete a más de 5,000 startups que ya crecen con nosotros', {
        title: 'Adorado por Fundadores en Todo el Mundo',
        subtitle: 'Únete a más de 5,000 startups que ya crecen con nosotros',
        testimonials: [
          { quote: 'Redujimos nuestro tiempo de desarrollo un 60% usando esta plataforma. Absolutamente revolucionario para nuestro equipo.', name: 'Sarah Chen', role: 'CTO, LaunchPad', rating: 5 },
          { quote: 'Solo la analítica nos ahorró $50K/año en herramientas separadas. El mejor ROI que hemos visto.', name: 'Marcus Johnson', role: 'CEO, GrowthLoop', rating: 5 },
          { quote: 'De MVP a Serie A en 8 meses. Esta plataforma fue nuestra ventaja competitiva.', name: 'Priya Patel', role: 'Fundadora, NexGen AI', rating: 5 },
        ],
      }),
      s('pricing', 'Precios Simples y Transparentes', 'Sin tarifas ocultas. Escala según creces.', {
        title: 'Precios Simples y Transparentes',
        subtitle: 'Sin tarifas ocultas. Escala según creces.',
        plans: [
          { name: 'Inicial', price: '$0', period: '/mes', features: ['Hasta 1,000 usuarios', '5 GB almacenamiento', 'Analítica básica', 'Soporte comunitario'], highlighted: false, ctaText: 'Comenzar Gratis' },
          { name: 'Crecimiento', price: '$49', period: '/mes', features: ['Hasta 50,000 usuarios', '100 GB almacenamiento', 'Analítica avanzada', 'Soporte prioritario', 'Dominio personalizado', 'Acceso API'], highlighted: true, ctaText: 'Empezar a Crecer' },
          { name: 'Escalado', price: '$199', period: '/mes', features: ['Usuarios ilimitados', '1 TB almacenamiento', 'Analítica empresarial', 'Soporte dedicado', 'Garantía SLA', 'Integraciones personalizadas', 'SSO/SAML'], highlighted: false, ctaText: 'Hablar con Ventas' },
        ],
      }),
      s('faq', 'Preguntas Frecuentes', 'Todo lo que necesitas saber', {
        title: 'Preguntas Frecuentes',
        subtitle: 'Todo lo que necesitas saber',
        items: [
          { question: '¿Hay un plan gratuito?', answer: '¡Sí! Nuestro plan Inicial es completamente gratis sin necesidad de tarjeta de crédito. Puedes actualizar en cualquier momento.' },
          { question: '¿Puedo cancelar en cualquier momento?', answer: 'Absolutamente. Sin contratos ni cargos por cancelación. Puedes cancelar tu suscripción en cualquier momento desde tu panel.' },
          { question: '¿Ofrecen planes empresariales personalizados?', answer: 'Sí, ofrecemos soluciones a medida para clientes empresariales. Contacta a nuestro equipo de ventas para una cotización personalizada.' },
          { question: '¿Qué tipo de soporte ofrecen?', answer: 'Soporte comunitario para Inicial, soporte por email prioritario para Crecimiento y gestión de cuenta dedicada para Escalado.' },
        ],
      }),
      s('cta', '¿Listo para Lanzar?', 'Comienza a construir tu startup hoy — sin tarjeta de crédito', {
        title: '¿Listo para Lanzar?',
        subtitle: 'Comienza a construir tu startup hoy — sin tarjeta de crédito',
        ctaText: 'Prueba Gratuita',
        ctaLink: '#pricing',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Funciones', url: '#features' },
      { label: 'Precios', url: '#pricing' },
      { label: 'FAQ', url: '#faq' },
    ],
    footerColumns: [
      { title: 'Producto', links: [{ label: 'Funciones', url: '#features' }, { label: 'Precios', url: '#pricing' }, { label: 'Integraciones', url: '#' }, { label: 'Novedades', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Nosotros', url: '#' }, { label: 'Blog', url: '/blog' }, { label: 'Empleo', url: '#' }] },
      { title: 'Recursos', links: [{ label: 'Documentación', url: '#' }, { label: 'Referencia API', url: '#' }, { label: 'Comunidad', url: '#' }] },
      { title: 'Legal', links: [{ label: 'Política de Privacidad', url: '#' }, { label: 'Términos de Servicio', url: '#' }] },
    ],
    copyrightText: 'Startup Hub. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'github', url: '#' },
    ],
  },

  // ─── PORTFOLIO ─────────────────────────────────────────────
  {
    id: 'portfolio-creative',
    name: 'Portfolio Creative',
    category: 'portfolio',
    description: 'Portafolio elegante y minimalista para fotógrafos, diseñadores y artistas. Galería de proyectos destacados con contacto integrado.',
    badge: 'Popular',
    primaryColor: '#1F2937',
    secondaryColor: '#6B7280',
    accentColor: '#EC4899',
    backgroundColor: '#FAFAFA',
    textColor: '#1F2937',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
    borderRadius: 4,
    themeName: 'Portfolio Creative',
    themeSlug: 'portfolio-creative',
    themeDescription: 'Tema WordPress de portafolio elegante para creativos por PageForge',
    sections: [
      s('hero', 'Visión Creativa. Impacto Real.', 'Portafolio de diseño galardonado que muestra ideas audaces y una ejecución impecable.', {
        title: 'Visión Creativa. Impacto Real.',
        subtitle: 'Portafolio de diseño galardonado que muestra ideas audaces y una ejecución impecable.',
        ctaText: 'Ver Proyectos',
        ctaLink: '#gallery',
        secondaryCtaText: 'Contacto',
        secondaryCtaLink: '#contact',
        backgroundImage: '/templates/hero-portfolio-creative.png',
        overlayOpacity: 0.6,
      }),
      s('about', 'Sobre Mí', 'Diseñadora y Directora Creativa con más de 10 años de experiencia creando experiencias digitales', {
        title: 'Sobre Mí',
        subtitle: 'Diseñadora y Directora Creativa con más de 10 años de experiencia creando experiencias digitales',
        image: '/templates/about-portfolio-creative.png',
        stats: [
          { value: '150+', label: 'Proyectos' },
          { value: '12', label: 'Premios' },
          { value: '8+', label: 'Años' },
          { value: '80+', label: 'Clientes' },
        ],
      }),
      s('gallery', 'Trabajo Seleccionado', 'Una colección curada de mis mejores proyectos en branding, web y diseño digital', {
        title: 'Trabajo Seleccionado',
        subtitle: 'Una colección curada de mis mejores proyectos en branding, web y diseño digital',
        images: [
          { src: '/templates/gallery-creative-1.png', alt: 'Brand Identity Project', caption: 'Brand Identity — Luxe Fashion' },
          { src: '/templates/gallery-creative-2.png', alt: 'Web Design Project', caption: 'Web Design — TechVault App' },
          { src: '/templates/gallery-creative-3.png', alt: 'UI/UX Project', caption: 'UI/UX — FinFlow Dashboard' },
          { src: '/templates/gallery-creative-4.png', alt: 'Print Design Project', caption: 'Print — Artisan Coffee Co.' },
          { src: '/templates/gallery-creative-5.png', alt: 'Photography Project', caption: 'Photography — Urban Series' },
          { src: '/templates/gallery-creative-6.png', alt: 'Packaging Project', caption: 'Packaging — Organic Skincare' },
        ],
        columns: 3,
      }),
      s('services', 'Lo Que Hago', 'Servicios especializados para elevar tu marca', {
        title: 'Lo Que Hago',
        subtitle: 'Servicios especializados para elevar tu marca',
        items: [
          { icon: '🎨', title: 'Identidad de Marca', description: 'Sistemas de identidad visual completos incluyendo logos, paletas de colores y guías de marca.' },
          { icon: '🖥️', title: 'Diseño Web', description: 'Sitios web responsivos y pixel-perfect que convierten visitantes en clientes.' },
          { icon: '📱', title: 'Diseño UI/UX', description: 'Interfaces centradas en el usuario para aplicaciones web y móviles.' },
          { icon: '📷', title: 'Fotografía', description: 'Fotografía profesional para productos, eventos y editorial.' },
        ],
        columns: 2,
      }),
      s('testimonials', 'Testimonios de Clientes', 'Palabras de personas con las que he tenido el placer de trabajar', {
        title: 'Testimonios de Clientes',
        subtitle: 'Palabras de personas con las que he tenido el placer de trabajar',
        testimonials: [
          { quote: 'Trabajar con esta diseñadora transformó completamente nuestra marca. La atención al detalle y la visión creativa superaron todas las expectativas.', name: 'James Mitchell', role: 'Fundador, Luxe Fashion', rating: 5 },
          { quote: 'La diseñadora más talentosa y profesional con la que he trabajado. Entregó antes del plazo con una calidad excepcional.', name: 'Sophie Laurent', role: 'CMO, TechVault', rating: 5 },
        ],
      }),
      s('contact', 'Trabajemos Juntos', '¿Tienes un proyecto en mente? Me encantaría saber más.', {
        title: 'Trabajemos Juntos',
        subtitle: '¿Tienes un proyecto en mente? Me encantaría saber más.',
        email: 'hello@creativeportfolio.com',
        phone: '+1 (555) 987-6543',
        address: 'Brooklyn, New York, USA',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Trabajo', url: '#gallery' },
      { label: 'Sobre Mí', url: '#about' },
      { label: 'Servicios', url: '#services' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Navegación', links: [{ label: 'Trabajo', url: '#gallery' }, { label: 'Sobre Mí', url: '#about' }, { label: 'Servicios', url: '#services' }, { label: 'Contacto', url: '#contact' }] },
      { title: 'Redes Sociales', links: [{ label: 'Instagram', url: '#' }, { label: 'Behance', url: '#' }, { label: 'Dribbble', url: '#' }, { label: 'LinkedIn', url: '#' }] },
    ],
    copyrightText: 'Portfolio Creative. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' },
    ],
  },
  {
    id: 'portfolio-architect',
    name: 'Architecture Studio',
    category: 'portfolio',
    description: 'Portafolio sofisticado para estudios de arquitectura e interiorismo. Grid visual impactante con secciones de proceso y servicios.',
    primaryColor: '#292524',
    secondaryColor: '#78716C',
    accentColor: '#D97706',
    backgroundColor: '#FFFBF5',
    textColor: '#292524',
    headingFont: 'Raleway',
    bodyFont: 'Source Sans Pro',
    borderRadius: 2,
    themeName: 'Architecture Studio',
    themeSlug: 'architecture-studio',
    themeDescription: 'Tema WordPress de portafolio de arquitectura sofisticado por PageForge',
    sections: [
      s('hero', 'Diseñando Espacios que Inspiran', 'Estudio de arquitectura e interiorismo galardonado creando espacios con significado desde 2008', {
        title: 'Diseñando Espacios que Inspiran',
        subtitle: 'Estudio de arquitectura e interiorismo galardonado creando espacios con significado desde 2008',
        ctaText: 'Ver Proyectos',
        ctaLink: '#gallery',
        secondaryCtaText: 'Nuestro Enfoque',
        secondaryCtaLink: '#about',
        backgroundImage: '/templates/hero-portfolio-architect.png',
        overlayOpacity: 0.55,
      }),
      s('about', 'Nuestra Filosofía', 'Creemos que la arquitectura debe servir tanto a las personas como al lugar, creando armonía entre forma y función', {
        title: 'Nuestra Filosofía',
        subtitle: 'Creemos que la arquitectura debe servir tanto a las personas como al lugar, creando armonía entre forma y función',
        image: '/templates/about-portfolio-architect.png',
        stats: [
          { value: '120+', label: 'Proyectos Completados' },
          { value: '16', label: 'Años de Experiencia' },
          { value: '8', label: 'Premios de Diseño' },
          { value: '3', label: 'Oficinas Internacionales' },
        ],
      }),
      s('gallery', 'Proyectos Destacados', 'Obras seleccionadas de encargos residenciales, comerciales y culturales', {
        title: 'Proyectos Destacados',
        subtitle: 'Obras seleccionadas de encargos residenciales, comerciales y culturales',
        images: [
          { src: '/templates/gallery-arch-1.png', alt: 'Modern Villa Project', caption: 'Casa Lumina — Modern Villa' },
          { src: '/templates/gallery-arch-2.png', alt: 'Office Tower Project', caption: 'Vertex Tower — Corporate HQ' },
          { src: '/templates/gallery-arch-3.png', alt: 'Museum Project', caption: 'Museum of Modern Arts — Gallery Wing' },
          { src: '/templates/gallery-arch-4.png', alt: 'Restaurant Interior', caption: 'Noma Restaurant — Interior Design' },
        ],
        columns: 2,
      }),
      s('services', 'Nuestros Servicios', 'Servicios de diseño integral desde el concepto hasta la entrega final', {
        title: 'Nuestros Servicios',
        subtitle: 'Servicios de diseño integral desde el concepto hasta la entrega final',
        items: [
          { icon: '📐', title: 'Diseño Arquitectónico', description: 'Diseño arquitectónico completo desde el concepto inicial hasta la documentación de construcción.' },
          { icon: '🏠', title: 'Diseño de Interiores', description: 'Espacios interiores a medida que reflejan la visión y estilo de vida únicos de nuestros clientes.' },
          { icon: '🌆', title: 'Urbanismo', description: 'Planificación maestra y diseño urbano para comunidades sostenibles y habitables.' },
          { icon: '🔄', title: 'Renovación', description: 'Restauración sensible y reutilización adaptativa de estructuras existentes.' },
        ],
        columns: 2,
      }),
      s('cta', 'Inicia Tu Proyecto', 'Creemos algo extraordinario juntos', {
        title: 'Inicia Tu Proyecto',
        subtitle: 'Creemos algo extraordinario juntos',
        ctaText: 'Agendar Consulta',
        ctaLink: '#contact',
      }),
      s('contact', 'Contáctanos', 'Nos encantaría hablar sobre tu próximo proyecto', {
        title: 'Contáctanos',
        subtitle: 'Nos encantaría hablar sobre tu próximo proyecto',
        email: 'studio@architectstudio.com',
        phone: '+1 (555) 234-5678',
        address: '450 Park Avenue, New York, NY 10022',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Proyectos', url: '#gallery' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Servicios', url: '#services' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Estudio', links: [{ label: 'Nosotros', url: '#about' }, { label: 'Equipo', url: '#' }, { label: 'Empleo', url: '#' }] },
      { title: 'Proyectos', links: [{ label: 'Residencial', url: '#' }, { label: 'Comercial', url: '#' }, { label: 'Cultural', url: '#' }] },
      { title: 'Contacto', links: [{ label: 'Email', url: '#contact' }, { label: 'Teléfono', url: '#contact' }, { label: 'Ubicación', url: '#contact' }] },
    ],
    copyrightText: 'Architecture Studio. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'facebook', url: '#' },
    ],
  },

  // ─── BLOG / MAGAZINE ───────────────────────────────────────
  {
    id: 'blog-personal',
    name: 'Personal Blog',
    category: 'blog',
    description: 'Blog personal limpio y enfocado en la lectura. Tipografía elegante, secciones de publicaciones destacadas y suscripción por correo.',
    badge: 'Popular',
    primaryColor: '#059669',
    secondaryColor: '#0D9488',
    accentColor: '#F97316',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    headingFont: 'Merriweather',
    bodyFont: 'Lato',
    borderRadius: 6,
    themeName: 'Personal Blog',
    themeSlug: 'personal-blog',
    themeDescription: 'Tema WordPress de blog personal limpio por PageForge',
    sections: [
      s('hero', 'Historias, Ideas y Reflexiones', 'Un blog personal sobre tecnología, diseño y el proceso creativo', {
        title: 'Historias, Ideas y Reflexiones',
        subtitle: 'Un blog personal sobre tecnología, diseño y el proceso creativo',
        ctaText: 'Leer el Blog',
        ctaLink: '#posts',
        secondaryCtaText: 'Suscribirse',
        secondaryCtaLink: '#cta',
        backgroundImage: '/templates/hero-blog-minimal.png',
        overlayOpacity: 0.5,
      }),
      s('features', 'Sobre lo que Escribo', 'Explorando ideas en la intersección de tecnología, diseño y vida', {
        title: 'Sobre lo que Escribo',
        subtitle: 'Explorando ideas en la intersección de tecnología, diseño y vida',
        items: [
          { icon: '💻', title: 'Tecnología', description: 'Análisis profundos sobre desarrollo de software, IA y tecnologías emergentes.' },
          { icon: '🎨', title: 'Diseño', description: 'Tendencias UI/UX, sistemas de diseño y resolución creativa de problemas.' },
          { icon: '💡', title: 'Productividad', description: 'Herramientas, hábitos y marcos de trabajo para dar lo mejor de ti.' },
        ],
        columns: 3,
      }),
      s('blog_posts', 'Últimas Publicaciones', 'Artículos publicados recientemente', {
        title: 'Últimas Publicaciones',
        subtitle: 'Artículos publicados recientemente',
      }),
      s('testimonials', 'Opiniones de los Lectores', 'Lo que los lectores dicen sobre este blog', {
        title: 'Opiniones de los Lectores',
        subtitle: 'Lo que los lectores dicen sobre este blog',
        testimonials: [
          { quote: 'Uno de los blogs de tecnología más reflexivos que he encontrado. Cada artículo vale la pena.', name: 'David Park', role: 'Ingeniero de Software', rating: 5 },
          { quote: 'Las ideas de diseño aquí han mejorado genuinamente mi trabajo. Suscrito de por vida.', name: 'Emma Wilson', role: 'Diseñadora de Producto', rating: 5 },
        ],
      }),
      s('cta', 'Suscríbete a Mi Boletín', 'Recibe nuevos artículos en tu bandeja de entrada cada semana. Sin spam, jamás.', {
        title: 'Suscríbete a Mi Boletín',
        subtitle: 'Recibe nuevos artículos en tu bandeja de entrada cada semana. Sin spam, jamás.',
        ctaText: 'Suscribirse Ahora',
        ctaLink: '#',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Blog', url: '/blog' },
      { label: 'Sobre Mí', url: '#about' },
      { label: 'Suscribirse', url: '#cta' },
    ],
    footerColumns: [
      { title: 'Categorías', links: [{ label: 'Tecnología', url: '#' }, { label: 'Diseño', url: '#' }, { label: 'Productividad', url: '#' }] },
      { title: 'Enlaces', links: [{ label: 'Sobre Mí', url: '#about' }, { label: 'Archivo', url: '#' }, { label: 'RSS', url: '#' }] },
      { title: 'Redes Sociales', links: [{ label: 'Twitter', url: '#' }, { label: 'LinkedIn', url: '#' }, { label: 'GitHub', url: '#' }] },
    ],
    copyrightText: 'Personal Blog. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
  },
  {
    id: 'magazine-news',
    name: 'News Magazine',
    category: 'blog',
    description: 'Magazine de noticias moderno con diseño editorial. Grid de contenido, categorías, y secciones de artículos destacados.',
    primaryColor: '#DC2626',
    secondaryColor: '#1F2937',
    accentColor: '#2563EB',
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
    headingFont: 'Oswald',
    bodyFont: 'Roboto',
    borderRadius: 4,
    themeName: 'News Magazine',
    themeSlug: 'news-magazine',
    themeDescription: 'Tema WordPress de revista de noticias moderna por PageForge',
    sections: [
      s('hero', 'Últimas Noticias y Análisis en Profundidad', 'Tu fuente confiable de las últimas historias, periodismo de investigación y opiniones de expertos', {
        title: 'Últimas Noticias y Análisis en Profundidad',
        subtitle: 'Tu fuente confiable de las últimas historias, periodismo de investigación y opiniones de expertos',
        ctaText: 'Leer lo Último',
        ctaLink: '#posts',
        secondaryCtaText: 'Categorías',
        secondaryCtaLink: '#',
        backgroundImage: '/templates/hero-blog-lifestyle.png',
        overlayOpacity: 0.6,
      }),
      s('features', 'Temas que Cubrimos', 'Cobertura integral en múltiples categorías', {
        title: 'Temas que Cubrimos',
        subtitle: 'Cobertura integral en múltiples categorías',
        items: [
          { icon: '🌍', title: 'Noticias Internacionales', description: 'Últimas noticias y análisis de todo el mundo.' },
          { icon: '💰', title: 'Negocios y Finanzas', description: 'Actualizaciones del mercado, política económica y perspectivas de inversión.' },
          { icon: '🔬', title: 'Ciencia y Tecnología', description: 'Innovación, descubrimientos y el futuro de la tecnología.' },
          { icon: '🎨', title: 'Cultura y Artes', description: 'Entretenimiento, música, cine y comentarios culturales.' },
          { icon: '⚽', title: 'Deportes', description: 'Resultados en vivo, análisis y entrevistas exclusivas.' },
          { icon: '🏥', title: 'Salud y Bienestar', description: 'Avances médicos, fitness y salud mental.' },
        ],
        columns: 3,
      }),
      s('blog_posts', 'Últimos Artículos', 'Mantente informado con nuestro último periodismo', {
        title: 'Últimos Artículos',
        subtitle: 'Mantente informado con nuestro último periodismo',
      }),
      s('stats', 'Nuestro Impacto', '', {
        items: [
          { icon: '📰', value: '10K+', label: 'Artículos Publicados' },
          { icon: '👁️', value: '2M+', label: 'Lectores Mensuales' },
          { icon: '🏆', value: '15', label: 'Premios de Periodismo' },
          { icon: '✍️', value: '50+', label: 'Colaboradores' },
        ],
      }),
      s('cta', 'Nunca te Pierdas una Historia', 'Suscríbete a nuestro boletín diario para recibir las últimas noticias en tu bandeja de entrada', {
        title: 'Nunca te Pierdas una Historia',
        subtitle: 'Suscríbete a nuestro boletín diario para recibir las últimas noticias en tu bandeja de entrada',
        ctaText: 'Suscribirse Gratis',
        ctaLink: '#',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Mundo', url: '#' },
      { label: 'Negocios', url: '#' },
      { label: 'Tecnología', url: '#' },
      { label: 'Deportes', url: '#' },
      { label: 'Cultura', url: '#' },
    ],
    footerColumns: [
      { title: 'Secciones', links: [{ label: 'Mundo', url: '#' }, { label: 'Negocios', url: '#' }, { label: 'Tecnología', url: '#' }, { label: 'Deportes', url: '#' }] },
      { title: 'Más', links: [{ label: 'Cultura', url: '#' }, { label: 'Salud', url: '#' }, { label: 'Opinión', url: '#' }, { label: 'Video', url: '#' }] },
      { title: 'Nosotros', links: [{ label: 'Nuestro Equipo', url: '#' }, { label: 'Empleo', url: '#' }, { label: 'Contacto', url: '#' }, { label: 'Publicidad', url: '#' }] },
    ],
    copyrightText: 'News Magazine. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
  },

  // ─── E-COMMERCE ────────────────────────────────────────────
  {
    id: 'ecommerce-fashion',
    name: 'Fashion Store',
    category: 'ecommerce',
    description: 'Tienda de moda elegante con estética premium. Secciones de productos destacados, categorías, testimonios de clientes.',
    badge: 'Popular',
    primaryColor: '#1F2937',
    secondaryColor: '#92400E',
    accentColor: '#B91C1C',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Poppins',
    bodyFont: 'Open Sans',
    borderRadius: 0,
    themeName: 'Fashion Store',
    themeSlug: 'fashion-store',
    themeDescription: 'Tema WordPress de e-commerce de moda premium por PageForge',
    sections: [
      s('hero', 'Colección de Nueva Temporada', 'Descubre la elegancia atemporal con nuestra selección curada de moda premium', {
        title: 'Colección de Nueva Temporada',
        subtitle: 'Descubre la elegancia atemporal con nuestra selección curada de moda premium',
        ctaText: 'Comprar Ahora',
        ctaLink: '#',
        secondaryCtaText: 'Ver Lookbook',
        secondaryCtaLink: '#gallery',
        backgroundImage: '/templates/hero-ecommerce-fashion.png',
        overlayOpacity: 0.45,
      }),
      s('features', 'Por qué Comprar con Nosotros', 'Una experiencia de compra excepcional desde la navegación hasta la entrega', {
        title: 'Por qué Comprar con Nosotros',
        subtitle: 'Una experiencia de compra excepcional desde la navegación hasta la entrega',
        items: [
          { icon: '🚚', title: 'Envío Gratis', description: 'Envío gratuito en todos los pedidos superiores a $100.' },
          { icon: '↩️', title: 'Devoluciones Fáciles', description: 'Política de devolución sin complicaciones de 30 días en todos los artículos.' },
          { icon: '🔒', title: 'Pago Seguro', description: 'Tus datos están protegidos con cifrado de nivel bancario.' },
          { icon: '💎', title: 'Calidad Premium', description: 'Cada pieza está elaborada con los mejores materiales.' },
        ],
        columns: 4,
      }),
      s('gallery', 'Productos Destacados', 'Lo mejor de nuestras últimas colecciones', {
        title: 'Productos Destacados',
        subtitle: 'Lo mejor de nuestras últimas colecciones',
        images: [
          { src: '/templates/gallery-creative-1.png', alt: 'Silk Blouse', caption: 'Silk Blouse — $189' },
          { src: '/templates/gallery-creative-2.png', alt: 'Wool Coat', caption: 'Wool Coat — $450' },
          { src: '/templates/gallery-creative-3.png', alt: 'Leather Bag', caption: 'Leather Tote — $320' },
          { src: '/templates/gallery-creative-4.png', alt: 'Cashmere Sweater', caption: 'Cashmere Sweater — $275' },
          { src: '/templates/gallery-creative-5.png', alt: 'Denim Collection', caption: 'Premium Denim — $165' },
          { src: '/templates/gallery-creative-6.png', alt: 'Accessories', caption: 'Gold Accessories — $95' },
        ],
        columns: 3,
      }),
      s('testimonials', 'Lo que Dicen Nuestros Clientes', 'Reseñas reales de amantes de la moda', {
        title: 'Lo que Dicen Nuestros Clientes',
        subtitle: 'Reseñas reales de amantes de la moda',
        testimonials: [
          { quote: 'La calidad es absolutamente impresionante. Cada pieza que he pedido ha superado mis expectativas. Ahora es mi destino de moda favorito.', name: 'Isabella Romano', role: 'Compradora Verificada', rating: 5 },
          { quote: 'Envío rápido, empaque hermoso y la ropa me queda perfectamente. ¿Qué más se puede pedir?', name: 'Charlotte Nguyen', role: 'Compradora Verificada', rating: 5 },
          { quote: 'Su servicio al cliente es excepcional. Me ayudaron a encontrar el outfit perfecto para una ocasión especial.', name: 'Victoria Hayes', role: 'Compradora Verificada', rating: 5 },
        ],
      }),
      s('cta', 'Únete a Nuestro Club VIP', 'Obtén 15% de descuento en tu primer pedido más acceso anticipado exclusivo a nuevas colecciones', {
        title: 'Únete a Nuestro Club VIP',
        subtitle: 'Obtén 15% de descuento en tu primer pedido más acceso anticipado exclusivo a nuevas colecciones',
        ctaText: 'Unirse Ahora — Es Gratis',
        ctaLink: '#',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Tienda', url: '#' },
      { label: 'Colecciones', url: '#' },
      { label: 'Nosotros', url: '#' },
      { label: 'Contacto', url: '#' },
    ],
    footerColumns: [
      { title: 'Tienda', links: [{ label: 'Novedades', url: '#' }, { label: 'Más Vendidos', url: '#' }, { label: 'Ofertas', url: '#' }, { label: 'Tarjetas Regalo', url: '#' }] },
      { title: 'Ayuda', links: [{ label: 'Info de Envío', url: '#' }, { label: 'Devoluciones', url: '#' }, { label: 'Guía de Tallas', url: '#' }, { label: 'FAQ', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Nuestra Historia', url: '#' }, { label: 'Sostenibilidad', url: '#' }, { label: 'Empleo', url: '#' }] },
    ],
    copyrightText: 'Fashion Store. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
  },
  {
    id: 'ecommerce-electronics',
    name: 'Tech Store',
    category: 'ecommerce',
    description: 'Tienda de electrónica con diseño moderno y tech. Categorías de productos, especificaciones técnicas y soporte.',
    primaryColor: '#0F172A',
    secondaryColor: '#1E40AF',
    accentColor: '#06B6D4',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    headingFont: 'Inter',
    bodyFont: 'Roboto',
    borderRadius: 8,
    themeName: 'Tech Store',
    themeSlug: 'tech-store',
    themeDescription: 'Tema WordPress de e-commerce de electrónica moderno por PageForge',
    sections: [
      s('hero', 'Tecnología de Última Generación a Tu Alcance', 'Los últimos gadgets, electrónica y dispositivos inteligentes — curados para entusiastas de la tecnología', {
        title: 'Tecnología de Última Generación a Tu Alcance',
        subtitle: 'Los últimos gadgets, electrónica y dispositivos inteligentes — curados para entusiastas de la tecnología',
        ctaText: 'Comprar Ahora',
        ctaLink: '#',
        secondaryCtaText: 'Ver Ofertas',
        secondaryCtaLink: '#',
        backgroundImage: '/templates/hero-ecommerce-tech.png',
        overlayOpacity: 0.7,
      }),
      s('features', 'Por qué Elegirnos', 'La mejor experiencia de compra tecnológica', {
        title: 'Por qué Elegirnos',
        subtitle: 'La mejor experiencia de compra tecnológica',
        items: [
          { icon: '⚡', title: 'Últimos Productos', description: 'Los lanzamientos más recientes de las mejores marcas.' },
          { icon: '✅', title: 'Autenticidad Garantizada', description: '100% productos originales con garantía completa del fabricante.' },
          { icon: '📦', title: 'Entrega Rápida', description: 'Despacho el mismo día y opciones de envío express.' },
          { icon: '🛡️', title: 'Garantía Extendida', description: 'Garantía extendida opcional en toda la electrónica.' },
        ],
        columns: 4,
      }),
      s('gallery', 'Productos Destacados', 'Lo mejor de nuestro catálogo', {
        title: 'Productos Destacados',
        subtitle: 'Lo mejor de nuestro catálogo',
        images: [
          { src: '/templates/gallery-arch-1.png', alt: 'Wireless Earbuds', caption: 'ProSound AirPods — $149' },
          { src: '/templates/gallery-arch-2.png', alt: 'Smart Watch', caption: 'UltraWatch Series 8 — $399' },
          { src: '/templates/gallery-arch-3.png', alt: 'Laptop', caption: 'ProBook 16" M3 — $1,499' },
          { src: '/templates/gallery-arch-4.png', alt: 'Wireless Speaker', caption: 'SoundMax 360 — $299' },
          { src: '/templates/gallery-creative-1.png', alt: 'Drone', caption: 'SkyView Pro 4K — $899' },
          { src: '/templates/gallery-creative-2.png', alt: 'Camera', caption: 'PixelShot Mark IV — $2,499' },
        ],
        columns: 3,
      }),
      s('testimonials', 'Reseñas de Clientes', 'Lo que los amantes de la tecnología dicen de nosotros', {
        title: 'Reseñas de Clientes',
        subtitle: 'Lo que los amantes de la tecnología dicen de nosotros',
        testimonials: [
          { quote: 'La mejor tienda de tecnología online que he encontrado. Productos originales, buenos precios y envío increíblemente rápido.', name: 'Alex Kim', role: 'Comprador Verificado', rating: 5 },
          { quote: 'Su soporte al cliente realmente conoce de tecnología. Me ayudaron a elegir el laptop correcto para mis necesidades.', name: 'Jordan Mills', role: 'Comprador Verificado', rating: 5 },
        ],
      }),
      s('faq', 'Preguntas Frecuentes y Soporte', 'Respuestas a preguntas comunes', {
        title: 'Preguntas Frecuentes y Soporte',
        subtitle: 'Respuestas a preguntas comunes',
        items: [
          { question: '¿Ofrecen envío internacional?', answer: '¡Sí! Enviamos a más de 50 países con entrega rastreada.' },
          { question: '¿Cuál es su política de devolución?', answer: 'Ofrecemos una política de devolución de 30 días para todos los artículos sin usar en su empaque original.' },
          { question: '¿Todos los productos tienen garantía?', answer: 'Sí, todos los productos incluyen la garantía completa del fabricante. También hay garantías extendidas disponibles.' },
        ],
      }),
      s('cta', 'Suscríbete para Ofertas de Tecnología', 'Obtén descuentos exclusivos y acceso anticipado a nuevos lanzamientos', {
        title: 'Suscríbete para Ofertas de Tecnología',
        subtitle: 'Obtén descuentos exclusivos y acceso anticipado a nuevos lanzamientos',
        ctaText: 'Suscribirse Gratis',
        ctaLink: '#',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Tienda', url: '#' },
      { label: 'Ofertas', url: '#' },
      { label: 'Soporte', url: '#' },
    ],
    footerColumns: [
      { title: 'Categorías', links: [{ label: 'Audio', url: '#' }, { label: 'Wearables', url: '#' }, { label: 'Laptops', url: '#' }, { label: 'Cámaras', url: '#' }] },
      { title: 'Soporte', links: [{ label: 'Centro de Ayuda', url: '#' }, { label: 'Rastrear Pedido', url: '#' }, { label: 'Devoluciones', url: '#' }, { label: 'Garantía', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Empleo', url: '#' }, { label: 'Blog', url: '#' }] },
    ],
    copyrightText: 'Tech Store. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
  },

  // ─── SAAS / TECH ───────────────────────────────────────────
  {
    id: 'saas-app',
    name: 'SaaS Landing',
    category: 'saas',
    description: 'Landing page para producto SaaS con diseño limpio. Características, precios, integraciones, testimonios y CTA de prueba gratuita.',
    primaryColor: '#2563EB',
    secondaryColor: '#7C3AED',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    borderRadius: 8,
    themeName: 'SaaS Landing',
    themeSlug: 'saas-landing',
    themeDescription: 'Tema WordPress de landing page SaaS moderna por PageForge',
    sections: [
      s('hero', 'La Forma Inteligente de Gestionar Tu Negocio', 'Plataforma todo en uno para gestión de proyectos, colaboración en equipo y analítica empresarial', {
        title: 'La Forma Inteligente de Gestionar Tu Negocio',
        subtitle: 'Plataforma todo en uno para gestión de proyectos, colaboración en equipo y analítica empresarial',
        ctaText: 'Prueba Gratuita',
        ctaLink: '#pricing',
        secondaryCtaText: 'Ver Demo',
        secondaryCtaLink: '#',
        backgroundImage: '/templates/hero-saas-platform.png',
        overlayOpacity: 0.6,
      }),
      s('features', 'Funciones Potentes', 'Todo lo que necesitas para gestionar tu negocio eficientemente', {
        title: 'Funciones Potentes',
        subtitle: 'Todo lo que necesitas para gestionar tu negocio eficientemente',
        items: [
          { icon: '📋', title: 'Gestión de Proyectos', description: 'Tableros Kanban, diagramas de Gantt y vistas de cronograma para cada proyecto.' },
          { icon: '👥', title: 'Colaboración en Equipo', description: 'Chat en tiempo real, compartir archivos y edición colaborativa de documentos.' },
          { icon: '📊', title: 'Panel de Analítica', description: 'Paneles personalizables con KPIs en tiempo real e informes automatizados.' },
          { icon: '🔗', title: '200+ Integraciones', description: 'Conéctate con Slack, GitHub, Jira, Salesforce y cientos más.' },
          { icon: '⏱️', title: 'Control de Tiempo', description: 'Rastreador de tiempo integrado con generación automática de partes de horas.' },
          { icon: '🎯', title: 'Definición de Objetivos', description: 'Seguimiento de OKRs y KPIs para alinear objetivos del equipo con metas de negocio.' },
        ],
        columns: 3,
      }),
      s('stats', 'Confianza de Equipos en Todo el Mundo', '', {
        items: [
          { icon: '🏢', value: '10,000+', label: 'Empresas' },
          { icon: '👥', value: '500K+', label: 'Usuarios' },
          { icon: '⭐', value: '4.8/5', label: 'Calificación' },
          { icon: '🌍', value: '120+', label: 'Países' },
        ],
      }),
      s('testimonials', 'Lo que Dicen los Equipos', 'Feedback real de equipos que usan nuestra plataforma', {
        title: 'Lo que Dicen los Equipos',
        subtitle: 'Feedback real de equipos que usan nuestra plataforma',
        testimonials: [
          { quote: 'Esta plataforma reemplazó 5 herramientas diferentes para nosotros. La productividad de nuestro equipo aumentó un 40% en el primer mes.', name: 'Jennifer Wu', role: 'VP Ingeniería, DataCorp', rating: 5 },
          { quote: 'La mejor herramienta de gestión de proyectos que hemos usado. Intuitiva, potente y las integraciones son perfectas.', name: 'Tomás Rivera', role: 'CTO, ScaleUp Inc.', rating: 5 },
          { quote: 'La capacitación de todo nuestro equipo tomó menos de un día. La curva de aprendizaje es prácticamente cero.', name: 'Emily Zhang', role: 'Directora de Operaciones, FlowState', rating: 5 },
        ],
      }),
      s('pricing', 'Precios Simples', 'Planes para cada tamaño de equipo', {
        title: 'Precios Simples',
        subtitle: 'Planes para cada tamaño de equipo',
        plans: [
          { name: 'Gratis', price: '$0', period: '/mes', features: ['Hasta 5 usuarios', '3 proyectos', 'Analítica básica', 'Soporte comunitario'], highlighted: false, ctaText: 'Comenzar' },
          { name: 'Pro', price: '$29', period: '/usuario/mes', features: ['Usuarios ilimitados', 'Proyectos ilimitados', 'Analítica avanzada', 'Soporte prioritario', 'Integraciones', 'Control de tiempo'], highlighted: true, ctaText: 'Prueba Gratuita' },
          { name: 'Empresarial', price: 'Personalizado', period: '', features: ['Todo en Pro', 'SSO/SAML', 'API personalizada', 'CSM dedicado', 'SLA', 'Opción on-premise'], highlighted: false, ctaText: 'Contactar Ventas' },
        ],
      }),
      s('faq', 'Preguntas Frecuentes', 'Preguntas comunes respondidas', {
        title: 'Preguntas Frecuentes',
        subtitle: 'Preguntas comunes respondidas',
        items: [
          { question: '¿Hay un plan gratuito?', answer: '¡Sí! Nuestro plan gratuito incluye hasta 5 usuarios y 3 proyectos sin límite de tiempo.' },
          { question: '¿Puedo cambiar de plan en cualquier momento?', answer: 'Absolutamente. Puedes actualizar, reducir o cancelar en cualquier momento. Los cambios se aplican de inmediato.' },
          { question: '¿Están seguros mis datos?', answer: 'Usamos cifrado AES-256, tenemos certificación SOC 2 Tipo II y realizamos auditorías de seguridad regulares.' },
          { question: '¿Ofrecen descuentos para ONG?', answer: '¡Sí! Ofrecemos 50% de descuento para organizaciones sin fines de lucro e instituciones educativas registradas.' },
        ],
      }),
      s('cta', 'Comienza Tu Prueba Gratuita Hoy', 'Únete a más de 10,000 equipos que ya usan nuestra plataforma. Sin tarjeta de crédito.', {
        title: 'Comienza Tu Prueba Gratuita Hoy',
        subtitle: 'Únete a más de 10,000 equipos que ya usan nuestra plataforma. Sin tarjeta de crédito.',
        ctaText: 'Comenzar Gratis',
        ctaLink: '#pricing',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Funciones', url: '#features' },
      { label: 'Precios', url: '#pricing' },
      { label: 'FAQ', url: '#faq' },
    ],
    footerColumns: [
      { title: 'Producto', links: [{ label: 'Funciones', url: '#features' }, { label: 'Precios', url: '#pricing' }, { label: 'Integraciones', url: '#' }, { label: 'Novedades', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Nosotros', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Empleo', url: '#' }] },
      { title: 'Recursos', links: [{ label: 'Documentación', url: '#' }, { label: 'API', url: '#' }, { label: 'Estado', url: '#' }] },
      { title: 'Legal', links: [{ label: 'Privacidad', url: '#' }, { label: 'Términos', url: '#' }, { label: 'Seguridad', url: '#' }] },
    ],
    copyrightText: 'SaaS Landing. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'github', url: '#' },
    ],
  },
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    category: 'saas',
    description: 'Landing page para herramientas de desarrolladores. Estilo dark/tech con features técnicas, documentación y pricing.',
    primaryColor: '#10B981',
    secondaryColor: '#6366F1',
    accentColor: '#F59E0B',
    backgroundColor: '#0F172A',
    textColor: '#E2E8F0',
    headingFont: 'JetBrains Mono',
    bodyFont: 'Inter',
    borderRadius: 6,
    themeName: 'Dev Tools',
    themeSlug: 'dev-tools',
    themeDescription: 'Tema WordPress de landing page de herramientas para desarrolladores por PageForge',
    sections: [
      s('hero', 'Escribe Mejor Código, Más Rápido', 'Herramientas CLI, APIs y SDKs que hacen a los desarrolladores 10x más productivos', {
        title: 'Escribe Mejor Código, Más Rápido',
        subtitle: 'Herramientas CLI, APIs y SDKs que hacen a los desarrolladores 10x más productivos',
        ctaText: 'Comenzar Gratis',
        ctaLink: '#pricing',
        secondaryCtaText: 'Ver en GitHub',
        secondaryCtaLink: '#',
        backgroundImage: '/templates/hero-saas-marketing.png',
        overlayOpacity: 0.7,
      }),
      s('features', 'Hecho para Desarrolladores', 'Herramientas diseñadas por desarrolladores, para desarrolladores', {
        title: 'Hecho para Desarrolladores',
        subtitle: 'Herramientas diseñadas por desarrolladores, para desarrolladores',
        items: [
          { icon: '⚡', title: 'CLI Relámpago', description: 'Compila, prueba y despliega con un solo comando. Sin configuración necesaria.' },
          { icon: '🔌', title: 'API Universal', description: 'APIs RESTful y GraphQL con generación automática de clientes en más de 10 lenguajes.' },
          { icon: '🧪', title: 'Testing Automático', description: 'Generación de tests con IA con más del 95% de cobertura desde el inicio.' },
          { icon: '📦', title: 'Gestor de Paquetes', description: 'Gestión universal de paquetes con resolución de dependencias y caché.' },
          { icon: '🐳', title: 'Docker Nativo', description: 'Soporte de primera clase para Docker con builds multi-stage automáticos.' },
          { icon: '📝', title: 'Docs Automáticos', description: 'Genera documentación API hermosa desde los comentarios de tu código.' },
        ],
        columns: 3,
      }),
      s('testimonials', 'Amado por Desarrolladores', 'Desde desarrolladores independientes hasta equipos de ingeniería de Fortune 500', {
        title: 'Amado por Desarrolladores',
        subtitle: 'Desde desarrolladores independientes hasta equipos de ingeniería de Fortune 500',
        testimonials: [
          { quote: 'Esta herramienta redujo nuestro tiempo de pipeline CI/CD de 45 minutos a 8 minutos. Absolutamente esencial para nuestro equipo.', name: 'Mike Chen', role: 'Staff Engineer, BigTech Co.', rating: 5 },
          { quote: 'La experiencia de desarrollo es increíble. Todo funciona desde el primer momento. La mejor herramienta de desarrollo que he usado en esta década.', name: 'Sarah Dev', role: 'Mantenedora Open Source', rating: 5 },
        ],
      }),
      s('pricing', 'Precios para Desarrolladores', 'Gratis para open source. Paga según creces.', {
        title: 'Precios para Desarrolladores',
        subtitle: 'Gratis para open source. Paga según creces.',
        plans: [
          { name: 'Hobby', price: '$0', period: '/mes', features: ['Proyectos personales ilimitados', 'Acceso CLI', 'Soporte comunitario', 'Analítica básica'], highlighted: false, ctaText: 'Instalar Ahora' },
          { name: 'Equipo', price: '$19', period: '/usuario/mes', features: ['Proyectos de equipo ilimitados', 'Integración CI/CD', 'Soporte prioritario', 'Analítica avanzada', 'SSO', 'Registros de auditoría'], highlighted: true, ctaText: 'Prueba Gratuita' },
          { name: 'Empresarial', price: 'Personalizado', period: '', features: ['Todo en Equipo', 'On-premise', 'SLA 99.99%', 'Soporte dedicado', 'Integraciones personalizadas'], highlighted: false, ctaText: 'Contáctanos' },
        ],
      }),
      s('cta', '¿Listo para 10x Tu Productividad?', 'Instala en 30 segundos. Sin tarjeta de crédito.', {
        title: '¿Listo para 10x Tu Productividad?',
        subtitle: 'Instala en 30 segundos. Sin tarjeta de crédito.',
        ctaText: 'npm install @devtools/cli',
        ctaLink: '#',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Docs', url: '#' },
      { label: 'Precios', url: '#pricing' },
      { label: 'GitHub', url: '#' },
    ],
    footerColumns: [
      { title: 'Producto', links: [{ label: 'CLI', url: '#' }, { label: 'API', url: '#' }, { label: 'SDKs', url: '#' }, { label: 'Precios', url: '#pricing' }] },
      { title: 'Recursos', links: [{ label: 'Documentación', url: '#' }, { label: 'Ejemplos', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Estado', url: '#' }] },
      { title: 'Comunidad', links: [{ label: 'GitHub', url: '#' }, { label: 'Discord', url: '#' }, { label: 'Twitter', url: '#' }] },
    ],
    copyrightText: 'Dev Tools. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'github', url: '#' },
      { platform: 'twitter', url: '#' },
    ],
  },

  // ─── RESTAURANT / FOOD ────────────────────────────────────
  {
    id: 'restaurant-elegant',
    name: 'Restaurant Elegant',
    category: 'restaurant',
    description: 'Restaurante de alta cocina con diseño sofisticado. Secciones de menú, galería de platos, reservas y testimonios.',
    primaryColor: '#78350F',
    secondaryColor: '#92400E',
    accentColor: '#D97706',
    backgroundColor: '#FFFBEB',
    textColor: '#1F2937',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
    borderRadius: 4,
    themeName: 'Restaurant Elegant',
    themeSlug: 'restaurant-elegant',
    themeDescription: 'Tema WordPress de restaurante de alta cocina por PageForge',
    sections: [
      s('hero', 'Una Experiencia Culinaria Inigualable', 'Alta cocina de campo a mesa en un ambiente íntimo con velas', {
        title: 'Una Experiencia Culinaria Inigualable',
        subtitle: 'Alta cocina de campo a mesa en un ambiente íntimo con velas',
        ctaText: 'Reservar Mesa',
        ctaLink: '#contact',
        secondaryCtaText: 'Ver Menú',
        secondaryCtaLink: '#gallery',
        backgroundImage: '/templates/hero-restaurant.png',
        overlayOpacity: 0.5,
      }),
      s('about', 'Nuestra Historia', 'Fundado en 2015, nuestra cocina celebra los mejores ingredientes locales y de temporada', {
        title: 'Nuestra Historia',
        subtitle: 'Fundado en 2015, nuestra cocina celebra los mejores ingredientes locales y de temporada',
        image: '/templates/hero-restaurant.png',
        stats: [
          { value: '15+', label: 'Años de Tradición' },
          { value: '3', label: 'Estrellas Michelin' },
          { value: '50K+', label: 'Invitados Atendidos' },
          { value: '100%', label: 'Ingredientes Locales' },
        ],
      }),
      s('gallery', 'Nuestros Platos Estrella', 'Un recorrido visual por nuestro menú de temporada', {
        title: 'Nuestros Platos Estrella',
        subtitle: 'Un recorrido visual por nuestro menú de temporada',
        images: [
          { src: '/templates/gallery-creative-1.png', alt: 'Wagyu Steak', caption: 'Wagyu A5 — Grilled to Perfection' },
          { src: '/templates/gallery-creative-2.png', alt: 'Lobster Bisque', caption: 'Maine Lobster Bisque' },
          { src: '/templates/gallery-creative-3.png', alt: 'Truffle Risotto', caption: 'Black Truffle Risotto' },
          { src: '/templates/gallery-creative-4.png', alt: 'Chocolate Soufflé', caption: 'Valrhona Chocolate Soufflé' },
          { src: '/templates/gallery-creative-5.png', alt: 'Oysters', caption: 'Fresh Oyster Selection' },
          { src: '/templates/gallery-creative-6.png', alt: 'Garden Salad', caption: 'Heirloom Tomato Garden Salad' },
        ],
        columns: 3,
      }),
      s('testimonials', 'Opiniones de Invitados', 'Lo que nuestros invitados dicen sobre su experiencia', {
        title: 'Opiniones de Invitados',
        subtitle: 'Lo que nuestros invitados dicen sobre su experiencia',
        testimonials: [
          { quote: 'Una experiencia gastronómica absolutamente inolvidable. El menú degustación fue una obra maestra de principio a fin.', name: 'Robert Chen', role: 'Crítico Gastronómico, Fine Dining Magazine', rating: 5 },
          { quote: 'El ambiente, el servicio, la comida — todo fue perfecto. Esto es alta cocina en su máximo esplendor.', name: 'Maria Santos', role: 'Invitada Verificada', rating: 5 },
        ],
      }),
      s('faq', 'Información', 'Todo lo que necesitas saber antes de tu visita', {
        title: 'Información',
        subtitle: 'Todo lo que necesitas saber antes de tu visita',
        items: [
          { question: '¿Cuál es el horario de atención?', answer: 'Martes a sábado: 6:00 PM – 11:00 PM. Brunch dominical: 11:00 AM – 3:00 PM. Lunes cerrado.' },
          { question: '¿Necesito reservar?', answer: 'Se recomienda encarecidamente la reserva, especialmente para viernes y sábados por la noche. Reserva con al menos 2 semanas de anticipación.' },
          { question: '¿Tienen opciones para restricciones alimentarias?', answer: '¡Por supuesto! Ofrecemos opciones vegetarianas, veganas, sin gluten y aptas para alergias. Por favor infórmanos al reservar.' },
        ],
      }),
      s('contact', 'Reservaciones', 'Reserva tu mesa hoy', {
        title: 'Reservaciones',
        subtitle: 'Reserva tu mesa hoy',
        email: 'reservations@restaurant.com',
        phone: '+1 (555) 111-2222',
        address: '42 Culinary Lane, Manhattan, New York, NY',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Menú', url: '#gallery' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Reseñas', url: '#testimonials' },
      { label: 'Reservar', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Restaurante', links: [{ label: 'Nuestra Historia', url: '#about' }, { label: 'Menú', url: '#gallery' }, { label: 'Eventos Privados', url: '#' }, { label: 'Tarjetas Regalo', url: '#' }] },
      { title: 'Visita', links: [{ label: 'Reservaciones', url: '#contact' }, { label: 'Cómo Llegar', url: '#contact' }, { label: 'Estacionamiento', url: '#' }] },
      { title: 'Conecta', links: [{ label: 'Instagram', url: '#' }, { label: 'Facebook', url: '#' }, { label: 'TripAdvisor', url: '#' }] },
    ],
    copyrightText: 'Restaurant Elegant. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'facebook', url: '#' },
    ],
  },

  // ─── MEDICAL / HEALTH ─────────────────────────────────────
  {
    id: 'medical-clinic',
    name: 'Medical Clinic',
    category: 'medical',
    description: 'Clínica médica profesional con diseño confiable. Especialidades, equipo médico, testimonios de pacientes y contacto con formulario.',
    primaryColor: '#0F766E',
    secondaryColor: '#115E59',
    accentColor: '#F97316',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans',
    borderRadius: 8,
    themeName: 'Clínica Médica',
    themeSlug: 'medical-clinic',
    themeDescription: 'Tema WordPress de clínica médica profesional por PageForge',
    sections: [
      s('hero', 'Tu Salud, Nuestra Prioridad', 'Cuidado compasivo respaldado por años de excelencia médica', {
        title: 'Tu Salud, Nuestra Prioridad',
        subtitle: 'Cuidado compasivo respaldado por años de excelencia médica',
        ctaText: 'Reservar Cita',
        ctaLink: '#contact',
        secondaryCtaText: 'Nuestros Servicios',
        secondaryCtaLink: '#services',
        backgroundImage: '/templates/hero-medical.png',
        overlayOpacity: 0.6,
      }),
      s('services', 'Nuestras Especialidades', 'Servicios integrales de salud para ti y tu familia', {
        title: 'Nuestras Especialidades',
        subtitle: 'Servicios integrales de salud para ti y tu familia',
        items: [
          { icon: '❤️', title: 'Cardiología', description: 'Cuidado cardíaco avanzado con imágenes diagnósticas de última generación.' },
          { icon: '🧠', title: 'Neurología', description: 'Evaluación neurológica experta y planes de tratamiento.' },
          { icon: '🦴', title: 'Ortopedia', description: 'Cuidado de articulaciones, huesos y músculos incluyendo medicina deportiva.' },
          { icon: '👶', title: 'Pediatría', description: 'Cuidado compasivo para niños desde recién nacidos hasta adolescentes.' },
          { icon: '👁️', title: 'Oftalmología', description: 'Cuidado ocular completo desde exámenes de rutina hasta procedimientos quirúrgicos.' },
          { icon: '🦷', title: 'Dermatología', description: 'Salud de la piel, dermatología cosmética y tratamientos láser.' },
        ],
        columns: 3,
      }),
      s('about', 'Sobre Nuestra Clínica', 'Sirviendo a nuestra comunidad con cuidado médico excepcional desde 2005', {
        title: 'Sobre Nuestra Clínica',
        subtitle: 'Sirviendo a nuestra comunidad con cuidado médico excepcional desde 2005',
        image: '/templates/hero-medical.png',
        stats: [
          { value: '20+', label: 'Años de Servicio' },
          { value: '30+', label: 'Especialistas' },
          { value: '100K+', label: 'Pacientes Atendidos' },
          { value: '15', label: 'Departamentos' },
        ],
      }),
      s('team', 'Nuestro Equipo Médico', 'Médicos certificados dedicados a tu bienestar', {
        title: 'Nuestro Equipo Médico',
        subtitle: 'Médicos certificados dedicados a tu bienestar',
        members: [
          { name: 'Dra. Sarah Mitchell', role: 'Directora Médica', bio: 'Internista certificada con 25 años de experiencia en medicina clínica.', avatar: '/templates/avatar-medical-1.png', socials: [] },
          { name: 'Dr. James Rodriguez', role: 'Jefe de Cirugía', bio: 'Cirujano especializado en procedimientos mínimamente invasivos.', avatar: '/templates/avatar-medical-2.png', socials: [] },
          { name: 'Dra. Priya Sharma', role: 'Jefa de Pediatría', bio: 'Especialista en pediatría con pasión por la salud y el desarrollo infantil.', avatar: '/templates/avatar-medical-3.png', socials: [] },
        ],
      }),
      s('testimonials', 'Testimonios de Pacientes', 'Historias reales de nuestros pacientes', {
        title: 'Testimonios de Pacientes',
        subtitle: 'Historias reales de nuestros pacientes',
        testimonials: [
          { quote: 'Todo el equipo me hizo sentir cómoda y cuidada. La Dra. Mitchell es verdaderamente excepcional.', name: 'Patricia Williams', role: 'Paciente', rating: 5 },
          { quote: 'Después de visitar varias clínicas, finalmente encontré una que me trata como familia. Muy recomendada.', name: 'Michael Torres', role: 'Paciente', rating: 5 },
        ],
      }),
      s('cta', '¿Necesitas Ver a un Médico?', 'Programa tu cita hoy — citas del mismo día disponibles', {
        title: '¿Necesitas Ver a un Médico?',
        subtitle: 'Programa tu cita hoy — citas del mismo día disponibles',
        ctaText: 'Reservar Cita',
        ctaLink: '#contact',
      }),
      s('contact', 'Contacto y Citas', 'Estamos aquí para ayudarte', {
        title: 'Contacto y Citas',
        subtitle: 'Estamos aquí para ayudarte',
        email: 'info@clinicamedica.com',
        phone: '+1 (555) 000-1234',
        address: '200 Boulevard de la Salud, Suite 300, Houston, TX 77001',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Servicios', url: '#services' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Médicos', url: '#team' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Servicios', links: [{ label: 'Cardiología', url: '#services' }, { label: 'Neurología', url: '#services' }, { label: 'Ortopedia', url: '#services' }, { label: 'Pediatría', url: '#services' }] },
      { title: 'Clínica', links: [{ label: 'Sobre Nosotros', url: '#about' }, { label: 'Nuestro Equipo', url: '#team' }, { label: 'Empleo', url: '#' }] },
      { title: 'Info al Paciente', links: [{ label: 'Seguros', url: '#' }, { label: 'Portal del Paciente', url: '#' }, { label: 'Facturación', url: '#' }] },
    ],
    copyrightText: 'Clínica Médica. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },

  // ─── EDUCATION / LMS ───────────────────────────────────────
  {
    id: 'education-academy',
    name: 'Online Academy',
    category: 'education',
    description: 'Academia online con diseño moderno. Catálogo de cursos, instructores, precios y testimonios de estudiantes.',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Poppins',
    bodyFont: 'Open Sans',
    borderRadius: 10,
    themeName: 'Online Academy',
    themeSlug: 'online-academy',
    themeDescription: 'Tema WordPress de academia online moderna por PageForge',
    sections: [
      s('hero', 'Aprende de los Mejores, en Cualquier Lugar', 'Cursos de clase mundial impartidos por expertos de la industria. Comienza a aprender hoy.', {
        title: 'Aprende de los Mejores, en Cualquier Lugar',
        subtitle: 'Cursos de clase mundial impartidos por expertos de la industria. Comienza a aprender hoy.',
        ctaText: 'Explorar Cursos',
        ctaLink: '#services',
        secondaryCtaText: 'Cómo Funciona',
        secondaryCtaLink: '#about',
        backgroundImage: '/templates/hero-education.png',
        overlayOpacity: 0.6,
      }),
      s('features', 'Por qué Elegir Nuestra Academia', 'Una experiencia de aprendizaje diseñada para el éxito', {
        title: 'Por qué Elegir Nuestra Academia',
        subtitle: 'Una experiencia de aprendizaje diseñada para el éxito',
        items: [
          { icon: '🎓', title: 'Cursos Certificados', description: 'Obtén certificados reconocidos al completar cada curso.' },
          { icon: '📱', title: 'Aprende en Cualquier Lugar', description: 'Accede a los cursos en cualquier dispositivo — computadora, tablet o móvil.' },
          { icon: '💬', title: 'Sesiones en Vivo', description: 'Clases interactivas en vivo con preguntas y debates en tiempo real.' },
          { icon: '🏆', title: 'Instructores Expertos', description: 'Aprende de profesionales con experiencia real en la industria.' },
        ],
        columns: 2,
      }),
      s('services', 'Cursos Populares', 'Inscríbete en nuestros programas más demandados', {
        title: 'Cursos Populares',
        subtitle: 'Inscríbete en nuestros programas más demandados',
        items: [
          { icon: '💻', title: 'Desarrollo Web Full-Stack', description: 'Programa integral de 12 semanas que cubre HTML, CSS, JavaScript, React, Node.js y más.' },
          { icon: '📊', title: 'Ciencia de Datos e IA', description: 'Domina Python, machine learning, deep learning y visualización de datos.' },
          { icon: '🎨', title: 'Diseño UX/UI', description: 'Aprende design thinking, Figma, prototipado y metodologías de investigación de usuarios.' },
          { icon: '📈', title: 'Marketing Digital', description: 'SEO, SEM, marketing en redes sociales, analítica y estrategias de crecimiento.' },
          { icon: '📱', title: 'Desarrollo de Apps Móviles', description: 'Crea apps para iOS y Android con React Native y Flutter.' },
          { icon: '☁️', title: 'Computación en la Nube', description: 'Certificaciones de AWS, Azure y GCP con laboratorios prácticos.' },
        ],
        columns: 3,
      }),
      s('stats', 'Nuestros Números', '', {
        items: [
          { icon: '📚', value: '200+', label: 'Cursos' },
          { icon: '👨‍🎓', value: '50K+', label: 'Estudiantes' },
          { icon: '👨‍🏫', value: '80+', label: 'Instructores' },
          { icon: '🏆', value: '95%', label: 'Tasa de Satisfacción' },
        ],
      }),
      s('testimonials', 'Historias de Éxito de Estudiantes', 'Descubre lo que nuestros estudiantes han logrado', {
        title: 'Historias de Éxito de Estudiantes',
        subtitle: 'Descubre lo que nuestros estudiantes han logrado',
        testimonials: [
          { quote: 'Después de completar el programa Full-Stack, conseguí mi trabajo soñado como ingeniera de software en una gran empresa tecnológica.', name: 'Andrea López', role: 'Ingeniera de Software, Google', rating: 5 },
          { quote: 'El curso de Ciencia de Datos me dio las habilidades y la confianza para hacer la transición de mi carrera hacia la IA. Experiencia que cambió mi vida.', name: 'Marcus Johnson', role: 'Científico de Datos, Meta', rating: 5 },
        ],
      }),
      s('pricing', 'Planes y Precios', 'Elige el plan que se ajuste a tus metas', {
        title: 'Planes y Precios',
        subtitle: 'Elige el plan que se ajuste a tus metas',
        plans: [
          { name: 'Curso Individual', price: '$49', period: '/curso', features: ['Acceso a un curso', 'Certificado', 'Acceso de por vida', 'Foro comunitario'], highlighted: false, ctaText: 'Inscribirse Ahora' },
          { name: 'Membresía Pro', price: '$29', period: '/mes', features: ['Todos los cursos', 'Certificados', 'Sesiones en vivo', 'Mentoría', 'Portafolio de proyectos'], highlighted: true, ctaText: 'Comenzar a Aprender' },
          { name: 'Plan Equipo', price: '$19', period: '/usuario/mes', features: ['Todo en Pro', 'Panel de equipo', 'Seguimiento de progreso', 'Controles de admin', 'Soporte prioritario'], highlighted: false, ctaText: 'Contactar Ventas' },
        ],
      }),
      s('cta', 'Comienza a Aprender Hoy', 'Únete a más de 50,000 estudiantes que ya avanzan en sus carreras', {
        title: 'Comienza a Aprender Hoy',
        subtitle: 'Únete a más de 50,000 estudiantes que ya avanzan en sus carreras',
        ctaText: 'Explorar Cursos Gratuitos',
        ctaLink: '#services',
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Cursos', url: '#services' },
      { label: 'Precios', url: '#pricing' },
      { label: 'Nosotros', url: '#about' },
    ],
    footerColumns: [
      { title: 'Academia', links: [{ label: 'Sobre Nosotros', url: '#about' }, { label: 'Empleo', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Afiliados', url: '#' }] },
      { title: 'Cursos', links: [{ label: 'Desarrollo Web', url: '#' }, { label: 'Ciencia de Datos', url: '#' }, { label: 'Diseño', url: '#' }, { label: 'Marketing', url: '#' }] },
      { title: 'Soporte', links: [{ label: 'Centro de Ayuda', url: '#' }, { label: 'Contacto', url: '#' }, { label: 'FAQ', url: '#' }] },
    ],
    copyrightText: 'Online Academy. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
  },

  // ─── REAL ESTATE ───────────────────────────────────────────
  {
    id: 'realestate-agency',
    name: 'Real Estate Agency',
    category: 'realestate',
    description: 'Inmobiliaria profesional con búsqueda de propiedades, agentes destacados, testimonios y formulario de contacto.',
    primaryColor: '#1F2937',
    secondaryColor: '#374151',
    accentColor: '#059669',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans',
    borderRadius: 6,
    themeName: 'Real Estate Agency',
    themeSlug: 'real-estate-agency',
    themeDescription: 'Tema WordPress de agencia inmobiliaria profesional por PageForge',
    sections: [
      s('hero', 'Encuentra la Casa de Tus Sueños', 'Propiedades premium en los vecindarios más exclusivos', {
        title: 'Encuentra la Casa de Tus Sueños',
        subtitle: 'Propiedades premium en los vecindarios más exclusivos',
        ctaText: 'Explorar Propiedades',
        ctaLink: '#gallery',
        secondaryCtaText: 'Contactar un Agente',
        secondaryCtaLink: '#contact',
        backgroundImage: '/templates/hero-realestate.png',
        overlayOpacity: 0.55,
      }),
      s('features', 'Por qué Elegirnos', 'Una experiencia inmobiliaria sin complicaciones', {
        title: 'Por qué Elegirnos',
        subtitle: 'Una experiencia inmobiliaria sin complicaciones',
        items: [
          { icon: '🏘️', title: 'Listados Premium', description: 'Selección curada de propiedades de lujo y desarrollos exclusivos.' },
          { icon: '📸', title: 'Tours Virtuales', description: 'Tours virtuales inmersivos 360° de cada propiedad listada.' },
          { icon: '💰', title: 'Mejores Precios del Mercado', description: 'Negociación experta para conseguirte el mejor precio posible.' },
          { icon: '📋', title: 'Soporte Legal Completo', description: 'Asistencia legal integral desde la oferta hasta el cierre.' },
        ],
        columns: 2,
      }),
      s('gallery', 'Propiedades Destacadas', 'Explora nuestros listados exclusivos', {
        title: 'Propiedades Destacadas',
        subtitle: 'Explora nuestros listados exclusivos',
        images: [
          { src: '/templates/gallery-creative-1.png', alt: 'Luxury Villa', caption: 'Ocean View Villa — 4BR/3BA — $2,450,000' },
          { src: '/templates/gallery-creative-2.png', alt: 'Modern Penthouse', caption: 'Downtown Penthouse — 3BR/2BA — $1,890,000' },
          { src: '/templates/gallery-creative-3.png', alt: 'Family Home', caption: 'Garden District Home — 5BR/4BA — $875,000' },
          { src: '/templates/gallery-creative-4.png', alt: 'Beach Condo', caption: 'Beachfront Condo — 2BR/2BA — $650,000' },
          { src: '/templates/gallery-creative-5.png', alt: 'Mountain Cabin', caption: 'Mountain Retreat — 3BR/2BA — $520,000' },
          { src: '/templates/gallery-creative-6.png', alt: 'City Loft', caption: 'Arts District Loft — 1BR/1BA — $425,000' },
        ],
        columns: 3,
      }),
      s('stats', 'Nuestro Historial', '', {
        items: [
          { icon: '🏠', value: '2,500+', label: 'Propiedades Vendidas' },
          { icon: '🤝', value: '1,800+', label: 'Familias Felices' },
          { icon: '💰', value: '$2B+', label: 'Volumen Total de Ventas' },
          { icon: '⭐', value: '4.9/5', label: 'Calificación de Clientes' },
        ],
      }),
      s('testimonials', 'Propietarios Felices', 'Historias de familias a las que hemos ayudado a encontrar la casa de sus sueños', {
        title: 'Propietarios Felices',
        subtitle: 'Historias de familias a las que hemos ayudado a encontrar la casa de sus sueños',
        testimonials: [
          { quote: 'Nuestro agente hizo que todo el proceso fuera impecable. Desde nuestra primera visita hasta el día del cierre, nos sentimos apoyados en cada paso.', name: 'La Familia Johnson', role: 'Propietarios desde 2023', rating: 5 },
          { quote: 'Encontramos nuestro condo frente a la playa en solo 2 semanas. La función de tour virtual nos ahorró mucho tiempo.', name: 'Maria y David', role: 'Propietarios desde 2024', rating: 5 },
        ],
      }),
      s('team', 'Nuestros Agentes', 'Conoce a nuestros profesionales inmobiliarios con experiencia', {
        title: 'Nuestros Agentes',
        subtitle: 'Conoce a nuestros profesionales inmobiliarios con experiencia',
        members: [
          { name: 'Amanda Richardson', role: 'Agente Senior', bio: 'Más de 15 años en bienes raíces de lujo. Productora líder durante 8 años consecutivos.', avatar: '/templates/avatar-realestate-1.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'Carlos Vega', role: 'Especialista en Propiedades', bio: 'Experto en propiedades residenciales con profundo conocimiento del mercado.', avatar: '/templates/avatar-realestate-2.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'Jennifer Park', role: 'Agente Comercial', bio: 'Especialista en propiedades comerciales y de inversión.', avatar: '/templates/avatar-realestate-3.png', socials: [{ platform: 'linkedin', url: '#' }] },
        ],
      }),
      s('cta', '¿Listo para Encontrar Tu Hogar Ideal?', 'Deja que nuestros agentes expertos te guíen en cada paso', {
        title: '¿Listo para Encontrar Tu Hogar Ideal?',
        subtitle: 'Deja que nuestros agentes expertos te guíen en cada paso',
        ctaText: 'Agendar Consulta',
        ctaLink: '#contact',
      }),
      s('contact', 'Contáctanos', 'Estamos aquí para ayudarte a encontrar la propiedad perfecta', {
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte a encontrar la propiedad perfecta',
        email: 'info@realestateagency.com',
        phone: '+1 (555) 789-0123',
        address: '100 Commerce Blvd, Suite 500, Miami, FL 33101',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Propiedades', url: '#gallery' },
      { label: 'Agentes', url: '#team' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Propiedades', links: [{ label: 'Residencial', url: '#' }, { label: 'Comercial', url: '#' }, { label: 'Lujo', url: '#' }, { label: 'Nuevos Desarrollos', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#about' }, { label: 'Nuestros Agentes', url: '#team' }, { label: 'Testimonios', url: '#testimonials' }] },
      { title: 'Contacto', links: [{ label: 'Oficina', url: '#contact' }, { label: 'Teléfono', url: '#contact' }, { label: 'Email', url: '#contact' }] },
    ],
    copyrightText: 'Real Estate Agency. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },

  // ─── LAWYER / LEGAL ───────────────────────────────────────
  {
    id: 'legal-firm',
    name: 'Legal Firm',
    category: 'legal',
    description: 'Firma de abogados con diseño profesional y confiable. Áreas de práctica, equipo de abogados, casos de éxito y consulta.',
    primaryColor: '#1E3A5F',
    secondaryColor: '#2C5282',
    accentColor: '#C9A84C',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans',
    borderRadius: 4,
    themeName: 'Legal Firm',
    themeSlug: 'legal-firm',
    themeDescription: 'Tema WordPress de firma de abogados profesional por PageForge',
    sections: [
      s('hero', 'Representación Legal con Experiencia', 'Protegiendo tus derechos con integridad, experiencia y dedicación', {
        title: 'Representación Legal con Experiencia',
        subtitle: 'Protegiendo tus derechos con integridad, experiencia y dedicación',
        ctaText: 'Consulta Gratuita',
        ctaLink: '#contact',
        secondaryCtaText: 'Áreas de Práctica',
        secondaryCtaLink: '#services',
        backgroundImage: '/templates/hero-legal.png',
        overlayOpacity: 0.65,
      }),
      s('services', 'Áreas de Práctica', 'Servicios legales integrales adaptados a tus necesidades', {
        title: 'Áreas de Práctica',
        subtitle: 'Servicios legales integrales adaptados a tus necesidades',
        items: [
          { icon: '⚖️', title: 'Derecho Corporativo', description: 'Constitución de empresas, fusiones, adquisiciones y gobernanza corporativa.' },
          { icon: '🏠', title: 'Derecho Inmobiliario', description: 'Transacciones de propiedades, disputas, arrendador-arrendatario y zonificación.' },
          { icon: '👨‍👩‍👧', title: 'Derecho Familiar', description: 'Divorcio, custodia de hijos, adopción y asuntos domésticos.' },
          { icon: '💼', title: 'Lesiones Personales', description: 'Accidentes, negligencia médica y casos de muerte por negligencia.' },
          { icon: '📊', title: 'Derecho Fiscal', description: 'Planificación fiscal, disputas, cumplimiento e impuestos internacionales.' },
          { icon: '🛡️', title: 'Defensa Criminal', description: 'DUI, delitos de drogas, delitos de cuello blanco y defensa federal.' },
        ],
        columns: 3,
      }),
      s('about', 'Sobre la Firma', 'Más de 25 años obteniendo resultados para nuestros clientes', {
        title: 'Sobre la Firma',
        subtitle: 'Más de 25 años obteniendo resultados para nuestros clientes',
        image: '/templates/hero-legal.png',
        stats: [
          { value: '25+', label: 'Años de Experiencia' },
          { value: '5,000+', label: 'Casos Atendidos' },
          { value: '95%', label: 'Tasa de Éxito' },
          { value: '$500M+', label: 'Recuperaciones Obtenidas' },
        ],
      }),
      s('team', 'Nuestros Abogados', 'Profesionales legales dedicados que luchan por ti', {
        title: 'Nuestros Abogados',
        subtitle: 'Profesionales legales dedicados que luchan por ti',
        members: [
          { name: 'Robert Blackwell, Esq.', role: 'Socio Fundador', bio: 'Graduado de Harvard Law con más de 30 años de experiencia en litigios corporativos y civiles.', avatar: '/templates/avatar-legal-1.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'Sarah Mitchell, Esq.', role: 'Socia Senior', bio: 'Especialista en derecho familiar con reputación de defensa compasiva y efectiva.', avatar: '/templates/avatar-legal-2.png', socials: [{ platform: 'linkedin', url: '#' }] },
          { name: 'David Chen, Esq.', role: 'Socio', bio: 'Fiscal convertido en abogado defensor. 98% de tasa de absolución en casos penales.', avatar: '/templates/avatar-legal-3.png', socials: [{ platform: 'linkedin', url: '#' }] },
        ],
      }),
      s('testimonials', 'Testimonios de Clientes', 'Historias de los clientes que hemos ayudado', {
        title: 'Testimonios de Clientes',
        subtitle: 'Historias de los clientes que hemos ayudado',
        testimonials: [
          { quote: 'El equipo de esta firma luchó incansablemente por nuestro caso. Su experiencia y dedicación resultaron en un acuerdo que cambió nuestra vida.', name: 'James y Mary Patterson', role: 'Clientes', rating: 5 },
          { quote: 'Profesionales, conocedores y verdaderamente compasivos. Me guiaron por el momento más difícil de mi vida con empatía.', name: 'Linda Rodriguez', role: 'Cliente', rating: 5 },
        ],
      }),
      s('faq', 'Preguntas Frecuentes Legales', 'Preguntas comunes sobre nuestros servicios legales', {
        title: 'Preguntas Frecuentes Legales',
        subtitle: 'Preguntas comunes sobre nuestros servicios legales',
        items: [
          { question: '¿Ofrecen consultas iniciales gratuitas?', answer: 'Sí, ofrecemos una consulta inicial gratuita de 30 minutos para todos los nuevos clientes. Esto nos permite entender tu situación y asesorar sobre los siguientes pasos.' },
          { question: '¿Cuáles son sus honorarios?', answer: 'Ofrecemos varios arreglos de honorarios incluyendo tarifas por hora, honorarios fijos y honorarios de contingencia según el tipo de caso. Esto se discutirá durante tu consulta.' },
          { question: '¿Cuánto dura un caso típico?', answer: 'La duración varía según la complejidad del caso. Proporcionaremos un cronograma realista durante tu consulta inicial y te mantendremos informado durante todo el proceso.' },
        ],
      }),
      s('cta', '¿Necesitas Asistencia Legal?', 'Programa una consulta gratuita con uno de nuestros abogados experimentados', {
        title: '¿Necesitas Asistencia Legal?',
        subtitle: 'Programa una consulta gratuita con uno de nuestros abogados experimentados',
        ctaText: 'Programar Consulta Gratuita',
        ctaLink: '#contact',
      }),
      s('contact', 'Contáctanos', 'Estamos listos para defender tus derechos', {
        title: 'Contáctanos',
        subtitle: 'Estamos listos para defender tus derechos',
        email: 'info@legalfirm.com',
        phone: '+1 (555) 333-4444',
        address: '500 Justice Avenue, Suite 1200, Washington, DC 20001',
        showForm: true,
      }),
    ],
    navItems: [
      { label: 'Inicio', url: '/' },
      { label: 'Áreas de Práctica', url: '#services' },
      { label: 'Nosotros', url: '#about' },
      { label: 'Abogados', url: '#team' },
      { label: 'Contacto', url: '#contact' },
    ],
    footerColumns: [
      { title: 'Áreas de Práctica', links: [{ label: 'Derecho Corporativo', url: '#services' }, { label: 'Derecho Familiar', url: '#services' }, { label: 'Lesiones Personales', url: '#services' }, { label: 'Defensa Criminal', url: '#services' }] },
      { title: 'Firma', links: [{ label: 'Sobre Nosotros', url: '#about' }, { label: 'Nuestros Abogados', url: '#team' }, { label: 'Resultados', url: '#' }] },
      { title: 'Contacto', links: [{ label: 'Oficina', url: '#contact' }, { label: 'Teléfono', url: '#contact' }, { label: 'Email', url: '#contact' }] },
    ],
    copyrightText: 'Legal Firm. Todos los derechos reservados.',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
    ],
  },
];

export default templates;
