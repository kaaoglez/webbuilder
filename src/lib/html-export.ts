// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Professional HTML Export Engine
// Generates a complete, production-ready standalone HTML page
// ═══════════════════════════════════════════════════════════════

import type {
  PageData,
  PageSection,
  PageTheme,
  HeroSection,
  FeaturesSection,
  AboutSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
  ContactSection,
  GallerySection,
  FAQSection,
  StatsSection,
  TeamSection,
  FooterSection,
  SectionType,
} from '@/lib/builder-types';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function br(radius: PageTheme['borderRadius']): string {
  const map: Record<string, string> = {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };
  return map[radius] || '8px';
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fontUrl(font: string): string {
  return `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
}

const NAV_LABELS: Record<string, string> = {
  hero: 'Inicio',
  features: 'Características',
  about: 'Nosotros',
  pricing: 'Precios',
  testimonials: 'Testimonios',
  gallery: 'Galería',
  faq: 'FAQ',
  stats: 'Estadísticas',
  team: 'Equipo',
  contact: 'Contacto',
};

const NAVIGABLE_SECTIONS = new Set<string>(Object.keys(NAV_LABELS));

function getBrandName(page: PageData): string {
  const footer = page.sections.find((s): s is FooterSection => s.type === 'footer' && s.enabled);
  if (footer) return footer.data.brandName;
  return page.name;
}

function getMetaDescription(page: PageData): string {
  const hero = page.sections.find((s): s is HeroSection => s.type === 'hero' && s.enabled);
  if (hero) return hero.data.subtitle;
  const first = page.sections.find((s) => s.enabled);
  if (!first) return page.name;
  const d = (first as any).data;
  return d?.subtitle || d?.title || d?.description || page.name;
}

function stars(rating: number): string {
  const full = Math.floor(rating);
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  for (let i = full; i < 5; i++) s += '☆';
  return s;
}

// ─────────────────────────────────────────────────────────────
// SVG Icons (inline)
// ─────────────────────────────────────────────────────────────

const ICONS = {
  email: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mapPin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  chevronDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  arrowUp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  twitter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  hamburger: (scrolled: boolean) => `<button class="hamburger" aria-label="Toggle menu" onclick="document.querySelector('.mobile-menu').classList.toggle('open')"><span></span><span></span><span></span></button>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

function socialIcon(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes('twitter') || p.includes('x.com')) return ICONS.twitter;
  if (p.includes('linkedin')) return ICONS.linkedin;
  if (p.includes('github')) return ICONS.github;
  if (p.includes('instagram')) return ICONS.instagram;
  // fallback: first letter
  return `<span style="font-weight:700;font-size:0.75rem">${esc(platform.charAt(0).toUpperCase())}</span>`;
}

// ─────────────────────────────────────────────────────────────
// CSS Generation
// ─────────────────────────────────────────────────────────────

function generateCSS(theme: PageTheme): string {
  const { primaryColor, secondaryColor, accentColor, backgroundColor, textColor, borderRadius } = theme;
  const r = br(borderRadius);
  const hf = esc(theme.headingFont);
  const bf = esc(theme.bodyFont);

  return `
/* ═══════════════════════════════════════
   PageForge — Professional Export
   ═══════════════════════════════════════ */

/* Reset & Base */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }
body { font-family: '${bf}', sans-serif; color: ${textColor}; background: ${backgroundColor}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.6; }
h1,h2,h3,h4,h5,h6 { font-family: '${hf}', sans-serif; line-height: 1.2; }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; }

/* Navigation */
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: all 0.3s ease; background: transparent; }
.navbar.scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.navbar-container { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
.navbar-brand { font-family: '${hf}', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; text-decoration: none; transition: color 0.3s; }
.navbar.scrolled .navbar-brand { color: ${textColor}; }
.navbar-links { display: flex; gap: 32px; list-style: none; }
.navbar-links a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
.navbar.scrolled .navbar-links a { color: ${textColor}99; }
.navbar-links a:hover { color: ${accentColor}; }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; z-index: 1001; }
.hamburger span { width: 24px; height: 2px; background: #fff; transition: all 0.3s; border-radius: 2px; }
.navbar.scrolled .hamburger span { background: ${textColor}; }

/* Mobile Menu */
.mobile-menu { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; }
.mobile-menu.open { display: flex; }
.mobile-menu-content { background: #fff; padding: 80px 32px 32px; width: 280px; height: 100%; box-shadow: 4px 0 20px rgba(0,0,0,0.1); overflow-y: auto; }
.mobile-menu-content a { display: block; padding: 16px 0; font-size: 1rem; color: ${textColor}; border-bottom: 1px solid #f0f0f0; text-decoration: none; font-weight: 500; transition: color 0.2s; }
.mobile-menu-content a:hover { color: ${primaryColor}; }

/* Sections */
.section { padding: 96px 0; }
.section-alt { padding: 96px 0; background: ${primaryColor}06; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 64px; }
.section-title { font-size: 2.5rem; font-weight: 800; color: ${textColor}; margin-bottom: 16px; letter-spacing: -0.02em; }
.section-subtitle { font-size: 1.125rem; color: ${textColor}80; max-width: 640px; margin: 0 auto; line-height: 1.7; }

/* Grids */
.grid { display: grid; gap: 32px; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Cards */
.card { background: #fff; border-radius: ${r}; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.3s ease; }
.card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.08); transform: translateY(-4px); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; font-weight: 600; border-radius: ${r}; transition: all 0.2s; text-decoration: none; cursor: pointer; border: none; font-size: 1rem; font-family: '${bf}', sans-serif; }
.btn-primary { background: ${primaryColor}; color: #fff; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-accent { background: ${accentColor}; color: #fff; }
.btn-accent:hover { transform: translateY(-1px); box-shadow: 0 8px 24px ${accentColor}40; }
.btn-outline { background: transparent; border: 2px solid ${primaryColor}; color: ${primaryColor}; }
.btn-outline:hover { background: ${primaryColor}; color: #fff; }
.btn-white { background: #fff; color: ${primaryColor}; }
.btn-white:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.btn-ghost { background: transparent; border: 2px solid rgba(255,255,255,0.3); color: #fff; }
.btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }

/* Hero */
.hero { position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; min-height: 100vh; }
.hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); }
.hero-bg.hero-bg-image { background-size: cover; background-position: center; }
.hero-overlay { position: absolute; inset: 0; }
.hero-content { position: relative; z-index: 2; text-align: center; padding: 120px 24px 80px; max-width: 800px; }
.hero h1 { font-size: 3.5rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.03em; }
.hero .hero-subtitle { font-size: 1.25rem; color: rgba(255,255,255,0.85); line-height: 1.7; margin-bottom: 40px; }
.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.about-text .section-subtitle { margin: 0 0 24px; text-align: left; max-width: none; }
.about-image { aspect-ratio: 4/3; border-radius: ${r}; overflow: hidden; background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15); display: flex; align-items: center; justify-content: center; }
.about-image img { width: 100%; height: 100%; object-fit: cover; }
.about-stats { display: flex; gap: 48px; margin-top: 40px; flex-wrap: wrap; }
.about-stat-value { font-size: 2.5rem; font-weight: 800; color: ${primaryColor}; font-family: '${hf}', sans-serif; }
.about-stat-label { font-size: 0.875rem; color: ${textColor}70; margin-top: 4px; }

/* Features */
.feature-icon { width: 56px; height: 56px; border-radius: ${r}; background: ${primaryColor}12; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.5rem; }
.feature-card h3 { font-size: 1.25rem; font-weight: 700; color: ${textColor}; margin-bottom: 8px; }
.feature-card p { font-size: 0.9375rem; color: ${textColor}70; line-height: 1.7; }

/* Testimonials */
.testimonial-stars { color: ${accentColor}; font-size: 1rem; margin-bottom: 16px; letter-spacing: 2px; }
.testimonial-quote { font-size: 1.0625rem; color: ${textColor}CC; font-style: italic; line-height: 1.8; margin-bottom: 24px; }
.testimonial-author { font-weight: 700; color: ${textColor}; font-size: 0.9375rem; }
.testimonial-role { font-size: 0.8125rem; color: ${textColor}60; margin-top: 2px; }

/* Pricing */
.pricing-card { text-align: center; padding: 40px 32px; }
.pricing-card.featured { border: 2px solid ${primaryColor}; transform: scale(1.05); box-shadow: 0 24px 48px ${primaryColor}20; position: relative; }
.pricing-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: ${primaryColor}; color: #fff; padding: 4px 20px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.pricing-name { font-size: 1.25rem; font-weight: 700; color: ${textColor}; margin-bottom: 8px; }
.pricing-desc { font-size: 0.875rem; color: ${textColor}60; margin-bottom: 24px; }
.pricing-price { font-size: 3rem; font-weight: 800; color: ${primaryColor}; margin-bottom: 4px; font-family: '${hf}', sans-serif; }
.pricing-period { font-size: 0.875rem; color: ${textColor}60; margin-bottom: 32px; }
.pricing-features { list-style: none; text-align: left; margin-bottom: 32px; }
.pricing-features li { padding: 10px 0; font-size: 0.9375rem; color: ${textColor}; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5; }
.pricing-features li svg { color: ${primaryColor}; flex-shrink: 0; }

/* CTA */
.cta-section { position: relative; overflow: hidden; padding: 96px 0; }
.cta-bg { position: absolute; inset: 0; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); }
.cta-decor { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
.cta-content { position: relative; z-index: 2; text-align: center; }
.cta-content h2 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
.cta-content p { font-size: 1.125rem; color: rgba(255,255,255,0.8); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }

/* Contact */
.contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
.contact-card { text-align: center; padding: 40px 24px; }
.contact-icon { width: 56px; height: 56px; border-radius: 50%; background: ${primaryColor}12; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: ${primaryColor}; }
.contact-label { font-size: 0.8125rem; color: ${textColor}60; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.contact-value { font-size: 1rem; font-weight: 600; color: ${textColor}; }

/* Gallery */
.gallery-grid { display: grid; gap: 16px; }
.gallery-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
.gallery-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.gallery-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
.gallery-item { position: relative; overflow: hidden; border-radius: ${r}; aspect-ratio: 1; background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; font-size: 0.875rem; font-weight: 500; transform: translateY(100%); transition: transform 0.3s; }
.gallery-item:hover .gallery-caption { transform: translateY(0); }

/* FAQ */
.faq-item { background: #fff; border-radius: ${r}; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 12px; }
.faq-question { width: 100%; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border: none; background: none; cursor: pointer; font-size: 1rem; font-weight: 600; color: ${textColor}; font-family: '${bf}', sans-serif; text-align: left; }
.faq-chevron { transition: transform 0.3s; color: ${primaryColor}; width: 32px; height: 32px; border-radius: 50%; background: ${primaryColor}12; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.faq-item.open .faq-chevron { transform: rotate(180deg); background: ${primaryColor}; color: #fff; }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item.open .faq-answer { max-height: 300px; }
.faq-answer-inner { padding: 0 24px 20px; font-size: 0.9375rem; color: ${textColor}80; line-height: 1.7; }

/* Stats */
.stats-bar { background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); border-radius: ${r}; padding: 80px 48px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
.stat-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 1.25rem; color: #fff; }
.stat-value { font-size: 2.5rem; font-weight: 800; color: #fff; font-family: '${hf}', sans-serif; }
.stat-label { font-size: 0.875rem; color: rgba(255,255,255,0.7); margin-top: 4px; }

/* Team */
.team-card { text-align: center; padding: 40px 24px; }
.team-avatar { width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 20px; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); overflow: hidden; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 1.5rem; }
.team-avatar img { width: 100%; height: 100%; object-fit: cover; }
.team-name { font-size: 1.125rem; font-weight: 700; color: ${textColor}; margin-bottom: 4px; }
.team-role { font-size: 0.875rem; color: ${primaryColor}; font-weight: 500; margin-bottom: 12px; }
.team-bio { font-size: 0.875rem; color: ${textColor}60; line-height: 1.6; margin-bottom: 16px; }
.team-socials { display: flex; gap: 8px; justify-content: center; }
.team-social-link { width: 32px; height: 32px; border-radius: 50%; background: ${primaryColor}12; display: flex; align-items: center; justify-content: center; color: ${primaryColor}; transition: all 0.2s; text-decoration: none; }
.team-social-link:hover { background: ${primaryColor}; color: #fff; }

/* Footer */
.footer { background: #0f0f0f; padding: 80px 0 0; color: #9ca3af; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; max-width: 1200px; margin: 0 auto; padding-bottom: 48px; }
.footer-brand { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 16px; font-family: '${hf}', sans-serif; }
.footer-desc { font-size: 0.875rem; line-height: 1.7; margin-bottom: 24px; max-width: 320px; }
.footer-social { display: flex; gap: 12px; }
.footer-social a { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: #9ca3af; text-decoration: none; font-size: 0.875rem; transition: all 0.2s; }
.footer-social a:hover { background: ${primaryColor}; color: #fff; }
.footer-col-title { font-size: 0.8125rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.footer-col a { color: #9ca3af; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
.footer-col a:hover { color: #fff; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: 24px 0; text-align: center; font-size: 0.8125rem; color: #6b7280; }

/* Back to Top */
.back-to-top { position: fixed; bottom: 32px; right: 32px; width: 48px; height: 48px; border-radius: 50%; background: ${primaryColor}; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px ${primaryColor}40; opacity: 0; transform: translateY(20px); transition: all 0.3s; z-index: 999; }
.back-to-top.visible { opacity: 1; transform: translateY(0); }
.back-to-top:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${primaryColor}50; }

/* Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

/* Responsive */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .gallery-grid.cols-4 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .about-grid { grid-template-columns: 1fr; }
  .contact-cards { grid-template-columns: 1fr; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); padding: 48px 24px; }
  .hero h1 { font-size: 2.5rem; }
  .hero .hero-subtitle { font-size: 1.0625rem; }
  .section { padding: 64px 0; }
  .section-alt { padding: 64px 0; }
  .section-title { font-size: 2rem; }
  .navbar-links { display: none; }
  .hamburger { display: flex; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .cta-content h2 { font-size: 2rem; }
  .pricing-card.featured { transform: scale(1); }
  .gallery-grid.cols-3, .gallery-grid.cols-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 2rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .btn { width: 100%; }
  .about-stats { gap: 24px; }
  .gallery-grid.cols-2, .gallery-grid.cols-3, .gallery-grid.cols-4 { grid-template-columns: 1fr; }
}
`.trim();
}

// ─────────────────────────────────────────────────────────────
// HTML Section Generators
// ─────────────────────────────────────────────────────────────

function heroHTML(s: HeroSection, theme: PageTheme): string {
  const { data } = s;
  const bgImage = data.backgroundImage ? `<div class="hero-bg hero-bg-image" style="background-image:url('${esc(data.backgroundImage)}')"></div>` : `<div class="hero-bg"></div>`;
  const overlay = `<div class="hero-overlay" style="background:rgba(0,0,0,${data.overlayOpacity})"></div>`;

  const ctaBtn = data.ctaText ? `<a href="${esc(data.ctaLink)}" class="btn btn-white">${esc(data.ctaText)}</a>` : '';
  const secBtn = data.secondaryCtaText ? `<a href="${esc(data.secondaryCtaLink)}" class="btn btn-ghost">${esc(data.secondaryCtaText)}</a>` : '';

  return `
    <section id="section-hero" class="hero animate-on-scroll">
      ${bgImage}
      ${overlay}
      <div class="hero-content">
        <h1>${esc(data.title)}</h1>
        <p class="hero-subtitle">${esc(data.subtitle)}</p>
        <div class="hero-actions">
          ${ctaBtn}
          ${secBtn}
        </div>
      </div>
    </section>`;
}

function featuresHTML(s: FeaturesSection, theme: PageTheme): string {
  const { data } = s;
  const colsClass = data.columns === 2 ? 'grid-2' : data.columns === 4 ? 'grid-4' : 'grid-3';
  const cards = data.features.map((f) => `
        <div class="card feature-card">
          <div class="feature-icon">${esc(f.icon)}</div>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.description)}</p>
        </div>`).join('');

  return `
    <section id="section-features" class="section section-alt animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="grid ${colsClass}">
          ${cards}
        </div>
      </div>
    </section>`;
}

function aboutHTML(s: AboutSection, theme: PageTheme): string {
  const { data } = s;
  const imageContent = data.image
    ? `<img src="${esc(data.image)}" alt="${esc(data.title)}">`
    : `<span style="font-size:3rem;opacity:0.3">📷</span>`;

  const statsHTML = data.stats.length > 0 ? `
          <div class="about-stats">
            ${data.stats.map((st) => `
              <div>
                <div class="about-stat-value">${esc(st.value)}</div>
                <div class="about-stat-label">${esc(st.label)}</div>
              </div>`).join('')}
          </div>` : '';

  const order = data.imagePosition === 'right';
  const imageCol = `<div class="about-image">${imageContent}</div>`;
  const textCol = `
      <div class="about-text">
        <h2 class="section-title">${esc(data.title)}</h2>
        <p class="section-subtitle">${esc(data.description)}</p>
        ${statsHTML}
      </div>`;

  return `
    <section id="section-about" class="section animate-on-scroll">
      <div class="container">
        <div class="about-grid">
          ${order ? textCol + imageCol : imageCol + textCol}
        </div>
      </div>
    </section>`;
}

function testimonialsHTML(s: TestimonialsSection, theme: PageTheme): string {
  const { data } = s;
  const cols = data.testimonials.length <= 2 ? 'grid-2' : 'grid-3';
  const cards = data.testimonials.map((t) => `
        <div class="card" style="text-align:center;">
          <div class="testimonial-stars">${stars(t.rating)}</div>
          <p class="testimonial-quote">"${esc(t.quote)}"</p>
          <div class="testimonial-author">${esc(t.name)}</div>
          <div class="testimonial-role">${esc(t.role)}</div>
        </div>`).join('');

  return `
    <section id="section-testimonials" class="section section-alt animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="grid ${cols}">
          ${cards}
        </div>
      </div>
    </section>`;
}

function pricingHTML(s: PricingSection, theme: PageTheme): string {
  const { data } = s;
  const cards = data.plans.map((p) => {
    const featuredClass = p.highlighted ? ' featured' : '';
    const badge = p.highlighted ? `<div class="pricing-badge">Popular</div>` : '';
    const featureList = p.features.map((f) => `
                <li>${ICONS.check} ${esc(f)}</li>`).join('');
    return `
        <div class="card pricing-card${featuredClass}">
          ${badge}
          <div class="pricing-name">${esc(p.name)}</div>
          <div class="pricing-desc">${esc(p.description)}</div>
          <div class="pricing-price">${esc(p.price)}</div>
          <div class="pricing-period">${esc(p.period)}</div>
          <ul class="pricing-features">${featureList}</ul>
          <a href="#" class="btn ${p.highlighted ? 'btn-accent' : 'btn-outline'}" style="width:100%">${esc(p.ctaText)}</a>
        </div>`;
  }).join('');

  const cols = data.plans.length <= 2 ? 'grid-2' : data.plans.length >= 4 ? 'grid-4' : 'grid-3';

  return `
    <section id="section-pricing" class="section animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="grid ${cols}">
          ${cards}
        </div>
      </div>
    </section>`;
}

function ctaHTML(s: CTASection, theme: PageTheme): string {
  const { data } = s;
  const bgImageStyle = data.backgroundStyle === 'image' && data.backgroundImage
    ? `background-image:url('${esc(data.backgroundImage)}');background-size:cover;background-position:center;`
    : '';

  return `
    <section class="cta-section animate-on-scroll">
      <div class="cta-bg" style="${bgImageStyle}"></div>
      <div class="cta-decor" style="width:400px;height:400px;top:-200px;right:-100px;"></div>
      <div class="cta-decor" style="width:300px;height:300px;bottom:-150px;left:-80px;"></div>
      <div class="container">
        <div class="cta-content">
          <h2>${esc(data.title)}</h2>
          <p>${esc(data.subtitle)}</p>
          <a href="${esc(data.ctaLink)}" class="btn btn-white">${esc(data.ctaText)}</a>
        </div>
      </div>
    </section>`;
}

function contactHTML(s: ContactSection, theme: PageTheme): string {
  const { data } = s;
  const cards = [
    { icon: ICONS.email, label: 'Email', value: data.email || 'email@example.com' },
    { icon: ICONS.phone, label: 'Teléfono', value: data.phone || '+1 234 567 890' },
    { icon: ICONS.mapPin, label: 'Dirección', value: data.address || 'Dirección no disponible' },
  ];

  const contactCardsHTML = cards.map((c) => `
          <div class="card contact-card">
            <div class="contact-icon">${c.icon}</div>
            <div class="contact-label">${c.label}</div>
            <div class="contact-value">${esc(c.value)}</div>
          </div>`).join('');

  return `
    <section id="section-contact" class="section section-alt animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="contact-cards">
          ${contactCardsHTML}
        </div>
      </div>
    </section>`;
}

function galleryHTML(s: GallerySection, theme: PageTheme): string {
  const { data } = s;
  const images = data.images.length > 0
    ? data.images.map((img) => `
          <div class="gallery-item">
            <img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy">
            ${img.caption ? `<div class="gallery-caption">${esc(img.caption)}</div>` : ''}
          </div>`).join('')
    : `<div class="gallery-item" style="grid-column:span 2;aspect-ratio:2/1"><span style="font-size:3rem;opacity:0.3;display:flex;align-items:center;justify-content:center;height:100%">🖼️ Galería</span></div>`;

  return `
    <section id="section-gallery" class="section animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="gallery-grid cols-${data.columns}">
          ${images}
        </div>
      </div>
    </section>`;
}

function faqHTML(s: FAQSection, theme: PageTheme): string {
  const { data } = s;
  const items = data.items.map((item) => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${esc(item.question)}</span>
            <span class="faq-chevron">${ICONS.chevronDown}</span>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-inner">${esc(item.answer)}</div>
          </div>
        </div>`).join('');

  return `
    <section id="section-faq" class="section section-alt animate-on-scroll">
      <div class="container" style="max-width:800px;">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        ${items}
      </div>
    </section>`;
}

function statsHTML(s: StatsSection, theme: PageTheme): string {
  const { data } = s;
  const cols = data.items.length <= 3 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)';
  const items = data.items.map((item) => `
          <div>
            <div class="stat-icon">${esc(item.icon)}</div>
            <div class="stat-value">${esc(item.value)}</div>
            <div class="stat-label">${esc(item.label)}</div>
          </div>`).join('');

  return `
    <section id="section-stats" class="section animate-on-scroll">
      <div class="container">
        ${data.title ? `<div class="section-header"><h2 class="section-title">${esc(data.title)}</h2></div>` : ''}
        <div class="stats-bar" style="grid-template-columns:${cols};">
          ${items}
        </div>
      </div>
    </section>`;
}

function teamHTML(s: TeamSection, theme: PageTheme): string {
  const { data } = s;
  const cols = data.members.length <= 2 ? 'grid-2' : data.members.length >= 4 ? 'grid-4' : 'grid-3';
  const cards = data.members.map((m) => {
    const avatarContent = m.avatar
      ? `<img src="${esc(m.avatar)}" alt="${esc(m.name)}">`
      : `<span>${esc(m.name.charAt(0).toUpperCase())}</span>`;

    const socials = m.socials.length > 0
      ? `<div class="team-socials">${m.socials.map((s) => `<a href="${esc(s.url)}" class="team-social-link" target="_blank" rel="noopener" aria-label="${esc(s.platform)}">${socialIcon(s.platform)}</a>`).join('')}</div>`
      : '';

    return `
        <div class="card team-card">
          <div class="team-avatar">${avatarContent}</div>
          <div class="team-name">${esc(m.name)}</div>
          <div class="team-role">${esc(m.role)}</div>
          ${m.bio ? `<p class="team-bio">${esc(m.bio)}</p>` : ''}
          ${socials}
        </div>`;
  }).join('');

  return `
    <section id="section-team" class="section section-alt animate-on-scroll">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${esc(data.title)}</h2>
          <p class="section-subtitle">${esc(data.subtitle)}</p>
        </div>
        <div class="grid ${cols}">
          ${cards}
        </div>
      </div>
    </section>`;
}

function footerHTML(s: FooterSection, theme: PageTheme): string {
  const { data } = s;
  const socialsHTML = data.socialLinks.map((s) =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.platform)}">${socialIcon(s.platform)}</a>`
  ).join('');

  const columnsHTML = data.columns.map((col) => `
        <div class="footer-col">
          <div class="footer-col-title">${esc(col.title)}</div>
          <ul>
            ${col.links.map((l) => `<li><a href="${esc(l.url)}">${esc(l.label)}</a></li>`).join('')}
          </ul>
        </div>`).join('');

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">${esc(data.brandName)}</div>
            <p class="footer-desc">${esc(data.brandDescription)}</p>
            <div class="footer-social">
              ${socialsHTML}
            </div>
          </div>
          ${columnsHTML}
        </div>
        <div class="footer-bottom">
          ${esc(data.copyright || `© ${new Date().getFullYear()} ${data.brandName}. Todos los derechos reservados.`)}
        </div>
      </div>
    </footer>`;
}

// ─────────────────────────────────────────────────────────────
// Navigation HTML
// ─────────────────────────────────────────────────────────────

function navbarHTML(page: PageData): string {
  const brand = getBrandName(page);

  const navSections = page.sections.filter(
    (s) => s.enabled && s.type !== 'footer' && s.type !== 'cta' && NAVIGABLE_SECTIONS.has(s.type)
  );

  const links = navSections.map((s) => {
    const label = NAV_LABELS[s.type] || s.type;
    return `<li><a href="#section-${s.type}">${esc(label)}</a></li>`;
  }).join('');

  const mobileLinks = navSections.map((s) => {
    const label = NAV_LABELS[s.type] || s.type;
    return `<a href="#section-${s.type}">${esc(label)}</a>`;
  }).join('');

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-container">
        <a href="#" class="navbar-brand">${esc(brand)}</a>
        <ul class="navbar-links">
          ${links}
        </ul>
        <button class="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu-content">
        ${mobileLinks}
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// JavaScript
// ─────────────────────────────────────────────────────────────

function generateJS(): string {
  return `
// ═══════════════════════════════════════
// PageForge — Interactive Scripts
// ═══════════════════════════════════════

(function() {
  'use strict';

  // Navbar scroll effect
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Mobile menu toggle
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) mobileMenu.classList.remove('open');
  });
  document.querySelectorAll('.mobile-menu-content a').forEach(function(a) {
    a.addEventListener('click', function() { mobileMenu.classList.remove('open'); });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.parentElement.classList.toggle('open');
    });
  });

  // Scroll animations (Intersection Observer)
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
    observer.observe(el);
  });

  // Back to top
  var btt = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });
  btt.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
