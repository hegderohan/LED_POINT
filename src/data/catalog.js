/* ============================================================
   LED POINT — catalogue (the single source of truth)

   THIS FILE IS YOUR INVENTORY. To change the live site:
     1. Edit the items below (add / remove / update).
     2. Commit and push to GitHub.
     3. Netlify rebuilds and your changes go live in ~1-2 minutes.

   Each item is created with:
     it(category, name, brand, price, watt, desc, stock, image)

   - category : one of the CATEGORIES ids below (e.g. "pendant")
   - price    : number in ₹ (no symbol, no commas)
   - watt     : short spec string (e.g. "36W · 4000K")
   - stock    : units on hand (0 = shows "Out of stock")
   - image    : OPTIONAL photo path, e.g. "/products/aurora.jpg"
                If left blank, the item uses its generated illustration
                at /products/<id>.svg (run: node scripts/generate-images.mjs).
                A real photo path always overrides the illustration.
   ============================================================ */

// category: id, label, icon (lucide name), tint (for tile glow tint)
export const CATEGORIES = [
  { id: "chandeliers", label: "Chandeliers",       icon: "gem",          tint: "warm" },
  { id: "pendant",     label: "Pendant Lights",    icon: "lamp-ceiling", tint: "warm" },
  { id: "hanging",     label: "Hanging Lights",    icon: "lamp-ceiling", tint: "warm" },
  { id: "panels",      label: "LED Panels",        icon: "square-stack", tint: "cool" },
  { id: "surface",     label: "Surface Lights",    icon: "disc-3",       tint: "cool" },
  { id: "wall",        label: "Wall Lights",       icon: "lamp-wall-up", tint: "warm" },
  { id: "flood",       label: "Flood Lights",      icon: "flashlight",   tint: "cool" },
  { id: "outdoor",     label: "Outdoor Lights",    icon: "lamp-floor",   tint: "cool" },
  { id: "smart",       label: "Smart Bulbs",       icon: "lightbulb",    tint: "accent" },
  { id: "strip",       label: "Rope & Strip",      icon: "waves",        tint: "accent" },
  { id: "fans",        label: "Fans",              icon: "fan",          tint: "cool" },
  { id: "switches",    label: "Switches & Plates", icon: "toggle-right", tint: "cool" },
];

// helper to build an item
let n = 0;
function it(category, name, brand, price, watt, desc, stock, image = "") {
  n += 1;
  const id = "L" + String(1000 + n);
  return {
    id,
    category,
    name,
    brand,
    price, // ₹ unit price
    watt,  // spec string
    desc,  // short description
    stock, // units on hand
    // Default: the generated illustration for this item. Pass a real path
    // (e.g. "/products/aurora.jpg") as the last argument to override it.
    image: image || "/products/" + id + ".svg",
  };
}

