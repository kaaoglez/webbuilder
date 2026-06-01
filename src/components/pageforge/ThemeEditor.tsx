'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProjectsStore } from '@/lib/projects-store';
import { useSettingsStore } from '@/lib/settings-store';
import {
  Download,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
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
  FileText,
  Menu,
  Link2,
  GripVertical,
  ListChecks,
  Pencil,
  Ruler,
  HardDrive,
  Trash2,
  Layers,
  ExternalLink,
} from 'lucide-react';

import { useThemeEditorStore, FONT_OPTIONS } from '@/lib/theme-editor-store';
import { SortableCardsProvider, SortableCardWrapper, DragHandle } from '@/components/pageforge/SortableCards';
import type { ThemeSection } from '@/lib/wp-theme-generator';
import { useMediaPicker, MediaLibraryBrowser } from '@/components/pageforge/MediaLibrary';
import { useMediaLibraryStore, formatFileSize } from '@/lib/media-library-store';
import type { MediaItem } from '@/lib/media-library-store';
import { ImageEditor } from '@/components/pageforge/ImageEditor';
import { TemplatesTab } from '@/components/pageforge/TemplatesTab';
import ThemeLivePreview from '@/components/pageforge/ThemeLivePreview';
import { EmojiPicker } from '@/components/pageforge/EmojiPicker';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─────────────────────────────────────────────────────────────
// Section type icon & label maps
// ─────────────────────────────────────────────────────────────

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

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
];

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

// ─────────────────────────────────────────────────────────────
// Helper: slug generation
// ─────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}

function ImageUrlField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const { pickImage, MediaLibraryDialog } = useMediaPicker();

  const handlePick = async () => {
    const url = await pickImage();
    if (url) onChange(url);
  };

  return (
    <>
      <FormField label={label || 'URL de Imagen'}>
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePick}
            className="shrink-0 h-9 gap-1.5 border-gray-400 hover:border-emerald-400 hover:bg-emerald-50"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Biblioteca
          </Button>
        </div>
        {value && (
          <div className="mt-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-300">
            <img src={value} alt="Preview" className="h-16 w-auto max-w-full object-contain rounded cursor-pointer"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-xs text-gray-500 shrink-0">Vista previa</span>
          </div>
        )}
      </FormField>
      <MediaLibraryDialog />
    </>
  );
}

