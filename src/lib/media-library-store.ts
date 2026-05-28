import { create } from 'zustand';

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
  mediaType?: string;
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
    mediaType: (item.mediaType as string) ?? undefined,
    data: (item.data as string) ?? undefined,
    uploadedAt: item.uploadedAt as string,
  };
}

// ─────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────

async function apiFetchMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/media');
  if (res.ok) {
    const data = await res.json();
    return data.map(mapApiItemToMediaItem);
  }
  console.warn('[MediaLibrary] GET /api/media failed:', res.status);
  return [];
}

async function apiDeleteMedia(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiUpdateMedia(id: string, partial: { alt?: string; caption?: string }): Promise<boolean> {
  try {
    const res = await fetch('/api/media', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...partial }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Store — NO persist middleware. La fuente de verdad es la DB.
// ─────────────────────────────────────────────────────────────

export const useMediaLibraryStore = create<MediaLibraryState & MediaLibraryActions>()(
  (set, _get) => ({
    mediaItems: [],
    hydrated: false,

    hydrate: async () => {
      if (typeof window === 'undefined') return;
      try {
        const items = await apiFetchMedia();
        set({ mediaItems: items, hydrated: true });
      } catch {
        set({ hydrated: true });
      }
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

      // Read dimensions client-side
      const dataUrl = await readFileAsDataUrl(file);
      const dimensions = await getImageDimensions(dataUrl);

      // Upload to server — THIS is the ONLY way media persists
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', String(dimensions.width));
      formData.append('height', String(dimensions.height));

      let res: Response;
      try {
        res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });
      } catch {
        throw new Error(
          `Error de conexión al subir "${file.name}". Verifica que el servidor esté activo.`
        );
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = (body as Record<string, unknown>).error || `Error del servidor (HTTP ${res.status})`;
        throw new Error(`No se pudo subir "${file.name}": ${msg}`);
      }

      const data = await res.json();

      // CRITICAL: if server didn't return an ID, the file was NOT saved to DB
      if (!data.id) {
        throw new Error(
          `El servidor no confirmó la subida de "${file.name}". Ejecuta "bun run db:push" y vuelve a intentar.`
        );
      }

      const apiItem = mapApiItemToMediaItem(data);

      // Add to local state immediately
      set((state) => ({
        mediaItems: [apiItem, ...state.mediaItems],
      }));

      // Re-hydrate from DB in background to ensure consistency
      apiFetchMedia().then((items) => {
        set({ mediaItems: items, hydrated: true });
      }).catch(() => {
        // Local state is already correct
      });

      return apiItem;
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
      // Delete from server
      const deleted = await apiDeleteMedia(id);

      if (deleted) {
        // Re-hydrate from DB to ensure consistency
        try {
          const items = await apiFetchMedia();
          set({ mediaItems: items, hydrated: true });
        } catch {
          // Fallback: remove locally if re-hydrate fails
          set((state) => ({
            mediaItems: state.mediaItems.filter((item) => item.id !== id),
          }));
        }
      } else {
        // Server delete failed — remove locally anyway
        set((state) => ({
          mediaItems: state.mediaItems.filter((item) => item.id !== id),
        }));
      }
    },

    updateMedia: (id: string, partial: Partial<MediaItem>) => {
      // Optimistic update
      set((state) => ({
        mediaItems: state.mediaItems.map((item) =>
          item.id === id ? { ...item, ...partial } : item,
        ),
      }));
      // Fire-and-forget: persist to server
      apiUpdateMedia(id, { alt: partial.alt, caption: partial.caption });
    },

    clearAll: () => {
      set({ mediaItems: [] });
    },
  }),
);

// ─────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────

export { formatFileSize };
