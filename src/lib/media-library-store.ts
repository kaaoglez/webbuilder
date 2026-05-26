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
}

interface MediaLibraryState {
  mediaItems: MediaItem[];
}

interface MediaLibraryActions {
  addMedia: (file: File) => Promise<MediaItem>;
  addMediaFromUrl: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  removeMedia: (id: string) => void;
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

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useMediaLibraryStore = create<MediaLibraryState & MediaLibraryActions>()((set, get) => ({
  mediaItems: [],

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

    const dataUrl = await readFileAsDataUrl(file);
    const dimensions = await getImageDimensions(dataUrl);

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
}));

// ─────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────

export { formatFileSize };
