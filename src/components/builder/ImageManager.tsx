'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Upload,
  Image as ImageIcon,
  X,
  Trash2,
  ExternalLink,
  ImagePlus,
  Loader2,
  Check,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface UploadedImage {
  url: string;
  name: string;
  uploadedAt: number;
}

interface ImageManagerProps {
  /** Currently selected image URL */
  value?: string;
  /** Called when image is selected */
  onChange: (url: string) => void;
  /** Label for the trigger button */
  label?: string;
  /** Component mode */
  mode?: 'select' | 'manage';
  /** Whether the popover/dialog is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const STORAGE_KEY = 'builder-uploaded-images';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function loadImagesFromSession(): UploadedImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UploadedImage[];
  } catch {
    return [];
  }
}

function saveImagesToSession(images: UploadedImage[]) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {
    // sessionStorage full – silently ignore
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────
// Upload Zone Sub-component
// ─────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (files: FileList | null) => void;
  isUploading: boolean;
}

function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (!isUploading) {
        onUpload(e.dataTransfer.files);
      }
    },
    [isUploading, onUpload]
  );

  const handleClick = useCallback(() => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  }, [isUploading]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Subir imagen"
      className={`
        flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl
        border-2 border-dashed p-6 text-center transition-all duration-200
        ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60'
            : 'border-gray-400 bg-muted/30 hover:border-emerald-400 hover:bg-muted/50'
        }
        ${isUploading ? 'pointer-events-none opacity-60' : ''}
      `}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => onUpload(e.target.files)}
        disabled={isUploading}
      />

      {isUploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <Upload className="h-5 w-5 text-emerald-600" />
        </div>
      )}

      <p className="text-sm font-medium text-gray-700">
        {isUploading ? 'Subiendo…' : 'Arrastra o haz clic para subir'}
      </p>
      <p className="text-xs text-gray-500">
        JPG, PNG, WebP, GIF, SVG · Máx. 5 MB
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Image Grid Sub-component
// ─────────────────────────────────────────────────────────────

interface ImageGridProps {
  images: UploadedImage[];
  selectedUrl?: string;
  onSelect: (image: UploadedImage) => void;
  onDelete: (url: string) => void;
}

function ImageGrid({ images, selectedUrl, onSelect, onDelete }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <ImageIcon className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500">No hay imágenes subidas</p>
        <p className="text-xs text-gray-500">
          Sube imágenes usando la zona de arriba
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image) => {
        const isSelected = image.url === selectedUrl;
        return (
          <div
            key={image.url}
            className={`
              group relative aspect-square cursor-pointer overflow-hidden rounded-lg
              transition-all duration-150
              ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2' : 'ring-1 ring-gray-200 hover:ring-gray-300'}
            `}
            onClick={() => onSelect(image)}
            role="button"
            tabIndex={0}
            aria-label={`Seleccionar ${image.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(image);
              }
            }}
          >
            {/* Thumbnail */}
            <img
              src={image.url}
              alt={image.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <p className="mb-1 w-full truncate px-2 text-center text-xs font-medium text-white">
                {image.name}
              </p>
              <div className="flex w-full gap-1 px-1.5 pb-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 flex-1 gap-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(image);
                  }}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  {isSelected ? 'Seleccionada' : 'Seleccionar'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.url);
                  }}
                  aria-label={`Eliminar ${image.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Selected check */}
            {isSelected && (
              <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// URL Input Sub-component
// ─────────────────────────────────────────────────────────────

interface UrlInputProps {
  onSelect: (url: string) => void;
}

function UrlInput({ onSelect }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleApply = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error('Por favor, ingresa una URL válida.');
      return;
    }

    try {
      // Basic URL validation
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        toast.error('La URL debe comenzar con http:// o https://.');
        return;
      }
    } catch {
      toast.error('URL inválida. Verifica el formato e intenta de nuevo.');
      return;
    }

    onSelect(trimmed);
    setUrl('');
    setPreview(null);
    setImageError(false);
  }, [url, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      }
    },
    [handleApply]
  );

  const handlePreview = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setPreview(null);
      setImageError(false);
      return;
    }
    setPreview(trimmed);
    setImageError(false);
  }, [url]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Pega la URL de una imagen externa para usarla directamente.
      </p>

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handlePreview}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="flex-1 text-sm"
        />
        <Button
          onClick={handleApply}
          disabled={!url.trim()}
          size="sm"
          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Usar URL
        </Button>
      </div>

      {/* Live preview */}
      {preview && (
        <div className="overflow-hidden rounded-lg border border-gray-400 bg-gray-200">
          {!imageError ? (
            <img
              src={preview}
              alt="Vista previa"
              className="h-40 w-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-xs text-red-500">
                No se pudo cargar la imagen desde esta URL.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Selected Image Preview Sub-component
// ─────────────────────────────────────────────────────────────

interface SelectedPreviewProps {
  url: string;
  onRemove: () => void;
}

function SelectedPreview({ url, onRemove }: SelectedPreviewProps) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-emerald-700">Imagen seleccionada</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
          Quitar
        </Button>
      </div>
      <div className="overflow-hidden rounded-md">
        <img
          src={url}
          alt="Imagen seleccionada"
          className="h-20 w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inner Panel (shared between Popover and Dialog)
// ─────────────────────────────────────────────────────────────

interface InnerPanelProps {
  images: UploadedImage[];
  isUploading: boolean;
  selectedUrl?: string;
  onUploadFiles: (files: FileList | null) => void;
  onSelectImage: (image: UploadedImage) => void;
  onDeleteImage: (url: string) => void;
  onSelectUrl: (url: string) => void;
  onClearSelection: () => void;
}

function InnerPanel({
  images,
  isUploading,
  selectedUrl,
  onUploadFiles,
  onSelectImage,
  onDeleteImage,
  onSelectUrl,
  onClearSelection,
}: InnerPanelProps) {
  return (
    <div className="space-y-4">
      {/* Selected image preview */}
      {selectedUrl && (
        <SelectedPreview url={selectedUrl} onRemove={onClearSelection} />
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1 gap-1.5">
            <ImagePlus className="h-3.5 w-3.5" />
            Subir
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Usar URL
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="mt-3 space-y-3">
          <UploadZone onUpload={onUploadFiles} isUploading={isUploading} />
        </TabsContent>

        {/* URL Tab */}
        <TabsContent value="url" className="mt-3">
          <UrlInput onSelect={onSelectUrl} />
        </TabsContent>
      </Tabs>

      {/* Image grid */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500">
            Imágenes subidas ({images.length})
          </p>
        </div>
        <ScrollArea className="max-h-80">
          <ImageGrid
            images={images}
            selectedUrl={selectedUrl}
            onSelect={onSelectImage}
            onDelete={onDeleteImage}
          />
        </ScrollArea>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main ImageManager Component
// ─────────────────────────────────────────────────────────────

export function ImageManager({
  value,
  onChange,
  label = 'Seleccionar Imagen',
  mode = 'select',
  open,
  onOpenChange,
  className,
}: ImageManagerProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  // Hydrate images from sessionStorage on mount
  useEffect(() => {
    setImages(loadImagesFromSession());
  }, []);

  // Persist images to sessionStorage whenever they change
  useEffect(() => {
    saveImagesToSession(images);
  }, [images]);

  // Controlled / uncontrolled open state
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // ── Upload logic ──────────────────────────────────────────
  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Validate file types
      const invalidTypes = fileArray.filter(
        (f) => !ACCEPTED_TYPES.includes(f.type)
      );
      if (invalidTypes.length > 0) {
        toast.error(
          `Tipo de archivo no soportado: ${invalidTypes.map((f) => f.name).join(', ')}. Usa JPG, PNG, WebP, GIF o SVG.`
        );
        return;
      }

      // Validate file sizes
      const tooLarge = fileArray.filter((f) => f.size > MAX_FILE_SIZE);
      if (tooLarge.length > 0) {
        toast.error(
          `${tooLarge.length} archivo(s) exceden el límite de 5 MB: ${tooLarge.map((f) => `${f.name} (${formatFileSize(f.size)})`).join(', ')}`
        );
        return;
      }

      setIsUploading(true);

      const uploadResults: UploadedImage[] = [];
      let errorCount = 0;

      for (const file of fileArray) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('purpose', 'builder');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || `Error del servidor (${response.status})`);
          }

          const data = (await response.json()) as { url: string; name?: string };

          uploadResults.push({
            url: data.url,
            name: data.name ?? file.name,
            uploadedAt: Date.now(),
          });
        } catch (err) {
          errorCount++;
          console.error('Upload error:', err);
          toast.error(
            `Error al subir "${file.name}": ${err instanceof Error ? err.message : 'Error desconocido'}`
          );
        }
      }

      setIsUploading(false);

      if (uploadResults.length > 0) {
        setImages((prev) => [...uploadResults, ...prev]);
        toast.success(
          `${uploadResults.length} imagen(es) subida(s) correctamente.`
        );

        // Auto-select if only one image was uploaded and no current value
        if (uploadResults.length === 1 && !value) {
          onChange(uploadResults[0].url);
        }
      }

      if (errorCount > 0 && uploadResults.length > 0) {
        toast.warning(
          `${errorCount} archivo(s) no se pudieron subir.`
        );
      }
    },
    [onChange, value]
  );

  // ── Select image from grid ────────────────────────────────
  const handleSelectImage = useCallback(
    (image: UploadedImage) => {
      onChange(image.url);
      if (mode === 'select') {
        setOpen(false);
      }
    },
    [onChange, mode, setOpen]
  );

  // ── Select from URL ───────────────────────────────────────
  const handleSelectUrl = useCallback(
    (url: string) => {
      onChange(url);
      if (mode === 'select') {
        setOpen(false);
      }
      toast.success('URL de imagen aplicada.');
    },
    [onChange, mode, setOpen]
  );

  // ── Delete image ──────────────────────────────────────────
  const handleDeleteImage = useCallback(
    (url: string) => {
      setImages((prev) => {
        const updated = prev.filter((img) => img.url !== url);
        saveImagesToSession(updated);
        return updated;
      });

      // If the deleted image was selected, clear selection
      if (value === url) {
        onChange('');
      }

      toast.success('Imagen eliminada.');
    },
    [onChange, value]
  );

  // ── Clear selection ───────────────────────────────────────
  const handleClearSelection = useCallback(() => {
    onChange('');
  }, [onChange]);

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  // ── Manage Mode (full panel) ──────────────────────────────
  if (mode === 'manage') {
    return (
      <div className={`space-y-4 ${className ?? ''}`}>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Gestor de Imágenes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sube y administra las imágenes de tu página.
          </p>
        </div>
        <InnerPanel
          images={images}
          isUploading={isUploading}
          selectedUrl={value}
          onUploadFiles={handleUpload}
          onSelectImage={handleSelectImage}
          onDeleteImage={handleDeleteImage}
          onSelectUrl={handleSelectUrl}
          onClearSelection={handleClearSelection}
        />
      </div>
    );
  }

  // ── Select Mode (Popover) ─────────────────────────────────
  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-auto w-full justify-start gap-3 border-dashed px-3 py-2 ${className ?? ''}`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Imagen actual"
                className="h-10 w-10 shrink-0 rounded-md border border-gray-400 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-gray-700">
                  {label}
                </p>
                <p className="truncate text-xs text-gray-500">Imagen seleccionada</p>
              </div>
              <X
                className="h-4 w-4 shrink-0 text-gray-500 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
              />
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <ImagePlus className="h-5 w-5 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-gray-700">
                  {label}
                </p>
                <p className="truncate text-xs text-gray-500">
                  Haz clic para seleccionar o subir
                </p>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start" sideOffset={8}>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Seleccionar Imagen
          </h3>
          <p className="text-xs text-gray-500">
            Sube una nueva imagen o elige de la biblioteca.
          </p>
        </div>
        <InnerPanel
          images={images}
          isUploading={isUploading}
          selectedUrl={value}
          onUploadFiles={handleUpload}
          onSelectImage={handleSelectImage}
          onDeleteImage={handleDeleteImage}
          onSelectUrl={handleSelectUrl}
          onClearSelection={handleClearSelection}
        />
      </PopoverContent>
    </Popover>
  );
}

export default ImageManager;
