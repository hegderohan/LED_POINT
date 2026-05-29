/* Catalog: scrolling feed (hero → about → category shelves) + scroll-spy rail */
import React from "react";
import { Icon, Money, Tile, Stepper, catMeta, TINT } from "./primitives.jsx";
import { SITE_CONFIG } from "../config.js";

function CategoryRail({ categories, counts, active, onJump }) {
  const overviewOn = active === "hero" || active === "about";
  return (
    <aside className="rail">
      <div className="rail-title">Browse</div>
      <button className="cat" data-on={overviewOn} onClick={() => onJump("hero")}>
        <span className="cat-ic"><Icon name="house" size={17} stroke={1.6} /></span>
        <span className="cat-n">Overview</span>
      </button>
      <div className="rail-title" style={{ paddingTop: 14 }}>Categories</div>
      {categories.map((c) => (
        <button key={c.id} className="cat" data-on={active === c.id} onClick={() => onJump(c.id)}>
          <span className="cat-ic"><Icon name={c.icon} size={17} stroke={1.6} /></span>
          <span className="cat-n">{c.label}</span>
          <span className="cat-c">{counts[c.id] || 0}</span>
        </button>
      ))}
    </aside>
  );
}

function ProductCard({ p, qty, onAdd, onDec, onInc, onOpen, idx }) {
  const out = p.stock === 0;
  return (
    <div className="card" style={idx != null ? { "--i": idx } : null} onClick={() => onOpen(p)}>
      <Tile catId={p.category} stock={p.stock} image={p.image} />
      <div className="card-body">
        <div className="card-brand">{p.brand}</div>
        <div className="card-name">{p.name}</div>
        <div className="card-spec"><Icon name="zap" size={13} stroke={1.7} />{p.watt}</div>
        <div className="card-foot">
          <Money value={p.price} />
          {qty > 0 ? (
            <Stepper value={qty} onDec={onDec} onInc={onInc} />
          ) : (
            <button className="add-btn" disabled={out} onClick={(e) => { e.stopPropagation(); onAdd(p); }}>
              <Icon name={out ? "ban" : "plus"} size={15} stroke={2} />{out ? "Out" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CatSection({ cat, items, cart, onAdd, onDec, onInc, onOpen }) {
  const shelfRef = React.useRef(null);
  const by = (dir) => { const el = shelfRef.current; if (el) el.scrollBy({ left: dir * 580, behavior: "smooth" }); };
  return (
    <section className="cat-section" data-sec={cat.id} data-screen-label={cat.label}>
      <div className="cat-section-head">
        <div className="ttl">
          <span className="ic"><Icon name={cat.icon} size={24} stroke={1.5} /></span>
          <div>
            <h2>{cat.label}</h2>
            <div className="sub">{items.length} {items.length === 1 ? "product" : "products"} on display</div>
          </div>
        </div>
        <div className="shelf-nav">
          <button onClick={() => by(-1)} aria-label="Scroll left"><Icon name="chevron-left" size={20} /></button>
          <button onClick={() => by(1)} aria-label="Scroll right"><Icon name="chevron-right" size={20} /></button>
        </div>
      </div>
      <div className="shelf" ref={shelfRef}>
        {items.map((p, i) => (
          <ProductCard key={p.id} p={p} idx={i} qty={cart[p.id] || 0}
            onAdd={onAdd} onDec={() => onDec(p.id)} onInc={() => onInc(p.id)} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

export function ItemDetail({ p, qty, onClose, onAdd, onDec, onInc }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => { setImgFailed(false); }, [p && p.image]);
  if (!p) return null;
  const m = catMeta(p.category);
  const out = p.stock === 0;
  const showImg = p.image && !imgFailed;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-scrim" />
      <div className="modal" style={{ width: 520 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "relative" }}>
          <button className="icon-btn" style={{ position: "absolute", top: 14, right: 14, zIndex: 3 }} onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
          <div className="tile" style={{ height: 230, "--tile-glow": (TINT[m.tint] || TINT.accent), borderRadius: "var(--r-lg) var(--r-lg) 0 0" }}>
            <span className="stock-tag" data-low={p.stock > 0 && p.stock <= 5} data-out={out}>
              {out ? "Out of stock" : p.stock <= 5 ? p.stock + " left" : "In stock · " + p.stock}
            </span>
            {showImg ? (
              <img className="tile-img" src={p.image} alt={p.name} onError={() => setImgFailed(true)} />
            ) : (
              <span className="glyph" style={{ width: 110, height: 110, borderRadius: 28 }}>
                <Icon name={m.icon} size={50} stroke={1.4} />
              </span>
            )}
          </div>
        </div>
        <div className="receipt-body" style={{ padding: "20px 24px 6px" }}>
          <div className="card-brand">{p.brand} · {m.label}</div>
          <h3 style={{ fontSize: 22, margin: "8px 0 10px", lineHeight: 1.25 }}>{p.name}</h3>
          <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
          <div style={{ display: "flex", gap: 22, margin: "18px 0 4px", flexWrap: "wrap" }}>
            <div>
              <div className="muted" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>Specs</div>
              <div className="flex gap8" style={{ marginTop: 6, fontWeight: 600 }}><Icon name="zap" size={15} stroke={1.7} />{p.watt}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>Item code</div>
              <div style={{ marginTop: 6, fontWeight: 600 }}>{p.id}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px 24px" }}>
          <Money value={p.price} style={{ fontSize: 28 }} />
          {qty > 0 ? (
            <div className="flex gap8">
              <Stepper value={qty} onDec={onDec} onInc={onInc} />
              <button className="btn btn-ghost btn-sm" onClick={onClose}>Done</button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" disabled={out} onClick={() => onAdd(p)}>
              <Icon name="shopping-cart" size={16} stroke={2} />Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGrid({ list, search, cart, onAdd, onDec, onInc, onOpen }) {
  return (
    <main className="products">
      <div className="products-head">
        <div>
          <h2>Search results</h2>
          <div className="meta">{list.length} {list.length === 1 ? "product" : "products"} for “{search}”</div>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <span className="ic"><Icon name="search-x" size={28} stroke={1.6} /></span>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-dim)", fontSize: 16 }}>No products found</div>
            <div style={{ marginTop: 4 }}>Try another search term.</div>
          </div>
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} qty={cart[p.id] || 0}
              onAdd={onAdd} onDec={() => onDec(p.id)} onInc={() => onInc(p.id)} onOpen={onOpen} />
          ))}
        </div>
      )}
    </main>
  );
}

export function Catalog({ products, categories, search, cart, onAdd, onDec, onInc, onOpen }) {
  const feedRef = React.useRef(null);
  const [activeSec, setActiveSec] = React.useState("hero");
  const searching = search.trim().length > 0;

  const counts = React.useMemo(() => {
    const c = {};
    categories.forEach((cat) => { c[cat.id] = products.filter((p) => p.category === cat.id).length; });
    return c;
  }, [products, categories]);

  const sections = React.useMemo(
    () => categories.map((cat) => ({ cat, items: products.filter((p) => p.category === cat.id) })).filter((s) => s.items.length),
    [products, categories]
  );

  // scroll-spy + left→right reveal
  React.useEffect(() => {
    if (searching) return;
    const root = feedRef.current;
    if (!root) return;
    const shelves = [...root.querySelectorAll(".shelf")];
    if (!("IntersectionObserver" in window)) {
      shelves.forEach((s) => s.classList.add("in-view"));
      return;
    }
    const secs = [...root.querySelectorAll("[data-sec]")];
    const spy = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSec(e.target.getAttribute("data-sec")); }); },
      { root, rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    secs.forEach((s) => spy.observe(s));
    const reveal = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); reveal.unobserve(e.target); } }); },
      { root, threshold: 0.12 }
    );
    shelves.forEach((s) => reveal.observe(s));
    return () => { spy.disconnect(); reveal.disconnect(); };
  }, [sections, searching]);

  const jump = (id) => {
    const root = feedRef.current;
    const el = root && root.querySelector('[data-sec="' + id + '"]');
    if (el) root.scrollTo({ top: el.offsetTop - 6, behavior: "smooth" });
  };

  let searchList = [];
  if (searching) {
    const q = search.toLowerCase();
    searchList = products.filter((p) => (p.name + " " + p.brand + " " + p.watt).toLowerCase().includes(q));
  }

  return (
    <div className="catalog">
      <CategoryRail categories={categories} counts={counts} active={searching ? "" : activeSec} onJump={jump} />
      {searching ? (
        <SearchGrid list={searchList} search={search} cart={cart} onAdd={onAdd} onDec={onDec} onInc={onInc} onOpen={onOpen} />
      ) : (
        <main className="feed" ref={feedRef}>
          <section className="hero" data-sec="hero" data-screen-label="Overview">
            <div className="eyebrow">{SITE_CONFIG.shopName} · {SITE_CONFIG.location}</div>
            <h1>Every light your space could ask for.</h1>
            <p className="lede">From statement chandeliers to everyday panels, browse the full showroom collection — curated across twelve categories and the brands you trust.</p>
            <div className="scroll-cue"><span className="ic"><Icon name="chevron-down" size={18} /></span>Scroll to explore the showroom</div>
          </section>

          <section className="about" data-sec="about">
            <h2>One showroom. Beautifully organised.</h2>
            <p className="lede">{SITE_CONFIG.shopName} brings lighting and electricals for homes, offices and the outdoors together under one roof in {SITE_CONFIG.location}. Scroll through each category to see what’s on display, build a cart, and send us an enquiry in seconds.</p>
            <div className="brandrow">
              {SITE_CONFIG.brands.map((b) => <span key={b}>{b}</span>)}
            </div>
          </section>

          {sections.map(({ cat, items }) => (
            <CatSection key={cat.id} cat={cat} items={items} cart={cart}
              onAdd={onAdd} onDec={onDec} onInc={onInc} onOpen={onOpen} />
          ))}
        </main>
      )}
    </div>
  );
}
