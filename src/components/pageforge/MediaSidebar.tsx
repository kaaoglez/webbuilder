'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Upload,
  ImageIcon,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  FileImage,
  Ruler,
  HardDrive,
  Copy,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { useMediaLibraryStore, formatFileSize } from '@/lib/media-library-store';
import type { MediaItem } from '@/lib/media-library-store';
import { ImageEditor } from '@/components/pageforge/ImageEditor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml';

// ─────────────────────────────────────────────────────────────
// Compact Upload Zone for sidebar
// ─────────────────────────────────────────────────────────────

function CompactUploadZone({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected],
  );

  const handleClick = useCallback(() => inputRef.current?.click(), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) onFilesSelected(files);
      if (inputRef.current) inputRef.current.value = '';
    },
    [onFilesSelected],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative flex items-center justify-center gap-2 rounded-lg border-2 border-dashed
        p-3 transition-all cursor-pointer
        ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
            : 'border-gray-400 bg-gray-200/50 hover:border-emerald-400 hover:bg-emerald-50/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <div className={`rounded-md p-1.5 transition-colors ${isDragOver ? 'bg-emerald-100' : 'bg-gray-200'}`}>
        <Upload className={`h-4 w-4 transition-colors ${isDragOver ? 'text-emerald-600' : 'text-gray-500'}`} />
      </div>
      <span className="text-xs font-medium text-gray-600">{isDragOver ? 'Suelta aquí' : 'Subir imágenes'}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sidebar Thumbnail
// ─────────────────────────────────────────────────────────────