`.trim();
}

// ─────────────────────────────────────────────────────────────
// Section Renderer Dispatch
// ─────────────────────────────────────────────────────────────

function renderSection(section: PageSection, theme: PageTheme): string {
  switch (section.type) {
    case 'hero':
      return heroHTML(section as HeroSection, theme);
    case 'features':
      return featuresHTML(section as FeaturesSection, theme);
    case 'about':
      return aboutHTML(section as AboutSection, theme);
    case 'testimonials':
      return testimonialsHTML(section as TestimonialsSection, theme);
    case 'pricing':
      return pricingHTML(section as PricingSection, theme);
    case 'cta':
      return ctaHTML(section as CTASection, theme);
    case 'contact':
      return contactHTML(section as ContactSection, theme);
    case 'gallery':
      return galleryHTML(section as GallerySection, theme);
    case 'faq':
      return faqHTML(section as FAQSection, theme);
    case 'stats':
      return statsHTML(section as StatsSection, theme);
    case 'team':
      return teamHTML(section as TeamSection, theme);
    case 'footer':
      return footerHTML(section as FooterSection, theme);
    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────
// Favicon SVG Data URI (emoji-based)
// ─────────────────────────────────────────────────────────────

function faviconDataURI(emoji: string = '⚡'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT: generateProfessionalHTML
// ═══════════════════════════════════════════════════════════════

export function generateProfessionalHTML(page: PageData): string {
  const { theme } = page;
  const css = generateCSS(theme);
  const js = generateJS();
  const nav = navbarHTML(page);
  const metaDesc = getMetaDescription(page).substring(0, 160);

  // Render all enabled sections
  const sectionsHTML = page.sections
    .filter((s) => s.enabled)
    .map((s) => renderSection(s, theme))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.name)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(page.name)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:locale" content="es_ES">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${faviconDataURI('⚡')}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl(theme.headingFont)}" rel="stylesheet">
  <link href="${fontUrl(theme.bodyFont)}" rel="stylesheet">

  <style>
${css}
  </style>
</head>
<body>

  <!-- Navigation -->
${nav}

  <!-- Page Sections -->
${sectionsHTML}

  <!-- Back to Top -->
  <button class="back-to-top" aria-label="Back to top">
    ${ICONS.arrowUp}
  </button>

  <script>
${js}
  </script>

</body>
</html>`;
}
