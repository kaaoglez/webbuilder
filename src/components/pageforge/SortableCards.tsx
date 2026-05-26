'use client';

import React, { createContext, useContext } from 'react';
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
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Internal context: dnd-kit listeners forwarded to DragHandle
// ─────────────────────────────────────────────────────────────

const HandleContext = createContext<{
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown> | undefined;
} | null>(null);

// ─────────────────────────────────────────────────────────────
// DragHandle — grip icon, ONLY initiates drag via dnd-kit listeners
// ─────────────────────────────────────────────────────────────

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className }: DragHandleProps) {
  const ctx = useContext(HandleContext);

  return (
    <span
      {...(ctx?.attributes || {})}
      {...(ctx?.listeners || {})}
      data-drag-handle="true"
      suppressHydrationWarning
      className={[
        'text-gray-400 hover:text-gray-600',
        'cursor-grab active:cursor-grabbing',
        'shrink-0 p-1 rounded-md',
        'hover:bg-gray-200/60 transition-colors touch-none',
        'select-none',
        className || '',
      ].join(' ')}
      aria-label="Arrastrar para reordenar"
    >
      <GripVertical className="h-5 w-5" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// SortableCardWrapper (public API)
// Delegates to dnd-kit version when inside a provider,
// or renders as plain div when outside (safe fallback).
// ─────────────────────────────────────────────────────────────

interface SortableCardWrapperProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SortableCardWrapper({ id, children, className, style }: SortableCardWrapperProps) {
  const ctx = useContext(HandleContext);

  // If no context, render as plain non-draggable wrapper (safe fallback)
  if (!ctx) {
    return (
      <div style={style} className={className} data-sortable-id={String(id)}>
        <div className="rounded-lg">{children}</div>
      </div>
    );
  }

  return (
    <SortableCardWrapperInner id={id} className={className} style={style}>
      {children}
    </SortableCardWrapperInner>
  );
}

// ─────────────────────────────────────────────────────────────
// SortableCardWrapperInner — uses dnd-kit useSortable
// ONLY rendered when inside a SortableCardsProvider
// ─────────────────────────────────────────────────────────────

function SortableCardWrapperInner({
  id,
  children,
  className,
  style,
}: SortableCardWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const wrapperStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={wrapperStyle} className={className} data-sortable-id={String(id)}>
      <div className={isDragging ? 'rounded-lg shadow-lg ring-2 ring-emerald-300 opacity-90' : 'rounded-lg'}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SortableCardsProvider
// Wraps children in dnd-kit DndContext + SortableContext.
// ─────────────────────────────────────────────────────────────

interface SortableCardsProviderProps {
  items: (string | number)[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  children: React.ReactNode;
}

export function SortableCardsProvider({
  items,
  onReorder,
  children,
}: SortableCardsProviderProps) {
  // Filter out null/undefined items (can happen during SSR hydration)
  const safeItems = items.filter((item): item is string | number => item != null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = safeItems.indexOf(active.id);
    const newIndex = safeItems.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={safeItems}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
