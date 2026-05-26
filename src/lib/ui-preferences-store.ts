import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface UIPreferencesState {
  dashboardCardOrder: string[];
  statsBarOrder: string[];
  pluginTypeCardOrder: string[];
}

interface UIPreferencesActions {
  reorderDashboardCards: (fromIndex: number, toIndex: number) => void;
  reorderStatsBarCards: (fromIndex: number, toIndex: number) => void;
  reorderPluginTypeCards: (fromIndex: number, toIndex: number) => void;
  reorderSection: (section: string, fromIndex: number, toIndex: number) => void;
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useUIPreferencesStore = create<UIPreferencesState & UIPreferencesActions>()(
  persist(
    (set) => ({
      // State
      dashboardCardOrder: ['create-theme', 'create-plugin', 'templates', 'my-projects'],
      statsBarOrder: ['wp-sites', 'template-market', 'tools', 'wp-themes'],
      pluginTypeCardOrder: ['formularios', 'contenido', 'diseno', 'seo', 'integraciones'],

      // Dashboard cards
      reorderDashboardCards: (fromIndex, toIndex) =>
        set((state) => {
          const order = [...state.dashboardCardOrder];
          const [moved] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, moved);
          return { dashboardCardOrder: order };
        }),

      // Stats bar cards
      reorderStatsBarCards: (fromIndex, toIndex) =>
        set((state) => {
          const order = [...state.statsBarOrder];
          const [moved] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, moved);
          return { statsBarOrder: order };
        }),

      // Plugin type group cards
      reorderPluginTypeCards: (fromIndex, toIndex) =>
        set((state) => {
          const order = [...state.pluginTypeCardOrder];
          const [moved] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, moved);
          return { pluginTypeCardOrder: order };
        }),

      // Generic section reorder (extensible)
      reorderSection: (section, fromIndex, toIndex) =>
        set((state) => {
          const order = [...(state as Record<string, unknown>)[section] as string[]] || [];
          const [moved] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, moved);
          return { [section]: order } as Partial<UIPreferencesState>;
        }),
    }),
    {
      name: 'pageforge-ui-preferences',
      merge: (persisted, current) => {
        const p = persisted as Partial<UIPreferencesState>;
        return {
          ...current,
          dashboardCardOrder: p.dashboardCardOrder || current.dashboardCardOrder,
          statsBarOrder: p.statsBarOrder || current.statsBarOrder,
          pluginTypeCardOrder: p.pluginTypeCardOrder || current.pluginTypeCardOrder,
        } as UIPreferencesState & UIPreferencesActions;
      },
    },
  ),
);
