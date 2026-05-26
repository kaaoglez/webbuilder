// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Validation Functions
// LEGO BLOCK: Standard validators for all builder pieces
// ═══════════════════════════════════════════════════════════════

import type { ValidationResult, ValidationError } from './builder-constants';
import { isValidHexColor, isValidUrl, SEO_LIMITS } from './builder-utils';

// ─────────────────────────────────────────────────────────────
// Base Validation Helpers
// ─────────────────────────────────────────────────────────────

function createResult(errors: ValidationError[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

function error(field: string, message: string, severity: ValidationError['severity'] = 'error'): ValidationError {
  return { field, message, severity };
}

// ─────────────────────────────────────────────────────────────
// Field Validators
// ─────────────────────────────────────────────────────────────

/** Validate email address */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate phone number (international format) */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{7,15}$/.test(cleaned);
}

/** Validate URL */
export function validateUrl(url: string): boolean {
  return isValidUrl(url);
}

/** Validate hex color */
export function validateHexColor(color: string): boolean {
  return isValidHexColor(color);
}

/** Validate required field */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];
  if (!value.trim()) {
    errors.push(error(fieldName, `"${fieldName}" es obligatorio`));
  }
  return createResult(errors);
}

/** Validate text length */
export function validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];
  if (value.length < min) {
    errors.push(error(fieldName, `"${fieldName}" debe tener al menos ${min} caracteres`));
  }
  if (value.length > max) {
    errors.push(error(fieldName, `"${fieldName}" no debe superar ${max} caracteres`, 'warning'));
  }
  return createResult(errors);
}