export const ITEMS = [
  // Chandeliers
  it("chandeliers", "Aurora 8-Arm Crystal Chandelier", "Philips", 28500, "8 × 40W E14", "Hand-cut K9 crystal drops, brushed chrome frame. Statement piece for double-height foyers.", 4),
  it("chandeliers", "Helix Ring LED Chandelier", "Havells", 41999, "180W LED · 3000K", "Three concentric acrylic rings with seamless warm-white diffusion. App-dimmable.", 2),
  it("chandeliers", "Mirage Sputnik Chandelier", "Wipro", 18750, "12 × 25W G9", "Mid-century sputnik in matte gold. Twelve frosted globes on radiating arms.", 6),
  it("chandeliers", "Cascade Linear Dining Chandelier", "Crompton", 32400, "90W LED · 2700K", "Linear suspension of 9 graduated glass teardrops over a 1.2m bar.", 3),

  // Pendant
  it("pendant", "Orbit Globe Pendant", "Philips", 4250, "1 × 18W E27", "Smoked-glass globe with antique brass cap. Adjustable 1.5m cord.", 18),
  it("pendant", "Nordic Dome Pendant", "Syska", 2899, "15W LED · 4000K", "Matte black spun-metal dome, perfect over kitchen islands. Price per piece.", 24),
  it("pendant", "Lumen Cone Pendant", "Wipro", 3499, "12W LED · 3000K", "Slim ribbed cone in sage green with gold interior reflector.", 15),
  it("pendant", "Halo Acrylic Pendant", "Havells", 5650, "24W LED · CCT", "Frosted acrylic halo with tunable white. Touch CCT switch on canopy.", 9),

  // Hanging
  it("hanging", "Lantern Cage Hanging Light", "Anchor", 1999, "1 × 40W E27", "Industrial iron cage lantern in black. Edison-bulb ready.", 30),
  it("hanging", "Tiered Bell Cluster", "Orient", 7800, "3 × 18W E27", "Cluster of three coloured-glass bells at staggered heights.", 7),
  it("hanging", "Rattan Drum Hanging Light", "Bajaj", 4400, "1 × 22W E27", "Natural woven-rattan drum shade. Warm, diffused boho glow.", 11),

  // LED Panels
  it("panels", "SlimEdge Recessed Panel 2×2", "Philips", 1850, "36W · 4000K", "595×595mm edge-lit recessed panel. Flicker-free, 120lm/W.", 60),
  it("panels", "SlimEdge Recessed Panel 1×4", "Havells", 2150, "40W · 6500K", "295×1195mm panel for offices and retail. Cool daylight.", 40),
  it("panels", "BackLit Round Panel 12\"", "Wipro", 1290, "24W · CCT", "Surface round back-lit panel with tunable white and memory.", 55),
  it("panels", "BackLit Square Panel 8\"", "Syska", 899, "18W · 3000K", "Slim surface square panel, warm white. Ideal for corridors.", 80),

  // Surface
  it("surface", "Spectra Surface Downlight 6\"", "Crompton", 749, "15W · CCT", "Trimless surface mount, 3-CCT selectable. Anti-glare lens.", 90),
  it("surface", "Spectra Surface Downlight 4\"", "Polycab", 549, "9W · 4000K", "Compact surface puck for false ceilings. Neutral white.", 120),
  it("surface", "Gimbal Surface Spot", "Philips", 1150, "12W · 3000K", "Tiltable surface spotlight in white. 24° beam for accent work.", 35),

  // Wall
  it("wall", "Sconce Up-Down Wall Light", "Havells", 2450, "2 × 6W LED", "Aluminium up-down sconce, IP54. Architectural wall wash.", 22),
  it("wall", "Arc Reading Wall Lamp", "Wipro", 3200, "8W LED · 3000K", "Adjustable arc bedside wall lamp with USB-C port.", 14),
  it("wall", "Frosted Glass Wall Bracket", "Bajaj", 1399, "1 × 18W E27", "Classic frosted-glass cylinder bracket in brushed nickel.", 28),

  // Flood
  it("flood", "TitanFlood Outdoor 100W", "Bajaj", 2899, "100W · 6500K", "Die-cast aluminium IP66 floodlight. 13000lm for facades & yards.", 25),
  it("flood", "TitanFlood Outdoor 50W", "Halonix", 1499, "50W · 6500K", "Compact IP66 flood for signage and parking. Toughened glass.", 38),
  it("flood", "Stadium Beam Flood 200W", "Surya", 5499, "200W · 5700K", "High-mast grade flood with 110° symmetric optics.", 8),

  // Outdoor
  it("outdoor", "Bollard Garden Post 600mm", "Philips", 4650, "12W · 3000K", "Powder-coated bollard for pathways. IP65, warm glow.", 16),
  it("outdoor", "Gate Pillar Lantern", "Anchor", 2199, "1 × 15W E27", "Vintage pillar-top lantern in weatherproof black.", 20),
  it("outdoor", "Solar Wall Pack", "Syska", 1799, "Solar · 6500K", "Self-charging solar wall pack with motion + dusk sensor.", 33),

  // Smart
  it("smart", "Smart WiFi Bulb 9W RGB", "Syska", 749, "9W · RGB+CCT", "16M colours, app + voice control, scenes & schedules. B22.", 100),
  it("smart", "Smart WiFi Bulb 12W RGB", "Wipro", 949, "12W · RGB+CCT", "Brighter Garnet smart bulb with music sync. E27.", 70),
  it("smart", "Smart Strip Controller", "Philips", 1299, "Controller", "WiZ controller for any 24V strip. Voice + app, no hub.", 26),
  it("smart", "Smart GU10 Spot 5W", "Havells", 699, "5W · CCT", "Tunable smart spotlight for track & recessed fittings.", 44),

  // Strip
  it("strip", "Neon Flex Rope 5m Warm", "Polycab", 1650, "12V · 3000K", "Silicone neon-flex rope, bendable, IP65. Per 5m reel.", 48),
  it("strip", "COB Strip 5m 24V", "Crompton", 2100, "24V · 4000K", "Dotless COB strip, 480 LED/m. Cuttable, with adhesive back.", 36),
  it("strip", "RGB Strip Kit 5m", "Syska", 1199, "12V · RGB", "RGB strip with remote, controller and adaptor. Starter kit.", 52),

  // Fans
  it("fans", "AeroGlide BLDC Ceiling Fan", "Crompton", 3499, "28W BLDC", "5-star BLDC fan with remote. 1200mm sweep, 350 RPM.", 30),
  it("fans", "Lumos Fan with Light", "Orient", 4699, "32W + 18W LED", "Ceiling fan with integrated dimmable LED ring. Remote + CCT.", 18),
  it("fans", "Breeze Wall Fan 400mm", "Bajaj", 2299, "55W", "High-speed oscillating wall fan with 3-speed pull cord.", 24),

  // Switches
  it("switches", "Modular Switch 1-Way (4 pcs)", "Anchor", 320, "6A · 240V", "Roma-series modular 1-way switches. Pack of 4. Plate sold separately.", 200),
  it("switches", "Touch Dimmer Module", "Legrand", 1450, "400W max", "Capacitive touch dimmer for incandescent & dimmable LED.", 40),
  it("switches", "8-Module Cover Plate", "Schneider", 690, "8M", "Glossy white 8-module cover plate with metal grid frame.", 60),
  it("switches", "Smart Switch 2-Gang", "Wipro", 1899, "WiFi · 2G", "Retrofit smart switch, app + voice, no neutral needed.", 28),
];
