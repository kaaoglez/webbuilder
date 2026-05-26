'use client';

import { useBuilderStore } from '@/lib/builder-store';
import type { NavItem } from '@/lib/builder-types';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Trash2, Edit2, ExternalLink, Link2, ChevronDown, ChevronRight, Menu, Eye } from 'lucide-react';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10);

const TYPE_BADGE_CONFIG: Record<NavItem['type'], { label: string; className: string }> = {
  page: {
    label: 'Página',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  },
  external: {
    label: 'Externo',
    className: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
  },
  dropdown: {
    label: 'Menú',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
};

const TYPE_OPTIONS: { value: NavItem['type']; label: string }[] = [
  { value: 'page', label: 'Página interna' },
  { value: 'external', label: 'Enlace externo' },
  { value: 'dropdown', label: 'Submenú desplegable' },
];

// ─────────────────────────────────────────────────────────────
// Nav Preview
// ─────────────────────────────────────────────────────────────

function NavPreview({ items, brandName }: { items: NavItem[]; brandName: string }) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-400">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Eye className="size-3.5" />
          <span>Vista previa</span>
        </div>
      </div>
      <div className="bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-700 tracking-tight">{brandName || 'Mi Sitio'}</span>
          <div className="flex items-center gap-1 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors whitespace-nowrap">
                  {item.type === 'dropdown' ? (
                    <>
                      {item.label}
                      <ChevronDown className="size-3" />
                    </>
                  ) : (
                    item.label
                  )}
                </button>
                {item.type === 'dropdown' && item.children && item.children.length > 0 && (
                  <div className="absolute top-full right-0 mt-0.5 hidden group-hover:block z-10">
                    <div className="bg-white border border-gray-400 rounded-lg shadow-lg py-1 min-w-[140px]">
                      {item.children.map((child) => (
                        <div key={child.id} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 whitespace-nowrap">
                          {child.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-500 rounded-md md:hidden">
              <Menu className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Sortable Nav Item
// ─────────────────────────────────────────────────────────────

interface SortableNavItemProps {
  item: NavItem;
  depth?: number;
  onUpdate: (id: string, data: Partial<NavItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, child: NavItem) => void;
  onUpdateChild: (parentId: string, childId: string, data: Partial<NavItem>) => void;
  onDeleteChild: (parentId: string, childId: string) => void;
}

function SortableNavItem({
  item,
  depth = 0,
  onUpdate,
  onDelete,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
}: SortableNavItemProps) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);
  const [editHref, setEditHref] = useState(item.href);
  const [editType, setEditType] = useState<NavItem['type']>(item.type);
  const [expanded, setExpanded] = useState(true);
  const [addingChild, setAddingChild] = useState(false);
  const [childLabel, setChildLabel] = useState('');
  const [childHref, setChildHref] = useState('');
  const [childType, setChildType] = useState<'page' | 'external'>('page');
  const [childPageId, setChildPageId] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const badge = TYPE_BADGE_CONFIG[item.type];
  const isIndented = depth > 0;

  const handleSaveEdit = () => {
    if (!editLabel.trim()) {
      toast.error('El nombre del elemento no puede estar vacío.');
      return;
    }
    onUpdate(item.id, { label: editLabel.trim(), href: editHref.trim(), type: editType });
    setEditing(false);
    toast.success('Elemento actualizado.');
  };

  const handleCancelEdit = () => {
    setEditLabel(item.label);
    setEditHref(item.href);
    setEditType(item.type);
    setEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    toast.success(`"${item.label}" eliminado del menú.`);
  };

  const handleSaveChild = () => {
    if (!childLabel.trim()) {
      toast.error('El nombre del sub-elemento no puede estar vacío.');
      return;
    }
    const child: NavItem = {
      id: uid(),
      label: childLabel.trim(),
      href: childType === 'external' ? childHref.trim() : `/${childPageId}`,
      type: childType,
    };
    onAddChild(item.id, child);
    setChildLabel('');
    setChildHref('');
    setChildType('page');
    setChildPageId('');
    setAddingChild(false);
    toast.success('Sub-elemento añadido.');
  };

  return (
    <div style={style}>
      <div
        ref={setNodeRef}
        className={`group flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-colors hover:bg-muted ${
          isIndented ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-400'
        }`}
      >
        {/* Drag handle */}
        <button
          className="flex-shrink-0 cursor-grab touch-none text-gray-500 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Arrastrar para reordenar"
        >
          <GripVertical className="size-4" />
        </button>

        {/* Dropdown expand */}
        {item.type === 'dropdown' && (
          <button
            className="flex-shrink-0 text-gray-500 hover:text-gray-600"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Colapsar submenú' : 'Expandir submenú'}
          >
            {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        )}

        {editing ? (
          /* ── Edit mode ── */
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Nombre del elemento"
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <Button size="sm" variant="ghost" className="h-8 px-2 text-emerald-700 hover:bg-emerald-50" onClick={handleSaveEdit}>
                Guardar
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2 text-gray-500 hover:bg-gray-200" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={editType} onValueChange={(v) => setEditType(v as NavItem['type'])}>
                <SelectTrigger className="h-7 text-xs w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={editHref}
                onChange={(e) => setEditHref(e.target.value)}
                placeholder={editType === 'external' ? 'https://...' : '/ruta'}
                className="h-7 text-xs flex-1"
              />
            </div>
          </div>
        ) : (
          /* ── Display mode ── */
          <>
            {/* Icon indicator */}
            <div className="flex-shrink-0">
              {item.type === 'external' ? (
                <ExternalLink className="size-3.5 text-sky-500" />
              ) : item.type === 'dropdown' ? (
                <Menu className="size-3.5 text-amber-500" />
              ) : (
                <Link2 className="size-3.5 text-emerald-500" />
              )}
            </div>

            {/* Label + href */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm font-medium text-gray-800">{item.label}</span>
              {item.href && item.type !== 'dropdown' && (
                <span className="hidden truncate text-xs text-gray-500 sm:inline max-w-[140px]">
                  {item.href}
                </span>
              )}
            </div>

            {/* Type badge */}
            <button
              className="flex-shrink-0"
              onClick={() => setEditing(true)}
              title="Cambiar tipo"
            >
              <Badge variant="outline" className={`cursor-pointer text-[10px] px-1.5 py-0 ${badge.className}`}>
                {badge.label}
              </Badge>
            </button>

            {/* Child count indicator for dropdowns */}
            {item.type === 'dropdown' && item.children && (
              <span className="flex-shrink-0 text-[10px] text-gray-500">
                ({item.children.length})
              </span>
            )}

            {/* Actions */}
            <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {item.type === 'dropdown' && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                  onClick={() => setAddingChild(true)}
                  aria-label="Añadir sub-elemento"
                >
                  <Plus className="size-3.5" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                onClick={() => setEditing(true)}
                aria-label="Editar elemento"
              >
                <Edit2 className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleConfirmDelete}
                aria-label="Eliminar elemento"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ── Add child form ── */}
      {item.type === 'dropdown' && addingChild && (
        <div className="ml-10 mt-1 flex items-center gap-2 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/50 px-3 py-2">
          <Input
            value={childLabel}
            onChange={(e) => setChildLabel(e.target.value)}
            placeholder="Nombre"
            className="h-7 text-xs flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveChild();
              if (e.key === 'Escape') setAddingChild(false);
            }}
          />
          <Select value={childType} onValueChange={(v) => setChildType(v as 'page' | 'external')}>
            <SelectTrigger className="h-7 text-xs w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page" className="text-xs">Página interna</SelectItem>
              <SelectItem value="external" className="text-xs">Enlace externo</SelectItem>
            </SelectContent>
          </Select>
          {childType === 'external' ? (
            <Input
              value={childHref}
              onChange={(e) => setChildHref(e.target.value)}
              placeholder="https://..."
              className="h-7 text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveChild();
              }}
            />
          ) : (
            <ChildPageSelector value={childPageId} onChange={setChildPageId} />
          )}
          <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-700 hover:bg-emerald-100" onClick={handleSaveChild}>
            Añadir
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500 hover:bg-gray-200" onClick={() => setAddingChild(false)}>
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}

      {/* ── Children (indented) ── */}
      {item.type === 'dropdown' && expanded && item.children && item.children.length > 0 && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-emerald-300 pl-3">
          {item.children.map((child) => (
            <SortableChildItem
              key={child.id}
              parentId={item.id}
              item={child}
              onUpdateChild={onUpdateChild}
              onDeleteChild={onDeleteChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sortable Child Item (sub-items inside a dropdown)
// ─────────────────────────────────────────────────────────────

interface SortableChildItemProps {
  parentId: string;
  item: NavItem;
  onUpdateChild: (parentId: string, childId: string, data: Partial<NavItem>) => void;
  onDeleteChild: (parentId: string, childId: string) => void;
}

function SortableChildItem({ parentId, item, onUpdateChild, onDeleteChild }: SortableChildItemProps) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);
  const [editHref, setEditHref] = useState(item.href);
  const [editType, setEditType] = useState<NavItem['type']>(item.type);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const badge = TYPE_BADGE_CONFIG[item.type];

  const handleSaveEdit = () => {
    if (!editLabel.trim()) {
      toast.error('El nombre no puede estar vacío.');
      return;
    }
    onUpdateChild(parentId, item.id, { label: editLabel.trim(), href: editHref.trim(), type: editType });
    setEditing(false);
    toast.success('Sub-elemento actualizado.');
  };

  const handleCancelEdit = () => {
    setEditLabel(item.label);
    setEditHref(item.href);
    setEditType(item.type);
    setEditing(false);
  };

  return (
    <div style={style}>
      <div
        ref={setNodeRef}
        className="group flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/30 px-3 py-2 transition-colors hover:bg-emerald-50"
      >
        {/* Drag handle */}
        <button
          className="flex-shrink-0 cursor-grab touch-none text-gray-500 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Arrastrar para reordenar sub-elemento"
        >
          <GripVertical className="size-3.5" />
        </button>

        {editing ? (
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Nombre"
                className="h-7 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-700 hover:bg-emerald-100 text-xs" onClick={handleSaveEdit}>
                OK
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500 hover:bg-gray-200" onClick={handleCancelEdit}>
                <Trash2 className="size-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={editType} onValueChange={(v) => setEditType(v as NavItem['type'])}>
                <SelectTrigger className="h-6 text-[10px] w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={editHref}
                onChange={(e) => setEditHref(e.target.value)}
                placeholder={editType === 'external' ? 'https://...' : '/ruta'}
                className="h-6 text-[11px] flex-1"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              {item.type === 'external' ? (
                <ExternalLink className="size-3 text-sky-500" />
              ) : (
                <Link2 className="size-3 text-emerald-500" />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700">{item.label}</span>
            <button onClick={() => setEditing(true)}>
              <Badge variant="outline" className={`cursor-pointer text-[9px] px-1 py-0 ${badge.className}`}>
                {badge.label}
              </Badge>
            </button>
            <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="size-6 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                onClick={() => setEditing(true)}
                aria-label="Editar sub-elemento"
              >
                <Edit2 className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-6 text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  onDeleteChild(parentId, item.id);
                  toast.success(`"${item.label}" eliminado.`);
                }}
                aria-label="Eliminar sub-elemento"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Child Page Selector (reusable)
// ─────────────────────────────────────────────────────────────

function ChildPageSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { currentWebsite } = useBuilderStore();
  const pages = currentWebsite?.pages ?? [];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 text-xs flex-1">
        <SelectValue placeholder="Seleccionar página" />
      </SelectTrigger>
      <SelectContent>
        {pages.map((p) => (
          <SelectItem key={p.id} value={p.id} className="text-xs">
            {p.name}
          </SelectItem>
        ))}
        {pages.length === 0 && (
          <SelectItem value="__none" disabled className="text-xs text-gray-500">
            No hay páginas
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

// ─────────────────────────────────────────────────────────────
// Add Item Form
// ─────────────────────────────────────────────────────────────

interface AddItemFormProps {
  onAdd: (item: NavItem) => void;
  onClose: () => void;
}

function AddItemForm({ onAdd, onClose }: AddItemFormProps) {
  const { currentWebsite } = useBuilderStore();
  const pages = currentWebsite?.pages ?? [];

  const [label, setLabel] = useState('');
  const [type, setType] = useState<NavItem['type']>('page');
  const [href, setHref] = useState('');
  const [selectedPageId, setSelectedPageId] = useState('');

  const handleSubmit = () => {
    if (!label.trim()) {
      toast.error('El nombre del elemento no puede estar vacío.');
      return;
    }

    let finalHref = href;
    if (type === 'page' && selectedPageId) {
      const page = pages.find((p) => p.id === selectedPageId);
      finalHref = page ? (page.type === 'home' ? '/' : `/${page.slug}`) : '/';
    } else if (type === 'page' && !selectedPageId) {
      toast.error('Selecciona una página para enlazar.');
      return;
    } else if (type === 'external' && !href.trim()) {
      toast.error('Introduce una URL para el enlace externo.');
      return;
    }

    const newItem: NavItem = {
      id: uid(),
      label: label.trim(),
      href: finalHref,
      type,
      ...(type === 'dropdown' ? { children: [] } : {}),
    };

    onAdd(newItem);
    toast.success(`"${label.trim()}" añadido al menú.`);
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-400 bg-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Nuevo elemento</h4>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-gray-500 hover:bg-gray-200"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </div>

      {/* Label */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">Nombre</Label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Inicio, Servicios, Blog..."
          className="h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
        />
      </div>

      {/* Type selector */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">Tipo</Label>
        <Select value={type} onValueChange={(v) => setType(v as NavItem['type'])}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conditional fields based on type */}
      {type === 'page' && (
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Página de destino</Label>
          <Select value={selectedPageId} onValueChange={setSelectedPageId}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Seleccionar una página..." />
            </SelectTrigger>
            <SelectContent>
              {pages.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
              {pages.length === 0 && (
                <SelectItem value="__none" disabled className="text-gray-500">
                  No hay páginas disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {type === 'external' && (
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">URL externa</Label>
          <Input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://ejemplo.com"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>
      )}

      {type === 'dropdown' && (
        <p className="text-xs text-gray-500 italic">
          Se creará un elemento de menú desplegable. Podrás añadir sub-elementos después de crearlo.
        </p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Plus className="size-4" />
        Añadir al menú
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────

function EmptyNavState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50">
        <Menu className="size-8 text-emerald-400" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Menú vacío</h3>
      <p className="mb-4 max-w-xs text-xs text-gray-500 leading-relaxed">
        Aún no has añadido elementos a tu menú de navegación. Empieza añadiendo tu primera página o enlace.
      </p>
      <Button
        variant="outline"
        className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        Añadir primer elemento
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NavigationBuilder (Main Export)
// ─────────────────────────────────────────────────────────────

export function NavigationBuilder() {
  const { currentWebsite, updateNavigation } = useBuilderStore();
  const [showAddForm, setShowAddForm] = useState(false);

  const items = currentWebsite?.navigation ?? [];
  const pages = currentWebsite?.pages ?? [];
  const brandName = currentWebsite?.seo?.siteName ?? '';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // ── CRUD operations ──

  const handleAddItem = useCallback(
    (newItem: NavItem) => {
      const updated = [...items, newItem];
      updateNavigation(updated);
      setShowAddForm(false);
    },
    [items, updateNavigation]
  );

  const handleUpdateItem = useCallback(
    (id: string, data: Partial<NavItem>) => {
      const updated = items.map((item) => (item.id === id ? { ...item, ...data } : item));
      updateNavigation(updated);
    },
    [items, updateNavigation]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      const updated = items.filter((item) => item.id !== id);
      updateNavigation(updated);
    },
    [items, updateNavigation]
  );

  const handleAddChild = useCallback(
    (parentId: string, child: NavItem) => {
      const updated = items.map((item) => {
        if (item.id === parentId) {
          return { ...item, children: [...(item.children ?? []), child] };
        }
        return item;
      });
      updateNavigation(updated);
    },
    [items, updateNavigation]
  );

  const handleUpdateChild = useCallback(
    (parentId: string, childId: string, data: Partial<NavItem>) => {
      const updated = items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: item.children?.map((c) => (c.id === childId ? { ...c, ...data } : c)),
          };
        }
        return item;
      });
      updateNavigation(updated);
    },
    [items, updateNavigation]
  );

  const handleDeleteChild = useCallback(
    (parentId: string, childId: string) => {
      const updated = items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: item.children?.filter((c) => c.id !== childId),
          };
        }
        return item;
      });
      updateNavigation(updated);
    },
    [items, updateNavigation]
  );

  // ── Drag-and-drop ──

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Collect all sortable IDs (top-level items + children inside dropdowns)
      const topLevelIds = items.map((item) => item.id);

      // Check if both are top-level
      if (topLevelIds.includes(active.id as string) && topLevelIds.includes(over.id as string)) {
        const oldIndex = topLevelIds.indexOf(active.id as string);
        const newIndex = topLevelIds.indexOf(over.id as string);
        updateNavigation(arrayMove(items, oldIndex, newIndex));
        return;
      }

      // Check if both are children of the same parent
      const activeParent = items.find((item) => item.children?.some((c) => c.id === active.id));
      const overParent = items.find((item) => item.children?.some((c) => c.id === over.id));

      if (activeParent && activeParent.id === overParent?.id && activeParent.children) {
        const oldIndex = activeParent.children.findIndex((c) => c.id === active.id);
        const newIndex = activeParent.children.findIndex((c) => c.id === over.id);
        const newChildren = arrayMove(activeParent.children, oldIndex, newIndex);
        updateNavigation(
          items.map((item) =>
            item.id === activeParent.id ? { ...item, children: newChildren } : item
          )
        );
      }
    },
    [items, updateNavigation]
  );

  // ── All sortable IDs (top-level + children) ──
  const allSortableIds = items.flatMap((item) =>
    item.type === 'dropdown' && item.children
      ? [item.id, ...item.children.map((c) => c.id)]
      : [item.id]
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
          Navegación
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona el menú de navegación principal de tu sitio web.
        </p>
      </div>

      {/* Preview */}
      <NavPreview items={items} brandName={brandName} />

      {/* Main card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base" style={{ color: '#1a2e1a' }}>
                Elementos del menú
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 mt-0.5">
                Arrastra para reordenar. Haz clic en el tipo para editar.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
              {items.length} elemento{items.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          {items.length === 0 && !showAddForm ? (
            <EmptyNavState onAdd={() => setShowAddForm(true)} />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={allSortableIds} strategy={verticalListSortingStrategy}>
                <ScrollArea className="max-h-[480px]">
                  <div className="space-y-1.5 pr-2">
                    {items.map((item) => (
                      <SortableNavItem
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdateItem}
                        onDelete={handleDeleteItem}
                        onAddChild={handleAddChild}
                        onUpdateChild={handleUpdateChild}
                        onDeleteChild={handleDeleteChild}
                      />
                    ))}

                    {/* Add item form */}
                    {showAddForm && (
                      <AddItemForm onAdd={handleAddItem} onClose={() => setShowAddForm(false)} />
                    )}
                  </div>
                </ScrollArea>
              </SortableContext>
            </DndContext>
          )}

          {/* Add button */}
          {!showAddForm && (
            <div className="mt-3">
              <Button
                variant="outline"
                className="w-full gap-2 border-dashed border-gray-400 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="size-4" />
                Añadir elemento al menú
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
