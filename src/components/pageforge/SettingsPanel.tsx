'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Save,
  Palette,
  Download,
  Code2,
  RotateCcw,
  Trash2,
  Bell,
  Monitor,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSettingsStore, DEFAULT_SETTINGS, type SettingsState } from '@/lib/settings-store';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// ─────────────────────────────────────────────────────────────
// Settings Panel
// ─────────────────────────────────────────────────────────────

export default function SettingsPanel() {
  const store = useSettingsStore();
  // Merge with defaults so SSR hydration never sees undefined
  const settings: SettingsState = { ...DEFAULT_SETTINGS, ...store };
  const { updateSettings, resetSettings, clearAllData } = store;
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced toast: avoids spamming when sliders / color pickers fire rapidly
  const saveSetting = useCallback(
    (partial: Partial<SettingsState>) => {
      updateSettings(partial);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        toast.success('Cambios guardados exitosamente');
      }, 600);
    },
    [updateSettings],
  );

  const handleReset = () => {
    resetSettings();
    setShowResetDialog(false);
    toast.success('Configuración restablecida a valores por defecto');
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personaliza PageForge a tu gusto.
        </p>
      </div>

      {/* ── General ── */}
      <SettingsSection
        icon={<Globe className="h-5 w-5 text-emerald-600" />}
        title="General"
        description="Idioma y preferencias de la aplicación"
      >
        <SettingsRow label="Idioma de la interfaz">
          <Select value={settings.language} onValueChange={(v) => saveSetting({ language: v })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English (próximamente)</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>

        <SettingsRow label="Auto-guardado">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(v) => saveSetting({ autoSave: v })}
            />
            <span className="text-sm text-muted-foreground">
              Guardar automáticamente cada {settings.autoSaveInterval}s
            </span>
          </div>
        </SettingsRow>

        {settings.autoSave && (
          <SettingsRow label={`Intervalo de auto-guardado: ${settings.autoSaveInterval} segundos`}>
            <Slider
              value={[settings.autoSaveInterval]}
              onValueChange={([v]) => saveSetting({ autoSaveInterval: v })}
              min={10}
              max={120}
              step={5}
              className="w-64"
            />
          </SettingsRow>
        )}

        <SettingsRow label="Notificaciones">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.showNotifications}
              onCheckedChange={(v) => saveSetting({ showNotifications: v })}
            />
            <span className="text-sm text-muted-foreground">
              Mostrar notificaciones de acciones completadas
            </span>
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* ── Theme Defaults ── */}
      <SettingsSection
        icon={<Palette className="h-5 w-5 text-emerald-600" />}
        title="Valores por Defecto — Temas"
        description="Colores y fuentes iniciales al crear un nuevo theme"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Color Primario</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.defaultPrimaryColor}
                onChange={(e) => saveSetting({ defaultPrimaryColor: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded border border-gray-400 p-0.5"
              />
              <Input
                value={settings.defaultPrimaryColor}
                onChange={(e) => saveSetting({ defaultPrimaryColor: e.target.value })}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Color Secundario</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.defaultSecondaryColor}
                onChange={(e) => saveSetting({ defaultSecondaryColor: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded border border-gray-400 p-0.5"
              />
              <Input
                value={settings.defaultSecondaryColor}
                onChange={(e) => saveSetting({ defaultSecondaryColor: e.target.value })}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Fuente por Defecto</Label>
            <Select value={settings.defaultFont} onValueChange={(v) => saveSetting({ defaultFont: v })}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Playfair Display', 'Merriweather'].map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSection>

      {/* ── Export ── */}
      <SettingsSection
        icon={<Download className="h-5 w-5 text-emerald-600" />}
        title="Exportación"
        description="Opciones al generar themes y plugins"
      >
        <SettingsRow label="Incluir screenshot.png">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.includeScreenshot}
              onCheckedChange={(v) => saveSetting({ includeScreenshot: v })}
            />
            <span className="text-sm text-muted-foreground">
              Genera una captura del preview como screenshot del theme
            </span>
          </div>
        </SettingsRow>

        <SettingsRow label="Minificar CSS">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.minifyCSS}
              onCheckedChange={(v) => saveSetting({ minifyCSS: v })}
            />
            <span className="text-sm text-muted-foreground">
              Reduce el tamaño del archivo CSS en el ZIP exportado
            </span>
          </div>
        </SettingsRow>

        <SettingsRow label="Incluir README.md">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.includeREADME}
              onCheckedChange={(v) => saveSetting({ includeREADME: v })}
            />
            <span className="text-sm text-muted-foreground">
              Agrega un archivo README con instrucciones de instalación
            </span>
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* ── Advanced ── */}
      <SettingsSection
        icon={<Code2 className="h-5 w-5 text-emerald-600" />}
        title="Avanzado"
        description="Opciones para desarrolladores"
      >
        <SettingsRow label="Modo Desarrollador">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.developerMode}
              onCheckedChange={(v) => saveSetting({ developerMode: v })}
            />
            <span className="text-sm text-muted-foreground">
              Muestra información técnica y logs en la interfaz
            </span>
          </div>
        </SettingsRow>

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-3">
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-gray-400 gap-2">
                <RotateCcw className="h-4 w-4" />
                Restablecer Configuración
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restablecer Configuración</DialogTitle>
                <DialogDescription>
                  Esto restaurará todos los valores de configuración a sus valores por defecto.
                  No se eliminarán tus proyectos guardados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancelar</Button>
                <Button onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restablecer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2">
                <Trash2 className="h-4 w-4" />
                Borrar Todos los Datos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">⚠️ Borrar Todos los Datos</DialogTitle>
                <DialogDescription>
                  Esto eliminará TODOS los datos guardados: proyectos, configuración, biblioteca de medios y preferencias.
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowClearDialog(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleClearAll} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Sí, borrar todo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsSection>

      {/* ── About ── */}
      <SettingsSection
        icon={<Info className="h-5 w-5 text-emerald-600" />}
        title="Acerca de"
        description="Información de PageForge"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">PageForge v2</h3>
            <p className="text-sm text-muted-foreground">
              Generador visual de themes y plugins de WordPress.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Next.js 16 • TypeScript • Tailwind CSS • Zustand
            </p>
          </div>
        </div>
      </SettingsSection>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-400 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-0.5">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <Label className="text-sm font-medium text-gray-700 shrink-0">{label}</Label>
      {children}
    </div>
  );
}
