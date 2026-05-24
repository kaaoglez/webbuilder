// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Default Templates (Page-based Builder)
// ═══════════════════════════════════════════════════════════════

import type {
  PageSection, PageTemplate, SectionType, PageTheme,
  HeroSection, FeaturesSection, AboutSection, TestimonialsSection, PricingSection, CTASection, ContactSection, FooterSection, GallerySection, FAQSection, StatsSection, TeamSection,
  NavbarSection, BlogListSection, ServicesSection, VideoSection, NewsletterSection, SocialFeedSection, MapEmbedSection, CountdownSection, TabsSection, AccordionSection, TimelineSection, TestimonialSliderSection,
} from './builder-types';

const uid = () => Math.random().toString(36).slice(2, 10);

// ─────────────────────────────────────────────────────────────
// Section Creator Functions (EXISTING)
// ─────────────────────────────────────────────────────────────

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
        { id: uid(), src: '', alt: 'Proyecto 2', caption: 'Branding' },
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
        { value: '99.9%', label: 'Uptime', icon: 'Activity' },
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

// ─────────────────────────────────────────────────────────────
// Section Creator Functions (NEW)
// ─────────────────────────────────────────────────────────────

function createNavbar(overrides?: Partial<NavbarSection['data']>): NavbarSection {
  return {
    type: 'navbar',
    id: uid(),
    enabled: true,
    data: {
      brandName: 'Mi Empresa',
      logo: '',
      links: [
        { id: uid(), label: 'Inicio', url: '#', children: [] },
        { id: uid(), label: 'Servicios', url: '#services', children: [] },
        { id: uid(), label: 'Blog', url: '#blog', children: [] },
        { id: uid(), label: 'Contacto', url: '#contact', children: [] },
      ],
      ctaText: 'Empezar',
      ctaLink: '#contact',
      style: 'solid',
      showOnScroll: true,
      mobileMenu: true,
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      ...overrides,
    },
  };
}

function createBlogList(overrides?: Partial<BlogListSection['data']>): BlogListSection {
  return {
    type: 'blog_list',
    id: uid(),
    enabled: true,
    data: {
      title: 'Últimos Artículos',
      subtitle: 'Ideas, tutoriales y novedades de nuestro blog',
      layout: 'grid',
      columns: 3,
      showAuthor: true,
      showDate: true,
      showCategory: true,
      showExcerpt: true,
      readMoreText: 'Leer más',
      ...overrides,
    },
  };
}

function createServices(overrides?: Partial<ServicesSection['data']>): ServicesSection {
  return {
    type: 'services',
    id: uid(),
    enabled: true,
    data: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones profesionales adaptadas a tus necesidades',
      columns: 3,
      items: [
        { id: uid(), icon: 'Globe', title: 'Desarrollo Web', description: 'Creamos sitios web modernos, rápidos y optimizados para conversiones que reflejan la identidad de tu marca.', price: 'Desde €2,500', features: ['Diseño responsive', 'SEO optimizado', 'CMS integrado', 'Hosting incluido'], highlighted: false },
        { id: uid(), icon: 'Smartphone', title: 'Apps Móviles', description: 'Aplicaciones nativas y multiplataforma con experiencias de usuario excepcionales para iOS y Android.', price: 'Desde €5,000', features: ['iOS y Android', 'Diseño UI/UX', 'API integrada', 'Mantenimiento'], highlighted: true },
        { id: uid(), icon: 'Palette', title: 'Diseño UI/UX', description: 'Interfaces intuitivas y atractivas basadas en investigación de usuarios y mejores prácticas de la industria.', price: 'Desde €1,500', features: ['Investigación UX', 'Prototipado', 'Diseño visual', 'Testing de usabilidad'], highlighted: false },
        { id: uid(), icon: 'TrendingUp', title: 'Marketing Digital', description: 'Estrategias de marketing digital enfocadas en resultados medibles y crecimiento sostenido.', price: 'Desde €800/mes', features: ['SEO y SEM', 'Redes sociales', 'Email marketing', 'Analítica'], highlighted: false },
        { id: uid(), icon: 'ShieldCheck', title: 'Consultoría Tech', description: 'Asesoría técnica para la transformación digital y adopción de nuevas tecnologías.', price: 'Desde €100/hora', features: ['Auditoría técnica', 'Arquitectura', 'Cloud computing', 'DevOps'], highlighted: false },
        { id: uid(), icon: 'PenTool', title: 'Branding', description: 'Creación y fortalecimiento de marca con identidad visual coherente y memorable.', price: 'Desde €2,000', features: ['Logo', 'Identidad visual', 'Guía de marca', 'Papelería'], highlighted: false },
      ],
      ...overrides,
    },
  };
}

