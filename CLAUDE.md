# Mikrotik Hotspot QR Scanner — CLAUDE.md

## Project Overview

QR Code scanner page for MikroTik Hotspot login. Single-page app — scan QR voucher codes via camera atau upload gambar.

Nama package: `hotspot_template_by_zen` (sama kayak `mikrotik_hotspot`, beda proyek).

## Tech Stack

- **Runtime:** Bun (npm also works)
- **Styling:** Tailwind CSS 3
- **Linting/Formatting:** Biome (`biome.json`)
- **Module:** ESM (`"type": "module"`)
- **Library:** Html5Qrcode (built into `src/js/qrcode.js`, 375KB)
- **JS Minifier:** UglifyJS
- **HTML Minifier:** html-minifier-terser

## Project Structure

```
mikrotik-hotspot-qrscanner/
├── src/
│   ├── index.html          # Source HTML (with @config, @if directives)
│   ├── css/
│   │   ├── input.css       # Tailwind input
│   │   └── style.css       # Compiled Tailwind
│   └── js/
│       └── qrcode.js       # Html5Qrcode library (375KB — DO NOT MODIFY)
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

## Page Features

- Live camera QR scanning (Html5Qrcode)
- File upload / drag-drop QR image
- Camera switching (front/back)
- Open-in-Chrome button for Android
- Auto-redirect when valid hotspot login URL detected
- Dark/light theme toggle
- Notification system with dedup

## Important Notes for Claude

- **`src/js/qrcode.js`** is the Html5Qrcode library (375KB) — DO NOT modify or read
- `build.js` RESULT_DIR = `'./'` — build OVERWRITES root files
- Config template directives `@config('key')` dan `@if(config.cond)` — same engine as `mikrotik_hotspot`
- This is a SINGLE-PAGE app — only `index.html`
- Cached files (`style.{hash}.css`, `qrcode.{hash}.css`) in root are gitignored by `.gitignore`
- Source is in `src/index.html`, not `index.html`
- Same `config.json` template engine (processConfigDirectives, processIfDirectives) as the hotspot template

## Code Quality

- `npx biome check --write .` — lint & format
- indent: 2 spaces, quotes: single (JS), double (JSX)
