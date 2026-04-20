# App Icons & Splash Screen

## Overview

Three image assets cover all required icon slots across iOS and Android.
All share the same ballroom-dancing theme: silver `#BABABA` silhouette on a
deep-red `#b80000` background.

| Asset | File | Size | Background |
|-------|------|------|------------|
| Main icon | `assets/icon.png` | 1024 × 1024 | red (opaque) |
| Android adaptive foreground | `assets/adaptive-icon.png` | 1024 × 1024 | transparent |
| Splash emblem | `assets/splash-icon.png` | 512 × 512 | transparent |

SVG sources live alongside the PNGs (`assets/*.svg`) and are the files to edit
when the design changes.

---

## How Expo uses them

```
app.json
├── expo.icon                          → icon.png  (iOS all sizes, Android fallback)
├── expo.splash.image                  → splash-icon.png
├── expo.splash.backgroundColor        → "#b80000"
└── expo.android.adaptiveIcon
    ├── foregroundImage                → adaptive-icon.png
    └── backgroundColor               → "#b80000"
```

**iOS** — Expo generates every required size (20 pt … 1024 pt, 1× / 2× / 3×)
from `icon.png` automatically during prebuild. No manual size variants are needed.

**Android < 8 (API 25)** — falls back to `icon.png`, displayed as a plain square.

**Android ≥ 8 (API 26)** — uses the adaptive icon system: the OS composites the
transparent `adaptive-icon.png` foreground over the `#b80000` background and
applies its own shape mask (circle, squircle, etc.).

**Splash** — the `splash-icon.png` emblem is centered over the solid `#b80000`
background (`resizeMode: "contain"`).

---

## Regenerating the PNGs

The PNGs are produced with ImageMagick inside the running `ddev-coaches2-web`
container (local ImageMagick is broken — missing X11 libs).

```bash
# Copy SVGs into the container
docker cp assets/icon.svg          ddev-coaches2-web:/tmp/icon.svg
docker cp assets/adaptive-icon.svg ddev-coaches2-web:/tmp/adaptive-icon.svg
docker cp assets/splash-icon.svg   ddev-coaches2-web:/tmp/splash-icon.svg

# Convert
docker exec ddev-coaches2-web convert -background none /tmp/icon.svg          /tmp/icon.png
docker exec ddev-coaches2-web convert -background none /tmp/adaptive-icon.svg /tmp/adaptive-icon.png
docker exec ddev-coaches2-web convert -background none /tmp/splash-icon.svg   /tmp/splash-icon.png

# Copy PNGs back
docker cp ddev-coaches2-web:/tmp/icon.png          assets/icon.png
docker cp ddev-coaches2-web:/tmp/adaptive-icon.png assets/adaptive-icon.png
docker cp ddev-coaches2-web:/tmp/splash-icon.png   assets/splash-icon.png
```

After updating any asset, a full native rebuild is required:

```bash
npx expo prebuild --clean && npx expo run:ios
```

---

## Adaptive icon safe zone

Android crops the adaptive icon with a shape mask. Only the inner 66 % of the
image is guaranteed to be visible. The `adaptive-icon.svg` wraps its content in
`<g transform="translate(137,115) scale(0.73)">` to keep the couple and
sparkles inside the safe zone.

---

## Key files

| File | Role |
|------|------|
| `assets/icon.svg` | SVG source for the main icon (red background) |
| `assets/adaptive-icon.svg` | SVG source for the Android adaptive foreground (transparent) |
| `assets/splash-icon.svg` | SVG source for the splash emblem (transparent) |
| `assets/icon.png` | Generated PNG — do not edit directly |
| `assets/adaptive-icon.png` | Generated PNG — do not edit directly |
| `assets/splash-icon.png` | Generated PNG — do not edit directly |
| `app.json` | References all three PNGs under `expo.icon`, `expo.splash`, `expo.android.adaptiveIcon` |
