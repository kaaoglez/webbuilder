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
  FileVideo,
  FileAudio,
  FileText,
  File,
  Calendar,
  Ruler,
  HardDrive,
  Info,
  ChevronLeft,
  Copy,
  Pencil,
  Film,
  Music,
} from 'lucide-react';

import { useMediaLibraryStore, formatFileSize, ACCEPT_STRING } from '@/lib/media-library-store';
import type { MediaItem, MediaType } from '@/lib/media-library-store';
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
// Helpers
// ─────────────────────────────────────────────────────────────

function getMediaTypeLabel(type: MediaType): string {
  switch (type) {
    case 'image': return 'Imagen';
    case 'video': return 'Video';
    case 'audio': return 'Audio';
    case 'document': return 'Documento';
    default: return 'Archivo';
  }
}

function ThumbnailTypeIcon({ type }: { type: MediaType }) {
  const className = 'h-6 w-6';
  switch (type) {
    case 'image': return <FileImage className={className} />;
    case 'video': return <FileVideo className={className} />;
    case 'audio': return <FileAudio className={className} />;
    case 'document': return <FileText className={className} />;
    default: return <File className={className} />;
  }
}

function getMediaTypeBg(type: MediaType): string {
  switch (type) {
    case 'image': return 'bg-blue-100 text-blue-600';
    case 'video': return 'bg-purple-100 text-purple-600';
    case 'audio': return 'bg-amber-100 text-amber-600';
    case 'document': return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-200 text-gray-500';
  }
}

// Small icon component (declared outside render)
function MediaTypeIconBadge({ type }: { type: MediaType }) {
  const className = 'h-3 w-3';
  switch (type) {
    case 'image': return <FileImage className={className} />;
    case 'video': return <FileVideo className={className} />;
    case 'audio': return <FileAudio className={className} />;
    case 'document': return <FileText className={className} />;
    default: return <File className={className} />;
  }
}

function MediaTypeIconField({ type }: { type: MediaType }) {
  const className = 'h-3.5 w-3.5 text-gray-500 shrink-0';
  switch (type) {
    case 'image': return <FileImage className={className} />;
    case 'video': return <FileVideo className={className} />;
    case 'audio': return <FileAudio className={className} />;
    case 'document': return <FileText className={className} />;
    default: return <File className={className} />;
  }
}

function getMediaTypeBadgeColor(type: MediaType): string {
  switch (type) {
    case 'image': return 'bg-blue-500';
    case 'video': return 'bg-purple-500';
    case 'audio': return 'bg-amber-500';
    case 'document': return 'bg-gray-500';
    default: return 'bg-gray-400';
  }
}

function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

function getItemType(item: MediaItem): MediaType {
  return item.mediaType || 'image';
}

// ─────────────────────────────────────────────────────────────
// Thumbnail Card
// ─────────────────────────────────────────────────────────────

