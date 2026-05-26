'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Type,
  Maximize2,
  ImageIcon,
  Palette,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Paintbrush,
} from 'lucide-react';
import type { SectionSizing, SizingCapabilities } from '@/lib/builder-types';

// ─────────────────────────────────────────────────────────────
// SizingControls — UNIFIED panel (Preset + Personalizado)
// ALL options in ONE place: quick presets + advanced sliders
// ─────────────────────────────────────────────────────────────

interface SizingControlsProps {
  sizing: SectionSizing;
  onChange: (sizing: SectionSizing) => void;
  capabilities?: SizingCapabilities;
}

// ═══════════════════════════════════════════════════════════════
// Collapsible Section
// ═══════════════════════════════════════════════════════════════

function CollapsibleGroup({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-gray-400 bg-gray-200/50 overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200/80 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="flex-1 text-left">{title}</span>
        {badge != null && badge > 0 && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
            {badge}
          </Badge>
        )}
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-400 bg-white px-3 py-3 space-y-3.5">
          {children}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Reusable Control Primitives
// ═══════════════════════════════════════════════════════════════

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
}: {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}) {
  const current = value ?? Math.round((min + max) / 2);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-gray-600">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value ?? ''}
            placeholder={`${Math.round((min + max) / 2)}`}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
              else if (e.target.value === '') onChange(min);
            }}
            className="w-14 h-6 text-[10px] text-center px-1 py-0 font-mono"
          />
          <span className="text-[10px] text-gray-500">{unit}</span>
        </div>
      </div>
      <Slider
        value={[current]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

// Sentinel value for “no selection” — avoids empty-string SelectItem error
const NONE = '__none__';

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  // Radix Select uses '' to clear and show placeholder, so we normalise
  // the sentinel '__none__' from options into '' for the Select value,
  // and convert back on change.
  const selectValue = value === NONE ? '' : (value || '');
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-600">{label}</Label>
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-gray-400 cursor-pointer p-0.5"
        />
      </div>
      <div className="flex-1">
        <Label className="text-xs text-gray-600">{label}</Label>
        <Input
          type="text"
          value={value || ''}
          placeholder="#000000"
          onChange={(e) => onChange(e.target.value)}
          className="h-6 text-[10px] font-mono mt-0.5"
        />
      </div>
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{children}</p>
  );
}

// ═══════════════════════════════════════════════════════════════
// Count active values per group
// ═══════════════════════════════════════════════════════════════

function countKeys(sizing: SectionSizing, keys: (keyof SectionSizing)[]): number {
  return keys.filter((k) => sizing[k] !== undefined && sizing[k] !== '').length;
}

// ═══════════════════════════════════════════════════════════════
// Preset → pixel value mapping helpers
// ═══════════════════════════════════════════════════════════════

const PADDING_PRESETS = [
  { value: 'compact', label: 'Compacto (48px)', top: 48, bottom: 48 },
  { value: 'default', label: 'Normal (80px)', top: 80, bottom: 80 },
  { value: 'spacious', label: 'Espacioso (120px)', top: 120, bottom: 120 },
  { value: 'xl', label: 'Extra (160px)', top: 160, bottom: 160 },
] as const;

const CONTAINER_PRESETS = [
  { value: 'narrow', label: 'Estrecho (960px)', width: 960 },
  { value: 'standard', label: 'Estándar (1152px)', width: 1152 },
  { value: 'wide', label: 'Amplio (1280px)', width: 1280 },
  { value: 'full', label: 'Completo (1440px)', width: 1440 },
] as const;

const GAP_PRESETS = [
  { value: 'small', label: 'Pequeño (16px)', gap: 16 },
  { value: 'default', label: 'Normal (32px)', gap: 32 },
  { value: 'large', label: 'Grande (48px)', gap: 48 },
] as const;

const IMAGE_HEIGHT_PRESETS = [
  { value: 'auto', label: 'Automático', height: 0 },
  { value: 'sm', label: 'Pequeño (200px)', height: 200 },
  { value: 'md', label: 'Mediano (300px)', height: 300 },
  { value: 'lg', label: 'Grande (450px)', height: 450 },
  { value: 'xl', label: 'Extra grande (600px)', height: 600 },
] as const;

const IMAGE_BR_PRESETS = [
  { value: 'none', label: 'Sin redondeo', radius: 0 },
  { value: 'small', label: 'Pequeño (4px)', radius: 4 },
  { value: 'medium', label: 'Medio (8px)', radius: 8 },
  { value: 'large', label: 'Grande (16px)', radius: 16 },
  { value: 'full', label: 'Redondo (9999px)', radius: 9999 },
] as const;

