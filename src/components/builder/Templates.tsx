'use client';

import { useState, useMemo, useCallback } from 'react';
import { TEMPLATE_META } from '@/lib/builder-types';
import type { PageTemplate, PageData } from '@/lib/builder-types';
import { useBuilderStore } from '@/lib/builder-store';
import { createDefaultSections, getDefaultTheme } from '@/lib/builder-templates';
import { generateProfessionalHTML } from '@/lib/html-export';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Rocket,
  Briefcase,
  UtensilsCrossed,
  Cloud,
  Building2,
  ShoppingCart,
  PenLine,
  Plus,
  Search,
  Sparkles,
  LayoutGrid,
  Layers,
  X,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket, Briefcase, UtensilsCrossed, Cloud, Building2, ShoppingCart, PenLine,
};

const CATEGORIES = [
  { key: 'all', label: 'Todas' },
  { key: 'negocio', label: 'Negocio' },
  { key: 'creativo', label: 'Creativo' },
  { key: 'venta', label: 'Ventas' },
  { key: 'contenido', label: 'Contenido' },
] as const;

const TEMPLATE_CATEGORIES: Record<PageTemplate, string[]> = {
  landing: ['negocio'],
  portfolio: ['creativo'],
  restaurant: ['negocio', 'creativo'],
  saas: ['negocio'],
  agency: ['negocio', 'creativo'],
  ecommerce: ['venta'],
  blog: ['contenido'],
};

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTHS: Record<PreviewDevice, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

// ═══════════════════════════════════════════════════════════════
// Template Preview Card
// ═══════════════════════════════════════════════════════════════

