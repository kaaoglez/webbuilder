'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import type { PageSection } from '@/lib/builder-types';
import { getSectionSizingStyles } from '@/lib/builder-utils';
import type { SectionSizing } from '@/lib/builder-types';

// ─────────────────────────────────────────────────────────────
// Helpers: granular checks for custom image overrides
// ─────────────────────────────────────────────────────────────

/** True when user set explicit dimensions that replace aspect-ratio classes */
function hasCustomImageDimensions(sizing?: SectionSizing): boolean {
  if (!sizing) return false;
  return !!(
    sizing.customImageHeight != null ||
    sizing.customImageWidth != null ||
    (sizing.imageAspectRatio && sizing.imageAspectRatio !== 'auto')
  );
}

/** True when user changed object-fit from the default */
function hasCustomImageFit(sizing?: SectionSizing): boolean {
  if (!sizing) return false;
  return !!sizing.imageFit;
}

/** True when user set explicit border-radius that replaces theme preset */
function hasCustomImageRadius(sizing?: SectionSizing): boolean {
  if (!sizing) return false;
  return sizing.customImageBorderRadius != null;
}

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
  const sz = getSectionSizingStyles(section.sizing);
  const heightMap = { small: '400px', medium: '520px', large: '640px' };

  const alignmentMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: heightMap[data.height], ...sz.sectionStyle }}
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
          className={`absolute inset-0 ${hasCustomImageFit(section.sizing) || hasCustomImageDimensions(section.sizing) ? '' : 'bg-contain bg-center'}`}
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
            ...sz.imageContainerStyle,
          }}
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
      <div className={`relative z-10 max-w-4xl mx-auto px-6 flex flex-col ${alignmentMap[data.alignment]}`} style={{ ...sz.containerStyle }}>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: theme.headingFont, ...sz.titleStyle }}
        >
          {data.title}
        </h1>
        <p
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-8 leading-relaxed"
          style={{ fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
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
  const sz = getSectionSizingStyles(section.sizing);
  const colClass = `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid ${colClass} gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
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
                  ...sz.cardStyle,
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
                  style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06`, ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className={`flex flex-col ${data.imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
          {/* Text */}
          <div className="flex-1">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
            >
              {data.title}
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}
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
                      style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
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
              className={`w-full overflow-hidden ${hasCustomImageDimensions(section.sizing) ? '' : 'aspect-[4/3] rounded-2xl'}`}
              style={{
                borderRadius: hasCustomImageRadius(section.sizing) ? undefined : br(theme.borderRadius),
                background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
                ...sz.imageContainerStyle,
              }}
            >
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.title}
                  className={`w-full h-full ${hasCustomImageFit(section.sizing) ? '' : 'object-contain'}`}
                  style={{ ...sz.imageStyle }}
                />
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: br(theme.borderRadius),
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                ...sz.cardStyle,
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
                style={{ color: sz.textColor ? `${sz.textColor}CC` : `${theme.textColor}CC`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <AvatarPlaceholder name={t.name} size={44} />
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06`, ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${sz.gapClass} items-start`} style={{ ...sz.gapStyle }}>
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
                ...sz.cardStyle,
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
                style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}
              >
                {plan.name}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
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
                  style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
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
                      style={{ color: sz.textColor || theme.textColor, fontFamily: theme.bodyFont }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ ...sz.sectionStyle }}>
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
          className={`absolute inset-0 ${hasCustomImageFit(section.sizing) || hasCustomImageDimensions(section.sizing) ? '' : 'bg-contain bg-center'}`}
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
            ...sz.imageContainerStyle,
          }}
        />
      )}
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center" style={{ ...sz.containerStyle }}>
        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: theme.headingFont, ...sz.titleStyle }}
        >
          {data.title}
        </h2>
        <p
          className="text-lg text-white/80 mb-8"
          style={{ fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${sz.gapClass} max-w-3xl mx-auto`} style={{ ...sz.gapStyle }}>
          {/* Email */}
          <div
            className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: br(theme.borderRadius),
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              ...sz.cardStyle,
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
              style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Email
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: sz.textColor || theme.textColor, fontFamily: theme.bodyFont }}
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
              ...sz.cardStyle,
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
              style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Teléfono
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: sz.textColor || theme.textColor, fontFamily: theme.bodyFont }}
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
              ...sz.cardStyle,
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
              style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}
            >
              Dirección
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: sz.textColor || theme.textColor, fontFamily: theme.bodyFont }}
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
  const sz = getSectionSizingStyles(section.sizing);
  const colClass = `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid ${colClass} gap-4 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
              style={{ borderRadius: br(theme.borderRadius), ...sz.cardStyle }}
            >
              <div
                className={`w-full ${hasCustomImageDimensions(section.sizing) ? '' : 'aspect-square'}`}
                style={{
                  ...(img.src
                    ? {
                        backgroundImage: `url(${img.src})`,
                        backgroundPosition: 'center',
                        backgroundSize: section.sizing?.imageFit || 'cover',
                        backgroundRepeat: 'no-repeat',
                      }
                    : {
                        background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}20)`,
                      }),
                  ...sz.imageContainerStyle,
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
  const sz = getSectionSizingStyles(section.sizing);
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
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06`, ...sz.sectionStyle }}>
      <div className="max-w-3xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
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
                  ...sz.cardStyle,
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <span
                    className="font-semibold text-base pr-4"
                    style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}
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
                      style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div
        className="max-w-6xl mx-auto rounded-2xl py-16 px-8"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          borderRadius: br(theme.borderRadius),
          ...sz.containerStyle,
        }}
      >
        {data.title && (
          <h2
            className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
            style={{ fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
        )}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}
          >
            {data.subtitle}
          </p>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.members.map((member) => (
            <div
              key={member.id}
              className="group text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: br(theme.borderRadius),
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                ...sz.cardStyle,
              }}
            >
              <div className="flex justify-center mb-5">
                <AvatarPlaceholder name={member.name} size={80} />
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}
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
                style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}
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
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <footer className="py-16 px-6" style={{ backgroundColor: '#1a1a1a', ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: theme.headingFont, ...sz.titleStyle }}
            >
              {data.brandName}
            </h3>
            <p
              className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm"
              style={{ fontFamily: theme.bodyFont, ...sz.bodyStyle }}
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
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition-all duration-200"
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
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
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

// ─── Navbar Section Render ────────────────────────────────────
function NavbarSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'navbar' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);

  const bgMap: Record<string, string> = {
    solid: data.backgroundColor || '#FFFFFF',
    transparent: 'transparent',
    sticky: data.backgroundColor || '#FFFFFF',
    floating: data.backgroundColor || '#FFFFFF',
  };

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 transition-all duration-300"
      style={{
        backgroundColor: bgMap[data.style],
        color: data.textColor || theme.textColor,
        boxShadow: data.style === 'floating' ? '0 4px 20px rgba(0,0,0,0.1)' : data.style === 'sticky' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        ...sz.sectionStyle,
        borderRadius: data.style === 'floating' ? br(theme.borderRadius) : '0px',
        position: data.style === 'sticky' ? 'sticky' : 'relative',
        top: data.style === 'sticky' ? 0 : undefined,
        zIndex: data.style === 'sticky' ? 50 : 'auto',
      }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between" style={{ ...sz.containerStyle }}>
        <div className="flex items-center gap-3">
          {data.logo ? (
            <img src={data.logo} alt={data.brandName} className="h-8 w-auto" style={{ borderRadius: br(theme.borderRadius), ...sz.imageStyle }} />
          ) : (
            <div className="text-lg font-bold" style={{ color: data.textColor || theme.textColor, fontFamily: theme.headingFont }}>
              {data.brandName || 'Marca'}
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-6">
          {data.links.map((link) => (
            <a key={link.id} href={link.url} className="text-sm font-medium transition-colors duration-200 hover:opacity-70" style={{ color: data.textColor || theme.textColor, fontFamily: theme.bodyFont }}>
              {link.label}
            </a>
          ))}
        </div>
        {data.ctaText && (
          <a href={data.ctaLink} className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: theme.primaryColor, borderRadius: br(theme.borderRadius) }}>
            {data.ctaText}
          </a>
        )}
      </div>
    </nav>
  );
}

// ─── Blog List Section Render ─────────────────────────────────
function BlogListSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'blog_list' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const colClass = data.layout === 'list' ? 'grid-cols-1' : `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  const blogPosts = [
    { title: 'Artículo de ejemplo 1', category: 'Tecnología', date: '2025-01-15', author: 'Autor 1', excerpt: 'Un breve extracto del artículo para mostrar en la vista previa del blog...' },
    { title: 'Artículo de ejemplo 2', category: 'Diseño', date: '2025-01-10', author: 'Autor 2', excerpt: 'Otro extracto de artículo de ejemplo para la vista previa...' },
    { title: 'Artículo de ejemplo 3', category: 'Marketing', date: '2025-01-05', author: 'Autor 3', excerpt: 'Tercer extracto de artículo para completar la cuadrícula del blog...' },
  ];

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className={data.layout === 'list' ? `max-w-3xl mx-auto space-y-6 ${sz.gapClass}` : `grid ${colClass} gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {blogPosts.map((post, idx) => (
            <div key={idx} className="group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...sz.cardStyle }}>
              <div className={hasCustomImageDimensions(section.sizing) ? '' : 'aspect-video'} style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}20)`, ...sz.imageStyle }} />
              <div className="p-6">
                {data.showCategory && <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor, fontFamily: theme.bodyFont }}>{post.category}</span>}
                <h3 className="text-lg font-semibold mb-2" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}>{post.title}</h3>
                {data.showExcerpt && <p className="text-sm leading-relaxed mb-3" style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-sm" style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}>
                  {data.showAuthor && <span>{post.author}</span>}
                  {data.showAuthor && data.showDate && <span>·</span>}
                  {data.showDate && <span>{post.date}</span>}
                </div>
                <a href="#" className="inline-block mt-3 text-sm font-semibold transition-colors duration-200" style={{ color: theme.primaryColor, fontFamily: theme.bodyFont }}>{data.readMoreText || 'Leer más'} →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services Section Render ────────────────────────────────────
function ServicesSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'services' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const colClass = `grid-cols-1 sm:grid-cols-2 ${data.columns === 3 ? 'lg:grid-cols-3' : data.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`;

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className={`grid ${colClass} gap-8 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className="group p-8 rounded-xl transition-all duration-300 hover:shadow-xl relative overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: item.highlighted ? `0 20px 40px ${theme.primaryColor}20` : '0 1px 3px rgba(0,0,0,0.08)', border: item.highlighted ? `2px solid ${theme.primaryColor}` : '2px solid transparent', ...sz.cardStyle }}>
                {item.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white rounded-full" style={{ backgroundColor: theme.primaryColor }}>Popular</div>}
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${theme.primaryColor}15`, borderRadius: br(theme.borderRadius) }}>
                  <Icon className="w-7 h-7" style={{ color: theme.primaryColor }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}>{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>{item.description}</p>
                {item.price && <div className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}>${item.price}</div>}
                {item.features.length > 0 && (
                  <ul className="space-y-2">
                    {item.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${theme.primaryColor}15` }}><Check className="w-3 h-3" style={{ color: theme.primaryColor }} /></div><span className="text-sm" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.bodyFont }}>{f}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Video Section Render ──────────────────────────────────────
function VideoSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'video' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const aspectMap: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' };

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-4xl mx-auto" style={{ ...sz.containerStyle }}>
        {data.title && <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>}
        <div className="relative rounded-xl overflow-hidden" style={{ borderRadius: br(theme.borderRadius), boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ paddingTop: aspectMap[data.aspectRatio] || '56.25%', position: 'relative' }}>
            {data.url ? (
              <iframe src={data.url} className="absolute inset-0 w-full h-full" allow={data.autoplay ? 'autoplay' : ''} muted={data.muted} controls={data.showControls ? '1' : '0'} style={{ border: 'none' }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}20)` }}>
                <svg className="w-16 h-16 opacity-30" fill="none" stroke={theme.primaryColor} strokeWidth={1.5} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 12 3 21 21 12 19 5 12 5 3 12 19 21 19 3 5" /></svg>
              </div>
            )}
            {data.overlayEnabled && data.overlayText && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ paddingTop: aspectMap[data.aspectRatio] || '56.25%', position: 'relative' }}>
                <p className="text-xl md:text-2xl font-bold text-white text-center px-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily: theme.headingFont }}>{data.overlayText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section Render ────────────────────────────────
function NewsletterSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'newsletter' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ backgroundColor: data.backgroundColor || `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`, ...sz.sectionStyle }}>
      <div className="max-w-2xl mx-auto text-center" style={{ ...sz.containerStyle }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: data.textColor || '#FFFFFF', fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
        <p className="text-lg mb-8" style={{ color: `${data.textColor || '#FFFFFF'}80`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input type="email" placeholder={data.inputPlaceholder} className="flex-1 px-4 py-3 text-sm rounded-lg border-0 outline-none" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: data.textColor || '#FFFFFF', borderRadius: br(theme.borderRadius), fontFamily: theme.bodyFont }} readOnly />
          <button className="px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 hover:scale-105" style={{ backgroundColor: theme.accentColor, color: '#FFFFFF', borderRadius: br(theme.borderRadius), fontFamily: theme.bodyFont }}>{data.buttonText}</button>
        </div>
      </div>
    </section>
  );
}

// ─── Social Feed Section Render ────────────────────────────────
function SocialFeedSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'social_feed' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);

  const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = { twitter: Twitter, instagram: Instagram, linkedin: Linkedin, github: Github, youtube: Globe };

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.platforms.map((p) => {
            const Icon = platformIcons[p.platform] || Globe;
            return (
              <a key={p.id} href={p.url} target="_blank" className="flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 hover:shadow-lg text-center" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...sz.cardStyle }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primaryColor}12`, borderRadius: br(theme.borderRadius) }}>
                  <Icon className="w-6 h-6" style={{ color: theme.primaryColor }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}>{p.handle || p.platform}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Map Embed Section Render ─────────────────────────────────
function MapEmbedSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'map_embed' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const heightMap: Record<string, string> = { small: '300px', medium: '450px', large: '600px', custom: `${data.customHeight}px` };

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-6xl mx-auto" style={{ ...sz.containerStyle }}>
        {data.title && <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>}
        <div className="rounded-xl overflow-hidden" style={{ height: heightMap[data.height] || '450px', borderRadius: br(theme.borderRadius), boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {data.url ? (
            <iframe src={data.url} className="w-full h-full border-0" style={{ filter: data.style === 'dark' ? 'invert(90%) hue-rotate(180deg)' : 'none' }} loading="lazy" title={data.markerLabel} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#E8E8E8' }}>
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Countdown Section Render ───────────────────────────────
function CountdownSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'countdown' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);

  const target = new Date(data.targetDate).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    { label: 'Días', value: days, show: data.showDays },
    { label: 'Horas', value: hours, show: data.showHours },
    { label: 'Min', value: minutes, show: data.showMinutes },
    { label: 'Seg', value: seconds, show: data.showSeconds },
  ].filter((u) => u.show);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-4xl mx-auto text-center" style={{ ...sz.containerStyle }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
        <p className="text-lg mb-10" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        <div className="flex justify-center gap-4 mb-8">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: '80px', ...sz.cardStyle }}>
              <span className="text-3xl md:text-4xl font-bold" style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}>{String(u.value).padStart(2, '0')}</span>
              <span className="text-xs mt-1" style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}>{u.label}</span>
            </div>
          ))}
        </div>
        {diff <= 0 && data.ctaText && (
          <a href={data.ctaLink} className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105" style={{ backgroundColor: theme.accentColor, borderRadius: br(theme.borderRadius) }}>{data.ctaText}</a>
        )}
      </div>
    </section>
  );
}

// ─── Tabs Section Render ────────────────────────────────────
function TabsSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'tabs' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const [activeTab, setActiveTab] = useState(data.defaultTab || 0);
  const tab = data.items[activeTab];

  const styleMap: Record<string, string> = {
    line: `border-b-2 ${theme.primaryColor}`,
    card: `bg-white rounded-t-lg p-2 shadow-sm`,
    pill: `bg-${theme.primaryColor} text-white rounded-full px-4 py-1.5 text-sm font-medium`,
  };

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-4xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className={`flex flex-wrap gap-2 mb-6 ${data.style === 'pill' ? 'justify-center' : ''}`} style={data.style === 'line' ? { borderBottom: `2px solid ${theme.primaryColor}` } : undefined}>
          {data.items.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <button key={item.id} onClick={() => setActiveTab(index)} className="flex items-center gap-2 transition-all duration-200 cursor-pointer px-4 py-2.5 text-sm font-medium whitespace-nowrap" style={{ color: activeTab === index ? theme.primaryColor : sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont, backgroundColor: activeTab === index && data.style !== 'pill' ? `${theme.primaryColor}12` : 'transparent', borderRadius: data.style === 'pill' && activeTab === index ? theme.primaryColor : 'transparent', fontWeight: activeTab === index ? 600 : 500 }}>
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
        {tab && (
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...sz.cardStyle }}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>{tab.content}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Accordion Section Render ────────────────────────────────
function AccordionSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'accordion' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(data.items.filter((i) => i.defaultOpen).map((i) => i.id)));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (data.allowMultiple) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.clear(); next.add(id); }
      return next;
    });
  };

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06`, ...sz.sectionStyle }}>
      <div className="max-w-3xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className="space-y-3">
          {data.items.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div key={item.id} className="overflow-hidden rounded-xl transition-all duration-300" style={{ backgroundColor: isOpen ? theme.primaryColor : '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...sz.cardStyle }}>
                <button className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer" onClick={() => toggleItem(item.id)}>
                  <span className="font-semibold text-base pr-4" style={{ color: isOpen ? '#FFFFFF' : (sz.textColor || theme.textColor), fontFamily: theme.headingFont }}>{item.question}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300" style={{ backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : `${theme.primaryColor}12`, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown className="w-4 h-4 transition-colors duration-300" style={{ color: isOpen ? '#FFFFFF' : theme.primaryColor }} />
                  </div>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '300px' : '0px' }}>
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: isOpen ? 'rgba(255,255,255,0.85)' : sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>{item.answer}</p>
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

// ─── Timeline Section Render ─────────────────────────────────
function TimelineSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'timeline' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ ...sz.sectionStyle }}>
      <div className="max-w-4xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5" style={{ backgroundColor: `${theme.primaryColor}30` }} />
          <div className="space-y-8">
            {data.items.map((item, idx) => {
              const Icon = getIcon(item.icon);
              const isLeft = idx % 2 === 0;
              return (
                <div key={item.id} className="relative flex items-start gap-6 pl-8">
                  <div className="absolute left-1/2 w-10 h-10 rounded-full flex items-center justify-center -translate-x-1/2 z-10" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: `2px solid ${theme.primaryColor}` }}>
                    <Icon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  </div>
                  <div className={`flex-1 pb-8 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className={`text-xs font-semibold mb-1 ${isLeft ? 'text-right' : 'text-left'}`} style={{ color: theme.primaryColor, fontFamily: theme.bodyFont }}>{item.date}</div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: sz.textColor ? `${sz.textColor}80` : `${theme.textColor}80`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial Slider Section Render ──────────────────────
function TestimonialSliderSectionRender({ section, theme }: { section: Extract<PageSection, { type: 'testimonial_slider' }>; theme: ReturnType<typeof useBuilderStore>['currentPage']['theme'] }) {
  const { data } = section;
  const sz = getSectionSizingStyles(section.sizing);

  return (
    <section className="py-20 px-6" style={{ backgroundColor: `${theme.primaryColor}06`, ...sz.sectionStyle }}>
      <div className="max-w-4xl mx-auto" style={{ ...sz.containerStyle }}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont, ...sz.titleStyle }}>{data.title}</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: sz.textColor ? `${sz.textColor}99` : `${theme.textColor}99`, fontFamily: theme.bodyFont, ...sz.subtitleStyle }}>{data.subtitle}</p>
        </div>
        <div className={`space-y-6 ${sz.gapClass}`} style={{ ...sz.gapStyle }}>
          {data.testimonials.map((t) => (
            <div key={t.id} className="p-8 rounded-xl transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FFFFFF', borderRadius: br(theme.borderRadius), boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...sz.cardStyle }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: i < t.rating ? theme.accentColor : '#E5E7EB', fill: i < t.rating ? theme.accentColor : 'none' }} />
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 italic" style={{ color: sz.textColor ? `${sz.textColor}CC` : `${theme.textColor}CC`, fontFamily: theme.bodyFont, ...sz.bodyStyle }}>&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <AvatarPlaceholder name={t.name} size={44} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: sz.textColor || theme.textColor, fontFamily: theme.headingFont }}>{t.name}</div>
                  <div className="text-xs" style={{ color: sz.textColor ? `${sz.textColor}70` : `${theme.textColor}70`, fontFamily: theme.bodyFont }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.showDots && <div className="flex justify-center gap-2 mt-8">{data.testimonials.map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />)}</div>}
      </div>
    </section>
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
    case 'navbar':
      return <NavbarSectionRender section={section} theme={theme} />;
    case 'blog_list':
      return <BlogListSectionRender section={section} theme={theme} />;
    case 'services':
      return <ServicesSectionRender section={section} theme={theme} />;
    case 'video':
      return <VideoSectionRender section={section} theme={theme} />;
    case 'newsletter':
      return <NewsletterSectionRender section={section} theme={theme} />;
    case 'social_feed':
      return <SocialFeedSectionRender section={section} theme={theme} />;
    case 'map_embed':
      return <MapEmbedSectionRender section={section} theme={theme} />;
    case 'countdown':
      return <CountdownSectionRender section={section} theme={theme} />;
    case 'tabs':
      return <TabsSectionRender section={section} theme={theme} />;
    case 'accordion':
      return <AccordionSectionRender section={section} theme={theme} />;
    case 'timeline':
      return <TimelineSectionRender section={section} theme={theme} />;
    case 'testimonial_slider':
      return <TestimonialSliderSectionRender section={section} theme={theme} />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// HTML Export
// ─────────────────────────────────────────────────────────────

function generateHTML(page: NonNullable<ReturnType<typeof useBuilderStore>['currentPage']>) {
  const { theme, sections } = page;
  const enabledSections = sections.filter((s) => s.enabled);

  const fontLink = (font: string) =>
    `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontLink(theme.headingFont)}" rel="stylesheet">
  <link href="${fontLink(theme.bodyFont)}" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: '${theme.bodyFont}', sans-serif; color: ${theme.textColor}; background: ${theme.backgroundColor}; }
    h1, h2, h3, h4, h5, h6 { font-family: '${theme.headingFont}', sans-serif; }
    a { text-decoration: none; }
    img { max-width: 100%; height: auto; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    ${generateSectionCSS(theme)}
  </style>
</head>
<body>
  ${generateSectionHTML(enabledSections, theme)}
</body>
</html>`;
}

function generateSectionCSS(theme: ReturnType<typeof useBuilderStore>['currentPage']['theme']) {
  return `
    .hero { position: relative; display: flex; align-items: center; justify-content: center; min-height: 640px; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%); }
    .hero-content { position: relative; z-index: 1; text-align: center; padding: 48px 24px; max-width: 800px; }
    .hero h1 { font-size: 3rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 24px; }
    .hero p { font-size: 1.125rem; color: rgba(255,255,255,0.8); margin-bottom: 32px; line-height: 1.6; }
    .hero .cta-btn { display: inline-block; padding: 14px 32px; background: ${theme.accentColor}; color: #fff; font-weight: 600; border-radius: ${br(theme.borderRadius)}; transition: transform 0.2s; }
    .hero .cta-btn:hover { transform: scale(1.05); }
    .section { padding: 80px 0; }
    .section-alt { padding: 80px 0; background: ${theme.primaryColor}06; }
    .section-title { text-align: center; font-size: 2.25rem; font-weight: 700; margin-bottom: 12px; color: ${theme.textColor}; }
    .section-subtitle { text-align: center; font-size: 1.125rem; color: ${theme.textColor}99; max-width: 600px; margin: 0 auto 56px; }
    .card { background: #fff; padding: 32px; border-radius: ${br(theme.borderRadius)}; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: box-shadow 0.3s, transform 0.3s; }
    .card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: translateY(-4px); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
    @media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } .hero h1 { font-size: 2rem; } }
    .icon-circle { width: 48px; height: 48px; border-radius: ${br(theme.borderRadius)}; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; background: ${theme.primaryColor}15; }
    .btn-primary { display: inline-block; padding: 12px 28px; background: ${theme.primaryColor}; color: #fff; font-weight: 600; border-radius: ${br(theme.borderRadius)}; text-align: center; transition: opacity 0.2s; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-outline { display: inline-block; padding: 12px 28px; border: 2px solid ${theme.primaryColor}; color: ${theme.primaryColor}; font-weight: 600; border-radius: ${br(theme.borderRadius)}; text-align: center; }
    .stats-bar { background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}); border-radius: ${br(theme.borderRadius)}; padding: 64px 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
    .stats-bar .stat-value { font-size: 2.5rem; font-weight: 800; color: #fff; }
    .stats-bar .stat-label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    @media (max-width: 768px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } }
    .footer-section { background: #1a1a1a; padding: 64px 24px; color: #9ca3af; }
    .footer-section .brand-name { color: #fff; font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
    .footer-section a { color: #9ca3af; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
    .footer-section a:hover { color: #fff; }
    .footer-section .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; max-width: 1200px; margin: 0 auto 48px; }
    @media (max-width: 768px) { .footer-section .footer-grid { grid-template-columns: 1fr; gap: 32px; } }
    .footer-section .copyright { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; text-align: center; font-size: 0.875rem; color: #6b7280; }
  `;
}

function generateSectionHTML(sections: PageSection[], theme: ReturnType<typeof useBuilderStore>['currentPage']['theme']): string {
  return sections.map((section) => {
    switch (section.type) {
      case 'hero': {
        const d = section.data;
        return `<section class="hero"><div class="hero-bg"></div><div class="hero-content"><h1>${d.title}</h1><p>${d.subtitle}</p>${d.ctaText ? `<a href="${d.ctaLink}" class="cta-btn">${d.ctaText}</a>` : ''}</div></section>`;
      }
      case 'features': {
        const d = section.data;
        const colClass = d.columns === 2 ? 'grid-2' : d.columns === 4 ? 'grid-4' : 'grid-3';
        return `<section class="section"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="${colClass}">${d.features.map(f => `<div class="card"><div class="icon-circle">⚡</div><h3 style="color:${theme.textColor};font-family:${theme.headingFont};margin-bottom:8px">${f.title}</h3><p style="color:${theme.textColor}80;font-family:${theme.bodyFont};font-size:0.875rem;line-height:1.6">${f.description}</p></div>`).join('')}</div></div></section>`;
      }
      case 'about': {
        const d = section.data;
        return `<section class="section-alt"><div class="container"><div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center"><div><h2 class="section-title" style="text-align:left;margin-bottom:24px">${d.title}</h2><p style="color:${theme.textColor}99;font-family:${theme.bodyFont};line-height:1.8;margin-bottom:32px">${d.description}</p><div style="display:flex;gap:32px">${d.stats.map(s => `<div><div style="font-size:2rem;font-weight:700;color:${theme.primaryColor};font-family:${theme.headingFont}">${s.value}</div><div style="font-size:0.875rem;color:${theme.textColor}70">${s.label}</div></div>`).join('')}</div></div><div style="aspect-ratio:4/3;border-radius:${br(theme.borderRadius)};background:linear-gradient(135deg,${theme.primaryColor}20,${theme.secondaryColor}20)"></div></div></div></section>`;
      }
      case 'testimonials': {
        const d = section.data;
        return `<section class="section"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="grid-3">${d.testimonials.map(t => `<div class="card"><div style="color:${theme.accentColor};margin-bottom:16px">★★★★★</div><p style="color:${theme.textColor}CC;font-style:italic;line-height:1.6;margin-bottom:24px">"${t.quote}"</p><div style="font-weight:600;color:${theme.textColor}">${t.name}</div><div style="font-size:0.875rem;color:${theme.textColor}70">${t.role}</div></div>`).join('')}</div></div></section>`;
      }
      case 'pricing': {
        const d = section.data;
        return `<section class="section-alt"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="grid-3">${d.plans.map(p => `<div class="card" style="${p.highlighted ? `border:2px solid ${theme.primaryColor};transform:scale(1.05);box-shadow:0 20px 40px ${theme.primaryColor}25` : ''}"><h3 style="color:${theme.textColor};margin-bottom:8px">${p.name}</h3><p style="font-size:0.875rem;color:${theme.textColor}70;margin-bottom:24px">${p.description}</p><div style="margin-bottom:32px"><span style="font-size:2.5rem;font-weight:700;color:${theme.primaryColor}">$${p.price}</span><span style="color:${theme.textColor}70">${p.period}</span></div><ul style="list-style:none;margin-bottom:32px">${p.features.map(f => `<li style="padding:8px 0;font-size:0.875rem">✓ ${f}</li>`).join('')}</ul><a href="#" class="${p.highlighted ? 'btn-primary' : 'btn-outline'}" style="display:block;text-align:center">${p.ctaText}</a></div>`).join('')}</div></div></section>`;
      }
      case 'cta': {
        const d = section.data;
        return `<section style="padding:80px 0;background:linear-gradient(135deg,${theme.primaryColor},${theme.secondaryColor});text-align:center"><div class="container"><h2 style="color:#fff;font-size:2.25rem;font-weight:700;margin-bottom:16px">${d.title}</h2><p style="color:rgba(255,255,255,0.8);font-size:1.125rem;margin-bottom:32px">${d.subtitle}</p><a href="${d.ctaLink}" style="display:inline-block;padding:16px 40px;background:${theme.accentColor};color:#fff;font-weight:700;font-size:1.125rem;border-radius:${br(theme.borderRadius)}">${d.ctaText}</a></div></section>`;
      }
      case 'contact': {
        const d = section.data;
        return `<section class="section"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="grid-3" style="max-width:800px;margin:0 auto"><div class="card" style="text-align:center"><div style="font-size:0.875rem;color:${theme.textColor}70;margin-bottom:4px">Email</div><div style="font-weight:600;color:${theme.textColor}">${d.email}</div></div><div class="card" style="text-align:center"><div style="font-size:0.875rem;color:${theme.textColor}70;margin-bottom:4px">Teléfono</div><div style="font-weight:600;color:${theme.textColor}">${d.phone}</div></div><div class="card" style="text-align:center"><div style="font-size:0.875rem;color:${theme.textColor}70;margin-bottom:4px">Dirección</div><div style="font-weight:600;color:${theme.textColor}">${d.address}</div></div></div></div></section>`;
      }
      case 'stats': {
        const d = section.data;
        return `<div class="container" style="padding:80px 0"><div class="stats-bar">${d.items.map(s => `<div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('')}</div></div>`;
      }
      case 'team': {
        const d = section.data;
        return `<section class="section"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="grid-4">${d.members.map(m => `<div class="card" style="text-align:center"><div style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px;background:linear-gradient(135deg,${theme.primaryColor},${theme.secondaryColor})"></div><h3 style="color:${theme.textColor};margin-bottom:4px">${m.name}</h3><p style="color:${theme.primaryColor};font-size:0.875rem;margin-bottom:8px">${m.role}</p><p style="color:${theme.textColor}70;font-size:0.875rem">${m.bio}</p></div>`).join('')}</div></div></section>`;
      }
      case 'gallery': {
        const d = section.data;
        const colClass = d.columns === 2 ? 'grid-2' : d.columns === 4 ? 'grid-4' : 'grid-3';
        return `<section class="section"><div class="container"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div class="${colClass}">${d.images.map(img => `<div style="aspect-ratio:1;border-radius:${br(theme.borderRadius)};background:linear-gradient(135deg,${theme.primaryColor}15,${theme.secondaryColor}20);overflow:hidden">${img.caption ? `<div style="padding:12px;font-size:0.875rem;color:${theme.textColor}80">${img.caption}</div>` : ''}</div>`).join('')}</div></div></section>`;
      }
      case 'faq': {
        const d = section.data;
        return `<section class="section-alt"><div class="container" style="max-width:800px"><h2 class="section-title">${d.title}</h2><p class="section-subtitle">${d.subtitle}</p><div style="display:flex;flex-direction:column;gap:12px">${d.items.map(item => `<div class="card"><h3 style="color:${theme.textColor};font-weight:600;margin-bottom:8px">${item.question}</h3><p style="color:${theme.textColor}80;font-size:0.875rem;line-height:1.6">${item.answer}</p></div>`).join('')}</div></div></section>`;
      }
      case 'footer': {
        const d = section.data;
        return `<footer class="footer-section"><div class="footer-grid"><div><div class="brand-name">${d.brandName}</div><p style="line-height:1.6;margin-bottom:24px">${d.brandDescription}</p><div style="display:flex;gap:12px">${d.socialLinks.map(s => `<a href="${s.url}" style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center">${s.platform}</a>`).join('')}</div></div>${d.columns.map(col => `<div><h4 style="color:#fff;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px">${col.title}</h4><ul style="list-style:none;display:flex;flex-direction:column;gap:12px">${col.links.map(l => `<li><a href="${l.url}">${l.label}</a></li>`).join('')}</ul></div>`).join('')}</div><div class="copyright">${d.copyright}</div></footer>`;
      }
      default:
        return '';
    }
  }).join('\n');
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
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
                    : 'text-gray-400 hover:text-gray-200'
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