// ═══════════════════════════════════════════════════════════════
// Main Component — Unified Single Panel
// ═══════════════════════════════════════════════════════════════

export function SizingControls({
  sizing,
  onChange,
  capabilities = { showText: true, showSpacing: true, showImage: false },
}: SizingControlsProps) {
  const update = (field: keyof SectionSizing, value: SectionSizing[keyof SectionSizing]) => {
    onChange({ ...sizing, [field]: value });
  };

  const hasAnyCapability =
    capabilities.showText ||
    capabilities.showSpacing ||
    capabilities.showImage ||
    capabilities.showAppearance ||
    capabilities.showCustomSpacing;

  if (!hasAnyCapability) return null;

  const hasAnyValue = Object.values(sizing).some((v) => v !== undefined && v !== '');
  const resetAll = () => onChange({});

  // ── Padding: detect which preset matches current pixel values ──
  const currentPaddingPreset = PADDING_PRESETS.find(
    (p) => sizing.customPaddingTop === p.top && sizing.customPaddingBottom === p.bottom
  );

  // ── Container: detect which preset matches ──
  const currentContainerPreset = CONTAINER_PRESETS.find(
    (p) => sizing.customContainerWidth === p.width
  );

  // ── Gap: detect which preset matches ──
  const currentGapPreset = GAP_PRESETS.find(
    (p) => sizing.customGap === p.gap
  );

  // ── Image height: detect which preset matches ──
  const currentImageHeightPreset = IMAGE_HEIGHT_PRESETS.find(
    (p) => sizing.customImageHeight === p.height
  );

  // ── Image border radius: detect which preset matches ──
  const currentImageBrPreset = IMAGE_BR_PRESETS.find(
    (p) => sizing.customImageBorderRadius === p.radius
  );

  // Active counts per group (for badges)
  const textCount = countKeys(sizing, [
    'titleSize', 'subtitleSize', 'bodySize',
    'titleWeight', 'titleLineHeight', 'titleLetterSpacing', 'titleTextTransform', 'titleAlignment',
    'subtitleWeight', 'subtitleLineHeight', 'subtitleLetterSpacing',
    'bodyWeight', 'bodyLineHeight', 'bodyLetterSpacing',
  ]);
  const spacingCount = countKeys(sizing, [
    'customPaddingTop', 'customPaddingBottom', 'customPaddingX',
    'customContainerWidth', 'customGap', 'marginBottom',
  ]);
  const imageCount = countKeys(sizing, [
    'customImageHeight', 'customImageWidth', 'customImageBorderRadius', 'imageFit', 'imageAspectRatio',
  ]);
  const appearanceCount = countKeys(sizing, [
    'backgroundColor', 'textColor', 'headingColor', 'cardBackgroundColor',
    'shadow', 'borderColor', 'borderWidth', 'opacity', 'cardBorderRadius', 'accentColor',
  ]);

  return (
    <div className="space-y-3">
      <Separator />

      <div className="flex items-center gap-2">
        <Paintbrush className="h-4 w-4 text-gray-500" />
        <Label className="text-sm font-semibold text-gray-700">
          Apariencia y Tamaño
        </Label>
        {hasAnyValue && (
          <button
            type="button"
            className="ml-auto text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            onClick={resetAll}
            title="Restablecer todos los valores"
          >
            <RotateCcw className="h-3 w-3" />
            Restablecer
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/* TIPOGRAFÍA — Quick presets + Advanced             */}
      {/* ════════════════════════════════════════════════════ */}
      {capabilities.showText && (
        <CollapsibleGroup title="Tipografía" icon={Type} badge={textCount} defaultOpen={textCount > 0}>
          {/* ── TÍTULO ── */}
          <SubHeader>Título</SubHeader>
          <SliderField
            label="Tamaño"
            value={sizing.titleSize}
            min={20}
            max={80}
            step={2}
            onChange={(v) => update('titleSize', v)}
          />
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Peso"
              value={sizing.titleWeight ? String(sizing.titleWeight) : undefined}
              options={[
                { value: '300', label: 'Light' },
                { value: '400', label: 'Regular' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semibold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'ExBold' },
                { value: '900', label: 'Black' },
              ]}
              onChange={(v) => update('titleWeight', parseInt(v, 10))}
            />
            <SelectField
              label="Alineación"
              value={sizing.titleAlignment}
              options={[
                { value: 'left', label: 'Izquierda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Derecha' },
              ]}
              onChange={(v) => update('titleAlignment', v as SectionSizing['titleAlignment'])}
            />
          </div>
          <SliderField
            label="Interlineado"
            value={sizing.titleLineHeight}
            min={1}
            max={3}
            step={0.1}
            unit=""
            onChange={(v) => update('titleLineHeight', v)}
          />
          <SliderField
            label="Espaciado de Letras"
            value={sizing.titleLetterSpacing}
            min={-2}
            max={10}
            step={0.5}
            onChange={(v) => update('titleLetterSpacing', v)}
          />
          <SelectField
            label="Transformación"
            value={sizing.titleTextTransform}
            options={[
              { value: 'none', label: 'Normal' },
              { value: 'uppercase', label: 'MAYÚSCULAS' },
              { value: 'lowercase', label: 'minúsculas' },
              { value: 'capitalize', label: 'Capitalizar' },
            ]}
            onChange={(v) => update('titleTextTransform', v as SectionSizing['titleTextTransform'])}
          />

          <Separator className="my-1" />

          {/* ── SUBTÍTULO ── */}
          <SubHeader>Subtítulo</SubHeader>
          <SliderField
            label="Tamaño"
            value={sizing.subtitleSize}
            min={14}
            max={40}
            step={1}
            onChange={(v) => update('subtitleSize', v)}
          />
          <SelectField
            label="Peso"
            value={sizing.subtitleWeight ? String(sizing.subtitleWeight) : undefined}
            options={[
              { value: '300', label: 'Light' },
              { value: '400', label: 'Regular' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semibold' },
              { value: '700', label: 'Bold' },
            ]}
            onChange={(v) => update('subtitleWeight', parseInt(v, 10))}
          />
          <SliderField
            label="Interlineado"
            value={sizing.subtitleLineHeight}
            min={1}
            max={3}
            step={0.1}
            unit=""
            onChange={(v) => update('subtitleLineHeight', v)}
          />
          <SliderField
            label="Espaciado de Letras"
            value={sizing.subtitleLetterSpacing}
            min={-2}
            max={10}
            step={0.5}
            onChange={(v) => update('subtitleLetterSpacing', v)}
          />

          <Separator className="my-1" />

          {/* ── CUERPO ── */}
          <SubHeader>Cuerpo de Texto</SubHeader>
          <SliderField
            label="Tamaño"
            value={sizing.bodySize}
            min={12}
            max={28}
            step={1}
            onChange={(v) => update('bodySize', v)}
          />
          <SelectField
            label="Peso"
            value={sizing.bodyWeight ? String(sizing.bodyWeight) : undefined}
            options={[
              { value: '300', label: 'Light' },
              { value: '400', label: 'Regular' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semibold' },
              { value: '700', label: 'Bold' },
            ]}
            onChange={(v) => update('bodyWeight', parseInt(v, 10))}
          />
          <SliderField
            label="Interlineado"
            value={sizing.bodyLineHeight}
            min={1}
            max={3}
            step={0.1}
            unit=""
            onChange={(v) => update('bodyLineHeight', v)}
          />
          <SliderField
            label="Espaciado de Letras"
            value={sizing.bodyLetterSpacing}
            min={-2}
            max={10}
            step={0.5}
            onChange={(v) => update('bodyLetterSpacing', v)}
          />
        </CollapsibleGroup>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* ESPACIADO — Quick presets + Advanced             */}
      {/* ════════════════════════════════════════════════════ */}
      {capabilities.showSpacing && capabilities.showCustomSpacing && (
        <CollapsibleGroup title="Espaciado" icon={Maximize2} badge={spacingCount} defaultOpen={spacingCount > 0}>
          {/* ── Padding rápido (preset) ── */}
          <SubHeader>Padding Vertical</SubHeader>
          <SelectField
            label="Preset Rápido"
            value={currentPaddingPreset?.value}
            options={[
              { value: NONE, label: '— Seleccionar preset...' },
              ...PADDING_PRESETS.map((p) => ({ value: p.value, label: p.label })),
            ]}
            onChange={(v) => {
              if (v === NONE || v === '') {
                onChange({ ...sizing, customPaddingTop: undefined, customPaddingBottom: undefined });
              } else {
                const preset = PADDING_PRESETS.find((p) => p.value === v);
                if (preset) {
                  onChange({ ...sizing, customPaddingTop: preset.top, customPaddingBottom: preset.bottom });
                }
              }
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <SliderField
              label="Superior"
              value={sizing.customPaddingTop}
              min={0}
              max={200}
              step={4}
              onChange={(v) => update('customPaddingTop', v)}
            />
            <SliderField
              label="Inferior"
              value={sizing.customPaddingBottom}
              min={0}
              max={200}
              step={4}
              onChange={(v) => update('customPaddingBottom', v)}
            />
          </div>

          <Separator className="my-1" />

          {/* ── Padding horizontal (solo slider) ── */}
          <SliderField
            label="Padding Horizontal"
            value={sizing.customPaddingX}
            min={0}
            max={120}
            step={4}
            onChange={(v) => update('customPaddingX', v)}
          />

          <Separator className="my-1" />

          {/* ── Container ancho (preset + slider) ── */}
          <SubHeader>Ancho del Contenedor</SubHeader>
          <SelectField
            label="Preset Rápido"
            value={currentContainerPreset?.value}
            options={[
              { value: NONE, label: '— Seleccionar preset...' },
              ...CONTAINER_PRESETS.map((p) => ({ value: p.value, label: p.label })),
            ]}
            onChange={(v) => {
              if (v === NONE || v === '') {
                onChange({ ...sizing, customContainerWidth: undefined });
              } else {
                const preset = CONTAINER_PRESETS.find((p) => p.value === v);
                if (preset) {
                  onChange({ ...sizing, customContainerWidth: preset.width });
                }
              }
            }}
          />
          <SliderField
            label="Ancho Exacto"
            value={sizing.customContainerWidth}
            min={320}
            max={1600}
            step={16}
            onChange={(v) => update('customContainerWidth', v)}
          />

          <Separator className="my-1" />

          {/* ── Gap (preset + slider) ── */}
          <SubHeader>Espacio entre Elementos</SubHeader>
          <SelectField
            label="Preset Rápido"
            value={currentGapPreset?.value}
            options={[
              { value: NONE, label: '— Seleccionar preset...' },
              ...GAP_PRESETS.map((p) => ({ value: p.value, label: p.label })),
            ]}
            onChange={(v) => {
              if (v === NONE || v === '') {
                onChange({ ...sizing, customGap: undefined });
              } else {
                const preset = GAP_PRESETS.find((p) => p.value === v);
                if (preset) {
                  onChange({ ...sizing, customGap: preset.gap });
                }
              }
            }}
          />
          <SliderField
            label="Espacio Exacto"
            value={sizing.customGap}
            min={0}
            max={80}
            step={2}
            onChange={(v) => update('customGap', v)}
          />

          <Separator className="my-1" />

          {/* ── Margin bottom (solo slider) ── */}
          <SliderField
            label="Margen Inferior"
            value={sizing.marginBottom}
            min={0}
            max={120}
            step={4}
            onChange={(v) => update('marginBottom', v)}
          />
        </CollapsibleGroup>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* IMÁGENES — Quick presets + Advanced              */}
      {/* ════════════════════════════════════════════════════ */}
      {capabilities.showImage && (
        <CollapsibleGroup title="Imágenes" icon={ImageIcon} badge={imageCount} defaultOpen={imageCount > 0}>
          {/* ── Altura (preset + slider) ── */}
          <SubHeader>Altura</SubHeader>
          <SelectField
            label="Preset Rápido"
            value={currentImageHeightPreset?.value}
            options={[
              { value: NONE, label: '— Seleccionar preset...' },
              ...IMAGE_HEIGHT_PRESETS.map((p) => ({ value: p.value, label: p.label })),
            ]}
            onChange={(v) => {
              if (v === NONE || v === '') {
                onChange({ ...sizing, customImageHeight: undefined });
              } else {
                const preset = IMAGE_HEIGHT_PRESETS.find((p) => p.value === v);
                if (preset) {
                  onChange({ ...sizing, customImageHeight: preset.height || undefined });
                }
              }
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <SliderField
              label="Alta Exacta"
              value={sizing.customImageHeight}
              min={50}
              max={800}
              step={5}
              onChange={(v) => update('customImageHeight', v)}
            />
            <SliderField
              label="Ancho Exacto"
              value={sizing.customImageWidth}
              min={50}
              max={800}
              step={5}
              onChange={(v) => update('customImageWidth', v)}
            />
          </div>

          <Separator className="my-1" />

          {/* ── Ajuste de imagen (imageFit) ── */}
          <SubHeader>Ajuste</SubHeader>
          <SelectField
            label="Ajuste de Imagen"
            value={sizing.imageFit}
            options={[
              { value: NONE, label: '— Por defecto (contain)' },
              { value: 'cover', label: 'Cubrir (cover) — puede recortar' },
              { value: 'contain', label: 'Contener (contain) — imagen completa' },
              { value: 'fill', label: 'Rellenar (fill) — puede distorsionar' },
              { value: 'none', label: 'Ninguno (none) — tamaño original' },
            ]}
            onChange={(v) => update('imageFit', (v === NONE || v === '') ? undefined : v as SectionSizing['imageFit'])}
          />
          <SelectField
            label="Relación de Aspecto"
            value={sizing.imageAspectRatio}
            options={[
              { value: 'auto', label: 'Automático' },
              { value: '1/1', label: 'Cuadrado (1:1)' },
              { value: '4/3', label: 'Paisaje (4:3)' },
              { value: '16/9', label: 'Panorámico (16:9)' },
              { value: '3/4', label: 'Retrato (3:4)' },
              { value: '21/9', label: 'Ultra Wide (21:9)' },
            ]}
            onChange={(v) => update('imageAspectRatio', v)}
          />

          <Separator className="my-1" />

          {/* ── Border radius (preset + slider) ── */}
          <SubHeader>Redondeo de Bordes</SubHeader>
          <SelectField
            label="Preset Rápido"
            value={currentImageBrPreset?.value}
            options={[
              { value: NONE, label: '— Seleccionar preset...' },
              ...IMAGE_BR_PRESETS.map((p) => ({ value: p.value, label: p.label })),
            ]}
            onChange={(v) => {
              if (v === NONE || v === '') {
                onChange({ ...sizing, customImageBorderRadius: undefined });
              } else {
                const preset = IMAGE_BR_PRESETS.find((p) => p.value === v);
                if (preset) {
                  onChange({ ...sizing, customImageBorderRadius: preset.radius });
                }
              }
            }}
          />
          <SliderField
            label="Radio Exacto"
            value={sizing.customImageBorderRadius}
            min={0}
            max={100}
            step={1}
            onChange={(v) => update('customImageBorderRadius', v)}
          />
        </CollapsibleGroup>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* APARIENCIA                                      */}
      {/* ════════════════════════════════════════════════════ */}
      {capabilities.showAppearance && (
        <CollapsibleGroup title="Apariencia" icon={Palette} badge={appearanceCount} defaultOpen={appearanceCount > 0}>
          <ColorField
            label="Fondo de Sección"
            value={sizing.backgroundColor}
            onChange={(v) => update('backgroundColor', v)}
          />
          <ColorField
            label="Color de Texto"
            value={sizing.textColor}
            onChange={(v) => update('textColor', v)}
          />
          <ColorField
            label="Color de Títulos"
            value={sizing.headingColor}
            onChange={(v) => update('headingColor', v)}
          />
          <ColorField
            label="Fondo de Tarjetas"
            value={sizing.cardBackgroundColor}
            onChange={(v) => update('cardBackgroundColor', v)}
          />
          <ColorField
            label="Color de Acento"
            value={sizing.accentColor}
            onChange={(v) => update('accentColor', v)}
          />

          <Separator className="my-1" />

          <SelectField
            label="Sombra de Tarjetas"
            value={sizing.shadow}
            options={[
              { value: 'none', label: 'Sin sombra' },
              { value: 'sm', label: 'Pequeña' },
              { value: 'md', label: 'Media' },
              { value: 'lg', label: 'Grande' },
              { value: 'xl', label: 'Extra grande' },
            ]}
            onChange={(v) => update('shadow', v as SectionSizing['shadow'])}
          />

          <SliderField
            label="Radio de Tarjetas"
            value={sizing.cardBorderRadius}
            min={0}
            max={32}
            step={1}
            onChange={(v) => update('cardBorderRadius', v)}
          />

          <SliderField
            label="Opacidad"
            value={sizing.opacity}
            min={0}
            max={100}
            step={5}
            unit="%"
            onChange={(v) => update('opacity', v)}
          />

          <Separator className="my-1" />

          <div className="grid grid-cols-2 gap-2">
            <ColorField
              label="Color de Borde"
              value={sizing.borderColor}
              onChange={(v) => update('borderColor', v)}
            />
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Ancho de Borde</Label>
              <Input
                type="number"
                value={sizing.borderWidth ?? ''}
                placeholder="0"
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) update('borderWidth', v);
                  else if (e.target.value === '') update('borderWidth', undefined);
                }}
                className="h-7 text-xs font-mono"
                min={0}
                max={10}
              />
            </div>
          </div>
        </CollapsibleGroup>
      )}
    </div>
  );
}

export default SizingControls;
