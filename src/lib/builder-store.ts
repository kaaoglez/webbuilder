// ═══════════════════════════════════════════════════════════════
// PAGEFORGE - Builder Store (Zustand) - Page-based Builder
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type { BuilderPage, PageData, PageSection, PageTemplate, PageTheme } from './builder-types';
import { createSection, getDefaultTheme, createDefaultSections } from './builder-templates';

const uid = () => Math.random().toString(36).slice(2, 10);

// ═══════════════════════════════════════════════════════════════

interface BuilderState {
  // Navigation
  activePage: BuilderPage;
  setActivePage: (page: BuilderPage) => void;

  // Pages
  pages: PageData[];
  setPages: (pages: PageData[]) => void;
  addPage: (page: PageData) => void;
  removePage: (id: string) => void;
  duplicatePage: (id: string) => void;
  updatePage: (id: string, data: Partial<PageData>) => void;

  // Current page
  currentPage: PageData | null;
  setCurrentPage: (page: PageData | null) => void;

  // Selected section in editor
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;

  // Section management for current page
  addSection: (type: string) => void;
  removeSection: (id: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  updateSection: (id: string, data: Partial<PageSection>) => void;
  toggleSection: (id: string) => void;
  duplicateSection: (id: string) => void;

  // Theme
  updateTheme: (theme: Partial<PageTheme>) => void;

  // Preview
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;

  // AI
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // Page creation
  createNewPage: (name: string, template: PageTemplate) => PageData;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Pages
  pages: [],
  setPages: (pages) => set({ pages }),

  addPage: (page: PageData) => {
    set((state) => ({ pages: [page, ...state.pages] }));
  },

  removePage: (id: string) => {
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== id),
      currentPage: state.currentPage?.id === id ? null : state.currentPage,
    }));
  },

  duplicatePage: (id: string) => {
    const page = get().pages.find((p) => p.id === id);
    if (!page) return;
    const clone: PageData = {
      ...JSON.parse(JSON.stringify(page)),
      id: uid(),
      name: `${page.name} (copia)`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ pages: [clone, ...state.pages] }));
  },

  updatePage: (id: string, data: Partial<PageData>) => {
    set((state) => ({
      pages: state.pages.map((p) => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p),
      currentPage: state.currentPage?.id === id ? { ...state.currentPage, ...data, updatedAt: new Date().toISOString() } : state.currentPage,
    }));
  },

  // Current page
  currentPage: null,
  setCurrentPage: (page) => set({ currentPage: page, activePage: 'editor', selectedSectionId: null }),

  // Selected section
  selectedSectionId: null,
  setSelectedSectionId: (id) => set({ selectedSectionId: id }),

  // Section management
  addSection: (type: string) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const newSection = createSection(type);
    const updatedPage: PageData = {
      ...currentPage,
      sections: [...currentPage.sections, newSection],
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  removeSection: (id: string) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const updatedPage: PageData = {
      ...currentPage,
      sections: currentPage.sections.filter((s) => s.id !== id),
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  moveSection: (fromIndex: number, toIndex: number) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const newSections = [...currentPage.sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    const updatedPage: PageData = {
      ...currentPage,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  updateSection: (id: string, data: Partial<PageSection>) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const updatedSections = currentPage.sections.map((s) => {
      if (s.id === id) {
        return { ...s, ...data } as PageSection;
      }
      return s;
    });
    const updatedPage: PageData = {
      ...currentPage,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  toggleSection: (id: string) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const updatedSections = currentPage.sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    const updatedPage: PageData = {
      ...currentPage,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  duplicateSection: (id: string) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const section = currentPage.sections.find((s) => s.id === id);
    if (!section) return;
    const clone = { ...JSON.parse(JSON.stringify(section)), id: uid() };
    const idx = currentPage.sections.findIndex((s) => s.id === id);
    const newSections = [...currentPage.sections];
    newSections.splice(idx + 1, 0, clone);
    const updatedPage: PageData = {
      ...currentPage,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  // Theme
  updateTheme: (theme: Partial<PageTheme>) => {
    const { currentPage } = get();
    if (!currentPage) return;
    const updatedPage: PageData = {
      ...currentPage,
      theme: { ...currentPage.theme, ...theme },
      updatedAt: new Date().toISOString(),
    };
    set({
      currentPage: updatedPage,
      pages: get().pages.map((p) => p.id === currentPage.id ? updatedPage : p),
    });
  },

  // Preview
  showPreview: false,
  setShowPreview: (show) => set({ showPreview: show }),

  // AI
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),

  // Page creation
  createNewPage: (name: string, template: PageTemplate) => {
    const page: PageData = {
      id: uid(),
      name,
      template,
      sections: createDefaultSections(template),
      theme: getDefaultTheme(template),
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      pages: [page, ...state.pages],
      currentPage: page,
      activePage: 'editor',
    }));
    return page;
  },
}));
