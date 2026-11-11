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

## 3. Wuxia Procedural Pixel Sprites (`dist/vendor/wuxia-sprites.js`)

* References & Inspiration:
  * Procedural layered pixel sprite techniques inspired by `zfedoran/pixel-sprite-generator` (`https://github.com/zfedoran/pixel-sprite-generator`, MIT License) and Liberated Pixel Cup (`https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator`, CC0 artwork layers).
* Local copy: `dist/vendor/wuxia-sprites.js`.
* License: MIT / CC0 1.0 Universal, retained in `dist/vendor/WuxiaUI-LICENSE.txt` and `dist/credits.html`.
* Usage: Renders distinct Wuxia pixel-art heroes (정파 청운검협, 사파 추혼자객, 마교 혈월마군) and 8 enemy archetypes (검수, 홍영장창병, 삿갓암기수, 흑의자객, 현철방패병, 혈마역사, 부적술사, 장로/선봉장) directly on the HTML5 2D Canvas without external image dependencies.
