// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Default Templates (Page-based Builder)
// ═══════════════════════════════════════════════════════════════

import type { PageSection, PageTemplate, SectionType, PageTheme, HeroSection, FeaturesSection, AboutSection, TestimonialsSection, PricingSection, CTASection, ContactSection, FooterSection, GallerySection, FAQSection, StatsSection, TeamSection } from './builder-types';

const uid = () => Math.random().toString(36).slice(2, 10);

// ═══════════════════════════════════════════════════════════════
// IMAGE URLS
// ═══════════════════════════════════════════════════════════════

const IMG = {
  // Food / Restaurant
  foodPlate: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  fineDining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
  restaurantInterior: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  dish: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
  foodCloseup: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop',
  // Office / Business
  modernOffice: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  teamWorking: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
  // Technology
  techAbstract: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  // Portfolio / Design
  designWork: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  workspace: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
};

// ═══════════════════════════════════════════════════════════════
// Base Section Creator Functions (unchanged signatures)
// ═══════════════════════════════════════════════════════════════

function createHero(overrides?: Partial<HeroSection['data']>): HeroSection {
  return {
    type: 'hero',
    id: uid(),
    enabled: true,
    data: {
      title: 'Construye algo increible',
      subtitle: 'La plataforma todo-en-uno que necesitas para hacer crecer tu negocio online de forma rápida y sencilla.',
      ctaText: 'Comenzar Gratis',
      ctaLink: '#',
      secondaryCtaText: 'Ver Demo',
      secondaryCtaLink: '#features',
      backgroundImage: '',
      overlayOpacity: 60,
      height: 'large',
      alignment: 'center',
      ...overrides,
    },
  };
}

function createFeatures(overrides?: Partial<FeaturesSection['data']>): FeaturesSection {
  return {
    type: 'features',
    id: uid(),
    enabled: true,
    data: {
      title: 'Características Principales',
      subtitle: 'Todo lo que necesitas para tener éxito',
      columns: 3,
      features: [
        { id: uid(), icon: 'Zap', title: 'Ultra Rápido', description: 'Rendimiento optimizado para una experiencia de usuario excepcional.' },
        { id: uid(), icon: 'Shield', title: 'Seguridad Total', description: 'Protección avanzada de datos con encriptación de nivel empresarial.' },
        { id: uid(), icon: 'Sparkles', title: 'Diseño Moderno', description: 'Interfaces elegantes y responsive que impresionan a tus usuarios.' },
        { id: uid(), icon: 'BarChart3', title: 'Analítica Avanzada', description: 'Métricas y reportes detallados para tomar mejores decisiones.' },
        { id: uid(), icon: 'Headphones', title: 'Soporte 24/7', description: 'Equipo dedicado disponible en todo momento para ayudarte.' },
        { id: uid(), icon: 'Puzzle', title: 'Integraciones', description: 'Conecta con tus herramientas favoritas de forma sencilla.' },
      ],
      ...overrides,
    },
  };
}

function createAbout(overrides?: Partial<AboutSection['data']>): AboutSection {
  return {
    type: 'about',
    id: uid(),
    enabled: true,
    data: {
      title: 'Sobre Nosotros',
      description: 'Somos un equipo apasionado por la tecnología y la innovación. Desde nuestra fundación, hemos ayudado a más de 1,000 empresas a transformar su presencia digital con soluciones creativas y efectivas.',
      image: '',
      imagePosition: 'right',
      stats: [
        { value: '1000+', label: 'Clientes Satisfechos' },
        { value: '500+', label: 'Proyectos Completados' },
        { value: '99%', label: 'Tasa de Satisfacción' },
      ],
      ...overrides,
    },
  };
}

function createTestimonials(overrides?: Partial<TestimonialsSection['data']>): TestimonialsSection {
  return {
    type: 'testimonials',
    id: uid(),
    enabled: true,
    data: {
      title: 'Lo que dicen nuestros clientes',
      subtitle: 'Miles de profesionales confían en nosotros',
      testimonials: [
        { id: uid(), name: 'María García', role: 'CEO, TechStart', avatar: '', quote: 'Una herramienta increíble que transformó completamente nuestra forma de trabajar. El soporte es excepcional.', rating: 5 },
        { id: uid(), name: 'Carlos López', role: 'Director de Marketing, InnovaCo', avatar: '', quote: 'Los resultados superaron nuestras expectativas. Vimos un aumento del 300% en conversiones en solo 3 meses.', rating: 5 },
        { id: uid(), name: 'Ana Martínez', role: 'Fundadora, CreativaStudio', avatar: '', quote: 'La mejor inversión que hemos hecho para nuestro negocio. La interfaz es intuitiva y poderosa.', rating: 5 },
      ],
      ...overrides,
    },
  };
}

function createPricing(overrides?: Partial<PricingSection['data']>): PricingSection {
  return {
    type: 'pricing',
    id: uid(),
    enabled: true,
    data: {
      title: 'Planes y Precios',
      subtitle: 'Elige el plan perfecto para tus necesidades',
      plans: [
        { id: uid(), name: 'Básico', price: '9', period: '/mes', description: 'Ideal para comenzar', features: ['5 proyectos', '1GB almacenamiento', 'Soporte por email', 'Análisis básicos'], highlighted: false, ctaText: 'Empezar' },
        { id: uid(), name: 'Pro', price: '29', period: '/mes', description: 'Para profesionales', features: ['Proyectos ilimitados', '10GB almacenamiento', 'Soporte prioritario', 'Análisis avanzados', 'Integraciones'], highlighted: true, ctaText: 'Comenzar Prueba' },
        { id: uid(), name: 'Empresa', price: '79', period: '/mes', description: 'Para grandes equipos', features: ['Todo en Pro', '100GB almacenamiento', 'Soporte 24/7', 'API personalizada', 'SLA garantizado', 'Onboarding dedicado'], highlighted: false, ctaText: 'Contactar' },
      ],
      ...overrides,
    },
  };
}

function createCTA(overrides?: Partial<CTASection['data']>): CTASection {
  return {
    type: 'cta',
    id: uid(),
    enabled: true,
    data: {
      title: '¿Listo para comenzar?',
      subtitle: 'Únete a miles de empresas que ya confían en nosotros.',
      ctaText: 'Crear Cuenta Gratis',
      ctaLink: '#',
      backgroundStyle: 'gradient',
      backgroundImage: '',
      ...overrides,
    },
  };
}

function createContact(overrides?: Partial<ContactSection['data']>): ContactSection {
  return {
    type: 'contact',
    id: uid(),
    enabled: true,
    data: {
      title: 'Contáctanos',
      subtitle: 'Estamos aquí para ayudarte',
      email: 'contacto@ejemplo.com',
      phone: '+34 900 123 456',
      address: 'Calle Principal 123, Madrid',
      showForm: true,
      formFields: [
        { id: uid(), type: 'text', label: 'Nombre', placeholder: 'Tu nombre', required: true },
        { id: uid(), type: 'email', label: 'Email', placeholder: 'tu@email.com', required: true },
        { id: uid(), type: 'textarea', label: 'Mensaje', placeholder: '¿En qué podemos ayudarte?', required: true },
      ],
      ...overrides,
    },
  };
}

function createGallery(overrides?: Partial<GallerySection['data']>): GallerySection {
  return {
    type: 'gallery',
    id: uid(),
    enabled: true,
    data: {
      title: 'Galería',
      subtitle: 'Muestra de nuestro trabajo',
      columns: 3,
      images: [
        { id: uid(), src: '', alt: 'Proyecto 1', caption: 'Diseño Web' },
        { id: uid(), src: '', alt: 'Proyecto 2', caption: 'Marca Corporativa' },
        { id: uid(), src: '', alt: 'Proyecto 3', caption: 'App Móvil' },
        { id: uid(), src: '', alt: 'Proyecto 4', caption: 'E-Commerce' },
        { id: uid(), src: '', alt: 'Proyecto 5', caption: 'Marketing Digital' },
        { id: uid(), src: '', alt: 'Proyecto 6', caption: 'Consultoría' },
      ],
      ...overrides,
    },
  };
}

