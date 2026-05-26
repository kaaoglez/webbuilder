// ═══════════════════════════════════════════════════════════════
// GRAN CANARIA CONECTA - Prefetch Navigation
// Pre-fetches page data BEFORE switching views to prevent
// skeleton/blank flash during page transitions.
//
// USAGE:
//   navigateToAuthor(authorId)
//   navigateToCategory(categoryId)
//
// The current page stays visible while data loads in background.
// Once data is ready, the view switches instantly via Next.js router.
// ═══════════════════════════════════════════════════════════════

import { useModalStore } from '@/lib/modal-store';
import { appPush } from '@/lib/router-bridge';
import type { CategoryDTO, ListingDTO, PaginatedResponse } from '@/lib/types';

// ── Helper: find category by ID in tree ──────────────
function findCategoryById(categories: CategoryDTO[], id: string): CategoryDTO | undefined {
  for (const c of categories) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findCategoryById(c.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// ── Navigate to Author Profile ───────────────────────
// Pre-fetches author profile + listings, then switches view.
export async function navigateToAuthor(authorId: string): Promise<void> {
  const store = useModalStore.getState();

  // Set the ID first (so it's ready when the page mounts)
  store.setSelectedAuthorId(authorId);

  // Pre-fetch data in background
  try {
    const [profileRes, listingsRes] = await Promise.all([
      fetch(`/api/users/${authorId}`),
      fetch(`/api/listings?authorId=${authorId}&limit=50&sortBy=newest`),
    ]);

    const profile = profileRes.ok ? await profileRes.json() : null;
    let listings: ListingDTO[] = [];
    let total = 0;

    if (listingsRes.ok) {
      const data: PaginatedResponse<ListingDTO> = await listingsRes.json();
      listings = data.data;
      total = data.total;
    }

    // Store pre-fetched data
    store.setPrefetchedAuthorData(profile, listings, total);
  } catch {
    // If fetch fails, just navigate without prefetched data
    store.setPrefetchedAuthorData(null, null, null);
  }

  // Navigate using Next.js router
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  appPush(`/autor/${authorId}`);
}

// ── Navigate to Category Listings ────────────────────
// Pre-fetches category data + listings, then switches view.
export async function navigateToCategory(categoryId: string): Promise<void> {
  const store = useModalStore.getState();

  // Set the ID first
  store.setCategoryListingsCategoryId(categoryId);

  // Pre-fetch data in background
  try {
    const catRes = await fetch('/api/categories');

    let category: CategoryDTO | null = null;
    if (catRes.ok) {
      const cats: CategoryDTO[] = await catRes.json();
      category = findCategoryById(cats, categoryId) ?? null;
    }

    // If category is "Negocios y Servicios", fetch ALL business listings
    const isNegocioCat = category?.slug === 'negocios-servicios';
    const listingUrl = isNegocioCat
      ? '/api/listings?isBusiness=true&limit=50&sortBy=newest'
      : `/api/listings?categoryId=${categoryId}&limit=50&sortBy=newest`;

    const listingsRes = await fetch(listingUrl);

    let listings: ListingDTO[] = [];
    let total = 0;
    if (listingsRes.ok) {
      const data: PaginatedResponse<ListingDTO> = await listingsRes.json();
      listings = data.data;
      total = data.total;
    }

    // Store pre-fetched data
    store.setPrefetchedCategoryData(category, listings, total);
  } catch {
    store.setPrefetchedCategoryData(null, null, null);
  }

  // Navigate using Next.js router
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  appPush(`/categoria/${categoryId}`);
}
