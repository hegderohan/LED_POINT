/* Led Point — app shell, state, navigation.
   Catalogue is read from src/data/catalog.js (code-based inventory).
   No admin panel: products change only when you edit the code and push. */
import React from "react";
import { Icon, fmt } from "./components/primitives.jsx";
import { Catalog, ItemDetail } from "./components/Catalog.jsx";
import { CartPanel, QuoteSummary } from "./components/Cart.jsx";
import { CATEGORIES, ITEMS } from "./data/catalog.js";
import { SITE_CONFIG } from "./config.js";

const DENSITY = { Compact: "210px", Regular: "248px", Large: "294px" };

function useStored(key, initial) {
  const [v, setV] = React.useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch (e) { return initial; }
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }, [key, v]);
  return [v, setV];
}

export default function App() {
  const products = ITEMS; // inventory lives in code; no runtime editing

  const [cart, setCart] = useStored("lp_cart_v1", {});          // {id: qty}
  const [customer, setCustomer] = useStored("lp_customer_v1", { name: "", phone: "" });
  const [theme, setTheme] = useStored("lp_theme_v1", SITE_CONFIG.theme);

  const [search, setSearch] = React.useState("");
  const [cartOpen, setCartOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [showQuote, setShowQuote] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const gstRate = +SITE_CONFIG.gstRate || 0;

  // apply theme + direction + density to root
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-dir", String(SITE_CONFIG.direction).toLowerCase());
    r.setAttribute("data-theme", String(theme).toLowerCase());
    r.style.setProperty("--card-min", DENSITY[SITE_CONFIG.density] || DENSITY.Regular);
  }, [theme]);

  const toastTimer = React.useRef();
  const flash = (msg) => {
    setToast(msg); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1900);
  };

  // cart helpers
  const productById = React.useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const items = Object.keys(cart).map((id) => ({ p: productById[id], qty: cart[id] })).filter((r) => r.p);
  const count = items.reduce((s, r) => s + r.qty, 0);
  const total = items.reduce((s, r) => s + r.p.price * r.qty, 0) * (1 + gstRate / 100);

  const add = (p) => { setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 })); flash("Added to enquiry"); };
  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => { const q = (c[id] || 0) - 1; const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });
  const removeItem = (id) => setCart((c) => { const n = { ...c }; delete n[id]; return n; });
  const clearCart = () => setCart({});

  const startNew = () => { clearCart(); setShowQuote(false); setCartOpen(false); setCustomer({ name: "", phone: "" }); };

  return (
    <div className="app">
      <header className="topnav">
        <div className="brand">
          <div className="brand-mark"><Icon name="lightbulb" size={21} stroke={1.9} /></div>
          <div>
            <div className="brand-name">{SITE_CONFIG.shopName}</div>
            <div className="brand-sub">{SITE_CONFIG.tagline}</div>
          </div>
        </div>
        <div className="nav-spacer" />
        <div className="searchbox">
          <Icon name="search" size={17} stroke={1.8} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lights, brands…" />
          {search && <button className="rm" style={{ border: "none", background: "none", color: "var(--text-mute)" }} onClick={() => setSearch("")}><Icon name="x" size={15} /></button>}
        </div>
        <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} stroke={1.8} />
        </button>
        <button className="cart-pill" onClick={() => setCartOpen(true)}>
          <Icon name="shopping-cart" size={17} stroke={1.9} />
          {count > 0 ? <>₹{fmt(total)}</> : "Enquiry"}
          <span className="count">{count}</span>
        </button>
      </header>

      <Catalog
        products={products} categories={CATEGORIES}
        search={search} cart={cart} onAdd={add} onDec={dec} onInc={inc}
        onOpen={setSelected}
      />

      <div className="scrim" data-on={cartOpen} onClick={() => setCartOpen(false)} />
      <CartPanel
        open={cartOpen} items={items} gstRate={gstRate} customer={customer} setCustomer={setCustomer}
        onClose={() => setCartOpen(false)} onDec={dec} onInc={inc} onRemove={removeItem} onClear={clearCart}
        onCheckout={() => { if (items.length) setShowQuote(true); }}
      />

      <ItemDetail
        p={selected} qty={selected ? (cart[selected.id] || 0) : 0}
        onClose={() => setSelected(null)} onAdd={(p) => add(p)} onDec={() => dec(selected.id)} onInc={() => inc(selected.id)}
      />

      <QuoteSummary open={showQuote} items={items} gstRate={gstRate} customer={customer}
        onClose={() => setShowQuote(false)} onNew={startNew} />

      <div className="toast" data-on={!!toast}><span className="dot" />{toast}</div>
    </div>
  );
}
