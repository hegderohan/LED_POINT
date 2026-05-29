/* ============================================================
   Generates a clean vector illustration (SVG) for every catalogue
   item, into public/products/<id>.svg.

   These are original, licence-free placeholders styled to match the
   site. To use a real photo for an item instead, drop the file in
   public/products/ and set that item's `image` in src/data/catalog.js
   (a real path overrides the generated one).

   Re-run any time with:  node scripts/generate-images.mjs
   ============================================================ */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ITEMS } from "../src/data/catalog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "products");
mkdirSync(OUT, { recursive: true });

const INK = "#2b2620";
const HUE = {
  chandeliers: 38, pendant: 34, hanging: 28, panels: 210, surface: 205,
  wall: 30, flood: 214, outdoor: 206, smart: 280, strip: 168, fans: 202, switches: 198,
};
const hsl = (h, s, l, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

// Each art fn returns inner SVG drawn with the shared <g> (fill:none, stroke:ink).
// Elements set their own fill to add accent colour. `acc` is the per-item accent.
const ART = {
  chandeliers: (ink, acc) => `
    <line x1="160" y1="34" x2="240" y2="34"/>
    <line x1="200" y1="34" x2="200" y2="74"/>
    <circle cx="200" cy="86" r="13"/>
    <path d="M190 86 C150 98 120 122 112 152"/>
    <path d="M210 86 C250 98 280 122 288 152"/>
    <path d="M194 98 C178 120 164 134 152 152"/>
    <path d="M206 98 C222 120 236 134 248 152"/>
    <line x1="200" y1="99" x2="200" y2="152"/>
    <circle cx="112" cy="160" r="9" fill="${acc}"/>
    <circle cx="152" cy="160" r="9" fill="${acc}"/>
    <circle cx="200" cy="160" r="9" fill="${acc}"/>
    <circle cx="248" cy="160" r="9" fill="${acc}"/>
    <circle cx="288" cy="160" r="9" fill="${acc}"/>`,
  pendant: (ink, acc) => `
    <line x1="186" y1="30" x2="214" y2="30"/>
    <line x1="200" y1="30" x2="200" y2="92"/>
    <path d="M142 152 A60 60 0 0 1 258 152"/>
    <line x1="142" y1="152" x2="258" y2="152"/>
    <circle cx="200" cy="168" r="11" fill="${acc}"/>`,
  hanging: (ink, acc) => `
    <line x1="200" y1="28" x2="200" y2="66"/>
    <line x1="170" y1="74" x2="230" y2="74"/>
    <path d="M168 74 v92 a8 8 0 0 0 8 8 h48 a8 8 0 0 0 8 -8 v-92"/>
    <line x1="186" y1="76" x2="186" y2="172"/>
    <line x1="214" y1="76" x2="214" y2="172"/>
    <circle cx="200" cy="124" r="14" fill="${acc}"/>`,
  panels: (ink, acc) => `
    <rect x="118" y="92" width="164" height="116" rx="18"/>
    <rect x="142" y="116" width="116" height="68" rx="10" fill="${acc}" fill-opacity="0.28"/>
    <circle cx="132" cy="106" r="3.5" fill="${ink}"/>
    <circle cx="268" cy="106" r="3.5" fill="${ink}"/>
    <circle cx="132" cy="194" r="3.5" fill="${ink}"/>
    <circle cx="268" cy="194" r="3.5" fill="${ink}"/>`,
  surface: (ink, acc) => `
    <line x1="116" y1="74" x2="284" y2="74"/>
    <rect x="170" y="64" width="60" height="22" rx="11"/>
    <circle cx="200" cy="85" r="10" fill="${acc}"/>
    <path d="M188 94 L150 204 L250 204 L212 94 Z" fill="${acc}" fill-opacity="0.16" stroke="none"/>`,
  wall: (ink, acc) => `
    <line x1="118" y1="44" x2="118" y2="244"/>
    <path d="M118 130 L160 144 L118 60 Z" fill="${acc}" fill-opacity="0.16" stroke="none"/>
    <path d="M118 158 L160 144 L118 228 Z" fill="${acc}" fill-opacity="0.16" stroke="none"/>
    <rect x="118" y="128" width="42" height="32" rx="8"/>`,
  flood: (ink, acc) => `
    <rect x="138" y="92" width="112" height="74" rx="10"/>
    <line x1="162" y1="92" x2="162" y2="166"/>
    <line x1="194" y1="92" x2="194" y2="166"/>
    <line x1="226" y1="92" x2="226" y2="166"/>
    <rect x="180" y="166" width="28" height="12" rx="3"/>
    <line x1="194" y1="178" x2="194" y2="214"/>
    <line x1="168" y1="214" x2="220" y2="214"/>
    <path d="M256 110 L330 96 M256 130 L336 130 M256 150 L330 164" stroke="${acc}"/>`,
  outdoor: (ink, acc) => `
    <line x1="120" y1="232" x2="280" y2="232"/>
    <rect x="184" y="86" width="32" height="146" rx="15"/>
    <rect x="184" y="102" width="32" height="24" rx="2" fill="${acc}" fill-opacity="0.6"/>`,
  smart: (ink, acc) => `
    <path d="M200 66 a54 54 0 0 1 38 92 q-8 8 -9 20 h-58 q-1 -12 -9 -20 a54 54 0 0 1 38 -92 Z"/>
    <path d="M182 182 h36 M188 196 h24"/>
    <circle cx="128" cy="120" r="7" fill="hsl(0, 80%, 60%)"/>
    <circle cx="146" cy="78" r="7" fill="hsl(130, 70%, 50%)"/>
    <circle cx="272" cy="120" r="7" fill="hsl(225, 85%, 62%)"/>
    <circle cx="254" cy="78" r="7" fill="${acc}"/>`,
  strip: (ink, acc) => `
    <path d="M64 168 q42 -64 84 0 t84 0 t84 0"/>
    <path d="M64 188 q42 -64 84 0 t84 0 t84 0"/>
    <circle cx="106" cy="150" r="6" fill="${acc}"/>
    <circle cx="190" cy="150" r="6" fill="${acc}"/>
    <circle cx="274" cy="150" r="6" fill="${acc}"/>
    <circle cx="148" cy="206" r="6" fill="${acc}"/>
    <circle cx="232" cy="206" r="6" fill="${acc}"/>`,
  fans: (ink, acc) => {
    const blade = `<path d="M0 0 q72 -12 90 -56 q-48 6 -90 40 Z" fill="${acc}" fill-opacity="0.18"/>`;
    return `
    <g transform="translate(200 150)">
      <g transform="rotate(0)">${blade}</g>
      <g transform="rotate(90)">${blade}</g>
      <g transform="rotate(180)">${blade}</g>
      <g transform="rotate(270)">${blade}</g>
      <circle cx="0" cy="0" r="17"/>
      <circle cx="0" cy="0" r="5" fill="${ink}"/>
    </g>`;
  },
  switches: (ink, acc) => `
    <rect x="150" y="76" width="100" height="148" rx="16"/>
    <rect x="176" y="110" width="48" height="80" rx="10" fill="${acc}" fill-opacity="0.22"/>
    <line x1="176" y1="150" x2="224" y2="150"/>
    <circle cx="200" cy="92" r="3.5" fill="${ink}"/>
    <circle cx="200" cy="208" r="3.5" fill="${ink}"/>`,
  _default: (ink, acc) => `
    <circle cx="200" cy="138" r="46" fill="${acc}" fill-opacity="0.18"/>
    <path d="M180 184 h40 M186 198 h28 M192 212 h16"/>`,
};

function svgFor(item, idxInCat) {
  const base = HUE[item.category] ?? 210;
  const off = [-16, -4, 10, 22, -10, 16][idxInCat % 6];
  const gh = base + off;
  const acc = hsl(gh, 88, 58);
  const art = (ART[item.category] || ART._default)(INK, acc);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" role="img" aria-label="${item.name.replace(/"/g, "&quot;")}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="hsl(${base}, 42%, 97%)"/>
      <stop offset="1" stop-color="hsl(${base}, 46%, 87%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0" stop-color="${hsl(gh, 88, 62, 0.5)}"/>
      <stop offset="0.55" stop-color="${hsl(gh, 88, 62, 0.12)}"/>
      <stop offset="1" stop-color="${hsl(gh, 88, 62, 0)}"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <rect width="400" height="300" fill="url(#glow)"/>
  <g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    ${art.trim()}
  </g>
</svg>`;
}

const seen = {};
let count = 0;
for (const item of ITEMS) {
  const i = (seen[item.category] = (seen[item.category] || 0) + 1) - 1;
  writeFileSync(join(OUT, item.id + ".svg"), svgFor(item, i));
  count++;
}
console.log("generated " + count + " SVGs into public/products/");
