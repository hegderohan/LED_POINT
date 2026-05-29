# LED Point — Showroom Catalogue

A fast, static catalogue site for LED Point. Customers browse products, build a cart, and send it to you as a WhatsApp enquiry. **There is no admin panel and no database** — your inventory lives in code. To change the site you edit a file and push; Netlify rebuilds automatically.

## Run it on your computer

You need [Node.js](https://nodejs.org) (LTS) installed once.

```bash
npm install      # first time only
npm run dev      # start a local preview at http://localhost:5173
npm run build    # produce the deployable site in /dist
```

## How to change your catalogue

Everything you'll touch day-to-day is in two files.

### 1. Products — `src/data/catalog.js`

This file *is* your inventory. Each product is one line:

```js
it("pendant", "Orbit Globe Pendant", "Philips", 4250, "1 × 18W E27", "Smoked-glass globe…", 18, "/products/orbit.jpg")
//   category    name                  brand      price  spec          description            stock  image (optional)
```

- **Add an item:** copy a line, change the values.
- **Remove an item:** delete its line.
- **Update price/stock:** edit the number.
- **`stock: 0`** automatically shows "Out of stock".
- The 12 categories are listed at the top of the same file if you need to add one.

### 2. Product images

Every item ships with a generated vector illustration at `public/products/<id>.svg`
(e.g. `L1005.svg`). These are original, licence-free placeholders styled to match the
site. Regenerate them any time (e.g. after adding items or changing colours) with:

```bash
node scripts/generate-images.mjs
```

**To use a real photo for an item:**

1. Drop the image into `public/products/` (e.g. `orbit.jpg`).
2. Set the item's last `it(...)` argument to `"/products/orbit.jpg"` — a real path
   always overrides the generated illustration.

If a referenced image is ever missing or fails to load, the card automatically falls
back to the category icon, so nothing ever shows as broken. Compress photos before
committing (aim for under ~200 KB, ~1000px wide) to keep the site fast.

### 3. Shop details — `src/config.js`

Your shop name, location, GSTIN, GST rate, brand list, theme, and — importantly — your **WhatsApp number**. Set `whatsapp` to your number in international digits-only format (e.g. `919812345678`). This is where customer enquiries are sent.

## Going live (Netlify, free)

1. Push this folder to a **GitHub** repository.
2. In [Netlify](https://app.netlify.com): **Add new site → Import from Git**, pick the repo.
3. Netlify reads `netlify.toml` automatically (build `npm run build`, publish `dist`). Click **Deploy**.
4. You get a live `https://<name>.netlify.app` URL. Add a custom domain later in **Domain settings**.

After that, **every `git push` to your main branch rebuilds and republishes the site in ~1-2 minutes.** That is the entire update workflow: edit `catalog.js` → commit → push → live.

## Why this setup

- **Inventory in code = only you can change it.** Editing requires push access to the repo; there is no public admin screen to secure.
- **No server or database** to run, pay for, or maintain — it's a static site, free to host, and fast.
- **Version controlled.** Every price change is in git history, so you can always see what changed and roll back.

When editing-by-code starts to feel slow (e.g. staff need to update prices from their phones, or you want live stock counts), the same product data can be moved into a database with an admin panel without rebuilding the site — see `LED-Point-Build-Plan.md` in the parent folder.

## Project structure

```
index.html              # page shell, loads fonts + icons
netlify.toml            # build/deploy config
public/products/        # your product photos go here
src/
  config.js             # shop name, WhatsApp number, theme, brands
  data/catalog.js       # YOUR INVENTORY (products + categories)
  App.jsx               # app shell, cart state, navigation
  main.jsx              # entry point
  styles.css            # all styling (4 themes × light/dark)
  components/
    primitives.jsx      # Icon, Money, Tile, Stepper
    Catalog.jsx         # catalogue feed, product cards, detail view
    Cart.jsx            # enquiry cart + WhatsApp quote
```
