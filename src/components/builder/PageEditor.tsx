'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
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
  arrayMove,
} from '@dnd-kit/sortable';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ImageIcon,
  Grid3X3,
  Info,
  Quote,
  DollarSign,
  MousePointerClick,
  Mail,
  Images,
  HelpCircle,
  BarChart3,
  Users,
  PanelBottom,
  Star,
  X,
  LayoutList,
} from 'lucide-react';

import { useBuilderStore } from '@/lib/builder-store';
import { SECTION_META, TEMPLATE_META } from '@/lib/builder-types';
import type {
  SectionType,
  PageSection,
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
} from '@/lib/builder-types';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPicker } from '@/components/builder/IconPicker';
import { ImageManager } from '@/components/builder/ImageManager';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

// ═══════════════════════════════════════════════════════════════
// Icon mapping
// ═══════════════════════════════════════════════════════════════

function Zap(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
function Shield(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function Sparkles(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}
function Headphones(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
function Puzzle(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
    </svg>
  );
}
function Activity(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}
function Database(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" /><path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" />
    </svg>
  );
}

function SectionIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'Image': return <ImageIcon className={className} />;
    case 'Grid3X3': return <Grid3X3 className={className} />;
    case 'Info': return <Info className={className} />;
    case 'Quote': return <Quote className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'MousePointerClick': return <MousePointerClick className={className} />;
    case 'Mail': return <Mail className={className} />;
    case 'Images': return <Images className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'BarChart3': return <BarChart3 className={className} />;
    case 'Users': return <Users className={className} />;
    case 'PanelBottom': return <PanelBottom className={className} />;
    case 'LayoutList': return <LayoutList className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Puzzle': return <Puzzle className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Database': return <Database className={className} />;
    default: return <LayoutList className={className} />;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Principal': 'bg-emerald-100 text-emerald-700',
  'Contenido': 'bg-sky-100 text-sky-700',
  'Social Proof': 'bg-amber-100 text-amber-700',
  'Conversión': 'bg-rose-100 text-rose-700',
  'Soporte': 'bg-violet-100 text-violet-700',
  'Estructural': 'bg-stone-100 text-stone-700',
};

// ═══════════════════════════════════════════════════════════════
// Helper: generate short unique id
// ═══════════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2, 10);

// ═══════════════════════════════════════════════════════════════
// Sortable Section Item
// ═══════════════════════════════════════════════════════════════

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggle,
  onDelete,
  onDuplicate,
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, strategy: verticalListSortingStrategy });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = SECTION_META[section.type] || { label: section.type.charAt(0).toUpperCase() + section.type.slice(1), icon: 'LayoutList', description: '', category: 'Otro' };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all cursor-pointer',
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-transparent bg-white hover:bg-muted/50 hover:border-border',
        !section.enabled && 'opacity-50',
      )}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        className={cn(
          'flex-shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-0.5 rounded',
          isDragging && 'text-emerald-600',
        )}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Icon + label */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md flex-shrink-0',
            isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground',
          )}
        >
          <SectionIcon name={meta.icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className={cn('text-sm font-medium truncate', isSelected ? 'text-emerald-900' : 'text-foreground')}>
            {meta.label}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {section.type === 'hero' && (section as HeroSection).data.title?.slice(0, 30)}
            {section.type === 'features' && `${(section as FeaturesSection).data.features.length} elementos`}
            {section.type === 'about' && (section as AboutSection).data.title}
            {section.type === 'testimonials' && `${(section as TestimonialsSection).data.testimonials.length} testimonios`}
            {section.type === 'pricing' && `${(section as PricingSection).data.plans.length} planes`}
            {section.type === 'cta' && (section as CTASection).data.ctaText}
            {section.type === 'contact' && (section as ContactSection).data.email}
            {section.type === 'gallery' && `${(section as GallerySection).data.images.length} imágenes`}
            {section.type === 'faq' && `${(section as FAQSection).data.items.length} preguntas`}
            {section.type === 'stats' && `${(section as StatsSection).data.items.length} métricas`}
            {section.type === 'team' && `${(section as TeamSection).data.members.length} miembros`}
            {section.type === 'footer' && (section as FooterSection).data.brandName}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title={section.enabled ? 'Desactivar' : 'Activar'}
        >
          <div
            className={cn(
              'h-3.5 w-6 rounded-full flex items-center transition-colors',
              section.enabled ? 'bg-emerald-500 justify-end' : 'bg-muted justify-start',
            )}
          >
            <div className="h-3 w-3 rounded-full bg-white shadow-sm mx-0.5" />
          </div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-sky-600"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicar"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// cn utility
// ═══════════════════════════════════════════════════════════════
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

// ═══════════════════════════════════════════════════════════════
// Shared Editor Sub-components
// ═══════════════════════════════════════════════════════════════

function FieldGroup({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Section Editors
// ═══════════════════════════════════════════════════════════════

// ─── Hero Editor ──────────────────────────────────────────────
function HeroEditor({ section, onUpdate }: { section: HeroSection; onUpdate: (data: Partial<HeroSection>) => void }) {
  const d = section.data;

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor Hero" description="Configura el encabezado principal de tu página" />

      <FieldGroup label="Título">
        <Input
          value={d.title}
          onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })}
          placeholder="Escribe el título principal..."
        />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Textarea
          value={d.subtitle}
          onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })}
          placeholder="Describe brevemente tu propuesta de valor..."
          rows={3}
        />
      </FieldGroup>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Texto CTA Principal">
          <Input
            value={d.ctaText}
            onChange={(e) => onUpdate({ data: { ...d, ctaText: e.target.value } })}
            placeholder="Comenzar Gratis"
          />
        </FieldGroup>
        <FieldGroup label="Enlace CTA Principal">
          <Input
            value={d.ctaLink}
            onChange={(e) => onUpdate({ data: { ...d, ctaLink: e.target.value } })}
            placeholder="#contacto"
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Texto CTA Secundario">
          <Input
            value={d.secondaryCtaText}
            onChange={(e) => onUpdate({ data: { ...d, secondaryCtaText: e.target.value } })}
            placeholder="Ver Demo"
          />
        </FieldGroup>
        <FieldGroup label="Enlace CTA Secundario">
          <Input
            value={d.secondaryCtaLink}
            onChange={(e) => onUpdate({ data: { ...d, secondaryCtaLink: e.target.value } })}
            placeholder="#features"
          />
        </FieldGroup>
      </div>

      <Separator />

      <FieldGroup label="Imagen de Fondo">
        <ImageManager
          value={d.backgroundImage}
          onChange={(url) => onUpdate({ data: { ...d, backgroundImage: url } })}
        />
      </FieldGroup>

      <FieldGroup label={`Opacidad del Overlay: ${d.overlayOpacity}%`}>
        <Slider
          value={[d.overlayOpacity]}
          onValueChange={([val]) => onUpdate({ data: { ...d, overlayOpacity: val } })}
          min={0}
          max={100}
          step={5}
        />
      </FieldGroup>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Altura">
          <Select value={d.height} onValueChange={(v) => onUpdate({ data: { ...d, height: v as HeroSection['data']['height'] } })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeña</SelectItem>
              <SelectItem value="medium">Mediana</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Alineación">
          <Select value={d.alignment} onValueChange={(v) => onUpdate({ data: { ...d, alignment: v as HeroSection['data']['alignment'] } })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Izquierda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Derecha</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>
    </div>
  );
}