function createVideo(overrides?: Partial<VideoSection['data']>): VideoSection {
  return {
    type: 'video',
    id: uid(),
    enabled: true,
    data: {
      url: '',
      title: 'Conoce Nuestra Plataforma',
      autoplay: false,
      muted: true,
      showControls: true,
      aspectRatio: '16:9',
      overlayText: '',
      overlayEnabled: false,
      ...overrides,
    },
  };
}

function createNewsletter(overrides?: Partial<NewsletterSection['data']>): NewsletterSection {
  return {
    type: 'newsletter',
    id: uid(),
    enabled: true,
    data: {
      title: 'Mantente Informado',
      subtitle: 'Suscríbete a nuestro newsletter y recibe las últimas novedades, artículos y ofertas especiales.',
      inputPlaceholder: 'tu@email.com',
      buttonText: 'Suscribirse',
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      successMessage: '¡Gracias por suscribirte! Revisa tu bandeja de entrada.',
      ...overrides,
    },
  };
}

function createSocialFeed(overrides?: Partial<SocialFeedSection['data']>): SocialFeedSection {
  return {
    type: 'social_feed',
    id: uid(),
    enabled: true,
    data: {
      title: 'Síguenos en Redes',
      subtitle: 'Únete a nuestra comunidad en redes sociales',
      platforms: [
        { id: uid(), platform: 'twitter', url: 'https://twitter.com/miempresa', handle: '@miempresa' },
        { id: uid(), platform: 'instagram', url: 'https://instagram.com/miempresa', handle: '@miempresa' },
        { id: uid(), platform: 'linkedin', url: 'https://linkedin.com/company/miempresa', handle: 'Mi Empresa' },
        { id: uid(), platform: 'youtube', url: 'https://youtube.com/@miempresa', handle: '@miempresa' },
      ],
      layout: 'grid',
      ...overrides,
    },
  };
}

function createMapEmbed(overrides?: Partial<MapEmbedSection['data']>): MapEmbedSection {
  return {
    type: 'map_embed',
    id: uid(),
    enabled: true,
    data: {
      url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.2254348!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d4d0b5e0f%3A0xf877c5a1e2e3d5b7!2sMadrid%2C+Spain!5e0!3m2!1sen!2s!4v1234567890',
      title: 'Nuestra Ubicación',
      height: 'medium',
      customHeight: '400px',
      showMarker: true,
      markerLabel: 'Mi Empresa',
      style: 'standard',
      ...overrides,
    },
  };
}

function createCountdown(overrides?: Partial<CountdownSection['data']>): CountdownSection {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  return {
    type: 'countdown',
    id: uid(),
    enabled: true,
    data: {
      title: 'Oferta Especial',
      subtitle: 'No te pierdas esta oportunidad limitada',
      targetDate: futureDate.toISOString(),
      ctaText: 'Aprovechar Oferta',
      ctaLink: '#pricing',
      style: 'modern',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      ...overrides,
    },
  };
}

