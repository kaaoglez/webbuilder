'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  LayoutGrid,
  Layers,
  X,
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
  Code2,
  Columns3,
  Type,
  Heading,
  Image as LucideImage,
  Video,
  ArrowUpDown,
  MousePointerClick,
  FileCode,
  Minus,
  Save,
  Download,
  Loader2,
  LayoutList,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjectsStore } from '@/lib/projects-store';
import { useSettingsStore } from '@/lib/settings-store';

import { cn } from '@/lib/utils';
import { useThemeEditorStore, type ThemePage } from '@/lib/theme-editor-store';
import type { ThemeSection } from '@/lib/wp-theme-generator';
import { useMediaPicker } from '@/components/pageforge/MediaLibrary';
import { EmojiPicker } from '@/components/pageforge/EmojiPicker';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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

// ─────────────────────────────────────────────────────────────
// Local Section Type & Defaults (will be exported from store later)
// ─────────────────────────────────────────────────────────────

type SectionType = ThemeSection['type'];

const SECTION_TYPES: SectionType[] = [
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
  'custom',
];

const SECTION_DEFAULT_DATA: Record<SectionType, Record<string, unknown>> = {
  hero: {
    title: 'Encabezado',
    subtitle: '',
    ctaText: '',
    ctaLink: '#',
    secondaryCtaText: '',
    secondaryCtaLink: '#',
    backgroundImage: '',
    overlayOpacity: 0.5,
  },
  about: {
    title: 'Sobre Nosotros',
    subtitle: '',
    image: '',
    stats: [],
  },
  services: {
    title: 'Servicios',
    subtitle: '',
    items: [{ icon: '⚡', title: 'Service 1', description: '' }],
    columns: 3,
  },
  features: {
    title: 'Características',
    subtitle: '',
    items: [{ icon: '✦', title: 'Feature 1', description: '' }],
    columns: 3,
  },
  testimonials: {
    title: 'Testimonios',
    subtitle: '',
    testimonials: [{ quote: '', name: '', role: '', rating: 5 }],
  },
  pricing: {
    title: 'Precios',
    subtitle: '',
    plans: [{ name: 'Básico', price: '$0', period: '/mes', features: [], highlighted: false, ctaText: 'Comenzar' }],
  },
  cta: {
    title: 'Llamada a la Acción',
    subtitle: '',
    ctaText: 'Comenzar',
    ctaLink: '#contacto',
  },
  contact: {
    title: 'Contacto',
    subtitle: '',
    email: '',
    phone: '',
    address: '',
    showForm: false,
  },
  gallery: {
    title: 'Galería',
    subtitle: '',
    images: [],
    columns: 3,
  },
  faq: {
    title: 'Preguntas Frecuentes',
    subtitle: '',
    items: [{ question: '', answer: '' }],
  },
  stats: {
    title: 'Estadísticas',
    items: [{ icon: '📊', value: '0', label: '' }],
  },
  team: {
    title: 'Equipo',
    members: [{ name: '', role: '', bio: '', avatar: '', socials: [] }],
  },
  blog_posts: {
    title: 'Últimos Artículos',
    subtitle: '',
  },
  custom: {
    mode: 'visual',
    rows: [],
    customHtml: '',
    customCss: '',
  },
};

const SECTION_TITLES: Record<SectionType, string> = {
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
  blog_posts: 'Últimos Artículos',
  custom: 'Sección Personalizada',
};

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
  custom: <Code2 className="h-4 w-4" />,
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
  custom: 'Personalizada',
};

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createDefaultSection(type: SectionType): ThemeSection {
  return {
    type,
    enabled: true,
    title: SECTION_TITLES[type],
    data: JSON.parse(JSON.stringify(SECTION_DEFAULT_DATA[type])),
  };
}

