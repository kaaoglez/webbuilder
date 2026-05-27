import { create } from 'zustand';
import type { ThemeEditorConfig } from './theme-editor-store';
import type { PluginConfig } from './plugin-editor-store';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ProjectType = 'theme' | 'plugin';

export interface SavedProject {
  id: string;
  name: string;
  type: ProjectType;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: SavedProject[];
  hydrated: boolean;
}

interface ProjectsActions {
  hydrate: () => Promise<void>;
  saveProject: (name: string, type: ProjectType, config: Record<string, unknown>) => Promise<SavedProject>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => SavedProject | undefined;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
}

// ─────────────────────────────────────────────────────────────
// localStorage helpers (used as fallback / cache)
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pageforge_projects_v2';

function loadFromStorage(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(projects: SavedProject[]): boolean {
  if (typeof window === 'undefined') return true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (e) {
    const name = (e as DOMException).name;
    if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      // Dispatch a custom event that the UI can listen to
      window.dispatchEvent(new CustomEvent('pageforge-storage-error', {
        detail: 'El almacenamiento local está lleno. Elimina algunos proyectos o imágenes para poder guardar.',
      }));
    } else {
      console.warn('Failed to save projects to localStorage', e);
    }
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useProjectsStore = create<ProjectsState & ProjectsActions>()((set, get) => ({
  projects: [],
  hydrated: false,

  hydrate: async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        const projects: SavedProject[] = data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: item.name as string,
          type: item.type as ProjectType,
          config: (item.config as Record<string, unknown>) ?? {},
          createdAt: item.createdAt as string,
          updatedAt: item.updatedAt as string,
        }));
        set({ projects, hydrated: true });
        saveToStorage(projects); // cache locally
        return;
      }
    } catch {
      // API failed, fall back to localStorage
    }
    const stored = loadFromStorage();
    set({ projects: stored, hydrated: true });
  },

  saveProject: async (name, type, config) => {
    const now = new Date().toISOString();
    const existing = get().projects.find(
      (p) => p.name === name && p.type === type
    );

    if (existing) {
      // Update existing
      const updated: SavedProject = {
        ...existing,
        config: { ...config },
        updatedAt: now,
      };

      // Try API first
      try {
        const res = await fetch(`/api/projects/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config }),
        });
        if (res.ok) {
          const data = await res.json();
          const apiProject: SavedProject = {
            id: data.id,
            name: data.name,
            type: data.type,
            config: data.config ?? config,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
          const projects = get().projects.map((p) => (p.id === apiProject.id ? apiProject : p));
          saveToStorage(projects);
          set({ projects });
          return apiProject;
        }
      } catch {
        // API failed, fall through to localStorage update
      }

      // Fallback: update locally
      const projects = get().projects.map((p) => (p.id === existing.id ? updated : p));
      saveToStorage(projects);
      set({ projects });
      return updated;
    }

    // Create new
    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name,
      type,
      config: { ...config },
      createdAt: now,
      updatedAt: now,
    };

    // Try API first
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, config }),
      });
      if (res.ok) {
        const data = await res.json();
        const apiProject: SavedProject = {
          id: data.id,
          name: data.name,
          type: data.type,
          config: data.config ?? config,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        const projects = [apiProject, ...get().projects];
        saveToStorage(projects);
        set({ projects });
        return apiProject;
      }
    } catch {
      // API failed, fall through to localStorage create
    }

    // Fallback: create locally
    const projects = [newProject, ...get().projects];
    saveToStorage(projects);
    set({ projects });
    return newProject;
  },

  deleteProject: async (id) => {
    // Try API first
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const projects = get().projects.filter((p) => p.id !== id);
        saveToStorage(projects);
        set({ projects });
        return;
      }
    } catch {
      // API failed, fall through to localStorage delete
    }

    // Fallback: delete locally
    const projects = get().projects.filter((p) => p.id !== id);
    saveToStorage(projects);
    set({ projects });
  },

  getProject: (id) => get().projects.find((p) => p.id === id),

  reorderProjects: (fromIndex, toIndex) => {
    const projects = [...get().projects];
    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, moved);
    saveToStorage(projects);
    set({ projects });
  },
}));
