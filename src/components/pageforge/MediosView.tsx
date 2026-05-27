'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Upload,
  Search,
  LayoutGrid,
  List,
  ImagePlus,
  Pencil,
  Trash2,
  Copy,
  X,
  Check,
  ChevronLeft,
  ImageIcon,
  MoreVertical,
  Calendar,
  HardDrive,
  Maximize2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMediaLibraryStore, formatFileSize } from '@/lib/media-library-store';
import type { MediaItem } from '@/lib/media-library-store';
import { ImageEditor } from '@/components/pageforge/ImageEditor';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPT_STRING = ACCEPTED_TYPES.join(',');

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '?';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function MediosView() {
  // Store
  const { mediaItems, hydrated, addMedia, removeMedia, updateMedia } = useMediaLibraryStore();

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [editorItem, setEditorItem] = useState<MediaItem | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!search.trim()) return mediaItems;
    const q = search.toLowerCase().trim();
    return mediaItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [mediaItems, search]);

  // ─── Upload Logic ───

  const processUploads = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) {
          toast.error(`Tipo no soportado: ${f.name}`);
          return false;
        }
        if (f.size > MAX_FILE_SIZE) {
          toast.error(`El archivo "${f.name}" excede el límite de 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const initialQueue: UploadProgress[] = validFiles.map((f) => ({
        file: f,
        progress: 0,
        status: 'pending',
      }));
      setUploadQueue(initialQueue);

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        // Simulate progress
        setUploadQueue((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, status: 'uploading', progress: 10 } : u,
          ),
        );

        // Simulate staged progress
        for (let p = 30; p <= 90; p += 20) {
          await new Promise((r) => setTimeout(r, 80));
          setUploadQueue((prev) =>
            prev.map((u) =>
              u.file === file ? { ...u, progress: p } : u,
            ),
          );
        }

        try {
          await addMedia(file);
          setUploadQueue((prev) =>
            prev.map((u) =>
              u.file === file ? { ...u, progress: 100, status: 'done' } : u,
            ),
          );
          toast.success(`"${file.name}" subido correctamente`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          setUploadQueue((prev) =>
            prev.map((u) =>
              u.file === file ? { ...u, progress: 100, status: 'error', error: msg } : u,
            ),
          );
          toast.error(`Error al subir "${file.name}": ${msg}`);
        }
      }

      // Clear queue after a delay
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
      uploadTimeoutRef.current = setTimeout(() => {
        setUploadQueue([]);
      }, 3000);
    },
    [addMedia],
  );

  // ─── Drag & Drop ───

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
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) processUploads(files);
    },
    [processUploads],
  );

  // ─── File Input ───

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) processUploads(files);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [processUploads],
  );

  // ─── Selection ───

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredItems.map((i) => i.id)));
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ─── Delete ───

  const handleDelete = useCallback(
    (item: MediaItem) => {
      if (window.confirm(`¿Eliminar "${item.name}" permanentemente?`)) {
        removeMedia(item.id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        if (detailItem?.id === item.id) setDetailItem(null);
        setDeleteConfirmItem(null);
        toast.success(`"${item.name}" eliminado`);
      } else {
        setDeleteConfirmItem(null);
      }
    },
    [removeMedia, detailItem],
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (window.confirm(`¿Eliminar ${count} elemento(s) permanentemente?`)) {
      selectedIds.forEach((id) => removeMedia(id));
      setSelectedIds(new Set());
      setDetailItem(null);
      toast.success(`${count} elemento(s) eliminado(s)`);
    }
  }, [selectedIds, removeMedia]);

  // ─── Copy URL ───

  const copyUrl = useCallback((item: MediaItem) => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopiedId(item.id);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  // ─── Image Editor ───

  const handleEditorSave = useCallback(
    (url: string, w: number, h: number) => {
      if (!editorItem) return;
      updateMedia(editorItem.id, { url, width: w, height: h });
      // Also update detailItem if it's the same
      setDetailItem((prev) =>
        prev && prev.id === editorItem.id ? { ...prev, url, width: w, height: h } : prev,
      );
      setEditorItem(null);
      toast.success('Imagen actualizada');
    },
    [editorItem, updateMedia],
  );

  // ─── Click outside to close detail ───

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxItem) {
          setLightboxItem(null);
        } else if (editorItem) {
          setEditorItem(null);
        } else if (detailItem) {
          setDetailItem(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorItem, detailItem, lightboxItem]);

  const isUploading = uploadQueue.some((u) => u.status === 'uploading' || u.status === 'pending');

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full min-h-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_STRING}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ─── Drag overlay ─── */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-emerald-600/10 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 border-2 border-dashed border-emerald-500">
              <div className="rounded-full bg-emerald-100 p-4">
                <Upload className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">
                Soltar archivos aquí para subir
              </p>
              <p className="text-sm text-gray-500">
                JPEG, PNG, GIF, WebP, SVG — Máximo 5MB por archivo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Image Editor Modal ─── */}
      <AnimatePresence>
        {editorItem && (
          <ImageEditor
            item={editorItem}
            onSave={handleEditorSave}
            onClose={() => setEditorItem(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── Fullscreen Lightbox ─── */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[65] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxItem(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Image info bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
              <span className="text-white/80 text-sm font-medium drop-shadow-md">{lightboxItem.name}</span>
              <span className="text-white/50 text-xs">
                {lightboxItem.width}×{lightboxItem.height} • {formatFileSize(lightboxItem.size)}
              </span>
            </div>
            {/* Nav buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const items = filteredItems;
                const idx = items.findIndex(i => i.id === lightboxItem.id);
                if (idx > 0) setLightboxItem(items[idx - 1]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const items = filteredItems;
                const idx = items.findIndex(i => i.id === lightboxItem.id);
                if (idx < items.length - 1) setLightboxItem(items[idx + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
            {/* Image */}
            <motion.img
              key={lightboxItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={lightboxItem.data || lightboxItem.url}
              alt={lightboxItem.alt || lightboxItem.name}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Bottom actions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxItem(null);
                  setEditorItem(lightboxItem);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors backdrop-blur-sm"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyUrl(lightboxItem);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors backdrop-blur-sm"
              >
                <Copy className="h-4 w-4" />
                Copiar URL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setDeleteConfirmItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-red-100 p-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Eliminar elemento</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar{' '}
                <span className="font-medium text-gray-800">"{deleteConfirmItem.name}"</span>{' '}
                permanentemente? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-400"
                  onClick={() => setDeleteConfirmItem(null)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(deleteConfirmItem)}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER / TOOLBAR                                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-4 sm:px-6 py-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Title + badge */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-600/20 p-2">
              <ImageIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">
                Biblioteca de Medios
              </h1>
              <Badge
                variant="secondary"
                className="mt-1 text-xs bg-white/10 text-gray-500 hover:bg-white/15"
              >
                {mediaItems.length} elemento{mediaItems.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full sm:w-64 order-3 sm:order-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-[#222] border-white/10 text-white placeholder:text-gray-500 text-sm focus:border-emerald-500/50"
            />
          </div>

          {/* Selection info */}
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 order-2 sm:order-none"
            >
              <Badge className="bg-emerald-600 text-white text-xs">
                {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-600 text-gray-500 hover:bg-white/10 hover:text-white text-xs"
                onClick={clearSelection}
              >
                Limpiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-red-600/50 text-red-400 hover:bg-red-600/10 hover:text-red-300 text-xs"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Eliminar
              </Button>
            </motion.div>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 order-2 sm:order-none">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/10'
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/10'
              }`}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Upload button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-sm shrink-0 order-1 sm:order-none"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Subir</span>
          </Button>
        </div>

        {/* Upload toggle link */}
        <button
          onClick={() => setShowUploadArea((v) => !v)}
          className="mt-2 text-xs text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          {showUploadArea ? 'Ocultar zona de subida' : 'Mostrar zona de subida'}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* UPLOAD AREA                                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showUploadArea && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0"
          >
            <div className="bg-gray-200 border-b border-gray-400 px-4 sm:px-6 py-6">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-400 bg-white hover:border-gray-400'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="rounded-full bg-gray-200 p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Arrastra y suelta archivos aquí
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    o haz clic para seleccionar archivos
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, GIF, WebP, SVG — Máximo 5MB por archivo
                </p>
              </div>

              {/* Upload progress */}
              <AnimatePresence>
                {uploadQueue.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 space-y-2"
                  >
                    {uploadQueue.map((u) => (
                      <div
                        key={u.file.name + u.file.size}
                        className="flex items-center gap-3 bg-white rounded-lg border border-gray-400 px-4 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">{u.file.name}</p>
                          <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                width: `${u.progress}%`,
                                backgroundColor:
                                  u.status === 'done'
                                    ? '#10b981'
                                    : u.status === 'error'
                                      ? '#ef4444'
                                      : '#6366f1',
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${u.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {u.status === 'done' ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : u.status === 'error' ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            `${u.progress}%`
                          )}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT                                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8fafc]">
        {/* Media content area */}
        <div className="flex-1 overflow-y-auto">
          {/* ─── Loading State ─── */}
          {!hydrated && filteredItems.length === 0 && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full py-24 px-4"
            >
              <div className="rounded-full bg-gray-200 p-6 mb-4">
                <div className="h-10 w-10 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Cargando biblioteca de medios...
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Por favor, espera mientras se cargan los medios.
              </p>
            </motion.div>
          )}

          {/* ─── Empty State ─── */}
          {hydrated && filteredItems.length === 0 && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full py-24 px-4"
            >
              <div className="rounded-full bg-gray-200 p-6 mb-4">
                <ImagePlus className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                {search ? 'Sin resultados' : 'Biblioteca vacía'}
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                {search
                  ? `No se encontraron elementos que coincidan con "${search}"`
                  : 'Aún no has subido ningún medio. Comienza arrastrando archivos o usando el botón de subir.'}
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir primer archivo
              </Button>
            </motion.div>
          )}

          {/* ─── List actions bar ─── */}
          {filteredItems.length > 0 && (
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-400 bg-white">
              <div className="text-xs text-gray-500">
                {filteredItems.length === mediaItems.length
                  ? `Mostrando ${filteredItems.length} elemento${filteredItems.length !== 1 ? 's' : ''}`
                  : `${filteredItems.length} de ${mediaItems.length} elementos`}
              </div>
              {selectedIds.size === 0 && (
                <button
                  onClick={selectAll}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Seleccionar todo
                </button>
              )}
            </div>
          )}

          {/* ─── GRID VIEW ─── */}
          {viewMode === 'grid' && filteredItems.length > 0 && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    layout
                  >
                    <Card
                      className={`relative group cursor-pointer overflow-hidden bg-white border transition-all hover:shadow-md ${
                        selectedIds.has(item.id)
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-gray-400 hover:border-gray-400'
                      } ${detailItem?.id === item.id ? 'ring-2 ring-emerald-400/50 border-emerald-400' : ''}`}
                      onClick={() => {
                        if (selectedIds.size > 0) {
                          toggleSelect(item.id);
                        } else {
                          setDetailItem(item);
                        }
                      }}
                      onDoubleClick={() => {
                        setLightboxItem(item);
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className={`absolute top-2 left-2 z-10 transition-opacity ${
                          selectedIds.size > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.id);
                        }}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedIds.has(item.id)
                              ? 'bg-emerald-600 border-emerald-600'
                              : 'bg-white/80 border-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {selectedIds.has(item.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="aspect-square relative bg-gray-200 overflow-hidden">
                        <img
                          src={item.data || item.url}
                          alt={item.alt || item.name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5">
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-white/90 text-gray-700 hover:bg-white hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailItem(item);
                            }}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-white/90 text-gray-700 hover:bg-white hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyUrl(item);
                            }}
                            title="Copiar URL"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </motion.button>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-white/90 text-gray-700 hover:bg-white hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmItem(item);
                            }}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-xs font-medium text-gray-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.width}×{item.height} • {formatFileSize(item.size)}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ─── LIST VIEW ─── */}
          {viewMode === 'list' && filteredItems.length > 0 && (
            <div className="px-4 sm:px-6 pb-6">
              {/* Table header */}
              <div className="grid grid-cols-[2.5rem_3rem_1fr_4.5rem_6rem_5rem_7rem_5rem] sm:grid-cols-[2.5rem_3rem_1fr_5rem_6rem_5rem_8rem_6rem] gap-2 items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-400 bg-gray-200 rounded-t-lg">
                <div />
                <div>Mini</div>
                <div>Nombre</div>
                <div>Tipo</div>
                <div>Dimensiones</div>
                <div>Tamaño</div>
                <div className="hidden sm:block">Fecha</div>
                <div>Acciones</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100 border border-gray-400 border-t-0 rounded-b-lg bg-white overflow-hidden">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.015 }}
                    className={`grid grid-cols-[2.5rem_3rem_1fr_4.5rem_6rem_5rem_7rem_5rem] sm:grid-cols-[2.5rem_3rem_1fr_5rem_6rem_5rem_8rem_6rem] gap-2 items-center px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                      selectedIds.has(item.id)
                        ? 'bg-emerald-50'
                        : 'hover:bg-gray-200'
                    } ${detailItem?.id === item.id ? 'bg-emerald-50/50' : ''}`}
                    onClick={() => {
                      if (selectedIds.size > 0) toggleSelect(item.id);
                      else setDetailItem(item);
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedIds.has(item.id)
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {selectedIds.has(item.id) && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden border border-gray-400">
                      <img
                        src={item.data || item.url}
                        alt={item.alt || item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800 text-xs sm:text-sm" title={item.name}>
                        {item.name}
                      </p>
                    </div>

                    {/* Type */}
                    <Badge
                      variant="secondary"
                      className="text-[10px] sm:text-xs bg-gray-200 text-gray-600 justify-center font-mono"
                    >
                      {getFileExtension(item.name)}
                    </Badge>

                    {/* Dimensions */}
                    <span className="text-xs sm:text-sm text-gray-600">
                      {item.width}×{item.height}
                    </span>

                    {/* Size */}
                    <span className="text-xs sm:text-sm text-gray-600">
                      {formatFileSize(item.size)}
                    </span>

                    {/* Date */}
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {formatDate(item.uploadedAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDetailItem(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Detalles"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => copyUrl(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Copiar URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* IMAGE DETAILS SIDEBAR                                 */}
        {/* ═══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {detailItem && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-l border-gray-400 bg-white shrink-0 overflow-hidden"
            >
              <div className="w-[360px] h-full flex flex-col">
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 shrink-0">
                  <button
                    onClick={() => setDetailItem(null)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </button>
                  <h3 className="text-sm font-semibold text-gray-800">Detalles</h3>
                  <button
                    onClick={() => setDetailItem(null)}
                    className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Sidebar content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Preview */}
                  <div className="p-4">
                    <div
                      className="rounded-lg border border-gray-400 overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors group/preview"
                      onClick={() => setLightboxItem(detailItem)}
                    >
                      <img
                        src={detailItem.data || detailItem.url}
                        alt={detailItem.alt || detailItem.name}
                        className="max-w-full max-h-[280px] object-contain group-hover/preview:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                    <button
                      className="w-full mt-2 text-xs text-center text-emerald-600 hover:text-emerald-700 font-medium py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      onClick={() => setLightboxItem(detailItem)}
                    >
                      <Maximize2 className="h-3.5 w-3.5 inline mr-1" />
                      Ver imagen completa
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="px-4 pb-4">
                    <div className="bg-gray-200 rounded-lg p-3 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <HardDrive className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className="font-medium text-gray-800">{detailItem.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="h-3 w-3 text-gray-500" />
                          {detailItem.width}×{detailItem.height}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HardDrive className="h-3 w-3 text-gray-500" />
                          {formatFileSize(detailItem.size)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 text-gray-500 shrink-0" />
                        {formatDate(detailItem.uploadedAt)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* URL */}
                  <div className="px-4 py-4 space-y-2">
                    <Label className="text-xs text-gray-500">URL del archivo</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <Input
                          readOnly
                          value={detailItem.url}
                          className="h-8 text-xs bg-gray-200 border-gray-400 text-gray-600 font-mono truncate pr-2"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 border-gray-400 shrink-0"
                        onClick={() => copyUrl(detailItem)}
                      >
                        {copiedId === detailItem.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Alt text */}
                  <div className="px-4 py-4 space-y-2">
                    <Label htmlFor="detail-alt" className="text-xs text-gray-500">
                      Texto alternativo
                    </Label>
                    <Input
                      id="detail-alt"
                      value={detailItem.alt}
                      onChange={(e) =>
                        updateMedia(detailItem.id, { alt: e.target.value })
                      }
                      placeholder="Describe la imagen..."
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Caption */}
                  <div className="px-4 pb-4 space-y-2">
                    <Label htmlFor="detail-caption" className="text-xs text-gray-500">
                      Descripción / Subtítulo
                    </Label>
                    <Textarea
                      id="detail-caption"
                      value={detailItem.caption}
                      onChange={(e) =>
                        updateMedia(detailItem.id, { caption: e.target.value })
                      }
                      placeholder="Añade una descripción..."
                      className="text-sm resize-none min-h-[60px]"
                      rows={2}
                    />
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="px-4 py-4 space-y-2">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      onClick={() => {
                        setEditorItem(detailItem);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar Imagen
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                      onClick={() => {
                        setDeleteConfirmItem(detailItem);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar permanentemente
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MediosView;