function createTabs(overrides?: Partial<TabsSection['data']>): TabsSection {
  return {
    type: 'tabs',
    id: uid(),
    enabled: true,
    data: {
      items: [
        { id: uid(), label: 'Descripción', icon: 'FileText', content: 'Detalla las características principales de tu producto o servicio. Explica cómo resuelve problemas reales de tus clientes y qué lo hace único en el mercado.' },
        { id: uid(), label: 'Características', icon: 'List', content: 'Lista las funcionalidades técnicas y de usuario más relevantes. Incluye capturas de pantalla o diagramas si es posible para facilitar la comprensión.' },
        { id: uid(), label: 'Requisitos', icon: 'CheckCircle', content: 'Especifica los requisitos técnicos, compatibilidad de navegadores, dispositivos soportados y cualquier prerrequisito para el uso.' },
        { id: uid(), label: 'Soporte', icon: 'Headphones', content: 'Describe los canales de soporte disponibles, tiempos de respuesta y recursos adicionales como documentación y tutoriales.' },
      ],
      style: 'line',
      defaultTab: 0,
      ...overrides,
    },
  };
}

function createAccordion(overrides?: Partial<AccordionSection['data']>): AccordionSection {
  return {
    type: 'accordion',
    id: uid(),
    enabled: true,
    data: {
      title: 'Preguntas y Respuestas',
      subtitle: 'Encuentra respuestas a las dudas más comunes',
      items: [
        { id: uid(), question: '¿Cuál es el proceso de trabajo?', answer: 'Nuestro proceso comienza con una reunión de descubrimiento donde entendemos tus necesidades. Luego creamos una propuesta detallada, procedemos al diseño y desarrollo, y finalizamos con pruebas exhaustivas y entrega.', defaultOpen: true },
        { id: uid(), question: '¿Cuánto tiempo toma un proyecto?', answer: 'El tiempo varía según la complejidad del proyecto. Un sitio web típico toma entre 4-8 semanas. Proyectos más complejos como aplicaciones pueden tardar de 2-6 meses.', defaultOpen: false },
        { id: uid(), question: '¿Incluyen mantenimiento?', answer: 'Todos nuestros planes incluyen un período de garantía. También ofrecemos planes de mantenimiento mensuales que incluyen actualizaciones, backups y soporte técnico.', defaultOpen: false },
        { id: uid(), question: '¿Pueden trabajar con equipos remotos?', answer: 'Sí, tenemos amplia experiencia trabajando con equipos distribuidos globalmente. Utilizamos herramientas como Slack, Notion y videollamadas para mantener una comunicación fluida.', defaultOpen: false },
        { id: uid(), question: '¿Qué garantías ofrecen?', answer: 'Ofrecemos garantía de satisfacción en todos nuestros proyectos. Si no estás satisfecho con los resultados, trabajamos en las revisiones necesarias sin costo adicional.', defaultOpen: false },
      ],
      allowMultiple: false,
      ...overrides,
    },
  };
}

function createTimeline(overrides?: Partial<TimelineSection['data']>): TimelineSection {
  return {
    type: 'timeline',
    id: uid(),
    enabled: true,
    data: {
      title: 'Nuestra Historia',
      subtitle: 'Los hitos más importantes de nuestro recorrido',
      items: [
        { id: uid(), date: 'Enero 2020', title: 'Fundación', description: 'Nace la empresa con la visión de transformar la presencia digital de las empresas.', icon: 'Rocket', side: 'left' },
        { id: uid(), date: 'Junio 2021', title: 'Primer 100 Clientes', description: 'Alcanzamos nuestro primer centenar de clientes satisfechos y expandimos el equipo.', icon: 'Users', side: 'right' },
        { id: uid(), date: 'Marzo 2022', title: 'Expansión Internacional', description: 'Abrimos oficinas en dos países adicionales y comenzamos a servir clientes en toda LATAM.', icon: 'Globe', side: 'left' },
        { id: uid(), date: 'Septiembre 2023', title: 'Premio a la Innovación', description: 'Reconocidos como una de las empresas más innovadoras del sector tecnológico.', icon: 'Award', side: 'right' },
        { id: uid(), date: 'Febrero 2024', title: '1,000 Proyectos', description: 'Celebramos la entrega de nuestro proyecto número mil y lanzamos nueva plataforma.', icon: 'TrendingUp', side: 'center' },
      ],
      style: 'alternating',
      ...overrides,
    },
  };
}

