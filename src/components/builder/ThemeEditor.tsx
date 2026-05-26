'use client';

import { useMemo, useCallback } from 'react';
import {
  Palette,
  RotateCcw,
  Save,
  Type,
  Paintbrush,
  Check,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useBuilderStore } from '@/lib/builder-store';
import { DEFAULT_THEMES, FONT_OPTIONS } from '@/lib/builder-templates';
import { TEMPLATE_META } from '@/lib/builder-types';
import type { PageTemplate, PageTheme } from '@/lib/builder-types';

// ─────────────────────────────────────────────────────────────
// Color Field
// ─────────────────────────────────────────────────────────────

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border border-gray-400 p-0.5"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </Label>
        <p className="mt-0.5 text-sm font-mono font-medium" style={{ color: '#1a2e1a' }}>
          {value.toUpperCase()}
        </p>
      </div>
      <div
        className="h-6 w-6 rounded-full border border-gray-400 shrink-0"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Border Radius Presets
// ─────────────────────────────────────────────────────────────

const BORDER_RADIUS_OPTIONS: { value: PageTheme['borderRadius']; label: string; preview: string }[] = [
  { value: 'none', label: 'Ninguno', preview: 'rounded-none' },
  { value: 'small', label: 'Pequeño', preview: 'rounded-sm' },
  { value: 'medium', label: 'Mediano', preview: 'rounded-lg' },
  { value: 'large', label: 'Grande', preview: 'rounded-xl' },
  { value: 'full', label: 'Completo', preview: 'rounded-full' },
];

// ─────────────────────────────────────────────────────────────
// Style Presets
// ─────────────────────────────────────────────────────────────

const STYLE_OPTIONS: { value: PageTheme['style']; label: string; description: string }[] = [
  { value: 'modern', label: 'Moderno', description: 'Líneas limpias y espaciado generoso' },
  { value: 'classic', label: 'Clásico', description: 'Elegancia atemporal y tipografía serif' },
  { value: 'minimal', label: 'Minimalista', description: 'Menos es más, máximo impacto' },
  { value: 'bold', label: 'Atrevido', description: 'Colores intensos y tipografía grande' },
];

// ─────────────────────────────────────────────────────────────
// Live Preview
// ─────────────────────────────────────────────────────────────

