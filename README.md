# Periodic Table 3D

An interactive 3D periodic table. All 118 elements are extruded tiles on a
backplane; clicking one zooms in, swings open a flap in the tile face, and
takes you inside to an animated Bohr-model atom surrounded by the element's
full property data. Built per [PROMPT.md](PROMPT.md) with
TypeScript + Vite + Three.js.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

`npm run data` regenerates `src/data/elements.json` from the raw datasets in
`scripts/raw/`.

## Controls

- **Table**: fixed frontal view. Scroll/pinch zooms toward the cursor so you can
  inspect a tile up close; the view eases back to center as you zoom out.
  Hover a tile for a tooltip; click/tap it to enter the element.
- **Inside an element**: drag to orbit the atom, right-drag (or two-finger
  drag) to pan, scroll/pinch to zoom. Panning is leashed so the atom stays
  reachable. **Exit** button (top-left) or `Esc` leaves the element.
- **Settings** (gear, top-right): tile finish (glossy / matte / metallic /
  satin), board material (wood / plastic), background (black / white), tile
  colors (category / monochrome), sound on/off. Settings persist in
  localStorage.

The "Periodic Table" title is extruded 3D lettering inlaid into the board — the
letter bases sit below the board surface and a flattened copy underneath acts
as a contact shadow, so the type reads as part of the board rather than
floating above it.

On narrow (portrait) screens the element data appears in a scrollable bottom
sheet instead of floating 3D panels, and bloom/particles are reduced.

## Data sources

- [Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON)
  (CC-BY-SA) — masses, shells, electron configurations, thermochemistry,
  phases, summaries.
- [PubChem periodic table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/)
  (public domain) — oxidation states, atomic radii, discovery years.
- Hand-compiled supplemental table in `scripts/build-elements.mjs` — thermal
  conductivity, electrical conductivity, Mohs hardness, Young's modulus,
  covalent radii. Unknown values render as "—".

Neutron counts are derived as `round(atomic mass) − Z` (most common isotope).

## Mint assets

Generated with Mint and registered in `mint-assets.json`
(files under `public/assets/mint/`):

- Four sound effects — zoom whoosh, flap open/close, ambience loop.
- Two board PBR materials (base color / normal / roughness maps) under the
  logical keys `wood-board` and `plastic-board`, switchable from settings.

Generation chat: https://mint.gg/chat/ph76n7ch019xqejam5y83sz1h18bdg19

The 3D title uses the Helvetiker typeface bundled with three.js
(`public/fonts/`, see the license file there).
