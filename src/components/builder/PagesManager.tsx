'use client';

import { useState, useRef, useCallback } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import { PAGE_TYPE_META } from '@/lib/builder-types';
import type { PageType, WebPage } from '@/lib/builder-types';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Home,
  Layers,
  Globe,
  AlertCircle,
  GripVertical,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

const TYPE_COLORS: Record<PageType, string> = {
  home: '#059669',
  about: '#0D9488',
  services: '#7C3AED',
  blog: '#D97706',
  blog_post: '#B45309',
  contact: '#DC2626',
  pricing: '#2563EB',
  portfolio: '#EA580C',
  faq: '#0F766E',
  legal: '#6B7280',
  custom: '#6366F1',
};

function resolveIcon(iconName: string, className?: string) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  return Icon ? <Icon className={className} /> : <LucideIcons.FileText className={className} />;
}

// ═══════════════════════════════════════════════════════════════
// Type Badge
// ═══════════════════════════════════════════════════════════════

function TypeBadge({ type }: { type: PageType }) {
  const meta = PAGE_TYPE_META[type];
  const color = TYPE_COLORS[type];

  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-transparent"
      style={{ backgroundColor: `${color}12`, color }}
    >
      {resolveIcon(meta.icon, 'h-3 w-3')}
      {meta.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════
// Status Badge
// ═══════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }) {
  const config = {
    DRAFT: { label: 'Borrador', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    PUBLISHED: { label: 'Publicado', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ARCHIVED: { label: 'Archivado', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════
// Inline Editable Name
// ═══════════════════════════════════════════════════════════════

function EditableName({ page }: { page: WebPage }) {
  const { updatePageData } = useBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(page.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== page.name) {
      const newSlug =
        page.type === 'home'
          ? ''
          : trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      updatePageData(page.id, { name: trimmed, slug: newSlug });
      toast.success('Nombre actualizado');
    }
    setIsEditing(false);
  }, [editValue, page, updatePageData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') {
        setEditValue(page.name);
        setIsEditing(false);
      }
    },
    [handleSave, page.name]
  );

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="h-7 w-full rounded-md border-emerald-300 px-2 text-sm font-semibold focus-visible:ring-emerald-400"
          style={{ color: '#1a2e1a' }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-emerald-600 hover:bg-emerald-50"
          onClick={handleSave}
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-gray-400 hover:bg-gray-50"
          onClick={() => {
            setEditValue(page.name);
            setIsEditing(false);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <h3
      className="cursor-pointer truncate text-sm font-semibold transition-colors hover:text-emerald-700"
      style={{ color: '#1a2e1a' }}
      onClick={() => {
        setEditValue(page.name);
        setIsEditing(true);
      }}
      title="Clic para editar nombre"
    >
      {page.name}
    </h3>
  );
}

// ═══════════════════════════════════════════════════════════════
// Page Card
// ═══════════════════════════════════════════════════════════════

function PageCard({
  page,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  page: WebPage;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const { setCurrentPage, removePage, duplicatePage, currentWebsite } = useBuilderStore();

  const handleDuplicate = () => {
    duplicatePage(page.id);
    toast.success(`Página "${page.name}" duplicada`);
  };

  const handleRemove = () => {
    removePage(page.id);
    toast.success(`Página "${page.name}" eliminada`);
  };

  const handleEdit = () => {
    setCurrentPage(page);
  };

  const color = TYPE_COLORS[page.type];
  const sectionCount = page.sections.length;

  return (
    <Card
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-200"
        style={{ backgroundColor: color }}
      />

      <CardContent className="relative p-4 pl-5">
        {/* Top row: badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TypeBadge type={page.type} />
          {page.type === 'home' && (
            <Badge className="gap-1 border-transparent bg-amber-100 text-amber-700">
              <Home className="h-3 w-3" />
              Principal
            </Badge>
          )}
        </div>

        {/* Page name (editable) */}
        <div className="mb-2">
          <EditableName page={page} />
        </div>

        {/* Slug preview */}
        <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Globe className="h-3 w-3" />
          <span className="truncate">
            {currentWebsite?.domain || 'tusitio.com'}
            {page.slug ? `/${page.slug}` : ''}
          </span>
        </div>

        {/* Bottom info row */}
        <div className="mb-3 flex items-center gap-3">
          <StatusBadge status={page.status} />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Layers className="h-3 w-3" />
            <span>{sectionCount} secciones</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 border-t border-gray-100 pt-3">
          {/* Reorder buttons */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="Mover arriba"
            >
              <GripVertical className="h-3.5 w-3.5 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="Mover abajo"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate();
              }}
              title="Duplicar página"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>

            {page.type !== 'home' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => e.stopPropagation()}
                    title="Eliminar página"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar esta página?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Estás a punto de eliminar <strong>&quot;{page.name}&quot;</strong>.
                      Esta acción no se puede deshacer y se perderá todo el contenido de la
                      página.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={handleRemove}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-not-allowed text-gray-300"
                disabled
                title="La página principal no se puede eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Add Page Dialog
// ═══════════════════════════════════════════════════════════════

const PAGE_TYPE_ORDER: PageType[] = [
  'home',
  'about',
  'services',
  'blog',
  'contact',
  'pricing',
  'portfolio',
  'faq',
  'legal',
  'blog_post',
  'custom',
];

function AddPageDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addPage, currentWebsite } = useBuilderStore();
  const [selectedType, setSelectedType] = useState<PageType>('about');
  const [pageName, setPageName] = useState('');
  const [error, setError] = useState('');

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
      if (!nextOpen) {
        // Reset form when closing so it's clean on next open
        setSelectedType('about');
        setPageName('');
        setError('');
      }
    },
    [onOpenChange]
  );

  const handleCreate = () => {
    const trimmed = pageName.trim();

    if (!trimmed) {
      setError('El nombre de la página es obligatorio');
      return;
    }

    // Check for duplicate slugs
    const slug =
      selectedType === 'home'
        ? ''
        : trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const duplicateSlug = currentWebsite?.pages.some(
      (p) => p.slug === slug && p.type === selectedType
    );
    if (duplicateSlug) {
      setError('Ya existe una página de este tipo con el mismo nombre');
      return;
    }

    addPage(selectedType, trimmed);
    onOpenChange(false);
    toast.success(`Página "${trimmed}" creada`);
  };

  const handleSelectType = (type: PageType) => {
    setSelectedType(type);
    // Auto-fill name from type meta if name is empty
    if (!pageName.trim()) {
      setPageName(PAGE_TYPE_META[type].label);
    }
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: '#1a2e1a' }}>
            <Plus className="h-5 w-5 text-emerald-600" />
            Nueva Página
          </DialogTitle>
          <DialogDescription>
            Selecciona el tipo de página y asigna un nombre. La página se creará con
            secciones predeterminadas que podrás personalizar en el editor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Type selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Tipo de Página</Label>
            <ScrollArea className="max-h-[280px] pr-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PAGE_TYPE_ORDER.map((type) => {
                  const meta = PAGE_TYPE_META[type];
                  const color = TYPE_COLORS[type];
                  const isSelected = selectedType === type;

                  // Disable home if one already exists
                  const homeExists = currentWebsite?.pages.some((p) => p.type === 'home');
                  const isDisabled = type === 'home' && !!homeExists;

                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={isDisabled}
                      className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      onClick={() => !isDisabled && handleSelectType(type)}
                    >
                      {/* Icon */}
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                        style={{
                          backgroundColor: isSelected ? `${color}20` : `${color}10`,
                        }}
                      >
                        <span style={{ color }}>{resolveIcon(meta.icon, 'h-5 w-5')}</span>
                      </div>

                      {/* Label */}
                      <span
                        className="text-xs font-semibold leading-tight"
                        style={{ color: isSelected ? '#059669' : '#1a2e1a' }}
                      >
                        {meta.label}
                      </span>

                      {/* Description */}
                      <span className="text-[10px] leading-snug text-gray-400">
                        {meta.description}
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Page name */}
          <div className="space-y-2">
            <Label htmlFor="page-name" className="text-sm font-medium text-gray-700">
              Nombre de la Página
            </Label>
            <Input
              id="page-name"
              placeholder={PAGE_TYPE_META[selectedType].label}
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              className="h-10"
            />
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}

            {/* Slug preview */}
            {pageName.trim() && selectedType !== 'home' && (
              <p className="text-xs text-gray-400">
                URL:{' '}
                <span className="font-mono">
                  {currentWebsite?.domain || 'tusitio.com'}/
                  {pageName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
                </span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Crear Página
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════
// Empty State (no website selected)
// ═══════════════════════════════════════════════════════════════

function NoWebsiteState() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <Globe className="h-12 w-12 text-gray-300" />
        </div>

        <AlertCircle className="mb-3 h-8 w-8 text-amber-400" />

        <h3
          className="mb-2 text-lg font-semibold"
          style={{ color: '#1a2e1a' }}
        >
          Sin sitio web seleccionado
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-gray-400">
          Selecciona o crea un sitio web para gestionar sus páginas. Cada sitio web puede
          tener múltiples páginas con diferentes tipos y secciones.
        </p>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Empty State (website selected but no pages)
// ═══════════════════════════════════════════════════════════════

function NoPagesState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <Layers className="h-10 w-10 text-emerald-300" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 shadow-sm">
            <Plus className="h-3.5 w-3.5 text-amber-600" />
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold" style={{ color: '#1a2e1a' }}>
          No hay páginas
        </h3>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400">
          Tu sitio web aún no tiene páginas. Comienza creando una para darle vida a tu
          proyecto.
        </p>

        <Button
          onClick={onCreate}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Crear primera página
        </Button>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Pages Manager (main export)
// ═══════════════════════════════════════════════════════════════

export function PagesManager() {
  const { currentWebsite, updatePageData } = useBuilderStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pages = currentWebsite?.pages ?? [];

  const movePageUp = useCallback(
    (index: number) => {
      if (index <= 0 || !currentWebsite) return;
      const newPages = [...currentWebsite.pages];
      [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
      updatePageData('__reorder__', {} as Partial<WebPage>);
      // Directly set pages via store
      useBuilderStore.setState({
        currentWebsite: { ...currentWebsite, pages: newPages },
      });
    },
    [currentWebsite, updatePageData]
  );

  const movePageDown = useCallback(
    (index: number) => {
      if (!currentWebsite || index >= currentWebsite.pages.length - 1) return;
      const newPages = [...currentWebsite.pages];
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
      useBuilderStore.setState({
        currentWebsite: { ...currentWebsite, pages: newPages },
      });
    },
    [currentWebsite]
  );

  // No website selected
  if (!currentWebsite) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <NoWebsiteState />
      </div>
    );
  }

  // Stats
  const publishedCount = pages.filter((p) => p.status === 'PUBLISHED').length;
  const draftCount = pages.filter((p) => p.status === 'DRAFT').length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Páginas del Sitio
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {currentWebsite.name} — {pages.length} página{pages.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nueva Página
        </Button>
      </div>

      {/* ── Summary badges ──────────────────────────────── */}
      {pages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500">
            <Globe className="h-3.5 w-3.5" />
            <span className="font-medium" style={{ color: '#1a2e1a' }}>{pages.length}</span> total
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-600">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium">{publishedCount}</span> publicadas
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
            <span className="font-medium">{draftCount}</span> borradores
          </div>
        </div>
      )}

      {/* ── Pages Grid ─────────────────────────────────── */}
      {pages.length === 0 ? (
        <NoPagesState onCreate={() => setAddDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pages.map((page, index) => (
            <PageCard
              key={page.id}
              page={page}
              isFirst={index === 0}
              isLast={index === pages.length - 1}
              onMoveUp={() => movePageUp(index)}
              onMoveDown={() => movePageDown(index)}
            />
          ))}
        </div>
      )}

      {/* ── Add Page Dialog ────────────────────────────── */}
      <AddPageDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}
