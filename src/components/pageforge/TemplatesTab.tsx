'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus,
  Layers,
  ChevronLeft,
  Trash2,
  Settings,
  Layout,
  FileText,
  AlertTriangle,
  Search,
  File,
  LayoutList,
  GripVertical,
  Eye,
  EyeOff,
  Star,
  User,
  Briefcase,
  Zap,
  MessageSquareQuote,
  CreditCard,
  Megaphone,
  Mail,
  ImageIcon,
  HelpCircle,
  BarChart3,
  Users,
  PanelRight,
  PanelTop,
} from 'lucide-react';

import { useThemeEditorStore, LAYOUT_OPTIONS, SIDEBAR_WIDGET_TYPES } from '@/lib/theme-editor-store';
import type { ThemeTemplate, TemplateLayout } from '@/lib/theme-editor-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─────────────────────────────────────────────────────────────
// Section type constants (local to this component)
// ─────────────────────────────────────────────────────────────

const SECTION_TYPES = [
  'hero',
  'about',
  'services',
  'features',
  'testimonials',
  'pricing',
  'cta',
  'contact',
  'gallery',
  'faq',
  'stats',
  'team',
  'blog_posts',
] as const;

const SECTION_TYPE_ICON: Record<string, React.ReactNode> = {
  hero: <Star className="h-4 w-4" />,
  about: <User className="h-4 w-4" />,
  services: <Briefcase className="h-4 w-4" />,
  features: <Zap className="h-4 w-4" />,
  testimonials: <MessageSquareQuote className="h-4 w-4" />,
  pricing: <CreditCard className="h-4 w-4" />,
  cta: <Megaphone className="h-4 w-4" />,
  contact: <Mail className="h-4 w-4" />,
  gallery: <ImageIcon className="h-4 w-4" />,
  faq: <HelpCircle className="h-4 w-4" />,
  stats: <BarChart3 className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
  blog_posts: <FileText className="h-4 w-4" />,
};

const SECTION_TYPE_LABEL: Record<string, string> = {
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
// Icon map for dynamic template icon rendering
// ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  File,
  AlertTriangle,
  Search,
  LayoutList,
  Layers,
  PanelRight,
  PanelTop,
};

// ─────────────────────────────────────────────────────────────
// Option key to human-readable label mapping
// ─────────────────────────────────────────────────────────────

const OPTION_LABEL_MAP: Record<string, string> = {
  showFeaturedImage: 'Imagen destacada',
  showAuthorBox: 'Caja de autor',
  showRelatedPosts: 'Posts relacionados',
  showComments: 'Comentarios',
  showShareButtons: 'Botones de compartir',
  showPostNavigation: 'Navegación entre posts',
  showExcerpt: 'Extracto del post',
  showAuthor: 'Autor del post',
  showDate: 'Fecha de publicación',
  showReadMore: 'Botón "Leer más"',
  postsPerRow: 'Posts por fila',
  showHeroBanner: 'Banner del Encabezado',
  showTitle: 'Título de la página',
  showSidebar: 'Mostrar sidebar',
  showSearchBox: 'Caja de búsqueda',
  showRecentPosts: 'Posts recientes',
  showBackToHome: 'Botón "Volver al inicio"',
  showHighlight: 'Resaltar resultados',
  showSearchWidget: 'Widget de Búsqueda',
  showRecentPostsWidget: 'Widget de Artículos Recientes',
  showCategoriesWidget: 'Widget de Categorías',
  showTagsWidget: 'Widget de Etiquetas',
  showArchivesWidget: 'Widget de Archivos',
  showPagesWidget: 'Widget de Páginas',
  showCustomTextWidget: 'Widget de Texto Personalizado',
  showCalendarWidget: 'Widget de Calendario',
  showLogo: 'Mostrar Logo',
  showSiteTitle: 'Mostrar Título del Sitio',
  showTagline: 'Mostrar Eslogan',
  showStickyHeader: 'Header Sticky al Scroll',
  showMobileMenu: 'Menú Móvil (Hamburger)',
  showSearchIcon: 'Icono de Búsqueda',
};

// ─────────────────────────────────────────────────────────────
// Layout label lookup
// ─────────────────────────────────────────────────────────────

