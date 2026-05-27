import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

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
  mediaType?: MediaType;
}

interface MediaLibraryState {
  mediaItems: MediaItem[];
}

interface MediaLibraryActions {
  addMedia: (file: File) => Promise<MediaItem>;
  addMediaFromUrl: (item: Partial<MediaItem> & { name: string; url: string }) => MediaItem;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, partial: Partial<MediaItem>) => void;
  clearAll: () => void;
  hydrateMedia: () => void;
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

function getVideoDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth || 0, height: video.videoHeight || 0 });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    video.src = dataUrl;
  });
}

function detectMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType === 'text/plain' ||
    mimeType === 'text/csv'
  ) return 'document';
  return 'other';
}

function migrateItem(item: MediaItem): MediaItem {
  if (item.mediaType && item.mimeType) return item;
  const mimeType = item.mimeType || 'image/jpeg';
  return {
    ...item,
    mimeType,
    mediaType: detectMediaType(mimeType),
  };
}

function migrateItems(items: MediaItem[]): MediaItem[] {
  let needsMigration = false;
  for (const item of items) {
    if (!item.mediaType || !item.mimeType) {
      needsMigration = true;
      break;
    }
  }
  if (!needsMigration) return items;
  return items.map(migrateItem);
}

function getMaxFileSize(mimeType: string): number {
  const mediaType = detectMediaType(mimeType);
  switch (mediaType) {
    case 'video': return 50 * 1024 * 1024; // 50MB
    case 'audio': return 20 * 1024 * 1024; // 20MB
    case 'document': return 25 * 1024 * 1024; // 25MB
    case 'image': return 10 * 1024 * 1024; // 10MB
    default: return 10 * 1024 * 1024;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatMaxSize(bytes: number): string {
  return formatFileSize(bytes);
}

// ─────────────────────────────────────────────────────────────
// Allowed types
// ─────────────────────────────────────────────────────────────

const ALLOWED_TYPE_PATTERNS = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/avif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/webm', 'audio/x-m4a',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv',
];

function isAllowedType(mimeType: string): boolean {
  if (ALLOWED_TYPE_PATTERNS.includes(mimeType)) return true;
  if (mimeType.startsWith('image/')) return true;
  if (mimeType.startsWith('video/')) return true;
  if (mimeType.startsWith('audio/')) return true;
  return false;
}

const ACCEPT_STRING = [
  'image/*',
  'video/*',
  'audio/*',
  '.pdf',
  '.doc', '.docx',
  '.xls', '.xlsx',
  '.ppt', '.pptx',
  '.txt', '.csv',
].join(',');

// ─────────────────────────────────────────────────────────────
// Store (with auto-migration middleware)
// ─────────────────────────────────────────────────────────────

function autoMigrateMiddleware(
  config: Parameters<typeof create<MediaLibraryState & MediaLibraryActions>>[0]
): Parameters<typeof create<MediaLibraryState & MediaLibraryActions>>[0] {
  return (set, get, api) =>
    config(
      (partial, replace) => {
        // Auto-migrate mediaItems whenever state is set
        if (partial && typeof partial === 'object' && 'mediaItems' in partial) {
          const items = (partial as Partial<MediaLibraryState>).mediaItems;
          if (Array.isArray(items)) {
            (partial as Partial<MediaLibraryState>).mediaItems = migrateItems(items);
          }
        }
        set(partial, replace);
      },
      get,
      api
    );
}

export const useMediaLibraryStore = create<MediaLibraryState & MediaLibraryActions>()(
  autoMigrateMiddleware((set, get) => ({
    mediaItems: [],

    addMedia: async (file: File): Promise<MediaItem> => {
      const maxSize = getMaxFileSize(file.type);
      if (file.size > maxSize) {
        throw new Error(
          `El archivo "${file.name}" excede el límite de ${formatMaxSize(maxSize)} (${formatFileSize(file.size)})`
        );
      }

      if (!isAllowedType(file.type)) {
        throw new Error(`Tipo de archivo no soportado: ${file.type || 'desconocido'}`);
      }

      const mediaType = detectMediaType(file.type);
      const dataUrl = await readFileAsDataUrl(file);

      let width = 0;
      let height = 0;

      try {
        if (mediaType === 'image') {
          const dims = await getImageDimensions(dataUrl);
          width = dims.width;
          height = dims.height;
        } else if (mediaType === 'video') {
          const dims = await getVideoDimensions(dataUrl);
          width = dims.width;
          height = dims.height;
        }
      } catch {
        // Non-dimension media is fine
      }

      const newItem: MediaItem = {
        id: generateId(),
        name: file.name,
        url: dataUrl,
        alt: '',
        caption: '',
        width,
        height,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        mimeType: file.type,
        mediaType,
      };

      set((state) => ({
        mediaItems: [newItem, ...state.mediaItems],
      }));

      return newItem;
    },

    addMediaFromUrl: (item: Partial<MediaItem> & { name: string; url: string }): MediaItem => {
      const mimeType = item.mimeType || 'image/jpeg';
      const newItem: MediaItem = {
        id: generateId(),
        name: item.name,
        url: item.url,
        alt: item.alt || '',
        caption: item.caption || '',
        width: item.width || 0,
        height: item.height || 0,
        uploadedAt: new Date().toISOString(),
        size: item.size || 0,
        mimeType,
        mediaType: item.mediaType || detectMediaType(mimeType),
      };

      set((state) => ({
        mediaItems: [newItem, ...state.mediaItems],
      }));

      return newItem;
    },

    removeMedia: (id: string) => {
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

    hydrateMedia: () => {
      // Auto-migration middleware handles this now, but keep as no-op for backwards compat
    },
  }))
);

// ─────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────

export { formatFileSize, formatMaxSize, ACCEPT_STRING };
