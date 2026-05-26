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
  hydrate: () => void;
  saveProject: (name: string, type: ProjectType, config: Record<string, unknown>) => SavedProject;
  deleteProject: (id: string) => void;
  getProject: (id: string) => SavedProject | undefined;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
}

// ─────────────────────────────────────────────────────────────
// localStorage helpers
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

function saveToStorage(projects: SavedProject[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    console.warn('Failed to save projects to localStorage');
  }
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useProjectsStore = create<ProjectsState & ProjectsActions>()((set, get) => ({
  projects: [],
  hydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage();
    set({ projects: stored, hydrated: true });
  },

  saveProject: (name, type, config) => {
    const now = new Date().toISOString();
    const existing = get().projects.find(
      (p) => p.name === name && p.type === type
    );

    if (existing) {
      // Update existing
      const updated = {
        ...existing,
        config: { ...config },
        updatedAt: now,
      };
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
    const projects = [newProject, ...get().projects];
    saveToStorage(projects);
    set({ projects });
    return newProject;
  },

  deleteProject: (id) => {
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
