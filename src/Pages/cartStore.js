import { createSlice, configureStore } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:5000";

// ── Helper: get JWT token from localStorage ───────────────────────────────────
function getToken() {
  return localStorage.getItem("token");  // set this when user logs in
}

// ── Helper: sync current cart state to backend ────────────────────────────────
// Called after every mutation (add / remove / clear).
// Silent — never throws, so UI never breaks if request fails.
async function syncCartToServer(cartState) {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart: cartState }),
    });
  } catch {
    // network error — cart state is still correct in Redux, just not persisted
  }
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    count: 0,
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
      state.count += 1;
    },

    removeFromCart(state, action) {
      const id = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        state.count -= existing.qty;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },

    clearCart(state) {
      state.items = [];
      state.count = 0;
    },

    // ── Used on login: load the user's cart fetched from the server
    loadCart(state, action) {
      const { items, count } = action.payload;
      state.items = items || [];
      state.count = count || 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCart } = cartSlice.actions;

// ── Store ─────────────────────────────────────────────────────────────────────
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// ── Subscribe: after every Redux mutation, sync to server ─────────────────────
store.subscribe(() => {
  syncCartToServer(store.getState().cart);
});

export default store;

// ── fetchUserCart — call this right after login/token restore ─────────────────
// Fetches the user's saved cart from the server and loads it into Redux.
//
// Usage in your auth flow (e.g. after login success or on app mount):
//   import { fetchUserCart } from "./cartStore";
//   await fetchUserCart();
//
export async function fetchUserCart() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const { cart } = await res.json();
    store.dispatch(loadCart(cart));
  } catch {
    // network error — start with empty cart
  }
}