/** Validate slug format */
export function validateSlug(slug: string): ValidationResult {
  const errors: ValidationError[] = [];
  if (!slug) {
    errors.push(error('slug', 'El slug es obligatorio'));
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(error('slug', 'El slug solo puede contener letras minúsculas, números y guiones'));
  }
  if (slug.length > SEO_LIMITS.slug) {
    errors.push(error('slug', `El slug no debe superar ${SEO_LIMITS.slug} caracteres`, 'warning'));
  }
  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// SEO Validator
// ─────────────────────────────────────────────────────────────

export interface SEOInput {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export function validateSEO(data: SEOInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Title
  if (!data.title.trim()) {
    errors.push(error('title', 'El título SEO es obligatorio'));
  } else if (data.title.length > SEO_LIMITS.title) {
    errors.push(error('title', `El título no debe superar ${SEO_LIMITS.title} caracteres (${data.title.length}/${SEO_LIMITS.title})`, 'warning'));
  } else if (data.title.length < 10) {
    errors.push(error('title', 'El título debería tener al menos 10 caracteres', 'warning'));
  }

  // Description
  if (!data.description.trim()) {
    errors.push(error('description', 'La descripción SEO es obligatoria'));
  } else if (data.description.length > SEO_LIMITS.description) {
    errors.push(error('description', `La descripción no debe superar ${SEO_LIMITS.description} caracteres (${data.description.length}/${SEO_LIMITS.description})`, 'warning'));
  } else if (data.description.length < 30) {
    errors.push(error('description', 'La descripción debería tener al menos 30 caracteres', 'warning'));
  }

  // Keywords
  if (data.keywords.length === 0) {
    errors.push(error('keywords', 'Agrega al menos una palabra clave', 'info'));
  }
  if (data.keywords.length > 20) {
    errors.push(error('keywords', 'No se recomiendan más de 20 palabras clave', 'warning'));
  }

  // Canonical URL
  if (data.canonicalUrl && !isValidUrl(data.canonicalUrl)) {
    errors.push(error('canonicalUrl', 'La URL canónica no es válida'));
  }

  // OG Image
  if (data.ogImage && !isValidUrl(data.ogImage)) {
    errors.push(error('ogImage', 'La URL de la imagen OG no es válida'));
  }

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Section Validator
// ─────────────────────────────────────────────────────────────

export interface SectionValidationInput {
  type: string;
  data: Record<string, unknown>;
}

export function validateSection(input: SectionValidationInput): ValidationResult {
  const errors: ValidationError[] = [];

  // All sections must have a type
  if (!input.type) {
    errors.push(error('type', 'El tipo de sección es obligatorio'));
  }

  // Type-specific validations
  const d = input.data;

  switch (input.type) {
    case 'hero':
      if (!d.title || !(d.title as string).trim()) {
        errors.push(error('hero.title', 'El título del Hero es obligatorio', 'warning'));
      }
      break;

    case 'features':
      if (!Array.isArray(d.features) || (d.features as unknown[]).length === 0) {
        errors.push(error('features.data.features', 'Agrega al menos una característica', 'warning'));
      }
      break;

    case 'contact':
      if (d.email && !validateEmail(d.email as string)) {
        errors.push(error('contact.email', 'El email no es válido'));
      }
      if (d.phone && !validatePhone(d.phone as string)) {
        errors.push(error('contact.phone', 'El teléfono no es válido'));
      }
      break;

    case 'pricing':
      if (!Array.isArray(d.plans) || (d.plans as unknown[]).length === 0) {
        errors.push(error('pricing.plans', 'Agrega al menos un plan de precios', 'warning'));
      }
      break;

    case 'navbar':
      if (d.ctaLink && !isValidUrl(d.ctaLink as string) && !(d.ctaLink as string).startsWith('#')) {
        errors.push(error('navbar.ctaLink', 'El enlace del CTA no es válido'));
      }
      break;

    case 'video':
      if (d.url && !isValidUrl(d.url as string) && !d.url.includes('youtube.com') && !d.url.includes('vimeo.com')) {
        errors.push(error('video.url', 'La URL del video no es válida (YouTube o Vimeo)'));
      }
      break;

    case 'map_embed':
      if (d.url && !isValidUrl(d.url as string)) {
        errors.push(error('map_embed.url', 'La URL del mapa no es válida'));
      }
      break;

    case 'newsletter':
      if (d.email && !validateEmail(d.email as string)) {
        errors.push(error('newsletter.email', 'El email no es válido'));
      }
      break;

    case 'blog_list':
      if (d.columns && ![2, 3, 4].includes(d.columns as number)) {
        errors.push(error('blog_list.columns', 'Las columnas deben ser 2, 3 o 4'));
      }
      break;

    case 'countdown':
      if (!d.targetDate) {
        errors.push(error('countdown.targetDate', 'La fecha objetivo es obligatoria', 'warning'));
      }
      break;

    case 'services':
      if (!Array.isArray(d.items) || (d.items as unknown[]).length === 0) {
        errors.push(error('services.items', 'Agrega al menos un servicio', 'warning'));
      }
      break;
  }

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Form Field Validator
// ─────────────────────────────────────────────────────────────

export interface FormFieldValidation {
  type: string;
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
}

export function validateFormField(field: FormFieldValidation): ValidationResult {
  const errors: ValidationError[] = [];

  if (field.required && !field.value.trim()) {
    errors.push(error(`field_${field.label}`, `"${field.label}" es obligatorio`));
  }

  if (field.value && field.type === 'email' && !validateEmail(field.value)) {
    errors.push(error(`field_${field.label}`, `"${field.label}" no es un email válido`));
  }

  if (field.value && field.type === 'phone' && !validatePhone(field.value)) {
    errors.push(error(`field_${field.label}`, `"${field.label}" no es un teléfono válido`));
  }

  if (field.value && field.type === 'url' && !isValidUrl(field.value)) {
    errors.push(error(`field_${field.label}`, `"${field.label}" no es una URL válida`));
  }

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Navigation Validator
// ─────────────────────────────────────────────────────────────

export interface NavLinkValidation {
  label: string;
  url: string;
}

export function validateNavLink(link: NavLinkValidation): ValidationResult {
  const errors: ValidationError[] = [];

  if (!link.label.trim()) {
    errors.push(error('nav.label', 'El texto del enlace es obligatorio'));
  }
  if (!link.url.trim()) {
    errors.push(error('nav.url', 'La URL del enlace es obligatoria'));
  } else if (!link.url.startsWith('#') && !isValidUrl(link.url)) {
    errors.push(error('nav.url', 'La URL no es válida'));
  }

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Theme Validator
// ─────────────────────────────────────────────────────────────

export interface ThemeValidation {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
}

export function validateTheme(theme: ThemeValidation): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isValidHexColor(theme.primaryColor)) {
    errors.push(error('primaryColor', 'El color primario no es un color hexadecimal válido'));
  }
  if (!isValidHexColor(theme.secondaryColor)) {
    errors.push(error('secondaryColor', 'El color secundario no es un color hexadecimal válido'));
  }
  if (!isValidHexColor(theme.accentColor)) {
    errors.push(error('accentColor', 'El color de acento no es un color hexadecimal válido'));
  }
  if (!isValidHexColor(theme.backgroundColor)) {
    errors.push(error('backgroundColor', 'El color de fondo no es un color hexadecimal válido'));
  }
  if (!isValidHexColor(theme.textColor)) {
    errors.push(error('textColor', 'El color de texto no es un color hexadecimal válido'));
  }

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Page Validator (full page validation)
// ─────────────────────────────────────────────────────────────

export interface PageValidation {
  name: string;
  template: string;
  sections: { type: string; data: Record<string, unknown> }[];
  theme: ThemeValidation;
}

export function validatePage(page: PageValidation): ValidationResult {
  const errors: ValidationError[] = [];

  if (!page.name.trim()) {
    errors.push(error('name', 'El nombre de la página es obligatorio'));
  }

  if (!page.template) {
    errors.push(error('template', 'Selecciona una plantilla'));
  }

  if (!Array.isArray(page.sections) || page.sections.length === 0) {
    errors.push(error('sections', 'La página debe tener al menos una sección', 'warning'));
  }

  // Validate each section
  for (let i = 0; i < page.sections.length; i++) {
    const sectionResult = validateSection({
      type: page.sections[i].type,
      data: page.sections[i].data,
    });
    for (const err of sectionResult.errors) {
      errors.push({
        ...err,
        field: `sections[${i}].${err.field}`,
      });
    }
  }

  // Validate theme
  const themeResult = validateTheme(page.theme);
  errors.push(...themeResult.errors);

  return createResult(errors);
}

// ─────────────────────────────────────────────────────────────
// Blog Post Validator
// ─────────────────────────────────────────────────────────────

export interface BlogPostValidation {
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  status: string;
}

export function validateBlogPost(post: BlogPostValidation): ValidationResult {
  const errors: ValidationError[] = [];

  if (!post.title.trim()) {
    errors.push(error('title', 'El título es obligatorio'));
  }

  const slugResult = validateSlug(post.slug);
  errors.push(...slugResult.errors);

  if (!post.content.trim()) {
    errors.push(error('content', 'El contenido es obligatorio'));
  } else if (post.content.trim().length < 50) {
    errors.push(error('content', 'El contenido debería tener al menos 50 caracteres', 'warning'));
  }

  if (post.author && !post.author.trim()) {
    errors.push(error('author', 'El autor no puede estar vacío'));
  }

  return createResult(errors);
}