// ─── Features Editor ──────────────────────────────────────────
function FeaturesEditor({ section, onUpdate }: { section: FeaturesSection; onUpdate: (data: Partial<FeaturesSection>) => void }) {
  const d = section.data;

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...d.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate({ data: { ...d, features: newFeatures } });
  };

  const removeFeature = (index: number) => {
    onUpdate({ data: { ...d, features: d.features.filter((_, i) => i !== index) } });
  };

  const addFeature = () => {
    onUpdate({
      data: {
        ...d,
        features: [...d.features, { id: uid(), icon: 'Star', title: 'Nueva Característica', description: 'Descripción de la característica.' }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Características" description="Gestiona las funcionalidades de tu producto" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Columnas">
        <Select value={String(d.columns)} onValueChange={(v) => onUpdate({ data: { ...d, columns: Number(v) as 2 | 3 | 4 } })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 columnas</SelectItem>
            <SelectItem value="3">3 columnas</SelectItem>
            <SelectItem value="4">4 columnas</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Lista de Características ({d.features.length})</Label>
          <Button variant="outline" size="sm" onClick={addFeature} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {d.features.map((feature, index) => (
            <Card key={feature.id} className="p-3 space-y-2.5 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeFeature(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <FieldGroup label="Icono">
                <IconPicker
                  value={feature.icon}
                  onChange={(icon) => updateFeature(index, 'icon', icon)}
                />
              </FieldGroup>

              <FieldGroup label="Título">
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  placeholder="Nombre de la característica"
                  className="text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Descripción">
                <Textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  placeholder="Describe esta característica..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </FieldGroup>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── About Editor ─────────────────────────────────────────────
function AboutEditor({ section, onUpdate }: { section: AboutSection; onUpdate: (data: Partial<AboutSection>) => void }) {
  const d = section.data;

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...d.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdate({ data: { ...d, stats: newStats } });
  };

  const removeStat = (index: number) => {
    onUpdate({ data: { ...d, stats: d.stats.filter((_, i) => i !== index) } });
  };

  const addStat = () => {
    onUpdate({ data: { ...d, stats: [...d.stats, { value: '0', label: 'Nueva Métrica' }] } });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor Sobre Nosotros" description="Configura la sección informativa de tu empresa" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Descripción">
        <Textarea
          value={d.description}
          onChange={(e) => onUpdate({ data: { ...d, description: e.target.value } })}
          rows={4}
          placeholder="Cuenta la historia de tu empresa..."
        />
      </FieldGroup>

      <FieldGroup label="Imagen">
        <ImageManager
          value={d.image}
          onChange={(url) => onUpdate({ data: { ...d, image: url } })}
        />
      </FieldGroup>

      <FieldGroup label="Posición de la Imagen">
        <Select value={d.imagePosition} onValueChange={(v) => onUpdate({ data: { ...d, imagePosition: v as 'left' | 'right' } })}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Estadísticas ({d.stats.length})</Label>
          <Button variant="outline" size="sm" onClick={addStat} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {d.stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="1000+"
                className="flex-1 text-sm"
              />
              <Input
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Clientes"
                className="flex-[2] text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity flex-shrink-0"
                onClick={() => removeStat(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Testimonials Editor ──────────────────────────────────────
function TestimonialsEditor({ section, onUpdate }: { section: TestimonialsSection; onUpdate: (data: Partial<TestimonialsSection>) => void }) {
  const d = section.data;

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const newTestimonials = [...d.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate({ data: { ...d, testimonials: newTestimonials } });
  };

  const removeTestimonial = (index: number) => {
    onUpdate({ data: { ...d, testimonials: d.testimonials.filter((_, i) => i !== index) } });
  };

  const addTestimonial = () => {
    onUpdate({
      data: {
        ...d,
        testimonials: [...d.testimonials, { id: uid(), name: '', role: '', avatar: '', quote: '', rating: 5 }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Testimonios" description="Gestiona las opiniones de tus clientes" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Testimonios ({d.testimonials.length})</Label>
          <Button variant="outline" size="sm" onClick={addTestimonial} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {d.testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className="p-3 space-y-2.5 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeTestimonial(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Nombre">
                  <Input value={testimonial.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} placeholder="Nombre" className="text-sm" />
                </FieldGroup>
                <FieldGroup label="Rol">
                  <Input value={testimonial.role} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} placeholder="CEO, Empresa" className="text-sm" />
                </FieldGroup>
              </div>

              <FieldGroup label="URL Avatar">
                <Input value={testimonial.avatar} onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)} placeholder="https://..." className="text-sm" />
              </FieldGroup>

              <FieldGroup label="Opinión">
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                  placeholder="Escribe la opinión del cliente..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </FieldGroup>

              <FieldGroup label={`Valoración: ${testimonial.rating} estrellas`}>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-0.5 hover:scale-110 transition-transform"
                      onClick={() => updateTestimonial(index, 'rating', star)}
                    >
                      <Star
                        className={cn(
                          'h-5 w-5 transition-colors',
                          star <= testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FieldGroup>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Editor ───────────────────────────────────────────
function PricingEditor({ section, onUpdate }: { section: PricingSection; onUpdate: (data: Partial<PricingSection>) => void }) {
  const d = section.data;

  const updatePlan = (index: number, field: string, value: string | boolean | string[]) => {
    const newPlans = [...d.plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onUpdate({ data: { ...d, plans: newPlans } });
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...d.plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    onUpdate({ data: { ...d, plans: newPlans } });
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...d.plans];
    const newFeatures = newPlans[planIndex].features.filter((_, i) => i !== featureIndex);
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    onUpdate({ data: { ...d, plans: newPlans } });
  };

  const addPlanFeature = (planIndex: number) => {
    const newPlans = [...d.plans];
    newPlans[planIndex] = { ...newPlans[planIndex], features: [...newPlans[planIndex].features, 'Nueva característica'] };
    onUpdate({ data: { ...d, plans: newPlans } });
  };

  const removePlan = (index: number) => {
    onUpdate({ data: { ...d, plans: d.plans.filter((_, i) => i !== index) } });
  };

  const addPlan = () => {
    onUpdate({
      data: {
        ...d,
        plans: [...d.plans, { id: uid(), name: 'Nuevo Plan', price: '0', period: '/mes', description: '', features: [], highlighted: false, ctaText: 'Elegir' }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Precios" description="Configura los planes de precios" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Planes ({d.plans.length})</Label>
          <Button variant="outline" size="sm" onClick={addPlan} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir Plan
          </Button>
        </div>

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {d.plans.map((plan, index) => (
            <Card key={plan.id} className="p-3 space-y-2.5 relative group border-l-4" style={{ borderLeftColor: plan.highlighted ? '#0F766E' : undefined }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.highlighted}
                    onCheckedChange={(checked) => updatePlan(index, 'highlighted', checked)}
                  />
                  <span className="text-xs text-muted-foreground">Destacado</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                  onClick={() => removePlan(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <FieldGroup label="Nombre">
                  <Input value={plan.name} onChange={(e) => updatePlan(index, 'name', e.target.value)} className="text-sm" />
                </FieldGroup>
                <FieldGroup label="Precio">
                  <Input value={plan.price} onChange={(e) => updatePlan(index, 'price', e.target.value)} className="text-sm" />
                </FieldGroup>
                <FieldGroup label="Período">
                  <Input value={plan.period} onChange={(e) => updatePlan(index, 'period', e.target.value)} className="text-sm" />
                </FieldGroup>
              </div>

              <FieldGroup label="Descripción">
                <Input value={plan.description} onChange={(e) => updatePlan(index, 'description', e.target.value)} className="text-sm" />
              </FieldGroup>

              <FieldGroup label="Texto CTA">
                <Input value={plan.ctaText} onChange={(e) => updatePlan(index, 'ctaText', e.target.value)} className="text-sm" />
              </FieldGroup>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Características ({plan.features.length})</Label>
                  <Button variant="ghost" size="sm" onClick={() => addPlanFeature(index)} className="h-6 text-xs gap-1">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-center gap-1.5 group/feat">
                    <span className="text-emerald-500 text-xs flex-shrink-0">✓</span>
                    <Input
                      value={feature}
                      onChange={(e) => updatePlanFeature(index, fi, e.target.value)}
                      className="text-sm h-7"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover/feat:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity flex-shrink-0"
                      onClick={() => removePlanFeature(index, fi)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CTA Editor ───────────────────────────────────────────────
function CTAEditor({ section, onUpdate }: { section: CTASection; onUpdate: (data: Partial<CTASection>) => void }) {
  const d = section.data;

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor CTA" description="Configura la sección de llamada a la acción" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Textarea
          value={d.subtitle}
          onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })}
          rows={2}
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Texto del Botón">
          <Input value={d.ctaText} onChange={(e) => onUpdate({ data: { ...d, ctaText: e.target.value } })} />
        </FieldGroup>
        <FieldGroup label="Enlace del Botón">
          <Input value={d.ctaLink} onChange={(e) => onUpdate({ data: { ...d, ctaLink: e.target.value } })} />
        </FieldGroup>
      </div>

      <FieldGroup label="Estilo de Fondo">
        <Select value={d.backgroundStyle} onValueChange={(v) => onUpdate({ data: { ...d, backgroundStyle: v as CTASection['data']['backgroundStyle'] } })}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Color Sólido</SelectItem>
            <SelectItem value="gradient">Degradado</SelectItem>
            <SelectItem value="image">Imagen</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      {d.backgroundStyle === 'image' && (
        <FieldGroup label="Imagen de Fondo">
          <ImageManager
            value={d.backgroundImage}
            onChange={(url) => onUpdate({ data: { ...d, backgroundImage: url } })}
          />
        </FieldGroup>
      )}
    </div>
  );
}

// ─── Contact Editor ───────────────────────────────────────────
function ContactEditor({ section, onUpdate }: { section: ContactSection; onUpdate: (data: Partial<ContactSection>) => void }) {
  const d = section.data;

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Contacto" description="Configura la información de contacto" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <FieldGroup label="Email">
        <Input value={d.email} onChange={(e) => onUpdate({ data: { ...d, email: e.target.value } })} type="email" />
      </FieldGroup>

      <FieldGroup label="Teléfono">
        <Input value={d.phone} onChange={(e) => onUpdate({ data: { ...d, phone: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Dirección">
        <Input value={d.address} onChange={(e) => onUpdate({ data: { ...d, address: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <div className="flex items-center justify-between">
        <FieldGroup label="Mostrar Formulario">
          <p className="text-xs text-muted-foreground">Activa para mostrar un formulario de contacto en la sección</p>
        </FieldGroup>
        <Switch
          checked={d.showForm}
          onCheckedChange={(checked) => onUpdate({ data: { ...d, showForm: checked } })}
        />
      </div>
    </div>
  );
}

// ─── Gallery Editor ───────────────────────────────────────────
function GalleryEditor({ section, onUpdate }: { section: GallerySection; onUpdate: (data: Partial<GallerySection>) => void }) {
  const d = section.data;

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...d.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onUpdate({ data: { ...d, images: newImages } });
  };

  const removeImage = (index: number) => {
    onUpdate({ data: { ...d, images: d.images.filter((_, i) => i !== index) } });
  };

  const addImage = () => {
    onUpdate({
      data: {
        ...d,
        images: [...d.images, { id: uid(), src: '', alt: 'Nueva imagen', caption: '' }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Galería" description="Gestiona las imágenes de la galería" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Columnas">
        <Select value={String(d.columns)} onValueChange={(v) => onUpdate({ data: { ...d, columns: Number(v) as 2 | 3 | 4 } })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 columnas</SelectItem>
            <SelectItem value="3">3 columnas</SelectItem>
            <SelectItem value="4">4 columnas</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Imágenes ({d.images.length})</Label>
          <Button variant="outline" size="sm" onClick={addImage} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {d.images.map((image, index) => (
            <Card key={image.id} className="p-3 space-y-2 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <FieldGroup label="Imagen">
                <ImageManager
                  value={image.src}
                  onChange={(url) => updateImage(index, 'src', url)}
                />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-2">
                <FieldGroup label="Texto Alternativo">
                  <Input value={image.alt} onChange={(e) => updateImage(index, 'alt', e.target.value)} placeholder="Descripción" className="text-sm" />
                </FieldGroup>
                <FieldGroup label="Pie de Foto">
                  <Input value={image.caption || ''} onChange={(e) => updateImage(index, 'caption', e.target.value)} placeholder="Opcional" className="text-sm" />
                </FieldGroup>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Editor ───────────────────────────────────────────────
function FAQEditor({ section, onUpdate }: { section: FAQSection; onUpdate: (data: Partial<FAQSection>) => void }) {
  const d = section.data;

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...d.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ data: { ...d, items: newItems } });
  };

  const removeItem = (index: number) => {
    onUpdate({ data: { ...d, items: d.items.filter((_, i) => i !== index) } });
  };

  const addItem = () => {
    onUpdate({
      data: {
        ...d,
        items: [...d.items, { id: uid(), question: '', answer: '' }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de FAQ" description="Gestiona las preguntas frecuentes" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Preguntas ({d.items.length})</Label>
          <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {d.items.map((item, index) => (
            <Card key={item.id} className="p-3 space-y-2.5 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeItem(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <FieldGroup label="Pregunta">
                    <Input
                      value={item.question}
                      onChange={(e) => updateItem(index, 'question', e.target.value)}
                      placeholder="Escribe la pregunta..."
                      className="text-sm"
                    />
                  </FieldGroup>
                  <FieldGroup label="Respuesta">
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateItem(index, 'answer', e.target.value)}
                      placeholder="Escribe la respuesta..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </FieldGroup>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Editor ─────────────────────────────────────────────
function StatsEditor({ section, onUpdate }: { section: StatsSection; onUpdate: (data: Partial<StatsSection>) => void }) {
  const d = section.data;

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...d.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ data: { ...d, items: newItems } });
  };

  const removeItem = (index: number) => {
    onUpdate({ data: { ...d, items: d.items.filter((_, i) => i !== index) } });
  };

  const addItem = () => {
    onUpdate({
      data: {
        ...d,
        items: [...d.items, { value: '0', label: 'Nueva Métrica', icon: 'Star' }],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Estadísticas" description="Configura las métricas destacadas" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} placeholder="Opcional" />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Métricas ({d.items.length})</Label>
          <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {d.items.map((item, index) => (
            <Card key={index} className="p-3 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeItem(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <div className="space-y-2 pr-4">
                <div className="grid grid-cols-2 gap-2">
                  <FieldGroup label="Valor">
                    <Input value={item.value} onChange={(e) => updateItem(index, 'value', e.target.value)} placeholder="10K+" className="text-sm" />
                  </FieldGroup>
                  <FieldGroup label="Icono">
                    <IconPicker
                      value={item.icon}
                      onChange={(icon) => updateItem(index, 'icon', icon)}
                    />
                  </FieldGroup>
                </div>
                <FieldGroup label="Etiqueta">
                  <Input value={item.label} onChange={(e) => updateItem(index, 'label', e.target.value)} placeholder="Usuarios Activos" className="text-sm" />
                </FieldGroup>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Team Editor ──────────────────────────────────────────────
function TeamEditor({ section, onUpdate }: { section: TeamSection; onUpdate: (data: Partial<TeamSection>) => void }) {
  const d = section.data;

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...d.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onUpdate({ data: { ...d, members: newMembers } });
  };

  const removeMember = (index: number) => {
    onUpdate({ data: { ...d, members: d.members.filter((_, i) => i !== index) } });
  };

  const addMember = () => {
    onUpdate({
      data: {
        ...d,
        members: [...d.members, { id: uid(), name: '', role: '', avatar: '', bio: '', socials: [] }],
      },
    });
  };

  const updateSocial = (memberIndex: number, socialIndex: number, field: string, value: string) => {
    const newMembers = [...d.members];
    const newSocials = [...newMembers[memberIndex].socials];
    newSocials[socialIndex] = { ...newSocials[socialIndex], [field]: value };
    newMembers[memberIndex] = { ...newMembers[memberIndex], socials: newSocials };
    onUpdate({ data: { ...d, members: newMembers } });
  };

  const addSocial = (memberIndex: number) => {
    const newMembers = [...d.members];
    newMembers[memberIndex] = { ...newMembers[memberIndex], socials: [...newMembers[memberIndex].socials, { platform: 'linkedin', url: '#' }] };
    onUpdate({ data: { ...d, members: newMembers } });
  };

  const removeSocial = (memberIndex: number, socialIndex: number) => {
    const newMembers = [...d.members];
    const newSocials = newMembers[memberIndex].socials.filter((_, i) => i !== socialIndex);
    newMembers[memberIndex] = { ...newMembers[memberIndex], socials: newSocials };
    onUpdate({ data: { ...d, members: newMembers } });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor de Equipo" description="Presenta a los miembros de tu equipo" />

      <FieldGroup label="Título">
        <Input value={d.title} onChange={(e) => onUpdate({ data: { ...d, title: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Subtítulo">
        <Input value={d.subtitle} onChange={(e) => onUpdate({ data: { ...d, subtitle: e.target.value } })} />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Miembros ({d.members.length})</Label>
          <Button variant="outline" size="sm" onClick={addMember} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {d.members.map((member, index) => (
            <Card key={member.id} className="p-3 space-y-2.5 relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                onClick={() => removeMember(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Nombre">
                  <Input value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} placeholder="Nombre completo" className="text-sm" />
                </FieldGroup>
                <FieldGroup label="Rol">
                  <Input value={member.role} onChange={(e) => updateMember(index, 'role', e.target.value)} placeholder="CEO, Fundador" className="text-sm" />
                </FieldGroup>
              </div>

              <FieldGroup label="Avatar">
                <ImageManager
                  value={member.avatar}
                  onChange={(url) => updateMember(index, 'avatar', url)}
                />
              </FieldGroup>

              <FieldGroup label="Biografía">
                <Textarea
                  value={member.bio}
                  onChange={(e) => updateMember(index, 'bio', e.target.value)}
                  placeholder="Breve biografía del miembro..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </FieldGroup>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Redes Sociales ({member.socials.length})</Label>
                  <Button variant="ghost" size="sm" onClick={() => addSocial(index)} className="h-6 text-xs gap-1">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {member.socials.map((social, si) => (
                  <div key={si} className="flex items-center gap-1.5">
                    <Input
                      value={social.platform}
                      onChange={(e) => updateSocial(index, si, 'platform', e.target.value)}
                      placeholder="linkedin"
                      className="text-sm h-7 flex-1"
                    />
                    <Input
                      value={social.url}
                      onChange={(e) => updateSocial(index, si, 'url', e.target.value)}
                      placeholder="https://..."
                      className="text-sm h-7 flex-[2]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-600 flex-shrink-0"
                      onClick={() => removeSocial(index, si)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Footer Editor ────────────────────────────────────────────
function FooterEditor({ section, onUpdate }: { section: FooterSection; onUpdate: (data: Partial<FooterSection>) => void }) {
  const d = section.data;

  const updateLinkColumn = (colIndex: number, field: 'title' | 'links', value: string | { label: string; url: string }[]) => {
    const newColumns = [...d.columns];
    newColumns[colIndex] = { ...newColumns[colIndex], [field]: value };
    onUpdate({ data: { ...d, columns: newColumns } });
  };

  const updateLink = (colIndex: number, linkIndex: number, field: string, value: string) => {
    const newColumns = [...d.columns];
    const newLinks = [...newColumns[colIndex].links];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
    newColumns[colIndex] = { ...newColumns[colIndex], links: newLinks };
    onUpdate({ data: { ...d, columns: newColumns } });
  };

  const removeLink = (colIndex: number, linkIndex: number) => {
    const newColumns = [...d.columns];
    const newLinks = newColumns[colIndex].links.filter((_, i) => i !== linkIndex);
    newColumns[colIndex] = { ...newColumns[colIndex], links: newLinks };
    onUpdate({ data: { ...d, columns: newColumns } });
  };

  const addLink = (colIndex: number) => {
    const newColumns = [...d.columns];
    newColumns[colIndex] = { ...newColumns[colIndex], links: [...newColumns[colIndex].links, { label: 'Nuevo Enlace', url: '#' }] };
    onUpdate({ data: { ...d, columns: newColumns } });
  };

  const removeColumn = (colIndex: number) => {
    onUpdate({ data: { ...d, columns: d.columns.filter((_, i) => i !== colIndex) } });
  };

  const addColumn = () => {
    onUpdate({ data: { ...d, columns: [...d.columns, { title: 'Nueva Columna', links: [] }] } });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newSocials = [...d.socialLinks];
    newSocials[index] = { ...newSocials[index], [field]: value };
    onUpdate({ data: { ...d, socialLinks: newSocials } });
  };

  const removeSocialLink = (index: number) => {
    onUpdate({ data: { ...d, socialLinks: d.socialLinks.filter((_, i) => i !== index) } });
  };

  const addSocialLink = () => {
    onUpdate({ data: { ...d, socialLinks: [...d.socialLinks, { platform: 'website', url: '#' }] } });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Editor del Footer" description="Configura el pie de página" />

      <FieldGroup label="Nombre de Marca">
        <Input value={d.brandName} onChange={(e) => onUpdate({ data: { ...d, brandName: e.target.value } })} />
      </FieldGroup>

      <FieldGroup label="Descripción de Marca">
        <Textarea
          value={d.brandDescription}
          onChange={(e) => onUpdate({ data: { ...d, brandDescription: e.target.value } })}
          rows={2}
        />
      </FieldGroup>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Columnas de Enlaces ({d.columns.length})</Label>
          <Button variant="outline" size="sm" onClick={addColumn} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {d.columns.map((column, colIndex) => (
            <Card key={colIndex} className="p-3 space-y-2.5 relative group">
              <div className="flex items-center justify-between">
                <FieldGroup label="Título de Columna">
                  <Input
                    value={column.title}
                    onChange={(e) => updateLinkColumn(colIndex, 'title', e.target.value)}
                    placeholder="Título"
                    className="text-sm w-48"
                  />
                </FieldGroup>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity flex-shrink-0"
                  onClick={() => removeColumn(colIndex)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">Enlaces ({column.links.length})</Label>
                  <Button variant="ghost" size="sm" onClick={() => addLink(colIndex)} className="h-6 text-xs gap-1">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {column.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-1.5">
                    <Input
                      value={link.label}
                      onChange={(e) => updateLink(colIndex, li, 'label', e.target.value)}
                      placeholder="Texto"
                      className="text-sm h-7 flex-1"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(colIndex, li, 'url', e.target.value)}
                      placeholder="URL"
                      className="text-sm h-7 flex-[2]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-600 flex-shrink-0"
                      onClick={() => removeLink(colIndex, li)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Redes Sociales ({d.socialLinks.length})</Label>
          <Button variant="outline" size="sm" onClick={addSocialLink} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </Button>
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {d.socialLinks.map((social, si) => (
            <div key={si} className="flex items-center gap-2">
              <Input
                value={social.platform}
                onChange={(e) => updateSocialLink(si, 'platform', e.target.value)}
                placeholder="twitter"
                className="text-sm h-7 flex-1"
              />
              <Input
                value={social.url}
                onChange={(e) => updateSocialLink(si, 'url', e.target.value)}
                placeholder="https://..."
                className="text-sm h-7 flex-[2]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-600 flex-shrink-0"
                onClick={() => removeSocialLink(si)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <FieldGroup label="Copyright">
        <Input value={d.copyright} onChange={(e) => onUpdate({ data: { ...d, copyright: e.target.value } })} />
      </FieldGroup>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Section Editor Router
// ═══════════════════════════════════════════════════════════════

function SectionEditorRouter({ section, onUpdate }: { section: PageSection; onUpdate: (data: Partial<PageSection>) => void }) {
  switch (section.type) {
    case 'hero':
      return <HeroEditor section={section as HeroSection} onUpdate={onUpdate as (data: Partial<HeroSection>) => void} />;
    case 'features':
      return <FeaturesEditor section={section as FeaturesSection} onUpdate={onUpdate as (data: Partial<FeaturesSection>) => void} />;
    case 'about':
      return <AboutEditor section={section as AboutSection} onUpdate={onUpdate as (data: Partial<AboutSection>) => void} />;
    case 'testimonials':
      return <TestimonialsEditor section={section as TestimonialsSection} onUpdate={onUpdate as (data: Partial<TestimonialsSection>) => void} />;
    case 'pricing':
      return <PricingEditor section={section as PricingSection} onUpdate={onUpdate as (data: Partial<PricingSection>) => void} />;
    case 'cta':
      return <CTAEditor section={section as CTASection} onUpdate={onUpdate as (data: Partial<CTASection>) => void} />;
    case 'contact':
      return <ContactEditor section={section as ContactSection} onUpdate={onUpdate as (data: Partial<ContactSection>) => void} />;
    case 'gallery':
      return <GalleryEditor section={section as GallerySection} onUpdate={onUpdate as (data: Partial<GallerySection>) => void} />;
    case 'faq':
      return <FAQEditor section={section as FAQSection} onUpdate={onUpdate as (data: Partial<FAQSection>) => void} />;
    case 'stats':
      return <StatsEditor section={section as StatsSection} onUpdate={onUpdate as (data: Partial<StatsSection>) => void} />;
    case 'team':
      return <TeamEditor section={section as TeamSection} onUpdate={onUpdate as (data: Partial<TeamSection>) => void} />;
    case 'footer':
      return <FooterEditor section={section as FooterSection} onUpdate={onUpdate as (data: Partial<FooterSection>) => void} />;
    default:
      return <p className="text-muted-foreground">Editor no disponible para este tipo de sección.</p>;
  }
}

// ═══════════════════════════════════════════════════════════════
// Add Section Popover
// ═══════════════════════════════════════════════════════════════

function AddSectionPopover({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    const groups: Record<string, SectionType[]> = {};
    for (const [key, meta] of Object.entries(SECTION_META)) {
      if (!groups[meta.category]) groups[meta.category] = [];
      groups[meta.category].push(key as SectionType);
    }
    return groups;
  }, []);

  const handleSelect = (type: SectionType) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between gap-2">
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir Sección
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar sección..." />
          <CommandList>
            <CommandEmpty>No se encontró ninguna sección.</CommandEmpty>
            {Object.entries(grouped).map(([category, types]) => (
              <CommandGroup key={category} heading={category}>
                {types.map((type) => {
                  const meta = SECTION_META[type] || { label: type, icon: 'LayoutList', description: '', category: 'Otro' };
                  return (
                    <CommandItem
                      key={type}
                      value={meta.label}
                      onSelect={() => handleSelect(type)}
                    >
                      <SectionIcon name={meta.icon} className="h-4 w-4 mr-2" />
                      <span className="flex-1">{meta.label}</span>
                      <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 h-4', CATEGORY_COLORS[meta.category] || '')}>
                        {meta.category}
                      </Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main PageEditor Component
// ═══════════════════════════════════════════════════════════════

export function PageEditor() {
  const {
    currentPage,
    updatePage,
    addSection,
    removeSection,
    moveSection,
    updateSection,
    toggleSection,
    duplicateSection,
  } = useBuilderStore();

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const selectedSection = useMemo(
    () => currentPage?.sections.find((s) => s.id === selectedSectionId) ?? null,
    [currentPage, selectedSectionId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      if (!currentPage) return;

      const oldIndex = currentPage.sections.findIndex((s) => s.id === active.id);
      const newIndex = currentPage.sections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveSection(oldIndex, newIndex);
      }
    },
    [currentPage, moveSection],
  );

  const handleAddSection = useCallback(
    (type: SectionType) => {
      addSection(type);
      toast.success(`Sección "${SECTION_META[type]?.label || type}" añadida`);
    },
    [addSection],
  );

  const handleRemoveSection = useCallback(
    (id: string) => {
      const section = currentPage?.sections.find((s) => s.id === id);
      if (!section) return;
      removeSection(id);
      if (selectedSectionId === id) setSelectedSectionId(null);
      toast.success(`Sección "${SECTION_META[section.type]?.label || section.type}" eliminada`);
    },
    [currentPage, removeSection, selectedSectionId],
  );

  const handleDuplicateSection = useCallback(
    (id: string) => {
      const section = currentPage?.sections.find((s) => s.id === id);
      if (!section) return;
      duplicateSection(id);
      toast.success(`Sección "${SECTION_META[section.type]?.label || section.type}" duplicada`);
    },
    [currentPage, duplicateSection],
  );

  const handleToggleSection = useCallback(
    (id: string) => {
      const section = currentPage?.sections.find((s) => s.id === id);
      if (!section) return;
      toggleSection(id);
      toast.success(`Sección "${SECTION_META[section.type]?.label || section.type}" ${section.enabled ? 'desactivada' : 'activada'}`);
    },
    [currentPage, toggleSection],
  );

  const handleUpdateSection = useCallback(
    (id: string, data: Partial<PageSection>) => {
      updateSection(id, data);
    },
    [updateSection],
  );

  const handleUpdatePageName = useCallback(
    (name: string) => {
      if (!currentPage) return;
      updatePage(currentPage.id, { name });
    },
    [currentPage, updatePage],
  );

  if (!currentPage) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LayoutList className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Sin página seleccionada</h2>
          <p className="text-sm text-muted-foreground">Selecciona o crea una página para comenzar a editar.</p>
        </div>
      </div>
    );
  }

  const templateMeta = TEMPLATE_META[currentPage.template];

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border bg-background overflow-hidden">
      {/* ─── LEFT PANEL: Section List ─── */}
      <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
        <div className="flex h-full flex-col bg-white">
          {/* Header */}
          <div className="border-b p-4 space-y-3">
            <div className="space-y-1.5">
              <Input
                value={currentPage.name}
                onChange={(e) => handleUpdatePageName(e.target.value)}
                className="text-base font-semibold h-9 border-0 px-0 shadow-none focus-visible:ring-0 rounded-none border-b border-transparent focus-visible:border-b-2 focus-visible:border-emerald-500 bg-transparent"
                placeholder="Nombre de la página"
              />
              <div className="flex items-center gap-2">
                {templateMeta && (
                  <Badge variant="secondary" className="text-xs font-normal" style={{ backgroundColor: templateMeta.color + '15', color: templateMeta.color }}>
                    {templateMeta.label}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {currentPage.sections.length} secciones
                </span>
              </div>
            </div>

            <AddSectionPopover onAdd={handleAddSection} />
          </div>

          {/* Sections List */}
          <ScrollArea className="flex-1 px-3 py-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={currentPage.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5 pb-4">
                  {currentPage.sections.map((section) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      isSelected={selectedSectionId === section.id}
                      onSelect={() => setSelectedSectionId(section.id === selectedSectionId ? null : section.id)}
                      onToggle={() => handleToggleSection(section.id)}
                      onDelete={() => handleRemoveSection(section.id)}
                      onDuplicate={() => handleDuplicateSection(section.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {currentPage.sections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Sin secciones</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Usa el botón de arriba para añadir tu primera sección
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </ResizablePanel>

      {/* ─── Resize Handle ─── */}
      <ResizableHandle withHandle />

      {/* ─── RIGHT PANEL: Section Editor ─── */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="flex h-full flex-col bg-white">
          {selectedSection ? (
            <ScrollArea className="flex-1">
              <div className="p-6">
                {/* Editor Header with section type badge */}
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const meta = SECTION_META[selectedSection.type] || { label: selectedSection.type, icon: 'LayoutList', description: '' };
                    return (
                      <>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <SectionIcon name={meta.icon} className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold">{meta.label}</h2>
                          <p className="text-xs text-muted-foreground">{meta.description}</p>
                        </div>
                        <Badge variant="outline" className={cn('ml-auto text-xs', CATEGORY_COLORS[meta.category])}>
                          {meta.category}
                        </Badge>
                      </>
                    );
                  })()}
                </div>

                <Separator className="mb-5" />

                {/* Section-specific editor */}
                <SectionEditorRouter
                  section={selectedSection}
                  onUpdate={(data) => handleUpdateSection(selectedSection.id, data)}
                />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-3 max-w-xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <LayoutList className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Selecciona una sección para editar</h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic en una sección del panel izquierdo para ver y editar sus propiedades aquí.
                </p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
