'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// DragHandle — grip handle with vertical dots icon
// ─────────────────────────────────────────────────────────────

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className }: DragHandleProps) {
  return (
    <span
      data-drag-handle="true"
      draggable="false"
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
// Shared context so wrappers can talk to the provider
// ─────────────────────────────────────────────────────────────

const SortableContext = createContext<{
  items: (string | number)[];
  onReorder: (fromIndex: number, toIndex: number) => void;
}>({ items: [], onReorder: () => {} });

// ─────────────────────────────────────────────────────────────
// SortableCardWrapper
// Both a drag source AND a drop target.
// ─────────────────────────────────────────────────────────────

interface SortableCardWrapperProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SortableCardWrapper({ id, children, className, style }: SortableCardWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { items, onReorder } = useContext(SortableContext);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.effectAllowed = 'move';
    const el = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => { el.style.opacity = '0.4'; });
  }, [id]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).style.opacity = '1';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;
    const sourceIdx = items.indexOf(draggedId);
    const targetIdx = items.indexOf(String(id));
    if (sourceIdx === -1 || targetIdx === -1 || sourceIdx === targetIdx) return;
    onReorder(sourceIdx, targetIdx);
  }, [id, items, onReorder]);

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={style}
      className={className}
      data-sortable-id={String(id)}
    >
      <div className={isDragging ? 'rounded-lg opacity-90 shadow-xl ring-2 ring-emerald-400 ring-offset-2' : 'rounded-lg'}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SortableCardsProvider
// Provides context for wrappers; also acts as a fallback drop zone.
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Fallback drop: fires when dropping on empty space between cards
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;
    const container = containerRef.current;
    if (!container) return;
    const allSortable = Array.from(container.querySelectorAll('[data-sortable-id]'));
    const childEl = (e.target as HTMLElement).closest('[data-sortable-id]');
    const targetEl = childEl || allSortable[allSortable.length - 1];
    if (!targetEl) return;
    const targetIdx = allSortable.indexOf(targetEl);
    if (targetIdx === -1) return;
    const sourceIdx = items.indexOf(draggedId);
    if (sourceIdx === -1 || sourceIdx === targetIdx) return;
    onReorder(sourceIdx, targetIdx);
  }, [items, onReorder]);

  return (
    <SortableContext.Provider value={{ items, onReorder }}>
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}
      </div>
    </SortableContext.Provider>
  );
}
