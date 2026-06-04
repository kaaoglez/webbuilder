// ═══════════════════════════════════════════════════════════════
// PAGEFORGE v2 — Template Library Data
// Pre-built, industry-specific template configurations that users
// can select as starting points for their WordPress themes.
// ═══════════════════════════════════════════════════════════════

import type { PluginType } from '@/lib/wp-plugin-generator';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface TemplatePreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  template: string;
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    borderRadius: number;
    style: string;
  };
  sections: Array<{
    type: string;
    title: string;
    enabled: boolean;
    data: Record<string, unknown>;
  }>;
  recommendedPlugins: string[];
  tags: string[];
}

// ─────────────────────────────────────────────────────────────
// Unsplash Image URLs (real, curated)
// ─────────────────────────────────────────────────────────────

const IMG = {
  // Restaurant
  restaurantInterior:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
  restaurantFood1:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
  restaurantFood2:
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
  restaurantFood3:
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
  restaurantFood4:
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop',
  restaurantFood5:
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
  restaurantFood6:
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop',
  restaurantChef:
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=400&fit=crop',

  // Portfolio / Creative
  creativeOffice:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
  portfolioProject1:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  portfolioProject2:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  portfolioProject3:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  portfolioProject4:
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
  portfolioProject5:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  portfolioProject6:
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',

  // SaaS / Tech
  techAbstract:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop',
  techDashboard:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',

  // Agency
  agencyOffice:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
  agencyWork1:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  agencyWork2:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  agencyWork3:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  agencyWork4:
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',
  agencyWork5:
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
  agencyWork6:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',

  // E-Commerce
  fashionHero:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
  product1:
    'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&h=400&fit=crop',
  product2:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
  product3:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
  product4:
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=400&fit=crop',
  product5:
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
  product6:
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=400&fit=crop',

  // Blog
  workspaceHero:
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop',
  articleCover1:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
  articleCover2:
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop',
  articleCover3:
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',
  articleCover4:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
  articleCover5:
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
  articleCover6:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',

  // Landing / Startup
  abstractHero:
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop',
  startupFounders:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE PRESETS
// ═══════════════════════════════════════════════════════════════

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. RESTAURANTE — "La Casa del Sabor"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'restaurante',
    name: 'Restaurante',
    subtitle: 'La Casa del Sabor',
    description:
      'Plantilla elegante para restaurantes, bares y cafeterías. Diseñada para resaltar tu carta, crear reservas online y cautivar comensales con fotografías apetitosas.',
    category: 'Restaurantes',
    icon: '🍽️',
    template: 'restaurant',
    themeConfig: {
      primaryColor: '#B45309',
      secondaryColor: '#92400E',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
      textColor: '#422006',
      headingFont: 'Playfair Display',
      bodyFont: 'Lora',
      borderRadius: 12,
      style: 'elegant',
    },
    sections: [
      {
        type: 'hero',
        title: 'Bienvenido a La Casa del Sabor',
        enabled: true,
        data: {
          title: 'Bienvenido a La Casa del Sabor',
          subtitle:
            'Donde cada platillo cuenta una historia de tradición, pasión y los mejores ingredientes de la tierra.',
          ctaText: 'Reservar una Mesa',
          ctaLink: '#contacto',
          secondaryCtaText: 'Ver la Carta',
          secondaryCtaLink: '#carta',
          backgroundImage: IMG.restaurantInterior,
          overlayOpacity: 0.55,
        },
      },
      {
        type: 'features',
        title: 'Nuestros Servicios',
        enabled: true,
        data: {
          title: 'Nuestros Servicios',
          subtitle:
            'Descubre todo lo que La Casa del Sabor tiene para ofrecerte',
          items: [
            {
              icon: '🥘',
              title: 'Entrantes Exquisitos',
              description:
                'Selección de tapas y entrantes elaborados con ingredientes frescos del mercado local, perfectos para compartir.',
            },
            {
              icon: '🍖',
              title: 'Platos Principales',
              description:
                'Cortes premium, pescados del día y opciones vegetarianas preparadas con técnicas de cocina contemporánea.',
            },
            {
              icon: '🍰',
              title: 'Postres Artesanales',
              description:
                'Creaciones dulces elaboradas diariamente por nuestro pastelero, desde clásicos hasta innovaciones de autor.',
            },
            {
              icon: '🍷',
              title: 'Carta de Vinos',
              description:
                'Más de 80 referencias de vinos nacionales e internacionales, cuidadosamente seleccionados por nuestro sumiller.',
            },
            {
              icon: '🥐',
              title: 'Brunch de Fin de Semana',
              description:
                'Todos los sábados y domingos, disfruta de nuestro brunch con jugos naturales, pastas y opciones dulces y saladas.',
            },
            {
              icon: '🎉',
              title: 'Eventos Privados',
              description:
                'Salón privado para cumpleaños, cenas de empresa y celebraciones especiales. Menús personalizados disponibles.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'about',
        title: 'Nuestra Historia',
        enabled: true,
        data: {
          title: 'Nuestra Historia',
          subtitle:
            'Fundada en 2016 por el Chef Andrés Morales, La Casa del Sabor nació del sueño de crear un espacio donde la tradición culinaria mexicana se encuentre con la innovación gastronómica internacional. Cada ingrediente es seleccionado con esmero de productores locales, y cada platillo es una obra de arte pensada para deleitar todos los sentidos.',
          image: IMG.restaurantChef,
          stats: [
            { value: '8+', label: 'Años de Trayectoria' },
            { value: '15,000+', label: 'Clientes Satisfechos' },
            { value: '3', label: 'Premios Gastronómicos' },
            { value: '12', label: 'Chefs Especializados' },
          ],
        },
      },
      {
        type: 'testimonials',
        title: 'Lo que Dicen los Críticos',
        enabled: true,
        data: {
          title: 'Lo que Dicen los Críticos',
          subtitle: 'Opiniones de los paladares más exigentes',
          testimonials: [
            {
              quote:
                'La Casa del Sabor es, sin exagerar, el mejor restaurante de cocina fusión que he visitado en los últimos cinco años. El ceviche de camarón y el risotto de hongos silvestres son piezas maestras.',
              name: 'María Fernanda López',
              role: 'Crítica Gastronómica — Revista Sabores',
              rating: 5,
            },
            {
              quote:
                'Una experiencia completa: desde la atención impecable hasta la presentación impecable de cada platillo. La carta de postres es simplemente adictiva. Mi favorito: la tarta de chocolate con coulis de frambuesa.',
              name: 'Carlos Eduardo Ríos',
              role: 'Food Blogger — El Paladar Fino',
              rating: 5,
            },
            {
              quote:
                'El servicio es de cinco estrellas y los precios son sorprendentemente justos para la calidad que ofrecen. El menú degustación de 7 tiempos es una experiencia que todo amante de la buena mesa debe vivir.',
              name: 'Ana Lucía Martínez',
              role: 'Periodista Culnaria — El Universal Gourmet',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'gallery',
        title: 'Nuestras Especialidades',
        enabled: true,
        data: {
          title: 'Nuestras Especialidades',
          subtitle: 'Un vistazo visual a nuestras creaciones culinarias',
          images: [
            { src: IMG.restaurantFood1, alt: 'Ensalada Mediterránea con queso de cabra', caption: 'Ensalada Mediterránea' },
            { src: IMG.restaurantFood2, alt: 'Bowls saludables con salmón', caption: 'Bowl de Salmón Fresh' },
            { src: IMG.restaurantFood3, alt: 'Pizza artesanal del horno de leña', caption: 'Pizza Margherita Artesanal' },
            { src: IMG.restaurantFood4, alt: 'Tacos gourmet de cochinita pibil', caption: 'Tacos Gourmet' },
            { src: IMG.restaurantFood5, alt: 'Plato de pasta trufa y parmesano', caption: 'Pasta con Trufa Negra' },
            { src: IMG.restaurantFood6, alt: 'Frutas frescas como postre', caption: 'Frutas de Temporada' },
          ],
          columns: 3,
        },
      },
      {
        type: 'contact',
        title: 'Reservaciones y Contacto',
        enabled: true,
        data: {
          title: 'Reservaciones y Contacto',
          subtitle:
            'Reserva tu mesa y déjanos sorprenderte con una experiencia gastronómica inolvidable.',
          email: 'reservaciones@lacasadelsabor.com',
          phone: '+52 55 1234 5678',
          address: 'Av. Reforma 512, Col. Juárez, CDMX, México',
          showForm: true,
        },
      },
      {
        type: 'cta',
        title: '¿Listo para una Experiencia Única?',
        enabled: true,
        data: {
          title: '¿Listo para una Experiencia Única?',
          subtitle:
            'Reserva hoy y descubre por qué somos el restaurante favorito de la ciudad. Te esperamos con los brazos abiertos y los fogones encendidos.',
          ctaText: 'Reservar Ahora',
          ctaLink: '#contacto',
        },
      },
    ],
    recommendedPlugins: ['contact-form', 'google-maps', 'testimonials'],
    tags: ['negocio', 'restaurante', 'gastronomía', 'local'],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. PORTAFOLIO — "Studio Creativo"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'portafolio',
    name: 'Portafolio',
    subtitle: 'Studio Creativo',
    description:
      'Plantilla audaz y moderna para diseñadores, fotógrafos y creativos. Muestra tu trabajo con una galería impactante y una estética que habla por sí misma.',
    category: 'Creativo',
    icon: '🎨',
    template: 'portfolio',
    themeConfig: {
      primaryColor: '#DC2626',
      secondaryColor: '#1E1E1E',
      accentColor: '#FBBF24',
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      borderRadius: 8,
      style: 'bold',
    },
    sections: [
      {
        type: 'hero',
        title: 'Creamos Marca, Creamos Impacto',
        enabled: true,
        data: {
          title: 'Creamos Marca,\nCreamos Impacto',
          subtitle:
            'Estudio creativo especializado en diseño gráfico, branding y experiencias digitales que conectan con las personas.',
          ctaText: 'Ver Portafolio',
          ctaLink: '#proyectos',
          secondaryCtaText: 'Conocer al Equipo',
          secondaryCtaLink: '#equipo',
          backgroundImage: IMG.creativeOffice,
          overlayOpacity: 0.6,
        },
      },
      {
        type: 'features',
        title: 'Nuestros Servicios',
        enabled: true,
        data: {
          title: 'Nuestros Servicios',
          subtitle: 'Soluciones creativas integrales para tu marca',
          items: [
            {
              icon: '✏️',
              title: 'Diseño de Marca',
              description:
                'Creación de identidades visuales completas: logotipos, paletas de color, tipografías y manuales de marca.',
            },
            {
              icon: '📱',
              title: 'Diseño UI/UX',
              description:
                'Interfaces intuitivas y atractivas para aplicaciones móviles y web, centradas en la experiencia del usuario.',
            },
            {
              icon: '🌐',
              title: 'Desarrollo Web',
              description:
                'Sitios web modernos, rápidos y responsivos que convierten visitantes en clientes.',
            },
            {
              icon: '📸',
              title: 'Fotografía Profesional',
              description:
                'Sesiones fotográficas de producto, food styling y fotografía corporativa de alta calidad.',
            },
            {
              icon: '🎬',
              title: 'Motion Graphics',
              description:
                'Animaciones y videos cortos que dan vida a tu marca en redes sociales y presentaciones.',
            },
            {
              icon: '📦',
              title: 'Packaging',
              description:
                'Diseño de empaques y packaging que destacan en el anaquel y comunican la esencia de tu producto.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'gallery',
        title: 'Proyectos Destacados',
        enabled: true,
        data: {
          title: 'Proyectos Destacados',
          subtitle: 'Una selección de nuestro trabajo más reciente',
          images: [
            { src: IMG.portfolioProject1, alt: 'Branding para Corporación XYZ', caption: 'Branding Corp XYZ' },
            { src: IMG.portfolioProject2, alt: 'App de finanzas personales FinTrack', caption: 'App FinTrack' },
            { src: IMG.portfolioProject3, alt: 'Tienda online Moda Ética', caption: 'E-Commerce Moda Ética' },
            { src: IMG.portfolioProject4, alt: 'Identidad visual para startup', caption: 'Startup ID Visual' },
            { src: IMG.portfolioProject5, alt: 'Rediseño de packaging orgánico', caption: 'Packaging Orgánico' },
            { src: IMG.portfolioProject6, alt: 'Dashboard UI para SaaS', caption: 'Dashboard SaaS' },
          ],
          columns: 3,
        },
      },
      {
        type: 'stats',
        title: 'Nuestros Números',
        enabled: true,
        data: {
          title: '',
          items: [
            { icon: '📁', value: '120+', label: 'Proyectos Completados' },
            { icon: '🤝', value: '45+', label: 'Clientes Globales' },
            { icon: '🏆', value: '8', label: 'Premios de Diseño' },
            { icon: '📅', value: '6', label: 'Años de Experiencia' },
          ],
        },
      },
      {
        type: 'testimonials',
        title: 'Lo que Dicen Nuestros Clientes',
        enabled: true,
        data: {
          title: 'Lo que Dicen Nuestros Clientes',
          subtitle: 'Relaciones que construyen marcas',
          testimonials: [
            {
              quote:
                'Studio Creativo transformó completamente la imagen de nuestra empresa. El nuevo logo y la identidad visual aumentaron el reconocimiento de marca en un 300% en solo 6 meses.',
              name: 'Roberto Guzmán',
              role: 'CEO — TechVentures MX',
              rating: 5,
            },
            {
              quote:
                'Profesionales desde la primera reunión. Entendieron nuestra visión y la llevaron más allá de lo que imaginábamos. El sitio web que crearon es una obra maestra.',
              name: 'Isabella Torres',
              role: 'Directora de Marketing — Moda Ética',
              rating: 5,
            },
            {
              quote:
                'La mejor inversión que hicimos para nuestro lanzamiento. El packaging que diseñaron nos abrió puertas en 5 países nuevos. Son magos del diseño.',
              name: 'Diego Alejandro Vega',
              role: 'Fundador — NutriBar Organics',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'cta',
        title: '¿Tienes un Proyecto en Mente?',
        enabled: true,
        data: {
          title: '¿Tienes un Proyecto en Mente?',
          subtitle:
            'Nos encantaría escucharte. Cuéntanos tu idea y juntos la haremos realidad.',
          ctaText: 'Hablemos de tu Proyecto',
          ctaLink: '#contacto',
        },
      },
    ],
    recommendedPlugins: ['gallery', 'testimonials', 'contact-form'],
    tags: ['creativo', 'portafolio', 'diseño', 'fotografía'],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SAAS — "CloudFlow"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'saas',
    name: 'SaaS',
    subtitle: 'CloudFlow',
    description:
      'Plantilla optimizada para productos SaaS y plataformas tecnológicas. Incluye sección de precios, FAQ técnica y testimonios de líderes de la industria.',
    category: 'Tecnología',
    icon: '☁️',
    template: 'saas',
    themeConfig: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#6366F1',
      accentColor: '#10B981',
      backgroundColor: '#FFFFFF',
      textColor: '#1E293B',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      borderRadius: 8,
      style: 'modern',
    },
    sections: [
      {
        type: 'hero',
        title: 'Gestiona tu Equipo sin Fricción',
        enabled: true,
        data: {
          title: 'Gestiona tu Equipo\nsin Fricción',
          subtitle:
            'La plataforma de gestión de proyectos que equipos de alto rendimiento eligen para entregar resultados, no burocracia. Automatiza, colabora y escala.',
          ctaText: 'Comenzar Prueba Gratis',
          ctaLink: '#precios',
          secondaryCtaText: 'Ver Demo en Vivo',
          secondaryCtaLink: '#demo',
          backgroundImage: IMG.techAbstract,
          overlayOpacity: 0.65,
        },
      },
      {
        type: 'features',
        title: 'Todo lo que tu Equipo Necesita',
        enabled: true,
        data: {
          title: 'Todo lo que tu Equipo Necesita',
          subtitle: 'Funciones diseñadas para equipos modernos y distribuidos',
          items: [
            {
              icon: '📊',
              title: 'Panel de Control Unificado',
              description:
                'Vista en tiempo real de todos tus proyectos, tareas y plazos. Dashboards personalizables con métricas clave de rendimiento.',
            },
            {
              icon: '🤖',
              title: 'Automatización Inteligente',
              description:
                'Crea flujos de trabajo automatizados sin código: notificaciones, asignaciones, cambios de estado y reportes recurrentes.',
            },
            {
              icon: '📈',
              title: 'Análisis Avanzado',
              description:
                'Reportes detallados de productividad, velocidad del equipo y salud del proyecto. Exporta a PDF o comparte en tiempo real.',
            },
            {
              icon: '🔒',
              title: 'Seguridad Empresarial',
              description:
                'Encriptación AES-256, autenticación de dos factores, SSO con SAML/OAuth y cumplimiento SOC 2 Type II.',
            },
            {
              icon: '🔌',
              title: 'API REST Completa',
              description:
                'Integra CloudFlow con más de 200 herramientas: Slack, GitHub, Jira, Salesforce, Google Workspace y más.',
            },
            {
              icon: '🔄',
              title: 'Integraciones Nativas',
              description:
                'Sincronización bidireccional con tu stack tecnológico actual. Sin importar las herramientas que uses, CloudFlow se adapta.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'pricing',
        title: 'Planes y Precios',
        enabled: true,
        data: {
          title: 'Planes y Precios',
          subtitle: 'Elige el plan perfecto para el tamaño de tu equipo. Cancela cuando quieras.',
          plans: [
            {
              name: 'Inicial',
              price: '$19',
              period: '/mes por usuario',
              description: 'Ideal para equipos pequeños que están comenzando',
              features: [
                'Hasta 10 proyectos activos',
                '5 GB de almacenamiento',
                'Integraciones básicas (Slack, Email)',
                'Soporte por email',
                'Kanban y listas',
              ],
              highlighted: false,
              ctaText: 'Prueba Gratis 14 Días',
            },
            {
              name: 'Profesional',
              price: '$49',
              period: '/mes por usuario',
              description: 'Para equipos en crecimiento que necesitan más poder',
              features: [
                'Proyectos ilimitados',
                '100 GB de almacenamiento',
                'Todas las integraciones',
                'Soporte prioritario 24/7',
                'Automatizaciones avanzadas',
                'Reportes personalizados',
                'API completa',
              ],
              highlighted: true,
              ctaText: 'Prueba Gratis 14 Días',
            },
            {
              name: 'Empresarial',
              price: '$99',
              period: '/mes por usuario',
              description: 'Para organizaciones que requieren control total',
              features: [
                'Todo en Profesional',
                'Almacenamiento ilimitado',
                'SSO / SAML',
                'Auditoría y logs',
                'SLA garantizado 99.99%',
                'Cuenta dedicada',
                'Onboarding personalizado',
                'Entorno on-premise disponible',
              ],
              highlighted: false,
              ctaText: 'Contactar Ventas',
            },
          ],
        },
      },
      {
        type: 'testimonials',
        title: 'Testimonios de Líderes Tech',
        enabled: true,
        data: {
          title: 'Testimonios de Líderes Tech',
          subtitle: 'Empresas que confían en CloudFlow para impulsar su productividad',
          testimonials: [
            {
              quote:
                'Migramos de tres herramientas diferentes a CloudFlow y redujimos el tiempo de gestión de proyectos en un 40%. La automatización inteligente es un cambio radical para nuestro equipo de 50 personas.',
              name: 'Alejandro Reyes',
              role: 'CTO — Innovatech Solutions',
              rating: 5,
            },
            {
              quote:
                'La API de CloudFlow nos permitió construir un flujo de trabajo personalizado que conecta nuestro CRM, nuestro repositorio de código y nuestro sistema de facturación. Increíble.',
              name: 'Valentina Suárez',
              role: 'VP of Engineering — DataPulse',
              rating: 5,
            },
            {
              quote:
                'Soporte de primera clase y un producto que realmente entiende las necesidades de equipos distribuidos. Llevamos 2 años usándolo y cada actualización nos sorprende.',
              name: 'Andrés Castillo',
              role: 'Director de Producto — ScaleUp Labs',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'faq',
        title: 'Preguntas Frecuentes',
        enabled: true,
        data: {
          title: 'Preguntas Frecuentes',
          subtitle: 'Resolvemos tus dudas sobre CloudFlow',
          items: [
            {
              question: '¿Puedo cambiar de plan en cualquier momento?',
              answer:
                'Sí, puedes upgrade o downgrade tu plan en cualquier momento desde la configuración de tu cuenta. Los cambios se aplican inmediatamente y se prorratean automáticamente en tu siguiente facturación.',
            },
            {
              question: '¿CloudFlow cumple con normativas de seguridad?',
              answer:
                'Absolutamente. Cumplimos con SOC 2 Type II, GDPR, CCPA y HIPAA. Todos los datos se encriptan en tránsito (TLS 1.3) y en reposo (AES-256). Realizamos auditorías de seguridad trimestrales con firms externas.',
            },
            {
              question: '¿Qué pasa si mi equipo crece?',
              answer:
                'CloudFlow escala contigo. Puedes agregar usuarios ilimitados en cualquier plan. Solo pagas por los usuarios activos. Si superas los 100 usuarios, nuestro plan Empresarial ofrece precios personalizados.',
            },
            {
              question: '¿Ofrecen migración desde otras herramientas?',
              answer:
                'Sí. Ofrecemos migración asistida gratuita desde Jira, Asana, Trello, Monday.com, Basecamp y Notion. Nuestro equipo de onboarding se encarga de todo: importar datos, configurar flujos y capacitar a tu equipo.',
            },
          ],
        },
      },
      {
        type: 'cta',
        title: 'Comienza a Gestionar Mejor Hoy',
        enabled: true,
        data: {
          title: 'Comienza a Gestionar Mejor Hoy',
          subtitle:
            'Únete a más de 10,000 equipos que ya usan CloudFlow. Prueba gratis durante 14 días, sin tarjeta de crédito.',
          ctaText: 'Comenzar Prueba Gratis',
          ctaLink: '#precios',
        },
      },
    ],
    recommendedPlugins: ['pricing-table', 'testimonials', 'countdown', 'seo'],
    tags: ['tecnología', 'saas', 'startup', 'software'],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. AGENCIA DIGITAL — "Nexus Digital"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'agencia',
    name: 'Agencia Digital',
    subtitle: 'Nexus Digital',
    description:
      'Plantilla profesional para agencias de marketing digital, publicidad y comunicación. Presenta tus servicios, equipo y resultados de manera impactante.',
    category: 'Negocio',
    icon: '🚀',
    template: 'agency',
    themeConfig: {
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      borderRadius: 8,
      style: 'professional',
    },
    sections: [
      {
        type: 'hero',
        title: 'Transformamos Marcas en Experiencias Digitales',
        enabled: true,
        data: {
          title: 'Transformamos Marcas\nen Experiencias Digitales',
          subtitle:
            'Agencia digital con más de 8 años de experiencia creando estrategias que generan resultados medibles. Diseño, marketing y tecnología bajo un mismo techo.',
          ctaText: 'Solicitar Presupuesto',
          ctaLink: '#contacto',
          secondaryCtaText: 'Ver Casos de Éxito',
          secondaryCtaLink: '#portafolio',
          backgroundImage: IMG.agencyOffice,
          overlayOpacity: 0.55,
        },
      },
      {
        type: 'about',
        title: 'Sobre Nexus Digital',
        enabled: true,
        data: {
          title: 'Sobre Nexus Digital',
          subtitle:
            'Nacimos en 2016 con la misión de democratizar el marketing digital para empresas de todos los tamaños. Hoy, con un equipo de más de 50 profesionales y presencia en 12 países, ayudamos a marcas a conectar con sus audiencias de manera auténtica y efectiva. Nuestro enfoque data-driven combina creatividad con tecnología para entregar campañas que no solo se ven bien, sino que generan ROI real.',
          image: IMG.startupFounders,
          stats: [
            { value: '200+', label: 'Proyectos Exitosos' },
            { value: '50+', label: 'Marcas Confían en Nosotros' },
            { value: '12', label: 'Países con Presencia' },
            { value: '8', label: 'Años de Experiencia' },
          ],
        },
      },
      {
        type: 'features',
        title: 'Nuestros Servicios',
        enabled: true,
        data: {
          title: 'Nuestros Servicios',
          subtitle: 'Soluciones digitales de 360° para tu negocio',
          items: [
            {
              icon: '🎨',
              title: 'Branding & Diseño',
              description:
                'Creación y evolución de identidades de marca: desde logos y papelería hasta guías de estilo completas y manuales de marca.',
            },
            {
              icon: '💻',
              title: 'Desarrollo Web & Apps',
              description:
                'Sitios web corporativos, e-commerce, landing pages y aplicaciones móviles con las últimas tecnologías del mercado.',
            },
            {
              icon: '📣',
              title: 'Marketing Digital',
              description:
                'Estrategias integrales de Google Ads, Meta Ads, email marketing y marketing de contenidos con enfoque en conversión.',
            },
            {
              icon: '🔍',
              title: 'SEO & SEM',
              description:
                'Optimización para buscadores, posicionamiento orgánico, campañas SEM y auditorías técnicas de sitios web.',
            },
            {
              icon: '✍️',
              title: 'Content Strategy',
              description:
                'Creación de calendarios editoriales, producción de contenido, copywriting y gestión de blogs corporativos.',
            },
            {
              icon: '📱',
              title: 'Social Media',
              description:
                'Gestión de perfiles en Instagram, LinkedIn, TikTok y Twitter. Creación de contenido, community management y social ads.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'gallery',
        title: 'Nuestros Trabajos',
        enabled: true,
        data: {
          title: 'Nuestros Trabajos',
          subtitle: 'Cada proyecto es una historia de éxito',
          images: [
            { src: IMG.agencyWork1, alt: 'Campaña digital para TechCorp', caption: 'Campaña TechCorp' },
            { src: IMG.agencyWork2, alt: 'Dashboard de analytics para DataFlow', caption: 'Dashboard DataFlow' },
            { src: IMG.agencyWork3, alt: 'Rediseño web para Studio Moda', caption: 'Web Studio Moda' },
            { src: IMG.agencyWork4, alt: 'App móvil para FitLife', caption: 'App FitLife' },
            { src: IMG.agencyWork5, alt: 'Identidad visual para GreenTech', caption: 'Branding GreenTech' },
            { src: IMG.agencyWork6, alt: 'E-commerce para NaturalCosmetics', caption: 'Tienda NaturalCosmetics' },
          ],
          columns: 3,
        },
      },
      {
        type: 'team',
        title: 'Nuestro Equipo',
        enabled: true,
        data: {
          title: 'Nuestro Equipo',
          members: [
            {
              name: 'Sofía Ramírez',
              role: 'CEO & Fundadora',
              bio: 'Más de 15 años en marketing digital. Anteriormente directora en Ogilvy y McCann.',
              avatar: '',
              socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'twitter', url: '#' },
              ],
            },
            {
              name: 'Mateo Hernández',
              role: 'Director Creativo',
              bio: 'Diseñador premiado con pasión por la tipografía y la experiencia de usuario.',
              avatar: '',
              socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'instagram', url: '#' },
              ],
            },
            {
              name: 'Camila Ortega',
              role: 'Lead Tech Developer',
              bio: 'Full-stack engineer especializada en React, Next.js y arquitecturas cloud.',
              avatar: '',
              socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'github', url: '#' },
              ],
            },
            {
              name: 'Sebastián Vargas',
              role: 'Director de Marketing',
              bio: 'Experto en growth hacking y analytics. Ha escalado más de 30 startups.',
              avatar: '',
              socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'twitter', url: '#' },
              ],
            },
          ],
        },
      },
      {
        type: 'cta',
        title: '¿Listo para Crecer Digitalmente?',
        enabled: true,
        data: {
          title: '¿Listo para Crecer Digitalmente?',
          subtitle:
            'Agenda una consulta gratuita de 30 minutos y descubre cómo podemos ayudarte a alcanzar tus metas digitales.',
          ctaText: 'Solicitar Presupuesto',
          ctaLink: '#contacto',
        },
      },
    ],
    recommendedPlugins: ['testimonials', 'custom-post-type', 'contact-form', 'seo', 'social-share'],
    tags: ['negocio', 'agencia', 'marketing', 'digital'],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. E-COMMERCE — "Market Luxe"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    subtitle: 'Market Luxe',
    description:
      'Plantilla sofisticada para tiendas en línea y comercio electrónico. Diseñada para maximizar conversiones con secciones de productos, precios y testimonios.',
    category: 'Ventas',
    icon: '🛍️',
    template: 'ecommerce',
    themeConfig: {
      primaryColor: '#9333EA',
      secondaryColor: '#EC4899',
      accentColor: '#F59E0B',
      backgroundColor: '#FAFAFA',
      textColor: '#1F2937',
      headingFont: 'Outfit',
      bodyFont: 'DM Sans',
      borderRadius: 10,
      style: 'luxury',
    },
    sections: [
      {
        type: 'hero',
        title: 'Lujo Accesible a un Clic de Distancia',
        enabled: true,
        data: {
          title: 'Lujo Accesible\na un Clic de Distancia',
          subtitle:
            'Descubre nuestra colección exclusiva de moda, accesorios y lifestyle. Envío gratis en pedidos superiores a $500.',
          ctaText: 'Explorar Colección',
          ctaLink: '#productos',
          secondaryCtaText: 'Ver Ofertas',
          secondaryCtaLink: '#ofertas',
          backgroundImage: IMG.fashionHero,
          overlayOpacity: 0.5,
        },
      },
      {
        type: 'features',
        title: '¿Por qué Comprar en Market Luxe?',
        enabled: true,
        data: {
          title: '¿Por qué Comprar en Market Luxe?',
          subtitle: 'La experiencia de compra que mereces',
          items: [
            {
              icon: '🚚',
              title: 'Envío Gratis Nacional',
              description:
                'En todos los pedidos superiores a $500 MXN. Entrega en 2-5 días hábiles a toda la república.',
            },
            {
              icon: '🔒',
              title: 'Pago 100% Seguro',
              description:
                'Transacciones protegidas con encriptación SSL. Aceptamos Visa, Mastercard, AMEX, PayPal y transferencia.',
            },
            {
              icon: '↩️',
              title: 'Devoluciones en 30 Días',
              description:
                'Si no estás satisfecho, devuélvelo sin preguntas. Envío de devolución prepaid incluido.',
            },
            {
              icon: '💎',
              title: 'Atención Premium',
              description:
                'Asesores de estilo disponibles por chat, WhatsApp y teléfono. Te ayudamos a encontrar el look perfecto.',
            },
            {
              icon: '⭐',
              title: 'Programa de Puntos',
              description:
                'Acumula puntos en cada compra y canjéalos por descuentos exclusivos, envíos gratis y productos sorpresa.',
            },
            {
              icon: '⚡',
              title: 'Entrega Express',
              description:
                'Entrega en 24 horas en la Zona Metropolitana. Disponible de lunes a viernes para pedidos antes de las 2 PM.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'gallery',
        title: 'Productos Destacados',
        enabled: true,
        data: {
          title: 'Productos Destacados',
          subtitle: 'Lo más nuevo en nuestra colección',
          images: [
            { src: IMG.product1, alt: 'Bolso de piel italiano', caption: 'Bolso Italiano — $2,490' },
            { src: IMG.product2, alt: 'Reloj minimalista acero', caption: 'Reloj Minimalista — $3,990' },
            { src: IMG.product3, alt: 'Gafas de sol polarizadas', caption: 'Gafas Polarizadas — $1,890' },
            { src: IMG.product4, alt: 'Perfume artesanal unisex', caption: 'Perfume Artesanal — $1,290' },
            { src: IMG.product5, alt: 'Tenis premium cuero', caption: 'Tenis Premium — $4,590' },
            { src: IMG.product6, alt: 'Cartera de mano elegante', caption: 'Cartera Elegante — $1,690' },
          ],
          columns: 3,
        },
      },
      {
        type: 'pricing',
        title: 'Membresías VIP',
        enabled: true,
        data: {
          title: 'Membresías VIP',
          subtitle: 'Únete a nuestro programa exclusivo y desbloquea beneficios especiales',
          plans: [
            {
              name: 'Básico',
              price: '$0',
              period: '/siempre',
              description: 'Empieza a disfrutar de beneficios desde el día uno',
              features: [
                'Envío gratis en pedidos +$500',
                '5% de descuento en tu cumpleaños',
                'Acceso anticipado a ventas',
                'Newsletter exclusiva',
              ],
              highlighted: false,
              ctaText: 'Registrarse Gratis',
            },
            {
              name: 'Premium',
              price: '$9.99',
              period: '/mes',
              description: 'Para los que viven la moda todos los días',
              features: [
                'Todo lo de Básico',
                'Envío gratis en TODOS los pedidos',
                '10% de descuento permanente',
                'Acceso a colecciones limitadas',
                'Asesor de estilo personal',
                'Entrega express gratis',
              ],
              highlighted: true,
              ctaText: 'Hacerse Premium',
            },
            {
              name: 'Elite',
              price: '$24.99',
              period: '/mes',
              description: 'La experiencia de lujo definitiva',
              features: [
                'Todo lo de Premium',
                '20% de descuento permanente',
                'Invitaciones a eventos exclusivos',
                'Caja sorpresa mensual',
                'Prioridad en reservas de productos',
                'Devolución extendida a 60 días',
                'Regalos de bienvenida',
              ],
              highlighted: false,
              ctaText: 'Hacerse Elite',
            },
          ],
        },
      },
      {
        type: 'testimonials',
        title: 'Nuestros Clientes Opinan',
        enabled: true,
        data: {
          title: 'Nuestros Clientes Opinan',
          subtitle: 'Miles de compradores satisfechos nos respaldan',
          testimonials: [
            {
              quote:
                'La calidad de los productos es excepcional. El bolso italiano que compré superó todas mis expectativas. El envío llegó en 3 días y el empaque era precioso, perfecto para regalo.',
              name: 'Gabriela Mendoza',
              role: 'Cliente VIP Premium — Monterrey',
              rating: 5,
            },
            {
              quote:
                'Llevo un año como miembro Elite y no puedo imaginar volver a comprar en otro lado. Los descuentos, la atención personalizada y las cajas sorpresa hacen que cada mes sea especial.',
              name: 'Ricardo Fuentes',
              role: 'Cliente Elite — Ciudad de México',
              rating: 5,
            },
            {
              quote:
                'El proceso de devolución fue sorprendentemente fácil. Devolví un par de tenis que no me quedaban bien y en 48 horas ya tenía el reembolso. Servicio al cliente de primera.',
              name: 'Patricia Delgado',
              role: 'Cliente Básico — Guadalajara',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'faq',
        title: 'Preguntas Frecuentes sobre Compras',
        enabled: true,
        data: {
          title: 'Preguntas Frecuentes',
          subtitle: 'Todo lo que necesitas saber antes de comprar',
          items: [
            {
              question: '¿Cuánto tarda el envío?',
              answer:
                'El envío estándar tarda de 2 a 5 días hábiles a toda la república mexicana. La entrega express (Zona Metropolitana) llega en 24 horas para pedidos realizados antes de las 2 PM de lunes a viernes.',
            },
            {
              question: '¿Cómo hago una devolución?',
              answer:
                'Inicia tu devolución desde tu cuenta en línea o contáctanos por WhatsApp. Te enviaremos una guía prepaid para el envío. Una vez que recibamos el producto en nuestras bodegas, procesaremos tu reembolso en un máximo de 48 horas hábiles.',
            },
            {
              question: '¿Qué métodos de pago aceptan?',
              answer:
                'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, AMEX), PayPal, transferencia bancaria SPEI y pagos en OXXO. Todas las transacciones están protegidas con encriptación SSL de 256 bits.',
            },
            {
              question: '¿Las tallas son estándar?',
              answer:
                'Sí, trabajamos con tallas estándar internacionales. Cada producto incluye una guía de tallas detallada con medidas en centímetros. Si estás entre dos tallas, te recomendamos elegir la talla mayor para un ajuste más cómodo.',
            },
          ],
        },
      },
    ],
    recommendedPlugins: ['pricing-table', 'testimonials', 'related-posts', 'social-share'],
    tags: ['ventas', 'ecommerce', 'tienda', 'moda'],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. BLOG — "El Rincón Digital"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'blog',
    name: 'Blog',
    subtitle: 'El Rincón Digital',
    description:
      'Plantilla limpia y legible para blogs, revistas digitales y publicaciones de contenido. Optimizada para SEO y la mejor experiencia de lectura.',
    category: 'Contenido',
    icon: '📝',
    template: 'blog',
    themeConfig: {
      primaryColor: '#059669',
      secondaryColor: '#0D9488',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      headingFont: 'Merriweather',
      bodyFont: 'Source Sans 3',
      borderRadius: 6,
      style: 'editorial',
    },
    sections: [
      {
        type: 'hero',
        title: 'Ideas que Inspiran, Contenido que Transforma',
        enabled: true,
        data: {
          title: 'Ideas que Inspiran,\nContenido que Transforma',
          subtitle:
            'El blog de referencia para profesionales creativos y emprendedores. Artículos profundos, guías prácticas y entrevistas exclusivas cada semana.',
          ctaText: 'Explorar Artículos',
          ctaLink: '#articulos',
          secondaryCtaText: 'Suscribirse',
          secondaryCtaLink: '#newsletter',
          backgroundImage: IMG.workspaceHero,
          overlayOpacity: 0.6,
        },
      },
      {
        type: 'features',
        title: 'Nuestras Categorías',
        enabled: true,
        data: {
          title: 'Nuestras Categorías',
          subtitle: 'Encuentra contenido por tema de interés',
          items: [
            {
              icon: '💻',
              title: 'Tecnología',
              description:
                'Las últimas tendencias en IA, desarrollo web, gadgets y software. Reviews honestos y tutoriales prácticos.',
            },
            {
              icon: '🎨',
              title: 'Diseño',
              description:
                'Inspiración, tendencias visuales, tips de UX/UI y entrevistas con diseñadores de renombre internacional.',
            },
            {
              icon: '📢',
              title: 'Marketing',
              description:
                'Estrategias de marketing digital, growth hacking, redes sociales y casos de estudio de marcas exitosas.',
            },
            {
              icon: '💼',
              title: 'Negocios',
              description:
                'Emprendimiento, finanzas personales, liderazgo y productividad para profesionales y dueños de negocio.',
            },
            {
              icon: '⚡',
              title: 'Productividad',
              description:
                'Herramientas, métodos y hábitos para trabajar mejor, no más. Reviews de apps y frameworks de eficiencia.',
            },
            {
              icon: '🤖',
              title: 'Inteligencia Artificial',
              description:
                'Todo sobre ChatGPT, Midjourney, automatizaciones con IA y cómo está transformando las industrias.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'gallery',
        title: 'Artículos Recientes',
        enabled: true,
        data: {
          title: 'Artículos Recientes',
          subtitle: 'Lo último que hemos publicado',
          images: [
            { src: IMG.articleCover1, alt: '10 herramientas de IA que revolucionarán tu flujo de trabajo', caption: '10 Herramientas IA para 2025' },
            { src: IMG.articleCover2, alt: 'Guía completa de diseño de interfaces con Figma', caption: 'Guía Completa de Figma' },
            { src: IMG.articleCover3, alt: 'Cómo automatizar tu marketing digital con herramientas gratuitas', caption: 'Automatiza tu Marketing' },
            { src: IMG.articleCover4, alt: 'Entrevista exclusiva con la CEO de una startup unicornio', caption: 'Entrevista CEO Startup' },
            { src: IMG.articleCover5, alt: 'Los 7 hábitos de los emprendedores más exitosos', caption: '7 Hábitos de Emprendedores' },
            { src: IMG.articleCover6, alt: 'Tendencias de diseño web que dominarán este año', caption: 'Tendencias Web 2025' },
          ],
          columns: 3,
        },
      },
      {
        type: 'testimonials',
        title: 'Nuestros Lectores Opinan',
        enabled: true,
        data: {
          title: 'Nuestros Lectores Opinan',
          subtitle: 'Comunidad de más de 25,000 suscriptores',
          testimonials: [
            {
              quote:
                'El Rincón Digital es mi blog favorito. Los artículos de tecnología y productividad siempre están bien investigados y escritos de forma clara. Los leo todas las mañanas con mi café.',
              name: 'Fernando José Álvarez',
              role: 'Desarrollador Full-Stack — Guadalajara',
              rating: 5,
            },
            {
              quote:
                'La guía de marketing digital que publicaron me ayudó a triplicar el tráfico de mi tienda online en 3 meses. Contenido de altísimo valor, totalmente gratis.',
              name: 'Laura Patricia Sánchez',
              role: 'Fundadora — Tienda Online Mia',
              rating: 5,
            },
            {
              quote:
                'Como diseñadora, encuentro aquí inspiración constante. Las entrevistas con otros creativos son mi sección favorita. El newsletter semanal es un must-have en mi bandeja de entrada.',
              name: 'Daniela Gómez Roldán',
              role: 'UX Designer — Monterrey',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'cta',
        title: 'Únete a Nuestra Comunidad',
        enabled: true,
        data: {
          title: 'Únete a Nuestra Comunidad',
          subtitle:
            'Suscríbete al newsletter y recibe cada semana los mejores artículos directamente en tu email. Sin spam, solo contenido de valor. Más de 25,000 lectores confían en nosotros.',
          ctaText: 'Suscribirme al Newsletter',
          ctaLink: '#newsletter',
        },
      },
    ],
    recommendedPlugins: ['related-posts', 'social-share', 'seo', 'breadcrumbs'],
    tags: ['contenido', 'blog', 'editorial', 'noticias'],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. LANDING PAGE — "TechStart"
  // ─────────────────────────────────────────────────────────────
  {
    id: 'landing',
    name: 'Landing Page',
    subtitle: 'TechStart',
    description:
      'Plantilla de alta conversión para startups y lanzamientos de producto. Optimizada para capturar leads, presentar tu propuesta de valor y generar urgencia.',
    category: 'Tecnología',
    icon: '🚀',
    template: 'landing',
    themeConfig: {
      primaryColor: '#7C3AED',
      secondaryColor: '#2563EB',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      borderRadius: 8,
      style: 'startup',
    },
    sections: [
      {
        type: 'hero',
        title: 'Haz que tu Startup Despegue',
        enabled: true,
        data: {
          title: 'Haz que tu\nStartup Despegue',
          subtitle:
            'TechStart conecta emprendedores con mentores, inversores y herramientas para validar, lanzar y escalar tu idea de negocio en tiempo récord.',
          ctaText: 'Comenzar Gratis',
          ctaLink: '#registro',
          secondaryCtaText: 'Ver cómo Funciona',
          secondaryCtaLink: '#funciona',
          backgroundImage: IMG.abstractHero,
          overlayOpacity: 0.65,
        },
      },
      {
        type: 'features',
        title: 'Todo lo que Necesitas para Lanzar',
        enabled: true,
        data: {
          title: 'Todo lo que Necesitas para Lanzar',
          subtitle: 'Las herramientas que las startups exitosas usan desde el día uno',
          items: [
            {
              icon: '📋',
              title: 'Validación de Idea',
              description:
                'Plantillas y frameworks para validar tu idea de negocio antes de escribir una sola línea de código o gastar un solo peso.',
            },
            {
              icon: '🎯',
              title: 'Landing Page Builder',
              description:
                'Crea páginas de alta conversión sin saber programar. Templates profesionales optimizados para capturar leads.',
            },
            {
              icon: '📈',
              title: 'Analítica en Tiempo Real',
              description:
                'Dashboards con métricas clave: visitantes, conversiones, costo por adquisición y tasa de retención, actualizados al instante.',
            },
            {
              icon: '🤝',
              title: 'Conexión con Inversores',
              description:
                'Directorio de más de 500 ángeles inversores y fondos de venture capital activos en Latinoamérica y España.',
            },
            {
              icon: '🎓',
              title: 'Mentoría Personalizada',
              description:
                'Programa de mentoría 1-a-1 con fundadores exitosos que han levantado más de $100M en capital combinado.',
            },
            {
              icon: '🛠️',
              title: 'Herramientas de Legal',
              description:
                'Contratos, términos y condiciones, acuerdos de confidencialidad y documentos legales estándar para startups.',
            },
          ],
          columns: 3,
        },
      },
      {
        type: 'about',
        title: 'Nuestra Misión',
        enabled: true,
        data: {
          title: 'Nuestra Misión',
          subtitle:
            'TechStart nació en 2023 de la frustración de tres fundadores que, tras exitosas exits, se dieron cuenta de que el ecosistema emprendedor carecía de una plataforma integral que realmente ayudara a las startups en sus primeras etapas. Hoy, con más de 2,000 startups activas en la plataforma y $50M en inversiones facilitadas, seguimos trabajando para que la próxima gran idea no se quede en un cuaderno.',
          image: IMG.startupFounders,
          stats: [
            { value: '2,000+', label: 'Startups Activas' },
            { value: '$50M+', label: 'Inversiones Facilitadas' },
            { value: '500+', label: 'Mentores Activos' },
            { value: '15', label: 'Países Alcanzados' },
          ],
        },
      },
      {
        type: 'testimonials',
        title: 'Fundadores que Confían en TechStart',
        enabled: true,
        data: {
          title: 'Fundadores que Confían en TechStart',
          subtitle: 'Historias reales de éxito',
          testimonials: [
            {
              quote:
                'TechStart nos conectó con nuestro primer inversor ángel en solo 3 semanas. La plataforma de validación nos ayudó a afinar nuestro pitch y la mentoría fue invaluable para nuestro seed round.',
              name: 'Julián Andrés Peña',
              role: 'Co-founder — PayFlow (Y Combinator W24)',
              rating: 5,
            },
            {
              quote:
                'El programa de mentoría de TechStart cambió la trayectoria de nuestra startup. Pasamos de estar estancados a cerrar un contrato con una empresa del Fortune 500 en 4 meses.',
              name: 'María José Castaño',
              role: 'CEO — LogiTrack',
              rating: 5,
            },
            {
              quote:
                'Como fundadora solitaria, encontrar una comunidad que me entendiera fue transformador. TechStart no es solo herramientas, es una familia de emprendedores que se apoyan mutuamente.',
              name: 'Carolina Estrada',
              role: 'Fundadora — EcoLearn',
              rating: 5,
            },
          ],
        },
      },
      {
        type: 'stats',
        title: 'TechStart en Números',
        enabled: true,
        data: {
          title: '',
          items: [
            { icon: '🚀', value: '2,000+', label: 'Startups en la Plataforma' },
            { icon: '💰', value: '$50M+', label: 'Inversiones Facilitadas' },
            { icon: '👨‍🏫', value: '500+', label: 'Mentores Expertos' },
            { icon: '🌍', value: '15', label: 'Países' },
          ],
        },
      },
      {
        type: 'cta',
        title: 'Tu Idea Merece Ser Realidad',
        enabled: true,
        data: {
          title: 'Tu Idea Merece Ser Realidad',
          subtitle:
            'Únete a más de 2,000 fundadores que ya están construyendo el futuro con TechStart. Regístrate gratis y comienza hoy mismo.',
          ctaText: 'Comenzar Gratis — Sin Tarjeta',
          ctaLink: '#registro',
        },
      },
    ],
    recommendedPlugins: ['countdown', 'contact-form', 'social-share', 'seo'],
    tags: ['tecnología', 'startup', 'landing', 'lanzamiento'],
  },
];

// ═══════════════════════════════════════════════════════════════
// TEMPLATE CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const TEMPLATE_CATEGORIES: string[] = [
  'Restaurantes',
  'Creativo',
  'Tecnología',
  'Negocio',
  'Ventas',
  'Contenido',
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** Get a template preset by its ID */
export function getTemplateById(id: string): TemplatePreset | undefined {
  return TEMPLATE_PRESETS.find((t) => t.id === id);
}

/** Get all templates that belong to a specific category */
export function getTemplatesByCategory(category: string): TemplatePreset[] {
  return TEMPLATE_PRESETS.filter((t) => t.category === category);
}

/** Get all unique categories from the template presets */
export function getAllCategories(): string[] {
  const categories = new Set(TEMPLATE_PRESETS.map((t) => t.category));
  return Array.from(categories);
}