function TemplateCard({
  templateKey,
  meta,
  onSelect,
  onPreview,
}: {
  templateKey: PageTemplate;
  meta: typeof TEMPLATE_META[PageTemplate];
  onSelect: () => void;
  onPreview: () => void;
}) {
  const Icon = ICON_MAP[meta.icon];
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group overflow-hidden bg-white border border-border/60 hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Image Area */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {!imageError ? (
          <>
            <img
              src={meta.preview}
              alt={`Preview de ${meta.label}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Hover overlay with actions */}
            <div
              className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <Button
                size="sm"
                className="bg-white/95 text-foreground hover:bg-white font-semibold shadow-lg gap-1.5"
                onClick={(e) => { e.stopPropagation(); onPreview(); }}
              >
                <Monitor className="h-3.5 w-3.5" />
                Vista Previa
              </Button>
              <Button
                size="sm"
                className="text-white font-semibold shadow-lg gap-1.5"
                style={{ backgroundColor: meta.color }}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Usar
              </Button>
            </div>

            {/* Top-right badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 font-medium shadow-sm">
                <Layers className="h-3 w-3 mr-1" />
                {meta.sections.length} secciones
              </Badge>
            </div>

            {/* Bottom-left template name */}
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: meta.color }}>
                  {Icon ? <Icon className="h-4.5 w-4.5 text-white" strokeWidth={1.5} /> : null}
                </div>
                <span className="text-white font-bold text-lg drop-shadow-lg">{meta.label}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${meta.color}15` }}>
            {Icon ? <Icon className="h-16 w-16" style={{ color: meta.color, opacity: 0.4 }} strokeWidth={1} /> : null}
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {meta.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal px-2 py-0.5"
              style={{ backgroundColor: `${meta.color}10`, color: meta.color, borderColor: `${meta.color}20` }}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            className="flex-1 font-medium"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Vista Previa
          </Button>
          <Button
            className="flex-1 text-white font-medium hover:shadow-md"
            style={{ backgroundColor: meta.color }}
            onClick={onSelect}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Usar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Template Preview Dialog
// ═══════════════════════════════════════════════════════════════

function TemplatePreviewDialog({
  templateKey,
  meta,
  open,
  onClose,
  onUse,
}: {
  templateKey: PageTemplate;
  meta: typeof TEMPLATE_META[PageTemplate];
  open: boolean;
  onClose: () => void;
  onUse: () => void;
}) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [htmlContent, setHtmlContent] = useState('');

  const generatePreview = useCallback(() => {
    const uid = () => Math.random().toString(36).slice(2, 10);
    const page: PageData = {
      id: uid(),
      name: meta.label,
      template: templateKey,
      sections: createDefaultSections(templateKey),
      theme: getDefaultTheme(templateKey),
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHtmlContent(generateProfessionalHTML(page));
  }, [templateKey, meta]);

  // Generate on open
  useState(() => { if (open) generatePreview(); });

  const handleOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  const handleUse = () => {
    onClose();
    onUse();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 flex flex-col gap-0 bg-[#1e1e2e] border-white/10">
        {/* Header bar */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-white/10 rounded-none">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-white text-base font-semibold m-0">
              {meta.label} — Vista Previa
            </DialogTitle>
            <Badge variant="secondary" className="text-xs bg-white/10 text-white/70 border-white/10">
              {meta.sections.length} secciones
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Device toggles */}
            <div className="flex items-center rounded-lg overflow-hidden border border-white/10">
              {([
                { mode: 'desktop' as PreviewDevice, icon: Monitor },
                { mode: 'tablet' as PreviewDevice, icon: Tablet },
                { mode: 'mobile' as PreviewDevice, icon: Smartphone },
              ]).map(({ mode, icon: DIcon }) => (
                <button
                  key={mode}
                  onClick={() => setDevice(mode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all ${
                    device === mode ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-500'
                  }`}
                >
                  <DIcon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <Button
              size="sm"
              className="font-semibold text-white shadow-md"
              style={{ backgroundColor: meta.color }}
              onClick={handleUse}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Usar esta Plantilla
            </Button>
          </div>
        </DialogHeader>

        {/* Preview iframe */}
        <div className="flex-1 overflow-auto flex justify-center p-4 bg-[#1e1e2e]">
          <div
            className="transition-all duration-300 ease-in-out bg-white"
            style={{
              width: DEVICE_WIDTHS[device],
              maxWidth: '100%',
              minHeight: '100%',
              borderRadius: device === 'desktop' ? '0' : '12px',
              boxShadow: device === 'desktop' ? 'none' : '0 25px 60px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                className="w-full border-0"
                style={{ height: 'calc(90vh - 80px)' }}
                title={`${meta.label} Preview`}
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">Cargando preview...</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════
// Templates Page
// ═══════════════════════════════════════════════════════════════

export function Templates() {
  const createNewPage = useBuilderStore((s) => s.createNewPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);

  const handleSelectTemplate = (label: string, templateKey: PageTemplate) => {
    const newPage = createNewPage(label, templateKey);
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    }).catch((err) => console.error('[Templates] Failed to save page:', err));
  };

  const handleCreateBlank = () => {
    const newPage = createNewPage('Página en Blanco', 'landing');
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    }).catch((err) => console.error('[Templates] Failed to save page:', err));
  };

  const filteredTemplates = useMemo(() => {
    return (Object.entries(TEMPLATE_META) as [PageTemplate, typeof TEMPLATE_META[PageTemplate]][]).filter(([key, meta]) => {
      // Category filter
      if (activeCategory !== 'all') {
        const cats = TEMPLATE_CATEGORIES[key] || [];
        if (!cats.includes(activeCategory)) return false;
      }
      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        meta.label.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  const previewMeta = previewTemplate ? TEMPLATE_META[previewTemplate] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Plantillas
                </h1>
                <p className="text-muted-foreground text-sm">
                  Elige una plantilla, previsualiza el resultado final y personaliza todo
                </p>
              </div>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-border/60"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(([key, meta]) => (
            <TemplateCard
              key={key}
              templateKey={key}
              meta={meta}
              onSelect={() => handleSelectTemplate(meta.label, key)}
              onPreview={() => setPreviewTemplate(key)}
            />
          ))}

          {/* Blank template card */}
          <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-2 border-dashed border-muted-foreground/30 cursor-pointer flex flex-col items-center justify-center min-h-[420px]">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-base">Crear en Blanco</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Comienza con una página vacía y añade secciones libremente
                </p>
              </div>
              <Button variant="outline" className="mt-2 font-medium" onClick={handleCreateBlank}>
                Empezar desde Cero
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1">No se encontraron plantillas</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Intenta buscar con otros términos o cambiar la categoría
          </p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/60">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">
              Cada plantilla genera una página web completa
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Las plantillas incluyen contenido demo real (textos, imágenes, datos) que puedes personalizar completamente.
              Al exportar a HTML, obtienes una página profesional con navegación, menú responsive, animaciones, SEO y más.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {previewTemplate && previewMeta && (
        <TemplatePreviewDialog
          templateKey={previewTemplate}
          meta={previewMeta}
          open={previewTemplate !== null}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => handleSelectTemplate(previewMeta.label, previewTemplate)}
        />
      )}
    </div>
  );
}
