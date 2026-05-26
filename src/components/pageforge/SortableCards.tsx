'use client';

import React, { useCallback, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// DragHandle — grip handle with 6-point icon (⠿)
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
// SortableCardWrapper
// Makes a card draggable within its parent SortableCardsProvider
// ─────────────────────────────────────────────────────────────

interface SortableCardWrapperProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SortableCardWrapper({ id, children, className, style }: SortableCardWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable="true"
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', String(id));
        e.dataTransfer.effectAllowed = 'move';
        const target = e.currentTarget as HTMLElement;
        requestAnimationFrame(() => {
          target.style.opacity = '0.4';
        });
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }}
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
// Wraps children and handles drag & drop reordering
// ─────────────────────────────────────────────────────────────

interface SortableCardsProviderProps {
  items: (string | number)[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  children: React.ReactNode;
  strategy?: unknown;
}

export function SortableCardsProvider({
  items,
  onReorder,
  children,
}: SortableCardsProviderProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const container = containerRef.current;
    if (!container) return;
    const childEl = (e.target as HTMLElement).closest('[data-sortable-id]');
    if (!childEl) { setDragOverIndex(null); return; }
    const idx = Array.from(container.children).indexOf(childEl);
    setDragOverIndex(idx);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(null);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;
    const container = containerRef.current;
    if (!container) return;
    const childEl = (e.target as HTMLElement).closest('[data-sortable-id]');
    if (!childEl) return;
    const targetIdx = Array.from(container.children).indexOf(childEl);
    if (targetIdx === -1) return;
    const sourceIdx = items.indexOf(draggedId);
    if (sourceIdx === -1 || sourceIdx === targetIdx) return;
    onReorder(sourceIdx, targetIdx);
  }, [items, onReorder]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && container.contains(relatedTarget)) return;
    setDragOverIndex(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {children}
    </div>
  );
}

export { useDragHandle };
