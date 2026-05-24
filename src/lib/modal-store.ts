// Gran Canaria Conecta - Global Modal State Store
// Zustand store for managing modal visibility across components
//
// NAVIGATION RULES (Next.js App Router):
// - Navigation is handled by Next.js router via appPush() — real URL paths
// - Store actions only manage Zustand state (modals, overlays, flags)
// - No history push/replace from the store — Next.js router handles it
// - All modals (PostAd, ListingDetail, EventDetail, ArticleDetail, Auth, Payment, Message): overlays only

'use client';

import { create } from 'zustand';
import type { ListingDTO, EventDTO, ArticleDTO } from './types';

export type PageView = 'home' | 'anuncios' | 'categorias' | 'eventos' | 'news' | 'directory' | 'recycling' | 'flyers' | 'messages' | 'perfil' | 'mis-anuncios' | 'mis-flyers' | 'crear-folleto' | 'favoritos' | 'author-profile' | 'category-listings';

interface ModalState {
  // Current page view (client-side routing)
  currentView: PageView;
  setCurrentView: (view: PageView) => void;

  // Selected category for cross-page navigation
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Admin full-page view
  isAdminView: boolean;
  setAdminView: (active: boolean) => void;

  // Post Ad Modal (overlay — no history push)
  isPostAdOpen: boolean;
  openPostAd: () => void;
  closePostAd: () => void;

  // Post Ad Page (full-page nav — pushes history on open only)
  isPostAdPage: boolean;
  openPostAdPage: () => void;
  closePostAdPage: () => void;

  // Promote Business Page (full-page nav — pushes history on open only)
  isPromoteBusinessPage: boolean;
  openPromoteBusinessPage: () => void;
  closePromoteBusinessPage: () => void;

  // Advertise Page (full-page nav — pushes history on open only)
  isAdvertisePage: boolean;
  openAdvertisePage: () => void;
  closeAdvertisePage: () => void;

  // Listing Detail Modal (overlay — no history push)
  // openListingDetail saves scrollY so pushNavigationState uses it when
  // navigating to full view (Dialog overflow:hidden kills window.scrollY).
  selectedListing: ListingDTO | null;
  isListingDetailOpen: boolean;
  openListingDetail: (listing: ListingDTO) => void;
  closeListingDetail: () => void;

  // Search Results Modal (navigation state — pushes history)
  searchQuery: string;
  searchCategoryId: string | null;
  isSearchOpen: boolean;
  openSearch: (query: string, categoryId?: string) => void;
  closeSearch: () => void;

  // Event Detail Modal (overlay — no history push)
  // openEventDetail saves scrollY (same pattern as openListingDetail)
  selectedEvent: EventDTO | null;
  isEventDetailOpen: boolean;
  openEventDetail: (event: EventDTO) => void;
  closeEventDetail: () => void;

  // Article Detail Modal (overlay — no history push)
  // openArticleDetail saves scrollY (same pattern as openListingDetail)
  selectedArticle: ArticleDTO | null;
  isArticleDetailOpen: boolean;
  openArticleDetail: (article: ArticleDTO) => void;
  closeArticleDetail: () => void;

  // Article Reading View (full-page nav — pushes history on open only)
  isArticleReadingView: boolean;
  openArticleReadingView: (article: ArticleDTO) => void;
  closeArticleReadingView: () => void;

  // Listing Full View (full-page nav — pushes history on open only)
  isListingFullView: boolean;
  openListingFullView: () => void;
  closeListingFullView: () => void;
  setListingForFullView: (listing: ListingDTO) => void;

  // Event Full View (full-page nav — pushes history on open only)
  isEventFullView: boolean;
  openEventFullView: () => void;
  closeEventFullView: () => void;
  setEventForFullView: (event: EventDTO) => void;

  // Auth Modal (overlay — no history push)
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;

  // Payment Modal (overlay — no history push)
  paymentConfig: { type: string; listingId?: string; amount: number; listingTitle?: string } | null;
  isPaymentOpen: boolean;
  openPayment: (config: { type: string; listingId?: string; amount: number; listingTitle?: string }) => void;
  closePayment: () => void;

  // Message Modal (overlay — no history push)
  messageConfig: { receiverId: string; receiverName: string; listingId?: string; listingTitle?: string; listingImage?: string } | null;
  isMessageOpen: boolean;
  openMessage: (config: { receiverId: string; receiverName: string; listingId?: string; listingTitle?: string; listingImage?: string }) => void;
  closeMessage: () => void;

  // Anuncios page number — preserved across full-view navigation
  anunciosPage: number;
  setAnunciosPage: (page: number) => void;

  // Anuncios scroll position — saved BEFORE opening listing detail modal
  anunciosScrollY: number;
  setAnunciosScrollY: (y: number) => void;

  // Eventos page number — preserved across full-view navigation
  eventosPage: number;
  setEventosPage: (page: number) => void;

