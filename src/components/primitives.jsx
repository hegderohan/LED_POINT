/* Shared primitives: Icon (Lucide), Money, Tile, Stepper */
import React from "react";
import { CATEGORIES } from "../data/catalog.js";

/* ---- Lucide icon → cached SVG string (avoids React/Lucide DOM conflicts) ---- */
const _iconCache = {};
function lucideSVG(name) {
  if (_iconCache[name]) return _iconCache[name];
  if (!window.lucide || !window.lucide.createIcons) return "";
  const tmp = document.createElement("div");
  tmp.style.cssText = "position:absolute;left:-9999px;top:0;";
  tmp.innerHTML = '<i data-lucide="' + name + '"></i>';
  document.body.appendChild(tmp);
  try { window.lucide.createIcons(); } catch (e) {}
  const svg = tmp.querySelector("svg");
  const out = svg ? svg.outerHTML : "";
  document.body.removeChild(tmp);
  if (out) _iconCache[name] = out; // only cache successful results
  return out;
}

export function Icon({ name, size = 18, stroke, className, style }) {
  let s = lucideSVG(name);
  if (s) {
    s = s.replace(/width="\d+"/, 'width="' + size + '"')
         .replace(/height="\d+"/, 'height="' + size + '"');
    if (stroke) s = s.replace(/stroke-width="[\d.]+"/, 'stroke-width="' + stroke + '"');
  }
  return (
    <span
      className={"ic " + (className || "")}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{ __html: s }}
    />
  );
}

/* ---- Currency (Indian formatting) ---- */
const _inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
export function fmt(n) { return _inr.format(Math.round(n)); }
export function Money({ value, className, style }) {
  return (
    <span className={"price " + (className || "")} style={style}>
      <span className="cur">₹</span>{fmt(value)}
    </span>
  );
}

/* ---- category → icon + glow tint ---- */
export const TINT = {
  warm: "rgba(255,176,84,.22)",
  cool: "rgba(104,168,255,.22)",
  accent: "var(--accent-soft)",
};
export function catMeta(catId) {
  return CATEGORIES.find((c) => c.id === catId) || { icon: "lightbulb", tint: "accent", label: catId };
}

/* ---- glowing product visual (shows photo when `image` is set + loads, else icon) ---- */
export function Tile({ catId, size = "card", stock, image }) {
  const m = catMeta(catId);
  const glow = TINT[m.tint] || TINT.accent;
  // If a photo is missing or fails to load, fall back to the category icon.
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [image]);
  const showImg = image && !failed;
  const img = <img className="tile-img" src={image} alt="" loading="lazy" onError={() => setFailed(true)} />;

  if (size === "mini") {
    return (
      <span className="mini" style={{ "--tile-glow": glow }}>
        {showImg ? img : <Icon name={m.icon} size={22} stroke={1.6} />}
      </span>
    );
  }
  if (size === "m") {
    return (
      <span className="m-mini">
        {showImg ? img : <Icon name={m.icon} size={20} stroke={1.6} />}
      </span>
    );
  }
  const low = stock !== undefined && stock > 0 && stock <= 5;
  const out = stock === 0;
  return (
    <div className="tile" style={{ "--tile-glow": glow }}>
      {stock !== undefined && (
        <span className="stock-tag" data-low={low} data-out={out}>
          {out ? "Out of stock" : low ? stock + " left" : "In stock"}
        </span>
      )}
      {showImg ? img : <span className="glyph"><Icon name={m.icon} size={34} stroke={1.5} /></span>}
    </div>
  );
}

/* ---- quantity stepper ---- */
export function Stepper({ value, onDec, onInc }) {
  return (
    <div className="stepper" onClick={(e) => e.stopPropagation()}>
      <button onClick={onDec} aria-label="Decrease"><Icon name="minus" size={15} /></button>
      <span className="q">{value}</span>
      <button onClick={onInc} aria-label="Increase"><Icon name="plus" size={15} /></button>
    </div>
  );
}
