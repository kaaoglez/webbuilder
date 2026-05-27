import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  uploadedAt: string;
  size: number;
  mimeType?: string;
  data?: string; // base64 data URL for quick display
}

interface MediaLibraryState {
  mediaItems: MediaItem[];
  hydrated: boolean;
}

interface MediaLibraryActions {
  hydrate: () => Promise<void>;
  addMedia: (file: File) => Promise<MediaItem>;
  addMediaFromUrl: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  removeMedia: (id: string) => Promise<void>;
  updateMedia: (id: string, partial: Partial<MediaItem>) => void;
  clearAll: () => void;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function generateId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Error al obtener dimensiones de la imagen'));
    img.src = dataUrl;
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function mapApiItemToMediaItem(item: Record<string, unknown>): MediaItem {
  return {
    id: item.id as string,
    name: item.name as string,
    url: item.url as string,
    alt: (item.alt as string) ?? '',
    caption: (item.caption as string) ?? '',
    width: (item.width as number) ?? 0,
    height: (item.height as number) ?? 0,
    size: (item.size as number) ?? 0,
    mimeType: (item.mimeType as string) ?? undefined,
    data: (item.data as string) ?? undefined,
    uploadedAt: item.uploadedAt as string,
  };
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useMediaLibraryStore = create<MediaLibraryState & MediaLibraryActions>()(
  persist(
    (set, get) => ({
  mediaItems: [],
  hydrated: false,

  hydrate: async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        const items: MediaItem[] = data.map(mapApiItemToMediaItem);
        set({ mediaItems: items, hydrated: true });
        return;
      }
    } catch {
      // API failed, rely on persisted data from zustand/persist
    }
    set({ hydrated: true });
  },

  addMedia: async (file: File): Promise<MediaItem> => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error(`El archivo excede el límite de 5MB (${formatFileSize(file.size)})`);
    }

    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Tipo de archivo no soportado: ${file.type}`);
    }

    // Read file for dimensions and display
    const dataUrl = await readFileAsDataUrl(file);
    const dimensions = await getImageDimensions(dataUrl);

    // Try API first
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', String(dimensions.width));
      formData.append('height', String(dimensions.height));

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const apiItem = mapApiItemToMediaItem(data);
        set((state) => ({
          mediaItems: [apiItem, ...state.mediaItems],
        }));
        return apiItem;
      }
    } catch {
      // API failed, fall through to local-only creation
    }

    // Fallback: create item locally without API
    const newItem: MediaItem = {
      id: generateId(),
      name: file.name,
      url: dataUrl,
      alt: '',
      caption: '',
      width: dimensions.width,
      height: dimensions.height,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      mimeType: file.type,
      data: dataUrl,
    };

    set((state) => ({
      mediaItems: [newItem, ...state.mediaItems],
    }));

    return newItem;
  },

  addMediaFromUrl: (item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...item,
      id: generateId(),
      uploadedAt: new Date().toISOString(),
    };

    set((state) => ({
      mediaItems: [newItem, ...state.mediaItems],
    }));

    return newItem;
  },

  removeMedia: async (id: string) => {
    // Try API first
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({
          mediaItems: state.mediaItems.filter((item) => item.id !== id),
        }));
        return;
      }
    } catch {
      // API failed, fall through to local-only removal
    }

    // Fallback: remove locally
    set((state) => ({
      mediaItems: state.mediaItems.filter((item) => item.id !== id),
    }));
  },

  updateMedia: (id: string, partial: Partial<MediaItem>) => {
    set((state) => ({
      mediaItems: state.mediaItems.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    }));
  },

  clearAll: () => {
    set({ mediaItems: [] });
  },
}),
    {
      name: 'pageforge-media-library',
      partialize: (state) => ({
        // Only persist metadata — NOT base64 data (would overflow localStorage)
        mediaItems: state.mediaItems.map((item) => ({
          ...item,
          data: undefined,
        })),
      }),
      merge: (persisted, current) => ({
        ...current,
        mediaItems: (persisted.mediaItems || []).map((p: MediaItem) => {
          // Keep in-memory data from current state if available
          const existing = current.mediaItems.find((c: MediaItem) => c.id === p.id);
          return { ...p, data: existing?.data || p.data };
        }),
      }),
    },
  ),
);

// ─────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────

export { formatFileSize };
