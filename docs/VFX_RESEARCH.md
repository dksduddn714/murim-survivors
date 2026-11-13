# GitHub effect research — 2026-11-13

This update reviewed source/licensing and integration costs of six repositories. No remote scripts, unverified sprites, or gallery fonts are loaded at runtime.

| Repository | Inspection / decision |
|---|---|
| https://github.com/patch-gg/pixelfx | MIT. Selected. Ported tilted-ellipse `onArc`, crescent sweep/tail timing and 3×5 `GLYPHS` to a bounded Canvas2D renderer. |
| https://github.com/drawcall/Proton | MIT. Already bundled particle engine; retained pooling and bounded sparks. No second particle engine added. |
| https://github.com/pixijs-userland/particle-emitter | MIT. Evaluated configuration-driven emitters; would require Pixi infrastructure for a Canvas2D game, not bundled. |
| https://github.com/kittykatattack/dust | MIT. Evaluated particle recipes; legacy Pixi API dependency, not bundled. |
| https://github.com/jeremyckahn/shifty | MIT. Evaluated tweening; the few needed easing functions did not justify an additional runtime. Not bundled. |
| https://github.com/Tiddybub/2d-assets | Asset catalogue/reference only. Collection-level assertions do not establish individual asset provenance. No files copied. |

## Exact imported source
- PixelFx revision: `5294518ce7c72e48b6100a744596e0acf57f2826`.
- `src/fx/melee/sword-slash.js`: onArc and crescent timing/shape adapted to segmented Canvas polygons; no pixel shader/actor implementation copied.
- `src/fx/arcane/_lib.js`: original 3×5 rune bitmap array copied; Canvas draw helper adapted. Other shaders/sprites not copied.
- Local modified adapter: `dist/vendor/jianghu-fx.js`.
- MIT copyright notices for Patch and Hugo Duprez retained in `dist/vendor/PixelFx-LICENSE.txt`, credits and portable export.
- PixelFx gallery font is excluded. This uses bitmap glyph matrices, not a font file.

Gameplay recipes, target budgets, event timing, world layering and adaptive detail in `dist/links.js` are game-specific. The imported visual math does not alter damage or collision. PixelFx's full gallery/engine is not installed.
