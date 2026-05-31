'use client';

import { useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Globe,
  Layers,
  Plus,
  LayoutTemplate,
  Pencil,
  Trash2,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

import { useBuilderStore } from '@/lib/builder-store';
import { TEMPLATE_META } from '@/lib/builder-types';
import type { PageData, PageTemplate } from '@/lib/builder-types';

// ─────────────────────────────────────────────────────────────
// Stats Card Component
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

function StatCard({ title, value, icon, bgColor, iconColor }: StatCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: bgColor }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
            {title}
          </p>
          <p
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#1a2e1a' }}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Quick Action Card Component
// ─────────────────────────────────────────────────────────────

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

function QuickActionCard({
  title,
  description,
  icon,
  bgColor,
  iconColor,
  onClick,
}: QuickActionCardProps) {
  return (
    <Card
      className="cursor-pointer border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="flex items-start gap-4 p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: bgColor }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold"
            style={{ color: '#1a2e1a' }}
          >
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: '#6b7280' }}>
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PageData['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    DRAFT: {
      label: 'Borrador',
      className: 'bg-gray-200 text-gray-700 border-gray-400',
    },
    PUBLISHED: {
      label: 'Publicado',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    ARCHIVED: {
      label: 'Archivado',
      className: 'bg-red-50 text-red-700 border-red-200',
    },
  };

  const { label, className } = config[status] || config.DRAFT;

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Template Badge
// ─────────────────────────────────────────────────────────────

function TemplateBadge({ template }: { template: PageTemplate }) {
  const meta = TEMPLATE_META[template];

  return (
    <Badge
      variant="outline"
      className="border-transparent"
      style={{
        backgroundColor: `${meta.color}15`,
        color: meta.color,
      }}
    >
      {meta.label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Page Row Component
// ─────────────────────────────────────────────────────────────

function PageRow({ page }: { page: PageData }) {
  const { setCurrentPage, removePage } = useBuilderStore();

  const handleDelete = () => {
    // Also delete from database
    fetch(`/api/pages/${page.id}`, { method: 'DELETE' }).catch(() => {});
    removePage(page.id);
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-gray-400 bg-white p-4 transition-colors hover:border-gray-400 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      role="button"
      tabIndex={0}
      onClick={() => setCurrentPage(page)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setCurrentPage(page);
        }
      }}
    >
      {/* Page info */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className="truncate text-sm font-semibold"
            style={{ color: '#1a2e1a' }}
          >
            {page.name}
          </h3>
          <TemplateBadge template={page.template} />
          <StatusBadge status={page.status} />
        </div>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {format(new Date(page.createdAt), "d MMM yyyy, HH:mm")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
          onClick={() => setCurrentPage(page)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
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
                onClick={handleDelete}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
            <FolderOpen className="h-12 w-12 text-emerald-400" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 shadow-sm">
            <Plus className="h-4 w-4 text-amber-600" />
          </div>
        </div>

        <h3
          className="mb-2 text-lg font-semibold"
          style={{ color: '#1a2e1a' }}
        >
          No hay páginas aún
        </h3>
        <p className="mb-6 max-w-sm text-sm leading-relaxed" style={{ color: '#6b7280' }}>
          Comienza creando tu primera página. Elige una plantilla, personalízala
          con nuestro editor visual y publícala en minutos.
        </p>

        <Button
          onClick={onCreate}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Crear mi primera página
        </Button>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard Component
// ─────────────────────────────────────────────────────────────

export function Dashboard() {
  const { pages, setPages, createNewPage, setActivePage } = useBuilderStore();

  // Load pages from API on mount
  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed = data.map((page: Record<string, unknown>) => ({
            ...page,
            sections: typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections,
            theme: typeof page.theme === 'string' ? JSON.parse(page.theme) : page.theme,
          }));
          setPages(parsed);
        }
      })
      .catch((err) => console.error('[Dashboard] Failed to load pages:', err));
  }, [setPages]);

  // Compute stats
  const stats = useMemo(() => {
    const total = pages.length;
    const published = pages.filter((p) => p.status === 'PUBLISHED').length;
    const drafts = pages.filter((p) => p.status === 'DRAFT').length;
    return { total, published, drafts };
  }, [pages]);

  // Sorted recent pages (newest first)
  const recentPages = useMemo(
    () => [...pages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [pages]
  );

  // Quick actions
  const quickActions = [
    {
      title: 'Crear Página',
      description: 'Comienza una nueva página con una plantilla',
      icon: <Plus className="h-5 w-5" />,
      bgColor: '#ecfdf5',
      iconColor: '#059669',
      action: () => createNewPage('Mi Página', 'landing'),
    },
    {
      title: 'Explorar Plantillas',
      description: 'Encuentra el diseño perfecto para tu proyecto',
      icon: <LayoutTemplate className="h-5 w-5" />,
      bgColor: '#fff7ed',
      iconColor: '#ea580c',
      action: () => setActivePage('templates'),
    },
  ];

  const handleCreateAndSave = () => {
    const newPage = createNewPage('Mi Página', 'landing');
    // Persist to database
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    }).catch((err) => console.error('[Dashboard] Failed to save page:', err));
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Panel de Control
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
            Bienvenido a PageForge — crea, edita y publica tus páginas web.
          </p>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          title="Total de Páginas"
          value={stats.total}
          icon={<FileText className="h-6 w-6" />}
          bgColor="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          title="Publicadas"
          value={stats.published}
          icon={<Globe className="h-6 w-6" />}
          bgColor="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          title="Borradores"
          value={stats.drafts}
          icon={<Layers className="h-6 w-6" />}
          bgColor="#faf5ff"
          iconColor="#9333ea"
        />
      </div>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <section>
        <h2
          className="mb-4 text-lg font-semibold"
          style={{ color: '#1a2e1a' }}
        >
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} onClick={action.action} />
          ))}
        </div>
      </section>

      {/* ── Recent Pages ──────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-lg font-semibold"
            style={{ color: '#1a2e1a' }}
          >
            Páginas Recientes
          </h2>
          {pages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
              onClick={() => setActivePage('templates')}
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {pages.length === 0 ? (
          <EmptyState onCreate={handleCreateAndSave} />
        ) : (
          <div className="space-y-3">
            {recentPages.map((page) => (
              <PageRow key={page.id} page={page} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
