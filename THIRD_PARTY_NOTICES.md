# Third-party notices

## 1. Proton 7.1.5 (bundled build header)

* Upstream: https://github.com/drawcall/Proton
* Pinned revision: `b4fdef5e5416d70a788978bec0fb4a1be26514b4`
* Imported file: `build/proton.min.js`.
* Local copy: `dist/vendor/proton.min.js` (upstream build with a trailing newline).
* License: MIT, retained in `dist/vendor/Proton-LICENSE.txt` and in the build header.
* Usage: Proton emitter, particle pool and integration drive skill sparks/trails. The world-space renderer, wuxia skill shapes, lightning paths and gameplay are project-specific code in `dist/vfx.js`.
* The optional source map is not shipped. No remote CDN or runtime download is required.

Local SHA-256: `e45b52fa4411a37c8b98810d23548bce960eb6dd4b8116153bdf2aafbacffb48`

## 2. Wuxia UI & Pixel Icon Pack (`dist/vendor/wuxia-ui-pack.js`)

* References & Inspiration:
  * Kenney UI Pack / Pixel UI Pack (`https://kenney.nl`, `https://kenney-assets.itch.io/ui-pack`) — CC0 1.0 Universal (Public Domain Dedication)
  * PixelArtIcons 24x24 Grid Conventions (`https://github.com/halfmage/pixelarticons`) — MIT License
* Local copy: `dist/vendor/wuxia-ui-pack.js` and `dist/vendor/WuxiaUI-LICENSE.txt`.
* License: CC0 1.0 Universal / MIT License, retained in `dist/vendor/WuxiaUI-LICENSE.txt` and `dist/credits.html`.
* Usage: Provides offline-bundled 24x24 pixel-wuxia SVG icons for the 12 martial arts skills and 6 dual-5★ fusion ultimates, jade-plaque / bamboo-scroll UI frame styling, Ultimate recipe progress calculation, and battlefield pressure state formatting.

## 3. C-style character renderer

- `dist/vendor/wuxia-sprites.js` is project-authored pixel art and rendering code, replacing the earlier procedural character renderer in v1.3.
- License: MIT. No external sprite sheet or third-party artwork is embedded.
- Uses integer-grid drawing and cached animation frames for 12 heroes and 8 enemy roles across 3 factions.

## 4. Reference samples (not in-game actors)

The files in `dist/samples/` are displayed only in `art-samples.html` to compare styles.
- Pixel-Boy and AAA: Ninja Adventure; original author declares CC0 at https://pixel-boy.itch.io/ninja-adventure-asset-pack ; repository https://github.com/pixel-boy/NinjaAdventure
- Shade: Puny character family. The player sheet is a modified redistribution from blackopsrepl/grim-delver under its `game/assets/shade_puny/LICENSE.md` CC0 declaration. Original https://merchant-shade.itch.io/16x16-puny-characters
- Pixel-Boy / Sparklin Labs: Superpowers Medieval Fantasy; CC0 root LICENSE.txt.
- Kenney: Tiny Dungeon tileset, redistribution giobi/sgravoquest-assets; CC0 per original https://kenney.nl/assets/tiny-dungeon

Exact source paths and Git blob hashes: `dist/samples/sources.json`. CC0 text and source notes are bundled. No LPC or SpriteCook images are included.

## v1.9 original assets

`dist/assets/peddler.png`: generated specifically for this project with OpenAI image generation; not a third-party downloaded sprite pack. Prompt: friendly chibi traveling wuxia bundle peddler, straw hat, teal patched tunic, indigo bundle, scrolls and medicine gourd, transparent pixel-art sprite. Used as a static in-world character with a small idle bob. ItemArt in `jianghu.js` is original code-drawn pixel artwork. Procedural BGM in `sound.js` uses local oscillator synthesis and no sampled or licensed recording.

`dist/assets/medicine-gourd.png` (v1.10): newly generated for this project with OpenAI image generation. Prompt: single traditional jade ceramic double-lobed medicine gourd, red cloth stopper and gold cord, transparent chunky pixel-art inventory icon, no medical cross. Used as the heal pickup and shop icon. Not an externally downloaded asset.

## PixelFx adapted helpers (v1.11)

- Source: https://github.com/patch-gg/pixelfx at `5294518ce7c72e48b6100a744596e0acf57f2826`.
- Adapted `src/fx/melee/sword-slash.js` (tilted ellipse and crescent timing; upstream credits Hugo Duprez's Sprite Fusion slash) and copied `src/fx/arcane/_lib.js` GLYPHS (original rune matrices).
- MIT: Copyright (c) 2026 Patch; Copyright (c) 2026 Hugo Duprez. Full text `dist/vendor/PixelFx-LICENSE.txt`.
- Local modified helper `dist/vendor/jianghu-fx.js`. The gallery font and other artwork are not included.
- User-supplied v1.8.9 pixel goods/peddler drawing retained in `dist/vendor/latest-pixel-items.js`.