function RepeatableCard({
  title,
  onRemove,
  children,
}: {
  title?: string;
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
    <Card className="border border-gray-400 bg-white">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        {title && <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>}
        {!title && <div />}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-red-500"
            onClick={() => setConfirmOpen(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">{children}</CardContent>
    </Card>
    <AlertDialog open={confirmOpen} onOpenChange={(open) => { if (!open) setConfirmOpen(false); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este elemento?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará el elemento y toda su configuración.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onRemove(); setConfirmOpen(false); }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

// ─── Sortable Repeatable Card with Grip Handle ─────────────────

function SortableRepeatableCard({
  title,
  onRemove,
  children,
  sortIndex,
}: {
  title?: string;
  children: React.ReactNode;
  onRemove?: () => void;
  sortIndex: number;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortIndex });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border border-gray-400 bg-white ${isDragging ? 'shadow-lg ring-2 ring-emerald-300 opacity-90' : ''}`}>
        <CardHeader className="flex flex-row items-center gap-2 py-3 px-4">
          <button
            type="button"
            suppressHydrationWarning
            {...attributes}
            {...listeners}
            className="text-gray-500 hover:text-gray-600 cursor-grab active:cursor-grabbing shrink-0 p-0.5 touch-none"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {title && <CardTitle className="text-sm font-medium text-gray-600 flex-1">{title}</CardTitle>}
          {!title && <div className="flex-1" />}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-red-500 shrink-0"
              onClick={() => setConfirmOpen(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-3">{children}</CardContent>
      </Card>
      <AlertDialog open={confirmOpen} onOpenChange={(open) => { if (!open) setConfirmOpen(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este elemento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el elemento y toda su configuración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onRemove(); setConfirmOpen(false); }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Reusable sortable list wrapper (skips DnD context during SSR) ─

function SortableList({
  items,
  onReorder,
  children,
}: {
  items: number[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  children: React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onReorder(active.id as number, over.id as number);
  }, [onReorder]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1: INFO
// ─────────────────────────────────────────────────────────────

function InfoTab() {
  const { config, updateConfig, reorderCards } = useThemeEditorStore();
  const infoCardOrder = (config.cardOrders as Record<string, string[]>)?.info || ['branding', 'metadata'];

  const handleNameChange = useCallback(
    (name: string) => {
      updateConfig({ name, slug: toSlug(name), textDomain: toSlug(name) });
    },
    [updateConfig],
  );

  const getOrder = (id: string) => infoCardOrder.indexOf(id);

  return (
    <SortableCardsProvider
      items={infoCardOrder}
      onReorder={(from, to) => reorderCards('info', from, to)}
    >
    <div className="space-y-6 flex flex-col">
      <SortableCardWrapper id="branding" style={{ order: getOrder('branding') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex items-center gap-2 flex-1">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Identidad del Sitio
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">Estos datos se usan en el encabezado (header) de tu theme WordPress.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUrlField
            value={config.logoUrl || ''}
            onChange={(url) => updateConfig({ logoUrl: url })}
            label="URL del Logo"
          />
          <FormField label="Título del Sitio">
            <Input
              value={config.siteTitle || ''}
              onChange={(e) => updateConfig({ siteTitle: e.target.value })}
              placeholder="Mi Sitio Web"
            />
          </FormField>
          <FormField label="Eslogan / Tagline">
            <Input
              value={config.tagline || ''}
              onChange={(e) => updateConfig({ tagline: e.target.value })}
              placeholder="Un sitio web profesional"
            />
          </FormField>
        </CardContent>
      </Card>
      </SortableCardWrapper>

      <SortableCardWrapper id="metadata" style={{ order: getOrder('metadata') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex-1">Información del Theme</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Nombre del Theme">
            <Input
              value={config.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mi Theme WordPress"
            />
          </FormField>
          <FormField label="URL Amigable">
            <Input
              value={config.slug || ''}
              onChange={(e) => updateConfig({ slug: e.target.value })}
              placeholder="mi-theme-wordpress"
              className="bg-gray-200"
            />
          </FormField>
          <FormField label="Descripción">
            <Textarea
              value={config.description || ''}
              onChange={(e) => updateConfig({ description: e.target.value })}
              placeholder="Descripción de tu theme..."
              rows={3}
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Versión">
              <Input
                value={config.version || ''}
                onChange={(e) => updateConfig({ version: e.target.value })}
                placeholder="1.0.0"
              />
            </FormField>
            <FormField label="Autor">
              <Input
                value={config.author || ''}
                onChange={(e) => updateConfig({ author: e.target.value })}
                placeholder="Nombre del autor"
              />
            </FormField>
          </div>
          <FormField label="Sitio Web del Autor">
            <Input
              value={config.authorUri || ''}
              onChange={(e) => updateConfig({ authorUri: e.target.value })}
              placeholder="https://tu-sitio.com"
            />
          </FormField>
          <FormField label="Dominio de Traducción">
            <Input
              value={config.textDomain || ''}
              onChange={(e) => updateConfig({ textDomain: e.target.value })}
              placeholder="mi-theme"
              className="bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">(identificador para traducciones)</p>
          </FormField>
          <FormField label="Etiquetas (separadas por coma)">
            <Input
              value={config.tags || ''}
              onChange={(e) => updateConfig({ tags: e.target.value })}
              placeholder="one-column, custom-colors, two-columns"
            />
          </FormField>
        </CardContent>
      </Card>
      </SortableCardWrapper>
    </div>
    </SortableCardsProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 2: DESIGN
// ─────────────────────────────────────────────────────────────

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <FormField label={label}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-12 cursor-pointer rounded-md border border-gray-400 p-0.5"
          />
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-32 font-mono text-sm"
        />
      </div>
    </FormField>
  );
}

function DesignTab() {
  const { config, updateConfig, reorderCards } = useThemeEditorStore();
  const designCardOrder = (config.cardOrders as Record<string, string[]>)?.design || ['colors', 'typography', 'borders'];

  const getOrder = (id: string) => designCardOrder.indexOf(id);

  return (
    <SortableCardsProvider
      items={designCardOrder}
      onReorder={(from, to) => reorderCards('design', from, to)}
    >
    <div className="space-y-6 flex flex-col">
      <SortableCardWrapper id="colors" style={{ order: getOrder('colors') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex-1">Colores</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ColorPickerField label="Color Primario" value={config.primaryColor || '#2563EB'} onChange={(v) => updateConfig({ primaryColor: v })} />
            <ColorPickerField label="Color Secundario" value={config.secondaryColor || '#7C3AED'} onChange={(v) => updateConfig({ secondaryColor: v })} />
            <ColorPickerField label="Color de Acento" value={config.accentColor || '#F59E0B'} onChange={(v) => updateConfig({ accentColor: v })} />
            <ColorPickerField label="Color de Fondo" value={config.backgroundColor || '#FFFFFF'} onChange={(v) => updateConfig({ backgroundColor: v })} />
            <ColorPickerField label="Color de Texto" value={config.textColor || '#1F2937'} onChange={(v) => updateConfig({ textColor: v })} />
          </div>
        </CardContent>
      </Card>
      </SortableCardWrapper>

      <SortableCardWrapper id="typography" style={{ order: getOrder('typography') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex-1">Tipografía</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Fuente de Títulos">
              <Select value={config.headingFont || 'Inter'} onValueChange={(v) => updateConfig({ headingFont: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar fuente" /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Fuente del Cuerpo">
              <Select value={config.bodyFont || 'Inter'} onValueChange={(v) => updateConfig({ bodyFont: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar fuente" /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>
      </SortableCardWrapper>

      <SortableCardWrapper id="borders" style={{ order: getOrder('borders') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex-1">Bordes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FormField label={`Radio de Bordes: ${config.borderRadius || 8}px`}>
            <Slider value={[config.borderRadius || 8]} onValueChange={([v]) => updateConfig({ borderRadius: v })} min={0} max={20} step={1} className="w-full" />
          </FormField>
        </CardContent>
      </Card>
      </SortableCardWrapper>
    </div>
    </SortableCardsProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 3: SECTIONS — Section Config Panels
// ─────────────────────────────────────────────────────────────

function HeroConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection } = useThemeEditorStore();
  const d = section.data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Título principal del encabezado"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Subtítulo del encabezado"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Texto del Botón Principal">
          <Input
            value={(d.ctaText as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { ctaText: e.target.value })}
            placeholder="Comenzar Ahora"
          />
        </FormField>
        <FormField label="Enlace del Botón Principal">
          <Input
            value={(d.ctaLink as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { ctaLink: e.target.value })}
            placeholder="#contacto"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Texto del Botón Secundario">
          <Input
            value={(d.secondaryCtaText as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { secondaryCtaText: e.target.value })}
            placeholder="Saber Más"
          />
        </FormField>
        <FormField label="Enlace del Botón Secundario">
          <Input
            value={(d.secondaryCtaLink as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { secondaryCtaLink: e.target.value })}
            placeholder="#servicios"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ImageUrlField
          value={(d.backgroundImage as string) || ''}
          onChange={(url) => updateSectionData(sectionIndex, { backgroundImage: url })}
          label="Imagen de Fondo"
        />
        <FormField label={`Intensidad del fondo: ${Math.round((d.overlayOpacity as number ?? 0.5) * 100)}%`}>
          <Slider
            value={[d.overlayOpacity as number ?? 0.5]}
            onValueChange={([v]) => updateSectionData(sectionIndex, { overlayOpacity: v })}
            min={0}
            max={1}
            step={0.05}
          />
        </FormField>
      </div>
    </div>
  );
}

function AboutConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const stats = (d.stats as Array<{ value: string; label: string }>) || [];

  const updateStats = (newStats: Array<{ value: string; label: string }>) => {
    updateSectionData(sectionIndex, { stats: newStats });
  };

  const addStat = () => {
    updateStats([...stats, { value: '', label: '' }]);
  };

  const removeStat = (i: number) => {
    updateStats(stats.filter((_, idx) => idx !== i));
  };

  const updateStat = (i: number, field: 'value' | 'label', val: string) => {
    const updated = stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s));
    updateStats(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Sobre Nosotros"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Subtítulo"
          />
        </FormField>
      </div>
      <ImageUrlField
        value={(d.image as string) || ''}
        onChange={(url) => updateSectionData(sectionIndex, { image: url })}
        label="URL de Imagen"
      />

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Estadísticas</Label>
          <Button size="sm" variant="outline" onClick={addStat} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={stats.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'stats', from, to)}
        >
          {stats.map((stat, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Estadística ${i + 1}`} onRemove={() => removeStat(i)}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Valor">
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    placeholder="500+"
                  />
                </FormField>
                <FormField label="Etiqueta">
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    placeholder="Clientes"
                  />
                </FormField>
              </div>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function ServicesFeaturesConfig({
  section,
  sectionIndex,
}: {
  section: ThemeSection;
  sectionIndex: number;
}) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ icon: string; title: string; description: string }>) || [];
  const columns = (d.columns as number) || 3;

  const updateItems = (newItems: Array<{ icon: string; title: string; description: string }>) => {
    updateSectionData(sectionIndex, { items: newItems });
  };

  const addItem = () => {
    updateItems([...items, { icon: '✦', title: '', description: '' }]);
  };

  const removeItem = (i: number) => {
    updateItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, field: 'icon' | 'title' | 'description', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Servicios"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Subtítulo"
          />
        </FormField>
      </div>
      <FormField label="Columnas">
        <Select value={String(columns)} onValueChange={(v) => updateSectionData(sectionIndex, { columns: Number(v) })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columnas</SelectItem>
            <SelectItem value="3">3 Columnas</SelectItem>
            <SelectItem value="4">4 Columnas</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Elementos</Label>
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={items.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'items', from, to)}
        >
          {items.map((item, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Elemento ${i + 1}`} onRemove={() => removeItem(i)}>
              <FormField label="Icono (emoji)">
                <EmojiPicker
                  value={item.icon}
                  onChange={(val) => updateItem(i, 'icon', val)}
                  placeholder="⚡"
                />
              </FormField>
              <FormField label="Título">
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  placeholder="Nombre del servicio"
                />
              </FormField>
              <FormField label="Descripción">
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="Descripción..."
                  rows={2}
                />
              </FormField>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function TestimonialsConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const testimonials = (d.testimonials as Array<{ quote: string; name: string; role: string; rating: number }>) || [];

  const updateTestimonials = (newT: Array<{ quote: string; name: string; role: string; rating: number }>) => {
    updateSectionData(sectionIndex, { testimonials: newT });
  };

  const addTestimonial = () => {
    updateTestimonials([...testimonials, { quote: '', name: '', role: '', rating: 5 }]);
  };

  const removeTestimonial = (i: number) => {
    updateTestimonials(testimonials.filter((_, idx) => idx !== i));
  };

  const updateTestimonial = (i: number, field: 'quote' | 'name' | 'role' | 'rating', val: string | number) => {
    const updated = testimonials.map((t, idx) => (idx === i ? { ...t, [field]: val } : t));
    updateTestimonials(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Testimonios"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Lo que dicen nuestros clientes"
          />
        </FormField>
      </div>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Testimonios</Label>
          <Button size="sm" variant="outline" onClick={addTestimonial} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={testimonials.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'testimonials', from, to)}
        >
          {testimonials.map((t, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Testimonio ${i + 1}`} onRemove={() => removeTestimonial(i)}>
              <FormField label="Cita">
                <Textarea
                  value={t.quote}
                  onChange={(e) => updateTestimonial(i, 'quote', e.target.value)}
                  placeholder="Excelente servicio..."
                  rows={2}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nombre">
                  <Input
                    value={t.name}
                    onChange={(e) => updateTestimonial(i, 'name', e.target.value)}
                    placeholder="Juan Pérez"
                  />
                </FormField>
                <FormField label="Rol">
                  <Input
                    value={t.role}
                    onChange={(e) => updateTestimonial(i, 'role', e.target.value)}
                    placeholder="CEO, Empresa"
                  />
                </FormField>
              </div>
              <FormField label="Puntuación">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateTestimonial(i, 'rating', star)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'h-5 w-5 transition-colors',
                          star <= (t.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FormField>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function PricingConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const plans = (d.plans as Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted: boolean;
    ctaText: string;
  }>) || [];

  const updatePlans = (newPlans: typeof plans) => {
    updateSectionData(sectionIndex, { plans: newPlans });
  };

  const addPlan = () => {
    updatePlans([...plans, { name: '', price: '$0', period: '/mes', features: [], highlighted: false, ctaText: 'Comenzar' }]);
  };

  const removePlan = (i: number) => {
    updatePlans(plans.filter((_, idx) => idx !== i));
  };

  const updatePlan = (i: number, field: string, val: unknown) => {
    const updated = plans.map((p, idx) => (idx === i ? { ...p, [field]: val } : p));
    updatePlans(updated);
  };

  const updatePlanFeature = (planIdx: number, featIdx: number, val: string) => {
    const updated = plans.map((p, idx) => {
      if (idx !== planIdx) return p;
      const features = [...p.features];
      features[featIdx] = val;
      return { ...p, features };
    });
    updatePlans(updated);
  };

  const addPlanFeature = (planIdx: number) => {
    const updated = plans.map((p, idx) => {
      if (idx !== planIdx) return p;
      return { ...p, features: [...p.features, ''] };
    });
    updatePlans(updated);
  };

  const removePlanFeature = (planIdx: number, featIdx: number) => {
    const updated = plans.map((p, idx) => {
      if (idx !== planIdx) return p;
      return { ...p, features: p.features.filter((_, fi) => fi !== featIdx) };
    });
    updatePlans(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Precios"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Elige tu plan ideal"
          />
        </FormField>
      </div>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Planes</Label>
          <Button size="sm" variant="outline" onClick={addPlan} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={plans.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'plans', from, to)}
        >
          {plans.map((plan, i) => (
            <SortableRepeatableCard
              key={i}
              sortIndex={i}
              title={`Plan ${i + 1}`}
              onRemove={() => removePlan(i)}
            >
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nombre">
                <Input
                  value={plan.name}
                  onChange={(e) => updatePlan(i, 'name', e.target.value)}
                  placeholder="Básico"
                />
              </FormField>
              <FormField label="Precio">
                <Input
                  value={plan.price}
                  onChange={(e) => updatePlan(i, 'price', e.target.value)}
                  placeholder="$29"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Período">
                <Select
                  value={(plan.period as string) || '/mes'}
                  onValueChange={(v) => updatePlan(i, 'period', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/mes">/ mes</SelectItem>
                    <SelectItem value="/año">/ año</SelectItem>
                    <SelectItem value="/semana">/ semana</SelectItem>
                    <SelectItem value="único">Único</SelectItem>
                    <SelectItem value="/día">/ día</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Texto del Botón">
                <Input
                  value={plan.ctaText}
                  onChange={(e) => updatePlan(i, 'ctaText', e.target.value)}
                  placeholder="Comenzar"
                />
              </FormField>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={plan.highlighted}
                onCheckedChange={(v) => updatePlan(i, 'highlighted', v)}
              />
              <Label className="text-sm">Plan destacado</Label>
            </div>

            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-500">Características</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addPlanFeature(i)}
                  className="h-6 text-xs text-gray-500"
                >
                  <Plus className="h-3 w-3 mr-1" /> Agregar
                </Button>
              </div>
              {plan.features.map((feat, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <Input
                    value={feat}
                    onChange={(e) => updatePlanFeature(i, fi, e.target.value)}
                    placeholder="Característica..."
                    className="flex-1 h-8 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-500 shrink-0"
                    onClick={() => removePlanFeature(i, fi)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function CTAConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection } = useThemeEditorStore();
  const d = section.data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Llamada a la Acción"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Subtítulo"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Texto del Botón">
          <Input
            value={(d.ctaText as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { ctaText: e.target.value })}
            placeholder="Comenzar Ahora"
          />
        </FormField>
        <FormField label="Enlace del Botón">
          <Input
            value={(d.ctaLink as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { ctaLink: e.target.value })}
            placeholder="#contacto"
          />
        </FormField>
      </div>
    </div>
  );
}

function ContactConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection } = useThemeEditorStore();
  const d = section.data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Contáctanos"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Estamos para ayudarte"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email">
          <Input
            value={(d.email as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { email: e.target.value })}
            placeholder="info@ejemplo.com"
          />
        </FormField>
        <FormField label="Teléfono">
          <Input
            value={(d.phone as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { phone: e.target.value })}
            placeholder="+1 234 567 890"
          />
        </FormField>
      </div>
      <FormField label="Dirección">
        <Input
          value={(d.address as string) || ''}
          onChange={(e) => updateSectionData(sectionIndex, { address: e.target.value })}
          placeholder="Calle Principal 123, Ciudad"
        />
      </FormField>
      <div className="flex items-center gap-2">
        <Switch
          checked={d.showForm as boolean || false}
          onCheckedChange={(v) => updateSectionData(sectionIndex, { showForm: v })}
        />
        <Label className="text-sm">Mostrar formulario de contacto</Label>
      </div>
    </div>
  );
}

function GalleryConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const images = (d.images as Array<{ src: string; alt: string; caption: string }>) || [];
  const columns = (d.columns as number) || 3;

  const updateImages = (newImages: typeof images) => {
    updateSectionData(sectionIndex, { images: newImages });
  };

  const addImage = () => {
    updateImages([...images, { src: '', alt: '', caption: '' }]);
  };

  const removeImage = (i: number) => {
    updateImages(images.filter((_, idx) => idx !== i));
  };

  const updateImage = (i: number, field: 'src' | 'alt' | 'caption', val: string) => {
    const updated = images.map((img, idx) => (idx === i ? { ...img, [field]: val } : img));
    updateImages(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Galería"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Nuestro trabajo"
          />
        </FormField>
      </div>
      <FormField label="Columnas">
        <Select value={String(columns)} onValueChange={(v) => updateSectionData(sectionIndex, { columns: Number(v) })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columnas</SelectItem>
            <SelectItem value="3">3 Columnas</SelectItem>
            <SelectItem value="4">4 Columnas</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Imágenes</Label>
          <Button size="sm" variant="outline" onClick={addImage} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={images.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'images', from, to)}
        >
          {images.map((img, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Imagen ${i + 1}`} onRemove={() => removeImage(i)}>
              <ImageUrlField
                value={img.src}
                onChange={(url) => updateImage(i, 'src', url)}
                label="URL de Imagen"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Texto Alternativo">
                  <Input
                    value={img.alt}
                    onChange={(e) => updateImage(i, 'alt', e.target.value)}
                    placeholder="Descripción de la imagen"
                  />
                </FormField>
                <FormField label="Pie de Foto">
                  <Input
                    value={img.caption}
                    onChange={(e) => updateImage(i, 'caption', e.target.value)}
                    placeholder="Pie de foto opcional"
                  />
                </FormField>
              </div>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function FAQConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ question: string; answer: string }>) || [];

  const updateItems = (newItems: typeof items) => {
    updateSectionData(sectionIndex, { items: newItems });
  };

  const addItem = () => {
    updateItems([...items, { question: '', answer: '' }]);
  };

  const removeItem = (i: number) => {
    updateItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, field: 'question' | 'answer', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Preguntas Frecuentes"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Todo lo que necesitas saber"
          />
        </FormField>
      </div>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Preguntas</Label>
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={items.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'items', from, to)}
        >
          {items.map((item, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Pregunta ${i + 1}`} onRemove={() => removeItem(i)}>
              <FormField label="Pregunta">
                <Input
                  value={item.question}
                  onChange={(e) => updateItem(i, 'question', e.target.value)}
                  placeholder="¿Cuál es tu pregunta?"
                />
              </FormField>
              <FormField label="Respuesta">
                <Textarea
                  value={item.answer}
                  onChange={(e) => updateItem(i, 'answer', e.target.value)}
                  placeholder="Escribe la respuesta..."
                  rows={2}
                />
              </FormField>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function StatsConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ icon: string; value: string; label: string }>) || [];

  const updateItems = (newItems: typeof items) => {
    updateSectionData(sectionIndex, { items: newItems });
  };

  const addItem = () => {
    updateItems([...items, { icon: '📊', value: '0', label: '' }]);
  };

  const removeItem = (i: number) => {
    updateItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, field: 'icon' | 'value' | 'label', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-3">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
          placeholder="Estadísticas"
        />
      </FormField>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Estadísticas</Label>
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={items.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'items', from, to)}
        >
          {items.map((item, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Estadística ${i + 1}`} onRemove={() => removeItem(i)}>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Icono (emoji)">
                  <EmojiPicker
                    value={item.icon}
                    onChange={(val) => updateItem(i, 'icon', val)}
                    placeholder="📊"
                  />
                </FormField>
                <FormField label="Valor">
                  <Input
                    value={item.value}
                    onChange={(e) => updateItem(i, 'value', e.target.value)}
                    placeholder="500+"
                  />
                </FormField>
                <FormField label="Etiqueta">
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(i, 'label', e.target.value)}
                    placeholder="Clientes"
                  />
                </FormField>
              </div>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function TeamConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSectionData, updateSection, reorderSectionDataArray } = useThemeEditorStore();
  const d = section.data;
  const members = (d.members as Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
    socials: Array<{ platform: string; url: string }>;
  }>) || [];

  const updateMembers = (newMembers: typeof members) => {
    updateSectionData(sectionIndex, { members: newMembers });
  };

  const addMember = () => {
    updateMembers([...members, { name: '', role: '', bio: '', avatar: '', socials: [] }]);
  };

  const removeMember = (i: number) => {
    updateMembers(members.filter((_, idx) => idx !== i));
  };

  const updateMember = (i: number, field: string, val: string) => {
    const updated = members.map((m, idx) => (idx === i ? { ...m, [field]: val } : m));
    updateMembers(updated);
  };

  const addMemberSocial = (memberIdx: number) => {
    const updated = members.map((m, idx) => {
      if (idx !== memberIdx) return m;
      return { ...m, socials: [...m.socials, { platform: 'twitter', url: '' }] };
    });
    updateMembers(updated);
  };

  const removeMemberSocial = (memberIdx: number, socialIdx: number) => {
    const updated = members.map((m, idx) => {
      if (idx !== memberIdx) return m;
      return { ...m, socials: m.socials.filter((_, si) => si !== socialIdx) };
    });
    updateMembers(updated);
  };

  const updateMemberSocial = (memberIdx: number, socialIdx: number, field: 'platform' | 'url', val: string) => {
    const updated = members.map((m, idx) => {
      if (idx !== memberIdx) return m;
      const socials = m.socials.map((s, si) => (si === socialIdx ? { ...s, [field]: val } : s));
      return { ...m, socials };
    });
    updateMembers(updated);
  };

  return (
    <div className="space-y-3">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
          placeholder="Nuestro Equipo"
        />
      </FormField>

      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Miembros</Label>
          <Button size="sm" variant="outline" onClick={addMember} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <SortableList
          items={members.map((_, i) => i)}
          onReorder={(from, to) => reorderSectionDataArray(sectionIndex, 'members', from, to)}
        >
          {members.map((member, i) => (
            <SortableRepeatableCard key={i} sortIndex={i} title={`Miembro ${i + 1}`} onRemove={() => removeMember(i)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Nombre">
                <Input
                  value={member.name}
                  onChange={(e) => updateMember(i, 'name', e.target.value)}
                  placeholder="Nombre completo"
                />
              </FormField>
              <FormField label="Rol">
                <Input
                  value={member.role}
                  onChange={(e) => updateMember(i, 'role', e.target.value)}
                  placeholder="CEO, Diseñador..."
                />
              </FormField>
            </div>
            <FormField label="Biografía">
              <Textarea
                value={member.bio}
                onChange={(e) => updateMember(i, 'bio', e.target.value)}
                placeholder="Breve biografía..."
                rows={2}
              />
            </FormField>
            <ImageUrlField
              label="Avatar"
              value={member.avatar}
              onChange={(url) => updateMember(i, 'avatar', url)}
            />

            <Separator className="my-1" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-500">Redes Sociales</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addMemberSocial(i)}
                  className="h-6 text-xs text-gray-500"
                >
                  <Plus className="h-3 w-3 mr-1" /> Agregar
                </Button>
              </div>
              {member.socials.map((s, si) => (
                <div key={si} className="flex items-center gap-2">
                  <Select
                    value={s.platform}
                    onValueChange={(v) => updateMemberSocial(i, si, 'platform', v)}
                  >
                    <SelectTrigger className="w-28 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={s.url}
                    onChange={(e) => updateMemberSocial(i, si, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 h-8 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-500 shrink-0"
                    onClick={() => removeMemberSocial(i, si)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            </SortableRepeatableCard>
          ))}
        </SortableList>
      </div>
    </div>
  );
}

function BlogPostsConfig({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  const { updateSection, updateSectionData } = useThemeEditorStore();
  const d = section.data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField label="Título">
          <Input
            value={section.title || ''}
            onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
            placeholder="Últimas Publicaciones"
          />
        </FormField>
        <FormField label="Subtítulo">
          <Input
            value={(d.subtitle as string) || ''}
            onChange={(e) => updateSectionData(sectionIndex, { subtitle: e.target.value })}
            placeholder="Nuestro blog"
          />
        </FormField>
      </div>
      <p className="text-sm text-gray-500">
        Las publicaciones del blog se mostrarán automáticamente desde WordPress. No se requiere configuración adicional.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Config Router
// ─────────────────────────────────────────────────────────────

function SectionConfigPanel({ section, sectionIndex }: { section: ThemeSection; sectionIndex: number }) {
  switch (section.type) {
    case 'hero':
      return <HeroConfig section={section} sectionIndex={sectionIndex} />;
    case 'about':
      return <AboutConfig section={section} sectionIndex={sectionIndex} />;
    case 'services':
    case 'features':
      return <ServicesFeaturesConfig section={section} sectionIndex={sectionIndex} />;
    case 'testimonials':
      return <TestimonialsConfig section={section} sectionIndex={sectionIndex} />;
    case 'pricing':
      return <PricingConfig section={section} sectionIndex={sectionIndex} />;
    case 'cta':
      return <CTAConfig section={section} sectionIndex={sectionIndex} />;
    case 'contact':
      return <ContactConfig section={section} sectionIndex={sectionIndex} />;
    case 'gallery':
      return <GalleryConfig section={section} sectionIndex={sectionIndex} />;
    case 'faq':
      return <FAQConfig section={section} sectionIndex={sectionIndex} />;
    case 'stats':
      return <StatsConfig section={section} sectionIndex={sectionIndex} />;
    case 'team':
      return <TeamConfig section={section} sectionIndex={sectionIndex} />;
    case 'blog_posts':
      return <BlogPostsConfig section={section} sectionIndex={sectionIndex} />;
    default:
      return <p className="text-sm text-gray-500">Configuración no disponible para este tipo de sección.</p>;
  }
}

// ─────────────────────────────────────────────────────────────
// Sortable Section Item (DnD)
// ─────────────────────────────────────────────────────────────

function SortableSectionItem({
  section,
  index,
  isActive,
  onSelect,
  onToggle,
  onRemove,
}: {
  section: ThemeSection;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`
        flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150
        ${isActive
          ? 'bg-emerald-50 border-l-[3px] border-l-emerald-500 shadow-sm'
          : 'hover:bg-gray-200 border-l-[3px] border-l-transparent'
        }
        ${!section.enabled ? 'opacity-50' : ''}
        ${isDragging ? 'z-50 shadow-lg bg-white border-l-[3px] border-l-emerald-300 ring-2 ring-emerald-200' : ''}
      `}
    >
      {/* Drag Handle */}
      <button
        type="button"
        suppressHydrationWarning
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-gray-600 cursor-grab active:cursor-grabbing shrink-0 p-0.5 touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="text-gray-500 shrink-0">{SECTION_TYPE_ICON[section.type]}</div>
      <div className="flex-1 min-w-0 truncate">
        <span className="text-sm font-medium block truncate">
          {section.title || SECTION_TYPE_LABEL[section.type] || section.type}
        </span>
        <span className="text-xs text-gray-400 truncate block">
          {SECTION_TYPE_LABEL[section.type] || section.type}
        </span>
      </div>
      <Switch
        checked={section.enabled}
        onCheckedChange={onToggle}
        className="scale-75 shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-500 hover:text-red-500 p-0.5 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 3: SECTIONS
// ─────────────────────────────────────────────────────────────

function SectionsTab() {
  const {
    config,
    activeSectionIndex,
    setActiveSectionIndex,
    addSection,
    removeSection,
    moveSection,
    toggleSection,
  } = useThemeEditorStore();

  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);

  const sections = config.sections || [];
  const sectionIds = sections.map((_, i) => i);

  // Auto-select first section when none is selected
  useEffect(() => {
    if (activeSectionIndex === null && sections.length > 0) {
      setActiveSectionIndex(0);
    }
  }, [activeSectionIndex, sections.length, setActiveSectionIndex]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const selectedSection = useMemo(
    () => (activeSectionIndex !== null ? sections[activeSectionIndex] : null),
    [activeSectionIndex, sections],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = active.id as number;
      const newIndex = over.id as number;
      moveSection(oldIndex, newIndex);
    },
    [moveSection],
  );

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* LEFT — Section List */}
      <div className="w-full lg:w-80 shrink-0 space-y-3">
        <Card className="border-gray-400 bg-white overflow-hidden">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Secciones ({sections.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {sections.map((section, i) => (
                    <SortableSectionItem
                      key={i}
                      section={section}
                      index={i}
                      isActive={activeSectionIndex === i}
                      onSelect={() => setActiveSectionIndex(i)}
                      onToggle={() => toggleSection(i)}
                      onRemove={() => setRemoveConfirm(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Separator className="my-3" />

            <div className="px-2 pb-1">
              <Select onValueChange={(v) => addSection(v as ThemeSection['type'])}>
                <SelectTrigger className="h-8 text-sm border-dashed border-gray-400">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <SelectValue placeholder="Agregar sección..." />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="flex items-center gap-2">
                        {SECTION_TYPE_ICON[type]}
                        {SECTION_TYPE_LABEL[type]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT — Section Config */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {selectedSection && activeSectionIndex !== null ? (
            <motion.div
              key={activeSectionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-gray-400 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-emerald-600">{SECTION_TYPE_ICON[selectedSection.type]}</div>
                    <CardTitle className="text-base">
                      {SECTION_TYPE_LABEL[selectedSection.type] || selectedSection.type}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[70vh] overflow-y-auto">
                  <SectionConfigPanel section={selectedSection} sectionIndex={activeSectionIndex} />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center h-64"
            >
              <div className="text-center text-gray-500">
                <div className="mb-3 text-4xl opacity-30">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-sm">Selecciona una sección para configurarla</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <AlertDialog open={removeConfirm !== null} onOpenChange={(open) => !open && setRemoveConfirm(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta sección?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará la sección y toda su configuración.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => { if (removeConfirm !== null) { removeSection(removeConfirm); setRemoveConfirm(null); } }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 4: FOOTER
// ─────────────────────────────────────────────────────────────

function FooterTab() {
  const { config, updateConfig, reorderCards } = useThemeEditorStore();
  const socialLinks = (config.socialLinks as Array<{ platform: string; url: string }>) || [];
  const footerColumns = (config.footerColumns as Array<{ title: string; links: Array<{ label: string; url: string }> }>) || [];
  const footerCardOrder = (config.cardOrders as Record<string, string[]>)?.footer || ['copyright', 'social', 'columns'];

  const updateSocialLinks = (newLinks: typeof socialLinks) => {
    updateConfig({ socialLinks: newLinks });
  };

  const addSocialLink = () => {
    updateSocialLinks([...socialLinks, { platform: 'twitter', url: '' }]);
  };

  const removeSocialLink = (i: number) => {
    updateSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  };

  const updateSocialLink = (i: number, field: 'platform' | 'url', val: string) => {
    const updated = socialLinks.map((s, idx) => (idx === i ? { ...s, [field]: val } : s));
    updateSocialLinks(updated);
  };

  const updateFooterColumns = (newCols: typeof footerColumns) => {
    updateConfig({ footerColumns: newCols });
  };

  const addFooterColumn = () => {
    updateFooterColumns([...footerColumns, { title: '', links: [{ label: '', url: '' }] }]);
  };

  const removeFooterColumn = (i: number) => {
    updateFooterColumns(footerColumns.filter((_, idx) => idx !== i));
  };

  const updateFooterColumn = (colIdx: number, field: 'title', val: string) => {
    const updated = footerColumns.map((c, idx) => (idx === colIdx ? { ...c, [field]: val } : c));
    updateFooterColumns(updated);
  };

  const addFooterLink = (colIdx: number) => {
    const updated = footerColumns.map((c, idx) => {
      if (idx !== colIdx) return c;
      return { ...c, links: [...c.links, { label: '', url: '' }] };
    });
    updateFooterColumns(updated);
  };

  const removeFooterLink = (colIdx: number, linkIdx: number) => {
    const updated = footerColumns.map((c, idx) => {
      if (idx !== colIdx) return c;
      return { ...c, links: c.links.filter((_, li) => li !== linkIdx) };
    });
    updateFooterColumns(updated);
  };

  const updateFooterLink = (colIdx: number, linkIdx: number, field: 'label' | 'url', val: string) => {
    const updated = footerColumns.map((c, idx) => {
      if (idx !== colIdx) return c;
      const links = c.links.map((l, li) => (li === linkIdx ? { ...l, [field]: val } : l));
      return { ...c, links };
    });
    updateFooterColumns(updated);
  };

  const getOrder = (id: string) => footerCardOrder.indexOf(id);

  return (
    <SortableCardsProvider
      items={footerCardOrder}
      onReorder={(from, to) => reorderCards('footer', from, to)}
    >
    <div className="space-y-6 flex flex-col">
      <SortableCardWrapper id="copyright" style={{ order: getOrder('copyright') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex-1">Pie de Página</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Texto de Copyright">
            <Input
              value={config.copyrightText || ''}
              onChange={(e) => updateConfig({ copyrightText: e.target.value })}
              placeholder="Todos los derechos reservados"
            />
          </FormField>
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="social" style={{ order: getOrder('social') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <DragHandle />
              <CardTitle className="text-lg">Redes Sociales</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={addSocialLink} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialLinks.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay redes sociales configuradas
            </p>
          )}
          {socialLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select
                value={link.platform}
                onValueChange={(v) => updateSocialLink(i, 'platform', v)}
              >
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={link.url}
                onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-500 hover:text-red-500 shrink-0"
                onClick={() => removeSocialLink(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="columns" style={{ order: getOrder('columns') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <DragHandle />
              <CardTitle className="text-lg">Columnas del Pie de Página</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={addFooterColumn} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {footerColumns.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay columnas configuradas
            </p>
          )}
          {footerColumns.map((col, ci) => (
            <RepeatableCard key={ci} title={`Columna ${ci + 1}`} onRemove={() => removeFooterColumn(ci)}>
              <FormField label="Título de la Columna">
                <Input
                  value={col.title}
                  onChange={(e) => updateFooterColumn(ci, 'title', e.target.value)}
                  placeholder="Título de la columna"
                />
              </FormField>

              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Enlaces</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addFooterLink(ci)}
                    className="h-6 text-xs text-gray-500"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Agregar
                  </Button>
                </div>
                {col.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => updateFooterLink(ci, li, 'label', e.target.value)}
                      placeholder="Etiqueta"
                      className="flex-1 h-8 text-sm"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateFooterLink(ci, li, 'url', e.target.value)}
                      placeholder="URL"
                      className="flex-1 h-8 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-red-500 shrink-0"
                      onClick={() => removeFooterLink(ci, li)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </RepeatableCard>
          ))}
        </CardContent>
      </Card>
      </SortableCardWrapper>
    </div>
    </SortableCardsProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: MEDIOS (Biblioteca de Medios embebida)
// ─────────────────────────────────────────────────────────────

function MediosTab() {
  const [activeView, setActiveView] = useState<'library' | 'details'>('library');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mediaItems, updateMedia, removeMedia } = useMediaLibraryStore();

  const selectedItem = mediaItems.find((m) => m.id === selectedId) || null;

  const handleSelectFromGrid = useCallback((id: string) => {
    setSelectedId(id);
    setActiveView('details');
  }, []);

  const handleBackToLibrary = useCallback(() => {
    setActiveView('library');
    setSelectedId(null);
  }, []);

  if (activeView === 'details' && selectedItem) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToLibrary}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Volver a la biblioteca
        </button>
        <AttachmentDetailsPanel
          item={selectedItem}
          onUpdate={(partial) => updateMedia(selectedItem.id, partial)}
          onRemove={() => {
            removeMedia(selectedItem.id);
            handleBackToLibrary();
          }}
          onBack={handleBackToLibrary}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 overflow-hidden">
        <CardContent className="p-4 relative">
          <div className="relative flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-emerald-900 text-sm">Biblioteca de Medios</h3>
              <p className="text-emerald-700/80 text-xs mt-0.5 leading-relaxed">
                Administra todas las imágenes de tu proyecto. Sube, edita y organiza tus archivos multimedia.
                Las imágenes están disponibles en todos los campos de imagen del editor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embedded media library browser */}
      <Card className="border-gray-400 bg-white overflow-hidden">
        <CardContent className="p-0">
          <MediaLibraryBrowser />
        </CardContent>
      </Card>
    </div>
  );
}

function AttachmentDetailsPanel({
  item,
  onUpdate,
  onRemove,
  onBack,
}: {
  item: MediaItem;
  onUpdate: (partial: Partial<MediaItem>) => void;
  onRemove: () => void;
  onBack: () => void;
}) {
  const [editingImage, setEditingImage] = useState(false);

  const handleImageEdited = useCallback(
    (newUrl: string, width: number, height: number) => {
      onUpdate({ url: newUrl, width, height });
      setEditingImage(false);
      toast.success('Imagen editada y guardada');
    },
    [onUpdate],
  );

  return (
    <>
      {editingImage && (
        <ImageEditor
          item={item}
          onSave={handleImageEdited}
          onClose={() => setEditingImage(false)}
        />
      )}
      <Card className="border-gray-400 bg-white">
        <CardContent className="p-4 space-y-4">
          {/* Image preview */}
          <div className="rounded-lg overflow-hidden bg-gray-200 border border-gray-400">
            <img
              src={item.url}
              alt={item.alt || item.name}
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>

          {/* Alt text */}
          <FormField label="Texto alternativo">
            <Input
              value={item.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Describe la imagen para accesibilidad..."
              className="h-8 text-sm"
            />
          </FormField>

          {/* Caption */}
          <FormField label="Leyenda">
            <Textarea
              value={item.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Agrega una leyenda..."
              rows={2}
              className="text-sm"
            />
          </FormField>

          {/* Metadata */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">Detalles del archivo</Label>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                <span className="truncate text-xs">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs">{item.width} × {item.height}px</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs">{formatFileSize(item.size)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setEditingImage(true)}
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar Imagen
            </Button>
            <Button
              variant="outline"
              onClick={onRemove}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar permanentemente
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: NAVIGATION (estilo WP Appearance > Menus)
// ─────────────────────────────────────────────────────────────

function NavigationTab() {
  const { config, addNavItem, removeNavItem, updateNavItem, moveNavItem, updateConfig, reorderCards } = useThemeEditorStore();
  const navItems = config.navItems || [];
  const siteTitle = config.siteTitle || config.name || 'Mi Sitio Web';
  const tagline = config.tagline || '';
  const logoUrl = config.logoUrl || '';
  const primaryColor = config.primaryColor || '#2563EB';
  const sections = config.sections || [];
  const navbarBehavior = (config.navbarBehavior as 'sticky' | 'hide-on-scroll' | 'static') || 'sticky';
  const showScrollToTop = (config.showScrollToTop as boolean) || false;
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const navCardOrder = (config.cardOrders as Record<string, string[]>)?.navigation || ['banner', 'preview', 'menu', 'behavior', 'quick-add'];

  // Build link options from enabled sections + WordPress pages + custom pages
  const sectionLinkOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; group: string }> = [];

    // Section anchors (from front-page sections)
    const enabledSections = sections.filter((s: ThemeSection) => s.enabled);
    if (enabledSections.length > 0) {
      enabledSections.forEach((s: ThemeSection) => {
        const slug = s.type;
        const title = s.title || slug.charAt(0).toUpperCase() + slug.slice(1);
        options.push({ value: `#section-${slug}`, label: title, group: 'Secciones del Home' });
      });
    }

    // Custom pages (from PagesManager)
    const customPages = (config as any).pages || [];
    if (customPages.length > 0) {
      customPages.forEach((p: any) => {
        if (p.slug) {
          options.push({ value: `/${p.slug}`, label: p.name || p.slug, group: 'Páginas Personalizadas' });
        }
      });
    }

    // WordPress standard pages
    options.push({ value: '/', label: 'Inicio', group: 'Páginas de WordPress' });
    options.push({ value: '/about', label: 'Sobre Nosotros', group: 'Páginas de WordPress' });
    options.push({ value: '/services', label: 'Servicios', group: 'Páginas de WordPress' });
    options.push({ value: '/blog', label: 'Blog', group: 'Páginas de WordPress' });
    options.push({ value: '/contact', label: 'Contacto', group: 'Páginas de WordPress' });
    options.push({ value: '/portfolio', label: 'Portafolio', group: 'Páginas de WordPress' });
    options.push({ value: '/pricing', label: 'Precios', group: 'Páginas de WordPress' });

    return options;
  }, [sections, config]);

  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof sectionLinkOptions> = {};
    sectionLinkOptions.forEach(opt => {
      if (!groups[opt.group]) groups[opt.group] = [];
      groups[opt.group].push(opt);
    });
    return groups;
  }, [sectionLinkOptions]);

  const getOrder = (id: string) => navCardOrder.indexOf(id);

  return (
    <SortableCardsProvider
      items={navCardOrder}
      onReorder={(from, to) => reorderCards('navigation', from, to)}
    >
    <div className="space-y-6 flex flex-col">
      <SortableCardWrapper id="banner" style={{ order: getOrder('banner') }}>
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 overflow-hidden">
        <CardHeader className="pb-0 pt-0 px-4">
          <div className="flex items-center gap-2">
            <DragHandle className="text-emerald-400 hover:text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 relative">
          <div className="relative flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <Menu className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-emerald-900 text-sm">Administrar Menú de Navegación</h3>
              <p className="text-emerald-700/80 text-xs mt-0.5 leading-relaxed">
                Define los enlaces de la barra de navegación principal de tu theme WordPress.
                Arrastra para reordenar o usa las flechas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="preview" style={{ order: getOrder('preview') }}>
      <Card className="border-gray-400 bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-400">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-base flex items-center gap-2 flex-1">
              <Eye className="h-4 w-4 text-gray-500" />
              Vista Previa del Encabezado
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Browser chrome frame */}
          <div className="bg-white">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 border-b border-gray-400">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md border border-gray-400 px-3 py-1 text-xs text-gray-500 text-center max-w-xs mx-auto">
                  misitio.com
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Simulated WordPress header */}
            <div
              className="relative"
              style={{ backgroundColor: '#ffffff', borderBottom: `3px solid ${primaryColor}` }}
            >
              <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo / Site title */}
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={siteTitle}
                      className="h-10 w-auto object-contain rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {siteTitle.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm leading-tight">{siteTitle}</div>
                        {tagline && (
                          <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{tagline}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <nav className="hidden sm:flex items-center gap-1">
                  {navItems.length === 0 ? (
                    <span className="text-xs text-gray-500 italic px-3 py-1.5">Menú vacío</span>
                  ) : (
                    navItems.map((item, i) => {
                      const isDefaultActive = i === 0;
                      const isHovered = hoveredNavIndex === i;
                      const isHighlighted = isDefaultActive || isHovered;
                      return (
                        <a
                          key={i}
                          href={item.url || '#'}
                          onClick={(e) => e.preventDefault()}
                          className="px-3 py-2 text-sm rounded-md transition-colors duration-200 no-underline"
                          style={{
                            backgroundColor: isHighlighted ? primaryColor : 'transparent',
                            color: isHighlighted ? '#ffffff' : '#374151',
                          }}
                          onMouseEnter={() => setHoveredNavIndex(i)}
                          onMouseLeave={() => setHoveredNavIndex(null)}
                        >
                          {item.label || <span className="text-gray-500 italic">Sin título</span>}
                        </a>
                      );
                    })
                  )}
                </nav>

                {/* Mobile menu icon */}
                <div className="sm:hidden flex flex-col gap-1 p-2">
                  <div className="w-5 h-0.5 bg-gray-700 rounded" />
                  <div className="w-5 h-0.5 bg-gray-700 rounded" />
                  <div className="w-5 h-0.5 bg-gray-700 rounded" />
                </div>
              </div>

              {/* PageForge badge */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <span className="text-[9px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-400 shadow-sm">
                  Vista previa · PageForge
                </span>
              </div>
            </div>

            {/* Fake page body */}
            <div className="bg-gray-200 h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-3 w-64 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="menu" style={{ order: getOrder('menu') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <DragHandle />
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-gray-500" />
                Elementos del Menú
                <Badge variant="secondary" className="text-[10px]">{navItems.length}</Badge>
              </CardTitle>
            </div>
            <Button size="sm" onClick={() => addNavItem()} className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-3 w-3" /> Agregar Elemento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {navItems.length === 0 ? (
            <div className="text-center py-8">
              <Menu className="h-10 w-10 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">No hay elementos en el menú</p>
              <p className="text-xs text-gray-500 mb-4">Agrega elementos para construir la navegación de tu theme</p>
              <Button size="sm" onClick={() => addNavItem()} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Agregar Primer Elemento
              </Button>
            </div>
          ) : (
            <SortableList
              items={navItems.map((_, i) => i)}
              onReorder={(from, to) => moveNavItem(from, to)}
            >
            <div className="space-y-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="group flex items-center gap-2 rounded-lg border border-gray-400 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all p-3"
                >
                  {/* Drag Handle */}
                  <button
                    type="button"
                    {...(() => {
                      // We can't use useSortable here directly, so use moveNavItem via drag
                      return {};
                    })()}
                    className="text-gray-500 hover:text-gray-600 cursor-grab active:cursor-grabbing shrink-0 touch-none"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', String(i));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
                      if (!isNaN(from) && from !== i) {
                        moveNavItem(from, i);
                      }
                    }}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>

                  {/* Position number */}
                  <div className="w-7 h-7 rounded-md bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {i + 1}
                  </div>

                  {/* Link Icon */}
                  <Link2 className="h-4 w-4 text-gray-500 shrink-0" />

                  {/* Fields */}
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
                    <Input
                      value={item.label || ''}
                      onChange={(e) => updateNavItem(i, { label: e.target.value })}
                      placeholder="Texto del enlace"
                      className="flex-1 h-8 text-sm border-gray-400 bg-gray-200"
                    />
                    {sectionLinkOptions.some(opt => opt.value === (item.url || '')) ? (
                      <Select
                        value={item.url || ''}
                        onValueChange={(val) => {
                          if (val === '__custom__') {
                            updateNavItem(i, { url: '' });
                          } else {
                            updateNavItem(i, { url: val });
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1 h-8 text-sm font-mono border-gray-400 bg-gray-200">
                          <SelectValue placeholder="Seleccionar enlace..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedOptions).map(([group, opts]) => (
                            <React.Fragment key={group}>
                              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-200">
                                {group}
                              </div>
                              {opts.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                                  <span className="font-mono text-gray-500 mr-2">{opt.value}</span>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                          <div className="border-t border-gray-400" />
                          <SelectItem value="__custom__" className="text-sm text-emerald-600">
                            ✏️ URL personalizada...
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex gap-1 flex-1 min-w-0">
                        <Input
                          value={item.url || ''}
                          onChange={(e) => updateNavItem(i, { url: e.target.value })}
                          placeholder="https://ejemplo.com/pagina"
                          className="flex-1 h-8 text-sm font-mono border-gray-400 bg-gray-200"
                        />
                        <Select
                          value={item.url || ''}
                          onValueChange={(val) => {
                            if (val !== '__custom__') {
                              updateNavItem(i, { url: val });
                            }
                          }}
                        >
                          <SelectTrigger className="w-8 h-8 p-0 border-gray-400 bg-gray-200 shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(groupedOptions).map(([group, opts]) => (
                              <React.Fragment key={group}>
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-200">
                                  {group}
                                </div>
                                {opts.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                                    <span className="font-mono text-gray-500 mr-2">{opt.value}</span>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNavItem(i)}
                    className="h-7 w-7 text-gray-500 hover:text-red-500 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
            </SortableList>
          )}
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="behavior" style={{ order: getOrder('behavior') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-lg flex items-center gap-2 flex-1">
              <Ruler className="h-5 w-5 text-emerald-600" />
              Comportamiento de Navegación
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">Configura cómo se comporta la barra de navegación al hacer scroll en tu sitio.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navbar Behavior */}
          <FormField label="Comportamiento de la Barra de Navegación">
            <Select
              value={navbarBehavior}
              onValueChange={(v) => updateConfig({ navbarBehavior: v as 'sticky' | 'hide-on-scroll' | 'static' })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sticky">
                  <span className="flex items-center gap-2">
                    <span className="text-base">📌</span>
                    <div>
                      <div className="font-medium text-sm">Siempre Visible</div>
                      <div className="text-xs text-gray-500">La barra permanece fija en la parte superior</div>
                    </div>
                  </span>
                </SelectItem>
                <SelectItem value="hide-on-scroll">
                  <span className="flex items-center gap-2">
                    <span className="text-base">👇</span>
                    <div>
                      <div className="font-medium text-sm">Ocultar al Bajar</div>
                      <div className="text-xs text-gray-500">Se oculta al hacer scroll down, reaparece al subir</div>
                    </div>
                  </span>
                </SelectItem>
                <SelectItem value="static">
                  <span className="flex items-center gap-2">
                    <span className="text-base">📄</span>
                    <div>
                      <div className="font-medium text-sm">Estática (Normal)</div>
                      <div className="text-xs text-gray-500">La barra se desplaza con el contenido de la página</div>
                    </div>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Behavior preview description */}
          <div className="rounded-lg bg-gray-200 border border-gray-400 p-3">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-500 leading-relaxed">
                {navbarBehavior === 'sticky' && (
                  <>
                    <strong className="text-gray-700">Siempre Visible:</strong> La barra de navegación se mantendrá fija en la parte superior del navegador mientras el usuario hace scroll. Es ideal para sitios con muchas secciones donde se necesita acceso rápido al menú.
                  </>
                )}
                {navbarBehavior === 'hide-on-scroll' && (
                  <>
                    <strong className="text-gray-700">Ocultar al Bajar:</strong> La barra se ocultará automáticamente cuando el usuario haga scroll hacia abajo, dando más espacio de lectura. Al hacer scroll hacia arriba, la barra reaparecerá con una transición suave.
                  </>
                )}
                {navbarBehavior === 'static' && (
                  <>
                    <strong className="text-gray-700">Estática:</strong> La barra de navegación se comportará de forma normal, desplazándose con el resto del contenido de la página. No permanecerá fija al hacer scroll.
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Scroll to Top */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ChevronUp className="h-4 w-4 text-emerald-600" />
                Botón "Volver Arriba"
              </Label>
              <p className="text-xs text-gray-500">
                Muestra un botón flotante con una flecha ↑ cuando el usuario hace scroll hacia abajo
              </p>
            </div>
            <Switch
              checked={showScrollToTop}
              onCheckedChange={(v) => updateConfig({ showScrollToTop: v })}
            />
          </div>

          {showScrollToTop && (
            <div className="rounded-lg bg-gray-200 border border-gray-400 p-3">
              <div className="flex items-start gap-2">
                <ChevronUp className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-700">Botón "Volver Arriba" activado.</strong> Aparecerá un botón circular flotante en la esquina inferior derecha del sitio cuando el usuario haga scroll. Al hacer clic, la página volverá suavemente al inicio.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </SortableCardWrapper>
      <SortableCardWrapper id="quick-add" style={{ order: getOrder('quick-add') }}>
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DragHandle />
            <CardTitle className="text-base flex-1">Agregar Elementos Rápidos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-3">Presets comunes para agregar al menú rápidamente:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Inicio', url: '/' },
              { label: 'Sobre Nosotros', url: '/about' },
              { label: 'Servicios', url: '/services' },
              { label: 'Portafolio', url: '/portfolio' },
              { label: 'Blog', url: '/blog' },
              { label: 'Contacto', url: '/contact' },
              { label: 'Precios', url: '/pricing' },
              { label: 'FAQ', url: '/faq' },
            ].map((preset) => (
              <Button
                key={preset.label}
                size="sm"
                variant="outline"
                onClick={() => addNavItem(preset)}
                className="h-7 text-xs gap-1 border-gray-400 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Plus className="h-3 w-3" />
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      </SortableCardWrapper>
    </div>
    </SortableCardsProvider>
  );

}



// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT: ThemeEditor
// ─────────────────────────────────────────────────────────────

export default function ThemeEditor() {
  const { activeTab, setActiveTab, config, isGenerating, setIsGenerating } = useThemeEditorStore();
  const saveProject = useProjectsStore((s) => s.saveProject);
  const [showPreview, setShowPreview] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [shadowState, setShadowState] = useState({ left: false, right: false });

  // Update scroll shadows on scroll
  const updateScrollShadows = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setShadowState({
      left: el.scrollLeft > 2,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  }, []);

  // Auto-scroll active tab into view + update shadows when tab changes
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const trigger = el.querySelector(`[data-state="active"]`);
    if (trigger) {
      trigger.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    // Update shadows after scroll settles
    const timeout = setTimeout(updateScrollShadows, 300);
    return () => clearTimeout(timeout);
  }, [activeTab, updateScrollShadows]);

  // Also update shadows on resize
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateScrollShadows();
    el.addEventListener('scroll', updateScrollShadows, { passive: true });
    window.addEventListener('resize', updateScrollShadows);
    return () => {
      el.removeEventListener('scroll', updateScrollShadows);
      window.removeEventListener('resize', updateScrollShadows);
    };
  }, [updateScrollShadows]);

  const handleSave = () => {
    saveProject(config.name || 'Sin Nombre', 'theme', config as Record<string, unknown>);
    toast.success('Proyecto guardado en Mis Proyectos');
  };

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const settings = useSettingsStore.getState();
      const res = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, _exportSettings: { includeScreenshot: settings.includeScreenshot, minifyCSS: settings.minifyCSS, includeREADME: settings.includeREADME } }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(config.slug || 'theme')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('¡Theme ZIP generado exitosamente!');

      // Auto-save project to DB after successful export
      saveProject(config.name || 'Sin Nombre', 'theme', config as Record<string, unknown>).catch(() => {});
    } catch (err) {
      toast.error(`Error al generar el theme: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [config, setIsGenerating]);

  return (
    <div className="flex h-full flex-col">
      {/* TOP ACTION BAR */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#1a1a1a] border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold text-lg">Editor de Theme</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className={`bg-[#2a2a2a] border-gray-500 text-gray-500 hover:bg-[#3a3a3a] hover:text-white font-medium ${showPreview ? 'bg-emerald-700 border-emerald-500' : ''}`}
          >
            {showPreview ? (
              <><EyeOff className="h-4 w-4 mr-2" />Ocultar Vista Previa</>
            ) : (
              <><Eye className="h-4 w-4 mr-2" />Vista Previa</>
            )}
          </Button>
          <Button
            onClick={() => window.open('/preview', '_blank')}
            variant="outline"
            className="bg-[#2a2a2a] border-gray-500 text-gray-500 hover:bg-[#3a3a3a] hover:text-white font-medium"
            title="Abrir preview en nueva pestaña"
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Nueva Pestaña</span>
          </Button>
          <Button
            onClick={handleSave}
            variant="outline"
            className="bg-[#2a2a2a] border-gray-500 text-gray-500 hover:bg-[#3a3a3a] hover:text-white font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generar y Descargar ZIP
            </>
          )}
        </Button>
        </div>
      </header>

      {/* MAIN AREA: Tabs + Preview */}
      <div className="flex flex-1 min-h-0">
        {/* TABS CONTENT */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div
            ref={tabsScrollRef}
            className={cn(
              'px-4 md:px-6 pt-4 pb-2 bg-[#1a1a1a] overflow-x-auto scrollbar-hide scroll-smooth shrink-0 scroll-shadow-x',
              shadowState.left && 'scroll-shadow-left',
              shadowState.right && 'scroll-shadow-right',
            )}
            onScroll={updateScrollShadows}
          >
            <TabsList className="bg-[#2a2a2a] h-10 p-1 w-fit flex-nowrap gap-0.5">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                Información
              </TabsTrigger>
              <TabsTrigger
                value="navigation"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                <span className="flex items-center gap-1.5"><Menu className="h-3.5 w-3.5" />Navegación</span>
              </TabsTrigger>
              <TabsTrigger
                value="design"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                Diseño
              </TabsTrigger>
              <TabsTrigger
                value="sections"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                Secciones
              </TabsTrigger>
              <TabsTrigger
                value="footer"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                Pie de Página
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
              >
                <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" />Plantillas</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto bg-[#f0f0eb] p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
            <TabsContent value="info" className="mt-0">
              <InfoTab />
            </TabsContent>
            <TabsContent value="navigation" className="mt-0">
              <NavigationTab />
            </TabsContent>
            <TabsContent value="design" className="mt-0">
              <DesignTab />
            </TabsContent>
            <TabsContent value="sections" className="mt-0">
              <SectionsTab />
            </TabsContent>
            <TabsContent value="footer" className="mt-0">
              <FooterTab />
            </TabsContent>
            <TabsContent value="templates" className="mt-0">
              <TemplatesTab />
            </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* LIVE PREVIEW PANEL — RIGHT SIDE, 2/3 of space */}
        {showPreview && (
          <div className="flex-[2] border-l border-gray-400 bg-white overflow-hidden shrink-0 flex flex-col">
            <div className="shrink-0 bg-white/90 backdrop-blur-sm border-b border-gray-400 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Vista Previa en Tiempo Real</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">Live</Badge>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
            <ThemeLivePreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
