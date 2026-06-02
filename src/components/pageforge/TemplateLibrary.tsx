'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  ArrowRight,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  Check,
  ChevronDown,
  Sparkles,
  BookOpen,
  X,
} from 'lucide-react';
import { useThemeEditorStore } from '@/lib/theme-editor-store';
import templates, {
  TEMPLATE_CATEGORIES,
  type TemplateMeta,
  type TemplateCategory,
} from '@/lib/templates';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type NavItem = 'dashboard' | 'create-theme' | 'create-plugin' | 'my-projects' | 'templates' | 'medios' | 'settings';

interface TemplateLibraryProps {
  onNavigate: (item: NavItem) => void;
}

// ─────────────────────────────────────────────────────────────
// Section type labels
// ─────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  hero: 'Encabezado',
  about: 'Sobre Nosotros',
  services: 'Servicios',
  features: 'Características',
  testimonials: 'Testimonios',
  pricing: 'Precios',
  cta: 'Llamada a la Acción',
  contact: 'Contacto',
  gallery: 'Galería',
  faq: 'Preguntas Frecuentes',
  stats: 'Estadísticas',
  team: 'Equipo',
  blog_posts: 'Blog',
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function TemplateLibrary({ onNavigate }: TemplateLibraryProps) {
  const { replaceConfig } = useThemeEditorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: templates.length };
    templates.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Apply template to theme editor
  const handleUseTemplate = (template: TemplateMeta) => {
    replaceConfig({
      name: template.themeName,
      slug: template.themeSlug,
      description: template.themeDescription,
      siteTitle: template.themeName,
      logoUrl: '',
      tagline: template.themeDescription,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      accentColor: template.accentColor,
      backgroundColor: template.backgroundColor,
      textColor: template.textColor,
      headingFont: template.headingFont,
      bodyFont: template.bodyFont,
      borderRadius: template.borderRadius,
      sections: template.sections,
      navItems: template.navItems,
      footerColumns: template.footerColumns,
      copyrightText: template.copyrightText,
      socialLinks: template.socialLinks,
    });
    setPreviewTemplate(null);
    toast.success(`Template "${template.name}" aplicado al editor de temas`, {
      description: 'Ahora puedes personalizar y exportar tu theme',
    });
    onNavigate('create-theme');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ─── Header ─── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Biblioteca de Plantillas
            </h1>
            <p className="text-sm text-muted-foreground">
              {templates.length} plantillas preconstruidas — Elige uno y personalízalo en el editor
            </p>
          </div>
        </div>
      </div>

      {/* ─── How It Works Banner ─── */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
        <CardContent className="p-4 relative">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
                <Sparkles className="h-4 w-4 inline mr-1.5" />
                ¿Cómo funciona?
              </h3>
              <p className="text-emerald-700/80 dark:text-emerald-400/80 text-xs mt-1 leading-relaxed">
                1. Elige un template → 2. Haz clic en &quot;Usar Template&quot; → 3. Se carga todo en el Editor de Temas → 4. Personaliza lo que quieras → 5. Genera tu ZIP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Filters ─── */}
      <Card className="border-gray-400 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar templates por nombre, categoría o descripción..."
                className="pl-9"
              />
            </div>
            {/* Category filter */}
            <Select
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v as TemplateCategory | 'all')}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    Todas las categorías
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                      {categoryCounts.all}
                    </Badge>
                  </span>
                </SelectItem>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      {cat.emoji} {cat.label}
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                        {categoryCounts[cat.id] || 0}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ─── Results Count ─── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} encontrado{filteredTemplates.length !== 1 ? 's' : ''}
        </p>
        {selectedCategory !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="text-xs h-7"
          >
            Limpiar filtro
          </Button>
        )}
      </div>

      {/* ─── Template Grid ─── */}
      {filteredTemplates.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <Search className="h-10 w-10 text-gray-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-500 mb-1">No se encontraron templates</h3>
            <p className="text-sm text-gray-500">Intenta con otra búsqueda o categoría</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onPreview={() => setPreviewTemplate(template)}
              onUse={() => handleUseTemplate(template)}
            />
          ))}
        </div>
      )}

      {/* ─── Template Preview Modal ─── */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => handleUseTemplate(previewTemplate)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Template Card
// ─────────────────────────────────────────────────────────────

function getHeroImage(template: TemplateMeta): string | null {
  const heroSection = template.sections.find((s) => s.type === 'hero');
  return (heroSection?.data?.backgroundImage as string) || null;
}

function TemplateCard({
  template,
  index,
  onPreview,
  onUse,
}: {
  template: TemplateMeta;
  index: number;
  onPreview: () => void;
  onUse: () => void;
}) {
  const categoryMeta = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);
  const sectionTypes = template.sections.map((s) => s.type);
  const heroImage = getHeroImage(template);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="border-gray-400 bg-white overflow-hidden hover:shadow-lg hover:border-emerald-400 transition-all duration-300 group h-full flex flex-col">
        {/* Hero Image Preview */}
        <div
          className="relative h-44 overflow-hidden bg-gray-200 cursor-pointer"
          onClick={onPreview}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={`${template.name} - Vista previa`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
          )}
          {/* Gradient overlay with template name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Category badge floating */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge className="bg-white/90 text-gray-700 text-[10px] font-medium border-0 backdrop-blur-sm">
              {categoryMeta?.emoji} {categoryMeta?.label}
            </Badge>
            {template.badge && (
              <Badge className="bg-emerald-500 text-white text-[10px] font-semibold border-0">
                {template.badge}
              </Badge>
            )}
          </div>
          {/* Template name at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md">
              {template.name}
            </h3>
            <p className="text-white/80 text-[11px] mt-0.5 line-clamp-1">
              {template.description}
            </p>
          </div>
          {/* Hover overlay with eye icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3 shadow-lg">
                <Eye className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview Bar */}
        <div className="h-2 flex" style={{ width: '100%' }}>
          <div className="flex-1" style={{ backgroundColor: template.primaryColor }} />
          <div className="flex-1" style={{ backgroundColor: template.secondaryColor }} />
          <div className="flex-1" style={{ backgroundColor: template.accentColor }} />
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Design Tokens */}
          <div className="space-y-2.5 mb-3">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <div className="flex items-center gap-1.5">
                {[template.primaryColor, template.secondaryColor, template.accentColor, template.backgroundColor].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ),
                )}
              </div>
            </div>

            {/* Fonts */}
            <div className="flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span className="text-[11px] text-gray-500 truncate">
                {template.headingFont} / {template.bodyFont}
              </span>
            </div>

            {/* Sections */}
            <div className="flex items-start gap-2">
              <Layers className="h-3.5 w-3.5 text-gray-500 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {sectionTypes.slice(0, 6).map((type, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 border-0"
                  >
                    {SECTION_LABELS[type] || type}
                  </Badge>
                ))}
                {sectionTypes.length > 6 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 border-0">
                    +{sectionTypes.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="flex-1 h-8 text-xs gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              Vista Previa
            </Button>
            <Button
              size="sm"
              onClick={onUse}
              className="flex-1 h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-3.5 w-3.5" />
              Usar Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Template Preview Modal
// ─────────────────────────────────────────────────────────────

function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: TemplateMeta;
  onClose: () => void;
  onUse: () => void;
}) {
  const categoryMeta = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);
  const heroImage = getHeroImage(template);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image Banner */}
          {heroImage && (
            <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
              <img
                src={heroImage}
                alt={`${template.name} - Vista previa`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Template info overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge className="bg-white/90 text-gray-700 text-[10px] font-medium border-0 backdrop-blur-sm">
                    {categoryMeta?.emoji} {categoryMeta?.label}
                  </Badge>
                  {template.badge && (
                    <Badge className="bg-emerald-500 text-white text-[10px] font-semibold border-0">
                      {template.badge}
                    </Badge>
                  )}
                  <Badge className="bg-white/20 text-white text-[10px] font-medium border-0 backdrop-blur-sm">
                    {template.sections.length} secciones
                  </Badge>
                </div>
                <h2 className="text-white font-bold text-xl">{template.name}</h2>
                <p className="text-white/80 text-sm mt-1">{template.description}</p>
              </div>
              {/* Close button on image */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-3 right-3 h-9 w-9 bg-black/30 hover:bg-black/50 text-white border-0 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Modal Header (only shown when no hero image) */}
          {!heroImage && (
            <div className="flex-shrink-0 p-5 border-b border-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{template.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {categoryMeta?.emoji} {categoryMeta?.label}
                      </span>
                      {template.badge && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 font-semibold">
                          {template.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-600">
                  ✕
                </Button>
              </div>
            </div>
          )}

          {/* Modal Body — Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Description (only when no hero image) */}
            {!heroImage && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            )}

            {/* Color Palette */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <Palette className="h-3.5 w-3.5 inline mr-1.5" />
                Paleta de Colores
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <ColorSwatch label="Primario" color={template.primaryColor} />
                <ColorSwatch label="Secundario" color={template.secondaryColor} />
                <ColorSwatch label="Acento" color={template.accentColor} />
                <ColorSwatch label="Fondo" color={template.backgroundColor} />
                <ColorSwatch label="Texto" color={template.textColor} />
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <Type className="h-3.5 w-3.5 inline mr-1.5" />
                Tipografía
              </h4>
              <div className="flex flex-wrap gap-3">
                <Card className="px-3 py-2 border-gray-400">
                  <p className="text-[10px] text-gray-500 uppercase">Títulos</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: template.headingFont }}>
                    {template.headingFont}
                  </p>
                </Card>
                <Card className="px-3 py-2 border-gray-400">
                  <p className="text-[10px] text-gray-500 uppercase">Cuerpo</p>
                  <p className="text-sm" style={{ fontFamily: template.bodyFont }}>
                    {template.bodyFont}
                  </p>
                </Card>
                <Card className="px-3 py-2 border-gray-400">
                  <p className="text-[10px] text-gray-500 uppercase">Border Radius</p>
                  <p className="text-sm font-medium">{template.borderRadius}px</p>
                </Card>
              </div>
            </div>

            {/* Sections */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <LayoutGrid className="h-3.5 w-3.5 inline mr-1.5" />
                Secciones ({template.sections.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {template.sections.map((section, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 border border-gray-400"
                  >
                    <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: template.primaryColor + '15', color: template.primaryColor }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {section.title || section.type}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {SECTION_LABELS[section.type] || section.type}
                        {section.subtitle ? ` — ${section.subtitle}` : ''}
                      </p>
                    </div>
                    {section.enabled ? (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-600 border-0 shrink-0">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] bg-gray-200 text-gray-500 border-0 shrink-0">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Menú de Navegación
              </h4>
              <div className="flex flex-wrap gap-2">
                {template.navItems.map((item, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-gray-400">
                    {item.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer Columns */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Footer ({template.footerColumns.length} columnas)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {template.footerColumns.map((col, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-gray-200 border border-gray-400">
                    <p className="text-xs font-semibold text-gray-600 mb-1">{col.title}</p>
                    <div className="space-y-0.5">
                      {col.links.map((link, j) => (
                        <p key={j} className="text-[11px] text-gray-500">{link.label}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex-shrink-0 p-5 border-t border-gray-400 bg-gray-200">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
              <Button
                onClick={onUse}
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Check className="h-4 w-4" />
                Usar este Template
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Color Swatch
// ─────────────────────────────────────────────────────────────

function ColorSwatch({ label, color }: { label: string; color: string }) {
  const isLight = isLightColor(color);
  return (
    <div className="text-center">
      <div
        className="w-full h-12 rounded-lg border border-gray-400 flex items-end justify-center pb-1"
        style={{ backgroundColor: color }}
      >
        <span
          className="text-[9px] font-mono font-medium"
          style={{ color: isLight ? '#374151' : '#FFFFFF' }}
        >
          {color}
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
