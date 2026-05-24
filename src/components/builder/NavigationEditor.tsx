'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  Link,
  ImageIcon,
  GripVertical,
  Check,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react';
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

import { cn } from '@/lib/utils';
import { uid } from '@/lib/builder-utils';
import { useBuilderStore } from '@/lib/builder-store';
import { useAutoSave } from '@/lib/builder-hooks';
import type { SiteNavigation, NavLink, NavStyle } from '@/lib/builder-types';
import { DEFAULT_NAVIGATION } from '@/lib/builder-constants';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageManager } from '@/components/builder/ImageManager';

// ═══════════════════════════════════════════════════════════════
// Sortable Nav Link Item
// ═══════════════════════════════════════════════════════════════

function SortableNavLink({
  link,
  onUpdate,
  onRemove,
}: {
  link: NavLink;
  onUpdate: (id: string, updates: Partial<NavLink>) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, strategy: verticalListSortingStrategy });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all"
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        className="flex-shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-0.5 rounded"
        {...attributes}
        {...listeners}
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Fields */}
      <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
        <Input
          value={link.label}
          onChange={(e) => onUpdate(link.id, { label: e.target.value })}
          placeholder="Texto del enlace"
          className="text-sm h-8"
        />
        <Input
          value={link.url}
          onChange={(e) => onUpdate(link.id, { url: e.target.value })}
          placeholder="#seccion o /url"
          className="text-sm h-8"
        />
      </div>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
        onClick={() => onRemove(link.id)}
        type="button"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Live Navbar Preview
// ═══════════════════════════════════════════════════════════════