function ThumbnailCard({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onDelete,
}: {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const type = getItemType(item);

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
          : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
      }`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {/* Preview area */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {type === 'image' ? (
          <>
            <img
              src={item.url}
              alt={item.alt || item.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {/* Dimensions badge */}
            {item.width > 0 && item.height > 0 && (
              <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {item.width}×{item.height}
              </div>
            )}
          </>
        ) : type === 'video' ? (
          <div className="relative h-full w-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              preload="metadata"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-2.5 shadow-lg">
                <Film className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            {/* Video badge */}
            <div className="absolute top-1.5 left-1.5 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium uppercase">
              Video
            </div>
            {item.width > 0 && item.height > 0 && (
              <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {item.width}×{item.height}
              </div>
            )}
          </div>
        ) : type === 'audio' ? (
          <div className="h-full w-full bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center gap-2 p-3">
            <div className="rounded-full bg-amber-200 p-3">
              <Music className="h-6 w-6 text-amber-600" />
            </div>
            <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium uppercase">
              Audio
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-2 p-3">
            <div className={`rounded-lg p-3 ${getMediaTypeBg(type)}`}>
              <ThumbnailTypeIcon type={type} />
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
              {getFileExtension(item.name)}
            </span>
          </div>
        )}

        {/* Selection checkmark */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-0.5 shadow z-10">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}

        {/* Delete button on hover */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Eliminar"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Filename */}
      <div className="px-2 py-1.5 bg-white">
        <p className="text-xs text-gray-700 truncate font-medium" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${getMediaTypeBadgeColor(type)}`} />
          <p className="text-[10px] text-gray-500">{formatFileSize(item.size)}</p>
        </div>
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

  const type = getItemType(item);
  const isImage = type === 'image';
  const isVideo = type === 'video';
  const isAudio = type === 'audio';

  return (
    <>
      {editingImage && isImage && (
        <ImageEditor
          item={item}
          onSave={handleImageEdited}
          onClose={() => setEditingImage(false)}
        />
      )}
      <div className="flex flex-col h-full">
        {/* Header: Back button + action icons */}
        <div className="px-3 py-2.5 border-b border-gray-300 bg-white flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </button>
          <div className="flex items-center gap-1">
            {isImage && (
              <button
                onClick={() => setEditingImage(true)}
                className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"
                title="Editar imagen"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onRemove}
              className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="px-3 pt-3">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
            {isImage && (
              <img
                src={item.url}
                alt={item.alt || item.name}
                className="w-full h-auto max-h-36 object-contain"
              />
            )}
            {isVideo && (
              <video
                src={item.url}
                controls
                className="w-full h-auto max-h-36 bg-black"
                preload="metadata"
              />
            )}
            {isAudio && (
              <div className="flex items-center justify-center py-6 bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="text-center">
                  <Music className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <audio src={item.url} controls className="w-full max-w-[280px]" />
                </div>
              </div>
            )}
            {!isImage && !isVideo && !isAudio && (
              <div className="flex items-center justify-center py-6 bg-gray-50">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-mono">{getFileExtension(item.name)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details form - scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {/* Media type badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${getMediaTypeBg(type)}`}>
              <MediaTypeIconBadge type={type} />
              {getMediaTypeLabel(type)}
            </span>
            {item.mimeType && (
              <span className="text-[10px] text-gray-400 font-mono truncate">{item.mimeType}</span>
            )}
          </div>

          {/* Filename (read-only) */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-gray-500">Nombre del archivo</Label>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 rounded-md border border-gray-300">
              <MediaTypeIconField type={type} />
              <span className="text-xs text-gray-700 truncate">{item.name}</span>
            </div>
          </div>

          {/* Alt text - only for images */}
          {isImage && (
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-gray-500">Texto alternativo</Label>
              <Input
                value={item.alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Describe la imagen..."
                className="h-7 text-xs"
              />
            </div>
          )}

          {/* Caption */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-gray-500">Leyenda</Label>
            <Textarea
              value={item.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Agrega una leyenda..."
              rows={2}
              className="text-xs"
            />
          </div>

          {/* URL (read-only with copy) */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-gray-500">URL del archivo</Label>
            <div className="flex items-center gap-1">
              <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 rounded-md border border-gray-300 min-w-0">
                <span className="text-[11px] text-gray-500 truncate font-mono">
                  {item.url.substring(0, 50)}...
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={handleCopyUrl}
                title="Copiar URL"
              >
                <Copy className={`h-3 w-3 ${copied ? 'text-emerald-500' : ''}`} />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Metadata - compact */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-gray-500">Detalles</Label>
            <div className="grid grid-cols-2 gap-2">
              {item.width > 0 && item.height > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Ruler className="h-3 w-3 text-gray-500 shrink-0" />
                  <span>{item.width} × {item.height}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <HardDrive className="h-3 w-3 text-gray-500 shrink-0" />
                <span>{formatFileSize(item.size)}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar className="h-3 w-3 text-gray-500 shrink-0" />
                <span className="text-[11px]">{uploadedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION - always visible at bottom */}
        <div className="px-3 py-3 border-t border-gray-300 bg-white shrink-0">
          <Button
            onClick={onConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Seleccionar este {getMediaTypeLabel(type).toLowerCase()}
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

      const files = Array.from(e.dataTransfer.files);
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
        relative flex items-center justify-center gap-4 rounded-xl border-2 border-dashed
        py-3 px-4 transition-all cursor-pointer
        ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <div
        className={`rounded-full p-2 transition-colors shrink-0 ${
          isDragOver ? 'bg-emerald-100' : 'bg-gray-200'
        }`}
      >
        <Upload
          className={`h-5 w-5 transition-colors ${
            isDragOver ? 'text-emerald-600' : 'text-gray-500'
          }`}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {isDragOver ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para buscar'}
        </p>
        <p className="text-xs text-gray-500">
          Imágenes, Videos, Audio, Documentos — hasta 50MB
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Full-area Drag Overlay
// ─────────────────────────────────────────────────────────────

function DragOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-sm rounded-xl border-2 border-dashed border-emerald-500"
    >
      <div className="rounded-full bg-emerald-100 p-5 mb-3">
        <Upload className="h-10 w-10 text-emerald-600" />
      </div>
      <p className="text-lg font-semibold text-emerald-700">Suelta los archivos aquí</p>
      <p className="text-sm text-emerald-600 mt-1">Imágenes, videos, audio y documentos</p>
    </motion.div>
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
      <p className="text-sm font-medium text-gray-500">No hay medios en la biblioteca</p>
      <p className="text-xs text-gray-500 mt-1">
        Sube imágenes, videos, audio o documentos usando la zona de carga
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          toast.error(err instanceof Error ? err.message : 'Error al subir archivo');
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} archivo${successCount > 1 ? 's' : ''} subido${successCount > 1 ? 's' : ''} correctamente`
        );
      }
      setIsUploading(false);
    },
    [addMedia],
  );

  // ── Full-area drag handlers ──
  const handleAreaDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only show overlay if dragging files (not text/links)
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleAreaDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleAreaDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFilesSelected(files);
      }
    },
    [handleFilesSelected],
  );

  // ── File browser button ──
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFilesSelected(files);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFilesSelected],
  );

  const handleDelete = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const item = mediaItems.find((m) => m.id === id);
      removeMedia(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
      toast.success(`"${item?.name || 'Archivo'}" eliminado`);
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
      toast.success(`"${item?.name || 'Archivo'}" eliminado`);
    }
  }, [selectedId, removeMedia, mediaItems]);

  return (
    <div
      className="relative flex flex-col h-[92vh] max-h-[900px]"
      onDragOver={handleAreaDragOver}
      onDragLeave={handleAreaDragLeave}
      onDrop={handleAreaDrop}
    >
      {/* Hidden file input for the header buttons */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_STRING}
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Full-area drag overlay */}
      <AnimatePresence>
        {isDragOver && <DragOverlay />}
      </AnimatePresence>

      {/* Dark header */}
      <div className="bg-[#1a1a1a] px-5 py-3 rounded-t-lg relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-1.5">
              <ImageIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Biblioteca de Medios</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {mediaItems.length} archivo{mediaItems.length !== 1 ? 's' : ''} en la biblioteca
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUploading && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent" />
                Subiendo...
              </div>
            )}
            <button
              onClick={handleBrowseClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Subir archivos
            </button>
          </div>
        </div>
      </div>

      {/* Upload zone - always visible */}
      <div className="px-4 pt-3 relative z-10">
        <UploadZone
          onFilesSelected={handleFilesSelected}
          isDragOver={false}
          setIsDragOver={() => {}}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative z-10">
        {/* Grid view */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="h-3.5 w-3.5" />
              <span>Haz clic para ver detalles. Doble clic para seleccionar. Arrastra archivos para subir.</span>
            </div>
            {children && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 hidden sm:block">
                  Selecciona un archivo para insertarlo
                </p>
                {children}
              </div>
            )}
          </div>

          {mediaItems.length === 0 ? (
            <div className="flex-1 px-4">
              <EmptyState />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                <AnimatePresence mode="popLayout">
                  {mediaItems.map((item) => (
                    <ThumbnailCard
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      onSelect={() => handleSelectFromGrid(item.id)}
                      onDoubleClick={() => {
                        if (onInsert) onInsert(item.url);
                      }}
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
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="border-l border-gray-300 bg-[#f0f0eb] overflow-hidden shrink-0"
            >
              <div className="w-[340px] h-full">
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
        className="sm:max-w-6xl max-w-[calc(100vw-1rem)] p-0 gap-0 overflow-hidden bg-[#f0f0eb] rounded-xl"
      >
        {/* Accessibility: required by Radix Dialog */}
        <DialogHeader className="sr-only">
          <DialogTitle>Biblioteca de Medios</DialogTitle>
          <DialogDescription>
            Sube y selecciona archivos multimedia para tu proyecto WordPress
          </DialogDescription>
        </DialogHeader>

        <MediaLibraryDialogContent onInsert={handleInsert}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="h-7 text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cerrar
          </Button>
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
          Haz clic en un archivo para ver sus detalles, luego selecciona &quot;Seleccionar&quot;
        </p>
      )}
    </MediaLibraryDialogContent>
  );
}

export default MediaLibraryDialog;