  // Noticias page number — preserved across full-view navigation
  noticiasPage: number;
  setNoticiasPage: (page: number) => void;

  // Listings refresh key — bumped when listing data changes (status, delete, etc.)
  listingsRefreshKey: number;
  bumpListingsRefreshKey: () => void;

  // Editing flyer ID — set before navigating to crear-folleto page
  editingFlyerId: string | null;
  setEditingFlyerId: (id: string | null) => void;

  // Selected author ID — for author profile page
  selectedAuthorId: string | null;
  setSelectedAuthorId: (id: string | null) => void;

  // Category listings page — dedicated ID (separate from selectedCategoryId)
  categoryListingsCategoryId: string | null;
  setCategoryListingsCategoryId: (id: string | null) => void;

  // ── Prefetch cache: data pre-fetched BEFORE navigation ──
  // This prevents the skeleton/blank flash when switching pages.
  // Populated by navigateToAuthor/navigateToCategory, consumed on page mount.
  prefetchedAuthorProfile: Record<string, unknown> | null;
  prefetchedAuthorListings: unknown[] | null;
  prefetchedAuthorTotal: number | null;
  prefetchedCategoryData: Record<string, unknown> | null;
  prefetchedCategoryListings: unknown[] | null;
  prefetchedCategoryTotal: number | null;
  setPrefetchedAuthorData: (profile: Record<string, unknown> | null, listings: unknown[] | null, total: number | null) => void;
  setPrefetchedCategoryData: (category: Record<string, unknown> | null, listings: unknown[] | null, total: number | null) => void;
  clearPrefetchedData: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  // ── Page view: NO auto-push (callers control history) ──
  currentView: 'home',
  setCurrentView: (view) => { set({ currentView: view }); },

  // ── Selected category: NO auto-push (callers control history) ──
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => { set({ selectedCategoryId: id }); },

  // ── Admin view: NO history push ──
  isAdminView: false,
  setAdminView: (active) => set({ isAdminView: active }),

  // ── Post Ad Modal: overlay, no history ──
  isPostAdOpen: false,
  openPostAd: () => set({ isPostAdOpen: true }),
  closePostAd: () => set({ isPostAdOpen: false }),

  // ── Post Ad Page: full-page nav ──
  isPostAdPage: false,
  openPostAdPage: () =>
    { set({ isPostAdOpen: false, isPostAdPage: true, isPromoteBusinessPage: false, isAdvertisePage: false }); },
  closePostAdPage: () =>
    { set({ isPostAdPage: false }); },

