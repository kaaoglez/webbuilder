'use client';

import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProjectsStore } from '@/lib/projects-store';
import { useSettingsStore } from '@/lib/settings-store';
import {
  Download,
  Save,
  Loader2,
  Plus,
  X,
  Settings2,
  FileCode2,
  CheckCircle2,
  ImageIcon,
} from 'lucide-react';

import { usePluginEditorStore, PLUGIN_TYPES } from '@/lib/plugin-editor-store';
import type { PluginType } from '@/lib/wp-plugin-generator';
import { useMediaPicker } from '@/components/pageforge/MediaLibrary';
import { SortableCardsProvider, SortableCardWrapper, DragHandle } from '@/components/pageforge/SortableCards';
import { useUIPreferencesStore } from '@/lib/ui-preferences-store';

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
import { Checkbox } from '@/components/ui/checkbox';

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
// Image URL field with Media Library picker
// ─────────────────────────────────────────────────────────────

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
          <div className="mt-2 flex items-center gap-2 p-2 bg-gray-200 rounded-lg border border-gray-400">
            <img src={value} alt="Preview" className="h-10 w-auto object-contain rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-xs text-gray-500">Vista previa</span>
          </div>
        )}
      </FormField>
      <MediaLibraryDialog />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components (same pattern as ThemeEditor)
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
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-gray-400 bg-white">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        {title && <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>}
        {!title && <div />}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-red-500"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">{children}</CardContent>
    </Card>
  );
}

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

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <Label className="text-sm">{label}</Label>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1: INFO
// ─────────────────────────────────────────────────────────────