function createFAQ(overrides?: Partial<FAQSection['data']>): FAQSection {
  return {
    type: 'faq',
    id: uid(),
    enabled: true,
    data: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Respuestas a las dudas más comunes',
      items: [
        { id: uid(), question: '¿Cómo puedo empezar?', answer: 'Puedes registrarte gratuitamente y comenzar a usar la plataforma inmediatamente. No se requiere tarjeta de crédito.' },
        { id: uid(), question: '¿Ofrecen prueba gratuita?', answer: 'Sí, ofrecemos una prueba gratuita de 14 días en todos nuestros planes sin compromiso.' },
        { id: uid(), question: '¿Puedo cancelar en cualquier momento?', answer: 'Por supuesto. Puedes cancelar tu suscripción en cualquier momento sin penalizaciones.' },
        { id: uid(), question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito, PayPal y transferencias bancarias.' },
      ],
      ...overrides,
    },
  };
}

function createStats(overrides?: Partial<StatsSection['data']>): StatsSection {
  return {
    type: 'stats',
    id: uid(),
    enabled: true,
    data: {
      title: '',
      items: [
        { value: '10K+', label: 'Usuarios Activos', icon: 'Users' },
        { value: '50M+', label: 'Datos Procesados', icon: 'Database' },
        { value: '99.9%', label: 'Tiempo Activo', icon: 'Activity' },
        { value: '24/7', label: 'Soporte', icon: 'Headphones' },
      ],
      ...overrides,
    },
  };
}

