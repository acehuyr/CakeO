import { useState, useEffect, useReducer, createContext, useContext, useRef, useCallback } from "react";
import api from "./services/api";
import { io } from "socket.io-client";

/* ════════════════════════════════════════
   GLOBAL CSS INJECTION
════════════════════════════════════════ */
function useGlobalStyles() {
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const style = document.createElement("style");
    style.id = "cakeapp-styles";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: #0B0700;
        color: #FEF3C7;
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #0B0700; }
      ::-webkit-scrollbar-thumb { background: #92400E; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #F59E0B; }

      h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; }

      .app-bg {
        background: radial-gradient(ellipse 80% 60% at 70% 10%, rgba(245,158,11,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 10% 90%, rgba(239,68,68,0.05) 0%, transparent 50%),
                    #0B0700;
        min-height: 100vh;
      }

      /* NAVBAR */
      .navbar {
        position: sticky; top: 0; z-index: 100;
        background: rgba(11,7,0,0.85);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-bottom: 1px solid rgba(245,158,11,0.1);
        padding: 0 24px;
        height: 64px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px;
      }

      /* GLASS CARDS */
      .glass {
        background: rgba(255,248,230,0.04);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(245,158,11,0.1);
        border-radius: 16px;
      }
      .glass:hover {
        background: rgba(255,248,230,0.06);
        border-color: rgba(245,158,11,0.22);
      }

      /* CAKE CARDS */
      .cake-card {
        background: rgba(255,248,230,0.04);
        border: 1px solid rgba(245,158,11,0.1);
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      }
      .cake-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 24px 64px rgba(245,158,11,0.18), 0 4px 16px rgba(0,0,0,0.4);
        border-color: rgba(245,158,11,0.3);
      }
      .cake-card img {
        width: 100%; height: 220px; object-fit: cover;
        transition: transform 0.5s ease;
      }
      .cake-card:hover img { transform: scale(1.06); }

      /* BUTTONS */
      .btn-primary {
        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        color: #0B0700; border: none; font-family: 'DM Sans', sans-serif;
        font-weight: 600; cursor: pointer; border-radius: 10px;
        transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 8px;
      }
      .btn-primary:hover {
        background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(245,158,11,0.4);
      }
      .btn-primary:active { transform: scale(0.97); }

      .btn-ghost {
        background: transparent;
        border: 1px solid rgba(245,158,11,0.25);
        color: #F59E0B; font-family: 'DM Sans', sans-serif;
        font-weight: 500; cursor: pointer; border-radius: 10px;
        transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px;
      }
      .btn-ghost:hover {
        background: rgba(245,158,11,0.1);
        border-color: rgba(245,158,11,0.5);
      }

      .btn-danger {
        background: transparent;
        border: 1px solid rgba(239,68,68,0.3);
        color: #FCA5A5; font-family: 'DM Sans', sans-serif;
        font-weight: 500; cursor: pointer; border-radius: 8px;
        transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;
        padding: 7px 14px; font-size: 13px;
      }
      .btn-danger:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.5); }

      /* INPUTS */
      .input {
        background: rgba(255,248,230,0.05);
        border: 1px solid rgba(245,158,11,0.15);
        color: #FEF3C7;
        padding: 12px 16px; border-radius: 10px;
        font-family: 'DM Sans', sans-serif; font-size: 15px;
        outline: none; transition: all 0.2s; width: 100%;
      }
      .input:focus {
        border-color: rgba(245,158,11,0.5);
        background: rgba(255,248,230,0.07);
        box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
      }
      .input::placeholder { color: #57534E; }
      select.input option { background: #1C1209; color: #FEF3C7; }

      /* BADGES */
      .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.4px; }
      .badge-amber { background: rgba(245,158,11,0.18); color: #FBBF24; border: 1px solid rgba(245,158,11,0.28); }
      .badge-red { background: rgba(239,68,68,0.18); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.28); }
      .badge-green { background: rgba(16,185,129,0.18); color: #6EE7B7; border: 1px solid rgba(16,185,129,0.28); }
      .badge-blue { background: rgba(99,102,241,0.18); color: #A5B4FC; border: 1px solid rgba(99,102,241,0.28); }
      .badge-purple { background: rgba(168,85,247,0.18); color: #D8B4FE; border: 1px solid rgba(168,85,247,0.28); }

      /* FILTER CHIPS */
      .chip {
        padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all 0.2s;
        border: 1px solid rgba(245,158,11,0.18); color: #A8A29E;
        background: transparent; font-family: 'DM Sans', sans-serif;
      }
      .chip:hover, .chip.active {
        background: rgba(245,158,11,0.15); color: #F59E0B;
        border-color: rgba(245,158,11,0.4);
      }

      /* RATING STARS */
      .star-on { color: #F59E0B; }
      .star-off { color: #3F3A35; }

      /* TOAST */
      .toast {
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        animation: slideUp 0.35s cubic-bezier(0.4,0,0.2,1) forwards;
        max-width: 340px;
      }
      .toast-success { background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.35); color: #6EE7B7; }
      .toast-error { background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.35); color: #FCA5A5; }
      .toast-info { background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.35); color: #FDE68A; }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      /* ANIMATIONS */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      .fade-in { animation: fadeIn 0.45s ease forwards; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      .pulse { animation: pulse 1.5s infinite; }

      /* STATUS DOTS */
      .status-preparing { color: #FCD34D; }
      .status-out { color: #60A5FA; }
      .status-delivered { color: #34D399; }
      .status-cancelled { color: #F87171; }

      /* ORDER TIMELINE */
      .timeline-dot {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid currentColor; background: transparent;
        flex-shrink: 0;
      }
      .timeline-dot.done { background: currentColor; }

      /* DIVIDER */
      .divider {
        height: 1px; width: 100%;
        background: linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent);
        margin: 24px 0;
      }

      /* HERO */
      .hero-section {
        min-height: calc(100vh - 64px);
        display: flex; align-items: center;
        position: relative; overflow: hidden;
        padding: 80px 24px;
      }
      .hero-orb {
        position: absolute; border-radius: 50%; filter: blur(80px);
        pointer-events: none; opacity: 0.6;
      }

      /* SEARCH BAR */
      .search-bar {
        background: rgba(255,248,230,0.07);
        border: 1px solid rgba(245,158,11,0.2);
        border-radius: 100px; padding: 14px 24px;
        display: flex; align-items: center; gap: 12px;
        transition: all 0.2s;
      }
      .search-bar:focus-within {
        border-color: rgba(245,158,11,0.5);
        background: rgba(255,248,230,0.09);
        box-shadow: 0 0 0 4px rgba(245,158,11,0.08);
      }
      .search-input {
        background: transparent; border: none; outline: none;
        color: #FEF3C7; font-family: 'DM Sans', sans-serif;
        font-size: 15px; flex: 1;
      }
      .search-input::placeholder { color: #57534E; }

      /* IMAGE OVERLAY */
      .img-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(11,7,0,0.95) 0%, rgba(11,7,0,0.3) 50%, transparent 100%);
      }

      /* PRICE TAG */
      .price { font-size: 22px; font-weight: 700; color: #F59E0B; font-family: 'DM Sans', sans-serif; }

      /* SIZE SELECTOR */
      .size-btn {
        padding: 9px 20px; border-radius: 8px; cursor: pointer;
        border: 1px solid rgba(245,158,11,0.2); color: #A8A29E;
        background: transparent; font-family: 'DM Sans', sans-serif;
        font-size: 14px; font-weight: 500; transition: all 0.2s;
      }
      .size-btn.active, .size-btn:hover {
        background: rgba(245,158,11,0.15); color: #F59E0B;
        border-color: rgba(245,158,11,0.45);
      }

      /* QTY CONTROL */
      .qty-btn {
        width: 34px; height: 34px; border-radius: 8px;
        border: 1px solid rgba(245,158,11,0.25); color: #F59E0B;
        background: transparent; cursor: pointer; font-size: 18px;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        font-weight: 500;
      }
      .qty-btn:hover { background: rgba(245,158,11,0.12); }

      /* CART ITEM */
      .cart-item {
        display: flex; gap: 16px; padding: 16px;
        border-bottom: 1px solid rgba(245,158,11,0.08);
        align-items: center;
      }
      .cart-item img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }

      /* SECTION TITLE */
      .section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 700; line-height: 1.2; }
      .section-subtitle { font-size: 16px; color: #78716C; line-height: 1.6; }

      /* FORM LABEL */
      .form-label { display: block; font-size: 13px; color: #92400E; font-weight: 600; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }

      /* ADMIN TABLE */
      .admin-table { width: 100%; border-collapse: collapse; }
      .admin-table th { font-size: 12px; color: #92400E; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(245,158,11,0.1); }
      .admin-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid rgba(245,158,11,0.06); vertical-align: middle; }
      .admin-table tr:hover td { background: rgba(245,158,11,0.04); }

      /* STAT CARD */
      .stat-card {
        background: rgba(255,248,230,0.04); border: 1px solid rgba(245,158,11,0.1);
        border-radius: 16px; padding: 24px;
      }

      /* CHECKOUT STEP */
      .step-dot {
        width: 32px; height: 32px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700; flex-shrink: 0;
      }
      .step-active { background: #F59E0B; color: #0B0700; }
      .step-done { background: #065F46; color: #6EE7B7; border: 2px solid rgba(16,185,129,0.4); }
      .step-pending { background: rgba(245,158,11,0.08); color: #57534E; border: 1px solid rgba(245,158,11,0.15); }

      /* RESPONSIVE */
      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .hero-section { min-height: auto; padding: 48px 20px; }
        .navbar { padding: 0 16px; }
      }
      @media (max-width: 640px) {
        .cake-card img { height: 180px; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.getElementById("cakeapp-styles")) document.head.removeChild(style);
    };
  }, []);
}

/* ════════════════════════════════════════
   CONSTANTS & MOCK DATA
════════════════════════════════════════ */
const CAKES = [
  { id: 1, name: "Chocolate Truffle Cake", price: 849, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", description: "Rich, indulgent chocolate truffle cake layered with velvety ganache, premium Belgian chocolate curls, and silky dark chocolate mousse. A true celebration of pure chocolate bliss.", category: "Chocolate", rating: 4.8, reviewCount: 234, sizes: { small: 849, medium: 1249, large: 1649 }, flavors: ["Classic Chocolate", "Dark Chocolate", "Milk Chocolate"], badge: "Bestseller", badgeColor: "badge-amber", prepTime: "2–3 hrs", calories: "420 kcal/slice" },
  { id: 2, name: "Red Velvet Cake", price: 799, image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80", description: "Velvety crimson layers drenched in luxurious cream cheese frosting. A classic Southern masterpiece that's as stunning as it is irresistibly delicious.", category: "Classic", rating: 4.9, reviewCount: 189, sizes: { small: 799, medium: 1199, large: 1599 }, flavors: ["Original Red Velvet", "Cream Cheese Extra", "Vanilla Swirl"], badge: "Fan Favorite", badgeColor: "badge-red", prepTime: "2–3 hrs", calories: "380 kcal/slice" },
  { id: 3, name: "Black Forest Cake", price: 899, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80", description: "Layers of moist chocolate sponge, airy whipped cream, and Morello cherries soaked in Kirsch. A timeless German classic reimagined with premium ingredients.", category: "Fruit", rating: 4.7, reviewCount: 156, sizes: { small: 899, medium: 1349, large: 1749 }, flavors: ["Original", "Extra Cherry", "Dark Chocolate"], badge: "", badgeColor: "", prepTime: "3–4 hrs", calories: "390 kcal/slice" },
  { id: 4, name: "Butterscotch Cake", price: 749, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80", description: "Golden caramel butterscotch cake with praline crunch layers and salted caramel drizzle. Sweet, buttery perfection that melts on your tongue.", category: "Caramel", rating: 4.6, reviewCount: 112, sizes: { small: 749, medium: 1149, large: 1549 }, flavors: ["Classic Butterscotch", "Salted Caramel", "Toffee Crunch"], badge: "", badgeColor: "", prepTime: "2–3 hrs", calories: "445 kcal/slice" },
  { id: 5, name: "Pineapple Cake", price: 699, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80", description: "Tropical pineapple cake with fresh cream, glazed pineapple rings, and a hint of coconut. Light, refreshing, and utterly tropical — summer in a slice.", category: "Fruit", rating: 4.5, reviewCount: 98, sizes: { small: 699, medium: 1099, large: 1449 }, flavors: ["Fresh Pineapple", "Coconut Pineapple", "Vanilla Pineapple"], badge: "New", badgeColor: "badge-green", prepTime: "2–3 hrs", calories: "310 kcal/slice" },
  { id: 6, name: "KitKat Chocolate Cake", price: 1199, image: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=600&q=80", description: "Instagram-worthy KitKat-wrapped chocolate masterpiece filled with Kinder Bueno, crushed M&Ms, and chocolate ganache. The ultimate chocolate lover's dream.", category: "Chocolate", rating: 4.9, reviewCount: 278, sizes: { small: 1199, medium: 1699, large: 2199 }, flavors: ["KitKat & M&Ms", "KitKat & Kinder", "Triple KitKat"], badge: "Trending", badgeColor: "badge-purple", prepTime: "4–5 hrs", calories: "520 kcal/slice" },
  { id: 7, name: "Fruit Overload Cake", price: 999, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80", description: "Fresh seasonal berries piled high on a vanilla cream sponge with mango coulis. Bursting with natural color, flavor, and wholesome goodness.", category: "Fruit", rating: 4.7, reviewCount: 143, sizes: { small: 999, medium: 1499, large: 1999 }, flavors: ["Mixed Berries", "Tropical Medley", "Classic Fruit"], badge: "Healthy Pick", badgeColor: "badge-green", prepTime: "3–4 hrs", calories: "290 kcal/slice" },
];

const CATEGORIES = ["All", "Chocolate", "Classic", "Fruit", "Caramel", "Fusion"];
const ORDER_STATUSES = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];

/* ════════════════════════════════════════
   CONTEXT & REDUCER
════════════════════════════════════════ */
const AppCtx = createContext(null);

const init = {
  page: "home", cakeId: null,
  user: null,
  cart: [],
  orders: [],
  cakes: [],
  reviews: {
    1: [{ id: 1, user: "Priya M.", rating: 5, comment: "Absolutely divine! Best chocolate cake I've ever had. Rich, moist, and perfectly balanced.", date: "2 days ago" }],
    2: [{ id: 2, user: "Arjun S.", rating: 5, comment: "The red velvet was stunning. Cream cheese frosting was perfectly tangy. Will definitely order again!", date: "1 week ago" }],
  },
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CAKES": return { ...state, cakes: action.cakes };
    case "SET_ORDERS": return { ...state, orders: action.orders };
    case "SET_REVIEWS": return { ...state, reviews: { ...state.reviews, [action.cakeId]: action.reviews } };
    case "NAV": return { ...state, page: action.page, cakeId: action.cakeId || null };
    case "LOGIN": return { ...state, user: action.user, page: "home" };
    case "LOGOUT": return { ...state, user: null, cart: [], page: "home" };
    case "ADD_CART": {
      const cid = action.item.cake._id || action.item.cake.id;
      const key = `${cid}-${action.item.size}-${action.item.flavor}`;
      const existing = state.cart.find(c => c.key === key && c.message === action.item.message);
      if (existing) {
        return { ...state, cart: state.cart.map(c => c.key === key && c.message === action.item.message ? { ...c, qty: c.qty + 1 } : c) };
      }
      return { ...state, cart: [...state.cart, { ...action.item, key, qty: 1 }] };
    }
    case "REMOVE_CART": return { ...state, cart: state.cart.filter((_, i) => i !== action.index) };
    case "UPDATE_QTY": return { ...state, cart: state.cart.map((c, i) => i === action.index ? { ...c, qty: Math.max(1, c.qty + action.delta) } : c) };
    case "CLEAR_CART": return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const order = { id: `ORD${Date.now().toString().slice(-6)}`, items: state.cart, total: action.total, status: 0, date: new Date().toLocaleDateString("en-IN"), address: action.address, createdAt: Date.now() };
      return { ...state, cart: [], orders: [order, ...state.orders], page: "orders" };
    }
    case "ADVANCE_STATUS": return { ...state, orders: state.orders.map(o => (o.id === action.id || o._id === action.id) ? { ...o, status: action.status ?? Math.min(3, o.status + 1) } : o) };
    case "ADD_REVIEW": {
      const rev = { id: Date.now(), user: state.user?.name || "You", rating: action.rating, comment: action.comment, date: "Just now" };
      return { ...state, reviews: { ...state.reviews, [action.cakeId]: [rev, ...(state.reviews[action.cakeId] || [])] } };
    }
    case "ADMIN_ADD_CAKE": return { ...state, cakes: [...state.cakes, { ...action.cake, id: Date.now(), reviews: 0, rating: 0 }] };
    case "ADMIN_UPDATE_CAKE": return { ...state, cakes: state.cakes.map(c => c.id === action.cake.id ? action.cake : c) };
    case "ADMIN_DELETE_CAKE": return { ...state, cakes: state.cakes.filter(c => c.id !== action.id) };
    case "TOAST": return { ...state, toast: action.payload };
    case "CLEAR_TOAST": return { ...state, toast: null };
    default: return state;
  }
}

/* ════════════════════════════════════════
   UI ATOMS
════════════════════════════════════════ */
function Stars({ rating, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? "star-on" : "star-off"} style={{ fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function Toast() {
  const { state, dispatch } = useContext(AppCtx);
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);
  if (!state.toast) return null;
  return (
    <div className={`toast toast-${state.toast.type}`}>
      <span style={{ marginRight: 8 }}>{state.toast.type === "success" ? "✓" : state.toast.type === "error" ? "✕" : "ℹ"}</span>
      {state.toast.message}
    </div>
  );
}

function toast(dispatch, message, type = "success") {
  dispatch({ type: "TOAST", payload: { message, type } });
}

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
function Navbar() {
  const { state, dispatch } = useContext(AppCtx);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  const nav = (page) => { dispatch({ type: "NAV", page }); setMenuOpen(false); };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => nav("home")}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #F59E0B, #EF4444)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎂</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#FEF3C7" }}>
          Cake<span style={{ color: "#F59E0B" }}>O</span>
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {["home", "cakes", "orders"].map(p => (
          <button key={p} onClick={() => nav(p)} style={{ background: "none", border: "none", padding: "8px 14px", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500, color: state.page === p ? "#F59E0B" : "#A8A29E", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", textTransform: "capitalize" }}>
            {p === "home" ? "Home" : p === "cakes" ? "Browse Cakes" : "My Orders"}
          </button>
        ))}
        {state.user?.role === "admin" && (
          <button onClick={() => nav("admin")} style={{ background: "none", border: "none", padding: "8px 14px", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500, color: state.page === "admin" ? "#F59E0B" : "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>Admin</button>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button className="btn-ghost" onClick={() => nav("cart")} style={{ padding: "8px 14px", fontSize: 14, borderRadius: 10, position: "relative" }}>
          🛒
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{cartCount}</span>
          )}
          <span className="hide-mobile" style={{ marginLeft: 4 }}>Cart</span>
        </button>
        {state.user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #92400E, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0B0700", cursor: "pointer" }} title={state.user.name}>
              {state.user.name[0].toUpperCase()}
            </div>
            <button className="btn-ghost" onClick={() => dispatch({ type: "LOGOUT" })} style={{ padding: "7px 14px", fontSize: 13, borderRadius: 8 }}>Logout</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => nav("auth")} style={{ padding: "9px 18px", fontSize: 14, borderRadius: 10 }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════ */
function HomePage() {
  const { state, dispatch } = useContext(AppCtx);
  const nav = (page, cakeId) => dispatch({ type: "NAV", page, cakeId });
  const featured = state.cakes.slice(0, 3);

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="hero-section" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 60, paddingBottom: 80 }}>
        <div className="hero-orb" style={{ width: 600, height: 600, background: "rgba(245,158,11,0.12)", top: -200, right: -150 }} />
        <div className="hero-orb" style={{ width: 400, height: 400, background: "rgba(239,68,68,0.07)", bottom: -100, left: -100 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <div className="badge badge-amber" style={{ marginBottom: 20, fontSize: 12 }}>✦ Premium Artisan Cakes · Mumbai</div>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Every slice tells a <span style={{ color: "#F59E0B", fontStyle: "italic" }}>sweet story</span>
          </h1>
          <p className="section-subtitle" style={{ fontSize: 18, marginBottom: 40, maxWidth: 480 }}>
            Handcrafted cakes made with premium ingredients, delivered fresh to your doorstep. Customise to perfection.
          </p>

          {/* Search Bar */}
          <div className="search-bar" style={{ maxWidth: 500, marginBottom: 40 }}>
            <span style={{ color: "#57534E", fontSize: 18 }}>🔍</span>
            <input className="search-input" placeholder="Search for cakes, flavours..." onKeyDown={e => e.key === "Enter" && nav("cakes")} />
            <button className="btn-primary" onClick={() => nav("cakes")} style={{ padding: "10px 20px", fontSize: 14, borderRadius: 8, whiteSpace: "nowrap" }}>Explore</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["500+", "Cake Designs"], ["4.8★", "Avg Rating"], ["10K+", "Happy Orders"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B", fontFamily: "'DM Sans', sans-serif" }}>{n}</div>
                <div style={{ fontSize: 12, color: "#57534E", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Cake Image */}
        <div className="hide-mobile" style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
          <div style={{ width: 420, height: 420, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(245,158,11,0.2)", boxShadow: "0 0 80px rgba(245,158,11,0.15), 0 40px 80px rgba(0,0,0,0.5)" }}>
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" alt="hero cake" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", top: -20, right: -20, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 16, padding: "12px 18px", backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>BESTSELLER</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#FEF3C7", marginTop: 2 }}>Choco Truffle</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F59E0B", marginTop: 2 }}>₹849</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Browse by Category</h2>
        <p className="section-subtitle" style={{ marginBottom: 32 }}>Find your perfect match</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { name: "Chocolate", emoji: "🍫", count: 12, color: "rgba(139,69,19,0.3)" },
            { name: "Classic", emoji: "🎂", count: 8, color: "rgba(220,38,38,0.2)" },
            { name: "Fruit", emoji: "🍓", count: 15, color: "rgba(16,185,129,0.2)" },
            { name: "Caramel", emoji: "🍮", count: 6, color: "rgba(245,158,11,0.2)" },
            { name: "Custom", emoji: "✨", count: 99, color: "rgba(139,92,246,0.2)" },
          ].map(cat => (
            <div key={cat.name} onClick={() => nav("cakes")} style={{ background: cat.color, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 20px", cursor: "pointer", textAlign: "center", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#FEF3C7" }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>{cat.count} cakes</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Featured Cakes</h2>
            <p className="section-subtitle">Our most loved creations</p>
          </div>
          <button className="btn-ghost" onClick={() => nav("cakes")} style={{ padding: "10px 20px", fontSize: 14 }}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {featured.map(cake => <CakeCard key={cake.id} cake={cake} />)}
        </div>
      </section>

      {/* WHY US */}
      <section style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.08)", borderBottom: "1px solid rgba(245,158,11,0.08)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Why Choose CakeO?</h2>
          <p className="section-subtitle" style={{ textAlign: "center", marginBottom: 56 }}>The finest ingredients, the finest experience</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { icon: "🧁", title: "Artisan Quality", desc: "Every cake handcrafted by certified pastry chefs with 10+ years of experience." },
              { icon: "🚚", title: "Same Day Delivery", desc: "Order before 2 PM for same-day delivery across Mumbai in our refrigerated vehicles." },
              { icon: "✏️", title: "Full Customisation", desc: "Pick size, flavour, message, and toppings. We make exactly what you envision." },
              { icon: "⭐", title: "4.9 Rated", desc: "Over 10,000 five-star reviews from happy customers across Mumbai & beyond." },
            ].map(f => (
              <div key={f.title} className="glass" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#78716C", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 48 }}>What Our Customers Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { name: "Priya Malhotra", role: "Home Baker", text: "The Chocolate Truffle was absolutely divine. Best cake I've had in Mumbai. The ganache was perfectly silky!", rating: 5, avatar: "P" },
            { name: "Rahul Khanna", role: "Birthday Celebrant", text: "Ordered the KitKat cake for my birthday. Wow! It was exactly like the photos and tasted even better!", rating: 5, avatar: "R" },
            { name: "Ananya Sharma", role: "Wedding Planner", text: "CakeO is my go-to for all client events. Professional, punctual, and absolutely delicious every single time.", rating: 5, avatar: "A" },
          ].map(t => (
            <div key={t.name} className="glass" style={{ padding: 28 }}>
              <Stars rating={t.rating} size={16} />
              <p style={{ marginTop: 16, fontSize: 15, color: "#D6D3D1", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #92400E, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0B0700" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FEF3C7" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#78716C" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.08) 100%)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 24, padding: "56px 48px", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Special Occasion? 🎉</h2>
          <p style={{ fontSize: 17, color: "#A8A29E", marginBottom: 32 }}>Order a custom cake with your personal message and make it unforgettable.</p>
          <button className="btn-primary" onClick={() => nav("cakes")} style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>Order Your Cake Now</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(245,158,11,0.08)", padding: "40px 24px", textAlign: "center", color: "#57534E", fontSize: 13 }}>
        <div style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#FEF3C7", marginBottom: 8 }}>🎂 CakeO</div>
        <p>© {new Date().getFullYear()} CakeO. Crafted with ❤️ in Mumbai. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════
   CAKE CARD (shared)
════════════════════════════════════════ */
function CakeCard({ cake }) {
  const { dispatch } = useContext(AppCtx);
  const nav = (page, cakeId) => dispatch({ type: "NAV", page, cakeId });
  const sale = cake.salePercent && cake.salePercent > 0;
  const displayPrice = sale ? Math.round(cake.price * (1 - cake.salePercent / 100)) : cake.price;

  return (
    <div className="cake-card" onClick={() => nav("cake-detail", cake._id || cake.id)}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={cake.image} alt={cake.name} loading="lazy" />
        <div className="img-overlay" />
        {cake.badge && <span className={`badge ${cake.badgeColor}`} style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>{cake.badge}</span>}
        {sale && <span className="badge badge-red" style={{ position: "absolute", top: cake.badge ? 40 : 14, left: 14, zIndex: 2 }}>SALE {cake.salePercent}% OFF</span>}
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Stars rating={cake.rating} size={13} />
            <span style={{ fontSize: 12, color: "#D6D3D1" }}>{cake.rating} ({cake.reviewCount || 0})</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#FEF3C7", lineHeight: 1.2 }}>{cake.name}</h3>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="price">₹{displayPrice}</span>
            {sale && <span style={{ fontSize: 14, color: "#78716C", textDecoration: "line-through" }}>₹{cake.price}</span>}
          </div>
          <span className={`badge ${cake.badgeColor || "badge-amber"}`}>{cake.category}</span>
        </div>
        <p style={{ fontSize: 13, color: "#78716C", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{cake.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#57534E" }}>Prep: {cake.prepTime}</span>
          <button className="btn-primary" onClick={e => { e.stopPropagation(); nav("cake-detail", cake._id || cake.id); }} style={{ padding: "9px 18px", fontSize: 13, borderRadius: 8 }}>Order Now</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CAKE LISTING PAGE
════════════════════════════════════════ */
function CakesPage() {
  const { state } = useContext(AppCtx);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");

  const filtered = state.cakes
    .filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && c.category !== category) return false;
      if (c.price > maxPrice) return false;
      if (c.rating < minRating) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>All Cakes</h1>
        <p className="section-subtitle">{filtered.length} results found</p>
      </div>

      {/* Search + Sort Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <span style={{ color: "#57534E" }}>🔍</span>
          <input className="search-input" placeholder="Search cakes..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#57534E", cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>
        <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 160 }}>
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Filters Row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`chip ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>{cat}</button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 12, color: "#78716C", whiteSpace: "nowrap" }}>Max: ₹{maxPrice}</span>
          <input type="range" min={500} max={2500} step={100} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: 100, accentColor: "#F59E0B" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#78716C" }}>Rating:</span>
          {[0, 4, 4.5, 4.8].map(r => (
            <button key={r} className={`chip ${minRating === r ? "active" : ""}`} onClick={() => setMinRating(r)} style={{ padding: "5px 12px" }}>{r === 0 ? "All" : `${r}+`}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map(cake => <CakeCard key={cake.id} cake={cake} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎂</div>
          <h3 style={{ fontSize: 24, marginBottom: 8 }}>No cakes found</h3>
          <p style={{ color: "#78716C" }}>Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   CAKE DETAIL PAGE
════════════════════════════════════════ */
function CakeDetailPage() {
  const { state, dispatch } = useContext(AppCtx);
  const cake = state.cakes.find(c => (c._id || c.id) === state.cakeId);
  const [size, setSize] = useState("medium");
  const [flavor, setFlavor] = useState("");
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [tab, setTab] = useState("details");

  useEffect(() => {
    if (cake) setFlavor(cake.flavors[0]);
  }, [cake]);

  useEffect(() => {
    if (cake) {
      api.get(`/reviews/${cake.id || cake._id}`).then(res => {
        dispatch({ type: "SET_REVIEWS", cakeId: cake.id || cake._id, reviews: res.data.data });
      }).catch(console.log);
    }
  }, [cake?.id, cake?._id]);

  if (!cake) return <div style={{ textAlign: "center", padding: 80 }}>Cake not found</div>;

  const price = cake.sizes[size];
  const reviews = state.reviews[cake.id || cake._id] || [];

  const handleAddCart = () => {
    if (!state.user) { dispatch({ type: "NAV", page: "auth" }); return; }
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD_CART", item: { cake, size, flavor, message } });
    toast(dispatch, `${cake.name} added to cart! 🎂`);
  };

  const handleReview = async () => {
    if (!state.user) { dispatch({ type: "NAV", page: "auth" }); return; }
    if (!reviewText.trim()) return;
    try {
      await api.post(`/reviews/${cake.id || cake._id}`, { rating: reviewRating, comment: reviewText });
      toast(dispatch, "Review submitted! Thanks for your feedback.");
      setReviewText("");
      const res = await api.get(`/reviews/${cake.id || cake._id}`);
      dispatch({ type: "SET_REVIEWS", cakeId: cake.id || cake._id, reviews: res.data.data });
    } catch(err) {
      toast(dispatch, err.response?.data?.message || "Failed to submit review", "error");
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : cake.rating;

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {/* Back */}
      <button className="btn-ghost" onClick={() => dispatch({ type: "NAV", page: "cakes" })} style={{ padding: "8px 16px", fontSize: 14, marginBottom: 32 }}>← Back to Cakes</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* Left: Image */}
        <div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
            <img src={cake.image} alt={cake.name} style={{ width: "100%", height: 420, objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {["small", "medium", "large"].map(s => (
              <img key={s} src={cake.image} alt={s} onClick={() => setSize(s)} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, cursor: "pointer", border: `2px solid ${size === s ? "#F59E0B" : "rgba(245,158,11,0.15)"}`, opacity: size === s ? 1 : 0.6, transition: "all 0.2s" }} />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span className={`badge ${cake.badgeColor || "badge-amber"}`}>{cake.category}</span>
            {cake.badge && <span className={`badge ${cake.badgeColor}`}>{cake.badge}</span>}
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>{cake.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Stars rating={avgRating} size={16} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "#F59E0B" }}>{avgRating}</span>
            <span style={{ fontSize: 14, color: "#78716C" }}>({reviews.length || cake.reviewCount || 0} reviews)</span>
          </div>
          <p style={{ fontSize: 15, color: "#A8A29E", lineHeight: 1.7, marginBottom: 24 }}>{cake.description}</p>

          {/* Price */}
          <div style={{ marginBottom: 24 }}>
            <span className="price" style={{ fontSize: 32 }}>₹{price}</span>
            <span style={{ fontSize: 13, color: "#78716C", marginLeft: 8 }}>for {size} size</span>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Size</label>
            <div style={{ display: "flex", gap: 10 }}>
              {Object.entries(cake.sizes).map(([s, p]) => (
                <button key={s} className={`size-btn ${size === s ? "active" : ""}`} onClick={() => setSize(s)}>
                  <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{s}</div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>₹{p}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Flavor */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Flavour</label>
            <select className="input" value={flavor} onChange={e => setFlavor(e.target.value)}>
              {cake.flavors.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Message on Cake <span style={{ color: "#78716C", textTransform: "none", fontWeight: 400, fontSize: 11 }}>(optional)</span></label>
            <input className="input" placeholder="e.g. Happy Birthday Rahul! 🎉" value={message} onChange={e => setMessage(e.target.value)} maxLength={50} />
            <div style={{ fontSize: 11, color: "#57534E", marginTop: 4, textAlign: "right" }}>{message.length}/50</div>
          </div>

          {/* Qty + Add to Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, padding: "4px 8px" }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: 600 }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="btn-primary" onClick={handleAddCart} style={{ flex: 1, padding: "14px 24px", fontSize: 16, borderRadius: 12 }}>
              🛒 Add to Cart — ₹{price * qty}
            </button>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 20, fontSize: 13, color: "#78716C" }}>
            <span>⏱ {cake.prepTime} prep</span>
            <span>🔥 {cake.calories}</span>
            <span>🚚 Free delivery above ₹999</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="divider" />
      <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid rgba(245,158,11,0.08)" }}>
        {["details", "reviews"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", padding: "12px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: tab === t ? "#F59E0B" : "#78716C", borderBottom: `2px solid ${tab === t ? "#F59E0B" : "transparent"}`, marginBottom: -1, textTransform: "capitalize", transition: "all 0.2s" }}>
            {t === "reviews" ? `Reviews (${reviews.length || cake.reviewCount || 0})` : "Details"}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cake Highlights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[`Premium ${cake.flavors[0]} flavour`, "100% fresh ingredients", "No artificial preservatives", "Custom message included", `${cake.prepTime} freshness guarantee`].map(h => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#D6D3D1" }}>
                  <span style={{ color: "#10B981", fontSize: 16 }}>✓</span>{h}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Available Flavours</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cake.flavors.map(f => <span key={f} className="badge badge-amber">{f}</span>)}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "20px 0 16px" }}>Serving Sizes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Small", "serves 4–6", cake.sizes.small], ["Medium", "serves 8–12", cake.sizes.medium], ["Large", "serves 14–20", cake.sizes.large]].map(([s, n, p]) => (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#A8A29E", padding: "8px 0", borderBottom: "1px solid rgba(245,158,11,0.06)" }}>
                  <span style={{ fontWeight: 500 }}>{s} <span style={{ color: "#57534E", fontWeight: 400 }}>— {n}</span></span>
                  <span style={{ color: "#F59E0B", fontWeight: 700 }}>₹{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div>
          {/* Write Review */}
          {state.user && (
            <div className="glass" style={{ padding: 24, marginBottom: 32, borderRadius: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Write a Review</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => setReviewRating(r)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 28, color: r <= reviewRating ? "#F59E0B" : "#3F3A35", transition: "all 0.15s", padding: 0 }}>★</button>
                ))}
              </div>
              <textarea className="input" placeholder="Share your experience..." value={reviewText} onChange={e => setReviewText(e.target.value)} style={{ resize: "vertical", minHeight: 90, marginBottom: 14 }} />
              <button className="btn-primary" onClick={handleReview} style={{ padding: "10px 24px", fontSize: 14 }}>Submit Review</button>
            </div>
          )}

          {/* Reviews List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.length === 0 && <p style={{ color: "#78716C", textAlign: "center", padding: 40 }}>No reviews yet. Be the first to review!</p>}
            {reviews.map(r => (
              <div key={r.id} className="glass" style={{ padding: "20px 24px", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #92400E, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#0B0700" }}>{(r.userName || r.user || "U")[0]}</div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.userName || r.user}</span>
                    <Stars rating={r.rating} size={12} />
                  </div>
                  <span style={{ fontSize: 12, color: "#78716C" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: 14, color: "#A8A29E", lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   CART PAGE
════════════════════════════════════════ */
function CartPage() {
  const { state, dispatch } = useContext(AppCtx);
  const nav = (page) => dispatch({ type: "NAV", page });
  const subtotal = state.cart.reduce((s, c) => s + c.cake.sizes[c.size] * c.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 79;
  const total = subtotal + delivery;

  if (state.cart.length === 0) return (
    <div className="fade-in" style={{ textAlign: "center", padding: "120px 24px" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: "#78716C", marginBottom: 32 }}>Looks like you haven't added any cakes yet.</p>
      <button className="btn-primary" onClick={() => nav("cakes")} style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>Browse Cakes</button>
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Your Cart ({state.cart.length} item{state.cart.length > 1 ? "s" : ""})</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        {/* Cart Items */}
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
          {state.cart.map((item, idx) => {
            const itemPrice = item.cake.sizes[item.size];
            return (
              <div key={idx} className="cart-item">
                <img src={item.cake.image} alt={item.cake.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{item.cake.name}</h3>
                    <button onClick={() => dispatch({ type: "REMOVE_CART", index: idx })} style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", fontSize: 16, padding: "0 4px", flexShrink: 0 }}>✕</button>
                  </div>
                  <div style={{ fontSize: 12, color: "#78716C", marginBottom: 8 }}>
                    {item.size.charAt(0).toUpperCase() + item.size.slice(1)} · {item.flavor}
                    {item.message && ` · "${item.message}"`}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", index: idx, delta: -1 })}>-</button>
                      <span style={{ minWidth: 24, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", index: idx, delta: 1 })}>+</button>
                    </div>
                    <span className="price" style={{ fontSize: 18 }}>₹{itemPrice * item.qty}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            {[["Subtotal", `₹${subtotal}`], ["Delivery", delivery === 0 ? "FREE" : `₹${delivery}`], ["Taxes (5%)", `₹${Math.round(subtotal * 0.05)}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12, color: "#A8A29E" }}>
                <span>{l}</span><span style={{ color: v === "FREE" ? "#34D399" : "#FEF3C7", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
              <span>Total</span>
              <span className="price">₹{Math.round(total + subtotal * 0.05)}</span>
            </div>
            {delivery === 0 && <div style={{ fontSize: 12, color: "#34D399", marginTop: 8, textAlign: "center" }}>🎉 You saved ₹79 on delivery!</div>}
          </div>

          {/* Promo Code */}
          <div className="glass" style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input" placeholder="Promo code" style={{ flex: 1 }} />
              <button className="btn-ghost" style={{ padding: "0 16px", fontSize: 13, whiteSpace: "nowrap" }}>Apply</button>
            </div>
          </div>

          <button className="btn-primary" onClick={() => { if (!state.user) { dispatch({ type: "NAV", page: "auth" }); return; } dispatch({ type: "NAV", page: "checkout" }); }} style={{ width: "100%", padding: "16px 24px", fontSize: 16, borderRadius: 12, justifyContent: "center" }}>
            Proceed to Checkout →
          </button>
          <button className="btn-ghost" onClick={() => nav("cakes")} style={{ width: "100%", padding: "12px 24px", fontSize: 14, borderRadius: 12, justifyContent: "center", marginTop: 10 }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CHECKOUT PAGE
════════════════════════════════════════ */
function CheckoutPage() {
  const { state, dispatch } = useContext(AppCtx);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: state.user?.name || "", email: state.user?.email || "", phone: "", address: "", city: "Mumbai", pincode: "", notes: "" });
  const [payment, setPayment] = useState("card");

  const subtotal = state.cart.reduce((s, c) => s + c.cake.sizes[c.size] * c.qty, 0);
  const total = Math.round(subtotal + (subtotal >= 999 ? 0 : 79) + subtotal * 0.05);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    try {
      const addressStr = `${form.address}, ${form.city} - ${form.pincode}`;
      const payload = {
        items: state.cart.map(c => ({ cake: c.cake._id || c.cake.id, name: c.cake.name, image: c.cake.image, price: c.cake.sizes[c.size], size: c.size, flavor: c.flavor, message: c.message, qty: c.qty })),
        subtotal, deliveryFee: subtotal >= 999 ? 0 : 79, tax: Math.round(subtotal * 0.05), total,
        deliveryAddress: { name: form.name, phone: form.phone, line1: form.address, city: form.city, pincode: form.pincode, notes: form.notes },
        paymentMethod: payment
      };
      await api.post('/orders', payload);
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "NAV", page: "orders" });
      toast(dispatch, "Order placed successfully! 🎉 Track it in My Orders.", "success");
      
      const res = await api.get('/orders/mine');
      dispatch({ type: "SET_ORDERS", orders: res.data.data });
    } catch (err) {
      toast(dispatch, err.response?.data?.message || "Failed to place order", "error");
    }
  };

  const steps = ["Delivery", "Payment", "Review"];

  return (
    <div className="fade-in" style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px" }}>
      <button className="btn-ghost" onClick={() => dispatch({ type: "NAV", page: "cart" })} style={{ padding: "8px 16px", fontSize: 14, marginBottom: 32 }}>← Back to Cart</button>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className={`step-dot ${step > i + 1 ? "step-done" : step === i + 1 ? "step-active" : "step-pending"}`}>{step > i + 1 ? "✓" : i + 1}</div>
              <span style={{ fontSize: 14, fontWeight: 500, color: step === i + 1 ? "#F59E0B" : step > i + 1 ? "#34D399" : "#57534E" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#065F46" : "rgba(245,158,11,0.12)", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
        {/* Form */}
        <div>
          {step === 1 && (
            <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Delivery Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label className="form-label">Full Name</label><input className="input" value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Priya Sharma" /></div>
                <div><label className="form-label">Phone</label><input className="input" value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label className="form-label">Email</label><input className="input" type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="priya@example.com" /></div>
              <div style={{ marginBottom: 16 }}><label className="form-label">Delivery Address</label><textarea className="input" value={form.address} onChange={e => upd("address", e.target.value)} placeholder="Flat / House No., Street, Area" style={{ resize: "vertical", minHeight: 80 }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label className="form-label">City</label><input className="input" value={form.city} onChange={e => upd("city", e.target.value)} /></div>
                <div><label className="form-label">Pincode</label><input className="input" value={form.pincode} onChange={e => upd("pincode", e.target.value)} placeholder="400001" /></div>
              </div>
              <div style={{ marginBottom: 24 }}><label className="form-label">Delivery Notes <span style={{ color: "#78716C", fontSize: 10, fontWeight: 400, textTransform: "none" }}>(optional)</span></label><input className="input" value={form.notes} onChange={e => upd("notes", e.target.value)} placeholder="Leave at door, call before delivery, etc." /></div>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ padding: "13px 28px", fontSize: 15, borderRadius: 11 }} disabled={!form.name || !form.phone || !form.address}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Payment Method</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {[["card", "💳", "Credit / Debit Card"], ["upi", "📱", "UPI (GPay, PhonePe, Paytm)"], ["cod", "💵", "Cash on Delivery"]].map(([v, icon, label]) => (
                  <label key={v} onClick={() => setPayment(v)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, border: `1px solid ${payment === v ? "rgba(245,158,11,0.5)" : "rgba(245,158,11,0.12)"}`, background: payment === v ? "rgba(245,158,11,0.07)" : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payment === v ? "#F59E0B" : "#57534E"}`, background: payment === v ? "#F59E0B" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {payment === v && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0B0700" }} />}
                    </div>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
                  </label>
                ))}
              </div>
              {payment === "card" && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}><label className="form-label">Card Number</label><input className="input" placeholder="1234 5678 9012 3456" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div><label className="form-label">Expiry</label><input className="input" placeholder="MM/YY" /></div>
                    <div><label className="form-label">CVV</label><input className="input" placeholder="123" /></div>
                    <div><label className="form-label">Name</label><input className="input" placeholder="Name on card" /></div>
                  </div>
                </div>
              )}
              {payment === "upi" && (
                <div style={{ marginBottom: 24 }}><label className="form-label">UPI ID</label><input className="input" placeholder="yourname@upi" /></div>
              )}
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-ghost" onClick={() => setStep(1)} style={{ padding: "12px 20px", fontSize: 14 }}>← Back</button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ padding: "13px 28px", fontSize: 15, borderRadius: 11 }}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Review Your Order</h3>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>Delivery To</div>
                <div style={{ fontSize: 14, color: "#D6D3D1", lineHeight: 1.6 }}>
                  <strong>{form.name}</strong> · {form.phone}<br />
                  {form.address}, {form.city} — {form.pincode}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>Payment</div>
                <div style={{ fontSize: 14, color: "#D6D3D1" }}>{payment === "card" ? "💳 Credit/Debit Card" : payment === "upi" ? "📱 UPI" : "💵 Cash on Delivery"}</div>
              </div>
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#34D399" }}>
                ✓ Estimated delivery in <strong>2–4 hours</strong>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-ghost" onClick={() => setStep(2)} style={{ padding: "12px 20px", fontSize: 14 }}>← Back</button>
                <button className="btn-primary" onClick={placeOrder} style={{ flex: 1, padding: "14px 24px", fontSize: 16, borderRadius: 12, justifyContent: "center" }}>
                  Place Order · ₹{total}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass" style={{ padding: 24, borderRadius: 16, alignSelf: "start" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {state.cart.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
              <img src={item.cake.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.cake.name}</div>
                <div style={{ fontSize: 11, color: "#78716C" }}>{item.size} · ×{item.qty}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B", flexShrink: 0 }}>₹{item.cake.sizes[item.size] * item.qty}</span>
            </div>
          ))}
          <div className="divider" style={{ margin: "16px 0" }} />
          {[["Subtotal", `₹${subtotal}`], ["Delivery", subtotal >= 999 ? "FREE" : "₹79"], ["Tax (5%)", `₹${Math.round(subtotal * 0.05)}`]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#A8A29E" }}>
              <span>{l}</span><span style={{ color: v === "FREE" ? "#34D399" : "#FEF3C7" }}>{v}</span>
            </div>
          ))}
          <div className="divider" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17 }}>
            <span>Total</span><span style={{ color: "#F59E0B" }}>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   AUTH PAGE
════════════════════════════════════════ */
function AuthPage() {
  const { dispatch } = useContext(AppCtx);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin ? { email: form.email, password: form.password } : { name: form.name || form.email.split("@")[0], email: form.email, password: form.password, phone: form.phone || "" };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('cakeo_token', res.data.token);
      dispatch({ type: "LOGIN", user: res.data.data.user });
      toast(dispatch, `Welcome back, ${res.data.data.user.name}! 👋`);
    } catch (err) {
      toast(dispatch, err.response?.data?.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="glass" style={{ padding: 40, borderRadius: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎂</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p style={{ fontSize: 14, color: "#78716C" }}>{isLogin ? "Sign in to your CakeO account" : "Join CakeO for the sweetest experience"}</p>
          </div>

          {/* Social Login */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[["G", "Google", "#4285F4"], ["F", "Facebook", "#1877F2"]].map(([l, n, c]) => (
              <button key={n} onClick={() => toast(dispatch, `${n} login coming soon!`, "info")} style={{ flex: 1, padding: "11px 16px", borderRadius: 10, border: `1px solid rgba(255,255,255,0.08)`, background: "rgba(255,255,255,0.04)", color: "#FEF3C7", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                <span style={{ width: 18, height: 18, borderRadius: 4, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{l}</span>
                {n}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(245,158,11,0.1)" }} />
            <span style={{ fontSize: 12, color: "#57534E" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(245,158,11,0.1)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!isLogin && (
              <div><label className="form-label">Full Name</label><input className="input" value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Priya Sharma" /></div>
            )}
            <div><label className="form-label">Email Address</label><input className="input" type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="priya@example.com" /></div>
            <div><label className="form-label">Password</label><input className="input" type="password" value={form.password} onChange={e => upd("password", e.target.value)} placeholder="••••••••" /></div>
            {!isLogin && (
              <div><label className="form-label">Confirm Password</label><input className="input" type="password" value={form.confirmPassword} onChange={e => upd("confirmPassword", e.target.value)} placeholder="••••••••" /></div>
            )}
          </div>

          {isLogin && <div style={{ textAlign: "right", marginTop: 8 }}><button style={{ background: "none", border: "none", color: "#F59E0B", cursor: "pointer", fontSize: 13 }}>Forgot password?</button></div>}

          <button className="btn-primary" onClick={handleAuth} disabled={loading || !form.email || !form.password} style={{ width: "100%", padding: "14px", fontSize: 16, borderRadius: 12, justifyContent: "center", marginTop: 24, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#78716C" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(l => !l)} style={{ background: "none", border: "none", color: "#F59E0B", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>

          <p style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#3D3530" }}>
            Use <strong style={{ color: "#57534E" }}>admin@cakeo.com</strong> for admin access
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ORDERS PAGE
════════════════════════════════════════ */
function OrdersPage() {
  const { state, dispatch } = useContext(AppCtx);

  useEffect(() => {
    if (state.user) {
      api.get('/orders/mine').then(res => dispatch({ type: "SET_ORDERS", orders: res.data.data })).catch(console.log);
    }
  }, [state.user, state.page]);

  useEffect(() => {
    if (!state.user || state.orders.length === 0) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    state.orders.forEach(o => socket.emit('track_order', o._id || o.id));
    socket.on('order_status', ({ orderId, status }) => {
      dispatch({ type: "ADVANCE_STATUS", id: orderId, status });
    });
    return () => socket.disconnect();
  }, [state.orders.map(o => o.id || o._id).join(',')]);

  if (!state.user) return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Sign in to view orders</h2>
      <button className="btn-primary" onClick={() => dispatch({ type: "NAV", page: "auth" })} style={{ marginTop: 8, padding: "13px 28px", fontSize: 15 }}>Sign In</button>
    </div>
  );

  if (state.orders.length === 0) return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>📦</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>No orders yet</h2>
      <p style={{ color: "#78716C", marginBottom: 32 }}>Your cake orders will appear here.</p>
      <button className="btn-primary" onClick={() => dispatch({ type: "NAV", page: "cakes" })} style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>Order Your First Cake</button>
    </div>
  );

  const statusColors = ["#FCD34D", "#60A5FA", "#A78BFA", "#34D399"];
  const statusIcons = ["✓", "👨‍🍳", "🛵", "🎉"];

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div><h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>My Orders</h1><p className="section-subtitle">{state.orders.length} order{state.orders.length > 1 ? "s" : ""} placed</p></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {state.orders.map(order => (
          <div key={order._id || order.id} className="glass" style={{ borderRadius: 20, overflow: "hidden" }}>
            {/* Order Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(245,158,11,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 11, color: "#92400E", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Order ID</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{(order._id || order.id || "").slice(-8).toUpperCase()}</div></div>
                <div><div style={{ fontSize: 11, color: "#92400E", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Date</div><div style={{ fontSize: 14, marginTop: 2 }}>{order.date || new Date(order.createdAt).toLocaleDateString("en-IN")}</div></div>
                <div><div style={{ fontSize: 11, color: "#92400E", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Total</div><div style={{ fontSize: 16, fontWeight: 700, color: "#F59E0B", marginTop: 2 }}>₹{order.total}</div></div>
              </div>
              {order.status < 3 && (
                <button className="btn-ghost" onClick={() => { dispatch({ type: "ADVANCE_STATUS", id: order._id || order.id }); toast(dispatch, `Order status updated!`, "info"); }} style={{ padding: "8px 16px", fontSize: 13 }}>
                  Simulate Next Step
                </button>
              )}
            </div>

            {/* Status Timeline */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(245,158,11,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "5%", right: "5%", height: 2, background: "rgba(245,158,11,0.1)", transform: "translateY(-50%)", zIndex: 0 }} />
                {ORDER_STATUSES.map((s, i) => (
                  <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1, flex: 1 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: i <= order.status ? (i === order.status ? "#F59E0B" : "rgba(245,158,11,0.15)") : "rgba(45,35,20,0.8)", border: `2px solid ${i <= order.status ? statusColors[i] : "rgba(245,158,11,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.3s" }}>
                      {statusIcons[i]}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: i <= order.status ? statusColors[i] : "#57534E", textAlign: "center", lineHeight: 1.3 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {order.items.map((item, idx) => {
                  const cakeData = item.cake || {};
                  const cakeName = cakeData.name || item.name || "Cake";
                  const cakeImage = cakeData.image || item.image || "";
                  return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,248,230,0.03)", border: "1px solid rgba(245,158,11,0.08)", borderRadius: 10, padding: "10px 14px" }}>
                    {cakeImage && <img src={cakeImage} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{cakeName}</div>
                      <div style={{ fontSize: 11, color: "#78716C" }}>{item.size} · {item.flavor} · ×{item.qty}</div>
                    </div>
                  </div>
                  );
                })}
              </div>
              {(order.address || order.deliveryAddress) && (
                <div style={{ marginTop: 14, fontSize: 13, color: "#78716C", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>📍</span> {order.address || `${order.deliveryAddress?.line1 || ""}, ${order.deliveryAddress?.city || ""}`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════ */
function AdminPage() {
  const { state, dispatch } = useContext(AppCtx);
  const [tab, setTab] = useState("overview");
  const [editCake, setEditCake] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saleInputs, setSaleInputs] = useState({});
  const [statusUpdating, setStatusUpdating] = useState({});

  const emptyForm = { 
    name: "", price: "", image: "", description: "", category: "Chocolate", 
    badge: "", badgeColor: "badge-amber", prepTime: "", 
    sizes: { small: "", medium: "", large: "" }, 
    flavors: ["", "", ""], rating: 0, reviewCount: 0, 
    salePercent: 0, isAvailable: true 
  };
  const [cakeForm, setCakeForm] = useState(emptyForm);

  if (!state.user || state.user.role !== "admin") return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🚫</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Access Only</h2>
      <p style={{ color: "#78716C" }}>Sign in with an admin account to access the dashboard.</p>
    </div>
  );

  useEffect(() => {
    if (state.user?.role === "admin") {
      api.get("/orders/all").then(res => dispatch({ type: "SET_ORDERS", orders: res.data.data })).catch(console.log);
      api.get("/cakes?showAll=true").then(res => dispatch({ type: "SET_CAKES", cakes: res.data.data })).catch(console.log);
    }
  }, [state.user, tab]);

  useEffect(() => {
    if (!state.user || state.user.role !== "admin") return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.on("admin_new_order", () => { api.get("/orders/all").then(res => dispatch({ type: "SET_ORDERS", orders: res.data.data })); });
    socket.on("admin_update_order", () => { api.get("/orders/all").then(res => dispatch({ type: "SET_ORDERS", orders: res.data.data })); });
    return () => socket.disconnect();
  }, []);

  const revenue = state.orders.reduce((s, o) => s + (o.total || 0), 0);
  const stats = [
    { label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, icon: "💰", color: "#F59E0B" },
    { label: "Total Orders", value: state.orders.length, icon: "📦", color: "#60A5FA" },
    { label: "Total Cakes", value: state.cakes.length, icon: "🎂", color: "#A78BFA" },
    { label: "On Sale", value: state.cakes.filter(c => c.salePercent > 0).length, icon: "🏷️", color: "#34D399" },
  ];

  const applySale = async (cake) => {
    const pct = parseInt(saleInputs[cake._id || cake.id] ?? cake.salePercent ?? 0);
    if (isNaN(pct) || pct < 0 || pct > 90) { toast(dispatch, "Sale must be 0-90%", "error"); return; }
    try {
      await api.put(`/cakes/${cake._id || cake.id}`, { ...cake, salePercent: pct });
      const res = await api.get("/cakes?showAll=true");
      dispatch({ type: "SET_CAKES", cakes: res.data.data });
      toast(dispatch, pct === 0 ? "Sale removed." : `${pct}% sale applied!`);
    } catch {
      toast(dispatch, "Failed to apply sale", "error");
    }
  };

  const toggleAvail = async (cake) => {
    try {
      await api.put(`/cakes/${cake._id || cake.id}`, { ...cake, isAvailable: !cake.isAvailable });
      const res = await api.get("/cakes?showAll=true");
      dispatch({ type: "SET_CAKES", cakes: res.data.data });
      toast(dispatch, cake.isAvailable ? "Cake hidden from customers." : "Cake is now live!");
    } catch {
      toast(dispatch, "Failed to toggle availability", "error");
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    setStatusUpdating(s => ({ ...s, [orderId]: true }));
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      const res = await api.get("/orders/all");
      dispatch({ type: "SET_ORDERS", orders: res.data.data });
      toast(dispatch, `Order status updated.`, "info");
    } catch {
      toast(dispatch, "Failed to update order status", "error");
    } finally {
      setStatusUpdating(s => ({ ...s, [orderId]: false }));
    }
  };

  const openEdit = (cake) => { setEditCake(cake); setCakeForm({ ...cake, flavors: [...(cake.flavors || []), "", ""].slice(0, 3), sizes: { ...cake.sizes } }); setShowForm(true); };
  const openAdd = () => { setEditCake(null); setCakeForm(emptyForm); setShowForm(true); };

  const saveForm = async () => {
    try {
      const cake = { ...cakeForm, price: +cakeForm.price, rating: +cakeForm.rating || 0, reviewCount: +cakeForm.reviewCount || 0, salePercent: +cakeForm.salePercent || 0, sizes: { small: +cakeForm.sizes.small, medium: +cakeForm.sizes.medium, large: +cakeForm.sizes.large }, flavors: cakeForm.flavors.filter(f => f.trim()) };
      if (editCake) { await api.put(`/cakes/${editCake._id || editCake.id}`, cake); toast(dispatch, "Cake updated!", "info"); } 
      else { await api.post("/cakes", cake); toast(dispatch, "New cake added!"); }
      setShowForm(false);
      const res = await api.get("/cakes?showAll=true");
      dispatch({ type: "SET_CAKES", cakes: res.data.data });
    } catch (err) { toast(dispatch, "Failed to save cake", "error"); }
  };

  const deleteCake = async (id) => {
    try {
      await api.delete(`/cakes/${id}`);
      const res = await api.get("/cakes?showAll=true");
      dispatch({ type: "SET_CAKES", cakes: res.data.data });
      toast(dispatch, "Cake deleted.", "info");
    } catch { toast(dispatch, "Failed to delete", "error"); }
  };

  const statusBadgeClass = (s) => s === 3 ? "badge-green" : s === 2 ? "badge-blue" : s === 1 ? "badge-amber" : "badge-purple";

  return (
    <div className="fade-in" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass" style={{ padding: 32, borderRadius: 20, maxWidth: 400, width: "90%", textAlign: "center", border: "1px solid rgba(239,68,68,0.35)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Delete Cake?</h3>
            <p style={{ color: "#78716C", fontSize: 14, marginBottom: 28 }}>This action cannot be undone. The cake will be permanently removed.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} style={{ padding: "11px 24px", fontSize: 14 }}>Cancel</button>
              <button className="btn-danger" onClick={() => { deleteCake(deleteConfirm); setDeleteConfirm(null); }} style={{ padding: "11px 24px", fontSize: 14 }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
          <p className="section-subtitle">Manage your cakes and monitor orders</p>
        </div>
        <div className="badge badge-amber" style={{ fontSize: 13, padding: "6px 14px" }}>Admin Panel</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "rgba(245,158,11,0.05)", padding: 4, borderRadius: 12, border: "1px solid rgba(245,158,11,0.1)", width: "fit-content" }}>
        {[["overview", "Overview"], ["cakes", "Cakes"], ["orders", "Orders"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 22px", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", border: "none", background: tab === t ? "rgba(245,158,11,0.2)" : "transparent", color: tab === t ? "#F59E0B" : "#78716C", transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 11, color: "#78716C", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{s.label}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: s.color }}>{s.value}</div>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recent Order Activity</h3>
          <div className="glass" style={{ borderRadius: 16, overflow: "auto" }}>
            {state.orders.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "#78716C" }}>No orders yet</div>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {state.orders.slice(0, 5).map(o => (
                    <tr key={o._id || o.id}>
                      <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#F59E0B", fontWeight: 600 }}>{(o._id || o.id || "").slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name || "Customer"}</td>
                      <td style={{ fontWeight: 700, color: "#F59E0B" }}>₹{o.total}</td>
                      <td><span className={`badge ${statusBadgeClass(o.status)}`}>{ORDER_STATUSES[o.status]}</span></td>
                      <td style={{ color: "#78716C", fontSize: 13 }}>{new Date(o.createdAt || o.date || Date.now()).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* CAKES */}
      {tab === "cakes" && (
        <div className="fade-in">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button className="btn-primary" onClick={openAdd} style={{ padding: "11px 24px", fontSize: 15 }}>+ Add New Cake</button>
          </div>

          {showForm && (
            <div className="glass" style={{ padding: 32, borderRadius: 20, marginBottom: 28, border: "1px solid rgba(245,158,11,0.2)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>{editCake ? "Edit Cake" : "Add New Cake"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label className="form-label">Cake Name</label><input className="input" value={cakeForm.name} onChange={e => setCakeForm(f => ({ ...f, name: e.target.value }))} placeholder="Chocolate Truffle" /></div>
                <div><label className="form-label">Base Price (₹)</label><input className="input" type="number" value={cakeForm.price} onChange={e => setCakeForm(f => ({ ...f, price: e.target.value }))} placeholder="849" /></div>
                <div style={{ gridColumn: "1/-1" }}><label className="form-label">Image URL</label><input className="input" value={cakeForm.image} onChange={e => setCakeForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
                <div style={{ gridColumn: "1/-1" }}><label className="form-label">Description</label><textarea className="input" value={cakeForm.description} onChange={e => setCakeForm(f => ({ ...f, description: e.target.value }))} style={{ resize: "vertical", minHeight: 70 }} /></div>
                <div><label className="form-label">Category</label><select className="input" value={cakeForm.category} onChange={e => setCakeForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="form-label">Badge Label</label><input className="input" value={cakeForm.badge} onChange={e => setCakeForm(f => ({ ...f, badge: e.target.value }))} placeholder="Bestseller" /></div>
                <div><label className="form-label">Prep Time</label><input className="input" value={cakeForm.prepTime} onChange={e => setCakeForm(f => ({ ...f, prepTime: e.target.value }))} placeholder="2-3 hrs" /></div>
                <div><label className="form-label">Sale %</label><input className="input" type="number" min="0" max="90" value={cakeForm.salePercent} onChange={e => setCakeForm(f => ({ ...f, salePercent: e.target.value }))} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Available?</label>
                  <button type="button" onClick={() => setCakeForm(f => ({ ...f, isAvailable: !f.isAvailable }))} style={{ padding: "7px 18px", borderRadius: 20, border: `1px solid ${cakeForm.isAvailable ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.4)"}`, background: cakeForm.isAvailable ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", color: cakeForm.isAvailable ? "#34D399" : "#F87171", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{cakeForm.isAvailable ? "Available" : "Hidden"}</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn-primary" onClick={saveForm} style={{ padding: "12px 28px", fontSize: 15 }}>{editCake ? "Save Changes" : "Add Cake"}</button>
                <button className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: "12px 20px", fontSize: 14 }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="glass" style={{ borderRadius: 16, overflow: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>Cake</th><th>Category</th><th>Price</th><th>Sale %</th><th>Visibility</th><th>Actions</th></tr></thead>
              <tbody>
                {state.cakes.map(cake => {
                  const id = cake._id || cake.id;
                  const saleVal = saleInputs[id] !== undefined ? saleInputs[id] : (cake.salePercent || 0);
                  return (
                    <tr key={id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={cake.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                          <div><div style={{ fontSize: 14, fontWeight: 600 }}>{cake.name}</div><div style={{ fontSize: 11, color: "#78716C" }}>{cake.badge || "—"}</div></div>
                        </div>
                      </td>
                      <td><span className="badge badge-amber">{cake.category}</span></td>
                      <td><div style={{ fontWeight: 700, color: "#F59E0B" }}>₹{cake.price}</div></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="number" min="0" max="90" value={saleVal} onChange={e => setSaleInputs(s => ({ ...s, [id]: e.target.value }))} style={{ width: 55, padding: "5px 8px", background: "rgba(255,248,230,0.07)", border: "1px solid rgba(245,158,11,0.2)", color: "#FEF3C7", borderRadius: 6, fontSize: 13 }} />
                          <button onClick={() => applySale(cake)} className="btn-ghost" style={{ padding: "5px 8px", fontSize: 11, borderRadius: 6 }}>Set</button>
                        </div>
                      </td>
                      <td>
                        <button onClick={() => toggleAvail(cake)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${cake.isAvailable ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`, background: cake.isAvailable ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: cake.isAvailable ? "#34D399" : "#F87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{cake.isAvailable ? "Live" : "Hidden"}</button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(cake)} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13, borderRadius: 7 }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: 13, borderRadius: 7 }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="fade-in">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Order History ({state.orders.length} orders)</h2>
          <div className="glass" style={{ borderRadius: 16, overflow: "auto" }}>
            {state.orders.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#78716C" }}>No orders yet</div>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
                <tbody>
                  {state.orders.map(o => (
                    <tr key={o._id || o.id}>
                      <td style={{ color: "#F59E0B", fontWeight: 600, fontSize: 12 }}>{(o._id || o.id || "").slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name || "Customer"}</td>
                      <td style={{ fontSize: 13, color: "#A8A29E" }}>{o.items.map(i => i.name).join(", ").substring(0, 30)}...</td>
                      <td style={{ fontWeight: 700, color: "#F59E0B" }}>₹{o.total}</td>
                      <td><span className={`badge ${statusBadgeClass(o.status)}`}>{ORDER_STATUSES[o.status]}</span></td>
                      <td style={{ color: "#78716C", fontSize: 13 }}>{new Date(o.createdAt || o.date || Date.now()).toLocaleDateString("en-IN")}</td>
                      <td>
                        <select value={o.status} disabled={statusUpdating[o._id || o.id]} onChange={e => changeOrderStatus(o._id || o.id, parseInt(e.target.value))} style={{ background: "rgba(255,248,230,0.07)", border: "1px solid rgba(245,158,11,0.2)", color: "#FEF3C7", padding: "6px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                          {ORDER_STATUSES.map((s, i) => <option key={i} value={i} style={{ background: "#1C1209" }}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN APP
════════════════════════════════════════ */
export default function App() {
  useGlobalStyles();
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    api.get('/cakes').then(res => dispatch({ type: "SET_CAKES", cakes: res.data.data })).catch(() => dispatch({ type: "SET_CAKES", cakes: CAKES }));
    if(localStorage.getItem('cakeo_token')) {
      api.get('/auth/me').then(res => dispatch({ type: "LOGIN", user: res.data.data.user })).catch(() => localStorage.removeItem('cakeo_token'));
    }
  }, []);

  const renderPage = () => {
    switch (state.page) {
      case "home": return <HomePage />;
      case "cakes": return <CakesPage />;
      case "cake-detail": return <CakeDetailPage />;
      case "cart": return <CartPage />;
      case "checkout": return <CheckoutPage />;
      case "auth": return <AuthPage />;
      case "orders": return <OrdersPage />;
      case "admin": return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <AppCtx.Provider value={{ state, dispatch }}>
      <div className="app-bg">
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 64px)" }}>
          {renderPage()}
        </main>
        <Toast />
      </div>
    </AppCtx.Provider>
  );
}