function InfoTab() {
  const { config, updateConfig } = usePluginEditorStore();

  const handleNameChange = useCallback(
    (name: string) => {
      const slug = toSlug(name);
      updateConfig({ name, slug, textDomain: slug });
    },
    [updateConfig],
  );

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-600 text-white w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Datos del Plugin</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Estos datos se incluirán en la cabecera del plugin WordPress. El nombre y slug son obligatorios.
              WordPress los usa para identificar y activar tu plugin.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Información del Plugin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Nombre del Plugin">
            <Input
              value={config.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mi Plugin WordPress"
            />
          </FormField>

          <FormField label="Slug">
            <Input
              value={config.slug || ''}
              onChange={(e) => updateConfig({ slug: e.target.value })}
              placeholder="mi-plugin-wordpress"
              className="bg-gray-200"
            />
          </FormField>

          <FormField label="Descripción">
            <Textarea
              value={config.description || ''}
              onChange={(e) => updateConfig({ description: e.target.value })}
              placeholder="Descripción de tu plugin..."
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

          <FormField label="URI del Autor">
            <Input
              value={config.authorUri || ''}
              onChange={(e) => updateConfig({ authorUri: e.target.value })}
              placeholder="https://tu-sitio.com"
            />
          </FormField>

          <FormField label="Dominio de Texto">
            <Input
              value={config.textDomain || ''}
              onChange={(e) => updateConfig({ textDomain: e.target.value })}
              placeholder="mi-plugin"
              className="bg-gray-200"
            />
          </FormField>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 2: TYPE
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Plugin category groups for better UX
// ─────────────────────────────────────────────────────────────

const PLUGIN_GROUPS: Array<{
  title: string;
  description: string;
  types: PluginType[];
}> = [
  {
    title: 'Formularios',
    description: 'Plugins para recibir y procesar datos de los visitantes a través de formularios de contacto y envíos.',
    types: ['contact-form'],
  },
  {
    title: 'Contenido',
    description: 'Plugins para gestionar y mostrar contenido: sliders, tipos de contenido personalizados, shortcodes y testimonios.',
    types: ['slider', 'custom-post-type', 'shortcodes', 'testimonials', 'related-posts'],
  },
  {
    title: 'Diseño',
    description: 'Plugins para mejorar la apariencia y funcionalidad visual: widgets, redes sociales, cuentas regresivas y tablas de precios.',
    types: ['widget', 'social-share', 'countdown', 'pricing-table'],
  },
  {
    title: 'SEO & Rendimiento',
    description: 'Plugins para optimizar el posicionamiento, navegación y acceso al sitio.',
    types: ['seo', 'breadcrumbs', 'maintenance-mode', 'custom-login'],
  },
  {
    title: 'Integraciones',
    description: 'Plugins para conectar servicios externos como Google Maps.',
    types: ['google-maps'],
  },
];

function TypeTab() {
  const { config, setPluginType } = usePluginEditorStore();
  const { pluginTypeCardOrder, reorderPluginTypeCards } = useUIPreferencesStore();

  const pluginMap = useMemo(() => {
    const map = new Map<string, (typeof PLUGIN_TYPES)[number]>();
    PLUGIN_TYPES.forEach((pt) => map.set(pt.value, pt));
    return map;
  }, []);

  const selectedPlugin = config.pluginType ? pluginMap.get(config.pluginType) : null;

  return (
    <div className="space-y-6">
      {/* Step indicator + explanation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-600 text-white w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
            2
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">¿Qué funcionalidad quieres agregar?</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              En WordPress, un plugin añade una <strong>funcionalidad específica</strong> a tu sitio: un formulario de contacto,
              un slider de imágenes, SEO, etc. Selecciona la que necesitas y la personalizaremos en la siguiente pestaña.
            </p>
          </div>
        </div>
      </div>

      {/* Current selection indicator */}
      {selectedPlugin && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm">
          <div className="text-lg">{selectedPlugin.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Plugin seleccionado:</p>
            <p className="text-sm font-medium text-gray-900 truncate">{selectedPlugin.label}</p>
          </div>
          {selectedPlugin.hasShortcode && (
            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] shrink-0">
              {selectedPlugin.shortcode}
            </Badge>
          )}
        </div>
      )}

      <SortableCardsProvider items={pluginTypeCardOrder} onReorder={reorderPluginTypeCards}>
        {pluginTypeCardOrder.map((key) => {
          const group = PLUGIN_GROUPS.find(
            (g) =>
              g.title === 'SEO & Rendimiento'
                ? key === 'seo'
                : g.title === 'Diseño'
                  ? key === 'diseno'
                  : key === g.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          );
          if (!group) return null;
          return (
            <SortableCardWrapper key={key} id={key}>
              <Card className="border-gray-400 bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <DragHandle />
                    <CardTitle className="text-base text-gray-800 flex-1">{group.title}</CardTitle>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {group.types.map((typeKey) => {
                      const pt = pluginMap.get(typeKey);
                      if (!pt) return null;
                      const isSelected = config.pluginType === pt.value;
                      return (
                        <motion.button
                          key={pt.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setPluginType(pt.value)}
                          className={`text-left rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                              : 'border-gray-400 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{pt.icon}</div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{pt.label}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">
                            {pt.description}
                          </p>
                          {pt.hasShortcode && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                              {pt.shortcode}
                            </Badge>
                          )}
                          {pt.hasSettings && !pt.hasShortcode && (
                            <Badge variant="secondary" className="text-[10px]">
                              Settings Page
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </SortableCardWrapper>
          );
        })}
      </SortableCardsProvider>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 3: OPTIONS — Dynamic per plugin type
// ─────────────────────────────────────────────────────────────

function OptionsTab() {
  const { config } = usePluginEditorStore();
  const opts = config.options;

  if (!config.pluginType) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card className="border-dashed border-2 border-gray-400 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Settings2 className="h-10 w-10 text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Selecciona un tipo de plugin en la pestaña anterior
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{PLUGIN_TYPES.find((p) => p.value === config.pluginType)?.icon}</span>
            Opciones del Plugin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OptionsRenderer pluginType={config.pluginType} options={opts} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Options renderer per plugin type
// ─────────────────────────────────────────────────────────────

function OptionsRenderer({
  pluginType,
  options,
}: {
  pluginType: PluginType;
  options: Record<string, unknown>;
}) {
  const { updateOption, updateOptions } = usePluginEditorStore();

  const update = useCallback((key: string, value: unknown) => {
    updateOption(key, value);
  }, [updateOption]);

  switch (pluginType) {
    case 'contact-form':
      return (
        <>
          <FormField label="Email Destinatario">
            <Input
              type="email"
              value={(options.recipientEmail as string) || ''}
              onChange={(e) => update('recipientEmail', e.target.value)}
              placeholder="admin@example.com"
            />
          </FormField>
          <FormField label="Asunto del Email">
            <Input
              value={(options.subject as string) || ''}
              onChange={(e) => update('subject', e.target.value)}
              placeholder="Nuevo mensaje de contacto"
            />
          </FormField>
          <FormField label="Mensaje de Éxito">
            <Input
              value={(options.successMessage as string) || ''}
              onChange={(e) => update('successMessage', e.target.value)}
              placeholder="Mensaje enviado correctamente"
            />
          </FormField>
          <FormField label="Texto del Botón">
            <Input
              value={(options.buttonLabel as string) || ''}
              onChange={(e) => update('buttonLabel', e.target.value)}
              placeholder="Enviar"
            />
          </FormField>
          <Separator />
          <Label className="text-sm font-medium text-gray-700">Campos del Formulario</Label>
          <div className="space-y-2">
            {(['name', 'email', 'subject', 'message'] as const).map((field) => (
              <SwitchField
                key={field}
                label={field === 'name' ? 'Nombre' : field === 'email' ? 'Email' : field === 'subject' ? 'Asunto' : 'Mensaje'}
                checked={((options.fields as string[]) || []).includes(field)}
                onChange={(checked) => {
                  const current = (options.fields as string[]) || [];
                  const updated = checked
                    ? [...current, field]
                    : current.filter((f) => f !== field);
                  update('fields', updated);
                }}
              />
            ))}
          </div>
        </>
      );

    case 'slider':
      return (
        <>
          <SwitchField label="Autoplay" checked={options.autoplay as boolean || false} onChange={(v) => update('autoplay', v)} />
          <FormField label={`Velocidad de Autoplay: ${(options.autoplaySpeed as number) || 5000}ms`}>
            <Input
              type="number"
              min={1000}
              max={20000}
              step={500}
              value={(options.autoplaySpeed as number) || 5000}
              onChange={(e) => update('autoplaySpeed', Number(e.target.value))}
            />
          </FormField>
          <SwitchField label="Flechas de Navegación" checked={options.arrows as boolean || false} onChange={(v) => update('arrows', v)} />
          <SwitchField label="Puntos de Indicador" checked={options.dots as boolean || false} onChange={(v) => update('dots', v)} />
          <SwitchField label="Loop Infinito" checked={options.infinite as boolean || false} onChange={(v) => update('infinite', v)} />
          <FormField label="Altura Máxima">
            <Input
              value={(options.maxHeight as string) || '500px'}
              onChange={(e) => update('maxHeight', e.target.value)}
              placeholder="500px"
            />
          </FormField>
        </>
      );

    case 'custom-post-type': {
      const handleNameChange = (val: string) => {
        updateOptions({ postTypeName: val, postTypeSlug: toSlug(val) });
      };
      const currentSupports = (options.supports as string[]) || [];
      return (
        <>
          <FormField label="Nombre del Post Type">
            <Input
              value={(options.postTypeName as string) || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Products"
            />
          </FormField>
          <FormField label="Slug">
            <Input
              value={(options.postTypeSlug as string) || ''}
              onChange={(e) => update('postTypeSlug', e.target.value)}
              placeholder="products"
              className="bg-gray-200"
            />
          </FormField>
          <Separator />
          <Label className="text-sm font-medium text-gray-700">Soportes</Label>
          <div className="space-y-2">
            {(['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'] as const).map((s) => (
              <SwitchField
                key={s}
                label={s === 'custom-fields' ? 'Campos Personalizados' : s.charAt(0).toUpperCase() + s.slice(1)}
                checked={currentSupports.includes(s)}
                onChange={(checked) => {
                  const updated = checked
                    ? [...currentSupports, s]
                    : currentSupports.filter((x) => x !== s);
                  update('supports', updated);
                }}
              />
            ))}
          </div>
          <Separator />
          <SwitchField label="Público" checked={options.public as boolean || false} onChange={(v) => update('public', v)} />
          <SwitchField label="Tiene Archivo" checked={options.hasArchive as boolean || false} onChange={(v) => update('hasArchive', v)} />
          <SwitchField label="Mostrar en REST API" checked={options.showInRest as boolean || false} onChange={(v) => update('showInRest', v)} />
        </>
      );
    }

    case 'shortcodes':
      return (
        <div className="space-y-2">
          <SwitchField label="Botón [pf_button]" checked={options.enableButton as boolean || false} onChange={(v) => update('enableButton', v)} />
          <SwitchField label="Caja [pf_box]" checked={options.enableBox as boolean || false} onChange={(v) => update('enableBox', v)} />
          <SwitchField label="Alerta [pf_alert]" checked={options.enableAlert as boolean || false} onChange={(v) => update('enableAlert', v)} />
          <SwitchField label="Separador [pf_divider]" checked={options.enableDivider as boolean || false} onChange={(v) => update('enableDivider', v)} />
          <SwitchField label="Cuenta Regresiva [pf_countdown]" checked={options.enableCountdown as boolean || false} onChange={(v) => update('enableCountdown', v)} />
        </div>
      );

    case 'widget':
      return (
        <>
          <FormField label="Título del Widget">
            <Input
              value={(options.title as string) || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Posts Recientes"
            />
          </FormField>
          <FormField label="Número de Posts">
            <Input
              type="number"
              min={1}
              max={20}
              value={(options.postCount as number) || 5}
              onChange={(e) => update('postCount', Number(e.target.value))}
            />
          </FormField>
          <SwitchField label="Mostrar Miniatura" checked={options.showThumbnail as boolean || false} onChange={(v) => update('showThumbnail', v)} />
          <SwitchField label="Mostrar Fecha" checked={options.showDate as boolean || false} onChange={(v) => update('showDate', v)} />
          <SwitchField label="Mostrar Extracto" checked={options.showExcerpt as boolean || false} onChange={(v) => update('showExcerpt', v)} />
          <FormField label="Longitud del Extracto">
            <Input
              type="number"
              min={10}
              max={200}
              value={(options.excerptLength as number) || 50}
              onChange={(e) => update('excerptLength', Number(e.target.value))}
            />
          </FormField>
        </>
      );

    case 'social-share': {
      const currentPlatforms = (options.platforms as string[]) || [];
      return (
        <>
          <Separator />
          <Label className="text-sm font-medium text-gray-700">Plataformas</Label>
          <div className="space-y-2">
            {(['facebook', 'twitter', 'linkedin', 'whatsapp', 'pinterest'] as const).map((p) => (
              <SwitchField
                key={p}
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                checked={currentPlatforms.includes(p)}
                onChange={(checked) => {
                  const updated = checked
                    ? [...currentPlatforms, p]
                    : currentPlatforms.filter((x) => x !== p);
                  update('platforms', updated);
                }}
              />
            ))}
          </div>
          <Separator />
          <FormField label="Posición">
            <Select
              value={(options.position as string) || 'bottom'}
              onValueChange={(v) => update('position', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom">Abajo</SelectItem>
                <SelectItem value="top">Arriba</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <SwitchField label="Mostrar Contador" checked={options.showCount as boolean || false} onChange={(v) => update('showCount', v)} />
          <SwitchField label="Barra Flotante Lateral" checked={options.floatingSidebar as boolean || false} onChange={(v) => update('floatingSidebar', v)} />
        </>
      );
    }

    case 'seo':
      return (
        <>
          <SwitchField label="Habilitar Open Graph" checked={options.enableOpenGraph as boolean || false} onChange={(v) => update('enableOpenGraph', v)} />
          <SwitchField label="Habilitar Sitemap" checked={options.enableSitemap as boolean || false} onChange={(v) => update('enableSitemap', v)} />
          <FormField label="Intervalo del Sitemap">
            <Select
              value={(options.sitemapInterval as string) || 'daily'}
              onValueChange={(v) => update('sitemapInterval', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Cada hora</SelectItem>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </>
      );

    case 'google-maps':
      return (
        <>
          <FormField label="API Key de Google Maps">
            <Input
              type="password"
              value={(options.apiKey as string) || ''}
              onChange={(e) => update('apiKey', e.target.value)}
              placeholder="AIza..."
            />
          </FormField>
          <FormField label="Dirección">
            <Input
              value={(options.address as string) || ''}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Calle Principal 123, Ciudad"
            />
          </FormField>
          <FormField label={`Zoom: ${options.zoom as number || 15}`}>
            <Slider
              value={[options.zoom as number || 15]}
              onValueChange={([v]) => update('zoom', v)}
              min={1}
              max={20}
              step={1}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ancho">
              <Input
                value={(options.width as string) || '100%'}
                onChange={(e) => update('width', e.target.value)}
                placeholder="100%"
              />
            </FormField>
            <FormField label="Alto">
              <Input
                value={(options.height as string) || '400px'}
                onChange={(e) => update('height', e.target.value)}
                placeholder="400px"
              />
            </FormField>
          </div>
          <FormField label="Tipo de Mapa">
            <Select
              value={(options.mapType as string) || 'roadmap'}
              onValueChange={(v) => update('mapType', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roadmap">Mapa</SelectItem>
                <SelectItem value="satellite">Satélite</SelectItem>
                <SelectItem value="hybrid">Híbrido</SelectItem>
                <SelectItem value="terrain">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </>
      );

    case 'countdown':
      return (
        <>
          <FormField label="Fecha del Evento">
            <Input
              type="datetime-local"
              value={(options.date as string) || ''}
              onChange={(e) => update('date', e.target.value)}
            />
          </FormField>
          <FormField label="Título">
            <Input
              value={(options.title as string) || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Cuenta Regresiva"
            />
          </FormField>
          <Separator />
          <Label className="text-sm font-medium text-gray-700">Mostrar Unidades</Label>
          <div className="space-y-2">
            <SwitchField label="Días" checked={options.showDays as boolean || false} onChange={(v) => update('showDays', v)} />
            <SwitchField label="Horas" checked={options.showHours as boolean || false} onChange={(v) => update('showHours', v)} />
            <SwitchField label="Minutos" checked={options.showMinutes as boolean || false} onChange={(v) => update('showMinutes', v)} />
            <SwitchField label="Segundos" checked={options.showSeconds as boolean || false} onChange={(v) => update('showSeconds', v)} />
          </div>
          <FormField label="Tema">
            <Select
              value={(options.theme as string) || 'modern'}
              onValueChange={(v) => update('theme', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="classic">Clásico</SelectItem>
                <SelectItem value="minimal">Minimalista</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </>
      );

    case 'pricing-table': {
      const plans = (options.plans as Array<{
        name: string;
        price: string;
        period: string;
        features: string[];
        highlighted: boolean;
        buttonLabel: string;
      }>) || [];

      const updatePlans = (newPlans: typeof plans) => {
        update('plans', newPlans);
      };

      const addPlan = () => {
        updatePlans([
          ...plans,
          { name: '', price: '$0', period: '/mes', features: [], highlighted: false, buttonLabel: 'Comenzar' },
        ]);
      };

      const removePlan = (i: number) => {
        updatePlans(plans.filter((_, idx) => idx !== i));
      };

      const updatePlan = (i: number, field: string, val: unknown) => {
        const updated = plans.map((p, idx) => (idx === i ? { ...p, [field]: val } : p));
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

      const updatePlanFeature = (planIdx: number, featIdx: number, val: string) => {
        const updated = plans.map((p, idx) => {
          if (idx !== planIdx) return p;
          const features = [...p.features];
          features[featIdx] = val;
          return { ...p, features };
        });
        updatePlans(updated);
      };

      return (
        <>
          <FormField label="Columnas">
            <Select
              value={String(options.columns || 3)}
              onValueChange={(v) => update('columns', Number(v))}
            >
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
              <Label className="text-sm font-medium text-gray-700">Planes</Label>
              <Button size="sm" variant="outline" onClick={addPlan} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Agregar Plan
              </Button>
            </div>
            {plans.map((plan, i) => (
              <RepeatableCard
                key={i}
                title={
                  <span className="flex items-center gap-2">
                    Plan {i + 1}
                    {plan.highlighted && <Badge className="bg-emerald-100 text-emerald-700 text-xs">Destacado</Badge>}
                  </span>
                }
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
                    <Input
                      value={plan.period}
                      onChange={(e) => updatePlan(i, 'period', e.target.value)}
                      placeholder="/mes"
                    />
                  </FormField>
                  <FormField label="Texto del Botón">
                    <Input
                      value={plan.buttonLabel}
                      onChange={(e) => updatePlan(i, 'buttonLabel', e.target.value)}
                      placeholder="Comenzar"
                    />
                  </FormField>
                </div>
                <SwitchField
                  label="Plan destacado"
                  checked={plan.highlighted}
                  onChange={(v) => updatePlan(i, 'highlighted', v)}
                />
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
        </>
      );
    }

    case 'testimonials':
      return (
        <>
          <FormField label="Título">
            <Input
              value={(options.title as string) || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Lo que dicen nuestros clientes"
            />
          </FormField>
          <FormField label="Columnas">
            <Select
              value={String(options.columns || 3)}
              onValueChange={(v) => update('columns', Number(v))}
            >
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
          <SwitchField label="Mostrar Estrellas" checked={options.showStars as boolean || false} onChange={(v) => update('showStars', v)} />
          <SwitchField label="Mostrar Rol" checked={options.showRole as boolean || false} onChange={(v) => update('showRole', v)} />
          <FormField label="Máximo de Testimonios">
            <Input
              type="number"
              min={1}
              max={20}
              value={(options.maxCount as number) || 6}
              onChange={(e) => update('maxCount', Number(e.target.value))}
            />
          </FormField>
        </>
      );

    case 'maintenance-mode':
      return (
        <>
          <FormField label="Título">
            <Input
              value={(options.title as string) || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Sitio en Mantenimiento"
            />
          </FormField>
          <FormField label="Mensaje">
            <Textarea
              value={(options.message as string) || ''}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Estamos trabajando para mejorar nuestro sitio. Vuelve pronto."
              rows={3}
            />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorPickerField
              label="Color de Fondo"
              value={(options.backgroundColor as string) || '#1a1a2e'}
              onChange={(v) => update('backgroundColor', v)}
            />
            <ColorPickerField
              label="Color de Texto"
              value={(options.textColor as string) || '#ffffff'}
              onChange={(v) => update('textColor', v)}
            />
          </div>
          <SwitchField label="Bypass para Administradores" checked={options.adminBypass as boolean || false} onChange={(v) => update('adminBypass', v)} />
        </>
      );

    case 'custom-login':
      return (
        <>
          <SwitchField label="Mostrar Logo Personalizado" checked={options.showCustomLogo as boolean || false} onChange={(v) => update('showCustomLogo', v)} />
          {(options.showCustomLogo as boolean) && (
            <ImageUrlField
              label="Logo Personalizado"
              value={(options.logoUrl as string) || ''}
              onChange={(url) => update('logoUrl', url)}
            />
          )}
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorPickerField
              label="Color de Fondo"
              value={(options.backgroundColor as string) || '#ffffff'}
              onChange={(v) => update('backgroundColor', v)}
            />
            <ColorPickerField
              label="Color del Formulario"
              value={(options.formBackgroundColor as string) || '#ffffff'}
              onChange={(v) => update('formBackgroundColor', v)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorPickerField
              label="Color del Botón"
              value={(options.buttonColor as string) || '#2563EB'}
              onChange={(v) => update('buttonColor', v)}
            />
            <ColorPickerField
              label="Color del Texto del Botón"
              value={(options.buttonTextColor as string) || '#ffffff'}
              onChange={(v) => update('buttonTextColor', v)}
            />
          </div>
          <ColorPickerField
            label="Color de Enlaces"
            value={(options.linkColor as string) || '#2563EB'}
            onChange={(v) => update('linkColor', v)}
          />
        </>
      );

    case 'breadcrumbs':
      return (
        <>
          <FormField label="Separador">
            <Input
              value={(options.separator as string) || ''}
              onChange={(e) => update('separator', e.target.value)}
              placeholder="›"
            />
          </FormField>
          <SwitchField label="Mostrar Inicio" checked={options.showHome as boolean || false} onChange={(v) => update('showHome', v)} />
          <FormField label="Etiqueta de Inicio">
            <Input
              value={(options.homeLabel as string) || ''}
              onChange={(e) => update('homeLabel', e.target.value)}
              placeholder="Inicio"
            />
          </FormField>
          <SwitchField label="Mostrar Página Actual" checked={options.showCurrent as boolean || false} onChange={(v) => update('showCurrent', v)} />
          <FormField label="Profundidad Máxima">
            <Input
              type="number"
              min={1}
              max={5}
              value={(options.maxDepth as number) || 3}
              onChange={(e) => update('maxDepth', Number(e.target.value))}
            />
          </FormField>
        </>
      );

    case 'related-posts':
      return (
        <>
          <FormField label="Título">
            <Input
              value={(options.title as string) || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Posts Relacionados"
            />
          </FormField>
          <FormField label="Cantidad">
            <Input
              type="number"
              min={1}
              max={10}
              value={(options.count as number) || 3}
              onChange={(e) => update('count', Number(e.target.value))}
            />
          </FormField>
          <SwitchField label="Mostrar Miniatura" checked={options.showThumbnail as boolean || false} onChange={(v) => update('showThumbnail', v)} />
          <SwitchField label="Mostrar Extracto" checked={options.showExcerpt as boolean || false} onChange={(v) => update('showExcerpt', v)} />
          <FormField label="Longitud del Extracto">
            <Input
              type="number"
              min={10}
              max={300}
              value={(options.excerptLength as number) || 100}
              onChange={(e) => update('excerptLength', Number(e.target.value))}
            />
          </FormField>
          <FormField label="Relacionar por">
            <Select
              value={(options.matchBy as string) || 'category'}
              onValueChange={(v) => update('matchBy', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="tag">Etiqueta</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </>
      );

    default:
      return <p className="text-sm text-gray-500">Opciones no disponibles para este tipo de plugin.</p>;
  }
}

// ─────────────────────────────────────────────────────────────
// TAB 4: GENERATE
// ─────────────────────────────────────────────────────────────

function GenerateTab() {
  const { config, isGenerating, setGenerating } = usePluginEditorStore();

  const pluginMeta = useMemo(() => {
    return PLUGIN_TYPES.find((p) => p.value === config.pluginType);
  }, [config.pluginType]);

  const fileList = useMemo(() => {
    const slug = config.slug || 'my-plugin';
    const base = [`${slug}.php`, 'readme.txt'];
    switch (config.pluginType) {
      case 'contact-form':
      case 'slider':
      case 'shortcodes':
        return [...base, 'assets/css/style.css', 'assets/js/script.js'];
      case 'social-share':
      case 'google-maps':
      case 'countdown':
        return [...base, 'assets/css/style.css', 'assets/js/script.js'];
      case 'widget':
      case 'seo':
      case 'pricing-table':
      case 'testimonials':
      case 'maintenance-mode':
      case 'custom-login':
      case 'breadcrumbs':
      case 'related-posts':
        return [...base, 'assets/css/style.css'];
      case 'custom-post-type':
      default:
        return base;
    }
  }, [config.pluginType, config.slug]);

  const keyOptionsSummary = useMemo(() => {
    const opts = config.options;
    const entries: string[] = [];
    switch (config.pluginType) {
      case 'contact-form':
        entries.push(`Email: ${opts.recipientEmail as string}`);
        entries.push(`Campos: ${((opts.fields as string[]) || []).join(', ')}`);
        break;
      case 'slider':
        entries.push(`Autoplay: ${opts.autoplay ? 'Sí' : 'No'}`);
        entries.push(`Velocidad: ${opts.autoplaySpeed}ms`);
        break;
      case 'custom-post-type':
        entries.push(`Post Type: ${opts.postTypeSlug}`);
        entries.push(`Público: ${opts.public ? 'Sí' : 'No'}`);
        break;
      case 'google-maps':
        entries.push(`Dirección: ${opts.address || 'No definida'}`);
        entries.push(`Zoom: ${opts.zoom}`);
        break;
      case 'countdown':
        entries.push(`Fecha: ${opts.date || 'No definida'}`);
        entries.push(`Tema: ${opts.theme}`);
        break;
      case 'pricing-table': {
        const planCount = ((opts.plans as unknown[]) || []).length;
        entries.push(`${planCount} plan(es) configurados`);
        break;
      }
      case 'social-share':
        entries.push(`Plataformas: ${((opts.platforms as string[]) || []).join(', ')}`);
        entries.push(`Posición: ${opts.position}`);
        break;
      case 'maintenance-mode':
        entries.push(`Fondo: ${opts.backgroundColor}`);
        entries.push(`Admin Bypass: ${opts.adminBypass ? 'Sí' : 'No'}`);
        break;
      case 'custom-login':
        entries.push(`Botón: ${opts.buttonColor}`);
        entries.push(`Fondo: ${opts.backgroundColor}`);
        break;
      case 'shortcodes':
        entries.push(`Shortcodes: ${((opts.shortcodes as string[]) || []).length} definidos`);
        break;
      case 'related-posts':
        entries.push(`Título: ${opts.title || 'Posts Relacionados'}`);
        entries.push(`Cantidad: ${opts.count || 3}`);
        entries.push(`Miniaturas: ${opts.showThumbnail ? 'Sí' : 'No'}`);
        break;
      case 'breadcrumbs':
        entries.push(`Separador: ${opts.separator || '›'}`);
        entries.push(`Mostrar Inicio: ${opts.showHome ? 'Sí' : 'No'}`);
        break;
      case 'testimonials':
        entries.push(`Diseño: ${opts.layout || 'grid'}`);
        entries.push(`Columnas: ${opts.columns || 3}`);
        break;
      case 'seo':
        entries.push(`Meta Descripción: ${opts.metaDescription ? 'Personalizada' : 'Auto'}`);
        entries.push(`Sitemap: ${opts.sitemap ? 'Sí' : 'No'}`);
        break;
      default:
        break;
    }
    return entries;
  }, [config.pluginType, config.options]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const settings = useSettingsStore.getState();
      const res = await fetch('/api/generate-plugin', {
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
      a.download = `${(config.slug || 'plugin')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('¡Plugin ZIP generado exitosamente!');
    } catch (err) {
      toast.error(`Error al generar el plugin: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setGenerating(false);
    }
  }, [config, setGenerating]);

  return (
    <div className="space-y-6">
      <Card className="border-gray-400 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Resumen del Plugin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plugin Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {pluginMeta?.icon || '📦'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{config.name || 'Sin nombre'}</h3>
              <p className="text-sm text-gray-500">{pluginMeta?.label || 'Tipo no seleccionado'}</p>
            </div>
          </div>

          {/* Plugin Type Badge */}
          {pluginMeta && (
            <div className="flex flex-wrap gap-2">
              {pluginMeta.hasShortcode && (
                <Badge className="bg-emerald-100 text-emerald-700">
                  {pluginMeta.shortcode}
                </Badge>
              )}
              {pluginMeta.hasSettings && (
                <Badge variant="secondary">Settings Page</Badge>
              )}
            </div>
          )}

          {/* Key Options */}
          {keyOptionsSummary.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Opciones Clave</h4>
                <ul className="space-y-1">
                  {keyOptionsSummary.map((entry, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* File List */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos que se Generarán</h4>
            <div className="bg-gray-200 rounded-lg p-3 space-y-1">
              {fileList.map((file, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <FileCode2 className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <code className="text-xs font-mono">{file}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generando Plugin...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generar y Descargar ZIP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function PluginEditor() {
  const { activeTab, setActiveTab, config, isGenerating, setGenerating } = usePluginEditorStore();
  const saveProject = useProjectsStore((s) => s.saveProject);

  const handleSave = () => {
    saveProject(config.name || 'Sin Nombre', 'plugin', config as Record<string, unknown>);
    toast.success('Proyecto guardado en Mis Proyectos');
  };

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const settings = useSettingsStore.getState();
      const res = await fetch('/api/generate-plugin', {
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
      a.download = `${(config.slug || 'plugin')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('¡Plugin ZIP generado exitosamente!');
    } catch (err) {
      toast.error(`Error al generar el plugin: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setGenerating(false);
    }
  }, [config, setGenerating]);

  return (
    <div className="flex h-full flex-col">
      {/* TOP ACTION BAR */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#1a1a1a] border-b border-gray-700 shrink-0">
        <h1 className="text-white font-semibold text-lg">Editor de Plugin</h1>
        <div className="flex items-center gap-2">
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

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="px-4 md:px-6 pt-4 bg-[#1a1a1a]">
          <TabsList className="bg-[#2a2a2a] h-10 p-1 w-fit">
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
            >
              1. Info
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
            >
              2. Funcionalidad
            </TabsTrigger>
            <TabsTrigger
              value="options"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
            >
              3. Opciones
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500 h-8 text-sm px-4"
            >
              4. Generar
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#f0f0eb] p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="info" className="mt-0">
                <InfoTab />
              </TabsContent>
              <TabsContent value="type" className="mt-0">
                <TypeTab />
              </TabsContent>
              <TabsContent value="options" className="mt-0">
                <OptionsTab />
              </TabsContent>
              <TabsContent value="generate" className="mt-0">
                <GenerateTab />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