function createTeam(overrides?: Partial<TeamSection['data']>): TeamSection {
  return {
    type: 'team',
    id: uid(),
    enabled: true,
    data: {
      title: 'Nuestro Equipo',
      subtitle: 'Conoce a las personas detrás del proyecto',
      members: [
        { id: uid(), name: 'Alejandro Ruiz', role: 'CEO & Fundador', avatar: '', bio: 'Más de 15 años de experiencia en tecnología.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
        { id: uid(), name: 'Laura Sánchez', role: 'CTO', avatar: '', bio: 'Experta en arquitectura de software escalable.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'github', url: '#' }] },
        { id: uid(), name: 'David Torres', role: 'Diseño UX/UI', avatar: '', bio: 'Apasionado por crear experiencias de usuario únicas.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'dribbble', url: '#' }] },
        { id: uid(), name: 'Sofia Chen', role: 'Marketing', avatar: '', bio: 'Especialista en growth marketing y contenido.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
      ],
      ...overrides,
    },
  };
}

function createFooter(overrides?: Partial<FooterSection['data']>): FooterSection {
  return {
    type: 'footer',
    id: uid(),
    enabled: true,
    data: {
      brandName: 'Mi Empresa',
      brandDescription: 'Transformando ideas en experiencias digitales extraordinarias.',
      columns: [
        { title: 'Producto', links: [{ label: 'Características', url: '#' }, { label: 'Precios', url: '#' }, { label: 'Integraciones', url: '#' }, { label: 'Changelog', url: '#' }] },
        { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Carreras', url: '#' }, { label: 'Contacto', url: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacidad', url: '#' }, { label: 'Términos', url: '#' }, { label: 'Cookies', url: '#' }] },
      ],
      socialLinks: [
        { platform: 'twitter', url: '#' },
        { platform: 'linkedin', url: '#' },
        { platform: 'github', url: '#' },
        { platform: 'instagram', url: '#' },
      ],
      copyright: `© ${new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.`,
      ...overrides,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Section Registry
// ═══════════════════════════════════════════════════════════════

const sectionCreators: Record<SectionType, (...args: unknown[]) => PageSection> = {
  hero: () => createHero(),
  features: () => createFeatures(),
  about: () => createAbout(),
  testimonials: () => createTestimonials(),
  pricing: () => createPricing(),
  cta: () => createCTA(),
  contact: () => createContact(),
  gallery: () => createGallery(),
  faq: () => createFAQ(),
  stats: () => createStats(),
  team: () => createTeam(),
  footer: () => createFooter(),
};

export function createSection(type: string): PageSection {
  const creator = sectionCreators[type as SectionType];
  return creator ? creator() : sectionCreators.hero();
}

// ═══════════════════════════════════════════════════════════════
// 1. RESTAURANT TEMPLATE — "La Casa del Sabor"
// ═══════════════════════════════════════════════════════════════

function createRestaurantHero(): HeroSection {
  return createHero({
    title: 'La Casa del Sabor',
    subtitle: 'Cocina de autor con ingredientes locales de la más alta calidad. Una experiencia gastronómica que despierta todos los sentidos.',
    backgroundImage: IMG.restaurantInterior,
    overlayOpacity: 55,
    ctaText: 'Reservar Mesa',
    ctaLink: '#contacto',
    secondaryCtaText: 'Ver Carta',
    secondaryCtaLink: '#carta',
    height: 'large',
    alignment: 'center',
  });
}

function createRestaurantFeatures(): FeaturesSection {
  return createFeatures({
    title: 'Nuestra Oferta Gastronómica',
    subtitle: 'Descubre una experiencia culinaria completa diseñada para deleitar cada paladar',
    columns: 3,
    features: [
      { id: uid(), icon: 'Salad', title: 'Entrantes', description: 'Selección de entrantes fríos y calientes elaborados con productos de temporada de los mejores mercados locales.' },
      { id: uid(), icon: 'UtensilsCrossed', title: 'Platos Principales', description: 'Creaciones de autor que fusionan la tradición mediterránea con técnicas contemporáneas de vanguardia.' },
      { id: uid(), icon: 'Cake', title: 'Postres Artesanales', description: 'Repostería casera con un toque innovador. Cada postre es una obra de arte comestible única.' },
      { id: uid(), icon: 'Wine', title: 'Carta de Vinos', description: 'Más de 80 referencias de bodegas españolas e internacionales, cuidadosamente seleccionadas por nuestro sumiller.' },
      { id: uid(), icon: 'Coffee', title: 'Brunch de Fin de Semana', description: 'Desayunos de autor cada sábado y domingo con zumos naturales, bollería artesanal y platos signature.' },
      { id: uid(), icon: 'PartyPopper', title: 'Eventos Privados', description: 'Organización integral de eventos corporativos y celebraciones privadas con menús personalizados a medida.' },
    ],
  });
}

function createRestaurantAbout(): AboutSection {
  return createAbout({
    title: 'Nuestra Historia',
    description: 'Fundado en 2015 por el Chef Andrés Morales tras más de 20 años de experiencia en cocinas de tres continentes, La Casa del Sabor nació con la visión de crear un espacio donde la tradición gastronómica española se encontrara con la innovación culinaria contemporánea. Cada plato que sale de nuestra cocina cuenta una historia: la del productor que cultivó los ingredientes, la del mercado local donde fueron seleccionados, y la pasión de un equipo comprometido con la excelencia.',
    image: IMG.fineDining,
    imagePosition: 'right',
    stats: [
      { value: '8', label: 'Años de Tradición' },
      { value: '15,000+', label: 'Clientes Felices' },
      { value: '3', label: 'Premios Gastronómicos' },
    ],
  });
}

function createRestaurantTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Opiniones de Nuestros Comensales',
    subtitle: 'Lo que dicen quienes han vivido la experiencia La Casa del Sabor',
    testimonials: [
      { id: uid(), name: 'Ana Beltrán', role: 'Food Blogger — @SaboresDeMadrid', avatar: '', quote: 'Cada visita a La Casa del Sabor es un viaje sensorial. La degustación de temporada me dejó sin palabras. Sin duda, uno de los mejores restaurantes de Madrid. El rabo de toro confitado es absolutamente insuperable.', rating: 5 },
      { id: uid(), name: 'Roberto Méndez', role: 'Crítico Gastronómico — Guía Deliciosa', avatar: '', quote: 'Andrés Morales ha logrado algo extraordinario: mantener la esencia de la cocina tradicional española mientras la eleva a cotas de vanguardia. La carta de vinos es una joya. Tres estrellas bien merecidas.', rating: 5 },
      { id: uid(), name: 'Isabel Torres', role: 'Chef Ejecutiva — Restaurante Mar y Tierra', avatar: '', quote: 'Como profesional del sector, reconozco la calidad impecable de sus materias primas y la técnica impecable en cada plato. El servicio es impecable y la ambientación te transporta. Un referente en la gastronomía española.', rating: 5 },
    ],
  });
}

function createRestaurantGallery(): GallerySection {
  return createGallery({
    title: 'Nuestra Galería',
    subtitle: 'Descubre los sabores visuales que te esperan',
    columns: 3,
    images: [
      { id: uid(), src: IMG.fineDining, alt: 'Sala principal del restaurante', caption: 'Ambiente elegante y acogedor' },
      { id: uid(), src: IMG.foodPlate, alt: 'Selección de platos de autor', caption: 'Menú degustación primavera' },
      { id: uid(), src: IMG.dish, alt: 'Plato estrella del chef', caption: 'Rabo de toro confitado' },
      { id: uid(), src: IMG.foodCloseup, alt: 'Detalle de presentación', caption: 'Arte en cada detalle' },
      { id: uid(), src: IMG.restaurantInterior, alt: 'Vista del comedor', caption: 'Comedor iluminado natural' },
      { id: uid(), src: IMG.dish, alt: 'Postre artesanal', caption: 'Tarta de chocolate artesanal' },
    ],
  });
}

function createRestaurantContact(): ContactSection {
  return createContact({
    title: 'Reservas y Contacto',
    subtitle: 'Reserva tu mesa y déjate sorprender por nuestra cocina',
    email: 'reservas@lacasadelsabor.es',
    phone: '+34 91 234 56 78',
    address: 'Calle Gran Vía 42, 28013 Madrid',
    showForm: true,
    formFields: [
      { id: uid(), type: 'text', label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
      { id: uid(), type: 'email', label: 'Email', placeholder: 'tu@email.com', required: true },
      { id: uid(), type: 'phone', label: 'Teléfono', placeholder: '+34 600 000 000', required: true },
      { id: uid(), type: 'date', label: 'Fecha deseada', placeholder: '', required: true },
      { id: uid(), type: 'number', label: 'Número de comensales', placeholder: '2', required: true },
      { id: uid(), type: 'textarea', label: 'Comentarios adicionales', placeholder: 'Alergias, preferencias, ocasión especial...', required: false },
    ],
  });
}

function createRestaurantFooter(): FooterSection {
  return createFooter({
    brandName: 'La Casa del Sabor',
    brandDescription: 'Cocina de autor con ingredientes locales. Una experiencia gastronómica que despierta todos los sentidos desde 2015.',
    columns: [
      { title: 'Menú', links: [{ label: 'Carta de Entrantes', url: '#' }, { label: 'Platos Principales', url: '#' }, { label: 'Postres', url: '#' }, { label: 'Carta de Vinos', url: '#' }] },
      { title: 'Reservas', links: [{ label: 'Reservar Mesa', url: '#contacto' }, { label: 'Eventos Privados', url: '#' }, { label: 'Brunch', url: '#' }, { label: 'Catering', url: '#' }] },
      { title: 'Contacto', links: [{ label: 'Calle Gran Vía 42', url: '#' }, { label: '+34 91 234 56 78', url: '#' }, { label: 'reservas@lacasadelsabor.es', url: '#' }, { label: 'Horarios', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} La Casa del Sabor. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 2. SAAS TEMPLATE — "CloudFlow"
// ═══════════════════════════════════════════════════════════════

function createSaasHero(): HeroSection {
  return createHero({
    title: 'Automatiza tu flujo de trabajo',
    subtitle: 'CloudFlow centraliza la gestión de proyectos, tareas y equipos en una plataforma intuitiva. Reduce un 40% el tiempo de gestión y aumenta la productividad de tu equipo desde el primer día.',
    backgroundImage: IMG.techAbstract,
    overlayOpacity: 70,
    ctaText: 'Comenzar Prueba Gratuita',
    ctaLink: '#precios',
    secondaryCtaText: 'Ver Demo en Vivo',
    secondaryCtaLink: '#demo',
    height: 'large',
    alignment: 'center',
  });
}

function createSaasFeatures(): FeaturesSection {
  return createFeatures({
    title: 'Todo lo que tu equipo necesita',
    subtitle: 'Herramientas poderosas diseñadas para equipos modernos que buscan máxima eficiencia',
    columns: 3,
    features: [
      { id: uid(), icon: 'LayoutDashboard', title: 'Panel de Control', description: 'Vista unificada de todos tus proyectos con widgets personalizables, gráficos de progreso y alertas inteligentes en tiempo real.' },
      { id: uid(), icon: 'Workflow', title: 'Automatización Inteligente', description: 'Crea flujos de trabajo automatizados con reglas condicionales, triggers personalizados y notificaciones smart para eliminar tareas repetitivas.' },
      { id: uid(), icon: 'LineChart', title: 'Análisis en Tiempo Real', description: 'Dashboards interactivos con métricas de velocidad, carga de trabajo, burndown charts y reportes exportables en un clic.' },
      { id: uid(), icon: 'ShieldCheck', title: 'Seguridad Empresarial', description: 'Encriptación AES-256, SSO con SAML/OAuth, auditoría de accesos, cumplimiento GDPR y SOC 2 Type II certificado.' },
      { id: uid(), icon: 'Code', title: 'API Abierta', description: 'API RESTful completa con documentación interactiva, webhooks configurables y SDKs oficiales para Node.js, Python y Ruby.' },
      { id: uid(), icon: 'Blocks', title: 'Integraciones', description: 'Más de 200 integraciones nativas con Slack, GitHub, Jira, Figma, Google Workspace, Microsoft 365 y herramientas CI/CD.' },
    ],
  });
}

function createSaasPricing(): PricingSection {
  return createPricing({
    title: 'Planes para Cada Equipo',
    subtitle: 'Comienza gratis y escala según creces. Sin costes ocultos ni permanencias.',
    plans: [
      { id: uid(), name: 'Starter', price: '19', period: '/mes', description: 'Para equipos pequeños que empiezan a organizarse', features: ['5 proyectos activos', '10 miembros del equipo', 'Tableros Kanban básicos', '1GB almacenamiento', 'Soporte por email', 'Integraciones esenciales'], highlighted: false, ctaText: 'Empezar Gratis' },
      { id: uid(), name: 'Professional', price: '49', period: '/mes', description: 'Para equipos en crecimiento que necesitan potencia', features: ['Proyectos ilimitados', '50 miembros del equipo', 'Vistas Kanban, Gantt y Timeline', 'Automatizaciones avanzadas', 'Reportes personalizados', 'API completa', 'Soporte prioritario'], highlighted: true, ctaText: '14 Días de Prueba' },
      { id: uid(), name: 'Enterprise', price: '99', period: '/mes', description: 'Para organizaciones que requieren control total', features: ['Todo en Professional', 'Miembros ilimitados', 'SSO / SAML', 'Auditoría avanzada', 'SLA garantizado 99.99%', 'Cuenta dedicada', 'Onboarding premium', 'IP blanca dedicada'], highlighted: false, ctaText: 'Contactar Ventas' },
    ],
  });
}

function createSaasTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Equipos de primer nivel confían en CloudFlow',
    subtitle: 'Más de 4,000 empresas gestionan sus proyectos con nuestra plataforma',
    testimonials: [
      { id: uid(), name: 'Miguel Ángel Ferreira', role: 'CTO — NovaTech Solutions', avatar: '', quote: 'CloudFlow redujo nuestro cycle time un 35% en el primer trimestre. La automatización de flujos nos permite enfocarnos en lo que realmente importa: entregar producto.', rating: 5 },
      { id: uid(), name: 'Elena Ríos', role: 'VP of Product — DataPulse', avatar: '', quote: 'Probamos Jira, Asana, Monday y ClickUp. Ninguno se comparó con la flexibilidad de CloudFlow. Los reportes personalizados son un game changer para nuestros stakeholders.', rating: 5 },
      { id: uid(), name: 'Daniel Nakamura', role: 'Engineering Manager — ScaleOps', avatar: '', quote: 'La API abierta nos permitió integrar CloudFlow con nuestro pipeline de CI/CD sin fricción. Ahora tenemos visibilidad completa desde el ticket hasta producción.', rating: 5 },
    ],
  });
}

function createSaasFAQ(): FAQSection {
  return createFAQ({
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber sobre CloudFlow',
    items: [
      { id: uid(), question: '¿Cuánto dura la prueba gratuita?', answer: 'Ofrecemos 14 días completos de prueba gratuita en todos los planes. No necesitas tarjeta de crédito para empezar y no se realizan cargos hasta que decidas suscribirte.' },
      { id: uid(), question: '¿Puedo cambiar de plan en cualquier momento?', answer: 'Sí, puedes upgrade o downgrade tu plan en cualquier momento desde la configuración de tu cuenta. Los cambios se aplican inmediatamente y ajustamos el cobro de forma proporcional.' },
      { id: uid(), question: '¿Cómo gestiona CloudFlow la seguridad de mis datos?', answer: 'Todos los datos se encriptan en tránsito (TLS 1.3) y en reposo (AES-256). Cumplimos con GDPR, SOC 2 Type II y realizamos auditorías de seguridad trimestrales. También ofrecemos SSO con SAML 2.0 y autenticación MFA.' },
      { id: uid(), question: '¿Puedo importar mis proyectos desde otras herramientas?', answer: 'Ofrecemos importación directa desde Jira, Asana, Trello, Monday y ClickUp con un solo clic. También puedes importar datos mediante CSV o nuestra API. El proceso de migración suele completarse en menos de 5 minutos.' },
    ],
  });
}

function createSaasCTA(): CTASection {
  return createCTA({
    title: 'Empieza a gestionar mejor tus proyectos hoy',
    subtitle: 'Únete a más de 4,000 equipos que ya han transformado su productividad con CloudFlow. Prueba gratuita de 14 días, sin tarjeta de crédito.',
    ctaText: 'Comenzar Prueba Gratuita',
    ctaLink: '#precios',
    backgroundStyle: 'gradient',
    backgroundImage: '',
  });
}

function createSaasFooter(): FooterSection {
  return createFooter({
    brandName: 'CloudFlow',
    brandDescription: 'La plataforma de gestión de proyectos que tu equipo merece. Automatiza, colabora y entrega resultados.',
    columns: [
      { title: 'Producto', links: [{ label: 'Características', url: '#' }, { label: 'Integraciones', url: '#' }, { label: 'API', url: '#' }, { label: 'Changelog', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Carreras', url: '#' }, { label: 'Contacto', url: '#' }] },
      { title: 'Recursos', links: [{ label: 'Documentación', url: '#' }, { label: 'Centro de Ayuda', url: '#' }, { label: 'Seminarios Web', url: '#' }, { label: 'Estado del Servicio', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'github', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} CloudFlow Inc. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. PORTFOLIO TEMPLATE — "Studio Creativo"
// ═══════════════════════════════════════════════════════════════

function createPortfolioHero(): HeroSection {
  return createHero({
    title: 'Diseño que cuenta historias',
    subtitle: 'Somos un estudio de diseño multidisciplinar que transforma ideas en experiencias visuales memorables. Branding, UI/UX, packaging y mucho más para marcas con algo que decir.',
    backgroundImage: IMG.designWork,
    overlayOpacity: 60,
    ctaText: 'Ver Proyectos',
    ctaLink: '#proyectos',
    secondaryCtaText: 'Contactar',
    secondaryCtaLink: '#contacto',
    height: 'large',
    alignment: 'center',
  });
}

function createPortfolioGallery(): GallerySection {
  return createGallery({
    title: 'Proyectos Destacados',
    subtitle: 'Una selección de nuestros trabajos más recientes',
    columns: 3,
    images: [
      { id: uid(), src: IMG.designWork, alt: 'Marca Corp — Identidad visual completa', caption: 'Marca Corp' },
      { id: uid(), src: IMG.workspace, alt: 'App Finance — Diseño de app bancaria', caption: 'App Finance' },
      { id: uid(), src: IMG.designWork, alt: 'Web E-commerce — Tienda online premium', caption: 'Web E-commerce' },
      { id: uid(), src: IMG.workspace, alt: 'Identidad Visual — Rebranding completo', caption: 'Identidad Visual' },
      { id: uid(), src: IMG.designWork, alt: 'Packaging — Línea de cosméticos artesanales', caption: 'Packaging' },
      { id: uid(), src: IMG.workspace, alt: 'UI Dashboard — Panel de analíticas SaaS', caption: 'UI Dashboard' },
    ],
  });
}

function createPortfolioStats(): StatsSection {
  return createStats({
    title: 'Números que hablan por nosotros',
    items: [
      { value: '120+', label: 'Proyectos Completados', icon: 'Briefcase' },
      { value: '45+', label: 'Clientes Satisfechos', icon: 'Heart' },
      { value: '8', label: 'Premios de Diseño', icon: 'Award' },
      { value: '6', label: 'Años de Experiencia', icon: 'Calendar' },
    ],
  });
}

function createPortfolioTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Lo que dicen nuestros clientes',
    subtitle: 'Colaboramos con marcas que buscan destacar',
    testimonials: [
      { id: uid(), name: 'Lucía Varela', role: 'Directora de Marca — Zenith Corp', avatar: '', quote: 'Studio Creativo capturó la esencia de nuestra marca de una forma que no creíamos posible. El rebranding aumentó nuestro reconocimiento un 60% en el primer año.', rating: 5 },
      { id: uid(), name: 'Pablo Guerrero', role: 'CEO — PayFlow Technologies', avatar: '', quote: 'Necesitábamos una app que transmitiera confianza y modernidad. El equipo de Studio Creativo entregó un diseño que nuestros usuarios adoran. NPS subió de 32 a 67.', rating: 5 },
      { id: uid(), name: 'Carmen Ruiz', role: 'Fundadora — Natura Cosméticos', avatar: '', quote: 'El packaging que diseñaron para nuestra línea artesanal fue clave para entrar en 5 nuevas tiendas. Cada detalle transmite la calidad de nuestros productos.', rating: 5 },
    ],
  });
}

function createPortfolioCTA(): CTASection {
  return createCTA({
    title: '¿Tienes un proyecto en mente?',
    subtitle: 'Nos encantaría escucharte. Cuéntanos tu idea y juntos la hacemos realidad.',
    ctaText: 'Hablemos de tu proyecto',
    ctaLink: '#contacto',
    backgroundStyle: 'gradient',
    backgroundImage: '',
  });
}

function createPortfolioFooter(): FooterSection {
  return createFooter({
    brandName: 'Studio Creativo',
    brandDescription: 'Estudio de diseño multidisciplinar especializado en branding, UI/UX y packaging para marcas con personalidad.',
    columns: [
      { title: 'Servicios', links: [{ label: 'Marca Corporativa', url: '#' }, { label: 'Diseño UI/UX', url: '#' }, { label: 'Empaques', url: '#' }, { label: 'Diseño Web', url: '#' }] },
      { title: 'Estudio', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Proceso', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Contacto', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'dribbble', url: '#' },
      { platform: 'behance', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} Studio Creativo. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. AGENCY TEMPLATE — "Nexus Digital"
// ═══════════════════════════════════════════════════════════════

function createAgencyHero(): HeroSection {
  return createHero({
    title: 'Impulsamos marcas digitales',
    subtitle: 'Somos una agencia digital de 50+ profesionales especializados en estrategia, diseño y tecnología. Ayudamos a empresas a crecer y conectar con su audiencia en el mundo digital.',
    backgroundImage: IMG.modernOffice,
    overlayOpacity: 65,
    ctaText: 'Solicitar Presupuesto',
    ctaLink: '#contacto',
    secondaryCtaText: 'Ver Casos de Éxito',
    secondaryCtaLink: '#proyectos',
    height: 'large',
    alignment: 'center',
  });
}

function createAgencyAbout(): AboutSection {
  return createAbout({
    title: 'Una agencia con visión global',
    description: 'Fundada en 2016, Nexus Digital nació con la misión de democratizar el acceso a estrategias digitales de alto impacto. Hoy somos un equipo de más de 50 profesionales con sede en Madrid y presencia en 12 países. Combinamos creatividad, datos y tecnología para crear experiencias digitales que generan resultados medibles para nuestros clientes.',
    image: IMG.teamWorking,
    imagePosition: 'right',
    stats: [
      { value: '200+', label: 'Proyectos Lanzados' },
      { value: '50+', label: 'Marcas Confían en Nosotros' },
      { value: '12', label: 'Países de Presencia' },
      { value: '8', label: 'Años de Experiencia' },
    ],
  });
}

function createAgencyFeatures(): FeaturesSection {
  return createFeatures({
    title: 'Servicios Integrales',
    subtitle: 'Estrategia, creatividad y tecnología bajo un mismo techo',
    columns: 3,
    features: [
      { id: uid(), icon: 'Palette', title: 'Marca Corporativa', description: 'Construcción de marcas desde la estrategia hasta la identidad visual. Naming, logo, guidelines y posicionamiento de marca completo.' },
      { id: uid(), icon: 'Monitor', title: 'Diseño Web', description: 'Sitios web y aplicaciones web de alto rendimiento con diseño responsive, animaciones y optimización SEO integrada.' },
      { id: uid(), icon: 'Megaphone', title: 'Marketing Digital', description: 'Campañas de performance en Google Ads, Meta Ads y LinkedIn Ads con ROAS optimizado y reportes en tiempo real.' },
      { id: uid(), icon: 'Search', title: 'SEO & SEM', description: 'Posicionamiento orgánico y de pago con estrategia de contenidos, link building técnico y auditorías SEO completas.' },
      { id: uid(), icon: 'FileText', title: 'Estrategia de Contenido', description: 'Creación de contenido estratégico: blogs, videos, podcasts y materiales descargables que atraen y convierten.' },
      { id: uid(), icon: 'Share2', title: 'Redes Sociales', description: 'Gestión profesional de redes sociales con calendarios editoriales, community management y social listening.' },
    ],
  });
}

function createAgencyGallery(): GallerySection {
  return createGallery({
    title: 'Nuestros Proyectos',
    subtitle: 'Casos de éxito que hablan por sí solos',
    columns: 3,
    images: [
      { id: uid(), src: IMG.modernOffice, alt: 'Proyecto para Zenith Corp — Rebranding digital completo', caption: 'Zenith Corp — Rebranding' },
      { id: uid(), src: IMG.teamWorking, alt: 'Plataforma SaaS para DataPulse', caption: 'DataPulse — Plataforma SaaS' },
      { id: uid(), src: IMG.modernOffice, alt: 'Campaña digital para ModaLux', caption: 'ModaLux — Campaña Digital' },
      { id: uid(), src: IMG.teamWorking, alt: 'App móvil para FitLife', caption: 'FitLife — App Móvil' },
      { id: uid(), src: IMG.modernOffice, alt: 'E-commerce para NaturalShop', caption: 'NaturalShop — E-commerce' },
      { id: uid(), src: IMG.teamWorking, alt: 'Portal corporativo para BuildMax', caption: 'BuildMax — Portal Web' },
    ],
  });
}

function createAgencyStats(): StatsSection {
  return createStats({
    title: 'Resultados que generan impacto',
    items: [
      { value: '200+', label: 'Proyectos Entregados', icon: 'Rocket' },
      { value: '50+', label: 'Marcas Potenciadas', icon: 'TrendingUp' },
      { value: '€2M+', label: 'Ingresos Generados', icon: 'Euro' },
      { value: '4.9/5', label: 'Satisfacción del Cliente', icon: 'Star' },
    ],
  });
}

function createAgencyTeam(): TeamSection {
  return createTeam({
    title: 'Líderes que inspiran al equipo',
    subtitle: 'Profesionales con experiencia en multinacionales y startups de alto crecimiento',
    members: [
      { id: uid(), name: 'Marcos Delgado', role: 'CEO & Co-Fundador', avatar: '', bio: 'Ex-Director de Digital en BBVA. Más de 18 años liderando transformaciones digitales en empresas del IBEX-35. MBA por IE Business School.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
      { id: uid(), name: 'Valentina Orozco', role: 'Directora Creativa', avatar: '', bio: 'Premiada diseñadora con paso por Ogilvy y Pentagram. Especialista en branding emocional y narrativa visual con más de 12 años de trayectoria internacional.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'dribbble', url: '#' }] },
      { id: uid(), name: 'Héctor Kim', role: 'Tech Lead', avatar: '', bio: 'Full-stack architect con experiencia en Google y Spotify. Lidera un equipo de 15 desarrolladores especializados en React, Next.js y cloud infrastructure.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'github', url: '#' }] },
      { id: uid(), name: 'Sara Martín', role: 'Directora de Marketing', avatar: '', bio: 'Growth marketer certificada por Google y HubSpot. Ha gestionado presupuestos de más de €1M en campañas digitales con ROI demostrado para más de 30 marcas.', socials: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
    ],
  });
}

function createAgencyCTA(): CTASection {
  return createCTA({
    title: '¿Listo para llevar tu marca al siguiente nivel?',
    subtitle: 'Solicita una consulta gratuita de 30 minutos con nuestro equipo estratégico. Analizamos tu situación y te presentamos un plan de acción personalizado.',
    ctaText: 'Solicitar Presupuesto',
    ctaLink: '#contacto',
    backgroundStyle: 'gradient',
    backgroundImage: '',
  });
}

function createAgencyFooter(): FooterSection {
  return createFooter({
    brandName: 'Nexus Digital',
    brandDescription: 'Agencia digital de 50+ profesionales especializada en branding, diseño web, marketing digital y tecnología. Presencia en 12 países.',
    columns: [
      { title: 'Servicios', links: [{ label: 'Marca Corporativa', url: '#' }, { label: 'Diseño Web', url: '#' }, { label: 'Marketing Digital', url: '#' }, { label: 'SEO & SEM', url: '#' }, { label: 'Estrategia de Contenido', url: '#' }, { label: 'Redes Sociales', url: '#' }] },
      { title: 'Agencia', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Equipo', url: '#' }, { label: 'Casos de Éxito', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Carreras', url: '#' }] },
      { title: 'Contacto', links: [{ label: 'Solicitar Presupuesto', url: '#' }, { label: 'Madrid, España', url: '#' }, { label: 'hola@nexusdigital.es', url: '#' }, { label: '+34 91 555 00 00', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} Nexus Digital Agency. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. E-COMMERCE TEMPLATE — "Market Luxe"
// ═══════════════════════════════════════════════════════════════

function createEcommerceHero(): HeroSection {
  return createHero({
    title: 'Estilo que marca tendencia',
    subtitle: 'Descubre una curated selection de moda, accesorios y lifestyle de las marcas más exclusivas. Envío gratis en pedidos superiores a 50€ y devoluciones sin complicaciones.',
    backgroundImage: IMG.designWork,
    overlayOpacity: 55,
    ctaText: 'Explorar Colección',
    ctaLink: '#colecciones',
    secondaryCtaText: 'Ofertas Especiales',
    secondaryCtaLink: '#ofertas',
    height: 'large',
    alignment: 'center',
  });
}

function createEcommerceFeatures(): FeaturesSection {
  return createFeatures({
    title: '¿Por qué elegirnos?',
    subtitle: 'La experiencia de compra que mereces, con los beneficios que esperas',
    columns: 3,
    features: [
      { id: uid(), icon: 'Truck', title: 'Envío Gratis', description: 'Envío gratuito en todos los pedidos superiores a 50€. Entrega en 24-48h en Península y 3-5 días en Baleares y Canarias.' },
      { id: uid(), icon: 'Lock', title: 'Pago 100% Seguro', description: 'Todas las transacciones protegidas con encriptación SSL y pasarelas de pago certificadas PCI DSS. Visa, Mastercard, PayPal y Bizum.' },
      { id: uid(), icon: 'RotateCcw', title: 'Devoluciones 30 Días', description: 'Si no estás satisfecho, devuélvelo sin preguntas en un plazo de 30 días. Etiqueta de devolución prepagada incluida.' },
      { id: uid(), icon: 'Headphones', title: 'Atención Premium', description: 'Equipo de estilistas personales disponible por chat, email y teléfono de lunes a sábado de 9:00 a 21:00h.' },
      { id: uid(), icon: 'Gift', title: 'Programa de Puntos', description: 'Acumula puntos con cada compra y canjéalos por descuentos exclusivos, envíos gratis y acceso anticipado a nuevas colecciones.' },
      { id: uid(), icon: 'Zap', title: 'Entrega Express', description: 'Servicio de entrega express en 2-4h en Madrid y Barcelona para pedidos realizados antes de las 13:00h de lunes a viernes.' },
    ],
  });
}

function createEcommerceGallery(): GallerySection {
  return createGallery({
    title: 'Colecciones Destacadas',
    subtitle: 'Inspírate con las últimas tendencias y novedades de temporada',
    columns: 3,
    images: [
      { id: uid(), src: IMG.designWork, alt: 'Colección Primavera-Verano 2025', caption: 'Primavera-Verano 2025' },
      { id: uid(), src: IMG.workspace, alt: 'Accesorios Premium', caption: 'Accesorios Premium' },
      { id: uid(), src: IMG.designWork, alt: 'Streetwear Essentials', caption: 'Streetwear Essentials' },
      { id: uid(), src: IMG.workspace, alt: 'Lifestyle & Home', caption: 'Lifestyle & Home' },
      { id: uid(), src: IMG.designWork, alt: 'Limited Edition', caption: 'Edición Limitada' },
      { id: uid(), src: IMG.workspace, alt: 'New Arrivals', caption: 'Recién Llegados' },
    ],
  });
}

function createEcommercePricing(): PricingSection {
  return createPricing({
    title: 'Programa VIP Market Luxe',
    subtitle: 'Únete a nuestro club de exclusividad y desbloquea ventajas únicas',
    plans: [
      { id: uid(), name: 'Básico', price: '0', period: '', description: 'Empieza a acumular beneficios desde tu primera compra', features: ['Acumulación de puntos x1', 'Acceso a ventas privadas', 'Newsletter semanal', 'Envío gratis en +80€'], highlighted: false, ctaText: 'Registrarse Gratis' },
      { id: uid(), name: 'Premium', price: '9.99', period: '/mes', description: 'La opción favorita de nuestros clientes más fieles', features: ['Todo en Básico', 'Puntos x2 en cada compra', 'Descuento del 15% permanente', 'Envío gratis siempre', 'Acceso anticipado a rebajas', 'Regalo de cumpleaños exclusivo'], highlighted: true, ctaText: 'Hacerse Premium' },
      { id: uid(), name: 'Elite', price: '24.99', period: '/mes', description: 'La máxima exclusividad para los más exigentes', features: ['Todo en Premium', 'Puntos x3 en cada compra', 'Descuento del 25% permanente', 'Entrega express gratis', 'Estilista personal asignado', 'Invitaciones a eventos VIP', 'Early access a colecciones nuevas'], highlighted: false, ctaText: 'Únete a Elite' },
    ],
  });
}

function createEcommerceTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Opiniones de nuestros clientes',
    subtitle: 'Más de 25,000 compradores satisfechos nos avalan',
    testimonials: [
      { id: uid(), name: 'Cristina Navarro', role: 'Clienta Premium desde 2023', avatar: '', quote: 'La calidad de las prendas es excepcional y el envío es rapidísimo. Desde que me hice Premium, no compro en ninguna otra tienda online. El estilista personal es un plus increíble.', rating: 5 },
      { id: uid(), name: 'Andrés Molina', role: 'Comprador verificado', avatar: '', quote: 'Pedí una chaqueta para un evento de última hora y me llegó al día siguiente con la entrega express. La calidad superó mis expectativas y el proceso de devolución de otra prenda fue facilísimo.', rating: 5 },
      { id: uid(), name: 'Marta Sánchez', role: 'Clienta Elite', avatar: '', quote: 'Como clienta Elite, la experiencia es de otro nivel. Acceso a colecciones antes que nadie, el estilista personal me ayuda a elegir looks completos y los puntos se acumulan rapidísimo. Lo recomiendo 100%.', rating: 5 },
    ],
  });
}

function createEcommerceFAQ(): FAQSection {
  return createFAQ({
    title: 'Preguntas Frecuentes',
    subtitle: 'Resolvemos tus dudas para que compres con total confianza',
    items: [
      { id: uid(), question: '¿Cuáles son los plazos de envío?', answer: 'Envío estándar: 24-48h en Península, 3-5 días en Baleares y Canarias. Entrega express: 2-4h en Madrid y Barcelona para pedidos antes de las 13:00h. Todos los pedidos incluyen seguimiento en tiempo real.' },
      { id: uid(), question: '¿Cómo funcionan las devoluciones?', answer: 'Tienes 30 días desde la recepción para devolver cualquier artículo en su estado original. Solo tienes que solicitar la devolución desde tu cuenta, imprimir la etiqueta prepagada y dejar el paquete en cualquier punto de recogida. El reembolso se procesa en 3-5 días laborables.' },
      { id: uid(), question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos Visa, Mastercard, American Express, PayPal, Bizum, Apple Pay y Google Pay. También ofrecemos pago en 3 cuotas sin intereses con Klarna para compras superiores a 60€.' },
      { id: uid(), question: '¿Cómo elegir mi talla correcta?', answer: 'Cada producto incluye una guía de tallas detallada con medidas en centímetros. Si estás entre dos tallas, te recomendamos elegir la talla superior. Nuestro equipo de atención al cliente puede ayudarte con cualquier duda sobre tallas por chat o teléfono.' },
    ],
  });
}

function createEcommerceFooter(): FooterSection {
  return createFooter({
    brandName: 'Market Luxe',
    brandDescription: 'Tu destino de moda y lifestyle premium. Más de 200 marcas exclusivas con envío gratis y devoluciones sin complicaciones.',
    columns: [
      { title: 'Comprar', links: [{ label: 'Novedades', url: '#' }, { label: 'Mujer', url: '#' }, { label: 'Hombre', url: '#' }, { label: 'Accesorios', url: '#' }, { label: 'Ofertas', url: '#' }] },
      { title: 'Ayuda', links: [{ label: 'Guía de Tallas', url: '#' }, { label: 'Envíos', url: '#' }, { label: 'Devoluciones', url: '#' }, { label: 'Métodos de Pago', url: '#' }, { label: 'Contacto', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Sobre Market Luxe', url: '#' }, { label: 'Programa VIP', url: '#' }, { label: 'Sostenibilidad', url: '#' }, { label: 'Trabaja con Nosotros', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'tiktok', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'pinterest', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} Market Luxe. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 6. BLOG TEMPLATE — "El Rincón Digital"
// ═══════════════════════════════════════════════════════════════

function createBlogHero(): HeroSection {
  return createHero({
    title: 'Ideas que inspiran acción',
    subtitle: 'Artículos sobre tecnología, diseño, marketing y productividad escritos por profesionales del sector. Contenido profundo, sin fillers, directamente applicable a tu día a día profesional.',
    backgroundImage: IMG.workspace,
    overlayOpacity: 65,
    ctaText: 'Explorar Artículos',
    ctaLink: '#articulos',
    secondaryCtaText: 'Suscribirse al Newsletter',
    secondaryCtaLink: '#newsletter',
    height: 'large',
    alignment: 'center',
  });
}

function createBlogFeatures(): FeaturesSection {
  return createFeatures({
    title: 'Categorías',
    subtitle: 'Explora nuestro contenido por temática',
    columns: 3,
    features: [
      { id: uid(), icon: 'Cpu', title: 'Tecnología', description: 'Noticias, análisis y tutoriales sobre las últimas tendencias en desarrollo web, inteligencia artificial, cloud computing y ciberseguridad.' },
      { id: uid(), icon: 'Palette', title: 'Diseño', description: 'Recursos de diseño UI/UX, tips de Figma, tendencias visuales, teoría del color y entrevistas a diseñadores destacados del sector.' },
      { id: uid(), icon: 'Megaphone', title: 'Marketing', description: 'Estrategias de growth marketing, SEO avanzado, analítica digital, casos de estudio reales y guías paso a paso para aumentar tu tráfico.' },
      { id: uid(), icon: 'Building', title: 'Negocios', description: 'Emprendimiento, modelos de negocio, leadership, gestión de equipos y entrevistas con fundadores y CEOs de empresas tecnológicas.' },
      { id: uid(), icon: 'Target', title: 'Productividad', description: 'Herramientas, frameworks de trabajo, gestión del tiempo, automatización y hábitos de profesionales de alto rendimiento.' },
      { id: uid(), icon: 'Brain', title: 'Inteligencia Artificial', description: 'Deep dives en IA generativa, machine learning, prompts efectivos, automatizaciones con IA y el impacto de la inteligencia artificial en los negocios.' },
    ],
  });
}

function createBlogGallery(): GallerySection {
  return createGallery({
    title: 'Artículos Destacados',
    subtitle: 'Los posts más leídos y compartidos de nuestros colaboradores',
    columns: 3,
    images: [
      { id: uid(), src: IMG.techAbstract, alt: 'Artículo sobre IA generativa', caption: 'Cómo la IA está transformando el diseño web en 2025' },
      { id: uid(), src: IMG.dashboard, alt: 'Artículo sobre productividad', caption: '7 frameworks de productividad que usan los top performers' },
      { id: uid(), src: IMG.workspace, alt: 'Artículo sobre diseño', caption: 'Guía completa de design tokens para sistemas de diseño' },
      { id: uid(), src: IMG.techAbstract, alt: 'Artículo sobre marketing', caption: 'SEO en la era de la IA: Lo que funciona realmente en 2025' },
      { id: uid(), src: IMG.dashboard, alt: 'Artículo sobre tecnología', caption: 'Next.js 16 vs Remix 3: Comparativa definitiva para 2025' },
      { id: uid(), src: IMG.workspace, alt: 'Artículo sobre negocios', caption: 'De lado project a SaaS: Lecciones de mi primera startup' },
    ],
  });
}

function createBlogTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Lo que dicen nuestros lectores',
    subtitle: 'Una comunidad de más de 15,000 profesionales comparte sus opiniones',
    testimonials: [
      { id: uid(), name: 'Raúl Fernández', role: 'Frontend Developer — TechCorp', avatar: '', quote: 'El Rincón Digital es mi fuente de referencia para mantenerme actualizado. Los artículos técnicos tienen una profundidad que no encuentro en ningún otro blog en español.', rating: 5 },
      { id: uid(), name: 'Julia Domínguez', role: 'Head of Marketing — ScaleUp', avatar: '', quote: 'Los artículos de marketing y productividad me han dado ideas que he implementado directamente en mi equipo. Contenido práctico y bien investigado, sin tonterías.', rating: 5 },
      { id: uid(), name: 'Tomás Herrera', role: 'Diseñador UX Senior', avatar: '', quote: 'La sección de diseño es impresionante. Cada artículo te enseña algo nuevo y aplicable. La guía de design tokens cambió completamente mi forma de trabajar.', rating: 5 },
    ],
  });
}

function createBlogCTA(): CTASection {
  return createCTA({
    title: 'No te pierdas ningún artículo',
    subtitle: 'Suscríbete a nuestro newsletter semanal y recibe los mejores artículos directamente en tu bandeja de entrada. Sin spam, solo contenido de valor. Más de 15,000 profesionales ya lo leen.',
    ctaText: 'Suscríbete al Newsletter',
    ctaLink: '#newsletter',
    backgroundStyle: 'gradient',
    backgroundImage: '',
  });
}

function createBlogFooter(): FooterSection {
  return createFooter({
    brandName: 'El Rincón Digital',
    brandDescription: 'Blog independiente sobre tecnología, diseño, marketing y productividad. Contenido profesional escrito por y para profesionales del sector digital.',
    columns: [
      { title: 'Categorías', links: [{ label: 'Tecnología', url: '#' }, { label: 'Diseño', url: '#' }, { label: 'Marketing', url: '#' }, { label: 'Negocios', url: '#' }, { label: 'Productividad', url: '#' }, { label: 'Inteligencia Artificial', url: '#' }] },
      { title: 'Recursos', links: [{ label: 'Newsletter', url: '#' }, { label: 'Guías Gratuitas', url: '#' }, { label: 'Plantillas', url: '#' }, { label: 'Herramientas', url: '#' }] },
      { title: 'Acerca de', links: [{ label: 'Sobre el Blog', url: '#' }, { label: 'Colaboradores', url: '#' }, { label: 'Contacto', url: '#' }, { label: 'Publicitar', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} El Rincón Digital. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 7. LANDING TEMPLATE — "TechStart" (Generic)
// ═══════════════════════════════════════════════════════════════

function createLandingHero(): HeroSection {
  return createHero({
    title: 'Construye el futuro de tu startup',
    subtitle: 'La plataforma integral que acelera el crecimiento de tu negocio digital. Desde el MVP hasta la escala global, con herramientas de analytics, automatización y colaboración que se adaptan a cada etapa.',
    backgroundImage: IMG.techAbstract,
    overlayOpacity: 60,
    ctaText: 'Comenzar Gratis',
    ctaLink: '#precios',
    secondaryCtaText: 'Ver Demo',
    secondaryCtaLink: '#demo',
    height: 'large',
    alignment: 'center',
  });
}

function createLandingFeatures(): FeaturesSection {
  return createFeatures({
    title: 'Todo lo que necesitas para escalar',
    subtitle: 'Herramientas de startup probadas por cientos de fundadores que ya han alcanzado product-market fit',
    columns: 3,
    features: [
      { id: uid(), icon: 'Zap', title: 'Time-to-Market Récord', description: 'Lanza tu MVP en días, no en meses. Templates preconfigurados, CI/CD integrado y deployment automático en la nube.' },
      { id: uid(), icon: 'LineChart', title: 'Analytics en Tiempo Real', description: 'Dashboards con métricas de adquisición, activación, retención y revenue. Datos que te permiten tomar decisiones basadas en evidencia.' },
      { id: uid(), icon: 'Shield', title: 'Seguridad Enterprise', description: 'Infraestructura certificada SOC 2 con encriptación end-to-end, SSO, RBAC y cumplimiento GDPR desde el día uno.' },
      { id: uid(), icon: 'Users', title: 'Colaboración Equipos', description: 'Espacios de trabajo compartidos con control granular de permisos, comentarios en contexto y async-first para equipos remotos.' },
      { id: uid(), icon: 'Workflow', title: 'Automatización Workflows', description: 'Automatiza onboarding de usuarios, notificaciones, reportes y más con un editor visual sin código y triggers personalizados.' },
      { id: uid(), icon: 'Puzzle', title: 'Ecosistema de Integraciones', description: 'Marketplace con 150+ apps: Stripe, HubSpot, Slack, Intercom, Segment y más. API abierta para integraciones custom.' },
    ],
  });
}

function createLandingAbout(): AboutSection {
  return createAbout({
    title: 'Nacimos para resolver un problema real',
    description: 'TechStart nació de la frustración de tres fundadores que construyeron 5 startups entre todos. En cada una, perdieron cientos de horas en infraestructura, integraciones y herramientas que no se comunicaban entre sí. Decidimos construir la plataforma que nos habría gustado tener: una sola herramienta que une analytics, automatización y colaboración en un solo lugar. Hoy, más de 2,000 startups confían en nosotros para escalar sus operaciones.',
    image: IMG.modernOffice,
    imagePosition: 'right',
    stats: [
      { value: '2,000+', label: 'Startups Activas' },
      { value: '$150M+', label: 'Ingresos de Clientes' },
      { value: '99.9%', label: 'Uptime Garantizado' },
    ],
  });
}

function createLandingTestimonials(): TestimonialsSection {
  return createTestimonials({
    title: 'Fundadores que ya escalan con TechStart',
    subtitle: 'Historias reales de startups que transformaron su crecimiento',
    testimonials: [
      { id: uid(), name: 'Adrián Vega', role: 'Co-Founder & CEO — ShipFast', avatar: '', quote: 'TechStart nos permitió lanzar nuestra beta en 2 semanas en vez de 2 meses. La automatización de onboarding nos ahorró 20 horas semanales de trabajo manual del equipo.', rating: 5 },
      { id: uid(), name: 'Natalia Kim', role: 'CTO — DataForge', avatar: '', quote: 'La integración con nuestro stack existente fue fluida. En una tarde teníamos Stripe, Intercom y Segment conectados. Los analytics son los mejores que hemos visto en una herramienta de este tipo.', rating: 5 },
      { id: uid(), name: 'Roberto Salazar', role: 'Head of Growth — QuickHire', avatar: '', quote: 'Pasamos de 500 a 5,000 usuarios en 3 meses gracias a la visibilidad que nos dieron los dashboards de TechStart. Saber exactamente dónde estaba la fricción en nuestro funnel fue clave.', rating: 5 },
    ],
  });
}

function createLandingCTA(): CTASection {
  return createCTA({
    title: '¿Listo para construir algo extraordinario?',
    subtitle: 'Únete a 2,000+ startups que ya están escalando con TechStart. Prueba gratuita de 14 días, sin tarjeta de crédito.',
    ctaText: 'Crear Cuenta Gratis',
    ctaLink: '#precios',
    backgroundStyle: 'gradient',
    backgroundImage: '',
  });
}

function createLandingFooter(): FooterSection {
  return createFooter({
    brandName: 'TechStart',
    brandDescription: 'La plataforma integral para startups que quieren escalar rápido. Analytics, automatización y colaboración en un solo lugar.',
    columns: [
      { title: 'Producto', links: [{ label: 'Características', url: '#' }, { label: 'Precios', url: '#' }, { label: 'Integraciones', url: '#' }, { label: 'Roadmap', url: '#' }, { label: 'Changelog', url: '#' }] },
      { title: 'Recursos', links: [{ label: 'Documentación', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Guías para Startups', url: '#' }, { label: 'Referencia de API', url: '#' }] },
      { title: 'Empresa', links: [{ label: 'Sobre Nosotros', url: '#' }, { label: 'Carreras', url: '#' }, { label: 'Contacto', url: '#' }, { label: 'Socios', url: '#' }] },
    ],
    socialLinks: [
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'github', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} TechStart Inc. Todos los derechos reservados.`,
  });
}

// ═══════════════════════════════════════════════════════════════
// Default Sections per Template
// ═══════════════════════════════════════════════════════════════

export function createDefaultSections(template: PageTemplate): PageSection[] {
  const sectionMap: Record<PageTemplate, () => PageSection[]> = {
    landing: () => [
      createLandingHero(),
      createLandingFeatures(),
      createLandingAbout(),
      createLandingTestimonials(),
      createLandingCTA(),
      createLandingFooter(),
    ],
    portfolio: () => [
      createPortfolioHero(),
      createPortfolioGallery(),
      createPortfolioStats(),
      createPortfolioTestimonials(),
      createPortfolioCTA(),
      createPortfolioFooter(),
    ],
    restaurant: () => [
      createRestaurantHero(),
      createRestaurantFeatures(),
      createRestaurantAbout(),
      createRestaurantTestimonials(),
      createRestaurantGallery(),
      createRestaurantContact(),
      createRestaurantFooter(),
    ],
    saas: () => [
      createSaasHero(),
      createSaasFeatures(),
      createSaasPricing(),
      createSaasTestimonials(),
      createSaasFAQ(),
      createSaasCTA(),
      createSaasFooter(),
    ],
    agency: () => [
      createAgencyHero(),
      createAgencyAbout(),
      createAgencyFeatures(),
      createAgencyGallery(),
      createAgencyStats(),
      createAgencyTeam(),
      createAgencyCTA(),
      createAgencyFooter(),
    ],
    ecommerce: () => [
      createEcommerceHero(),
      createEcommerceFeatures(),
      createEcommerceGallery(),
      createEcommercePricing(),
      createEcommerceTestimonials(),
      createEcommerceFAQ(),
      createEcommerceFooter(),
    ],
    blog: () => [
      createBlogHero(),
      createBlogFeatures(),
      createBlogGallery(),
      createBlogTestimonials(),
      createBlogCTA(),
      createBlogFooter(),
    ],
  };

  const creator = sectionMap[template] || sectionMap.landing;
  return creator();
}

// ═══════════════════════════════════════════════════════════════
// Default Theme
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_THEMES: Record<PageTemplate, PageTheme> = {
  landing: { primaryColor: '#0F766E', secondaryColor: '#134E4A', accentColor: '#F59E0B', backgroundColor: '#FFFFFF', textColor: '#1F2937', headingFont: 'Inter', bodyFont: 'Inter', borderRadius: 'medium', style: 'modern' },
  portfolio: { primaryColor: '#7C3AED', secondaryColor: '#5B21B6', accentColor: '#EC4899', backgroundColor: '#FFFFFF', textColor: '#1F2937', headingFont: 'Poppins', bodyFont: 'Inter', borderRadius: 'medium', style: 'modern' },
  restaurant: { primaryColor: '#DC2626', secondaryColor: '#991B1B', accentColor: '#F59E0B', backgroundColor: '#FEFCE8', textColor: '#292524', headingFont: 'Playfair Display', bodyFont: 'Lato', borderRadius: 'large', style: 'classic' },
  saas: { primaryColor: '#2563EB', secondaryColor: '#1D4ED8', accentColor: '#06B6D4', backgroundColor: '#FFFFFF', textColor: '#1E293B', headingFont: 'Inter', bodyFont: 'Inter', borderRadius: 'medium', style: 'modern' },
  agency: { primaryColor: '#EA580C', secondaryColor: '#C2410C', accentColor: '#0EA5E9', backgroundColor: '#FFFFFF', textColor: '#18181B', headingFont: 'Space Grotesk', bodyFont: 'Inter', borderRadius: 'small', style: 'bold' },
  ecommerce: { primaryColor: '#059669', secondaryColor: '#047857', accentColor: '#F43F5E', backgroundColor: '#FFFFFF', textColor: '#1F2937', headingFont: 'Inter', bodyFont: 'Inter', borderRadius: 'medium', style: 'modern' },
  blog: { primaryColor: '#B45309', secondaryColor: '#92400E', accentColor: '#0D9488', backgroundColor: '#FFFBEB', textColor: '#292524', headingFont: 'Merriweather', bodyFont: 'Source Sans 3', borderRadius: 'medium', style: 'classic' },
};

export function getDefaultTheme(template: PageTemplate): PageTheme {
  return { ...DEFAULT_THEMES[template] };
}

// ═══════════════════════════════════════════════════════════════
// Font Options
// ═══════════════════════════════════════════════════════════════

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
