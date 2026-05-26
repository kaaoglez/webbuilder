// ═══════════════════════════════════════════════════════════════
// GRAN CANARIA CONECTA - useNavigation Hook
// Navigation utilities for Next.js App Router
//
// DESIGN PRINCIPLES:
// 1. All navigation uses Next.js router via appPush() — real URL paths
// 2. Back button = window.history.back() — Next.js handles popstate
// 3. No hash-based URLs — routes are /anuncios, /anuncio/123, etc.
// 4. pushNavigationState/replaceNavigationState: no-ops (legacy compat)
// 5. navigateTo(view): maps PageView → URL path, uses appPush()
// 6. Scroll restoration: handled by Next.js App Router
// ═══════════════════════════════════════════════════════════════

import { useModalStore, type PageView } from '@/lib/modal-store';
import { appPush } from '@/lib/router-bridge';

// ── Page title mapping ──
const VIEW_TITLES: Record<string, string> = {
  home: 'Inicio · Gran Canaria Conecta',
  anuncios: 'Anuncios · Gran Canaria Conecta',
  categorias: 'Categorías · Gran Canaria Conecta',
  eventos: 'Eventos · Gran Canaria Conecta',
  news: 'Noticias · Gran Canaria Conecta',
  flyers: 'Ofertas · Gran Canaria Conecta',
  'mis-flyers': 'Mis Folletos · Gran Canaria Conecta',
  'crear-folleto': 'Crear Folleto · Gran Canaria Conecta',
  directory: 'Directorio · Gran Canaria Conecta',
  recycling: 'Reciclaje · Gran Canaria Conecta',
  messages: 'Mensajes · Gran Canaria Conecta',
  perfil: 'Mi Perfil · Gran Canaria Conecta',
  'mis-anuncios': 'Mis Anuncios · Gran Canaria Conecta',
  favoritos: 'Favoritos · Gran Canaria Conecta',
};

// ── Map PageView → Next.js URL path ──
const VIEW_TO_PATH: Record<PageView, string> = {
  home: '/',
  anuncios: '/anuncios',
  categorias: '/categorias',
  eventos: '/eventos',
  news: '/noticias',
  flyers: '/ofertas',
  directory: '/directorio',
  recycling: '/reciclaje',
  messages: '/mensajes',
  perfil: '/perfil',
  'mis-anuncios': '/mis-anuncios',
  'mis-flyers': '/mis-flyers',
  'crear-folleto': '/crear-folleto',
  favoritos: '/favoritos',
  'author-profile': '/',
  'category-listings': '/',
};

function updateTitle(view: PageView, extra?: { listing?: string; event?: string; article?: string }) {
  if (extra?.listing) document.title = `${extra.listing} · Gran Canaria Conecta`;
  else if (extra?.event) document.title = `${extra.event} · Gran Canaria Conecta`;
  else if (extra?.article) document.title = `${extra.article} · Gran Canaria Conecta`;
  else document.title = VIEW_TITLES[view] || 'Gran Canaria Conecta';
}

// ── NO-OP: Legacy compatibility ──
// These were used for hash-based SPA navigation. Now Next.js handles routing.
// Kept as exports so existing callers don't break.
export function pushNavigationState() {
  // No-op: Next.js router manages history via appPush()
  const store = useModalStore.getState();
  if (store.isListingFullView) {
    updateTitle('anuncios', { listing: store.selectedListing?.title });
  } else if (store.isEventFullView) {
    updateTitle('eventos', { event: store.selectedEvent?.title });
  } else if (store.isArticleReadingView) {
    updateTitle('news', { article: store.selectedArticle?.title });
  } else {
    updateTitle(store.currentView);
  }
}

export function replaceNavigationState() {
  // No-op: Next.js router manages history
  updateTitle(useModalStore.getState().currentView);
}

// ── Navigate to a page by PageView ──
export function navigateTo(view: PageView, extra?: { categoryId?: string }) {
  const store = useModalStore.getState();

  // Clean up Zustand state (close modals, etc.)
  if (store.isPostAdPage) store.closePostAdPage();
  if (store.isPromoteBusinessPage) store.closePromoteBusinessPage();
  if (store.isAdvertisePage) store.closeAdvertisePage();
  if (store.isListingFullView) store.closeListingFullView();
  if (store.isEventFullView) store.closeEventFullView();
  if (store.isArticleReadingView) store.closeArticleReadingView();
  if (store.isSearchOpen) store.closeSearch();

  // Update Zustand currentView for components that still reference it
  store.setCurrentView(view);
  if (extra?.categoryId !== undefined) {
    store.setSelectedCategoryId(extra.categoryId);
  }

  // Reset pagination when navigating fresh
  if (view === 'anuncios') store.setAnunciosPage(1);
  if (view === 'eventos') store.setEventosPage(1);
  if (view === 'news') store.setNoticiasPage(1);

  // Navigate using Next.js router
  const path = VIEW_TO_PATH[view] || '/';
  appPush(path);
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

// ── Navigate back (browser back button) ──
export function navigateBack() {
  window.history.back();
}