// ─────────────────────────────────────────────────────────────
// Shared Sub-components
// ─────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
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
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <Card className="border border-gray-300 bg-white">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        {title && <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>}
        {!title && <div />}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", confirmRemove ? "text-red-600" : "text-gray-500 hover:text-red-500")}
            onClick={() => {
              if (confirmRemove) {
                onRemove();
                setConfirmRemove(false);
              } else {
                setConfirmRemove(true);
                setTimeout(() => setConfirmRemove(false), 3000);
              }
            }}
            title={confirmRemove ? "Click para confirmar" : "Eliminar"}
          >
            {confirmRemove ? <Check className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">{children}</CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Page-Specific Section Config Panels
// ─────────────────────────────────────────────────────────────

interface PageSectionConfigProps {
  section: ThemeSection;
  sectionIndex: number;
  pageId: string;
}

function PageHeroConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Título principal del encabezado"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Subtítulo del encabezado"
        />
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Texto del botón principal">
          <Input
            value={(d.ctaText as string) || ''}
            onChange={(e) => updateData({ ctaText: e.target.value })}
            placeholder="Comenzar Ahora"
          />
        </FormField>
        <FormField label="Enlace del botón principal">
          <Input
            value={(d.ctaLink as string) || ''}
            onChange={(e) => updateData({ ctaLink: e.target.value })}
            placeholder="#contacto"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Texto del botón secundario">
          <Input
            value={(d.secondaryCtaText as string) || ''}
            onChange={(e) => updateData({ secondaryCtaText: e.target.value })}
            placeholder="Saber Más"
          />
        </FormField>
        <FormField label="Enlace del botón secundario">
          <Input
            value={(d.secondaryCtaLink as string) || ''}
            onChange={(e) => updateData({ secondaryCtaLink: e.target.value })}
            placeholder="#servicios"
          />
        </FormField>
      </div>
      <FormField label="URL de Imagen de Fondo">
        <Input
          value={(d.backgroundImage as string) || ''}
          onChange={(e) => updateData({ backgroundImage: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </FormField>
      <FormField label={`Intensidad del fondo: ${((d.overlayOpacity as number) ?? 0.5).toFixed(2)}`}>
        <Slider
          value={[(d.overlayOpacity as number) ?? 0.5]}
          onValueChange={([v]) => updateData({ overlayOpacity: v })}
          min={0}
          max={1}
          step={0.05}
        />
      </FormField>
    </div>
  );
}

function PageAboutConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const stats = (d.stats as Array<{ value: string; label: string }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateStats = (newStats: Array<{ value: string; label: string }>) => {
    updateData({ stats: newStats });
  };

  const addStat = () => updateStats([...stats, { value: '', label: '' }]);
  const removeStat = (i: number) => updateStats(stats.filter((_, idx) => idx !== i));
  const updateStat = (i: number, field: 'value' | 'label', val: string) => {
    const updated = stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s));
    updateStats(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Sobre Nosotros"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Subtítulo"
        />
      </FormField>
      <FormField label="URL de Imagen">
        <Input
          value={(d.image as string) || ''}
          onChange={(e) => updateData({ image: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </FormField>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Estadísticas</Label>
          <Button size="sm" variant="outline" onClick={addStat} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {stats.map((stat, i) => (
            <RepeatableCard key={i} title={`Estadística ${i + 1}`} onRemove={() => removeStat(i)}>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageServicesFeaturesConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ icon: string; title: string; description: string }>) || [];
  const columns = (d.columns as number) || 3;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateItems = (newItems: Array<{ icon: string; title: string; description: string }>) => {
    updateData({ items: newItems });
  };

  const addItem = () => updateItems([...items, { icon: '✦', title: '', description: '' }]);
  const removeItem = (i: number) => updateItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: 'icon' | 'title' | 'description', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Servicios"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Subtítulo"
        />
      </FormField>
      <FormField label="Columnas">
        <Select value={String(columns)} onValueChange={(v) => updateData({ columns: Number(v) })}>
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
        <div className="max-h-96 overflow-y-auto space-y-3">
          {items.map((item, i) => (
            <RepeatableCard key={i} title={`Elemento ${i + 1}`} onRemove={() => removeItem(i)}>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageTestimonialsConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const testimonials = (d.testimonials as Array<{ quote: string; name: string; role: string; rating: number }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateTestimonials = (newT: Array<{ quote: string; name: string; role: string; rating: number }>) => {
    updateData({ testimonials: newT });
  };

  const addTestimonial = () => updateTestimonials([...testimonials, { quote: '', name: '', role: '', rating: 5 }]);
  const removeTestimonial = (i: number) => updateTestimonials(testimonials.filter((_, idx) => idx !== i));
  const updateTestimonial = (i: number, field: 'quote' | 'name' | 'role' | 'rating', val: string | number) => {
    const updated = testimonials.map((t, idx) => (idx === i ? { ...t, [field]: val } : t));
    updateTestimonials(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Testimonios"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Lo que dicen nuestros clientes"
        />
      </FormField>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Testimonios</Label>
          <Button size="sm" variant="outline" onClick={addTestimonial} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {testimonials.map((t, i) => (
            <RepeatableCard key={i} title={`Testimonio ${i + 1}`} onRemove={() => removeTestimonial(i)}>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PagePricingConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const plans = (d.plans as Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted: boolean;
    ctaText: string;
  }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updatePlans = (newPlans: typeof plans) => {
    updateData({ plans: newPlans });
  };

  const addPlan = () =>
    updatePlans([...plans, { name: '', price: '$0', period: '/mes', features: [], highlighted: false, ctaText: 'Comenzar' }]);
  const removePlan = (i: number) => updatePlans(plans.filter((_, idx) => idx !== i));
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
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Precios"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Elige tu plan ideal"
        />
      </FormField>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Planes</Label>
          <Button size="sm" variant="outline" onClick={addPlan} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {plans.map((plan, i) => (
            <RepeatableCard key={i} title={`Plan ${i + 1}`} onRemove={() => removePlan(i)}>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/mes">/mes</SelectItem>
                      <SelectItem value="/año">/año</SelectItem>
                      <SelectItem value="/semana">/semana</SelectItem>
                      <SelectItem value="/día">/día</SelectItem>
                      <SelectItem value="/único">/único</SelectItem>
                      <SelectItem value="">Sin período</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Texto del botón">
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageCTAConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Llamada a la Acción"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Subtítulo"
        />
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Texto del botón">
          <Input
            value={(d.ctaText as string) || ''}
            onChange={(e) => updateData({ ctaText: e.target.value })}
            placeholder="Comenzar Ahora"
          />
        </FormField>
        <FormField label="Enlace del botón">
          <Input
            value={(d.ctaLink as string) || ''}
            onChange={(e) => updateData({ ctaLink: e.target.value })}
            placeholder="#contacto"
          />
        </FormField>
      </div>
    </div>
  );
}

function PageContactConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Contáctanos"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Estamos para ayudarte"
        />
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email">
          <Input
            value={(d.email as string) || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="info@ejemplo.com"
          />
        </FormField>
        <FormField label="Teléfono">
          <Input
            value={(d.phone as string) || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+1 234 567 890"
          />
        </FormField>
      </div>
      <FormField label="Dirección">
        <Input
          value={(d.address as string) || ''}
          onChange={(e) => updateData({ address: e.target.value })}
          placeholder="Calle Principal 123, Ciudad"
        />
      </FormField>
      <div className="flex items-center gap-2">
        <Switch
          checked={(d.showForm as boolean) || false}
          onCheckedChange={(v) => updateData({ showForm: v })}
        />
        <Label className="text-sm">Mostrar formulario de contacto</Label>
      </div>
    </div>
  );
}

function PageGalleryConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const images = (d.images as Array<{ src: string; alt: string; caption: string }>) || [];
  const columns = (d.columns as number) || 3;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateImages = (newImages: typeof images) => {
    updateData({ images: newImages });
  };

  const addImage = () => updateImages([...images, { src: '', alt: '', caption: '' }]);
  const removeImage = (i: number) => updateImages(images.filter((_, idx) => idx !== i));
  const updateImage = (i: number, field: 'src' | 'alt' | 'caption', val: string) => {
    const updated = images.map((img, idx) => (idx === i ? { ...img, [field]: val } : img));
    updateImages(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Galería"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Nuestro trabajo"
        />
      </FormField>
      <FormField label="Columnas">
        <Select value={String(columns)} onValueChange={(v) => updateData({ columns: Number(v) })}>
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
        <div className="max-h-96 overflow-y-auto space-y-3">
          {images.map((img, i) => (
            <RepeatableCard key={i} title={`Imagen ${i + 1}`} onRemove={() => removeImage(i)}>
              <FormField label="URL de Imagen">
                <Input
                  value={img.src}
                  onChange={(e) => updateImage(i, 'src', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </FormField>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageFAQConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ question: string; answer: string }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateItems = (newItems: typeof items) => {
    updateData({ items: newItems });
  };

  const addItem = () => updateItems([...items, { question: '', answer: '' }]);
  const removeItem = (i: number) => updateItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: 'question' | 'answer', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Preguntas Frecuentes"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Todo lo que necesitas saber"
        />
      </FormField>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Preguntas</Label>
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {items.map((item, i) => (
            <RepeatableCard key={i} title={`Pregunta ${i + 1}`} onRemove={() => removeItem(i)}>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageStatsConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const items = (d.items as Array<{ icon: string; value: string; label: string }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateItems = (newItems: typeof items) => {
    updateData({ items: newItems });
  };

  const addItem = () => updateItems([...items, { icon: '📊', value: '0', label: '' }]);
  const removeItem = (i: number) => updateItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: 'icon' | 'value' | 'label', val: string) => {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
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
        <div className="max-h-96 overflow-y-auto space-y-3">
          {items.map((item, i) => (
            <RepeatableCard key={i} title={`Estadística ${i + 1}`} onRemove={() => removeItem(i)}>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageTeamConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;
  const members = (d.members as Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
    socials: Array<{ platform: string; url: string }>;
  }>) || [];

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  const updateMembers = (newMembers: typeof members) => {
    updateData({ members: newMembers });
  };

  const addMember = () => updateMembers([...members, { name: '', role: '', bio: '', avatar: '', socials: [] }]);
  const removeMember = (i: number) => updateMembers(members.filter((_, idx) => idx !== i));
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
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
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
        <div className="max-h-96 overflow-y-auto space-y-3">
          {members.map((member, i) => (
            <RepeatableCard key={i} title={`Miembro ${i + 1}`} onRemove={() => removeMember(i)}>
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
              <FormField label="URL de Avatar">
                <Input
                  value={member.avatar}
                  onChange={(e) => updateMember(i, 'avatar', e.target.value)}
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </FormField>
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
            </RepeatableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageBlogPostsConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();
  const d = section.data;

  const updateSection = (partial: Partial<ThemeSection>) =>
    store.updatePageSection(pageId, sectionIndex, partial);

  const updateData = (dataPartial: Record<string, unknown>) =>
    store.updatePageSectionData(pageId, sectionIndex, dataPartial);

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => updateSection({ title: e.target.value })}
          placeholder="Últimas Publicaciones"
        />
      </FormField>
      <FormField label="Subtítulo">
        <Input
          value={(d.subtitle as string) || ''}
          onChange={(e) => updateData({ subtitle: e.target.value })}
          placeholder="Nuestro blog"
        />
      </FormField>
      <p className="text-sm text-gray-500">
        Las publicaciones del blog se mostrarán automáticamente desde WordPress. No se requiere configuración adicional.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom Section – Types & Helpers
// ─────────────────────────────────────────────────────────────

interface CustomBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'video' | 'spacer' | 'button' | 'html' | 'divider';
  enabled: boolean;
  content?: string;
  headingTag?: string;
  headingClass?: string;
  src?: string;
  alt?: string;
  imageClass?: string;
  height?: string;
  link?: string;
  buttonStyle?: string;
}

interface CustomColumn {
  id: string;
  width: string;
  blocks: CustomBlock[];
}

interface CustomRow {
  id: string;
  columnCount: number;
  verticalAlign: 'start' | 'center' | 'end' | 'stretch';
  gap: string;
  columns: CustomColumn[];
}

const BLOCK_TYPE_OPTIONS: { value: CustomBlock['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'text', label: 'Texto', icon: <Type className="h-3.5 w-3.5" /> },
  { value: 'heading', label: 'Título', icon: <Heading className="h-3.5 w-3.5" /> },
  { value: 'image', label: 'Imagen', icon: <LucideImage className="h-3.5 w-3.5" /> },
  { value: 'video', label: 'Video', icon: <Video className="h-3.5 w-3.5" /> },
  { value: 'spacer', label: 'Espaciador', icon: <ArrowUpDown className="h-3.5 w-3.5" /> },
  { value: 'button', label: 'Botón', icon: <MousePointerClick className="h-3.5 w-3.5" /> },
  { value: 'html', label: 'HTML', icon: <FileCode className="h-3.5 w-3.5" /> },
  { value: 'divider', label: 'Separador', icon: <Minus className="h-3.5 w-3.5" /> },
];

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function makeEmptyColumn(): CustomColumn {
  return { id: uid(), width: '', blocks: [] };
}

function makeEmptyRow(columnCount = 2): CustomRow {
  return {
    id: uid(),
    columnCount,
    verticalAlign: 'stretch',
    gap: '24px',
    columns: Array.from({ length: columnCount }, () => makeEmptyColumn()),
  };
}

function syncColumns(row: CustomRow, newCount: number): CustomRow {
  const current = row.columns.length;
  if (newCount > current) {
    const extra = Array.from({ length: newCount - current }, () => makeEmptyColumn());
    return { ...row, columnCount: newCount, columns: [...row.columns, ...extra] };
  }
  if (newCount < current) {
    const trimmed = row.columns.slice(0, newCount);
    return { ...row, columnCount: newCount, columns: trimmed };
  }
  return { ...row, columnCount: newCount };
}

// ─────────────────────────────────────────────────────────────
// ImagePickerField – URL input + Media Library button
// ─────────────────────────────────────────────────────────────

function ImagePickerField({
  value,
  alt,
  imageClass,
  onChangeSrc,
  onChangeAlt,
  onChangeClass,
}: {
  value: string;
  alt: string;
  imageClass: string;
  onChangeSrc: (v: string) => void;
  onChangeAlt: (v: string) => void;
  onChangeClass: (v: string) => void;
}) {
  const { pickImage, MediaLibraryDialog } = useMediaPicker();

  const handlePick = async () => {
    const url = await pickImage();
    if (url) onChangeSrc(url);
  };

  return (
    <>
      <FormField label="URL de la imagen">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChangeSrc(e.target.value)}
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
            <img
              src={value}
              alt="Preview"
              className="h-16 w-auto max-w-full object-contain rounded cursor-pointer"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-xs text-gray-500 shrink-0">Vista previa</span>
          </div>
        )}
      </FormField>
      <FormField label="Texto alternativo">
        <Input
          value={alt}
          onChange={(e) => onChangeAlt(e.target.value)}
          placeholder="Descripción de la imagen"
        />
      </FormField>
      <FormField label="Clase personalizada">
        <Input
          value={imageClass}
          onChange={(e) => onChangeClass(e.target.value)}
          placeholder="img-fluid rounded"
        />
        <p className="text-xs text-gray-400">(avanzado)</p>
      </FormField>
      <MediaLibraryDialog />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CustomBlockCard – extracted to satisfy rules-of-hooks
// ─────────────────────────────────────────────────────────────

function CustomBlockCard({
  block,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  renderConfig,
}: {
  block: CustomBlock;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  renderConfig: () => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const typeInfo = BLOCK_TYPE_OPTIONS.find((o) => o.value === block.type);

  return (
    <Card className="border border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="text-emerald-600 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              !expanded && '-rotate-90',
            )}
          />
        </button>
        <span className="text-xs font-medium text-gray-600 flex-1 truncate flex items-center gap-1.5">
          {typeInfo?.icon}
          {typeInfo?.label}
        </span>
        {!isFirst && (
          <button
            type="button"
            className="p-0.5 text-gray-400 hover:text-emerald-600"
            onClick={onMoveUp}
            title="Mover arriba"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            className="p-0.5 text-gray-400 hover:text-emerald-600"
            onClick={onMoveDown}
            title="Mover abajo"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        )}
        <button
          type="button"
          className="p-0.5 text-gray-400 hover:text-red-500"
          onClick={onRemove}
          title="Eliminar bloque"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {expanded && (
        <CardContent className="px-3 pb-3 pt-0 space-y-2">
          {renderConfig()}
        </CardContent>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// CustomSectionEditor Component
// ─────────────────────────────────────────────────────────────

function CustomSectionEditor({
  sectionData,
  onChange,
}: {
  sectionData: Record<string, unknown>;
  onChange: (newData: Record<string, unknown>) => void;
}) {
  const [mode, setMode] = useState<'visual' | 'code'>(
    (sectionData.mode as string) === 'code' ? 'code' : 'visual',
  );
  const [codeTab, setCodeTab] = useState<'html' | 'css'>('html');

  // Visual mode state
  const rows = (sectionData.rows as CustomRow[]) || [];

  const update = (partial: Record<string, unknown>) => {
    onChange({ ...sectionData, ...partial });
  };

  const handleModeSwitch = (m: 'visual' | 'code') => {
    setMode(m);
    update({ mode: m });
  };

  // ── Row operations ──
  const addRow = () => {
    update({ rows: [...rows, makeEmptyRow(2)] });
  };

  const removeRow = (ri: number) => {
    update({ rows: rows.filter((_, i) => i !== ri) });
  };

  const updateRow = (ri: number, partial: Partial<CustomRow>) => {
    const updated = rows.map((r, i) => (i === ri ? { ...r, ...partial } : r));
    update({ rows: updated });
  };

  const changeColumnCount = (ri: number, count: number) => {
    const updated = rows.map((r, i) => (i === ri ? syncColumns(r, count) : r));
    update({ rows: updated });
  };

  // ── Block operations ──
  const addBlock = (ri: number, ci: number, type: CustomBlock['type']) => {
    const newBlock: CustomBlock = { id: uid(), type, enabled: true };
    if (type === 'heading') { newBlock.headingTag = 'h2'; newBlock.content = ''; }
    if (type === 'spacer') { newBlock.height = '32px'; }
    if (type === 'button') { newBlock.content = ''; newBlock.link = '#'; newBlock.buttonStyle = 'primary'; }

    const updated = rows.map((r, i) => {
      if (i !== ri) return r;
      const cols = r.columns.map((c, j) => (j === ci ? { ...c, blocks: [...c.blocks, newBlock] } : c));
      return { ...r, columns: cols };
    });
    update({ rows: updated });
  };

  const removeBlock = (ri: number, ci: number, bi: number) => {
    const updated = rows.map((r, i) => {
      if (i !== ri) return r;
      const cols = r.columns.map((c, j) => (j === ci ? { ...c, blocks: c.blocks.filter((_, k) => k !== bi) } : c));
      return { ...r, columns: cols };
    });
    update({ rows: updated });
  };

  const moveBlock = (ri: number, ci: number, bi: number, dir: -1 | 1) => {
    const updated = rows.map((r, i) => {
      if (i !== ri) return r;
      const cols = r.columns.map((c, j) => {
        if (j !== ci) return c;
        const blocks = [...c.blocks];
        const target = bi + dir;
        if (target < 0 || target >= blocks.length) return c;
        [blocks[bi], blocks[target]] = [blocks[target], blocks[bi]];
        return { ...c, blocks };
      });
      return { ...r, columns: cols };
    });
    update({ rows: updated });
  };

  const updateBlock = (ri: number, ci: number, bi: number, partial: Partial<CustomBlock>) => {
    const updated = rows.map((r, i) => {
      if (i !== ri) return r;
      const cols = r.columns.map((c, j) => {
        if (j !== ci) return c;
        const blocks = c.blocks.map((b, k) => (k === bi ? { ...b, ...partial } : b));
        return { ...c, blocks };
      });
      return { ...r, columns: cols };
    });
    update({ rows: updated });
  };

  const removeColumn = (ri: number, ci: number) => {
    const updated = rows.map((r, i) => {
      if (i !== ri) return r;
      const cols = r.columns.filter((_, j) => j !== ci);
      return { ...r, columnCount: cols.length, columns: cols };
    });
    update({ rows: updated });
  };

  // ── Block config renderer ──
  const renderBlockConfig = (block: CustomBlock, ri: number, ci: number, bi: number) => {
    switch (block.type) {
      case 'text':
        return (
          <FormField label="Contenido">
            <Textarea
              value={block.content || ''}
              onChange={(e) => updateBlock(ri, ci, bi, { content: e.target.value })}
              placeholder="Escribe el texto aquí..."
              rows={4}
            />
          </FormField>
        );
      case 'heading':
        return (
          <div className="space-y-3">
            <FormField label="Etiqueta">
              <Select value={block.headingTag || 'h2'} onValueChange={(v) => updateBlock(ri, ci, bi, { headingTag: v })}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((t) => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Texto">
              <Input
                value={block.content || ''}
                onChange={(e) => updateBlock(ri, ci, bi, { content: e.target.value })}
                placeholder="Título"
              />
            </FormField>
            <FormField label="Clase personalizada">
              <Input
                value={block.headingClass || ''}
                onChange={(e) => updateBlock(ri, ci, bi, { headingClass: e.target.value })}
                placeholder="clase-opcional"
              />
              <p className="text-xs text-gray-400">(avanzado)</p>
            </FormField>
          </div>
        );
      case 'image':
        return (
          <ImagePickerField
            value={block.src || ''}
            alt={block.alt || ''}
            imageClass={block.imageClass || ''}
            onChangeSrc={(v) => updateBlock(ri, ci, bi, { src: v })}
            onChangeAlt={(v) => updateBlock(ri, ci, bi, { alt: v })}
            onChangeClass={(v) => updateBlock(ri, ci, bi, { imageClass: v })}
          />
        );
      case 'video':
        return (
          <FormField label="URL del Video (YouTube/Vimeo embed)">
            <Input
              value={block.src || ''}
              onChange={(e) => updateBlock(ri, ci, bi, { src: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
          </FormField>
        );
      case 'spacer':
        return (
          <FormField label={`Altura: ${block.height || '32px'}`}>
            <Slider
              value={[parseInt(block.height || '32', 10) || 32]}
              onValueChange={([v]) => updateBlock(ri, ci, bi, { height: `${v}px` })}
              min={8}
              max={200}
              step={4}
            />
          </FormField>
        );
      case 'button':
        return (
          <div className="space-y-3">
            <FormField label="Texto del botón">
              <Input
                value={block.content || ''}
                onChange={(e) => updateBlock(ri, ci, bi, { content: e.target.value })}
                placeholder="Clic aquí"
              />
            </FormField>
            <FormField label="Enlace">
              <Input
                value={block.link || ''}
                onChange={(e) => updateBlock(ri, ci, bi, { link: e.target.value })}
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Estilo">
              <Select value={block.buttonStyle || 'primary'} onValueChange={(v) => updateBlock(ri, ci, bi, { buttonStyle: v })}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primario</SelectItem>
                  <SelectItem value="secondary">Secundario</SelectItem>
                  <SelectItem value="outline">Contorno</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        );
      case 'html':
        return (
          <FormField label="Código HTML">
            <textarea
              value={block.content || ''}
              onChange={(e) => updateBlock(ri, ci, bi, { content: e.target.value })}
              placeholder="<div>HTML personalizado...</div>"
              className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </FormField>
        );
      case 'divider':
        return (
          <p className="text-xs text-gray-400 italic">Separador horizontal — sin configuración adicional.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">Modo:</span>
        <Button
          size="sm"
          variant={mode === 'visual' ? 'default' : 'outline'}
          onClick={() => handleModeSwitch('visual')}
          className={cn(
            'h-8 text-xs',
            mode === 'visual' && 'bg-emerald-600 hover:bg-emerald-700 text-white',
          )}
        >
          <Columns3 className="h-3.5 w-3.5 mr-1" />
          Visual
        </Button>
        <Button
          size="sm"
          variant={mode === 'code' ? 'default' : 'outline'}
          onClick={() => handleModeSwitch('code')}
          className={cn(
            'h-8 text-xs',
            mode === 'code' && 'bg-emerald-600 hover:bg-emerald-700 text-white',
          )}
        >
          <Code2 className="h-3.5 w-3.5 mr-1" />
          Código
        </Button>
      </div>

      {/* ── CODE MODE ── */}
      {mode === 'code' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={codeTab === 'html' ? 'default' : 'outline'}
              onClick={() => setCodeTab('html')}
              className={cn(
                'h-7 text-xs',
                codeTab === 'html' && 'bg-emerald-600 hover:bg-emerald-700 text-white',
              )}
            >
              HTML
            </Button>
            <Button
              size="sm"
              variant={codeTab === 'css' ? 'default' : 'outline'}
              onClick={() => setCodeTab('css')}
              className={cn(
                'h-7 text-xs',
                codeTab === 'css' && 'bg-emerald-600 hover:bg-emerald-700 text-white',
              )}
            >
              CSS
            </Button>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            El contenido aquí se insertará directamente en la sección. Escribe HTML puro o PHP.
          </p>
          {codeTab === 'html' ? (
            <textarea
              value={(sectionData.customHtml as string) || ''}
              onChange={(e) => update({ customHtml: e.target.value })}
              placeholder="<div class=&quot;custom-section&quot;>&#10;  <!-- Tu HTML aquí -->&#10;</div>"
              className="w-full min-h-[280px] rounded-lg border border-gray-300 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          ) : (
            <textarea
              value={(sectionData.customCss as string) || ''}
              onChange={(e) => update({ customCss: e.target.value })}
              placeholder=".custom-section {&#10;  /* Tu CSS aquí */&#10;}"
              className="w-full min-h-[280px] rounded-lg border border-gray-300 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          )}
        </div>
      )}

      {/* ── VISUAL MODE ── */}
      {mode === 'visual' && (
        <div className="space-y-4">
          {rows.length === 0 && (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <Columns3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No hay filas. Agrega una fila para comenzar.</p>
            </div>
          )}

          {rows.map((row, ri) => (
            <Card key={row.id} className="border border-gray-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {ri + 1}
                  </span>
                  Fila {ri + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-red-500"
                  onClick={() => removeRow(ri)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-3">
                {/* Column count */}
                <div className="flex flex-wrap items-center gap-2">
                  <Label className="text-xs text-gray-500 shrink-0">Columnas:</Label>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => changeColumnCount(ri, n)}
                      className={cn(
                        'w-7 h-7 rounded text-xs font-medium transition-colors',
                        row.columnCount === n
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* Vertical align */}
                <div className="flex flex-wrap items-center gap-2">
                  <Label className="text-xs text-gray-500 shrink-0">Alineación V:</Label>
                  {(['start', 'center', 'end', 'stretch'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateRow(ri, { verticalAlign: v })}
                      className={cn(
                        'px-2.5 h-7 rounded text-xs font-medium transition-colors capitalize',
                        row.verticalAlign === v
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                {/* Gap */}
                <div className="flex flex-wrap items-center gap-2">
                  <Label className="text-xs text-gray-500 shrink-0">Gap:</Label>
                  {['0px', '8px', '16px', '24px', '32px', '48px'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateRow(ri, { gap: g })}
                      className={cn(
                        'px-2.5 h-7 rounded text-xs font-medium transition-colors',
                        row.gap === g
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <Separator />

                {/* Columns */}
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${row.columnCount}, 1fr)` }}>
                  {row.columns.map((col, ci) => (
                    <div
                      key={col.id}
                      className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Col {ci + 1}</span>
                        {row.columnCount > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={() => removeColumn(ri, ci)}
                            title="Eliminar columna"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Add block button */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-xs border-dashed border-gray-400 text-gray-500 hover:text-emerald-600 hover:border-emerald-400"
                          onClick={() => {
                            const el = document.getElementById(`block-menu-${ri}-${ci}`);
                            if (el) el.classList.toggle('hidden');
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Bloque
                        </Button>

                        {/* Block type dropdown */}
                        <div
                          id={`block-menu-${ri}-${ci}`}
                          className="hidden absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 space-y-0.5"
                        >
                          {BLOCK_TYPE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                              onClick={() => {
                                addBlock(ri, ci, opt.value);
                                const el = document.getElementById(`block-menu-${ri}-${ci}`);
                                if (el) el.classList.add('hidden');
                              }}
                            >
                              {opt.icon}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Blocks */}
                      <div className="space-y-2">
                        {col.blocks.map((block, bi) => (
                          <CustomBlockCard
                            key={block.id}
                            block={block}
                            isFirst={bi === 0}
                            isLast={bi === col.blocks.length - 1}
                            onMoveUp={() => moveBlock(ri, ci, bi, -1)}
                            onMoveDown={() => moveBlock(ri, ci, bi, 1)}
                            onRemove={() => removeBlock(ri, ci, bi)}
                            renderConfig={() => renderBlockConfig(block, ri, ci, bi)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="w-full border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Fila
          </Button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PageCustomConfig – thin wrapper matching PageSectionConfigProps
// ─────────────────────────────────────────────────────────────

function PageCustomConfig({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  const store = useThemeEditorStore();

  const updateData = useCallback(
    (dataPartial: Record<string, unknown>) => {
      store.updatePageSectionData(pageId, sectionIndex, dataPartial);
    },
    [store, pageId, sectionIndex],
  );

  return (
    <div className="space-y-4">
      <FormField label="Título">
        <Input
          value={section.title || ''}
          onChange={(e) => store.updatePageSection(pageId, sectionIndex, { title: e.target.value })}
          placeholder="Sección Personalizada"
        />
      </FormField>
      <CustomSectionEditor sectionData={section.data} onChange={updateData} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Config Router
// ─────────────────────────────────────────────────────────────

function PageSectionConfigPanel({ section, sectionIndex, pageId }: PageSectionConfigProps) {
  switch (section.type) {
    case 'hero':
      return <PageHeroConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'about':
      return <PageAboutConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'services':
    case 'features':
      return <PageServicesFeaturesConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'testimonials':
      return <PageTestimonialsConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'pricing':
      return <PagePricingConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'cta':
      return <PageCTAConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'contact':
      return <PageContactConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'gallery':
      return <PageGalleryConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'faq':
      return <PageFAQConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'stats':
      return <PageStatsConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'team':
      return <PageTeamConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'blog_posts':
      return <PageBlogPostsConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    case 'custom':
      return <PageCustomConfig section={section} sectionIndex={sectionIndex} pageId={pageId} />;
    default:
      return <p className="text-sm text-gray-500">Configuración no disponible para este tipo de sección.</p>;
  }
}

// ─────────────────────────────────────────────────────────────
// Section Type Picker Grid
// ─────────────────────────────────────────────────────────────

function SectionTypePicker({
  pageId,
  onClose,
}: {
  pageId: string;
  onClose: () => void;
}) {
  const { addPageSection } = useThemeEditorStore();

  const handleAdd = useCallback(
    (type: SectionType) => {
      addPageSection(pageId, type);
      onClose();
    },
    [addPageSection, pageId, onClose],
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="border-emerald-300 bg-emerald-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Agregar Sección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {SECTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAdd(type)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-left"
              >
                <span className="text-emerald-600">{SECTION_TYPE_ICON[type]}</span>
                <span className="text-sm font-medium text-gray-700">{SECTION_TYPE_LABEL[type]}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Item Row
// ─────────────────────────────────────────────────────────────

function PageSectionItem({
  section,
  index,
  pageId,
  totalSections,
  isActive,
  onSelect,
}: {
  section: ThemeSection;
  index: number;
  pageId: string;
  totalSections: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { togglePageSection, removePageSection, movePageSection } = useThemeEditorStore();
  const [removeSectionConfirm, setRemoveSectionConfirm] = useState<number | null>(null);

  const handleMoveUp = useCallback(() => {
    if (index > 0) movePageSection(pageId, index, index - 1);
  }, [index, movePageSection, pageId]);

  const handleMoveDown = useCallback(() => {
    if (index < totalSections - 1) movePageSection(pageId, index, index + 1);
  }, [index, totalSections, movePageSection, pageId]);

  const handleToggle = useCallback(() => {
    togglePageSection(pageId, index);
  }, [togglePageSection, pageId, index]);

  const handleRemove = useCallback(() => {
    removePageSection(pageId, index);
  }, [removePageSection, pageId, index]);

  return (
    <div className="space-y-0">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
          isActive
            ? 'border-emerald-400 bg-emerald-50/80 shadow-sm'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
        }`}
        onClick={onSelect}
      >
        <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="shrink-0"
          title={section.enabled ? 'Desactivar sección' : 'Activar sección'}
        >
          {section.enabled ? (
            <Eye className="h-4 w-4 text-emerald-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <span className="text-emerald-600 shrink-0">{SECTION_TYPE_ICON[section.type]}</span>

        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${section.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
            {SECTION_TYPE_LABEL[section.type]}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            #{index + 1}
          </span>
          {!section.enabled && (
            <Badge variant="secondary" className="ml-2 text-xs bg-gray-200 text-gray-500">
              Inactivo
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveUp();
            }}
            disabled={index === 0}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Mover arriba"
          >
            <ChevronUp className="h-4 w-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveDown();
            }}
            disabled={index === totalSections - 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Mover abajo"
          >
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRemoveSectionConfirm(index);
            }}
            className="p-1 rounded hover:bg-red-100 transition-colors"
            title="Eliminar sección"
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-gray-300 bg-gray-50/50">
              <CardContent className="p-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Switch
                    checked={section.enabled}
                    onCheckedChange={() => handleToggle()}
                  />
                  <Label className="text-sm font-medium">
                    {section.enabled ? 'Sección activa' : 'Sección inactiva'}
                  </Label>
                </div>
                <PageSectionConfigPanel
                  section={section}
                  sectionIndex={index}
                  pageId={pageId}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={removeSectionConfirm !== null} onOpenChange={(open) => !open && setRemoveSectionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta sección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la sección y toda su configuración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (removeSectionConfirm !== null) { removePageSection(pageId, removeSectionConfirm); setRemoveSectionConfirm(null); } }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page List View
// ─────────────────────────────────────────────────────────────

function PageListView() {
  const config = useThemeEditorStore((s) => s.config);
  const { addPage, removePage, setActivePageId } = useThemeEditorStore();
  const pages = (config.pages || []) as ThemePage[];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = useCallback(() => {
    const name = newPageName.trim();
    if (!name) return;
    const slug = newPageSlug.trim() || toSlug(name);
    addPage(name, slug);
    setNewPageName('');
    setNewPageSlug('');
    setDialogOpen(false);
  }, [newPageName, newPageSlug, addPage]);

  const handleNameChange = useCallback((val: string) => {
    setNewPageName(val);
    if (!newPageSlug || toSlug(newPageSlug) === toSlug(newPageSlug)) {
      setNewPageSlug(toSlug(val));
    }
  }, [newPageSlug]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-emerald-600" />
            Páginas Personalizadas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Crea y gestiona páginas con secciones personalizadas para tu theme.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Nueva Página
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Página</DialogTitle>
              <DialogDescription>Ingresa el nombre y la URL del archivo de la nueva página.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <FormField label="Nombre de la página">
                <Input
                  value={newPageName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Sobre Nosotros"
                  autoFocus
                />
              </FormField>
              <FormField label="URL del archivo">
                <Input
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(toSlug(e.target.value))}
                  placeholder="sobre-nosotros"
                  className="bg-gray-100 font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Se usa para generar el nombre del archivo de la página
                </p>
              </FormField>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newPageName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Crear Página
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Page Cards */}
      {pages.length === 0 ? (
        <Card className="border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layers className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No hay páginas</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Crea tu primera página personalizada para comenzar.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Página
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="border-gray-300 bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActivePageId(page.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                      {page.name}
                    </CardTitle>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      page-{page.slug}.php
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                    {page.sections.length} sección{page.sections.length !== 1 ? 'es' : ''}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePageId(page.id);
                      }}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(page.id);
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {page.sections.slice(0, 5).map((sec, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          sec.enabled
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {SECTION_TYPE_ICON[sec.type]}
                        <span className="max-w-[60px] truncate">{SECTION_TYPE_LABEL[sec.type]}</span>
                      </span>
                    ))}
                    {page.sections.length > 5 && (
                      <span className="text-xs text-gray-400 px-1">
                        +{page.sections.length - 5} más
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta página?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la página y todas sus secciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteConfirmId) { removePage(deleteConfirmId); setDeleteConfirmId(null); } }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page Editor View
// ─────────────────────────────────────────────────────────────

function PageEditorView() {
  const config = useThemeEditorStore((s) => s.config);
  const {
    activePageId,
    activePageSectionIndex,
    setActivePageId,
    setActivePageSectionIndex,
    updatePage,
    removePage,
    addPageSection,
  } = useThemeEditorStore();
  const pages = (config.pages || []) as ThemePage[];

  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const activePage = useMemo(
    () => (pages || []).find((p) => p.id === activePageId) || null,
    [pages, activePageId],
  );

  const handleBack = useCallback(() => {
    setActivePageId(null);
    setActivePageSectionIndex(null);
    setShowSectionPicker(false);
  }, [setActivePageId, setActivePageSectionIndex]);

  const handleStartEditName = useCallback(() => {
    if (activePage) {
      setTempName(activePage.name);
      setEditingName(true);
    }
  }, [activePage]);

  const handleSaveName = useCallback(() => {
    if (activePageId && tempName.trim()) {
      updatePage(activePageId, { name: tempName.trim() });
    }
    setEditingName(false);
  }, [activePageId, tempName, updatePage]);

  const handleDeletePage = useCallback(() => {
    if (activePageId) {
      removePage(activePageId);
      setDeleteConfirmOpen(false);
    }
  }, [activePageId, removePage]);

  const handleToggleSection = useCallback(
    (index: number) => {
      setActivePageSectionIndex(activePageSectionIndex === index ? null : index);
    },
    [activePageSectionIndex, setActivePageSectionIndex],
  );

  if (!activePage) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Página no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="shrink-0 border-emerald-400 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 gap-1.5 mt-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setEditingName(false);
                  }}
                  className="text-lg font-semibold h-10"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-10"
                >
                  Guardar
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={handleStartEditName}
              >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {activePage.name}
                </h2>
                <Pencil className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            )}
            <p className="text-sm text-gray-400 font-mono mt-0.5">
              page-{activePage.slug}.php
            </p>
          </div>
          </div>

          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Página
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar esta página?</DialogTitle>
                <DialogDescription>
                  Se eliminará la página <strong>&quot;{activePage.name}&quot;</strong> y todas sus secciones.
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeletePage}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {/* Sections Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            Secciones
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
              {activePage.sections.length}
            </Badge>
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSectionPicker(!showSectionPicker)}
            className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Sección
          </Button>
        </div>

        {/* Section Type Picker */}
        <AnimatePresence>
          {showSectionPicker && (
            <SectionTypePicker
              pageId={activePage.id}
              onClose={() => setShowSectionPicker(false)}
            />
          )}
        </AnimatePresence>

        {/* Section List */}
        {activePage.sections.length === 0 ? (
          <Card className="border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layers className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No hay secciones en esta página.</p>
              <p className="text-xs text-gray-400 mt-1">
                Haz clic en &quot;Agregar Sección&quot; para comenzar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {activePage.sections.map((section, index) => (
              <PageSectionItem
                key={`${activePage.id}-${index}`}
                section={section}
                index={index}
                pageId={activePage.id}
                totalSections={activePage.sections.length}
                isActive={activePageSectionIndex === index}
                onSelect={() => handleToggleSection(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function PagesManager() {
  const { activePageId, config, setActivePageId, setActivePageSectionIndex } = useThemeEditorStore();
  const saveProject = useProjectsStore((s) => s.saveProject);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = useCallback(() => {
    saveProject(config.name || 'Sin Nombre', 'theme', config as Record<string, unknown>);
    toast.success('Proyecto guardado en Mis Proyectos');
  }, [config, saveProject]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const settings = useSettingsStore.getState();
      const res = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, _exportSettings: { includeScreenshot: settings.includeScreenshot, minifyCSS: settings.minifyCSS, includeREADME: settings.includeREADME } }),
      });
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(config.slug || 'theme')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Theme ZIP generado exitosamente');
      saveProject(config.name || 'Sin Nombre', 'theme', config as Record<string, unknown>).catch(() => {});
    } catch (err) {
      toast.error(`Error al generar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [config, saveProject]);

  const handleBack = useCallback(() => {
    setActivePageId(null);
    setActivePageSectionIndex(null);
  }, [setActivePageId, setActivePageSectionIndex]);

  return (
    <div className="flex h-full flex-col">
      {/* STICKY ACTION BAR — siempre visible */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#1a1a1a] border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          {activePageId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-400 hover:text-white"
              title="Volver a páginas"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <LayoutList className="h-5 w-5 text-emerald-400" />
          <h1 className="text-white font-semibold text-lg">Páginas del Theme</h1>
          {activePageId && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              Editando página
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            variant="outline"
            className="bg-[#2a2a2a] border-gray-500 text-gray-400 hover:bg-[#3a3a3a] hover:text-white font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /><span className="hidden sm:inline">Generando...</span></>
            ) : (
              <><Download className="h-4 w-4 mr-2" /><span className="hidden sm:inline">Generar ZIP</span></>
            )}
          </Button>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#f0f0eb]">
        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activePageId ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PageEditorView />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <PageListView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