function NavbarPreview({
  brandName,
  logo,
  links,
  ctaText,
  style,
  backgroundColor,
  textColor,
}: {
  brandName: string;
  logo: string;
  links: NavLink[];
  ctaText: string;
  style: NavStyle;
  backgroundColor: string;
  textColor: string;
}) {
  const isFloating = style === 'floating';
  const isTransparent = style === 'transparent';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {/* Fake page bg */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-6">
        {/* Navbar */}
        <div
          className={cn(
            'mx-auto max-w-4xl flex items-center justify-between rounded-lg px-4 py-2.5 transition-all',
            isFloating && 'rounded-full shadow-lg mt-2',
            isTransparent && 'bg-transparent',
            !isTransparent && 'border',
          )}
          style={{
            backgroundColor: isTransparent ? 'transparent' : backgroundColor,
            color: textColor,
            borderColor: isTransparent ? 'transparent' : `${textColor}22`,
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            {logo ? (
              <img
                src={logo}
                alt={brandName}
                className="h-6 w-6 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="h-6 w-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `${textColor}22`,
                  color: textColor,
                }}
              >
                {brandName.charAt(0)?.toUpperCase() || 'B'}
              </div>
            )}
            <span className="text-sm font-semibold truncate" style={{ color: textColor }}>
              {brandName || 'Marca'}
            </span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-3">
            {links.slice(0, 5).map((link) => (
              <span
                key={link.id}
                className="text-xs font-medium opacity-80 hover:opacity-100 cursor-pointer whitespace-nowrap"
                style={{ color: textColor }}
              >
                {link.label || 'Enlace'}
              </span>
            ))}
            {links.length > 5 && (
              <span className="text-xs opacity-60" style={{ color: textColor }}>
                +{links.length - 5}
              </span>
            )}
          </div>

          {/* CTA */}
          {ctaText && (
            <div
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: textColor,
                color: backgroundColor,
              }}
            >
              {ctaText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Color Picker Field
// ═══════════════════════════════════════════════════════════════

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-md border border-gray-200 p-0.5"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF"
          className="flex-1 text-sm font-mono h-9"
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NavigationEditor — Main Export
// ═══════════════════════════════════════════════════════════════

export function NavigationEditor() {
  const currentPage = useBuilderStore((s) => s.currentPage);
  const navigationFromStore = useBuilderStore((s) => s.navigation);
  const setNavigationStore = useBuilderStore((s) => s.setNavigation);
  const setActivePage = useBuilderStore((s) => s.setActivePage);

  // Local navigation state
  const [nav, setNav] = useState<SiteNavigation>(() => {
    if (navigationFromStore) return navigationFromStore;
    return {
      id: `nav-${currentPage?.id ?? 'default'}`,
      brandName: DEFAULT_NAVIGATION.brandName,
      logo: DEFAULT_NAVIGATION.logo,
      links: DEFAULT_NAVIGATION.links.map((l) => ({ ...l })),
      ctaText: DEFAULT_NAVIGATION.ctaText,
      ctaLink: DEFAULT_NAVIGATION.ctaLink,
      style: DEFAULT_NAVIGATION.style,
      showOnScroll: DEFAULT_NAVIGATION.showOnScroll,
      mobileMenu: DEFAULT_NAVIGATION.mobileMenu,
      backgroundColor: DEFAULT_NAVIGATION.backgroundColor,
      textColor: DEFAULT_NAVIGATION.textColor,
    };
  });

  // Local navigation state — initialized from store or defaults.
  // During editing, local state is the source of truth.
  // Changes are synced TO the store via the effect below.

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Update navigation locally
  const updateNav = useCallback((updates: Partial<SiteNavigation>) => {
    setNav((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update a specific nav link
  const updateNavLink = useCallback((id: string, updates: Partial<NavLink>) => {
    setNav((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  }, []);

  // Remove a nav link
  const removeNavLink = useCallback((id: string) => {
    setNav((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  }, []);

  // Add a new nav link
  const addNavLink = useCallback(() => {
    setNav((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { id: `link-${uid()}`, label: '', url: '#', children: [] },
      ],
    }));
  }, []);

  // DnD reorder
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNav((prev) => {
      const oldIndex = prev.links.findIndex((l) => l.id === active.id);
      const newIndex = prev.links.findIndex((l) => l.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return {
        ...prev,
        links: arrayMove(prev.links, oldIndex, newIndex),
      };
    });
  }, []);

  // Sync local nav state to store
  useEffect(() => {
    if (currentPage) {
      setNavigationStore(nav);
    }
  }, [nav, currentPage, setNavigationStore]);

  // Auto-save
  const { isSaving, lastSaved, saveNow } = useAutoSave<SiteNavigation>({
    data: nav,
    endpoint: '/api/navigation',
    delay: 3000,
    enabled: !!currentPage,
    method: 'PUT',
    onSave: () => {},
    onError: (msg) => {
      console.error('Navigation auto-save error:', msg);
    },
  });

  // Handlers
  const handleSaveAndBack = useCallback(() => {
    saveNow();
    toast.success('Navegación guardada correctamente.');
    setActivePage('editor');
  }, [saveNow, setActivePage]);

  const handleSave = useCallback(() => {
    saveNow();
    toast.success('Navegación guardada correctamente.');
  }, [saveNow]);

  // ── No page selected ──
  if (!currentPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Sin página seleccionada</h3>
          <p className="text-sm text-muted-foreground">
            Ve al Dashboard y selecciona una página para editar la navegación.
          </p>
        </div>
        <Button variant="outline" onClick={() => setActivePage('dashboard')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Ir al Dashboard
        </Button>
      </div>
    );
  }

  const sortableLinkIds = nav.links.map((l) => l.id);

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <Settings className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Editor de Navegación</h2>
            <p className="text-sm text-muted-foreground">
              {currentPage.name} — Personaliza la barra de navegación
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Guardando...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Guardado
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveAndBack} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Guardar y Volver
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="h-3.5 w-3.5" />
            Guardar
          </Button>
        </div>
      </div>

      <Separator />

      {/* ── Live Preview ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-emerald-600" />
          <Label className="text-sm font-semibold text-foreground">Vista Previa</Label>
        </div>
        <NavbarPreview
          brandName={nav.brandName}
          logo={nav.logo}
          links={nav.links}
          ctaText={nav.ctaText}
          style={nav.style}
          backgroundColor={nav.backgroundColor}
          textColor={nav.textColor}
        />
      </div>

      <Separator />

      {/* ── Brand Section ── */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-emerald-600" />
          Marca
        </Label>

        <div className="space-y-2">
          <Label htmlFor="brand-name" className="text-sm font-medium">Nombre de la Marca</Label>
          <Input
            id="brand-name"
            value={nav.brandName}
            onChange={(e) => updateNav({ brandName: e.target.value })}
            placeholder="Nombre de tu empresa"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Logo</Label>
          <ImageManager
            value={nav.logo}
            onChange={(url) => updateNav({ logo: url })}
            label="Logo de la marca"
          />
        </div>
      </div>

      <Separator />

      {/* ── Nav Links Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Link className="h-4 w-4 text-emerald-600" />
            Enlaces de Navegación
          </Label>
          <Badge variant="secondary" className="text-xs">
            {nav.links.length}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          Arrastra para reordenar los enlaces. Cada enlace necesita un texto y una URL.
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableLinkIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {nav.links.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Link className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">Sin enlaces</p>
                  <p className="text-xs text-muted-foreground">Agrega enlaces usando el botón de abajo</p>
                </div>
              )}
              {nav.links.map((link) => (
                <SortableNavLink
                  key={link.id}
                  link={link}
                  onUpdate={updateNavLink}
                  onRemove={removeNavLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button
          variant="outline"
          size="sm"
          onClick={addNavLink}
          className="gap-1.5 w-full"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar Enlace
        </Button>
      </div>

      <Separator />

      {/* ── CTA Button Section ── */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Botón CTA</Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cta-text" className="text-sm font-medium">Texto del CTA</Label>
            <Input
              id="cta-text"
              value={nav.ctaText}
              onChange={(e) => updateNav({ ctaText: e.target.value })}
              placeholder="Empezar"
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cta-link" className="text-sm font-medium">Enlace del CTA</Label>
            <Input
              id="cta-link"
              value={nav.ctaLink}
              onChange={(e) => updateNav({ ctaLink: e.target.value })}
              placeholder="#contacto"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Style Section ── */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Estilo</Label>

        <div className="space-y-1.5">
          <Label htmlFor="nav-style" className="text-sm font-medium">Estilo de la Barra</Label>
          <Select
            value={nav.style}
            onValueChange={(v) => updateNav({ style: v as NavStyle })}
          >
            <SelectTrigger id="nav-style" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Sólido — Fondo opaco</SelectItem>
              <SelectItem value="transparent">Transparente — Fondo transparente</SelectItem>
              <SelectItem value="sticky">Sticky — Se fija al hacer scroll</SelectItem>
              <SelectItem value="floating">Flotante — Barra flotante con sombra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ColorField
            label="Color de Fondo"
            value={nav.backgroundColor}
            onChange={(v) => updateNav({ backgroundColor: v })}
          />
          <ColorField
            label="Color de Texto"
            value={nav.textColor}
            onChange={(v) => updateNav({ textColor: v })}
          />
        </div>
      </div>

      <Separator />

      {/* ── Options Section ── */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Opciones</Label>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
            <div className="space-y-0.5">
              <Label htmlFor="show-on-scroll" className="text-sm font-medium">Mostrar al Scrollear</Label>
              <p className="text-xs text-muted-foreground">
                La barra se oculta al scrollear hacia abajo y reaparece al subir
              </p>
            </div>
            <Switch
              id="show-on-scroll"
              checked={nav.showOnScroll}
              onCheckedChange={(checked) => updateNav({ showOnScroll: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
            <div className="space-y-0.5">
              <Label htmlFor="mobile-menu" className="text-sm font-medium">Menú Móvil</Label>
              <p className="text-xs text-muted-foreground">
                Muestra un menú hamburguesa en dispositivos móviles
              </p>
            </div>
            <Switch
              id="mobile-menu"
              checked={nav.mobileMenu}
              onCheckedChange={(checked) => updateNav({ mobileMenu: checked })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Quick Info ── */}
      <Card className="p-3 bg-muted/50 border-muted">
        <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Consejo</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Usa URLs internas con <code className="rounded bg-white px-1 py-0.5 text-xs font-mono border">#</code> para
          secciones de la misma página, o <code className="rounded bg-white px-1 py-0.5 text-xs font-mono border">/ruta</code> para
          otras páginas del sitio. Las URLs externas deben comenzar con <code className="rounded bg-white px-1 py-0.5 text-xs font-mono border">https://</code>.
        </p>
      </Card>

      {/* ── Bottom Actions ── */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <Button variant="outline" onClick={() => setActivePage('editor')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al Editor
        </Button>
        <Button onClick={handleSave} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="h-4 w-4" />
          Guardar Navegación
        </Button>
      </div>
    </div>
  );
}

export default NavigationEditor;