function createTestimonialSlider(overrides?: Partial<TestimonialSliderSection['data']>): TestimonialSliderSection {
  return {
    type: 'testimonial_slider',
    id: uid(),
    enabled: true,
    data: {
      title: 'Lo que Opinan Nuestros Clientes',
      subtitle: 'Historias reales de éxito',
      testimonials: [
        { id: uid(), name: 'María García', role: 'CEO, TechStart', avatar: '', quote: 'Una herramienta increíble que transformó completamente nuestra forma de trabajar. El soporte es excepcional y siempre están disponibles.', rating: 5 },
        { id: uid(), name: 'Carlos López', role: 'Director de Marketing, InnovaCo', avatar: '', quote: 'Los resultados superaron nuestras expectativas. Vimos un aumento del 300% en conversiones en solo 3 meses de uso.', rating: 5 },
        { id: uid(), name: 'Ana Martínez', role: 'Fundadora, CreativaStudio', avatar: '', quote: 'La mejor inversión que hemos hecho para nuestro negocio. La interfaz es intuitiva y poderosa al mismo tiempo.', rating: 5 },
        { id: uid(), name: 'Roberto Silva', role: 'CTO, DataFlow', avatar: '', quote: 'Implementamos la solución en menos de una semana y los resultados fueron inmediatos. Totalmente recomendable.', rating: 5 },
        { id: uid(), name: 'Elena Torres', role: 'Product Manager, NexusApp', avatar: '', quote: 'El equipo de soporte es extraordinario. Resolvieron todas nuestras dudas y personalizaron todo a nuestra medida.', rating: 5 },
      ],
      autoplay: true,
      autoplaySpeed: 5000,
      showDots: true,
      showArrows: true,
      ...overrides,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Section Registry (EXISTING + NEW)
// ─────────────────────────────────────────────────────────────

const sectionCreators: Record<SectionType, (...args: unknown[]) => PageSection> = {
  // ── Existing ──
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

  // ── NEW ──
  navbar: () => createNavbar(),
  blog_list: () => createBlogList(),
  services: () => createServices(),
  video: () => createVideo(),
  newsletter: () => createNewsletter(),
  social_feed: () => createSocialFeed(),
  map_embed: () => createMapEmbed(),
  countdown: () => createCountdown(),
  tabs: () => createTabs(),
  accordion: () => createAccordion(),
  timeline: () => createTimeline(),
  testimonial_slider: () => createTestimonialSlider(),
};

export function createSection(type: string): PageSection {
  const creator = sectionCreators[type as SectionType];
  return creator ? creator() : sectionCreators.hero();
}

// ─────────────────────────────────────────────────────────────
// Default Sections per Template (UPDATED with new sections)
// ─────────────────────────────────────────────────────────────

export function createDefaultSections(template: PageTemplate): PageSection[] {
  const sectionMap: Record<PageTemplate, SectionType[]> = {
    landing: ['navbar', 'hero', 'features', 'about', 'testimonials', 'cta', 'footer'],
    portfolio: ['navbar', 'hero', 'gallery', 'stats', 'testimonials', 'cta', 'footer'],
    restaurant: ['navbar', 'hero', 'features', 'about', 'testimonials', 'gallery', 'contact', 'footer'],
    saas: ['navbar', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
    agency: ['navbar', 'hero', 'about', 'features', 'gallery', 'stats', 'team', 'cta', 'footer'],
    ecommerce: ['navbar', 'hero', 'features', 'gallery', 'pricing', 'testimonials', 'faq', 'footer'],
    blog: ['navbar', 'hero', 'blog_list', 'newsletter', 'cta', 'footer'],
  };
  const types = sectionMap[template] || sectionMap.landing;
  return types.map((t) => createSection(t));
}

// ─────────────────────────────────────────────────────────────
// Default Theme
// ─────────────────────────────────────────────────────────────

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
