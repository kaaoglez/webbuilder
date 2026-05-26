'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import type { PageSection } from '@/lib/builder-types';
import { generateProfessionalHTML } from '@/lib/html-export';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Check,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Zap,
  Shield,
  Sparkles,
  BarChart3,
  Headphones,
  Puzzle,
  Users,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
  User,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Globe,
  MessageCircle,
  Heart,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Icon Map
// ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Shield, Sparkles, BarChart3, Headphones, Puzzle,
  Users, Database, Activity, Star, Globe, Heart, MessageCircle,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Zap;
}

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter, linkedin: Linkedin, github: Github, instagram: Instagram,
};

// ─────────────────────────────────────────────────────────────
// Border Radius Helper
// ─────────────────────────────────────────────────────────────

function br(radius: string): string {
  switch (radius) {
    case 'none': return '0px';
    case 'small': return '4px';
    case 'medium': return '8px';
    case 'large': return '16px';
    case 'full': return '9999px';
    default: return '8px';
  }
}

// ─────────────────────────────────────────────────────────────
// Device Types
// ─────────────────────────────────────────────────────────────

type DeviceMode = 'mobile' | 'tablet' | 'desktop';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

// ─────────────────────────────────────────────────────────────
// Avatar Placeholder Generator
// ─────────────────────────────────────────────────────────────

function AvatarPlaceholder({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex items-center justify-center text-white font-semibold rounded-full"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${(hue + 40) % 360}, 60%, 55%))`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Renderers
// ─────────────────────────────────────────────────────────────

function HeroSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'hero' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const heightMap = { small: '400px', medium: '520px', large: '640px' };

  const alignmentMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: heightMap[data.height] }}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: data.backgroundImage ? '#000000' : 'transparent',
          opacity: (data.overlayOpacity || 0) / 100,
        }}
      />

      {/* Background Image */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'white' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'white' }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 flex flex-col ${alignmentMap[data.alignment]}`}>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: theme.headingFont }}
        >
          {data.title}
        </h1>
        <p
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-8 leading-relaxed"
          style={{ fontFamily: theme.bodyFont }}
        >
          {data.subtitle}
        </p>
        <div className="flex flex-wrap gap-4">
          {data.ctaText && (
            <a
              href={data.ctaLink}
              className="inline-flex items-center px-8 py-3.5 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: theme.accentColor,
                borderRadius: br(theme.borderRadius),
              }}
            >
              {data.ctaText}
            </a>
          )}
          {data.secondaryCtaText && (
            <a
              href={data.secondaryCtaLink}
              className="inline-flex items-center px-8 py-3.5 text-white font-semibold border-2 border-white/30 rounded-lg transition-all duration-200 hover:bg-white/10"
              style={{ borderRadius: br(theme.borderRadius) }}
            >
              {data.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'features' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const colClass = `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid ${colClass} gap-8`}>
          {data.features.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <div
                key={feature.id}
                className="group p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: br(theme.borderRadius),
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${theme.primaryColor}15`,
                    borderRadius: br(theme.borderRadius),
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: theme.primaryColor }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: theme.textColor, fontFamily: theme.headingFont }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${theme.textColor}80`, fontFamily: theme.bodyFont }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'about' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06` }}>
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col ${data.imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
          {/* Text */}
          <div className="flex-1">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: theme.textColor, fontFamily: theme.headingFont }}
            >
              {data.title}
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
            >
              {data.description}
            </p>
            {/* Stats */}
            {data.stats.length > 0 && (
              <div className="flex flex-wrap gap-8">
                {data.stats.map((stat, idx) => (
                  <div key={idx}>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Image Placeholder */}
          <div className="flex-1 w-full">
            <div
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden"
              style={{
                borderRadius: br(theme.borderRadius),
                background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
              }}
            >
              {data.image ? (
                <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center opacity-50">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke={theme.primaryColor} strokeWidth={1} viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-sm" style={{ color: theme.primaryColor, fontFamily: theme.bodyFont }}>
                      Imagen
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'testimonials' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: br(theme.borderRadius),
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    style={{
                      color: i < t.rating ? theme.accentColor : '#E5E7EB',
                      fill: i < t.rating ? theme.accentColor : 'none',
                    }}
                  />
                ))}
              </div>
              {/* Quote */}
              <p
                className="text-base leading-relaxed mb-6 italic"
                style={{ color: `${theme.textColor}CC`, fontFamily: theme.bodyFont }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <AvatarPlaceholder name={t.name} size={44} />
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: theme.textColor, fontFamily: theme.headingFont }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
                  >
                    {t.role}
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

function PricingSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'pricing' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06` }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {data.plans.map((plan) => (
            <div
              key={plan.id}
              className="relative p-8 rounded-xl transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: br(theme.borderRadius),
                boxShadow: plan.highlighted
                  ? `0 20px 40px ${theme.primaryColor}25`
                  : '0 1px 3px rgba(0,0,0,0.08)',
                border: plan.highlighted ? `2px solid ${theme.primaryColor}` : '2px solid transparent',
                transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Popular
                </div>
              )}
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: theme.textColor, fontFamily: theme.headingFont }}
              >
                {plan.name}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
              >
                {plan.description}
              </p>
              <div className="flex items-end gap-1 mb-8">
                <span
                  className="text-4xl font-bold"
                  style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
                >
                  ${plan.price}
                </span>
                <span
                  className="text-sm mb-1"
                  style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Check className="w-3 h-3" style={{ color: theme.primaryColor }} />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: theme.textColor, fontFamily: theme.bodyFont }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block text-center py-3 font-semibold rounded-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: plan.highlighted ? theme.primaryColor : 'transparent',
                  color: plan.highlighted ? '#FFFFFF' : theme.primaryColor,
                  border: plan.highlighted ? 'none' : `2px solid ${theme.primaryColor}`,
                  borderRadius: br(theme.borderRadius),
                  fontFamily: theme.bodyFont,
                }}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASectionRender({ section, theme }: { section: Extract<PageSection, { type: 'cta' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            data.backgroundStyle === 'gradient'
              ? `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`
              : data.backgroundStyle === 'solid'
                ? theme.primaryColor
                : `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        }}
      />
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: theme.headingFont }}
        >
          {data.title}
        </h2>
        <p
          className="text-lg text-white/80 mb-8"
          style={{ fontFamily: theme.bodyFont }}
        >
          {data.subtitle}
        </p>
        <a
          href={data.ctaLink}
          className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          style={{
            backgroundColor: theme.accentColor,
            borderRadius: br(theme.borderRadius),
          }}
        >
          {data.ctaText}
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

function ContactSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'contact' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Email */}
          <div
            className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: br(theme.borderRadius),
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${theme.primaryColor}12` }}
            >
              <Mail className="w-6 h-6" style={{ color: theme.primaryColor }} />
            </div>
            <div
              className="text-sm font-medium mb-1"
              style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Email
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: theme.textColor, fontFamily: theme.bodyFont }}
            >
              {data.email}
            </div>
          </div>
          {/* Phone */}
          <div
            className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: br(theme.borderRadius),
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${theme.primaryColor}12` }}
            >
              <Phone className="w-6 h-6" style={{ color: theme.primaryColor }} />
            </div>
            <div
              className="text-sm font-medium mb-1"
              style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Teléfono
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: theme.textColor, fontFamily: theme.bodyFont }}
            >
              {data.phone}
            </div>
          </div>
          {/* Address */}
          <div
            className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: br(theme.borderRadius),
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${theme.primaryColor}12` }}
            >
              <MapPin className="w-6 h-6" style={{ color: theme.primaryColor }} />
            </div>
            <div
              className="text-sm font-medium mb-1"
              style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Dirección
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: theme.textColor, fontFamily: theme.bodyFont }}
            >
              {data.address}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySectionRender({ section, theme }: { section: Extract<PageSection, { type: 'gallery' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const colClass = `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid ${colClass} gap-4`}>
          {data.images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
              style={{ borderRadius: br(theme.borderRadius) }}
            >
              <div
                className="w-full aspect-square"
                style={{
                  background: img.src
                    ? `url(${img.src}) center/cover`
                    : `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}20)`,
                }}
              >
                {!img.src && (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 opacity-30" fill="none" stroke={theme.primaryColor} strokeWidth={1.5} viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">{img.caption}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'faq' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06` }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className="space-y-3">
          {data.items.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: br(theme.borderRadius),
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <span
                    className="font-semibold text-base pr-4"
                    style={{ color: theme.textColor, fontFamily: theme.headingFont }}
                  >
                    {item.question}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: isOpen ? theme.primaryColor : `${theme.primaryColor}12`,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown
                      className="w-4 h-4 transition-colors duration-300"
                      style={{ color: isOpen ? '#FFFFFF' : theme.primaryColor }}
                    />
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '300px' : '0px' }}
                >
                  <div className="px-6 pb-5">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: `${theme.textColor}80`, fontFamily: theme.bodyFont }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'stats' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6">
      <div
        className="max-w-6xl mx-auto rounded-2xl py-16 px-8"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          borderRadius: br(theme.borderRadius),
        }}
      >
        {data.title && (
          <h2
            className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
            style={{ fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items.map((stat, idx) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div
                  className="text-3xl md:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: theme.headingFont }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm text-white/70"
                  style={{ fontFamily: theme.bodyFont }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TeamSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'team' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor, fontFamily: theme.headingFont }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}99`, fontFamily: theme.bodyFont }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.members.map((member) => (
            <div
              key={member.id}
              className="group text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: br(theme.borderRadius),
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex justify-center mb-5">
                <AvatarPlaceholder name={member.name} size={80} />
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: theme.textColor, fontFamily: theme.headingFont }}
              >
                {member.name}
              </h3>
              <p
                className="text-sm mb-3"
                style={{ color: theme.primaryColor, fontFamily: theme.bodyFont }}
              >
                {member.role}
              </p>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: `${theme.textColor}70`, fontFamily: theme.bodyFont }}
              >
                {member.bio}
              </p>
              <div className="flex justify-center gap-3">
                {member.socials.map((social, idx) => {
                  const SocialIcon = SOCIAL_ICON_MAP[social.platform] || Globe;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                      style={{
                        backgroundColor: `${theme.primaryColor}12`,
                        color: theme.primaryColor,
                      }}
                    >
                      <SocialIcon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;

  return (
    <footer className="py-16 px-6" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: theme.headingFont }}
            >
              {data.brandName}
            </h3>
            <p
              className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm"
              style={{ fontFamily: theme.bodyFont }}
            >
              {data.brandDescription}
            </p>
            <div className="flex gap-3">
              {data.socialLinks.map((social, idx) => {
                const SocialIcon = SOCIAL_ICON_MAP[social.platform] || Globe;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Link Columns */}
          {data.columns.map((col, idx) => (
            <div key={idx}>
              <h4
                className="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                style={{ fontFamily: theme.headingFont }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.url}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                      style={{ fontFamily: theme.bodyFont }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p
            className="text-sm text-gray-500 text-center"
            style={{ fontFamily: theme.bodyFont }}
          >
            {data.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Router
// ─────────────────────────────────────────────────────────────

function RenderSection({ section, theme }: { section: PageSection; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  switch (section.type) {
    case 'hero':
      return <HeroSectionRender section={section} theme={theme} />;
    case 'features':
      return <FeaturesSectionRender section={section} theme={theme} />;
    case 'about':
      return <AboutSectionRender section={section} theme={theme} />;
    case 'testimonials':
      return <TestimonialsSectionRender section={section} theme={theme} />;
    case 'pricing':
      return <PricingSectionRender section={section} theme={theme} />;
    case 'cta':
      return <CTASectionRender section={section} theme={theme} />;
    case 'contact':
      return <ContactSectionRender section={section} theme={theme} />;
    case 'gallery':
      return <GallerySectionRender section={section} theme={theme} />;
    case 'faq':
      return <FAQSectionRender section={section} theme={theme} />;
    case 'stats':
      return <StatsSectionRender section={section} theme={theme} />;
    case 'team':
      return <TeamSectionRender section={section} theme={theme} />;
    case 'footer':
      return <FooterSectionRender section={section} theme={theme} />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// HTML Export — delegates to professional engine
// ─────────────────────────────────────────────────────────────

function generateHTML(page: NonNullable<ReturnType<typeof useBuilderStore>['currentPage']>) {
  return generateProfessionalHTML(page);
}

// ─────────────────────────────────────────────────────────────
// Main PreviewPanel Component
// ─────────────────────────────────────────────────────────────

export function PreviewPanel() {
  const { showPreview, setShowPreview, currentPage } = useBuilderStore();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const enabledSections = useMemo(
    () => (currentPage?.sections ?? []).filter((s) => s.enabled),
    [currentPage]
  );

  const theme = currentPage?.theme;

  const handleClose = useCallback(() => {
    setShowPreview(false);
  }, [setShowPreview]);

  const handleDownloadHTML = useCallback(() => {
    if (!currentPage) return;
    const html = generateHTML(currentPage);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.slug || 'page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentPage]);

  // ESC to close
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && showPreview) handleClose();
    });
  }

  if (!showPreview || !currentPage || !theme) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: '#1e1e2e' }}>
      {/* ─── Floating Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ backgroundColor: '#1e1e2e' }}>
        <div className="flex items-center gap-2">
          {/* Close */}
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-white/10 hover:text-white transition-colors duration-150"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar</span>
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Device Toggles */}
          <div className="flex items-center rounded-lg overflow-hidden border border-white/10">
            {([
              { mode: 'mobile' as DeviceMode, icon: Smartphone, label: 'Mobile' },
              { mode: 'tablet' as DeviceMode, icon: Tablet, label: 'Tablet' },
              { mode: 'desktop' as DeviceMode, icon: Monitor, label: 'Desktop' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-150 ${
                  deviceMode === mode
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-500'
                }`}
                style={{
                  backgroundColor: deviceMode === mode ? `${theme.primaryColor}30` : 'transparent',
                }}
                title={`${label} (${DEVICE_WIDTHS[mode]})`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download */}
        <button
          onClick={handleDownloadHTML}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Descargar HTML</span>
        </button>
      </div>

      {/* ─── Preview Container ─── */}
      <div className="flex-1 overflow-auto flex justify-center p-4 md:p-8">
        <div
          className="preview-frame transition-all duration-300 ease-in-out"
          style={{
            width: DEVICE_WIDTHS[deviceMode],
            maxWidth: '100%',
            height: 'fit-content',
            minHeight: '100%',
            borderRadius: deviceMode === 'desktop' ? '0' : '12px',
            boxShadow:
              deviceMode === 'desktop'
                ? 'none'
                : '0 25px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <div
            className="w-full"
            style={{
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.bodyFont,
            }}
          >
            {enabledSections.length === 0 ? (
              <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <p className="text-lg" style={{ color: `${theme.textColor}50` }}>
                  No hay secciones habilitadas
                </p>
              </div>
            ) : (
              enabledSections.map((section) => (
                <RenderSection key={section.id} section={section} theme={theme} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
