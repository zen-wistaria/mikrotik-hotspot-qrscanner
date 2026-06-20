# Mikrotik Hotspot QR Scanner — CLAUDE.md

## Project Overview

QR Code scanner page for MikroTik Hotspot login. Single-page app — scan QR voucher codes via camera atau upload gambar.

Nama package: `hotspot_template_by_zen` (sama kayak `mikrotik_hotspot`, beda proyek).

**Theme:** Retro modern monochrome (black & white) — match `mikrotik_hotspot`. Font Orbitron, zero neon colors.

## Tech Stack

- **Runtime:** Bun (npm also works)
- **Styling:** Tailwind CSS 3
- **Linting/Formatting:** Biome (`biome.json`)
- **Module:** ESM (`"type": "module"`)
- **Library:** Html5Qrcode (built into `src/js/qrcode.js`, 375KB)
- **JS Minifier:** UglifyJS
- **HTML Minifier:** html-minifier-terser
- **Font:** Orbitron Medium (WOFF2, offline di `src/fonts/orbitron-medium.woff2`)

## Project Structure

```
mikrotik-hotspot-qrscanner/
├── src/
│   ├── index.html          # Source HTML (with @config, @if directives)
│   ├── css/
│   │   ├── input.css       # Tailwind input + @font-face Orbitron + keyframes
│   │   └── style.css       # Compiled Tailwind
│   ├── js/
│   │   └── qrcode.js       # Html5Qrcode library (375KB — DO NOT MODIFY)
│   └── fonts/
│       └── orbitron-medium.woff2  # Orbitron font (6.6KB)
├── index.html              # Built output (overwritten by build)
├── css/                    # Built CSS output
├── js/                     # Built JS output
├── config.json             # Text content config (single page)
├── config.json.zen         # Personal config variant
├── config.json.arnet       # Personal config variant
├── build.js                # Build pipeline (RESULT_DIR = './')
├── dev.js                  # Dev server (BrowserSync)
├── scripts/genconfig.js    # Config generator
├── tailwind.config.js
├── biome.json
├── package.json
├── README.md
└── CLAUDE.md               # This file
```

### Key Structure Difference from `mikrotik_hotspot`

**Build output goes to root (`RESULT_DIR = './'`), NOT to `results/`!** — built files overwrite the original `index.html`, `css/style.{hash}.css`, `js/qrcode.{hash}.js` directly. The source is in `src/`.

## Config (`config.json`)

Single section: `qrcode`. Contains:
- `meta.title` / `meta.description` — SEO
- `title` / `description` — page heading
- `button.*` — button labels (switchCam, startCam, stopCam, backToLogin, openChrome)
- `text.scanFromFile` — drag & upload label
- `notifications.*` — all notification messages (success, error, info)
- `footer` — footer text

## Dev Workflow

```bash
bun install          # Install deps
bun genconfig        # Generate config.json (first time)
bun dev              # Dev server :3000 + BrowserSync + Tailwind watch
bun run build        # Build — overwrites root index.html, css/, js/
```

Build pipeline:
1. Clean root `css/` and `js/` dirs (except `src/`)
2. Build Tailwind → minify → hash (`style.{hash}.css`)
3. Minify `src/js/qrcode.js` → hash (`qrcode.{hash}.js`)
4. Process `src/index.html`: config directives → minify → write to root `index.html`
5. Copy `src/css/*`, `src/js/*` to root (other assets)

## Theme — Retro Modern Monochrome

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `bg-white` | `bg-black` |
| Card wrapper | `border border-black bg-white` | `border border-white bg-black` |
| Primary btn | `bg-black text-white hover:bg-gray-900` | `bg-white text-black hover:bg-gray-200` |
| Secondary btn | `border border-black text-black hover:bg-black hover:text-white` | `border border-white text-white hover:bg-white hover:text-black` |
| Camera buttons | secondary style (border) | same |
| Drop zone | `border-2 border-dashed border-black` | `border-2 border-dashed border-white` |
| Scan line | `bg-black` | `bg-white` |
| Text muted | `text-gray-500` | `text-gray-400` |
| SVG icons | `text-current` or `text-black` | `text-current` or `text-white` |
| Error | `text-red-600 border-red-500` | `text-red-400 border-red-500` |
| Font | `font-orbitron` | same |

## Page Features

- Live camera QR scanning (Html5Qrcode)
- File upload / drag-drop QR image
- Camera switching (front/back)
- Open-in-Chrome button for Android
- Auto-redirect when valid hotspot login URL detected
- Dark/light theme toggle (monochrome SVG icons: sun/moon)
- Notification system with dedup — SVG icons instead of emoji (checkmark, X, warning, info)

## Important Notes for Claude

- **`src/js/qrcode.js`** is the Html5Qrcode library (375KB) — DO NOT modify or read
- `build.js` RESULT_DIR = `'./'` — build OVERWRITES root files
- Config template directives `@config('key')` dan `@if(config.cond)` — same engine as `mikrotik_hotspot`
- This is a SINGLE-PAGE app — only `index.html`
- Cached files (`style.{hash}.css`, `qrcode.{hash}.css`) in root are gitignored by `.gitignore`
- Source is in `src/index.html`, not `index.html`
- Font Orbitron dari `src/fonts/orbitron-medium.woff2` — 1 weight only (Medium 500), ~6.6KB
- `tailwind.config.js` — no custom colors, only `fontFamily.orbitron` dan animations
- `src/css/input.css` — minimal: `@tailwind` directives + `@font-face` + keyframes (fadeInUp, float)
- Theme JS inline di `src/index.html` — body class references: `bg-white`/`bg-black`, `text-black`/`text-white`
- Notification SVG icons in JS: success (check circle), error (X circle), warning (triangle), info (info circle) — all `stroke="currentColor"` biar adaptif warna

## Code Quality

- `npx biome check --write .` — lint & format
- indent: 2 spaces, quotes: single (JS), double (JSX)
