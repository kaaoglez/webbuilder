'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectsStore, type SavedProject, type ProjectType } from '@/lib/projects-store';
import { SortableCardsProvider, SortableCardWrapper, DragHandle } from '@/components/pageforge/SortableCards';
import { useThemeEditorStore } from '@/lib/theme-editor-store';
import { usePluginEditorStore } from '@/lib/plugin-editor-store';
import {
  FolderOpen,
  Trash2,
  Palette,
  Puzzle,
  Clock,
  Download,
  Edit3,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/alert-dialog';

interface MyProjectsProps {
  onNavigate: (item: 'create-theme' | 'create-plugin' | 'dashboard') => void;
}

export default function MyProjects({ onNavigate }: MyProjectsProps) {
  const { projects, hydrated, hydrate, deleteProject, reorderProjects } = useProjectsStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | ProjectType>('all');
  const [deleteTarget, setDeleteTarget] = useState<SavedProject | null>(null);
  const themeStore = useThemeEditorStore();
  const pluginStore = usePluginEditorStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (project: SavedProject) => {
    if (project.type === 'theme') {
      themeStore.updateConfig(project.config as Partial<typeof themeStore.config>);
      onNavigate('create-theme');
    } else {
      pluginStore.updateConfig(project.config as Partial<typeof pluginStore.config>);
      onNavigate('create-plugin');
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProject(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const fromId = filtered[fromIndex]?.id;
      const toId = filtered[toIndex]?.id;
      if (!fromId || !toId) return;
      const fromActualIndex = projects.findIndex((p) => p.id === fromId);
      const toActualIndex = projects.findIndex((p) => p.id === toId);
      if (fromActualIndex !== -1 && toActualIndex !== -1) {
        reorderProjects(fromActualIndex, toActualIndex);
      }
    },
    [filtered, projects, reorderProjects],
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Cargando proyectos...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Mis Proyectos
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Gestiona tus themes y plugins guardados. Re-edita o elimina proyectos.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'theme', 'plugin'] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs"
            >
              {type === 'all' ? 'Todos' : type === 'theme' ? 'Themes' : 'Plugins'}
              {type !== 'all' && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
                  {projects.filter((p) => p.type === type).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Project list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          {projects.length === 0 ? (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-1">Sin proyectos</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Crea tu primer theme o plugin y se guardará automáticamente aquí.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => onNavigate('create-theme')} className="gap-2">
                  <Palette className="h-4 w-4" />
                  Crear Theme
                </Button>
                <Button variant="outline" onClick={() => onNavigate('create-plugin')} className="gap-2">
                  <Puzzle className="h-4 w-4" />
                  Crear Plugin
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-1">Sin resultados</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron proyectos con &quot;{search}&quot;
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <SortableCardsProvider
          items={filtered.map((p) => p.id)}
          onReorder={handleReorder}
        >
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableCardWrapper id={project.id}>
                    <Card className="hover:shadow-md transition-shadow group">
                      <CardContent className="p-4 flex items-center gap-4">
                        {/* Drag Handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DragHandle />
                        </div>

                        {/* Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            project.type === 'theme'
                              ? 'bg-emerald-100 dark:bg-emerald-950'
                              : 'bg-amber-100 dark:bg-amber-950'
                          }`}
                        >
                          {project.type === 'theme' ? (
                            <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Puzzle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-sm truncate">
                              {project.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 ${
                                project.type === 'theme'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-0'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0'
                              }`}
                            >
                              {project.type === 'theme' ? 'Theme' : 'Plugin'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(project.updatedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="Editar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(project)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SortableCardWrapper>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableCardsProvider>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Eliminar proyecto
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar &quot;{deleteTarget?.name}&quot;? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