function LivePreview({ theme }: { theme: PageTheme }) {
  const radiusMap: Record<PageTheme['borderRadius'], string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="border-0 shadow-sm overflow-hidden">
        {/* Preview header bar */}
        <div
          className="h-10"
          style={{
            backgroundColor: theme.primaryColor,
          }}
        />
        <CardContent className="p-6" style={{ backgroundColor: theme.backgroundColor }}>
          {/* Heading preview */}
          <h3
            className="text-xl font-bold mb-2"
            style={{
              color: theme.textColor,
              fontFamily: theme.headingFont,
              borderRadius: radiusMap[theme.borderRadius],
            }}
          >
            Título de Ejemplo
          </h3>

          {/* Body text preview */}
          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: theme.textColor,
              fontFamily: theme.bodyFont,
              opacity: 0.75,
            }}
          >
            Este es un texto de ejemplo que muestra cómo se verá la tipografía del cuerpo en tu página web. El texto se adapta a los colores y fuentes seleccionados.
          </p>

          {/* Button previews */}
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 text-sm font-medium text-white inline-block"
              style={{
                backgroundColor: theme.accentColor,
                borderRadius: radiusMap[theme.borderRadius],
              }}
            >
              Botón Principal
            </div>
            <div
              className="px-4 py-2 text-sm font-medium inline-block"
              style={{
                backgroundColor: theme.secondaryColor,
                color: '#ffffff',
                borderRadius: radiusMap[theme.borderRadius],
              }}
            >
              Secundario
            </div>
          </div>

          {/* Color swatches row */}
          <Separator className="my-4" />
          <div className="flex items-center gap-2">
            {[
              theme.primaryColor,
              theme.secondaryColor,
              theme.accentColor,
              theme.backgroundColor,
              theme.textColor,
            ].map((color, i) => (
              <div
                key={i}
                className="h-6 w-6 border border-gray-400"
                style={{
                  backgroundColor: color,
                  borderRadius: radiusMap[theme.borderRadius] === '0px' ? '0px' : '4px',
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Theme Editor
// ─────────────────────────────────────────────────────────────

export function ThemeEditor() {
  const { currentPage, updateTheme, setActivePage } = useBuilderStore();

  const theme = currentPage?.theme;

  const handleColorChange = useCallback(
    (key: keyof PageTheme, value: string) => {
      updateTheme({ [key]: value });
    },
    [updateTheme],
  );

  // Use 'landing' as default fallback template for reset operations
  const handleResetColors = useCallback(() => {
    const defaultTheme = DEFAULT_THEMES.landing;
    updateTheme({
      primaryColor: defaultTheme.primaryColor,
      secondaryColor: defaultTheme.secondaryColor,
      accentColor: defaultTheme.accentColor,
      backgroundColor: defaultTheme.backgroundColor,
      textColor: defaultTheme.textColor,
    });
  }, [updateTheme]);

  const handleResetAll = useCallback(() => {
    const defaultTheme = DEFAULT_THEMES.landing;
    updateTheme({ ...defaultTheme });
  }, [updateTheme]);

  const handleApplyPreset = useCallback(
    (template: PageTemplate) => {
      const presetTheme = DEFAULT_THEMES[template];
      updateTheme({ ...presetTheme });
    },
    [updateTheme],
  );

  const activeTemplate = useMemo(() => {
    if (!theme) return null;
    return (
      (Object.entries(DEFAULT_THEMES) as [PageTemplate, PageTheme][]).find(
        ([, t]) =>
          t.primaryColor === theme.primaryColor &&
          t.secondaryColor === theme.secondaryColor &&
          t.accentColor === theme.accentColor &&
          t.backgroundColor === theme.backgroundColor &&
          t.textColor === theme.textColor,
      )?.[0] ?? null
    );
  }, [theme]);

  // If no current page, show a prompt
  if (!currentPage || !theme) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Personalizar Tema
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Ajusta los colores y estilos de tu página
          </p>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <Palette className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold" style={{ color: '#1a2e1a' }}>
              No hay página seleccionada
            </h3>
            <p className="mb-4 max-w-sm text-sm" style={{ color: '#6b7280' }}>
              Primero crea o selecciona una página para personalizar su tema.
            </p>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setActivePage('dashboard')}
            >
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Personalizar Tema
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Ajusta los colores y estilos de tu página
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-gray-600 hover:text-gray-800"
            onClick={handleResetAll}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => setActivePage('editor')}
          >
            <Save className="h-3.5 w-3.5" />
            Guardar y Volver
          </Button>
        </div>
      </div>

      {/* ── Live Preview ───────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <Paintbrush className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Vista Previa en Vivo
              </CardTitle>
              <CardDescription className="text-xs">
                Los cambios se reflejan en tiempo real
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LivePreview theme={theme} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Color Settings ──────────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <Palette className="h-4 w-4 text-amber-600" />
                </div>
                <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                  Colores
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                onClick={handleResetColors}
              >
                <RotateCcw className="h-3 w-3" />
                Restablecer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorField
              label="Color Primario"
              value={theme.primaryColor}
              onChange={(v) => handleColorChange('primaryColor', v)}
            />
            <Separator />
            <ColorField
              label="Color Secundario"
              value={theme.secondaryColor}
              onChange={(v) => handleColorChange('secondaryColor', v)}
            />
            <Separator />
            <ColorField
              label="Color de Acento"
              value={theme.accentColor}
              onChange={(v) => handleColorChange('accentColor', v)}
            />
            <Separator />
            <ColorField
              label="Color de Fondo"
              value={theme.backgroundColor}
              onChange={(v) => handleColorChange('backgroundColor', v)}
            />
            <Separator />
            <ColorField
              label="Color de Texto"
              value={theme.textColor}
              onChange={(v) => handleColorChange('textColor', v)}
            />
          </CardContent>
        </Card>

        {/* ── Typography ──────────────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                <Type className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Tipografía
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Heading Font */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuente de Títulos
              </Label>
              <Select
                value={theme.headingFont}
                onValueChange={(v) => handleColorChange('headingFont', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Body Font */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuente del Cuerpo
              </Label>
              <Select
                value={theme.bodyFont}
                onValueChange={(v) => handleColorChange('bodyFont', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Font Preview */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vista Previa de Fuentes
              </Label>
              <div className="rounded-lg border border-gray-400 bg-gray-200/50 p-4 space-y-3">
                <p
                  className="text-xl font-bold"
                  style={{
                    color: theme.textColor,
                    fontFamily: theme.headingFont,
                  }}
                >
                  Títulos en {theme.headingFont}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: theme.textColor,
                    fontFamily: theme.bodyFont,
                    opacity: 0.8,
                  }}
                >
                  El texto del cuerpo usa {theme.bodyFont}. Este es un párrafo de ejemplo para
                  que puedas ver cómo se verá la tipografía en tu página web final.
                  ¡Experimenta con diferentes combinaciones!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Style Settings ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Border Radius */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                <Paintbrush className="h-4 w-4 text-sky-600" />
              </div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Radio de Bordes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme.borderRadius}
              onValueChange={(v) =>
                handleColorChange('borderRadius', v as PageTheme['borderRadius'])
              }
              className="space-y-3"
            >
              {BORDER_RADIUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-150 ${
                    theme.borderRadius === option.value
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-gray-400 hover:border-gray-400 hover:bg-gray-200/50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`radius-${option.value}`} />
                  {/* Visual preview of the radius */}
                  <div
                    className={`h-8 w-8 bg-gray-300 ${option.preview}`}
                    style={{
                      backgroundColor:
                        theme.borderRadius === option.value
                          ? theme.primaryColor
                          : '#d1d5db',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.borderRadius === option.value ? '#065f46' : '#374151' }}
                    >
                      {option.label}
                    </span>
                  </div>
                  {theme.borderRadius === option.value && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Style */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                <Paintbrush className="h-4 w-4 text-rose-600" />
              </div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Estilo General
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme.style}
              onValueChange={(v) =>
                handleColorChange('style', v as PageTheme['style'])
              }
              className="space-y-3"
            >
              {STYLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-150 ${
                    theme.style === option.value
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-gray-400 hover:border-gray-400 hover:bg-gray-200/50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`style-${option.value}`} />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.style === option.value ? '#065f46' : '#374151' }}
                    >
                      {option.label}
                    </span>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.style === option.value ? '#047857' : '#9ca3af' }}
                    >
                      {option.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium shrink-0 ${
                      theme.style === option.value
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                        : 'border-gray-400 bg-gray-200 text-gray-500'
                    }`}
                  >
                    {option.value}
                  </Badge>
                  {theme.style === option.value && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* ── Template Presets ──────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
              <Palette className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Plantillas de Tema Preestablecidas
              </CardTitle>
              <CardDescription className="text-xs">
                Haz clic para aplicar los colores de una plantilla
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {(Object.entries(DEFAULT_THEMES) as [PageTemplate, PageTheme][]).map(
              ([templateKey, presetTheme]) => {
                const meta = TEMPLATE_META[templateKey];
                const isActive = activeTemplate === templateKey;

                return (
                  <button
                    key={templateKey}
                    type="button"
                    onClick={() => handleApplyPreset(templateKey)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'border-emerald-400 bg-emerald-50/50 shadow-sm'
                        : 'border-gray-400 bg-white hover:border-gray-400 hover:shadow-sm'
                    }`}
                  >
                    {/* Mini color palette */}
                    <div className="flex gap-1">
                      <div
                        className="h-5 w-5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: presetTheme.primaryColor }}
                      />
                      <div
                        className="h-5 w-5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: presetTheme.secondaryColor }}
                      />
                      <div
                        className="h-5 w-5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: presetTheme.accentColor }}
                      />
                    </div>

                    {/* Template name */}
                    <span
                      className={`text-xs font-medium text-center leading-tight ${
                        isActive ? 'text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      {meta.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
