'use client';

import { useState, useCallback, useRef, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Upload,
  X,
  ImageIcon,
  Trash2,
  Check,
  FileImage,
  Calendar,
  Ruler,
  HardDrive,
  Info,
  ChevronLeft,
  Copy,
  Pencil,
} from 'lucide-react';

import { useMediaLibraryStore, formatFileSize } from '@/lib/media-library-store';
import type { MediaItem } from '@/lib/media-library-store';
import { ImageEditor } from '@/components/pageforge/ImageEditor';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// ─────────────────────────────────────────────────────────────
// Thumbnail Card
// ─────────────────────────────────────────────────────────────

function ThumbnailCard({
  item,
  isSelected,
  onSelect,
  onDelete,
}: {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`group relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
          : 'border-gray-400 hover:border-gray-400 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden">
        <img
          src={item.url}
          alt={item.alt || item.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {/* Selection checkmark */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-0.5 shadow">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
        {/* Delete button on hover */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Eliminar"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        {/* File type badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">
          {item.width}×{item.height}
        </div>
      </div>
      {/* Filename */}
      <div className="px-2 py-1.5 bg-white">
        <p className="text-xs text-gray-700 truncate font-medium" title={item.name}>
          {item.name}
        </p>
        <p className="text-[10px] text-gray-500">{formatFileSize(item.size)}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Attachment Details Panel
// ─────────────────────────────────────────────────────────────

function AttachmentDetails({
  item,
  onUpdate,
  onRemove,
  onBack,
  onConfirm,
}: {
  item: MediaItem;
  onUpdate: (partial: Partial<MediaItem>) => void;
  onRemove: () => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [editingImage, setEditingImage] = useState(false);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      toast.success('URL copiada al portapapeles');
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

  const uploadedDate = useMemo(() => {
    try {
      return new Date(item.uploadedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return item.uploadedAt;
    }
  }, [item.uploadedAt]);

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
      <div className="px-4 py-3 border-b border-gray-400 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a la biblioteca
        </button>
      </div>

      {/* Image preview */}
      <div className="px-4 pt-4">
        <div className="relative rounded-lg overflow-hidden bg-gray-200 border border-gray-400">
          <img
            src={item.url}
            alt={item.alt || item.name}
            className="w-full h-auto max-h-64 object-contain"
          />
        </div>
      </div>

      {/* Details form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Filename (read-only) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Nombre del archivo</Label>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-md border border-gray-400">
            <FileImage className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{item.name}</span>
          </div>
        </div>

        {/* Alt text */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Texto alternativo</Label>
          <Input
            value={item.alt}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Describe la imagen para accesibilidad..."
            className="h-8 text-sm"
          />
        </div>

        {/* Caption */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Leyenda</Label>
          <Textarea
            value={item.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Agrega una leyenda..."
            rows={2}
            className="text-sm"
          />
        </div>

        {/* URL (read-only with copy) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">URL de la imagen</Label>
          <div className="flex items-center gap-1">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-md border border-gray-400 min-w-0">
              <span className="text-xs text-gray-500 truncate font-mono">
                {item.url.substring(0, 60)}...
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleCopyUrl}
              title="Copiar URL"
            >
              <Copy className={`h-3.5 w-3.5 ${copied ? 'text-emerald-500' : ''}`} />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-gray-500">Detalles del archivo</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Ruler className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span>{item.width} × {item.height}px</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HardDrive className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span>{formatFileSize(item.size)}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span className="text-xs">{uploadedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-gray-400 bg-white space-y-2">
        <Button
          onClick={onConfirm}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Check className="h-4 w-4 mr-2" />
          Seleccionar esta imagen
        </Button>
        <Button
          variant="outline"
          onClick={() => setEditingImage(true)}
          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar Imagen
        </Button>
        <Button
          variant="outline"
          onClick={onRemove}
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar permanentemente
        </Button>
      </div>
    </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Upload Zone
// ─────────────────────────────────────────────────────────────

function UploadZone({
  onFilesSelected,
  isDragOver,
  setIsDragOver,
}: {
  onFilesSelected: (files: File[]) => void;
  isDragOver: boolean;
  setIsDragOver: (val: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    },
    [setIsDragOver],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    },
    [setIsDragOver],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [setIsDragOver, onFilesSelected],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      if (inputRef.current) {
        inputRef.current.value = '';
      }
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
        relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
        p-8 transition-all cursor-pointer
        ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
            : 'border-gray-400 bg-gray-200/50 hover:border-gray-400 hover:bg-gray-200'
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
      <div
        className={`rounded-full p-3 transition-colors ${
          isDragOver ? 'bg-emerald-100' : 'bg-gray-200'
        }`}
      >
        <Upload
          className={`h-6 w-6 transition-colors ${
            isDragOver ? 'text-emerald-600' : 'text-gray-500'
          }`}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {isDragOver ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí o haz clic'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, GIF, WebP, SVG — Máximo 5MB por imagen
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-200 p-4 mb-4">
        <ImageIcon className="h-8 w-8 text-gray-500" />
      </div>
      <p className="text-sm font-medium text-gray-500">No hay imágenes en la biblioteca</p>
      <p className="text-xs text-gray-500 mt-1">
        Sube imágenes usando la zona de carga arriba
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dialog Content
// ─────────────────────────────────────────────────────────────

function MediaLibraryDialogContent({
  onInsert,
  children,
}: {
  onInsert?: (url: string) => void;
  children: ReactNode;
}) {
  const { mediaItems, addMedia, removeMedia, updateMedia } = useMediaLibraryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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
          toast.error(err instanceof Error ? err.message : 'Error al subir imagen');
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} correctamente`);
      }
      setIsUploading(false);
    },
    [addMedia],
  );

  const handleDelete = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const item = mediaItems.find((m) => m.id === id);
      removeMedia(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
      toast.success(`"${item?.name || 'Imagen'}" eliminada`);
    },
    [removeMedia, selectedId, mediaItems],
  );

  const handleSelectFromGrid = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleBackFromDetails = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (selectedItem && onInsert) {
      onInsert(selectedItem.url);
    }
  }, [selectedItem, onInsert]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedId) {
      const item = mediaItems.find((m) => m.id === selectedId);
      removeMedia(selectedId);
      setSelectedId(null);
      toast.success(`"${item?.name || 'Imagen'}" eliminada`);
    }
  }, [selectedId, removeMedia, mediaItems]);

  return (
    <div className="flex flex-col h-[75vh] max-h-[700px]">
      {/* Dark header */}
      <div className="bg-[#1a1a1a] px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <ImageIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Biblioteca de Medios</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {mediaItems.length} imagen{mediaItems.length !== 1 ? 'es' : ''} en la biblioteca
              </p>
            </div>
          </div>
          {isUploading && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent" />
              Subiendo...
            </div>
          )}
        </div>
      </div>

      {/* Upload zone */}
      <div className="px-4 pt-4">
        <UploadZone
          onFilesSelected={handleFilesSelected}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden mt-3">
        {/* Grid view */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="h-3.5 w-3.5" />
              <span>Haz clic en una imagen para ver sus detalles</span>
            </div>
          </div>

          {mediaItems.length === 0 ? (
            <div className="flex-1 px-4">
              <EmptyState />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <AnimatePresence mode="popLayout">
                  {mediaItems.map((item) => (
                    <ThumbnailCard
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      onSelect={() => handleSelectFromGrid(item.id)}
                      onDelete={(e) => handleDelete(item.id, e)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Attachment Details sidebar */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="border-l border-gray-400 bg-[#f0f0eb] overflow-hidden shrink-0"
            >
              <div className="w-80 h-full">
                <AttachmentDetails
                  item={selectedItem}
                  onUpdate={(partial) => updateMedia(selectedItem.id, partial)}
                  onRemove={handleRemoveSelected}
                  onBack={handleBackFromDetails}
                  onConfirm={handleConfirmSelection}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with children (e.g., "Insertar en el tema" button from parent) */}
      {children && (
        <div className="px-4 py-3 border-t border-gray-400 bg-white rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MediaLibraryDialog Component
// ─────────────────────────────────────────────────────────────

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (url: string) => void;
  onInsert?: (url: string) => void;
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  onInsert,
}: MediaLibraryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen;

  const handleInsert = useCallback(
    (url: string) => {
      if (onSelect) onSelect(url);
      if (onInsert) onInsert(url);
      handleOpenChange(false);
    },
    [onSelect, onInsert, handleOpenChange],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl max-w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden bg-[#f0f0eb] rounded-xl"
      >
        {/* Accessibility: required by Radix Dialog */}
        <DialogHeader className="sr-only">
          <DialogTitle>Biblioteca de Medios</DialogTitle>
          <DialogDescription>
            Sube y selecciona imágenes para tu theme WordPress
          </DialogDescription>
        </DialogHeader>

        <MediaLibraryDialogContent onInsert={handleInsert}>
          {/* Close button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Selecciona una imagen para insertarla en tu proyecto
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Cerrar
            </Button>
          </div>
        </MediaLibraryDialogContent>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// useMediaPicker Hook
// ─────────────────────────────────────────────────────────────

export function useMediaPicker() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const resolveRef = useRef<((url: string | null) => void) | null>(null);

  const pickImage = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogOpen(true);
    });
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      setDialogOpen(false);
      if (resolveRef.current) {
        resolveRef.current(url);
        resolveRef.current = null;
      }
    },
    [],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open && resolveRef.current) {
        resolveRef.current(null);
        resolveRef.current = null;
      }
    },
    [],
  );

  const Dialog = useMemo(
    () =>
      function MediaPickerDialog() {
        return (
          <MediaLibraryDialog
            open={dialogOpen}
            onOpenChange={handleOpenChange}
            onSelect={handleSelect}
          />
        );
      },
    [dialogOpen, handleOpenChange, handleSelect],
  );

  return { pickImage, MediaLibraryDialog: Dialog };
}

// ─────────────────────────────────────────────────────────────
// Standalone MediaLibraryBrowser (for embedding without dialog)
// ─────────────────────────────────────────────────────────────

export function MediaLibraryBrowser({
  onInsert,
}: {
  onInsert?: (url: string) => void;
}) {
  return (
    <MediaLibraryDialogContent onInsert={onInsert}>
      {onInsert && (
        <p className="text-xs text-gray-500">
          Haz clic en una imagen para ver sus detalles, luego selecciona &quot;Seleccionar esta imagen&quot;
        </p>
      )}
    </MediaLibraryDialogContent>
  );
}

export default MediaLibraryDialog;