function getLayoutLabel(layout: TemplateLayout): string {
  return LAYOUT_OPTIONS.find((o) => o.value === layout)?.label ?? layout;
}

// ─────────────────────────────────────────────────────────────
// Helper: get layout icon
// ─────────────────────────────────────────────────────────────

function getLayoutIcon(layout: TemplateLayout): React.ReactNode {
  switch (layout) {
    case 'full-width':
      return <Layout className="h-3.5 w-3.5" />;
    case 'with-sidebar-right':
      return <LayoutList className="h-3.5 w-3.5" />;
    case 'with-sidebar-left':
      return <LayoutList className="h-3.5 w-3.5" />;
    default:
      return <Layout className="h-3.5 w-3.5" />;
  }
}

// ─────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────

const fadeSlideIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// ─────────────────────────────────────────────────────────────
// TemplateCard — individual template card in the grid
// ─────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onToggle,
  onConfigure,
  onDelete,
}: {
  template: ThemeTemplate;
  onToggle: () => void;
  onConfigure: () => void;
  onDelete?: () => void;
}) {
  const IconComponent = ICON_MAP[template.icon] || Layers;
  const isCustom = template.type === 'custom';

  return (
    <motion.div {...fadeSlideIn} layout>
      <Card
        className={`
          relative border bg-white transition-all duration-200
          hover:shadow-md hover:border-emerald-300
          ${isCustom ? 'border-l-4 border-l-emerald-400 border-gray-400' : 'border-gray-400'}
          ${!template.enabled ? 'opacity-60' : ''}
        `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-lg
                  ${isCustom ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-600'}
                `}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold truncate">
                    {template.name}
                  </CardTitle>
                  {isCustom && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-emerald-300 text-emerald-600 bg-emerald-50 shrink-0"
                    >
                      Personalizada
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <Switch
              checked={template.enabled}
              onCheckedChange={onToggle}
              className="shrink-0"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Layout badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[11px] gap-1">
              {getLayoutIcon(template.layout)}
              {getLayoutLabel(template.layout)}
            </Badge>
            {/* Section count for custom templates */}
            {isCustom && template.sections && template.sections.length > 0 && (
              <Badge variant="outline" className="text-[11px]">
                {template.sections.length} sección{template.sections.length !== 1 ? 'es' : ''}
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {template.enabled && (
              <Button
                size="sm"
                variant="outline"
                onClick={onConfigure}
                className="flex-1 h-8 text-xs gap-1.5 border-gray-400 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Settings className="h-3.5 w-3.5" />
                Configurar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CreateTemplateForm — inline form for creating custom templates
// ─────────────────────────────────────────────────────────────

function CreateTemplateForm({
  onDone,
}: {
  onDone: () => void;
}) {
  const { addPageTemplate } = useThemeEditorStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('El nombre es obligatorio');
      return;
    }
    addPageTemplate(trimmedName, description.trim() || undefined);
    toast.success(`Plantilla "${trimmedName}" creada`);
    setName('');
    setDescription('');
    onDone();
  }, [name, description, addPageTemplate, onDone]);

  const handleCancel = useCallback(() => {
    setName('');
    setDescription('');
    onDone();
  }, [onDone]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleCreate();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleCreate, handleCancel],
  );

  return (
    <motion.div {...fadeSlideIn}>
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-emerald-800">
            Nueva Plantilla Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Nombre *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Portfolio, Contacto, Servicios..."
              autoFocus
              className="border-gray-400 focus:border-emerald-400"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Descripción</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descripción opcional de la plantilla..."
              rows={2}
              className="border-gray-400 focus:border-emerald-400 resize-none"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!name.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              Crear
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 h-8"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// TemplateDetailView — configuration view for a selected template
// ─────────────────────────────────────────────────────────────

function TemplateDetailView({ template }: { template: ThemeTemplate }) {
  const {
    setActiveTemplateId,
    updatePageTemplate,
    toggleTemplateSection,
    removeTemplateSection,
    addTemplateSection,
    updateTemplateWidget,
  } = useThemeEditorStore();

  const isCustom = template.type === 'custom';
  const hasSidebar =
    template.layout === 'with-sidebar-left' || template.layout === 'with-sidebar-right';

  return (
    <div className="space-y-6">
      {/* ─── Back Button ─── */}
      <button
        onClick={() => setActiveTemplateId(null)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Volver a plantillas
      </button>

      {/* ─── Template Header ─── */}
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {(() => {
              const IconComp = ICON_MAP[template.icon] || Layers;
              return (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <IconComp className="h-5 w-5" />
                </div>
              );
            })()}
            <div className="flex-1 min-w-0">
              {isCustom ? (
                <Input
                  value={template.name}
                  onChange={(e) =>
                    updatePageTemplate(template.id, {
                      name: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, ''),
                    })
                  }
                  className="text-base font-semibold border-0 p-0 h-auto shadow-none focus-visible:ring-0 focus-visible:border-0"
                />
              ) : (
                <CardTitle className="text-lg">{template.name}</CardTitle>
              )}
              {isCustom ? (
                <Textarea
                  value={template.description}
                  onChange={(e) =>
                    updatePageTemplate(template.id, { description: e.target.value })
                  }
                  placeholder="Descripción de la plantilla..."
                  rows={1}
                  className="mt-1 text-xs text-gray-500 border-0 p-0 h-auto shadow-none focus-visible:ring-0 focus-visible:border-0 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ─── Layout Selector ─── */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Diseño de Layout</Label>
            <div className="flex flex-wrap gap-2">
              {LAYOUT_OPTIONS.map((opt) => {
                const isSelected = template.layout === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => updatePageTemplate(template.id, { layout: opt.value })}
                    className={`
                      flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all duration-150
                      ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-400 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }
                    `}
                  >
                    {getLayoutIcon(opt.value as TemplateLayout)}
                    <div className="text-left">
                      <div className="font-medium text-xs">{opt.label}</div>
                      <div className="text-[10px] text-gray-500">{opt.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Predesigned: Options Panel ─── */}
      {!isCustom && Object.keys(template.options).length > 0 && (
        <Card className="border-gray-400 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              Opciones de la plantilla
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(template.options).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <Label className="text-sm text-gray-700 cursor-pointer">
                    {OPTION_LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </Label>
                  <Switch
                    checked={!!value}
                    onCheckedChange={(checked) => {
                      const newOptions = { ...template.options, [key]: checked };
                      updatePageTemplate(template.id, { options: newOptions });
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Predesigned: Sidebar Widget Panel ─── */}
      {!isCustom && hasSidebar && template.sidebarWidgets.length > 0 && (
        <Card className="border-gray-400 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-gray-500" />
              Widgets del Sidebar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.sidebarWidgets.map((widget) => {
                const widgetInfo = SIDEBAR_WIDGET_TYPES.find((w) => w.value === widget.type);
                return (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{widgetInfo?.icon || '📦'}</span>
                      <Label className="text-sm text-gray-700 cursor-pointer">
                        {widget.title || widgetInfo?.label || widget.type}
                      </Label>
                    </div>
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={(checked) =>
                        updateTemplateWidget(template.id, widget.id, { enabled: checked })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Custom: Section Builder ─── */}
      {isCustom && (
        <Card className="border-gray-400 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-500" />
                Secciones
                {template.sections.length > 0 && (
                  <Badge variant="secondary" className="text-[11px] ml-1">
                    {template.sections.length}
                  </Badge>
                )}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    Agregar Sección
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {SECTION_TYPES.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => addTemplateSection(template.id, type)}
                      className="gap-2.5 cursor-pointer"
                    >
                      <span className="text-base w-5 text-center">
                        {SECTION_TYPE_ICON[type]}
                      </span>
                      <span className="text-sm">{SECTION_TYPE_LABEL[type]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {template.sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay secciones aún</p>
                <p className="text-xs mt-1">
                  Usa el botón &ldquo;Agregar Sección&rdquo; para comenzar
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                <div className="space-y-2">
                  {template.sections.map((section, index) => (
                    <motion.div
                      key={`${section.type}-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      <div
                        className={`
                          flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors
                          ${section.enabled
                            ? 'border-gray-400 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
                            : 'border-gray-400 bg-gray-200/50 opacity-60'
                          }
                        `}
                      >
                        {/* Grip handle */}
                        <GripVertical className="h-4 w-4 text-gray-500 shrink-0" />

                        {/* Section icon */}
                        <span className="text-gray-500 shrink-0">
                          {SECTION_TYPE_ICON[section.type] || <File className="h-4 w-4" />}
                        </span>

                        {/* Section info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate">
                            {section.title || SECTION_TYPE_LABEL[section.type] || section.type}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {SECTION_TYPE_LABEL[section.type] || section.type}
                          </div>
                        </div>

                        {/* Index indicator */}
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">
                          #{index + 1}
                        </span>

                        {/* Toggle */}
                        <button
                          onClick={() => toggleTemplateSection(template.id, index)}
                          className="shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
                          title={section.enabled ? 'Desactivar sección' : 'Activar sección'}
                        >
                          {section.enabled ? (
                            <Eye className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => removeTemplateSection(template.id, index)}
                          className="shrink-0 p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                          title="Eliminar sección"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Export Info ─── */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-200 rounded-lg px-4 py-3 border border-gray-400">
        <FileText className="h-3.5 w-3.5 shrink-0" />
        <span>
          Esta plantilla se exportará como{' '}
          <code className="bg-gray-200 px-1.5 py-0.5 rounded text-[11px] font-mono text-gray-600">
            {template.slug}.php
          </code>
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component: TemplatesTab
// ─────────────────────────────────────────────────────────────

export function TemplatesTab() {
  const {
    config,
    addPageTemplate,
    removePageTemplate,
    togglePageTemplate,
    setActiveTemplateId,
  } = useThemeEditorStore();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const templates = useMemo(
    () => config.pageTemplates || [],
    [config.pageTemplates],
  );

  const predesigned = useMemo(
    () => templates.filter((t) => t.type === 'predesigned'),
    [templates],
  );

  const custom = useMemo(
    () => templates.filter((t) => t.type === 'custom'),
    [templates],
  );

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === config.activeTemplateId) ?? null,
    [templates, config.activeTemplateId],
  );

  // ─── Detail view ───
  if (activeTemplate) {
    return (
      <div className="space-y-6 p-1">
        <TemplateDetailView template={activeTemplate} />
      </div>
    );
  }

  // ─── List view ───
  return (
    <div className="space-y-6 p-1">
      {/* ─── Info Banner ─── */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-teal-50 border border-emerald-200/60 p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-emerald-900">
              Plantillas de Páginas
            </h3>
            <p className="text-sm text-emerald-700/70 mt-1 leading-relaxed">
              Configura las plantillas prediseñadas de WordPress o crea plantillas personalizadas.
              Cada plantilla se exporta como archivo PHP independiente.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Create Custom Template Button / Inline Form ─── */}
      <AnimatePresence mode="wait">
        {showCreateForm ? (
          <CreateTemplateForm onDone={() => setShowCreateForm(false)} />
        ) : (
          <motion.div {...fadeSlideIn} key="create-button">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Crear Plantilla Personalizada
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Predesigned Templates Grid ─── */}
      {predesigned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Prediseñadas
            </Badge>
            <span className="text-xs text-gray-500">
              {predesigned.filter((t) => t.enabled).length}/{predesigned.length} activas
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {predesigned.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onToggle={() => togglePageTemplate(template.id)}
                  onConfigure={() => setActiveTemplateId(template.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ─── Custom Templates Grid ─── */}
      {custom.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600 bg-emerald-50">
              Personalizadas
            </Badge>
            <span className="text-xs text-gray-500">
              {custom.length} plantilla{custom.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {custom.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onToggle={() => togglePageTemplate(template.id)}
                  onConfigure={() => setActiveTemplateId(template.id)}
                  onDelete={() => {
                    removePageTemplate(template.id);
                    toast.success(`Plantilla "${template.name}" eliminada`);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ─── Empty State ─── */}
      {templates.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Layers className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-gray-500">No hay plantillas disponibles</p>
          <p className="text-xs mt-1">
            Crea tu primera plantilla personalizada para comenzar
          </p>
        </div>
      )}
    </div>
  );
}

export default TemplatesTab;
