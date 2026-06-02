'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { useThemeEditorStore } from '@/lib/theme-editor-store';
import type { ThemeSection } from '@/lib/wp-theme-generator';
import { Star, Mail, Phone, MapPin, ChevronDown, ExternalLink, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Default values helper
// ─────────────────────────────────────────────────────────────

const DEFAULTS = {
  siteTitle: 'Mi Sitio Web',
  tagline: '',
  logoUrl: '',
  primaryColor: '#2563EB',
  secondaryColor: '#7C3AED',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  borderRadius: 8,
  sections: [] as ThemeSection[],
  navItems: [] as { label: string; url: string }[],
  footerColumns: [] as { title: string; links: { label: string; url: string }[] }[],
  copyrightText: '',
  socialLinks: [] as { platform: string; url: string }[],
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function buildFontUrl(headingFont: string, bodyFont: string): string {
  const h = headingFont.replace(/ /g, '+');
  const b = bodyFont.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${h}:wght@700;800&family=${b}:wght@400;500;600&display=swap`;
}

/** Placeholder gradient for missing images */
function placeholderGradient(seed?: string): React.CSSProperties {
  const colors = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
    ['#fccb90', '#d57eeb'],
    ['#e0c3fc', '#8ec5fc'],
  ];
  const idx = seed ? Math.abs(seed.charCodeAt(0)) % colors.length : 0;
  return {
    background: `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`,
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          style={{ fill: i <= rating ? '#F59E0B' : 'none', color: i <= rating ? '#F59E0B' : '#D1D5DB' }}
        />
      ))}
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
  style,
  seed,
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  seed?: string;
}) {
  if (!src) {
    return (
      <div
        className={className}
        style={{ ...placeholderGradient(seed), ...style }}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      style={style}
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = 'none';
        const parent = el.parentElement;
        if (parent) {
          const fallback = document.createElement('div');
          fallback.className = el.className || '';
          Object.assign(fallback.style, placeholderGradient(seed), style || {});
          parent.appendChild(fallback);
        }
      }}
    />
  );
}

function SectionLabel({ type, enabled }: { type: string; enabled: boolean }) {
  return (
    <div
      className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full mb-3 inline-block"
      style={{
        backgroundColor: enabled ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
        color: enabled ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)',
      }}
    >
      {type === 'blog_posts' ? 'Blog' : type} {!enabled && '(off)'}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Social icon helper
// ─────────────────────────────────────────────────────────────

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'twitter':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
}

// ─────────────────────────────────────────────────────────────
// Section Renderers
// ─────────────────────────────────────────────────────────────

function HeroSection({
  section,
  colors,
  borderRadius,
  headingFont,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string; accent: string };
  borderRadius: number;
  headingFont: string;
}) {
  const d = section.data;
  const title = (section.title || 'Encabezado') as string;
  const subtitle = (d.subtitle as string) || '';
  const ctaText = (d.ctaText as string) || '';
  const secondaryCtaText = (d.secondaryCtaText as string) || '';
  const bgImage = (d.backgroundImage as string) || '';
  const overlayOpacity = (d.overlayOpacity as number) ?? 0.5;

  return (
    <section className="relative flex items-center justify-center text-center overflow-hidden" style={{ minHeight: 380 }}>
      {/* Background */}
      {bgImage ? (
        <>
          <ImageWithFallback
            src={bgImage}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              opacity: overlayOpacity,
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 px-6 py-16 max-w-3xl mx-auto">
        {subtitle && (
          <p
            className="mb-3 text-sm font-medium uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {subtitle}
          </p>
        )}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
          style={{
            fontFamily: headingFont,
            color: '#FFFFFF',
          }}
        >
          {title}
        </h1>
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {ctaText && (
              <span
                className="inline-block px-7 py-3 font-semibold text-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: colors.primary,
                  borderRadius,
                }}
              >
                {ctaText}
              </span>
            )}
            {secondaryCtaText && (
              <span
                className="inline-block px-7 py-3 font-semibold text-sm border-2 border-white text-white"
                style={{ borderRadius }}
              >
                {secondaryCtaText}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Sobre Nosotros') as string;
  const subtitle = (d.subtitle as string) || '';
  const image = (d.image as string) || '';
  const stats = (d.stats as Array<{ value: string; label: string }>) || [];

  return (
    <section className="px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full aspect-[4/3] object-cover"
              style={{ borderRadius }}
              seed="about"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2">
            <h2
              className="text-2xl md:text-3xl font-extrabold mb-3"
              style={{ fontFamily: headingFont, color: textColor }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: `${textColor}99` }}>
                {subtitle}
              </p>
            )}
            {!subtitle && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: `${textColor}80` }}>
                Describe tu historia, misión y valores aquí. Este texto se mostrará junto a la imagen en la sección &quot;Sobre Nosotros&quot; de tu theme WordPress.
              </p>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-xl font-extrabold"
                      style={{ color: colors.primary, fontFamily: headingFont }}
                    >
                      {stat.value || '—'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: `${textColor}80` }}>
                      {stat.label || '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesFeaturesSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string; accent: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Nuestros Servicios') as string;
  const subtitle = (d.subtitle as string) || '';
  const items = (d.items as Array<{ icon: string; title: string; description: string }>) || [];
  const columns = (d.columns as number) || 3;

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="px-6 py-14" style={{ backgroundColor: `${backgroundColor}FA` }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className={`grid ${gridCols} gap-5`}>
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 text-center transition-shadow"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius,
                border: `1px solid ${textColor}12`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="text-2xl mb-3"
                style={{ lineHeight: 1 }}
              >
                {item.icon || '✦'}
              </div>
              <h3
                className="text-base font-bold mb-2"
                style={{ fontFamily: headingFont, color: textColor }}
              >
                {item.title || 'Servicio'}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: `${textColor}80` }}>
                {item.description || 'Descripción del servicio.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Testimonios') as string;
  const subtitle = (d.subtitle as string) || '';
  const testimonials = (d.testimonials as Array<{ quote: string; name: string; role: string; rating: number }>) || [];

  return (
    <section className="px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6"
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius,
                border: `1px solid ${textColor}0A`,
              }}
            >
              {/* Quote */}
              <p className="text-sm leading-relaxed mb-4 italic" style={{ color: `${textColor}CC` }}>
                &ldquo;{t.quote || 'A wonderful experience...'}&rdquo;
              </p>

              {/* Stars */}
              <Stars rating={t.rating || 5} />

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: '50%',
                  }}
                >
                  {(t.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: textColor }}>
                    {t.name || 'Anonymous'}
                  </div>
                  <div className="text-xs" style={{ color: `${textColor}70` }}>
                    {t.role || ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string; accent: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Precios') as string;
  const subtitle = (d.subtitle as string) || '';
  const plans = (d.plans as Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted: boolean;
    ctaText: string;
  }>) || [];

  return (
    <section className="px-6 py-14" style={{ backgroundColor: `${backgroundColor}FA` }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted;
            return (
              <div
                key={i}
                className="p-6 text-center relative"
                style={{
                  backgroundColor: isHighlighted ? colors.primary : '#FFFFFF',
                  borderRadius,
                  border: isHighlighted ? 'none' : `1px solid ${textColor}12`,
                  boxShadow: isHighlighted
                    ? `0 8px 30px ${colors.primary}33`
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: isHighlighted ? 'scale(1.03)' : 'none',
                }}
              >
                {isHighlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius,
                    }}
                  >
                    Popular
                  </div>
                )}
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: headingFont,
                    color: isHighlighted ? '#FFFFFF' : textColor,
                  }}
                >
                  {plan.name || 'Plan'}
                </h3>
                <div className="mb-6">
                  <span
                    className="text-3xl font-extrabold"
                    style={{
                      fontFamily: headingFont,
                      color: isHighlighted ? '#FFFFFF' : textColor,
                    }}
                  >
                    {plan.price || '$0'}
                  </span>
                  <span
                    className="text-sm ml-1"
                    style={{ color: isHighlighted ? 'rgba(255,255,255,0.7)' : `${textColor}70` }}
                  >
                    {plan.period || '/month'}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {(plan.features || []).map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs" style={{ color: isHighlighted ? 'rgba(255,255,255,0.85)' : `${textColor}99` }}>
                      <span style={{ color: isHighlighted ? '#FFFFFF' : colors.primary }}>&#10003;</span>
                      {feat || 'Característica'}
                    </div>
                  ))}
                </div>

                <span
                  className="inline-block w-full py-2.5 text-sm font-semibold text-center"
                  style={{
                    backgroundColor: isHighlighted ? '#FFFFFF' : colors.primary,
                    color: isHighlighted ? colors.primary : '#FFFFFF',
                    borderRadius,
                  }}
                >
                  {plan.ctaText || 'Comenzar'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string; accent: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Llamada a la Acción') as string;
  const subtitle = (d.subtitle as string) || '';
  const ctaText = (d.ctaText as string) || 'Comenzar';

  return (
    <section className="relative px-6 py-16 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
      />
      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10"
        style={{ backgroundColor: '#FFFFFF' }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
        style={{ backgroundColor: '#FFFFFF' }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold mb-3"
          style={{ fontFamily: headingFont, color: '#FFFFFF' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {subtitle}
          </p>
        )}
        <span
          className="inline-block px-8 py-3 text-sm font-semibold"
          style={{
            backgroundColor: colors.accent,
            color: '#FFFFFF',
            borderRadius,
          }}
        >
          {ctaText}
        </span>
      </div>
    </section>
  );
}

function ContactSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Contáctanos') as string;
  const subtitle = (d.subtitle as string) || '';
  const email = (d.email as string) || '';
  const phone = (d.phone as string) || '';
  const address = (d.address as string) || '';
  const showForm = (d.showForm as boolean) || false;

  return (
    <section className="px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {email && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15`, borderRadius }}
                >
                  <Mail className="h-4 w-4" style={{ color: colors.primary }} />
                </div>
                <span className="text-sm" style={{ color: textColor }}>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15`, borderRadius }}
                >
                  <Phone className="h-4 w-4" style={{ color: colors.primary }} />
                </div>
                <span className="text-sm" style={{ color: textColor }}>{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15`, borderRadius }}
                >
                  <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                </div>
                <span className="text-sm" style={{ color: textColor }}>{address}</span>
              </div>
            )}
            {!email && !phone && !address && (
              <p className="text-xs" style={{ color: `${textColor}50` }}>
                Agrega correo, teléfono o dirección en la configuración de la sección Contacto.
              </p>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="h-9 border px-3 text-xs flex items-center"
                  style={{
                    borderColor: `${textColor}20`,
                    borderRadius,
                    color: `${textColor}50`,
                  }}
                >
                  Name
                </div>
                <div
                  className="h-9 border px-3 text-xs flex items-center"
                  style={{
                    borderColor: `${textColor}20`,
                    borderRadius,
                    color: `${textColor}50`,
                  }}
                >
                  Email
                </div>
              </div>
              <div
                className="h-9 border px-3 text-xs flex items-center"
                style={{
                  borderColor: `${textColor}20`,
                  borderRadius,
                  color: `${textColor}50`,
                }}
              >
                Subject
              </div>
              <div
                className="h-24 border px-3 pt-2 text-xs"
                style={{
                  borderColor: `${textColor}20`,
                  borderRadius,
                  color: `${textColor}50`,
                }}
              >
                Tu mensaje...
              </div>
              <span
                className="inline-block px-6 py-2.5 text-sm font-semibold text-white cursor-default"
                style={{ backgroundColor: colors.primary, borderRadius }}
              >
                Enviar Mensaje
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Galería') as string;
  const subtitle = (d.subtitle as string) || '';
  const images = (d.images as Array<{ src: string; alt: string; caption: string }>) || [];
  const columns = (d.columns as number) || 3;

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="px-6 py-14" style={{ backgroundColor: `${backgroundColor}FA` }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className={`grid ${gridCols} gap-4`}>
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group overflow-hidden"
              style={{ borderRadius }}
            >
              <ImageWithFallback
                src={img.src}
                alt={img.alt || `Gallery ${i + 1}`}
                className="w-full aspect-square object-cover"
                seed={`gallery-${i}`}
              />
              {(img.caption || img.alt) && (
                <div
                  className="absolute inset-0 flex items-end"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                  }}
                >
                  <span className="text-white text-xs font-medium px-3 py-2">
                    {img.caption || img.alt}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-center text-xs py-8" style={{ color: `${textColor}40` }}>
            No se han agregado imágenes. Agrega imágenes en la configuración de la sección Galería.
          </p>
        )}
      </div>
    </section>
  );
}

function FAQSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Preguntas Frecuentes') as string;
  const subtitle = (d.subtitle as string) || '';
  const items = (d.items as Array<{ question: string; answer: string }>) || [];

  return (
    <section className="px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                borderRadius,
                border: `1px solid ${textColor}0D`,
                backgroundColor: '#FAFAFA',
              }}
            >
              {/* Question */}
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-semibold" style={{ color: textColor }}>
                  {item.question || `Question ${i + 1}`}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 ml-3"
                  style={{ color: `${textColor}50` }}
                />
              </div>
              {/* Answer */}
              {item.answer && (
                <div className="px-5 pb-4">
                  <p className="text-xs leading-relaxed" style={{ color: `${textColor}80` }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-xs py-8" style={{ color: `${textColor}40` }}>
            No se han agregado preguntas.
          </p>
        )}
      </div>
    </section>
  );
}

function StatsSection({
  section,
  colors,
  borderRadius,
  headingFont,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string };
  borderRadius: number;
  headingFont: string;
  backgroundColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Estadísticas') as string;
  const items = (d.items as Array<{ icon: string; value: string; label: string }>) || [];

  return (
    <section
      className="px-6 py-14"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2
            className="text-2xl md:text-3xl font-extrabold text-center mb-10"
            style={{ fontFamily: headingFont, color: '#FFFFFF' }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              {item.icon && (
                <div className="text-2xl mb-2">{item.icon}</div>
              )}
              <div
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: headingFont, color: '#FFFFFF' }}
              >
                {item.value || '0'}
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {item.label || 'Metric'}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-xs py-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            No se han agregado estadísticas.
          </p>
        )}
      </div>
    </section>
  );
}

function TeamSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Nuestro Equipo') as string;
  const members = (d.members as Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
    socials: Array<{ platform: string; url: string }>;
  }>) || [];

  return (
    <section className="px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-10"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <div
              key={i}
              className="text-center p-5"
              style={{
                borderRadius,
                backgroundColor: '#FAFAFA',
                border: `1px solid ${textColor}0A`,
              }}
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {member.avatar ? (
                  <ImageWithFallback
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                    seed={`team-${i}`}
                  />
                ) : (
                  <div
                    className="w-16 h-16 flex items-center justify-center text-xl font-bold text-white"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                    }}
                  >
                    {(member.name || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>

              <h3
                className="text-sm font-bold mb-0.5"
                style={{ fontFamily: headingFont, color: textColor }}
              >
                {member.name || 'Team Member'}
              </h3>
              <div className="text-xs mb-2" style={{ color: `${textColor}70` }}>
                {member.role || ''}
              </div>
              {member.bio && (
                <p className="text-xs leading-relaxed mb-3" style={{ color: `${textColor}60` }}>
                  {member.bio}
                </p>
              )}

              {/* Social links */}
              {member.socials && member.socials.length > 0 && (
                <div className="flex items-center justify-center gap-3">
                  {member.socials.map((s, si) => (
                    <span key={si} style={{ color: `${textColor}50` }}>
                      <SocialIcon platform={s.platform} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <p className="text-center text-xs py-8" style={{ color: `${textColor}40` }}>
            No se han agregado miembros al equipo.
          </p>
        )}
      </div>
    </section>
  );
}

function BlogPostsSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const d = section.data;
  const title = (section.title || 'Últimas Publicaciones') as string;
  const subtitle = (d.subtitle as string) || '';

  // Show 3 placeholder blog cards
  const placeholders = [
    { title: 'Primeros Pasos con WordPress', excerpt: 'Aprende cómo configurar tu primer sitio WordPress en minutos.', date: '15 Ene, 2025' },
    { title: 'Top 10 Tendencias de Diseño', excerpt: 'Explora las últimas tendencias de diseño que están marcando la pauta este año.', date: '10 Ene, 2025' },
    { title: 'Mejores Prácticas de SEO', excerpt: 'Mejora tu posicionamiento en buscadores con estos consejos esenciales de SEO.', date: '5 Ene, 2025' },
  ];

  return (
    <section className="px-6 py-14" style={{ backgroundColor: `${backgroundColor}FA` }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-center mb-10" style={{ color: `${textColor}70` }}>
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholders.map((post, i) => (
            <div
              key={i}
              className="overflow-hidden"
              style={{
                borderRadius,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${textColor}0A`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-[16/9]" style={placeholderGradient(`blog-${i}`)} />

              <div className="p-5">
                <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: `${textColor}50` }}>
                  {post.date}
                </div>
                <h3
                  className="text-sm font-bold mb-2 leading-snug"
                  style={{ fontFamily: headingFont, color: textColor }}
                >
                  {post.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: `${textColor}70` }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom Section Preview (visual rows/columns/blocks)
// ─────────────────────────────────────────────────────────────

function CustomSectionPreview({
  section,
  colors,
  borderRadius,
  textColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string; accent: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const d = section.data || {};

  // If code mode with raw HTML
  if (d.customHtml && d.customHtml.trim()) {
    return (
      <section className="py-10 px-4" data-section-id="custom" style={{ minHeight: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            dangerouslySetInnerHTML={{ __html: d.customHtml }}
            style={{ fontSize: 14, lineHeight: 1.7, color: textColor }}
          />
        </div>
      </section>
    );
  }

  const rows: any[] = d.rows || [];
  if (rows.length === 0) {
    return (
      <section className="py-10 px-4" data-section-id="custom">
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: `${textColor}50`, fontStyle: 'italic' }}>
            Sección personalizada — agrega filas y bloques en el editor
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4" data-section-id="custom">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {rows.map((row: any, ri: number) => {
          const cols: any[] = row.columns || [];
          const gap = row.gap || '24px';
          const vAlign = row.verticalAlign || 'stretch';
          return (
            <div
              key={ri}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap,
                alignItems: vAlign,
                marginBottom: ri < rows.length - 1 ? 24 : 0,
              }}
            >
              {cols.map((col: any, ci: number) => {
                const blocks: any[] = col.blocks || [];
                const colWidth = col.width || `${Math.floor(100 / Math.max(cols.length, 1))}%`;
                return (
                  <div
                    key={ci}
                    style={{
                      flex: col.width ? `0 0 ${colWidth}` : '1 1 0',
                      maxWidth: col.width || undefined,
                      minWidth: 0,
                    }}
                  >
                    {blocks.map((block: any, bi: number) => {
                      if (block.enabled === false) return null;
                      return (
                        <div key={bi} style={{ marginBottom: 16 }}>
                          {renderCustomBlock(block, colors, borderRadius, textColor)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function renderCustomBlock(block: any, colors: any, borderRadius: number, textColor: string): React.ReactNode {
  switch (block.type) {
    case 'text':
      return (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: textColor, margin: 0, whiteSpace: 'pre-wrap' }}>
          {block.content || <span style={{ color: `${textColor}30`, fontStyle: 'italic' }}>Texto vacío</span>}
        </p>
      );
    case 'heading': {
      const Tag = (block.headingTag || 'h3') as keyof JSX.IntrinsicElements;
      return (
        <Tag style={{ fontSize: block.headingTag === 'h1' ? 28 : block.headingTag === 'h2' ? 22 : 18, fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.3 }}>
          {block.content || <span style={{ color: `${textColor}30`, fontStyle: 'italic' }}>Título</span>}
        </Tag>
      );
    }
    case 'image':
      return block.src ? (
        <img
          src={block.src}
          alt={block.alt || ''}
          style={{ maxWidth: '100%', height: 'auto', borderRadius, display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: 120, borderRadius, background: `${textColor}08`, border: `1px dashed ${textColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: `${textColor}40` }}>Imagen</span>
        </div>
      );
    case 'video':
      return block.src ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius }}>
          <iframe src={block.src} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen />
        </div>
      ) : (
        <div style={{ width: '100%', height: 120, borderRadius, background: `${textColor}08`, border: `1px dashed ${textColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: `${textColor}40` }}>Video</span>
        </div>
      );
    case 'spacer':
      return <div style={{ height: block.height || '32px' }} />;
    case 'button':
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: colors.primary,
            color: '#FFFFFF',
            borderRadius,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {block.content || 'Botón'}
        </span>
      );
    case 'divider':
      return <hr style={{ border: 'none', borderTop: `1px solid ${textColor}15`, margin: '8px 0' }} />;
    case 'html':
      return (
        <div dangerouslySetInnerHTML={{ __html: block.content || '' }} style={{ fontSize: 14, lineHeight: 1.7 }} />
      );
    default:
      return <p style={{ fontSize: 14, color: `${textColor}40` }}>Bloque: {block.type}</p>;
  }
}

// ─────────────────────────────────────────────────────────────
// Section dispatcher
// ─────────────────────────────────────────────────────────────

function RenderSection({
  section,
  colors,
  borderRadius,
  headingFont,
  textColor,
  backgroundColor,
}: {
  section: ThemeSection;
  colors: { primary: string; secondary: string; accent: string };
  borderRadius: number;
  headingFont: string;
  textColor: string;
  backgroundColor: string;
}) {
  const shared = { colors, borderRadius, headingFont, textColor, backgroundColor };

  const renderers: Record<string, () => React.ReactNode> = {
    hero: () => (
      <HeroSection {...shared} section={section} />
    ),
    about: () => (
      <AboutSection {...shared} section={section} />
    ),
    services: () => (
      <ServicesFeaturesSection {...shared} section={section} />
    ),
    features: () => (
      <ServicesFeaturesSection {...shared} section={section} />
    ),
    testimonials: () => (
      <TestimonialsSection {...shared} section={section} />
    ),
    pricing: () => (
      <PricingSection {...shared} section={section} />
    ),
    cta: () => (
      <CTASection {...shared} section={section} />
    ),
    contact: () => (
      <ContactSection {...shared} section={section} />
    ),
    gallery: () => (
      <GallerySection {...shared} section={section} />
    ),
    faq: () => (
      <FAQSection {...shared} section={section} />
    ),
    stats: () => (
      <StatsSection {...shared} section={section} />
    ),
    team: () => (
      <TeamSection {...shared} section={section} />
    ),
    blog_posts: () => (
      <BlogPostsSection {...shared} section={section} />
    ),
    custom: () => (
      <CustomSectionPreview {...shared} section={section} />
    ),
  };

  const renderer = renderers[section.type];

  return (
    <div className={section.enabled ? '' : 'opacity-40'} data-section-id={section.type}>
      <SectionLabel type={section.type} enabled={section.enabled} />
      {renderer ? renderer() : (
        <div className="text-center py-8 text-xs" style={{ color: `${textColor}40` }}>
          Unknown section type: {section.type}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

interface ThemeLivePreviewProps {
  previewPageSlug?: string | null;
}

export default function ThemeLivePreview({ previewPageSlug }: ThemeLivePreviewProps) {
  const config = useThemeEditorStore((s) => s.config);
  const [internalActivePage, setInternalActivePage] = useState<string | null>(null);

  // Use prop when provided, otherwise fall back to internal state
  const activePreviewPage = previewPageSlug ?? internalActivePage;
  const setActivePreviewPage = setInternalActivePage;

  // Extract config values with safe defaults
  const siteTitle = (config.siteTitle as string) || DEFAULTS.siteTitle;
  const tagline = (config.tagline as string) || DEFAULTS.tagline;
  const logoUrl = (config.logoUrl as string) || DEFAULTS.logoUrl;
  const primaryColor = (config.primaryColor as string) || DEFAULTS.primaryColor;
  const secondaryColor = (config.secondaryColor as string) || DEFAULTS.secondaryColor;
  const accentColor = (config.accentColor as string) || DEFAULTS.accentColor;
  const backgroundColor = (config.backgroundColor as string) || DEFAULTS.backgroundColor;
  const textColor = (config.textColor as string) || DEFAULTS.textColor;
  const headingFont = (config.headingFont as string) || DEFAULTS.headingFont;
  const bodyFont = (config.bodyFont as string) || DEFAULTS.bodyFont;
  const borderRadius = (config.borderRadius as number) ?? DEFAULTS.borderRadius;
  const homeSections = (config.sections as ThemeSection[]) || DEFAULTS.sections;
  const navItems = (config.navItems as { label: string; url: string }[]) || DEFAULTS.navItems;
  const footerColumns = (config.footerColumns as { title: string; links: { label: string; url: string }[] }[]) || DEFAULTS.footerColumns;
  const copyrightText = (config.copyrightText as string) || DEFAULTS.copyrightText;
  const socialLinks = (config.socialLinks as { platform: string; url: string }[]) || DEFAULTS.socialLinks;
  const navbarBehavior = (config.navbarBehavior as 'sticky' | 'hide-on-scroll' | 'static') || 'sticky';
  const showScrollToTop = (config.showScrollToTop as boolean) || false;

  // Custom pages from store
  const customPages = (config as any).pages || [];

  // Resolve which sections to show based on active preview page
  const sections = useMemo(() => {
    if (!activePreviewPage) return homeSections;
    const page = customPages.find((p: any) => `/${p.slug}` === activePreviewPage || p.slug === activePreviewPage);
    if (page && page.sections) return page.sections as ThemeSection[];
    return homeSections;
  }, [activePreviewPage, homeSections, customPages]);

  const activePageName = useMemo(() => {
    if (!activePreviewPage) return null;
    const page = customPages.find((p: any) => `/${p.slug}` === activePreviewPage || p.slug === activePreviewPage);
    return page?.name || null;
  }, [activePreviewPage, customPages]);

  // Check if a URL matches a custom page
  const isCustomPageUrl = useCallback((url: string) => {
    if (!url || url === '/' || url.startsWith('#')) return false;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return customPages.some((p: any) => `/${p.slug}` === cleanUrl);
  }, [customPages]);

  // Filter nav items to only show links that work on the current page
  const visibleNavItems = useMemo(() => {
    if (!activePreviewPage) return navItems; // Home shows all
    return navItems.filter((item) => {
      const url = item.url || '';
      // Home link always visible
      if (!url || url === '/') return true;
      // Custom page links always visible
      if (isCustomPageUrl(url)) return true;
      // Hash links (#about): only show if that section exists in current page
      if (url.startsWith('#')) {
        const sectionId = url.replace('#', '').replace('section-', '');
        return sections.some((s: ThemeSection) => {
          const cleanType = s.type.replace(/_/g, '-');
          return s.type === sectionId || cleanType === sectionId;
        });
      }
      return false;
    });
  }, [activePreviewPage, navItems, isCustomPageUrl, sections]);

  const colors = useMemo(
    () => ({ primary: primaryColor, secondary: secondaryColor, accent: accentColor }),
    [primaryColor, secondaryColor, accentColor],
  );

  const fontUrl = useMemo(() => buildFontUrl(headingFont, bodyFont), [headingFont, bodyFont]);

  // ─── Scroll behavior state ────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const currentScrollY = container.scrollTop;
    setScrollY(currentScrollY);

    if (navbarBehavior === 'hide-on-scroll') {
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
    }
    lastScrollY.current = currentScrollY;
  }, [navbarBehavior]);

  // Reset header visibility when behavior changes
  const effectiveHeaderVisible = navbarBehavior === 'hide-on-scroll' ? headerVisible : true;

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Determine header CSS
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderBottom: `1px solid ${textColor}0D`,
    fontFamily: bodyFont,
    ...(navbarBehavior === 'sticky'
      ? { position: 'sticky', top: 0, zIndex: 30 }
      : navbarBehavior === 'hide-on-scroll'
        ? {
            position: 'sticky',
            top: 0,
            zIndex: 30,
            transform: effectiveHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
          }
        : { position: 'relative' }),
  };

  return (
    <div className="h-full flex flex-col bg-gray-200">
      {/* Google Fonts */}
      <style>{`@import url('${fontUrl}');`}</style>

      {/* Scrollable preview container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {/* Simulated WordPress Admin Bar */}
        <div
          className="flex items-center px-4 shrink-0"
          style={{
            height: 32,
            backgroundColor: '#1d2327',
            color: '#c3c4c7',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 13,
            borderBottom: '1px solid #000000',
          }}
        >
          <svg className="h-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
            <path d="M20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10 10-4.48 10-10zM10 1.01c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" opacity=".2"/>
            <path d="M11.26 1.35l-.27-.03c-.03 0-.06 0-.08-.01l-.26-.02c-.12 0-.24-.01-.36-.01h-.12c-.07 0-.13 0-.2.01l-.21.01c-.04 0-.08 0-.12.01l-.24.02c-.17.01-.34.04-.5.07l-.12.02c-.08.01-.16.03-.24.05l-.12.03c-.07.02-.14.04-.21.06l-.1.03c-.08.02-.16.05-.23.08l-.09.03c-.08.03-.16.06-.23.1l-.07.03c-.08.04-.16.07-.24.12l-.05.02c-.08.04-.16.09-.24.14l-.04.02c-.08.05-.16.1-.24.16l-.03.02c-.08.06-.15.11-.23.17l-.02.02c-.08.06-.15.13-.22.19l-.01.01c-.07.07-.14.14-.21.21l-.01.01c-.07.07-.13.15-.2.22l-.01.01c-.06.08-.12.15-.18.23l-.01.01c-.06.08-.12.16-.17.24l-.01.01c-.05.08-.1.16-.15.24l-.01.01c-.05.08-.09.17-.13.25l-.01.01c-.04.09-.08.17-.12.26l-.01.01c-.03.09-.07.17-.1.26l-.01.01c-.03.09-.06.17-.08.26l-.01.01c-.03.09-.05.18-.07.27v.01c-.02.09-.04.18-.05.27v.01c-.01.09-.03.18-.04.27v.01c-.01.09-.02.18-.02.28v.01c-.01.09-.01.19-.01.28v9.75c0 .62.5 1.12 1.12 1.12h.46c.62 0 1.12-.5 1.12-1.12V4.5h5.17c.62 0 1.12-.5 1.12-1.12v-.46c0-.62-.5-1.12-1.12-1.12h-5.17V1.12C6.93.5 6.43 0 5.81 0h-.46c-.62 0-1.12.5-1.12 1.12v.23h4.87c.16 0 .29.13.29.29s-.13.29-.29.29H4.23c-.16 0-.29-.13-.29-.29s.13-.29.29-.29h.01V1.12c0-.16.13-.29.29-.29h.46c.16 0 .29.13.29.29v.12h4.87c.16 0 .29.13.29.29s-.13.29-.29.29H4.23c-.16 0-.29-.13-.29-.29v-.12c0-.09.04-.17.11-.22l.12-.02c.17-.01.34-.04.5-.07l.12-.02c.08-.01.16-.03.24-.05l.12-.03c.07-.02.14-.04.21-.06l.1-.03c.08-.02.16-.05.23-.08l.09-.03c.08-.03.16-.06.23-.1l.07-.03c.08-.04.16-.07.24-.12l.05-.02c.08-.04.16-.09.24-.14l.04-.02c.08-.05.16-.1.24-.16l.03-.02c.08-.06.15-.11.23-.17l.02-.02c.08-.06.15-.13.22-.19l.01-.01c.07-.07.14-.14.21-.21l.01-.01c.07-.07.13-.15.2-.22l.01-.01c.06-.08.12-.15.18-.23l.01-.01c.06-.08.12-.16.17-.24l.01-.01c.05-.08.1-.16.15-.24l.01-.01c.05-.08.09-.17.13-.25l.01-.01c.04-.09.08-.17.12-.26l.01-.01c.03-.09.07-.17.1-.26l.01-.01c.03-.09.06-.17.08-.26l.01-.01c.03-.09.05-.18.07-.27v-.01c.02-.09.04-.18.05-.27v-.01c.01-.09.03-.18.04-.27v-.01c.01-.09.02-.18.02-.28v-.01c.01-.09.01-.19.01-.28V2.5h.55c.16 0 .29.13.29.29v6.78c0 3.63-2.95 6.58-6.58 6.58-3.63 0-6.58-2.95-6.58-6.58V3.39c0-.16.13-.29.29-.29h.07v-.01h.6v-.01c.01 0 .02 0 .03-.01z"/>
          </svg>
          <span style={{ fontWeight: 600, color: '#a7aaad' }}>WordPress</span>
          <span className="mx-2" style={{ color: '#50575e' }}>|</span>
          <span style={{ color: '#a7aaad' }}>{siteTitle}</span>
        </div>

        {/* Simulated Header / Navbar */}
        <header
          className="shrink-0"
          style={headerStyle}
        >
          <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div
                  className="h-8 w-8 flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: primaryColor, borderRadius }}
                >
                  {siteTitle[0]?.toUpperCase() || 'W'}
                </div>
              )}
              <div>
                <div className="text-sm font-bold" style={{ fontFamily: headingFont, color: textColor }}>
                  {siteTitle}
                </div>
                {tagline && (
                  <div className="text-[10px]" style={{ color: `${textColor}60` }}>
                    {tagline}
                  </div>
                )}
              </div>
            </div>

            {/* Nav items — filtered by active page context */}
            <nav className="hidden sm:flex items-center gap-1">
              {visibleNavItems.slice(0, 6).map((item, i) => (
                <a
                  key={i}
                  href={item.url || '#'}
                  className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer transition-colors duration-150 no-underline"
                  style={{
                    color: i === 0 ? primaryColor : textColor,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const raw = (item.url || '').replace('#', '');
                    if (!raw || raw === '/') {
                      // Home link — go back to home preview
                      setActivePreviewPage(null);
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      return;
                    }
                    // Check if it's a custom page link (e.g. /servicios)
                    if (isCustomPageUrl(item.url || '')) {
                      setActivePreviewPage(item.url);
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                      return;
                    }
                    // Support both formats: #features and #section-features
                    const targetId = raw.startsWith('section-') ? raw.replace('section-', '') : raw;
                    const container = scrollContainerRef.current;
                    const target = container?.querySelector(`[data-section-id="${targetId}"]`);
                    if (container && target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onMouseEnter={(e) => {
                    // Highlight home link when on a custom page
                    const isHomeLink = !item.url || item.url === '/';
                    if (isHomeLink && activePreviewPage) {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#FFFFFF';
                    } else if (!isHomeLink) {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isHomeLink = !item.url || item.url === '/';
                    if (isHomeLink && activePreviewPage) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = primaryColor;
                    } else if (!isHomeLink) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textColor;
                    }
                  }}
                >
                  {item.label || `Nav ${i + 1}`}
                </a>
              ))}
            </nav>

            {/* Mobile menu icon */}
            <div className="sm:hidden" style={{ color: textColor }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content — All Sections */}
        <main
          className="min-h-[50vh]"
          style={{
            backgroundColor,
            color: textColor,
            fontFamily: bodyFont,
          }}
        >
          {/* Custom page back button */}
          {activePreviewPage && activePageName && (
            <div style={{ backgroundColor, borderBottom: `1px solid ${textColor}15` }}>
              <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 20px' }}>
                <button
                  onClick={() => {
                    setActivePreviewPage(null);
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  style={{
                    background: 'none',
                    border: `1px solid ${primaryColor}40`,
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: primaryColor,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Volver al Home
                </button>
                <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 600, color: textColor }}>
                  {activePageName}
                </span>
              </div>
            </div>
          )}
          {sections.map((section, index) => (
            <RenderSection
              key={`${section.type}-${index}`}
              section={section}
              colors={colors}
              borderRadius={borderRadius}
              headingFont={headingFont}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          ))}

          {sections.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm" style={{ color: `${textColor}40` }}>
                Aún no hay secciones. Añade secciones en el editor para ver la vista previa en vivo.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: '#111827',
            color: '#D1D5DB',
            fontFamily: bodyFont,
          }}
        >
          {/* Footer columns */}
          {footerColumns.length > 0 && (
            <div className="px-6 py-10 max-w-5xl mx-auto">
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(footerColumns.length, 4)}, 1fr)`,
                }}
              >
                {footerColumns.map((col, i) => (
                  <div key={i}>
                    <h4
                      className="text-sm font-bold mb-3"
                      style={{ fontFamily: headingFont, color: '#FFFFFF' }}
                    >
                      {col.title || `Columna ${i + 1}`}
                    </h4>
                    <ul className="space-y-2">
                      {(col.links || []).map((link, li) => (
                        <li key={li}>
                          <span className="text-xs hover:text-white transition-colors cursor-default" style={{ color: '#9CA3AF' }}>
                            {link.label || `Link ${li + 1}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom bar */}
          <div
            className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-xs" style={{ color: '#6B7280' }}>
              {copyrightText || `\u00A9 ${new Date().getFullYear()} ${siteTitle}. Todos los derechos reservados.`}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((link, i) => (
                  <span key={i} className="cursor-default hover:text-white transition-colors" style={{ color: '#6B7280' }}>
                    <SocialIcon platform={link.platform} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollToTop && scrollY > 300 && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer border-0"
            style={{
              backgroundColor: primaryColor,
              color: '#FFFFFF',
            }}
            title="Volver arriba"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