function SidebarThumbnail({
  item,
  isSelected,
  onSelect,
}: {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      layout
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`
        group relative aspect-square rounded-lg border-2 overflow-hidden transition-all
        ${
          isSelected
            ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
            : 'border-gray-400 hover:border-emerald-300 hover:shadow-sm'
        }
      `}
    >
      <img
        src={item.url}
        alt={item.alt || item.name}
        className="h-full w-full object-cover"
      />
      {/* Hover overlay with quick actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Pencil className="h-5 w-5 text-white drop-shadow-lg" />
      </div>
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1 left-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
          <Check className="h-2.5 w-2.5" />
        </div>
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────
// Image Details Panel (slides over the grid)
// ─────────────────────────────────────────────────────────────

function ImageDetailsPanel({
  item,
  onUpdate,
  onRemove,
  onBack,
}: {
  item: MediaItem;
  onUpdate: (partial: Partial<MediaItem>) => void;
  onRemove: () => void;
  onBack: () => void;
}) {
  const [editingImage, setEditingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      toast.success('URL copiada');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.url]);

  const handleImageEdited = useCallback(
    (newUrl: string, width: number, height: number) => {
      onUpdate({ url: newUrl, width, height });
      setEditingImage(false);
      toast.success('Imagen editada y guardada');
    },
    [onUpdate],
  );

  return (
    <>
      {editingImage && (
        <ImageEditor
          item={item}
          onSave={handleImageEdited}
          onClose={() => setEditingImage(false)}
        />
      )}
      <div className="flex flex-col h-full">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Volver
        </button>

        {/* Image preview */}
        <div className="px-3 pb-3">
          <div className="rounded-lg overflow-hidden bg-gray-200 border border-gray-400">
            <img
              src={item.url}
              alt={item.alt || item.name}
              className="w-full h-auto max-h-40 object-contain"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto px-3 space-y-3">
          {/* Filename */}
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Archivo</Label>
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-200 rounded border border-gray-400">
              <FileImage className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span className="text-xs text-gray-700 truncate">{item.name}</span>
            </div>
          </div>

          {/* Alt text */}
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Alt</Label>
            <Input
              value={item.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Texto alternativo..."
              className="h-7 text-xs"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Leyenda</Label>
            <Textarea
              value={item.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Leyenda..."
              rows={2}
              className="text-xs"
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Ruler className="h-3 w-3" />
              <span>{item.width}×{item.height}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3 w-3" />
              <span>{formatFileSize(item.size)}</span>
            </div>
          </div>

          <Separator />

          {/* Copy URL */}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs gap-1.5 border-gray-400"
            onClick={handleCopyUrl}
          >
            <Copy className={`h-3 w-3 ${copied ? 'text-emerald-500' : ''}`} />
            {copied ? '¡Copiada!' : 'Copiar URL'}
          </Button>

          {/* Edit Image */}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setEditingImage(true)}
          >
            <Pencil className="h-3 w-3" />
            Editar Imagen
          </Button>

          {/* Delete */}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onRemove}
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────

function EmptySidebar() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-200 p-3 mb-3">
        <ImageIcon className="h-6 w-6 text-gray-500" />
      </div>
      <p className="text-xs font-medium text-gray-500">Sin imágenes</p>
      <p className="text-[10px] text-gray-500 mt-1">Sube imágenes para tu theme</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main MediaSidebar Component
// ─────────────────────────────────────────────────────────────

interface MediaSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MediaSidebar({ isOpen, onToggle }: MediaSidebarProps) {
  const { mediaItems, addMedia, removeMedia, updateMedia } = useMediaLibraryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectedItem = useMemo(
    () => mediaItems.find((item) => item.id === selectedId) || null,
    [mediaItems, selectedId],
  );

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      let successCount = 0;
      let errorCount = 0;
      for (const file of files) {
        try {
          await addMedia(file);
          successCount++;
        } catch (err) {
          errorCount++;
          toast.error(err instanceof Error ? err.message : 'Error al subir');
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''}`);
      }
      setIsUploading(false);
    },
    [addMedia],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeleteConfirmId(id);
    },
    [],
  );

  const confirmDelete = useCallback(
    (id: string) => {
      const item = mediaItems.find((m) => m.id === id);
      removeMedia(id);
      if (selectedId === id) setSelectedId(null);
      setDeleteConfirmId(null);
      toast.success(`"${item?.name || 'Imagen'}" eliminada`);
    },
    [removeMedia, selectedId, mediaItems],
  );

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      {/* Toggle button when sidebar is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={onToggle}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-20 bg-[#1B4332] text-white rounded-r-lg p-2 shadow-lg hover:bg-[#15362a] transition-colors"
            title="Abrir Biblioteca de Medios"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full bg-white border-r border-gray-400 flex flex-col overflow-hidden shrink-0"
          >
            <div className="w-[280px] h-full flex flex-col">
              {/* Header */}
              <div className="px-3 py-3 bg-[#1B4332] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-white/10 p-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-xs">Biblioteca de Medios</h2>
                    <p className="text-emerald-200/60 text-[10px]">
                      {mediaItems.length} imagen{mediaItems.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isUploading && (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-emerald-300 border-t-transparent mr-1" />
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onToggle}
                        className="text-emerald-200/60 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
                        title="Cerrar panel"
                      >
                        <PanelLeftClose className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Cerrar panel</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Upload zone */}
              <div className="px-3 pt-3 shrink-0">
                <CompactUploadZone onFilesSelected={handleFilesSelected} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-h-0 mt-3">
                {selectedItem ? (
                  /* Image Details Panel */
                  <ImageDetailsPanel
                    item={selectedItem}
                    onUpdate={(partial) => updateMedia(selectedItem.id, partial)}
                    onRemove={() => handleDelete(selectedItem.id)}
                    onBack={handleBack}
                  />
                ) : mediaItems.length === 0 ? (
                  <EmptySidebar />
                ) : (
                  /* Image Grid */
                  <div className="flex-1 overflow-y-auto px-3 pb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <AnimatePresence mode="popLayout">
                        {mediaItems.map((item) => (
                          <SidebarThumbnail
                            key={item.id}
                            item={item}
                            isSelected={selectedId === item.id}
                            onSelect={() => setSelectedId(item.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen se eliminará permanentemente de la biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteConfirmId) confirmDelete(deleteConfirmId); }} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

export default MediaSidebar;
