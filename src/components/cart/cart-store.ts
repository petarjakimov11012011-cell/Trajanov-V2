'use client';

import {useSyncExternalStore} from 'react';
import {
  type Cart,
  type CartItem,
  emptyCart,
  addItem,
  setItemQty,
  removeItem,
  parseCart,
  totalUnits as sumUnits,
  atCap as isAtCap,
} from '@/lib/cart/cart';

// Client cart store (D-1.06-5). A tiny external store surfaced through useSyncExternalStore — the React
// 19 idiomatic way to expose client-only, storage-backed state without a hydration mismatch and without
// setState-in-an-effect. Persists to sessionStorage (NOT localStorage) so the cart survives a refresh
// and product → cart → checkout navigation within a tab, but dies with the tab and never outlives the
// drop (brief Task 3). It never touches the database — the cart is a suggestion, create_order() is the
// fact. The pure, testable cart logic lives in src/lib/cart/cart.ts.

const STORAGE_KEY = 'trajanov.cart.v1';

// Module singleton: one cart per browser tab. Never read or written during SSR — getServerSnapshot
// returns null and every mutation is a client event handler — so it cannot leak across requests.
let current: Cart = emptyCart;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    current = raw ? parseCart(JSON.parse(raw)) : emptyCart;
  } catch {
    current = emptyCart; // corrupt/blocked storage → start empty; never throw over a cart read
  }
}

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // storage full/blocked — the in-memory cart still works for this navigation
  }
}

function mutate(fn: (c: Cart) => Cart) {
  if (typeof window === 'undefined') return; // never mutate on the server
  ensureLoaded();
  current = fn(current);
  persist();
  emit();
}

export const cartStore = {
  add: (item: Omit<CartItem, 'qty'>, qty = 1) => mutate((c) => addItem(c, item, qty)),
  setQty: (variantId: string, qty: number) => mutate((c) => setItemQty(c, variantId, qty)),
  remove: (variantId: string) => mutate((c) => removeItem(c, variantId)),
  clear: () => mutate(() => emptyCart),
};

function subscribe(listener: () => void): () => void {
  // The first subscription (post-hydration) reads sessionStorage; React re-reads getSnapshot right
  // after subscribing, so the snapshot flips from the server's null to the real cart on its own.
  ensureLoaded();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      ensureLoaded();
      emit();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

// null until hydrated (matches the server), then the real cart. Lets consumers show a stable skeleton
// for one frame instead of flashing the empty state.
const getSnapshot = (): Cart | null => (loaded ? current : null);
const getServerSnapshot = (): Cart | null => null;

export interface UseCart {
  cart: Cart;
  /** False until the sessionStorage read has run — consumers guard on this to avoid a flash. */
  hydrated: boolean;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  totalUnits: number;
  atCap: boolean;
}

export function useCart(): UseCart {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = snapshot !== null;
  const cart = snapshot ?? emptyCart;
  return {
    cart,
    hydrated,
    add: cartStore.add,
    setQty: cartStore.setQty,
    remove: cartStore.remove,
    clear: cartStore.clear,
    totalUnits: sumUnits(cart),
    atCap: isAtCap(cart),
  };
}