  // ── Promote Business Page: full-page nav ──
  isPromoteBusinessPage: false,
  openPromoteBusinessPage: () =>
    { set({ isPromoteBusinessPage: true, isPostAdPage: false, isAdvertisePage: false }); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); },
  closePromoteBusinessPage: () =>
    { set({ isPromoteBusinessPage: false }); },

  // ── Advertise Page: full-page nav ──
  isAdvertisePage: false,
  openAdvertisePage: () =>
    { set({ isAdvertisePage: true, isPostAdPage: false, isPromoteBusinessPage: false }); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); },
  closeAdvertisePage: () =>
    { set({ isAdvertisePage: false }); },

  // ── Listing Detail Modal: overlay, no history ──
  selectedListing: null,
  isListingDetailOpen: false,
  openListingDetail: (listing) => {
    // Save scroll position BEFORE Dialog opens (sets overflow:hidden → scrollY=0)
    (window as unknown as Record<string, number>).__gccAnunciosScrollY = window.scrollY;
    set({ selectedListing: listing, isListingDetailOpen: true });
  },
  closeListingDetail: () =>
    set({ selectedListing: null, isListingDetailOpen: false }),

  // ── Search: modal overlay ──
  searchQuery: '',
  searchCategoryId: null,
  isSearchOpen: false,
  openSearch: (query, categoryId) =>
    { set({ searchQuery: query, searchCategoryId: categoryId || null, isSearchOpen: true }); },
  closeSearch: () =>
    { set({ searchQuery: '', searchCategoryId: null, isSearchOpen: false }); },

  // ── Event Detail Modal: overlay, no history ──
  selectedEvent: null,
  isEventDetailOpen: false,
  openEventDetail: (event) => {
    (window as unknown as Record<string, number>).__gccEventosScrollY = window.scrollY;
    set({ selectedEvent: event, isEventDetailOpen: true });
  },
  closeEventDetail: () =>
    set({ selectedEvent: null, isEventDetailOpen: false }),

  // ── Article Detail Modal: overlay, no history ──
  selectedArticle: null,
  isArticleDetailOpen: false,
  openArticleDetail: (article) => {
    (window as unknown as Record<string, number>).__gccNoticiasScrollY = window.scrollY;
    set({ selectedArticle: article, isArticleDetailOpen: true });
  },
  closeArticleDetail: () =>
    set({ selectedArticle: null, isArticleDetailOpen: false }),

  // ── Article Reading View: full-page nav ──
  isArticleReadingView: false,
  openArticleReadingView: (article) =>
    { set({ selectedArticle: article, isArticleDetailOpen: false, isArticleReadingView: true }); },
  closeArticleReadingView: () =>
    // NO push — back navigation is handled by popstate or navigateBack()
    { set({ selectedArticle: null, isArticleReadingView: false }); },

  // ── Listing Full View: full-page nav ──
  isListingFullView: false,
  openListingFullView: () =>
    { set({ isListingDetailOpen: false, isListingFullView: true }); },
  closeListingFullView: () =>
    // NO push — back navigation is handled by popstate or navigateBack()
    // Keep selectedListing for back-navigation restore
    { set({ isListingFullView: false }); },
  setListingForFullView: (listing) =>
    { set({ selectedListing: listing, isListingDetailOpen: false, isListingFullView: true }); },

  // ── Event Full View: full-page nav ──
  isEventFullView: false,
  openEventFullView: () =>
    { set({ isEventDetailOpen: false, isEventFullView: true }); },
  closeEventFullView: () =>
    // NO push — back navigation is handled by popstate or navigateBack()
    // Keep selectedEvent for back-navigation restore
    { set({ isEventFullView: false }); },
  setEventForFullView: (event) =>
    { set({ selectedEvent: event, isEventDetailOpen: false, isEventFullView: true }); },

  // ── Article Reading View restore helper ──
  setArticleForReadingView: (article) =>
    { set({ selectedArticle: article, isArticleDetailOpen: false, isArticleReadingView: true }); },

  // ── Auth Modal: overlay, no history ──
  isAuthOpen: false,
  openAuth: () => set({ isAuthOpen: true }),
  closeAuth: () => set({ isAuthOpen: false }),

  // ── Payment Modal: overlay, no history ──
  paymentConfig: null,
  isPaymentOpen: false,
  openPayment: (config) => set({ paymentConfig: config, isPaymentOpen: true }),
  closePayment: () => set({ paymentConfig: null, isPaymentOpen: false }),

  // ── Message Modal: overlay, no history ──
  messageConfig: null,
  isMessageOpen: false,
  openMessage: (config) => set({ messageConfig: config, isMessageOpen: true }),
  closeMessage: () => set({ messageConfig: null, isMessageOpen: false }),

  // ── Anuncios page number: NO auto-push (callers control history) ──
  anunciosPage: 1,
  setAnunciosPage: (page) => set({ anunciosPage: page }),

  // ── Eventos page number: NO auto-push (callers control history) ──
  eventosPage: 1,
  setEventosPage: (page) => set({ eventosPage: page }),

  // ── Noticias page number: NO auto-push (callers control history) ──
  noticiasPage: 1,
  setNoticiasPage: (page) => set({ noticiasPage: page }),

  // ── Anuncios scroll Y: saved before opening detail modal ──
  anunciosScrollY: 0,
  setAnunciosScrollY: (y) => set({ anunciosScrollY: y }),

  // ── Listings refresh key ──
  listingsRefreshKey: 0,
  bumpListingsRefreshKey: () => set((s) => ({ listingsRefreshKey: s.listingsRefreshKey + 1 })),

  // ── Editing flyer ID ──
  editingFlyerId: null,
  setEditingFlyerId: (id) => set({ editingFlyerId: id }),

  // ── Selected author ID: NO auto-push (callers control history) ──
  selectedAuthorId: null,
  setSelectedAuthorId: (id) => set({ selectedAuthorId: id }),

  // ── Category listings page: NO auto-push (callers control history) ──
  categoryListingsCategoryId: null,
  setCategoryListingsCategoryId: (id) => set({ categoryListingsCategoryId: id }),

  // ── Prefetch cache ──
  prefetchedAuthorProfile: null,
  prefetchedAuthorListings: null,
  prefetchedAuthorTotal: null,
  prefetchedCategoryData: null,
  prefetchedCategoryListings: null,
  prefetchedCategoryTotal: null,
  setPrefetchedAuthorData: (profile, listings, total) =>
    set({ prefetchedAuthorProfile: profile, prefetchedAuthorListings: listings, prefetchedAuthorTotal: total }),
  setPrefetchedCategoryData: (category, listings, total) =>
    set({ prefetchedCategoryData: category, prefetchedCategoryListings: listings, prefetchedCategoryTotal: total }),
  clearPrefetchedData: () =>
    set({
      prefetchedAuthorProfile: null,
      prefetchedAuthorListings: null,
      prefetchedAuthorTotal: null,
      prefetchedCategoryData: null,
      prefetchedCategoryListings: null,
      prefetchedCategoryTotal: null,
    }),
}));
