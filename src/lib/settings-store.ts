import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SettingsState {
  // General
  language: string;
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  showNotifications: boolean;

  // Theme defaults
  defaultPrimaryColor: string;
  defaultSecondaryColor: string;
  defaultFont: string;

  // Export
  includeScreenshot: boolean;
  minifyCSS: boolean;
  includeREADME: boolean;

  // Advanced
  developerMode: boolean;

  // Onboarding
  hasOnboarded: boolean;
}

export interface SettingsActions {
  updateSettings: (partial: Partial<SettingsState>) => void;
  resetSettings: () => void;
  clearAllData: () => void;
}

// ─────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SettingsState = {
  language: 'es',
  autoSave: true,
  autoSaveInterval: 30,
  showNotifications: true,

  defaultPrimaryColor: '#2563EB',
  defaultSecondaryColor: '#7C3AED',
  defaultFont: 'Inter',

  includeScreenshot: true,
  minifyCSS: false,
  includeREADME: true,

  developerMode: false,

  hasOnboarded: false,
};

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),

      resetSettings: () => set(DEFAULT_SETTINGS),

      clearAllData: () => {
        if (typeof window !== 'undefined') {
          // Try to clear server-side database first, then fall back to localStorage
          fetch('/api/clear-all', { method: 'POST' })
            .catch(() => {
              // Graceful degradation — still clear localStorage even if API fails
            })
            .finally(() => {
              localStorage.clear();
              window.location.reload();
            });
        }
      },
    }),
    {
      name: 'pageforge-settings',
      merge: (persisted, current) => {
        const p = persisted as Partial<SettingsState>;
        return {
          ...current,
          ...p,
        } as SettingsState & SettingsActions;
      },
    },
  ),
);
